#!/usr/bin/env node
/**
 * geocode_schools.js — Google Geocoding API로 학교별 정확한 좌표 보정
 *
 * 사용법:
 *   node geocode_schools.js              # 모든 시도 처리
 *   node geocode_schools.js B10          # 특정 시도만
 *   node geocode_schools.js B10 C10 D10  # 여러 시도
 *
 * 출력:
 *   - kmeal-app/data/school_coords_corrected.json  (영구 캐시)
 *   - kmeal-app/data/schools-{office}.json         (lat/lng 보정)
 */
const fs = require('fs');
const path = require('path');

const KEY = process.env.GMAPS_KEY || 'AIzaSyBpEN79WD3IRpzZ9LngdW-IKVYCImlmEPo';
const DATA_DIR = path.join(__dirname, 'kmeal-app', 'data');
const CACHE_FILE = path.join(DATA_DIR, 'school_coords_corrected.json');

const CONCURRENCY = 20;
const RETRIES = 2;
const HAVERSINE_KM = (a, b, c, d) => {
  const R = 6371, toRad = x => x * Math.PI / 180;
  const dLat = toRad(c - a), dLng = toRad(d - b);
  const x = Math.sin(dLat/2)**2 + Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

function loadCache() {
  if (!fs.existsSync(CACHE_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8')); } catch { return {}; }
}
function saveCache(c) { fs.writeFileSync(CACHE_FILE, JSON.stringify(c, null, 0)); }

async function geocode(address, name, retries = RETRIES) {
  // 1차: 도로명 주소 + 학교명 (정확도 ↑)
  const queries = [
    `${address} ${name}`,
    address,
    `${name} ${address.split(' ').slice(0, 3).join(' ')}`,
  ];
  for (const q of queries) {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&region=kr&language=ko&key=${KEY}`;
    for (let i = 0; i <= retries; i++) {
      try {
        const r = await fetch(url);
        const j = await r.json();
        if (j.status === 'OK' && j.results?.[0]?.geometry?.location) {
          const loc = j.results[0].geometry.location;
          const types = j.results[0].types || [];
          // ROOFTOP / RANGE_INTERPOLATED만 신뢰 (GEOMETRIC_CENTER는 동 단위 폴백)
          const accuracy = j.results[0].geometry.location_type;
          return { lat: loc.lat, lng: loc.lng, accuracy, types, query: q };
        }
        if (j.status === 'OVER_QUERY_LIMIT') {
          await new Promise(r => setTimeout(r, 1500));
          continue;
        }
        if (j.status === 'ZERO_RESULTS') break; // 다음 query로
      } catch (e) {
        if (i === retries) console.warn('  fetch err:', e.message);
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }
  return null;
}

async function processOffice(office, cache) {
  const file = path.join(DATA_DIR, `schools-${office}.json`);
  if (!fs.existsSync(file)) { console.log(`  skip (no file): ${office}`); return; }
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  const items = Array.isArray(raw) ? raw : (raw.items || raw.schools || []);
  if (!items.length) return;
  console.log(`\n[${office}] ${items.length}개 학교 처리 시작`);

  let fixed = 0, kept = 0, failed = 0, cached = 0;
  let i = 0;
  const total = items.length;

  async function worker() {
    while (i < total) {
      const idx = i++;
      const s = items[idx];
      if (!s.code || !s.addr) { failed++; continue; }
      const ckey = String(s.code);
      let res = cache[ckey];
      if (res) {
        cached++;
      } else {
        res = await geocode(s.addr, s.name);
        if (res) {
          cache[ckey] = { ...res, name: s.name, addr: s.addr, ts: Date.now() };
        } else {
          cache[ckey] = { failed: true, ts: Date.now() };
        }
      }
      if (res && !res.failed) {
        const dKm = (s.lat && s.lng) ? HAVERSINE_KM(s.lat, s.lng, res.lat, res.lng) : 999;
        // ROOFTOP/RANGE_INTERPOLATED만 적용. GEOMETRIC_CENTER는 동 중심 폴백이라 부정확
        const accurate = res.accuracy === 'ROOFTOP' || res.accuracy === 'RANGE_INTERPOLATED';
        if (accurate && dKm > 0.3) {
          s.lat = res.lat; s.lng = res.lng; s._src = 'gmaps:' + res.accuracy;
          fixed++;
        } else {
          kept++;
        }
      } else {
        failed++;
      }
      if ((idx+1) % 100 === 0) {
        process.stdout.write(`  ${idx+1}/${total} (보정 ${fixed} / 유지 ${kept} / 캐시 ${cached} / 실패 ${failed})\r`);
        saveCache(cache); // 100개마다 캐시 백업
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  process.stdout.write('\n');
  console.log(`  완료: 보정 ${fixed} · 유지 ${kept} · 캐시히트 ${cached} · 실패 ${failed}`);
  saveCache(cache);

  // 원본 형식 유지하며 저장
  const out = Array.isArray(raw) ? items : { ...raw, items };
  fs.writeFileSync(file, JSON.stringify(out));
  console.log(`  저장: ${file}`);
}

async function main() {
  const args = process.argv.slice(2);
  const allOffices = ['B10','C10','D10','E10','F10','G10','H10','I10','J10','K10','M10','N10','P10','Q10','R10','S10','T10'];
  const offices = args.length ? args : allOffices;

  console.log(`Google Geocoding API · ${offices.length}개 시도 처리`);
  console.log(`캐시: ${CACHE_FILE}`);
  const cache = loadCache();
  console.log(`기존 캐시 항목: ${Object.keys(cache).length}\n`);

  const t0 = Date.now();
  for (const office of offices) {
    await processOffice(office, cache);
  }
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\n전체 완료 · ${sec}초 · 캐시 ${Object.keys(cache).length}건`);
}

main().catch(err => { console.error(err); process.exit(1); });

// 한국 17개 시도 학교 좌표 빌더 v2
// 전략: NEIS(완전한 학교 목록) ↔ OSM(좌표) 병합 → 누락 학교는 Nominatim 지오코딩
// 결과: kmeal-app/data/schools-{officeCode}.json
const https = require('https');
const fs = require('fs');
const path = require('path');

const NEIS_KEY = 'dd9c4f1cf6da4ffb92fe6101e188c14e';

const PROVINCES = [
  { code:'B10', name:'서울특별시',     altName:'Seoul' },
  { code:'C10', name:'부산광역시',     altName:'Busan' },
  { code:'D10', name:'대구광역시',     altName:'Daegu' },
  { code:'E10', name:'인천광역시',     altName:'Incheon' },
  { code:'F10', name:'광주광역시',     altName:'Gwangju' },
  { code:'G10', name:'대전광역시',     altName:'Daejeon' },
  { code:'H10', name:'울산광역시',     altName:'Ulsan' },
  { code:'I10', name:'세종특별자치시', altName:'Sejong' },
  { code:'J10', name:'경기도',         altName:'Gyeonggi-do' },
  { code:'K10', name:'강원특별자치도', altName:'강원도' },
  { code:'M10', name:'충청북도',       altName:'Chungcheongbuk-do' },
  { code:'N10', name:'충청남도',       altName:'Chungcheongnam-do' },
  { code:'P10', name:'전북특별자치도', altName:'전라북도' },
  { code:'Q10', name:'전라남도',       altName:'Jeollanam-do' },
  { code:'R10', name:'경상북도',       altName:'Gyeongsangbuk-do' },
  { code:'S10', name:'경상남도',       altName:'Gyeongsangnam-do' },
  { code:'T10', name:'제주특별자치도', altName:'제주도' },
];

// ─────────────────────────────────────────────────────────
// 유틸
// ─────────────────────────────────────────────────────────
function getJSON(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'kmeal-app-builder/2.0', ...headers } }, (res) => {
      let d = '';
      res.on('data', x => d += x);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { resolve(null); }
      });
    }).on('error', reject);
  });
}

function postOverpass(query) {
  const postData = 'data=' + encodeURIComponent(query);
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'overpass-api.de',
      path: '/api/interpreter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length,
        'User-Agent': 'kmeal-app-builder/2.0',
      },
    }, (res) => {
      let d = '';
      res.on('data', x => d += x);
      res.on('end', () => {
        try { resolve(JSON.parse(d)); } catch (e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(postData); req.end();
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// 학교명 정규화 (매칭용)
function normalizeName(s) {
  if (!s) return '';
  return String(s)
    .replace(/\s+/g, '')
    .replace(/(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)/g, '')
    .replace(/(공립|사립|국립)/g, '')
    .replace(/[()（）\[\]【】]/g, '')
    .toLowerCase();
}

// ─────────────────────────────────────────────────────────
// NEIS — 학교 목록 (이름·종류·도로명주소)
// ─────────────────────────────────────────────────────────
async function fetchNeisSchools(officeCode) {
  const all = [];
  for (let page = 1; page <= 10; page++) {
    const url = `https://open.neis.go.kr/hub/schoolInfo?KEY=${NEIS_KEY}&Type=json&pIndex=${page}&pSize=1000&ATPT_OFCDC_SC_CODE=${officeCode}`;
    const j = await getJSON(url);
    const rows = j?.schoolInfo?.[1]?.row || [];
    if (!rows.length) break;
    all.push(...rows);
    if (rows.length < 1000) break;
    await sleep(300);
  }
  return all.map(s => ({
    code: s.SD_SCHUL_CODE,
    office: s.ATPT_OFCDC_SC_CODE,
    name: s.SCHUL_NM,
    kind: s.SCHUL_KND_SC_NM,
    addr: s.ORG_RDNMA || '',
  }));
}

// ─────────────────────────────────────────────────────────
// OSM — 학교 좌표 (Overpass API)
// ─────────────────────────────────────────────────────────
async function fetchOsmSchools(provinceName, altName) {
  const queries = [
    `[out:json][timeout:120];(area["name:ko"="${provinceName}"];area["name"="${provinceName}"];)->.s;(node["amenity"="school"](area.s);way["amenity"="school"](area.s););out center tags;`,
  ];
  if (altName) {
    queries.push(`[out:json][timeout:120];(area["name:ko"="${altName}"];area["name"="${altName}"];)->.s;(node["amenity"="school"](area.s);way["amenity"="school"](area.s););out center tags;`);
  }
  const merged = new Map();
  for (const q of queries) {
    try {
      const j = await postOverpass(q);
      (j?.elements || []).forEach(e => {
        const name = e.tags?.name;
        if (!name) return;
        const lat = e.lat ?? e.center?.lat;
        const lng = e.lon ?? e.center?.lon;
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        const key = normalizeName(name);
        if (!merged.has(key)) merged.set(key, { name, lat, lng });
      });
      await sleep(2000);
    } catch (e) { /* skip */ }
  }
  return merged;
}

// ─────────────────────────────────────────────────────────
// Nominatim — 주소 → 좌표 (OSM 누락 학교 보강용)
// ─────────────────────────────────────────────────────────
async function geocodeNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=kr&q=${encodeURIComponent(query)}`;
  const r = await getJSON(url, { 'Accept-Language': 'ko' });
  if (Array.isArray(r) && r.length) {
    const it = r[0];
    const lat = parseFloat(it.lat), lng = parseFloat(it.lon);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return [lat, lng];
  }
  return null;
}

// ─────────────────────────────────────────────────────────
// 메인 빌드
// ─────────────────────────────────────────────────────────
function makeCode(office, name, lat, lng) {
  let h = 0;
  const s = office + name + (lat || 0).toFixed(4) + (lng || 0).toFixed(4);
  for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
  return office + h.toString().padStart(7, '0').slice(0, 7);
}

async function buildOne(prov, opts = {}) {
  const { useNominatim = true } = opts;
  console.log(`\n━━━ [${prov.code}] ${prov.name} ━━━`);

  // 1) NEIS — 전체 학교 목록
  console.log('  [1/3] NEIS 학교 목록 가져오는 중…');
  const neisList = await fetchNeisSchools(prov.code);
  console.log(`    ✓ NEIS ${neisList.length}개`);

  // 2) OSM — 좌표
  console.log('  [2/3] OSM 좌표 매핑 가져오는 중…');
  const osmMap = await fetchOsmSchools(prov.name, prov.altName);
  console.log(`    ✓ OSM ${osmMap.size}개`);

  // 3) 병합
  const merged = [];
  let osmHit = 0, neisOnly = 0, geocoded = 0;
  for (const n of neisList) {
    const key = normalizeName(n.name);
    let coord = osmMap.get(key);
    // fuzzy 매칭 — '○○초', '○○초등학교' 등 변형
    if (!coord) {
      for (const [k, v] of osmMap) {
        if (k.includes(key) || key.includes(k)) { coord = v; break; }
      }
    }
    let lat = null, lng = null, src = 'neis-only';
    if (coord) { lat = coord.lat; lng = coord.lng; src = 'osm'; osmHit++; }
    merged.push({ ...n, lat, lng, _src: src });
    if (!coord) neisOnly++;
  }

  // 4) Nominatim — OSM에 없는 학교 지오코딩
  if (useNominatim) {
    const missing = merged.filter(m => !m.lat);
    console.log(`  [3/3] Nominatim 지오코딩 (${missing.length}건, 약 ${missing.length}초 소요)…`);
    for (let i = 0; i < missing.length; i++) {
      const m = missing[i];
      // "{학교명} {주소}" 또는 "{학교명}"
      let coord = null;
      if (m.addr) coord = await geocodeNominatim(`${m.name} ${m.addr}`);
      if (!coord && m.addr) coord = await geocodeNominatim(m.addr);
      if (!coord) coord = await geocodeNominatim(`${m.name} ${prov.name}`);
      if (coord) {
        // 한국 영토 범위 검증
        if (coord[0] > 32 && coord[0] < 39 && coord[1] > 123 && coord[1] < 132) {
          m.lat = coord[0]; m.lng = coord[1]; m._src = 'nominatim'; geocoded++;
        }
      }
      await sleep(1100); // Nominatim 1 req/sec 정책
      if ((i+1) % 50 === 0) console.log(`    진행: ${i+1}/${missing.length} (지오코딩 성공 ${geocoded}건)`);
    }
  }

  // 5) 좌표 없는 학교 — 자치구 중심 + 결정적 오프셋
  // (마지막 폴백 — OSM·Nominatim 둘 다 실패한 학교)
  const stillMissing = merged.filter(m => !m.lat).length;

  // 좌표 있는 학교만 최종 리스트에 포함
  const final = merged
    .filter(m => Number.isFinite(m.lat) && Number.isFinite(m.lng))
    .map(m => ({
      code: m.code,
      office: m.office,
      name: m.name,
      kind: m.kind,
      addr: m.addr,
      lat: m.lat,
      lng: m.lng,
      _src: m._src,
    }));

  console.log(`  ━━━ 결과 ━━━`);
  console.log(`    OSM 매칭:    ${osmHit}`);
  console.log(`    Nominatim:   ${geocoded}`);
  console.log(`    좌표 없음:   ${stillMissing - geocoded}`);
  console.log(`    최종 출력:   ${final.length}개 (NEIS 기준 ${((final.length/neisList.length)*100).toFixed(1)}% 커버)`);
  return final;
}

// ─────────────────────────────────────────────────────────
(async () => {
  const args = process.argv.slice(2);
  const onlyCodes = args.length ? args : null; // 인자로 시도 코드 지정 가능 (예: B10 J10)
  const useNominatim = !args.includes('--no-geocode');
  const targetCodes = onlyCodes ? onlyCodes.filter(c => c.match(/^[A-Z]\d+$/)) : null;

  const outDir = path.join(__dirname, 'kmeal-app', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  const summary = {};
  for (const prov of PROVINCES) {
    if (targetCodes && !targetCodes.includes(prov.code)) continue;
    const data = await buildOne(prov, { useNominatim });
    const file = path.join(outDir, `schools-${prov.code}.json`);
    fs.writeFileSync(file, JSON.stringify(data));
    summary[prov.code] = data.length;
    await sleep(3000);
  }
  fs.writeFileSync(path.join(outDir, 'index.json'), JSON.stringify({
    generated: new Date().toISOString(),
    source: 'NEIS schoolInfo + OSM Overpass + Nominatim',
    summary,
  }, null, 2));
  console.log('\n✓ 빌드 완료');
  console.table(summary);
  console.log('총 합계:', Object.values(summary).reduce((a,b)=>a+b,0));
})();

// 학교 좌표 검증·보정 스크립트
// Nominatim 지오코딩이 동명 학교를 잘못 매칭한 경우(예: 노원구 화랑초가
// 강남구 어딘가로 매칭) 주소에서 자치구를 추출해 자치구 중심으로 보정.
const fs = require('fs');
const path = require('path');

// 시도 bbox (한국 영토 내 어림 경계)
const PROV_BBOX = {
  B10: { latMin: 37.40, latMax: 37.72, lngMin: 126.74, lngMax: 127.20 }, // 서울
  C10: { latMin: 34.95, latMax: 35.45, lngMin: 128.78, lngMax: 129.40 }, // 부산
  D10: { latMin: 35.70, latMax: 36.10, lngMin: 128.35, lngMax: 128.85 }, // 대구
  E10: { latMin: 37.20, latMax: 37.85, lngMin: 126.30, lngMax: 126.85 }, // 인천
  F10: { latMin: 35.00, latMax: 35.35, lngMin: 126.65, lngMax: 127.05 }, // 광주
  G10: { latMin: 36.15, latMax: 36.55, lngMin: 127.18, lngMax: 127.60 }, // 대전
  H10: { latMin: 35.25, latMax: 35.80, lngMin: 128.95, lngMax: 129.60 }, // 울산
  I10: { latMin: 36.35, latMax: 36.85, lngMin: 127.05, lngMax: 127.55 }, // 세종
  J10: { latMin: 36.80, latMax: 38.35, lngMin: 126.30, lngMax: 127.95 }, // 경기
  K10: { latMin: 36.95, latMax: 38.70, lngMin: 126.95, lngMax: 129.45 }, // 강원
  M10: { latMin: 35.95, latMax: 37.25, lngMin: 127.15, lngMax: 128.75 }, // 충북
  N10: { latMin: 35.85, latMax: 37.10, lngMin: 125.80, lngMax: 127.70 }, // 충남
  P10: { latMin: 35.25, latMax: 36.35, lngMin: 126.35, lngMax: 128.00 }, // 전북
  Q10: { latMin: 33.85, latMax: 35.60, lngMin: 125.05, lngMax: 128.00 }, // 전남
  R10: { latMin: 35.50, latMax: 37.25, lngMin: 127.80, lngMax: 130.05 }, // 경북
  S10: { latMin: 34.45, latMax: 36.00, lngMin: 127.25, lngMax: 129.35 }, // 경남
  T10: { latMin: 33.05, latMax: 33.65, lngMin: 126.00, lngMax: 127.05 }, // 제주
};

// 서울 25개 자치구 중심 좌표 (실측)
const SEOUL_DISTRICTS = {
  '강남구':[37.5172,127.0473], '강동구':[37.5301,127.1238], '강북구':[37.6396,127.0257],
  '강서구':[37.5509,126.8495], '관악구':[37.4783,126.9514], '광진구':[37.5384,127.0822],
  '구로구':[37.4954,126.8874], '금천구':[37.4569,126.8954], '노원구':[37.6541,127.0568],
  '도봉구':[37.6687,127.0471], '동대문구':[37.5744,127.0395], '동작구':[37.5124,126.9393],
  '마포구':[37.5662,126.9019], '서대문구':[37.5791,126.9368], '서초구':[37.4836,127.0327],
  '성동구':[37.5634,127.0371], '성북구':[37.5894,127.0167], '송파구':[37.5145,127.1059],
  '양천구':[37.5170,126.8666], '영등포구':[37.5263,126.8966], '용산구':[37.5326,126.9905],
  '은평구':[37.6027,126.9291], '종로구':[37.5728,126.9793], '중구':[37.5641,126.9979],
  '중랑구':[37.6063,127.0926],
};

// 다른 시도 자치구 중심 — PROVINCE 중심 + 분산 (대략값)
function districtsFor(provCode) {
  if (provCode === 'B10') return SEOUL_DISTRICTS;
  // 시도별 자치구 중심 좌표 — 별도 매핑 (간이 — bbox 검증 후 자치구 정확도는 제한적)
  // 실제 시도 데이터를 보고 동적으로 계산 (학교 좌표 평균 기반)
  return null;
}

function districtFromAddr(addr) {
  if (!addr) return null;
  let m = addr.match(/(?:특별시|광역시|특별자치시)\s*([\w가-힣]+구)/);
  if (m) return m[1];
  m = addr.match(/(?:도|특별자치도)\s*([\w가-힣]+(?:시|군))/);
  if (m) return m[1];
  m = addr.match(/([\w가-힣]+구)/);
  if (m) return m[1];
  m = addr.match(/([\w가-힣]+(?:시|군))/);
  if (m) return m[1];
  return null;
}

function distKm(a, b) {
  const dlat = a[0] - b[0];
  const dlng = a[1] - b[1];
  return Math.sqrt(dlat*dlat + dlng*dlng) * 111;
}

function detHash(s) {
  let h = 0;
  const str = String(s || '');
  for (let i = 0; i < str.length; i++) h = (h*31 + str.charCodeAt(i)) >>> 0;
  return h;
}

// 자치구 중심 + 결정적 지터 (학교 코드 기반)
function districtCenterWithJitter(districtCoord, code, name) {
  const h = detHash(code + name);
  const jx = ((h % 600) - 300) / 25000;        // ±0.012도 ≈ ±1.3km
  const jy = (((h >> 8) % 600) - 300) / 25000;
  return [districtCoord[0] + jx, districtCoord[1] + jy];
}

// 한 시도 학교들의 자치구별 평균 좌표 자동 계산 (B10 외 시도용)
function computeProvinceDistrictCenters(schools) {
  const groups = {};
  schools.forEach(s => {
    const d = districtFromAddr(s.addr);
    if (!d) return;
    if (!groups[d]) groups[d] = { sumLat:0, sumLng:0, count:0 };
    groups[d].sumLat += s.lat;
    groups[d].sumLng += s.lng;
    groups[d].count++;
  });
  const out = {};
  Object.entries(groups).forEach(([d, g]) => {
    if (g.count >= 3) { // 최소 3개 학교 있을 때만
      out[d] = [g.sumLat / g.count, g.sumLng / g.count];
    }
  });
  return out;
}

const PROVINCES = ['B10','C10','D10','E10','F10','G10','H10','I10','J10','K10','M10','N10','P10','Q10','R10','S10','T10'];

// 광역시(서울/부산/대구/인천/광주/대전/울산/세종) — 자치구 작음 → 6km 임계
// 도(경기/강원/충북/충남/전북/전남/경북/경남/제주) — 시·군 큼 → 15km 임계
const URBAN_PROVS = new Set(['B10','C10','D10','E10','F10','G10','H10','I10']);
const DIST_THRESHOLD_KM_URBAN = 7;
const DIST_THRESHOLD_KM_RURAL = 18;

let totalFixed = 0, totalRemoved = 0, totalIn = 0, totalOut = 0;

PROVINCES.forEach(provCode => {
  const file = path.join('kmeal-app', 'data', `schools-${provCode}.json`);
  if (!fs.existsSync(file)) return;
  const schools = JSON.parse(fs.readFileSync(file, 'utf8'));
  totalIn += schools.length;
  const bbox = PROV_BBOX[provCode];

  // 1차: 시도 bbox 밖 학교 추출
  const validBox = schools.filter(s =>
    s.lat >= bbox.latMin && s.lat <= bbox.latMax &&
    s.lng >= bbox.lngMin && s.lng <= bbox.lngMax
  );

  // 2차: bbox 안 학교들로부터 자치구별 중심 자동 계산
  const districtCenters = provCode === 'B10' ? SEOUL_DISTRICTS : computeProvinceDistrictCenters(validBox);

  let fixed = 0, removed = 0;
  const out = [];

  schools.forEach(s => {
    const inBox = s.lat >= bbox.latMin && s.lat <= bbox.latMax &&
                  s.lng >= bbox.lngMin && s.lng <= bbox.lngMax;
    const district = districtFromAddr(s.addr);
    const districtCenter = district && districtCenters[district];

    if (!inBox) {
      // 시도 bbox 밖 — 명백한 오류
      if (districtCenter) {
        const [lat, lng] = districtCenterWithJitter(districtCenter, s.code, s.name);
        out.push({ ...s, lat, lng, _src: 'district-fix' });
        fixed++;
      } else {
        removed++;
      }
      return;
    }

    // bbox 안이지만 자치구 중심에서 너무 먼 경우 검증 — 모든 출처에 적용
    if (districtCenter) {
      const threshold = URBAN_PROVS.has(provCode) ? DIST_THRESHOLD_KM_URBAN : DIST_THRESHOLD_KM_RURAL;
      const d = distKm([s.lat, s.lng], districtCenter);
      if (d > threshold) {
        const [lat, lng] = districtCenterWithJitter(districtCenter, s.code, s.name);
        out.push({ ...s, lat, lng, _src: 'district-fix' });
        fixed++;
        return;
      }
    }
    out.push(s);
  });

  fs.writeFileSync(file, JSON.stringify(out));
  totalFixed += fixed;
  totalRemoved += removed;
  totalOut += out.length;
  console.log(`[${provCode}] ${schools.length} → ${out.length} (fixed=${fixed}, removed=${removed})`);
});

console.log(`\n총 ${totalIn}개 → ${totalOut}개 (fixed=${totalFixed}, removed=${totalRemoved})`);

// 급식 어때? — 제8회 교육 공공데이터 AI 활용대회 발표자료 (Modern Edition)
// 에디토리얼 매거진 스타일 · 다크/라이트 샌드위치 · 세리프 디스플레이 + 클린 산세리프
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();

pres.layout = 'LAYOUT_WIDE';
pres.title  = '급식 어때? · 판테라 · 제안서 (Modern v3)';
pres.author = '판테라 (박준범, 박세윤, 박정원)';
pres.company = '제8회 교육 공공데이터 AI 활용대회';

// ═══════════════════════════════════════════
// 디자인 토큰 — Editorial / Modern
// ═══════════════════════════════════════════
const C = {
  ink:      '0A0A0F',   // 메인 다크
  paper:    'F5F2EA',   // 따뜻한 종이톤 (light bg)
  paperAlt: 'EAE6DA',   // 살짝 어두운 paper
  cream:    'FFFDF7',   // 가장 밝은 톤
  accent:   'E84C2B',   // 강렬한 코랄/버밀리언 — 단일 액센트
  accent2:  'D4A574',   // 따뜻한 골드 (서브 액센트)
  text:     '15151A',
  textMute: '6B6B72',
  textDim:  '9A9A9F',
  rule:     'C9C3B4',   // 종이 위 얇은 선
  ruleD:    '2A2A33',   // 다크 위 얇은 선
  white:    'FFFFFF',
};

const FONT_DISP   = 'Georgia';        // 세리프 디스플레이 (제목)
const FONT_BODY   = 'Malgun Gothic';  // 한글 본문
const FONT_MONO   = 'Consolas';       // 라벨/숫자
const FONT_LATIN  = 'Calibri';        // 영문 보조

const TOTAL = 15;
const W = 13.33, H = 7.5;
const MARGIN = 0.6;

// ═══════════════════════════════════════════
// 공용 헬퍼
// ═══════════════════════════════════════════
function bg(s, color) {
  s.background = { color };
}

// 얇은 가로선
function rule(s, x, y, w, color = C.rule, weight = 0.5) {
  s.addShape('line', {
    x, y, w, h: 0,
    line: { color, width: weight, dashType: 'solid' },
  });
}

// 슬라이드 상단 헤더 — 작은 라벨 + 챕터 번호 + 우측 페이지
function header(s, chapter, label, dark = false) {
  const fg = dark ? 'FFFFFF' : C.text;
  const dim = dark ? '6B6B7A' : C.textMute;

  // 좌측: 챕터 번호 + 라벨
  s.addText('— ' + String(chapter).padStart(2, '0'), {
    x: MARGIN, y: 0.35, w: 1.2, h: 0.3,
    fontSize: 9, bold: true, color: dim,
    fontFace: FONT_MONO, charSpacing: 4,
  });
  s.addText(label, {
    x: MARGIN + 1.0, y: 0.35, w: 6.0, h: 0.3,
    fontSize: 9, bold: true, color: fg,
    fontFace: FONT_MONO, charSpacing: 4,
  });

  // 우측: 브랜드
  s.addText('급식 어때?  ·  KMEAL', {
    x: W - MARGIN - 4.0, y: 0.35, w: 4.0, h: 0.3,
    fontSize: 9, color: dim,
    fontFace: FONT_MONO, charSpacing: 3, align: 'right',
  });

  // 헤더 룰
  rule(s, MARGIN, 0.75, W - 2 * MARGIN, dark ? C.ruleD : C.rule, 0.5);
}

function footer(s, page, dark = false) {
  const dim = dark ? '6B6B7A' : C.textMute;
  rule(s, MARGIN, H - 0.55, W - 2 * MARGIN, dark ? C.ruleD : C.rule, 0.5);

  s.addText('판테라  ·  PANTERA', {
    x: MARGIN, y: H - 0.45, w: 4.0, h: 0.25,
    fontSize: 8, color: dim,
    fontFace: FONT_MONO, charSpacing: 3,
  });
  s.addText('제8회 교육 공공데이터 AI 활용대회  ·  2026', {
    x: W / 2 - 3, y: H - 0.45, w: 6.0, h: 0.25,
    fontSize: 8, color: dim,
    fontFace: FONT_MONO, charSpacing: 3, align: 'center',
  });
  s.addText(String(page).padStart(2, '0') + ' / ' + String(TOTAL).padStart(2, '0'), {
    x: W - MARGIN - 2.0, y: H - 0.45, w: 2.0, h: 0.25,
    fontSize: 8, bold: true, color: dim,
    fontFace: FONT_MONO, charSpacing: 3, align: 'right',
  });
}

// 큰 섹션 타이틀 (세리프, 좌측 정렬)
function bigTitle(s, text, opts = {}) {
  const { x = MARGIN, y = 1.1, w = W - 2 * MARGIN, color = C.text, size = 56 } = opts;
  s.addText(text, {
    x, y, w, h: 1.2,
    fontSize: size, bold: false, color,
    fontFace: FONT_DISP, italic: false, charSpacing: -1,
  });
}

// 알약(Pill) 라벨
function pill(s, x, y, label, color = C.accent, fg = 'FFFFFF') {
  const w = Math.max(0.9, label.length * 0.085 + 0.4);
  s.addShape('roundRect', {
    x, y, w, h: 0.32,
    fill: { color },
    line: { type: 'none' },
    rectRadius: 0.16,
  });
  s.addText(label, {
    x, y, w, h: 0.32,
    fontSize: 9, bold: true, color: fg,
    fontFace: FONT_MONO, charSpacing: 3,
    align: 'center', valign: 'middle',
  });
  return w;
}

// 큰 숫자 통계
function bigStat(s, x, y, w, num, label, color = C.accent, dark = false) {
  s.addText(num, {
    x, y, w, h: 1.4,
    fontSize: 84, bold: false, color,
    fontFace: FONT_DISP, charSpacing: -3,
  });
  rule(s, x, y + 1.55, Math.min(w, 1.0), dark ? C.ruleD : C.rule, 0.5);
  s.addText(label, {
    x, y: y + 1.65, w, h: 0.5,
    fontSize: 10, color: dark ? 'AAAAB2' : C.textMute,
    fontFace: FONT_BODY, charSpacing: 2,
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 01 — COVER (DARK)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.ink);

  // 미니 헤더 룰
  rule(s, MARGIN, 0.75, W - 2 * MARGIN, C.ruleD, 0.5);

  s.addText('— 01', {
    x: MARGIN, y: 0.35, w: 1.0, h: 0.3,
    fontSize: 9, bold: true, color: '6B6B7A',
    fontFace: FONT_MONO, charSpacing: 4,
  });
  s.addText('PROJECT BRIEF  /  V1.6', {
    x: MARGIN + 1.0, y: 0.35, w: 6.0, h: 0.3,
    fontSize: 9, bold: true, color: 'FFFFFF',
    fontFace: FONT_MONO, charSpacing: 4,
  });
  s.addText('제8회 교육 공공데이터 AI 활용대회  ·  2026', {
    x: W - MARGIN - 5.0, y: 0.35, w: 5.0, h: 0.3,
    fontSize: 9, color: '6B6B7A',
    fontFace: FONT_MONO, charSpacing: 3, align: 'right',
  });

  // 좌측 코랄 액센트 바
  s.addShape('rect', {
    x: MARGIN, y: 1.4, w: 0.06, h: 1.3,
    fill: { color: C.accent }, line: { type: 'none' },
  });

  // 카테고리 핀
  s.addText('A K-12 SCHOOL MEAL COMPASS', {
    x: MARGIN + 0.25, y: 1.4, w: 8, h: 0.35,
    fontSize: 10, bold: true, color: C.accent,
    fontFace: FONT_MONO, charSpacing: 5,
  });

  // 메인 타이틀 — 세리프 거대 글자
  s.addText('급식 어때?', {
    x: MARGIN, y: 1.95, w: 12, h: 2.4,
    fontSize: 180, bold: false, color: 'FFFFFF',
    fontFace: FONT_DISP, charSpacing: -6,
  });
  s.addText('How’s the school meal,', {
    x: MARGIN, y: 4.4, w: 12, h: 0.7,
    fontSize: 32, italic: true, color: 'D4D0C0',
    fontFace: FONT_DISP,
  });
  s.addText('really?', {
    x: MARGIN, y: 4.9, w: 12, h: 0.7,
    fontSize: 32, italic: true, color: C.accent2,
    fontFace: FONT_DISP,
  });

  // 하단 두 컬럼
  rule(s, MARGIN, 6.3, W - 2 * MARGIN, C.ruleD, 0.5);

  s.addText('TEAM', {
    x: MARGIN, y: 6.4, w: 1.5, h: 0.25,
    fontSize: 8, bold: true, color: '6B6B7A',
    fontFace: FONT_MONO, charSpacing: 4,
  });
  s.addText('판테라  PANTERA', {
    x: MARGIN, y: 6.65, w: 5, h: 0.4,
    fontSize: 16, bold: true, color: 'FFFFFF',
    fontFace: FONT_BODY,
  });
  s.addText('박준범  ·  박세윤  ·  박정원', {
    x: MARGIN, y: 7.05, w: 5, h: 0.3,
    fontSize: 11, color: 'AAAAB2',
    fontFace: FONT_BODY,
  });

  s.addText('SUBMISSION', {
    x: W - MARGIN - 5.0, y: 6.4, w: 5.0, h: 0.25,
    fontSize: 8, bold: true, color: '6B6B7A',
    fontFace: FONT_MONO, charSpacing: 4, align: 'right',
  });
  s.addText('전국 12,066개교 통합 플랫폼', {
    x: W - MARGIN - 5.0, y: 6.65, w: 5.0, h: 0.4,
    fontSize: 16, bold: true, color: 'FFFFFF',
    fontFace: FONT_BODY, align: 'right',
  });
  s.addText('NEIS · data.go.kr · 학교알리미 · 3대 LLM', {
    x: W - MARGIN - 5.0, y: 7.05, w: 5.0, h: 0.3,
    fontSize: 11, color: 'AAAAB2',
    fontFace: FONT_BODY, align: 'right',
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 02 — INDEX
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 2, 'INDEX  /  CONTENTS');

  // 좌측: 거대 "Index" 세리프
  s.addText('Index.', {
    x: MARGIN, y: 1.4, w: 6, h: 2.3,
    fontSize: 140, bold: false, color: C.text,
    fontFace: FONT_DISP, charSpacing: -4, italic: true,
  });
  s.addText('아홉 개의 챕터', {
    x: MARGIN, y: 3.7, w: 6, h: 0.5,
    fontSize: 16, color: C.textMute,
    fontFace: FONT_BODY,
  });
  s.addShape('rect', {
    x: MARGIN, y: 4.3, w: 0.5, h: 0.04,
    fill: { color: C.accent }, line: { type: 'none' },
  });
  s.addText('"공공데이터 + 3대 LLM이 만드는\n새로운 학교급식 경험"', {
    x: MARGIN, y: 4.5, w: 6, h: 1.1,
    fontSize: 14, italic: true, color: C.text,
    fontFace: FONT_DISP,
  });

  // 우측: 9개 항목 — 줄당 얇은 룰
  const items = [
    ['01', '프로젝트 개요',     'Background & Vision'],
    ['02', '문제 정의',         'Why We Built This'],
    ['03', '솔루션 아키텍처',   '3-Layer AI Stack'],
    ['04', '핵심 기능',         '8 Core Modules'],
    ['05', '개발 파이프라인',   'Figma → Claude → Railway'],
    ['06', '데이터 분석',       'Insights from 11K+ Schools'],
    ['07', '사용자 시나리오',   'Parent · Nutritionist · Gov'],
    ['08', '차별성',            'vs Existing Apps'],
    ['09', '기대효과 · 로드맵', 'Impact & Next Steps'],
  ];

  const baseX = 7.4;
  const baseY = 1.55;
  const rowH = 0.55;

  rule(s, baseX, baseY - 0.05, W - MARGIN - baseX, C.rule, 0.5);

  items.forEach((it, i) => {
    const y = baseY + i * rowH;
    s.addText(it[0], {
      x: baseX, y: y + 0.05, w: 0.6, h: 0.4,
      fontSize: 10, bold: true, color: C.accent,
      fontFace: FONT_MONO, charSpacing: 3,
    });
    s.addText(it[1], {
      x: baseX + 0.7, y: y + 0.02, w: 3.0, h: 0.45,
      fontSize: 18, bold: false, color: C.text,
      fontFace: FONT_DISP,
    });
    s.addText(it[2], {
      x: baseX + 3.7, y: y + 0.1, w: 1.85, h: 0.4,
      fontSize: 10, italic: true, color: C.textMute,
      fontFace: FONT_DISP, align: 'right',
    });
    rule(s, baseX, y + rowH - 0.05, W - MARGIN - baseX, C.rule, 0.5);
  });

  footer(s, 2);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 03 — PROJECT OVERVIEW (큰 숫자 + 에디토리얼)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 3, '01  ·  PROJECT OVERVIEW');

  // 좌측 큰 카피
  s.addText('Eat\nbetter,\ntogether.', {
    x: MARGIN, y: 1.2, w: 6.5, h: 3.5,
    fontSize: 88, bold: false, color: C.text,
    fontFace: FONT_DISP, charSpacing: -3,
  });

  rule(s, MARGIN, 4.95, 1.0, C.accent, 1.5);

  s.addText('전국 11,569개 학교의 급식 데이터를 누구나 이해할 수 있는\n언어로 번역하는 AI 통합 플랫폼.', {
    x: MARGIN, y: 5.1, w: 6.5, h: 1.2,
    fontSize: 16, color: C.text,
    fontFace: FONT_BODY,
  });

  // 우측 4 stat 그리드
  const stats = [
    { k: '12,066', l: '전국 학교 좌표\nNEIS + OSM + Nominatim 병합' },
    { k: '81K',    l: '일일 급식 레코드\nReal-time API' },
    { k: '99%+',   l: 'NEIS 커버율\n17개 시도 전 시도' },
    { k: '785',    l: '평균 급식 칼로리\n학년·계절 보정' },
  ];

  const sx0 = 8.0, sy0 = 1.3, sw = 2.3, sh = 2.6;
  stats.forEach((st, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = sx0 + col * (sw + 0.4);
    const y = sy0 + row * (sh + 0.3);

    s.addText(st.k, {
      x, y, w: sw, h: 1.5,
      fontSize: 64, bold: false, color: C.text,
      fontFace: FONT_DISP, charSpacing: -2,
    });
    rule(s, x, y + 1.55, 0.6, C.accent, 1.5);
    s.addText(st.l, {
      x, y: y + 1.7, w: sw, h: 0.9,
      fontSize: 10, color: C.textMute,
      fontFace: FONT_BODY,
    });
  });

  footer(s, 3);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 04 — PROBLEM DEFINITION
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 4, '02  ·  PROBLEM DEFINITION');

  // 좌측 카피
  s.addText('Problem.', {
    x: MARGIN, y: 1.1, w: 6, h: 1.4,
    fontSize: 90, italic: true, color: C.text,
    fontFace: FONT_DISP, charSpacing: -3,
  });
  rule(s, MARGIN, 2.6, 0.6, C.accent, 1.5);
  s.addText('학부모는 메뉴만 본다.\n영양사는 엑셀로 일한다.\n교육청은 격차를 모른다.', {
    x: MARGIN, y: 2.8, w: 5.5, h: 1.8,
    fontSize: 22, color: C.text,
    fontFace: FONT_DISP, italic: true,
  });
  s.addText('"누구나 학교급식의 진짜 모습을 알 권리가 있다."', {
    x: MARGIN, y: 5.0, w: 5.5, h: 0.8,
    fontSize: 12, italic: true, color: C.textMute,
    fontFace: FONT_DISP,
  });

  // 우측 4개 문제 카드 — 2x2
  const probs = [
    { n: '01', t: '단편화된 정보',   d: 'NEIS·학교알리미·식약처가\n각각 분리되어 있다' },
    { n: '02', t: '시각화 부재',     d: '데이터는 많지만 누구도\n쉽게 보지 못한다' },
    { n: '03', t: '알레르기 위험',   d: '19종 표준 알레르기를\n수동으로 추적해야 한다' },
    { n: '04', t: '다문화 사각지대', d: '8개 언어 학생 가정에\n번역이 제공되지 않는다' },
  ];

  const px0 = 7.4, py0 = 1.2, pw = 2.6, ph = 2.8;
  probs.forEach((p, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = px0 + col * (pw + 0.35);
    const y = py0 + row * (ph + 0.3);

    // 좌측 얇은 액센트
    s.addShape('rect', {
      x, y, w: 0.04, h: ph,
      fill: { color: C.accent }, line: { type: 'none' },
    });
    s.addText(p.n, {
      x: x + 0.2, y, w: pw - 0.2, h: 0.35,
      fontSize: 10, bold: true, color: C.accent,
      fontFace: FONT_MONO, charSpacing: 4,
    });
    s.addText(p.t, {
      x: x + 0.2, y: y + 0.45, w: pw - 0.2, h: 0.7,
      fontSize: 22, color: C.text,
      fontFace: FONT_DISP,
    });
    s.addText(p.d, {
      x: x + 0.2, y: y + 1.3, w: pw - 0.2, h: 1.4,
      fontSize: 11, color: C.textMute,
      fontFace: FONT_BODY,
    });
  });

  footer(s, 4);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 05 — AI SOLUTION ARCHITECTURE (3-LAYER)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 5, '03  ·  AI SOLUTION ARCHITECTURE');

  s.addText('A three-layer\nintelligence stack.', {
    x: MARGIN, y: 1.0, w: 12, h: 1.6,
    fontSize: 44, color: C.text,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  // 3개 레이어 — 가로 스택
  const layers = [
    {
      idx: 'L 03', t: 'PRESENTATION',  k: '인터페이스 레이어',
      d: '단일 HTML SPA · React 18 (UMD)\nLeaflet 지도 · Chart.js · Web Speech',
      tag: ['지도', '챗봇', '음성', 'PWA'],
    },
    {
      idx: 'L 02', t: 'INTELLIGENCE',  k: 'AI 엔진 레이어',
      d: '3대 LLM 멀티 호스팅 + RAG\nClaude Sonnet 4.5 · GPT-4o · Gemini 1.5',
      tag: ['Vision', 'RAG', '번역', '메뉴 생성'],
    },
    {
      idx: 'L 01', t: 'DATA',          k: '공공데이터 레이어',
      d: 'NEIS 학교기본·급식식단 + 공공데이터포털\n학교알리미 공시 · 식약처 영양 DB · OSM',
      tag: ['NEIS', 'data.go.kr', '알리미', 'OSM'],
    },
  ];

  const lx = MARGIN, ly0 = 3.2, lw = W - 2 * MARGIN, lh = 1.05;
  layers.forEach((L, i) => {
    const y = ly0 + i * (lh + 0.15);
    s.addShape('roundRect', {
      x: lx, y, w: lw, h: lh,
      fill: { color: C.cream },
      line: { color: C.rule, width: 0.5 },
      rectRadius: 0.04,
    });
    // 좌측 인덱스
    s.addText(L.idx, {
      x: lx + 0.3, y: y + 0.18, w: 1.0, h: 0.35,
      fontSize: 10, bold: true, color: C.accent,
      fontFace: FONT_MONO, charSpacing: 4,
    });
    s.addText(L.t, {
      x: lx + 0.3, y: y + 0.5, w: 2.5, h: 0.5,
      fontSize: 22, color: C.text,
      fontFace: FONT_DISP,
    });
    // 한글 부제
    s.addText(L.k, {
      x: lx + 3.0, y: y + 0.2, w: 3.0, h: 0.3,
      fontSize: 11, bold: true, color: C.text,
      fontFace: FONT_BODY,
    });
    s.addText(L.d, {
      x: lx + 3.0, y: y + 0.45, w: 4.5, h: 0.6,
      fontSize: 10, color: C.textMute,
      fontFace: FONT_BODY,
    });
    // 우측 태그
    let tx = lx + lw - 0.3;
    L.tag.slice().reverse().forEach(t => {
      const tw = Math.max(0.7, t.length * 0.13 + 0.3);
      tx -= tw + 0.1;
      s.addShape('roundRect', {
        x: tx, y: y + 0.4, w: tw, h: 0.3,
        fill: { color: 'FFFFFF' },
        line: { color: C.rule, width: 0.5 },
        rectRadius: 0.15,
      });
      s.addText(t, {
        x: tx, y: y + 0.4, w: tw, h: 0.3,
        fontSize: 9, color: C.text,
        fontFace: FONT_BODY, align: 'center', valign: 'middle',
      });
    });
  });

  footer(s, 5);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 06 — CORE FEATURES (8 modules)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 6, '04  ·  CORE FEATURES');

  s.addText('Eight modules,', {
    x: MARGIN, y: 1.0, w: 12, h: 0.9,
    fontSize: 44, color: C.text,
    fontFace: FONT_DISP, charSpacing: -1,
  });
  s.addText('one cohesive product.', {
    x: MARGIN, y: 1.85, w: 12, h: 0.9,
    fontSize: 44, italic: true, color: C.accent,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  const feats = [
    { n:'01', t:'지도 검색',        d:'12K+ 학교 SVG 마커' },
    { n:'02', t:'학교 상세',        d:'NEIS LIVE + 일러스트 식단' },
    { n:'03', t:'심층 리포트',      d:'화이트 모드 · 4탭 통합' },
    { n:'04', t:'커뮤니티',         d:'학생/학부모 익명 리뷰' },
    { n:'05', t:'GIS 격차 분석',    d:'자치구 영양 히트맵' },
    { n:'06', t:'AI 메뉴 생성',     d:'Vision + 5일 식단' },
    { n:'07', t:'다국어 번역',      d:'8개 언어 LLM 자동 번역' },
    { n:'08', t:'영양사 PRO',       d:'B2B 운영 대시보드' },
  ];

  const fx0 = MARGIN, fy0 = 3.2, fw = 2.95, fh = 1.7, gap = 0.15;
  feats.forEach((f, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    const x = fx0 + col * (fw + gap);
    const y = fy0 + row * (fh + gap);

    s.addShape('roundRect', {
      x, y, w: fw, h: fh,
      fill: { color: C.cream },
      line: { color: C.rule, width: 0.5 },
      rectRadius: 0.05,
    });
    // 점
    s.addShape('ellipse', {
      x: x + 0.3, y: y + 0.32, w: 0.18, h: 0.18,
      fill: { color: C.accent }, line: { type: 'none' },
    });
    s.addText(f.n, {
      x: x + 0.55, y: y + 0.25, w: 1.5, h: 0.3,
      fontSize: 9, bold: true, color: C.textMute,
      fontFace: FONT_MONO, charSpacing: 3,
    });
    s.addText(f.t, {
      x: x + 0.3, y: y + 0.65, w: fw - 0.4, h: 0.5,
      fontSize: 20, color: C.text,
      fontFace: FONT_DISP,
    });
    rule(s, x + 0.3, y + 1.2, 0.4, C.rule, 0.5);
    s.addText(f.d, {
      x: x + 0.3, y: y + 1.3, w: fw - 0.4, h: 0.4,
      fontSize: 10, color: C.textMute,
      fontFace: FONT_BODY,
    });
  });

  footer(s, 6);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 07 — TECH STACK
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 7, '04.5  ·  TECH STACK');

  s.addText('Modern web,\nzero build step.', {
    x: MARGIN, y: 1.0, w: 12, h: 1.7,
    fontSize: 44, color: C.text,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  const cats = [
    { n:'01', t:'Frontend',     d:'React 18 (UMD) · Babel Standalone\n단일 HTML SPA · 모바일 반응형',                  c:'React · Babel · 100dvh' },
    { n:'02', t:'Maps & Charts', d:'Leaflet 1.9.4 + OSM\nSVG 일러스트 마커 · Chart.js',                                c:'Leaflet · Chart.js · SVG' },
    { n:'03', t:'AI / LLM',     d:'Claude Sonnet 4.5 · GPT-4o-mini\nGemini 1.5 Flash · Vision · 자동 번역',          c:'Anthropic · OpenAI · Google' },
    { n:'04', t:'Voice & i18n', d:'Web Speech API · TTS·STT\n8개 언어 LLM DOM 워커 자동 번역',                       c:'Web Speech · i18n · LLM' },
    { n:'05', t:'Public Data',  d:'NEIS · data.go.kr · 학교알리미\nOSM · Nominatim · 10-way CORS Race',              c:'NEIS · data.go.kr · OSM' },
    { n:'06', t:'Deploy',       d:'GitHub Actions · Railway PaaS\nmain push → CDN 자동 배포',                          c:'GitHub · Railway · CDN' },
  ];

  const cx0 = MARGIN, cy0 = 3.0, cw = 4.05, ch = 1.85, gap = 0.15;
  cats.forEach((c, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = cx0 + col * (cw + gap);
    const y = cy0 + row * (ch + gap);

    s.addShape('roundRect', {
      x, y, w: cw, h: ch,
      fill: { color: C.cream },
      line: { color: C.rule, width: 0.5 },
      rectRadius: 0.05,
    });
    s.addText(c.n, {
      x: x + 0.3, y: y + 0.25, w: 0.6, h: 0.3,
      fontSize: 9, bold: true, color: C.accent,
      fontFace: FONT_MONO, charSpacing: 3,
    });
    s.addText(c.t, {
      x: x + 0.9, y: y + 0.2, w: cw - 1.0, h: 0.45,
      fontSize: 20, color: C.text,
      fontFace: FONT_DISP,
    });
    s.addText(c.d, {
      x: x + 0.3, y: y + 0.75, w: cw - 0.5, h: 0.7,
      fontSize: 10, color: C.textMute,
      fontFace: FONT_BODY,
    });
    rule(s, x + 0.3, y + 1.5, cw - 0.6, C.rule, 0.5);
    s.addText(c.c, {
      x: x + 0.3, y: y + 1.55, w: cw - 0.5, h: 0.25,
      fontSize: 9, color: C.text, bold: true,
      fontFace: FONT_MONO, charSpacing: 2,
    });
  });

  footer(s, 7);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 08 — DEV PIPELINE (가로 5단계 타임라인)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.ink);
  header(s, 8, '05  ·  DEV PIPELINE', true);

  s.addText('From Figma to Railway,', {
    x: MARGIN, y: 1.0, w: 12, h: 0.9,
    fontSize: 44, color: 'FFFFFF',
    fontFace: FONT_DISP, charSpacing: -1,
  });
  s.addText('in twenty-four hours.', {
    x: MARGIN, y: 1.85, w: 12, h: 0.9,
    fontSize: 44, italic: true, color: C.accent2,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  // 가로 타임라인
  const stages = [
    { n:'01', t:'Figma',         k:'UI Kits',          d:'iOS Wanted DS\n컴포넌트 수집' },
    { n:'02', t:'Claude Design', k:'Wireframe',        d:'화면 와이어\n핸드오프 번들' },
    { n:'03', t:'Claude Code',   k:'Implementation',   d:'단일 HTML SPA\nNEIS · Leaflet' },
    { n:'04', t:'GitHub',        k:'Version Control',  d:'브랜치 전략\nPR 리뷰' },
    { n:'05', t:'Railway',       k:'Deployment',       d:'main push →\nCDN 자동 배포' },
  ];

  const tlY = 3.6;
  const tlX0 = MARGIN + 0.3;
  const tlW = W - 2 * MARGIN - 0.6;
  // 가로 룰
  rule(s, tlX0, tlY + 0.55, tlW, '3A3A45', 1);

  const step = tlW / (stages.length - 1);

  stages.forEach((st, i) => {
    const cx = tlX0 + i * step;

    // 노드 — 큰 원 (active accent on first)
    s.addShape('ellipse', {
      x: cx - 0.18, y: tlY + 0.35, w: 0.4, h: 0.4,
      fill: { color: i === 2 ? C.accent : '1A1A24' },
      line: { color: i === 2 ? C.accent : '4A4A58', width: 1 },
    });
    s.addShape('ellipse', {
      x: cx - 0.06, y: tlY + 0.47, w: 0.16, h: 0.16,
      fill: { color: i === 2 ? 'FFFFFF' : C.accent2 },
      line: { type: 'none' },
    });

    // 위쪽 텍스트
    s.addText(st.n, {
      x: cx - 1.0, y: tlY - 1.4, w: 2.0, h: 0.3,
      fontSize: 10, bold: true, color: C.accent2,
      fontFace: FONT_MONO, charSpacing: 4, align: 'center',
    });
    s.addText(st.t, {
      x: cx - 1.2, y: tlY - 1.05, w: 2.4, h: 0.55,
      fontSize: 22, color: 'FFFFFF',
      fontFace: FONT_DISP, align: 'center',
    });
    s.addText(st.k, {
      x: cx - 1.2, y: tlY - 0.45, w: 2.4, h: 0.3,
      fontSize: 10, italic: true, color: '8A8A95',
      fontFace: FONT_DISP, align: 'center',
    });

    // 아래 디스크립션
    s.addText(st.d, {
      x: cx - 1.2, y: tlY + 0.95, w: 2.4, h: 0.7,
      fontSize: 10, color: 'CACAD2',
      fontFace: FONT_BODY, align: 'center',
    });
  });

  // 하단 큰 통계
  rule(s, MARGIN, 5.7, W - 2 * MARGIN, C.ruleD, 0.5);
  s.addText('5×', {
    x: MARGIN, y: 5.85, w: 2.5, h: 1.2,
    fontSize: 90, color: C.accent,
    fontFace: FONT_DISP, charSpacing: -2,
  });
  s.addText('생산성 향상', {
    x: MARGIN + 2.0, y: 6.0, w: 3.5, h: 0.4,
    fontSize: 14, bold: true, color: 'FFFFFF',
    fontFace: FONT_BODY,
  });
  s.addText('예상 120 시간  →  실제 24 시간', {
    x: MARGIN + 2.0, y: 6.4, w: 4.5, h: 0.3,
    fontSize: 11, color: '9A9AA5',
    fontFace: FONT_MONO, charSpacing: 2,
  });

  s.addText('"디자인 → 코딩 → 배포 전 영역을\n단일 파이프라인 안에서 AI와 함께 완수."', {
    x: 7.0, y: 5.95, w: 5.7, h: 0.95,
    fontSize: 13, italic: true, color: 'D4D0C0',
    fontFace: FONT_DISP,
  });

  footer(s, 8, true);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 09 — GITHUB COLLABORATION
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 9, '05.1  ·  GITHUB COLLABORATION');

  s.addText('Three branches,', {
    x: MARGIN, y: 1.0, w: 12, h: 0.9,
    fontSize: 38, color: C.text,
    fontFace: FONT_DISP, charSpacing: -1,
  });
  s.addText('one shipping product.', {
    x: MARGIN, y: 1.7, w: 12, h: 0.9,
    fontSize: 38, italic: true, color: C.accent,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  // 좌측: 브랜치 그래프
  const gx = MARGIN, gy = 3.1, gw = 6.5;
  s.addShape('roundRect', {
    x: gx, y: gy, w: gw, h: 3.6,
    fill: { color: C.cream },
    line: { color: C.rule, width: 0.5 },
    rectRadius: 0.05,
  });
  s.addText('BRANCH GRAPH', {
    x: gx + 0.3, y: gy + 0.2, w: 5, h: 0.3,
    fontSize: 9, bold: true, color: C.textMute,
    fontFace: FONT_MONO, charSpacing: 4,
  });

  const branches = [
    { y: gy + 0.75, x: 0.5, label: 'main',                  c: '00BF40', sub: '· 배포용 · Protected' },
    { y: gy + 1.2,  x: 0.5, label: 'develop',               c: '0066FF', sub: '· 개발 통합' },
    { y: gy + 1.65, x: 1.0, label: 'feature/neis-api',      c: '9747FF', sub: '· 박준범' },
    { y: gy + 2.1,  x: 1.0, label: 'feature/leaflet-map',   c: '9747FF', sub: '· 박세윤' },
    { y: gy + 2.55, x: 1.0, label: 'feature/chartjs-viz',   c: '9747FF', sub: '· 박정원' },
    { y: gy + 3.0,  x: 0.5, label: 'hotfix/mobile-touch',   c: 'E84C2B', sub: '· 긴급 수정' },
  ];
  // 세로 룰
  rule(s, gx + 0.85, gy + 0.7, 0, C.rule, 0); // placeholder
  s.addShape('rect', { x: gx + 0.85, y: gy + 0.85, w: 0.02, h: 2.3, fill: { color: C.rule }, line: { type:'none'} });

  branches.forEach(b => {
    s.addShape('ellipse', {
      x: gx + b.x + 0.3, y: b.y + 0.05, w: 0.18, h: 0.18,
      fill: { color: b.c }, line: { type: 'none' },
    });
    s.addText(b.label, {
      x: gx + b.x + 0.55, y: b.y, w: 3.0, h: 0.28,
      fontSize: 11, bold: true, color: C.text,
      fontFace: FONT_MONO,
    });
    s.addText(b.sub, {
      x: gx + b.x + 3.5, y: b.y, w: 2.8, h: 0.28,
      fontSize: 10, color: C.textMute,
      fontFace: FONT_BODY,
    });
  });

  // 우측: 4단계 협업 플로우
  const ux0 = 7.5, uy0 = 3.1, uw = 5.2, uh = 0.85;
  const uses = [
    { n:'A', t:'Issue & Kanban',    d:'GitHub Issues + Project Board (To Do · WIP · Review · Done)' },
    { n:'B', t:'Pull Request',      d:'최소 1명 승인 — Claude Code 산출물도 동일 리뷰' },
    { n:'C', t:'CI · Auto Deploy',  d:'GitHub Actions → main push → Railway 자동 배포' },
    { n:'D', t:'Trace · Rollback',  d:'코드 변경 100% 추적 · 즉시 롤백 가능' },
  ];
  uses.forEach((u, i) => {
    const y = uy0 + i * (uh + 0.05);
    rule(s, ux0, y, uw, C.rule, 0.5);

    s.addText(u.n, {
      x: ux0, y: y + 0.15, w: 0.5, h: 0.5,
      fontSize: 22, bold: false, color: C.accent,
      fontFace: FONT_DISP, italic: true,
    });
    s.addText(u.t, {
      x: ux0 + 0.55, y: y + 0.1, w: uw - 0.6, h: 0.4,
      fontSize: 16, color: C.text,
      fontFace: FONT_DISP,
    });
    s.addText(u.d, {
      x: ux0 + 0.55, y: y + 0.5, w: uw - 0.6, h: 0.4,
      fontSize: 10, color: C.textMute,
      fontFace: FONT_BODY,
    });
  });
  rule(s, ux0, uy0 + uses.length * (uh + 0.05), uw, C.rule, 0.5);

  footer(s, 9);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 10 — RAILWAY DEPLOYMENT
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 10, '05.2  ·  RAILWAY DEPLOYMENT');

  s.addText('Push to main,', {
    x: MARGIN, y: 1.0, w: 12, h: 0.9,
    fontSize: 38, color: C.text,
    fontFace: FONT_DISP, charSpacing: -1,
  });
  s.addText('live in 90 seconds.', {
    x: MARGIN, y: 1.7, w: 12, h: 0.9,
    fontSize: 38, italic: true, color: C.accent,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  // 4 KPI 위 상단
  const kpis = [
    { v: '90', u: 's', l: '평균 빌드 + 배포 시간' },
    { v: '99.9', u: '%', l: '월간 가동률 SLA' },
    { v: '0', u: 'cfg', l: '인프라 설정 코드' },
    { v: 'CDN', u: '', l: '전역 엣지 배포' },
  ];

  const kx0 = MARGIN, ky = 3.1, kw = 2.95;
  kpis.forEach((k, i) => {
    const x = kx0 + i * (kw + 0.15);
    rule(s, x, ky, kw, C.rule, 0.5);
    s.addText(k.v, {
      x, y: ky + 0.1, w: kw - 0.5, h: 1.0,
      fontSize: 64, color: C.text,
      fontFace: FONT_DISP, charSpacing: -2,
    });
    s.addText(k.u, {
      x: x + kw - 0.7, y: ky + 0.5, w: 0.7, h: 0.5,
      fontSize: 20, italic: true, color: C.accent,
      fontFace: FONT_DISP, valign: 'middle',
    });
    s.addText(k.l, {
      x, y: ky + 1.15, w: kw, h: 0.35,
      fontSize: 10, color: C.textMute,
      fontFace: FONT_BODY,
    });
  });

  // 하단: 5단계 파이프라인 가로
  const py = 5.0, px0 = MARGIN, pw = (W - 2 * MARGIN) / 5 - 0.1;
  const pipes = [
    { t:'Code',     d:'git push origin main' },
    { t:'Detect',   d:'Auto buildpack 감지' },
    { t:'Build',    d:'Docker · 의존성 설치' },
    { t:'Test',     d:'Smoke + Lint 검증' },
    { t:'Deploy',   d:'CDN 글로벌 배포' },
  ];
  pipes.forEach((p, i) => {
    const x = px0 + i * (pw + 0.12);

    s.addShape('roundRect', {
      x, y: py, w: pw, h: 1.55,
      fill: { color: C.cream },
      line: { color: C.rule, width: 0.5 },
      rectRadius: 0.05,
    });
    s.addText('STEP ' + String(i + 1).padStart(2, '0'), {
      x: x + 0.2, y: py + 0.15, w: pw - 0.3, h: 0.25,
      fontSize: 9, bold: true, color: C.accent,
      fontFace: FONT_MONO, charSpacing: 3,
    });
    s.addText(p.t, {
      x: x + 0.2, y: py + 0.4, w: pw - 0.3, h: 0.5,
      fontSize: 22, color: C.text,
      fontFace: FONT_DISP,
    });
    rule(s, x + 0.2, py + 0.95, 0.4, C.rule, 0.5);
    s.addText(p.d, {
      x: x + 0.2, y: py + 1.05, w: pw - 0.3, h: 0.45,
      fontSize: 10, color: C.textMute,
      fontFace: FONT_BODY,
    });

    // 화살표 (마지막 제외)
    if (i < pipes.length - 1) {
      s.addText('→', {
        x: x + pw - 0.05, y: py + 0.65, w: 0.15, h: 0.3,
        fontSize: 16, bold: true, color: C.accent,
        fontFace: FONT_DISP, align: 'center',
      });
    }
  });

  footer(s, 10);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 11 — DATA INSIGHTS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 11, '06  ·  DATA INSIGHTS');

  s.addText('Three findings,', {
    x: MARGIN, y: 1.0, w: 12, h: 0.9,
    fontSize: 44, color: C.text,
    fontFace: FONT_DISP, charSpacing: -1,
  });
  s.addText('worth your attention.', {
    x: MARGIN, y: 1.85, w: 12, h: 0.9,
    fontSize: 44, italic: true, color: C.accent,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  const insights = [
    {
      n: '01', big: '12K',
      t: '전국 학교 좌표 정밀도',
      d: 'NEIS+OSM+Nominatim 병합 → 12,066개교\n자치구 검증으로 1,608건 좌표 보정.',
      tag: '데이터',
    },
    {
      n: '02', big: '92%',
      t: '국내산 식재료 비중',
      d: '학교알리미 공시 전국 평균. 시도별\n편차 78%~98% — 정책 격차 뚜렷.',
      tag: '식자재',
    },
    {
      n: '03', big: '7.2',
      t: '학부모 만족도 (10점)',
      d: '국내산 비중과 만족도 상관계수 r=0.61.\n국내산↑ 자치구일수록 만족도↑',
      tag: '만족도',
    },
  ];

  const ix0 = MARGIN, iy = 3.4, iw = (W - 2 * MARGIN) / 3 - 0.15;
  insights.forEach((it, i) => {
    const x = ix0 + i * (iw + 0.22);

    s.addShape('roundRect', {
      x, y: iy, w: iw, h: 3.4,
      fill: { color: C.cream },
      line: { color: C.rule, width: 0.5 },
      rectRadius: 0.05,
    });
    s.addText(it.n, {
      x: x + 0.3, y: iy + 0.25, w: 1, h: 0.3,
      fontSize: 10, bold: true, color: C.accent,
      fontFace: FONT_MONO, charSpacing: 4,
    });
    pill(s, x + iw - 1.1, iy + 0.25, it.tag, C.text, C.cream);

    s.addText(it.big, {
      x: x + 0.3, y: iy + 0.7, w: iw - 0.6, h: 1.6,
      fontSize: 96, color: C.text,
      fontFace: FONT_DISP, charSpacing: -3,
    });
    rule(s, x + 0.3, iy + 2.3, iw - 0.6, C.accent, 1);
    s.addText(it.t, {
      x: x + 0.3, y: iy + 2.4, w: iw - 0.6, h: 0.4,
      fontSize: 14, bold: true, color: C.text,
      fontFace: FONT_BODY,
    });
    s.addText(it.d, {
      x: x + 0.3, y: iy + 2.8, w: iw - 0.6, h: 0.6,
      fontSize: 10, color: C.textMute,
      fontFace: FONT_BODY,
    });
  });

  footer(s, 11);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 12 — USER SCENARIOS
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 12, '07  ·  USER SCENARIOS');

  s.addText('Three users,', {
    x: MARGIN, y: 1.0, w: 12, h: 0.9,
    fontSize: 44, color: C.text,
    fontFace: FONT_DISP, charSpacing: -1,
  });
  s.addText('three modes of value.', {
    x: MARGIN, y: 1.85, w: 12, h: 0.9,
    fontSize: 44, italic: true, color: C.accent,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  const personas = [
    {
      n:'P 01', role:'학부모',  en:'A Parent',
      q:'"오늘 아이 점심에 새우가 있나요?"',
      points: ['알레르기 5일 위험 자동 스캔', '가정식 사진 → AI 영양 합산', '자녀 학교 자동 알림 메일'],
    },
    {
      n:'P 02', role:'영양사',  en:'A Nutritionist',
      q:'"다음 주 식단을 빠르게 짜고 싶어요."',
      points: ['AI 식단 자동 설계 (예산·다양성)', '반별 알레르기 호환성 자동 검사', '워드클라우드 피드백 분석'],
    },
    {
      n:'P 03', role:'교육청',  en:'A Public Officer',
      q:'"우리 시도의 영양 사각지대는 어디?"',
      points: ['자치구 GIS 격차 히트맵', 'ESG · 탄소 발자국 랭킹', '12개월 시계열 Racing Chart'],
    },
  ];

  const px0 = MARGIN, py = 3.4, pw = (W - 2 * MARGIN) / 3 - 0.15;
  personas.forEach((p, i) => {
    const x = px0 + i * (pw + 0.22);

    s.addShape('roundRect', {
      x, y: py, w: pw, h: 3.5,
      fill: { color: C.cream },
      line: { color: C.rule, width: 0.5 },
      rectRadius: 0.05,
    });
    s.addText(p.n, {
      x: x + 0.3, y: py + 0.25, w: 2, h: 0.3,
      fontSize: 9, bold: true, color: C.accent,
      fontFace: FONT_MONO, charSpacing: 4,
    });
    s.addText(p.role, {
      x: x + 0.3, y: py + 0.55, w: pw - 0.5, h: 0.6,
      fontSize: 26, color: C.text,
      fontFace: FONT_DISP,
    });
    s.addText(p.en, {
      x: x + 0.3, y: py + 1.1, w: pw - 0.5, h: 0.35,
      fontSize: 12, italic: true, color: C.textMute,
      fontFace: FONT_DISP,
    });
    rule(s, x + 0.3, py + 1.55, 0.5, C.accent, 1);

    s.addText(p.q, {
      x: x + 0.3, y: py + 1.7, w: pw - 0.5, h: 0.6,
      fontSize: 13, italic: true, color: C.text,
      fontFace: FONT_DISP,
    });

    p.points.forEach((pt, j) => {
      const ly = py + 2.4 + j * 0.32;
      s.addShape('ellipse', {
        x: x + 0.35, y: ly + 0.1, w: 0.08, h: 0.08,
        fill: { color: C.accent }, line: { type: 'none' },
      });
      s.addText(pt, {
        x: x + 0.55, y: ly, w: pw - 0.7, h: 0.3,
        fontSize: 10, color: C.text,
        fontFace: FONT_BODY,
      });
    });
  });

  footer(s, 12);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 13 — DIFFERENTIATION (모던 비교 테이블)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 13, '08  ·  DIFFERENTIATION');

  s.addText('Why us,', {
    x: MARGIN, y: 1.0, w: 12, h: 0.9,
    fontSize: 44, color: C.text,
    fontFace: FONT_DISP, charSpacing: -1,
  });
  s.addText('not the others.', {
    x: MARGIN, y: 1.85, w: 12, h: 0.9,
    fontSize: 44, italic: true, color: C.accent,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  // 4 컬럼 표 — 라인 기반 (박스 없음)
  const colX = [MARGIN, MARGIN + 3.3, MARGIN + 6.0, MARGIN + 8.7];
  const colW = [3.1, 2.55, 2.55, W - MARGIN - (MARGIN + 8.7) - 0.05];
  const headerY = 3.2;

  // 헤더 룰
  rule(s, MARGIN, headerY, W - 2 * MARGIN, C.text, 1.2);

  const heads = [
    { eyebrow:'CRITERIA',      label:'비교 항목',           dim:false },
    { eyebrow:'EXISTING APPS', label:'학교종이·맘아이 등',   dim:true  },
    { eyebrow:'GOV PORTAL',    label:'NEIS 직접 조회',       dim:true  },
    { eyebrow:'OURS',          label:'급식 어때?',           dim:false, ours:true },
  ];
  heads.forEach((h, i) => {
    s.addText(h.eyebrow, {
      x: colX[i], y: headerY + 0.1, w: colW[i], h: 0.25,
      fontSize: 8, bold: true, color: h.ours ? C.accent : C.textMute,
      fontFace: FONT_MONO, charSpacing: 4,
    });
    s.addText(h.label, {
      x: colX[i], y: headerY + 0.35, w: colW[i], h: 0.4,
      fontSize: 16, bold: !h.dim, italic: false,
      color: h.ours ? C.accent : (h.dim ? C.textMute : C.text),
      fontFace: FONT_DISP,
    });
  });
  rule(s, MARGIN, headerY + 0.85, W - 2 * MARGIN, C.rule, 0.5);

  const rows = [
    { k:'데이터 소스',     a:'단일 학교',          b:'NEIS 단일',          c:'NEIS+data.go.kr+OSM 병합' },
    { k:'학교 좌표',       a:'없음',                b:'없음',               c:'12,066개교 (99% 커버)' },
    { k:'시각화',          a:'리스트·달력',         b:'없음',               c:'지도·차트·GIS 히트맵·SVG' },
    { k:'AI 영양 분석',    a:'없음',                b:'없음',               c:'3대 LLM 멀티 호스팅' },
    { k:'커뮤니티',        a:'없음',                b:'없음',               c:'학생/학부모 익명 리뷰' },
    { k:'다문화 지원',     a:'없음',                b:'한국어만',           c:'8개 언어 LLM 자동 번역' },
    { k:'모바일 최적화',   a:'단순 반응형',         b:'없음',               c:'풀블리드 + sticky 헤더' },
  ];

  const rowY0 = headerY + 1.0;
  const rowH = 0.45;
  rows.forEach((r, i) => {
    const y = rowY0 + i * rowH;

    // 좌측 라벨
    s.addText(r.k, {
      x: colX[0], y: y + 0.05, w: colW[0], h: rowH - 0.1,
      fontSize: 12, bold: true, color: C.text,
      fontFace: FONT_BODY, valign: 'middle',
    });
    // 기존
    s.addText('— ' + r.a, {
      x: colX[1], y: y + 0.05, w: colW[1], h: rowH - 0.1,
      fontSize: 11, color: C.textMute,
      fontFace: FONT_BODY, valign: 'middle',
    });
    // NEIS
    s.addText('— ' + r.b, {
      x: colX[2], y: y + 0.05, w: colW[2], h: rowH - 0.1,
      fontSize: 11, color: C.textMute,
      fontFace: FONT_BODY, valign: 'middle',
    });
    // Ours
    s.addText('● ' + r.c, {
      x: colX[3], y: y + 0.05, w: colW[3], h: rowH - 0.1,
      fontSize: 11, bold: true, color: C.accent,
      fontFace: FONT_BODY, valign: 'middle',
    });
    rule(s, MARGIN, y + rowH - 0.05, W - 2 * MARGIN, C.rule, 0.3);
  });

  footer(s, 13);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 14 — IMPACT & ROADMAP
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.paper);
  header(s, 14, '09  ·  IMPACT  &  ROADMAP');

  s.addText('What changes,', {
    x: MARGIN, y: 1.0, w: 12, h: 0.9,
    fontSize: 44, color: C.text,
    fontFace: FONT_DISP, charSpacing: -1,
  });
  s.addText('and what comes next.', {
    x: MARGIN, y: 1.85, w: 12, h: 0.9,
    fontSize: 44, italic: true, color: C.accent,
    fontFace: FONT_DISP, charSpacing: -1,
  });

  // 좌측: 4 임팩트
  const impacts = [
    { n:'01', t:'학부모',   d:'알레르기 사고 0건 / 만족도 20%↑' },
    { n:'02', t:'영양사',   d:'식단 설계 시간 70% 단축' },
    { n:'03', t:'교육청',   d:'영양 사각지대 GIS 자동 발견' },
    { n:'04', t:'학생',     d:'다문화 가정 8개 언어 접근성' },
  ];
  const ix = MARGIN, iy = 3.2;
  impacts.forEach((m, i) => {
    const y = iy + i * 0.7;
    rule(s, ix, y, 6.3, C.rule, 0.5);
    s.addText(m.n, {
      x: ix, y: y + 0.1, w: 0.7, h: 0.4,
      fontSize: 10, bold: true, color: C.accent,
      fontFace: FONT_MONO, charSpacing: 3,
    });
    s.addText(m.t, {
      x: ix + 0.7, y: y + 0.05, w: 1.5, h: 0.45,
      fontSize: 18, color: C.text,
      fontFace: FONT_DISP,
    });
    s.addText(m.d, {
      x: ix + 2.3, y: y + 0.1, w: 4.0, h: 0.45,
      fontSize: 11, color: C.textMute,
      fontFace: FONT_BODY,
    });
  });
  rule(s, ix, iy + 4 * 0.7, 6.3, C.rule, 0.5);

  // 우측: 12개월 로드맵 — 4분기
  const rx = 7.4, ry = 3.2;
  s.addText('12-MONTH ROADMAP', {
    x: rx, y: ry - 0.05, w: 5, h: 0.3,
    fontSize: 9, bold: true, color: C.textMute,
    fontFace: FONT_MONO, charSpacing: 4,
  });

  const quarters = [
    { q:'Q1', t:'베타 오픈',      d:'2026.01 — 03\n5개 시도 우선 적용' },
    { q:'Q2', t:'전국 확장',      d:'2026.04 — 06\n17개 시도 전체 커버' },
    { q:'Q3', t:'영양사 PRO',     d:'2026.07 — 09\nB2B 유료 출시' },
    { q:'Q4', t:'정책 대시보드',  d:'2026.10 — 12\n교육청 라이선스 모델' },
  ];

  // 가로 룰 + 노드
  const lineY = ry + 0.95;
  rule(s, rx, lineY, 5.2, C.rule, 1);
  const stepW = 5.2 / quarters.length;

  quarters.forEach((q, i) => {
    const x = rx + i * stepW;

    s.addShape('ellipse', {
      x: x + 0.05, y: lineY - 0.08, w: 0.16, h: 0.16,
      fill: { color: i === 0 ? C.accent : C.text }, line: { type: 'none' },
    });

    s.addText(q.q, {
      x, y: ry + 0.4, w: stepW, h: 0.3,
      fontSize: 10, bold: true, color: C.accent,
      fontFace: FONT_MONO, charSpacing: 3,
    });
    s.addText(q.t, {
      x, y: lineY + 0.2, w: stepW, h: 0.5,
      fontSize: 16, color: C.text,
      fontFace: FONT_DISP,
    });
    s.addText(q.d, {
      x, y: lineY + 0.75, w: stepW - 0.1, h: 0.7,
      fontSize: 9, color: C.textMute,
      fontFace: FONT_BODY,
    });
  });

  // 우측 하단 — 미션 카피
  s.addText('"공공데이터를 누구나\n이해할 수 있는 언어로."', {
    x: rx, y: ry + 3.3, w: 5.2, h: 1.0,
    fontSize: 18, italic: true, color: C.text,
    fontFace: FONT_DISP,
  });

  footer(s, 14);
}

// ═══════════════════════════════════════════════════════════════════════════
// SLIDE 15 — CLOSING (DARK)
// ═══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  bg(s, C.ink);
  header(s, 15, 'FIN  ·  THANK YOU', true);

  // 좌측 큰 카피
  s.addText('Thank', {
    x: MARGIN, y: 1.5, w: 8, h: 2.0,
    fontSize: 180, color: 'FFFFFF',
    fontFace: FONT_DISP, charSpacing: -6,
  });
  s.addText('you.', {
    x: MARGIN, y: 3.4, w: 8, h: 2.0,
    fontSize: 180, italic: true, color: C.accent,
    fontFace: FONT_DISP, charSpacing: -6,
  });

  s.addText('감사합니다.', {
    x: MARGIN, y: 5.4, w: 7, h: 0.7,
    fontSize: 22, color: 'CACAD2',
    fontFace: FONT_BODY,
  });

  // 우측 메타
  rule(s, W - MARGIN - 4.5, 1.5, 4.5, '3A3A45', 0.5);

  s.addText('LIVE DEMO', {
    x: W - MARGIN - 4.5, y: 1.65, w: 4.5, h: 0.3,
    fontSize: 9, bold: true, color: '6B6B7A',
    fontFace: FONT_MONO, charSpacing: 4,
  });
  s.addText('kmeal-production', {
    x: W - MARGIN - 4.5, y: 1.95, w: 4.5, h: 0.4,
    fontSize: 18, color: 'FFFFFF',
    fontFace: FONT_DISP,
  });
  s.addText('.up.railway.app', {
    x: W - MARGIN - 4.5, y: 2.35, w: 4.5, h: 0.3,
    fontSize: 12, italic: true, color: C.accent2,
    fontFace: FONT_DISP,
  });

  rule(s, W - MARGIN - 4.5, 2.85, 4.5, '3A3A45', 0.5);

  s.addText('TEAM PANTERA', {
    x: W - MARGIN - 4.5, y: 3.0, w: 4.5, h: 0.3,
    fontSize: 9, bold: true, color: '6B6B7A',
    fontFace: FONT_MONO, charSpacing: 4,
  });
  s.addText('박준범', {
    x: W - MARGIN - 4.5, y: 3.35, w: 4.5, h: 0.35,
    fontSize: 16, color: 'FFFFFF',
    fontFace: FONT_BODY,
  });
  s.addText('박세윤', {
    x: W - MARGIN - 4.5, y: 3.7, w: 4.5, h: 0.35,
    fontSize: 16, color: 'FFFFFF',
    fontFace: FONT_BODY,
  });
  s.addText('박정원', {
    x: W - MARGIN - 4.5, y: 4.05, w: 4.5, h: 0.35,
    fontSize: 16, color: 'FFFFFF',
    fontFace: FONT_BODY,
  });

  rule(s, W - MARGIN - 4.5, 4.55, 4.5, '3A3A45', 0.5);

  s.addText('TECH', {
    x: W - MARGIN - 4.5, y: 4.7, w: 4.5, h: 0.3,
    fontSize: 9, bold: true, color: '6B6B7A',
    fontFace: FONT_MONO, charSpacing: 4,
  });
  s.addText('React 18 · Leaflet · Chart.js · SVG\nClaude · GPT · Gemini · Web Speech · LLM i18n\nNEIS · data.go.kr · OSM · Nominatim · Railway', {
    x: W - MARGIN - 4.5, y: 5.0, w: 4.5, h: 1.2,
    fontSize: 10, color: 'AAAAB2',
    fontFace: FONT_BODY,
  });

  // 하단 인용
  rule(s, MARGIN, 6.4, W - 2 * MARGIN, C.ruleD, 0.5);
  s.addText('"Public data, in plain language."', {
    x: MARGIN, y: 6.55, w: 8, h: 0.4,
    fontSize: 14, italic: true, color: C.accent2,
    fontFace: FONT_DISP,
  });
  s.addText('판테라  ·  PANTERA            제8회 교육 공공데이터 AI 활용대회  ·  2026', {
    x: W - MARGIN - 7.0, y: 6.55, w: 7.0, h: 0.4,
    fontSize: 10, color: '6B6B7A',
    fontFace: FONT_MONO, charSpacing: 3, align: 'right',
  });
}

// ═══════════════════════════════════════════
pres.writeFile({ fileName: '급식어때_판테라_제안서_modern_v3.pptx' })
  .then(name => console.log('✓ Created:', name));

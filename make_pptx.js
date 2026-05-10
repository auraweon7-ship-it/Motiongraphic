// 급식 어때? — 제8회 교육 공공데이터 AI 활용대회 발표자료
// 팀 판테라 (박준범, 박세윤)
const pptxgen = require('pptxgenjs');
const pres = new pptxgen();

// 슬라이드 사이즈: 16:9 widescreen (13.33" x 7.5")
pres.layout = 'LAYOUT_WIDE';
pres.title = '급식 어때? — 제8회 교육 공공데이터 AI 활용대회';
pres.author = '판테라 (박준범, 박세윤)';

// 컬러 팔레트 — 앱과 동기화 (블루-보라-그린)
const C = {
  primary:   '0066FF', // 메인 블루 (앱 헤더)
  primary_d: '0050CC', // 짙은 블루
  purple:    '9747FF', // 보라 AI
  purple_d:  '6E2DD9',
  green:     '00BF40', // 그린 환경
  red:       'FF4242',
  orange:    'FF7700',
  yellow:    'FFC700',
  cyan:      '0098B2',
  pink:      'FF6B9D',
  navy:      '0A0E1A', // 헤로 다크 배경
  navy2:     '141828',
  cream:     'FAF9F7',
  light:     'F5F6FA',
  text:      '1A1A1F',
  textLight: '6B7280',
  white:     'FFFFFF',
  border:    'E5E7EB',
};

const F = {
  display:'Pretendard JP',
  body: 'Pretendard',
  fallback: 'Malgun Gothic',
};

// 폰트 fallback 처리
const FACE_DISPLAY = 'Malgun Gothic';
const FACE_BODY = 'Malgun Gothic';

// ─────────────────────────────────────
// 공통 컴포넌트
// ─────────────────────────────────────
function addBg(slide, color) {
  slide.background = { color };
}

function addTitle(slide, text, opts = {}) {
  const o = Object.assign({
    x: 0.5, y: 0.4, w: 12.3, h: 0.7,
    fontSize: 32, bold: true, color: C.text,
    fontFace: FACE_DISPLAY,
    align: 'left',
  }, opts);
  slide.addText(text, o);
}

function addSubtitle(slide, text, opts = {}) {
  const o = Object.assign({
    x: 0.5, y: 1.05, w: 12.3, h: 0.4,
    fontSize: 14, color: C.textLight,
    fontFace: FACE_BODY,
  }, opts);
  slide.addText(text, o);
}

// 페이지 번호 + 푸터
function addFooter(slide, pageNum, totalPages, pageColor = C.textLight) {
  slide.addText('급식 어때? · 판테라', {
    x: 0.5, y: 7.05, w: 6, h: 0.3,
    fontSize: 9, color: pageColor, fontFace: FACE_BODY,
  });
  slide.addText(`${pageNum} / ${totalPages}`, {
    x: 12.0, y: 7.05, w: 0.83, h: 0.3,
    fontSize: 9, color: pageColor, fontFace: FACE_BODY, align: 'right',
  });
}

// 컬러 칩 (이모지 + 라벨)
function addEmojiChip(slide, x, y, w, h, emoji, label, bg, fg) {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: bg }, line: { color: bg },
    rectRadius: 0.08,
  });
  slide.addText([
    { text: emoji + '  ', options: { fontSize: 16 } },
    { text: label, options: { fontSize: 12, bold: true, color: fg, fontFace: FACE_BODY } },
  ], { x, y, w, h, align: 'left', valign: 'middle', margin: 0.12 });
}

// 라운드 카드
function addCard(slide, x, y, w, h, opts = {}) {
  slide.addShape('roundRect', Object.assign({
    x, y, w, h,
    fill: { color: C.white },
    line: { color: C.border, width: 0.5 },
    rectRadius: 0.12,
  }, opts.shape || {}));
}

// 통계 큰 숫자 카드
function addStatCard(slide, x, y, w, h, num, label, color) {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { color: C.white },
    line: { color: C.border, width: 0.5 },
    rectRadius: 0.12,
  });
  slide.addText(num, {
    x: x+0.15, y: y+0.18, w: w-0.3, h: 0.7,
    fontSize: 36, bold: true, color, fontFace: FACE_DISPLAY,
    align: 'left',
  });
  slide.addText(label, {
    x: x+0.15, y: y+0.85, w: w-0.3, h: 0.4,
    fontSize: 11, color: C.textLight, fontFace: FACE_BODY,
    align: 'left',
  });
}

// 그라디언트 헤로 배경 (rect)
function addHeroBg(slide, x, y, w, h, color1, color2) {
  // pptxgenjs는 그라디언트 미지원이라 단색으로 대체
  slide.addShape('rect', {
    x, y, w, h,
    fill: { color: color1 },
    line: { type: 'none' },
  });
  // 두 번째 컬러를 살짝 겹쳐 효과
  slide.addShape('rect', {
    x: x + w*0.5, y, w: w*0.5, h,
    fill: { color: color2, transparency: 35 },
    line: { type: 'none' },
  });
}

const TOTAL = 15;

// ═══════════════════════════════════════════
// 슬라이드 1: 표지
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.navy);
  // 좌측 컬러 띠
  s.addShape('rect', { x:0, y:0, w:0.3, h:7.5, fill:{color:C.primary}, line:{type:'none'} });
  s.addShape('rect', { x:0.3, y:0, w:0.15, h:7.5, fill:{color:C.purple}, line:{type:'none'} });

  // ─────────────────────────────────────
  // iPhone 앱 목업 (우측, 표지 우측 영역)
  // ─────────────────────────────────────
  const mx = 8.7;   // mockup x
  const my = 0.5;   // mockup y
  const mw = 4.0;   // mockup width
  const mh = 6.5;   // mockup height
  // 외곽 그림자
  s.addShape('roundRect', { x: mx+0.08, y: my+0.12, w: mw, h: mh, fill:{color:'000000', transparency:60}, line:{type:'none'}, rectRadius:0.5 });
  // iPhone 프레임 (검정)
  s.addShape('roundRect', { x: mx, y: my, w: mw, h: mh, fill:{color:'1a1a1a'}, line:{color:'2a2a2a', width:0.5}, rectRadius:0.5 });
  // 베젤 안쪽 화이트 화면
  s.addShape('roundRect', { x: mx+0.1, y: my+0.1, w: mw-0.2, h: mh-0.2, fill:{color:'FAFAFC'}, line:{type:'none'}, rectRadius:0.42 });
  // 노치 (다이내믹 아일랜드 스타일)
  s.addShape('roundRect', { x: mx+mw/2-0.45, y: my+0.18, w: 0.9, h: 0.22, fill:{color:'000000'}, line:{type:'none'}, rectRadius:0.11 });

  // 상단 헤더 (앱 로고 + 타이틀 + Skip)
  const cx = mx + 0.25;  // content x
  const cw = mw - 0.5;   // content width
  s.addShape('roundRect', { x: cx, y: my+0.6, w: 0.42, h: 0.42, fill:{color:C.primary}, line:{type:'none'}, rectRadius:0.08 });
  s.addText('🍱', { x: cx, y: my+0.6, w: 0.42, h: 0.42, fontSize:14, color:'FFFFFF', align:'center', valign:'middle', fontFace:FACE_BODY });
  s.addText('급식 어때?', { x: cx+0.5, y: my+0.6, w: 1.5, h: 0.22, fontSize:11, bold:true, color:C.text, fontFace:FACE_BODY });
  s.addText('SCHOOL  MEAL  COMPASS', { x: cx+0.5, y: my+0.82, w: 1.8, h: 0.17, fontSize:6, bold:true, color:C.primary, fontFace:FACE_BODY, charSpacing:2 });
  // 건너뛰기 (작게)
  s.addShape('roundRect', { x: cx+cw-0.7, y: my+0.7, w: 0.7, h: 0.25, fill:{color:'F0F0F4'}, line:{color:C.border, width:0.4}, rectRadius:0.13 });
  s.addText('건너뛰기', { x: cx+cw-0.7, y: my+0.7, w: 0.7, h: 0.25, fontSize:7, color:C.textLight, align:'center', valign:'middle', fontFace:FACE_BODY });

  // 콘테스트 배지
  s.addShape('roundRect', { x: cx+0.3, y: my+1.15, w: cw-0.6, h: 0.28, fill:{color:'EAF1FF'}, line:{color:C.primary, width:0.4}, rectRadius:0.14 });
  s.addText('● 제8회 교육 공공데이터 AI 활용대회 출품작', { x: cx+0.3, y: my+1.15, w: cw-0.6, h: 0.28, fontSize:7, bold:true, color:C.primary, align:'center', valign:'middle', fontFace:FACE_BODY });

  // 태그 (소제목)
  s.addText('🗺  NATIONAL MEAL MAP', { x: cx, y: my+1.6, w: cw, h: 0.18, fontSize:7, bold:true, color:C.primary, fontFace:FACE_BODY, charSpacing:2 });
  s.addText('실시간 급식 지도', { x: cx, y: my+1.78, w: cw, h: 0.18, fontSize:8, bold:true, color:C.textLight, fontFace:FACE_BODY });

  // 메인 타이틀
  s.addText('오늘 우리 아이가\n뭘 먹는지 아세요?', {
    x: cx, y: my+2.0, w: cw, h: 0.85,
    fontSize: 18, bold:true, color:C.text, fontFace:FACE_DISPLAY, charSpacing:-1,
  });

  // 부제
  s.addText('전국 12,066개 학교의 급식을\n클릭 한 번으로 확인 · 알레르기 자동', {
    x: cx, y: my+2.95, w: cw, h: 0.55,
    fontSize: 8, color:C.textLight, fontFace:FACE_BODY,
  });

  // ── 식판 일러스트 (앱과 동일한 5칸 미니 버전) ──
  const tx = mx + mw/2 - 1.05; // tray x (centered)
  const ty = my + 3.7;
  const tw = 2.1;
  const th = 0.95;
  // 식판 그림자
  s.addShape('ellipse', { x: tx-0.05, y: ty+th, w: tw+0.1, h: 0.18, fill:{color:'000000', transparency:80}, line:{type:'none'} });
  // 식판 본체 (트라페조이드)
  s.addShape('rect', { x: tx, y: ty, w: tw, h: th, fill:{color:'F5DEAA'}, line:{color:'A8884E', width:0.6} });
  // 칸막이
  s.addShape('rect', { x: tx+tw/2-0.005, y: ty+0.05, w: 0.01, h: th-0.1, fill:{color:'A8884E'}, line:{type:'none'} });
  s.addShape('rect', { x: tx+0.05, y: ty+th/2-0.005, w: tw-0.1, h: 0.01, fill:{color:'A8884E'}, line:{type:'none'} });
  // 밥 (좌상)
  s.addShape('ellipse', { x: tx+0.15, y: ty+0.1, w: 0.4, h: 0.28, fill:{color:'FFFFFF'}, line:{color:'8B5A2C', width:0.5} });
  s.addShape('ellipse', { x: tx+0.18, y: ty+0.13, w: 0.34, h: 0.2, fill:{color:'FFF8E8'}, line:{type:'none'} });
  // 국 (우상)
  s.addShape('ellipse', { x: tx+1.05, y: ty+0.1, w: 0.4, h: 0.28, fill:{color:'5A8A3E'}, line:{color:'1F4828', width:0.5} });
  // 김치 (좌하)
  s.addShape('ellipse', { x: tx+0.15, y: ty+0.55, w: 0.4, h: 0.28, fill:{color:'FFFFFF'}, line:{color:'A8884E', width:0.4} });
  s.addShape('rect', { x: tx+0.22, y: ty+0.62, w: 0.1, h: 0.1, fill:{color:'C4302A'}, line:{type:'none'} });
  s.addShape('rect', { x: tx+0.34, y: ty+0.62, w: 0.1, h: 0.1, fill:{color:'A82420'}, line:{type:'none'} });
  s.addShape('rect', { x: tx+0.28, y: ty+0.72, w: 0.09, h: 0.09, fill:{color:'E23A2E'}, line:{type:'none'} });
  // 나물 (중하)
  s.addShape('ellipse', { x: tx+0.85, y: ty+0.55, w: 0.4, h: 0.28, fill:{color:'FFFFFF'}, line:{color:'A8884E', width:0.4} });
  s.addShape('ellipse', { x: tx+0.92, y: ty+0.62, w: 0.25, h: 0.15, fill:{color:'5A8A3E'}, line:{type:'none'} });
  // 고기 (우하)
  s.addShape('ellipse', { x: tx+1.55, y: ty+0.55, w: 0.4, h: 0.28, fill:{color:'FFFFFF'}, line:{color:'A8884E', width:0.4} });
  s.addShape('rect', { x: tx+1.6, y: ty+0.66, w: 0.3, h: 0.06, fill:{color:'C44A3E'}, line:{type:'none'} });
  // NEIS LIVE 배지
  s.addShape('roundRect', { x: tx, y: ty-0.32, w: 0.7, h: 0.22, fill:{color:'00BF40'}, line:{type:'none'}, rectRadius:0.11 });
  s.addText('● NEIS LIVE', { x: tx, y: ty-0.32, w: 0.7, h: 0.22, fontSize:6, bold:true, color:'FFFFFF', align:'center', valign:'middle', fontFace:FACE_BODY });
  // 떠다니는 핀
  s.addShape('roundRect', { x: tx+tw-0.18, y: ty-0.42, w: 0.22, h: 0.3, fill:{color:'FF4242'}, line:{color:'FFFFFF', width:0.5}, rectRadius:0.11 });
  s.addText('★', { x: tx+tw-0.18, y: ty-0.42, w: 0.22, h: 0.3, fontSize:8, color:'FFFFFF', align:'center', valign:'middle', fontFace:FACE_BODY });

  // ── 통계 3개 카드 ──
  const sx0 = cx;
  const sy = my + 4.85;
  const sw = (cw - 0.16) / 3;
  const stats3 = [
    { v:'12,066', l:'전국 학교' },
    { v:'17',     l:'시도교육청' },
    { v:'24h',    l:'NEIS LIVE' },
  ];
  stats3.forEach((st, i) => {
    const x = sx0 + i * (sw + 0.08);
    s.addShape('roundRect', { x, y: sy, w: sw, h: 0.55, fill:{color:'FFFFFF'}, line:{color:'B8C9E0', width:0.5}, rectRadius:0.08 });
    s.addText(st.v, { x, y: sy+0.04, w: sw, h: 0.28, fontSize:11, bold:true, color:C.text, align:'center', valign:'middle', fontFace:FACE_DISPLAY });
    s.addText(st.l, { x, y: sy+0.32, w: sw, h: 0.2, fontSize:6, bold:true, color:C.textLight, align:'center', valign:'middle', fontFace:FACE_BODY });
  });

  // proof 배지
  s.addShape('roundRect', { x: cx+cw/2-0.85, y: sy+0.62, w: 1.7, h: 0.24, fill:{color:'F0F4FA'}, line:{color:C.primary, width:0.4}, rectRadius:0.12 });
  s.addText('✓ 전국 모든 시도 99% 커버', { x: cx+cw/2-0.85, y: sy+0.62, w: 1.7, h: 0.24, fontSize:6, bold:true, color:C.primary, align:'center', valign:'middle', fontFace:FACE_BODY });

  // 페이지네이션 도트
  s.addShape('roundRect', { x: mx+mw/2-0.32, y: my+5.85, w: 0.22, h: 0.06, fill:{color:C.primary}, line:{type:'none'}, rectRadius:0.03 });
  s.addShape('ellipse', { x: mx+mw/2-0.05, y: my+5.86, w: 0.05, h: 0.05, fill:{color:'D0D5DD'}, line:{type:'none'} });
  s.addShape('ellipse', { x: mx+mw/2+0.05, y: my+5.86, w: 0.05, h: 0.05, fill:{color:'D0D5DD'}, line:{type:'none'} });

  // CTA 버튼
  s.addShape('roundRect', { x: cx+0.1, y: my+6.0, w: cw-0.2, h: 0.4, fill:{color:C.primary}, line:{type:'none'}, rectRadius:0.1 });
  s.addText('다음으로 →', { x: cx+0.1, y: my+6.0, w: cw-0.2, h: 0.4, fontSize:9, bold:true, color:'FFFFFF', align:'center', valign:'middle', fontFace:FACE_BODY });

  // 하단 인디케이터 바 (홈 인디케이터)
  s.addShape('roundRect', { x: mx+mw/2-0.4, y: my+mh-0.18, w: 0.8, h: 0.05, fill:{color:'D0D5DD'}, line:{type:'none'}, rectRadius:0.025 });

  // 대회 라벨
  s.addShape('roundRect', {
    x: 1.0, y: 1.0, w: 4.5, h: 0.4,
    fill: { color: C.primary },
    line: { type:'none' },
    rectRadius: 0.2,
  });
  s.addText('제8회 교육 공공데이터 AI 활용대회', {
    x: 1.0, y: 1.0, w: 4.5, h: 0.4,
    fontSize: 11, bold: true, color: C.white,
    fontFace: FACE_BODY, align:'center', valign:'middle',
  });

  // 메인 타이틀
  s.addText('급식 어때?', {
    x: 1.0, y: 1.6, w: 7.5, h: 1.5,
    fontSize: 88, bold: true, color: C.white,
    fontFace: FACE_DISPLAY, charSpacing: -4,
  });
  s.addText('SCHOOL  MEAL  COMPASS', {
    x: 1.0, y: 3.05, w: 7.5, h: 0.4,
    fontSize: 13, bold: true, color: C.primary,
    fontFace: FACE_BODY, charSpacing: 6,
  });

  // 서브 타이틀
  s.addText('AI 기반 학교급식 데이터 통합 플랫폼', {
    x: 1.0, y: 3.55, w: 7.5, h: 0.5,
    fontSize: 21, color: 'CADCFC',
    fontFace: FACE_BODY,
  });
  s.addText('NEIS · data.go.kr · 학교알리미\n+ 3대 LLM (Claude · GPT · Gemini)', {
    x: 1.0, y: 4.05, w: 7.5, h: 0.7,
    fontSize: 12, color: '8FA0BB',
    fontFace: FACE_BODY,
  });

  // 팀 정보 카드 (좌측 하단)
  s.addShape('roundRect', {
    x: 1.0, y: 5.0, w: 3.6, h: 1.5,
    fill: { color: '141828' },
    line: { color: C.primary, width: 1 },
    rectRadius: 0.12,
  });
  s.addText('팀 판테라  PANTERA', {
    x: 1.2, y: 5.1, w: 3.4, h: 0.3,
    fontSize: 10, bold: true, color: C.primary,
    fontFace: FACE_BODY, charSpacing: 3,
  });
  s.addText([
    { text: '박준범 ', options: { bold: true, color: C.white, fontSize: 15 }},
    { text: '· ', options: { color: '6B7280', fontSize: 15 }},
    { text: '박세윤', options: { bold: true, color: C.white, fontSize: 15 }},
  ], {
    x: 1.2, y: 5.5, w: 3.4, h: 0.4,
    fontFace: FACE_BODY,
  });
  s.addText('2026년 5월 · 제출 자료', {
    x: 1.2, y: 6.05, w: 3.4, h: 0.3,
    fontSize: 9, color: '8FA0BB', fontFace: FACE_BODY,
  });

  // APP 도메인 카드 (좌측 하단 우측)
  s.addShape('roundRect', {
    x: 4.85, y: 5.0, w: 3.6, h: 1.5,
    fill: { color: '141828' },
    line: { color: C.green, width: 1 },
    rectRadius: 0.12,
  });
  s.addShape('ellipse', {
    x: 5.05, y: 5.62, w: 0.14, h: 0.14,
    fill: { color: C.green }, line: { type:'none' },
  });
  s.addText('APP  ·  LIVE', {
    x: 5.3, y: 5.1, w: 3.0, h: 0.3,
    fontSize: 10, bold: true, color: C.green,
    fontFace: FACE_BODY, charSpacing: 3,
  });
  s.addText('kmeal.kr', {
    x: 5.3, y: 5.45, w: 3.0, h: 0.5,
    fontSize: 24, bold: true, color: C.white,
    fontFace: FACE_DISPLAY, charSpacing: -1,
  });
  s.addText('전국 12,066개 학교 실시간', {
    x: 5.05, y: 6.05, w: 3.3, h: 0.3,
    fontSize: 9, color: '8FA0BB', fontFace: FACE_BODY,
  });
}

// ═══════════════════════════════════════════
// 슬라이드 2: 목차
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, 'CONTENTS  목차');
  s.addShape('rect', { x:0.5, y:1.05, w:1.5, h:0.04, fill:{color:C.primary}, line:{type:'none'} });

  const items = [
    { n:'01', t:'프로젝트 개요',         d:'배경 · 핵심 가치 제안',        c:C.primary },
    { n:'02', t:'문제 정의',             d:'현황 분석 · 주요 문제점',     c:C.purple  },
    { n:'03', t:'AI 솔루션 아키텍처',    d:'3-Layer 시스템 + 핵심 기능', c:C.green   },
    { n:'04', t:'기술 스택',             d:'NEIS · data.go.kr · 3대 LLM',  c:C.cyan    },
    { n:'05', t:'개발 파이프라인',       d:'Figma → Claude → GitHub → Railway', c:C.orange },
    { n:'06', t:'데이터 분석 결과',      d:'주요 인사이트 · 통계',         c:C.pink    },
    { n:'07', t:'사용자 시나리오',       d:'학부모 · 영양사 · 교육청',    c:C.primary },
    { n:'08', t:'차별성',                d:'기존 급식 앱과의 비교',         c:C.purple  },
    { n:'09', t:'기대효과 및 로드맵',    d:'사회적 가치 · 12개월 계획',  c:C.green   },
  ];

  // 3x3 그리드
  items.forEach((it, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 4.15;
    const y = 1.7 + row * 1.65;
    const w = 4.0;
    const h = 1.45;

    s.addShape('roundRect', {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.12,
    });
    // 좌측 컬러 띠
    s.addShape('rect', { x, y:y+0.15, w:0.08, h:h-0.3, fill:{color:it.c}, line:{type:'none'} });
    // 번호
    s.addText(it.n, {
      x: x+0.25, y: y+0.18, w: 1.2, h: 0.5,
      fontSize: 28, bold: true, color: it.c,
      fontFace: FACE_DISPLAY,
    });
    // 제목
    s.addText(it.t, {
      x: x+0.25, y: y+0.68, w: w-0.4, h: 0.4,
      fontSize: 16, bold: true, color: C.text,
      fontFace: FACE_BODY,
    });
    // 설명
    s.addText(it.d, {
      x: x+0.25, y: y+1.0, w: w-0.4, h: 0.35,
      fontSize: 11, color: C.textLight,
      fontFace: FACE_BODY,
    });
  });

  addFooter(s, 2, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 3: 프로젝트 개요
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '01  프로젝트 개요');
  addSubtitle(s, '전국 학교급식 정보를 한눈에, AI 기반 데이터 통합 플랫폼');

  // 배경 카드
  s.addShape('roundRect', {
    x:0.5, y:1.7, w:6.0, h:2.6,
    fill:{color:C.white}, line:{color:C.border, width:0.5}, rectRadius:0.12,
  });
  s.addText('💡  배경', {
    x:0.7, y:1.85, w:5.6, h:0.45,
    fontSize:16, bold:true, color:C.primary, fontFace:FACE_BODY,
  });
  s.addText([
    { text:'전국 12,066개 학교의 급식 정보가 ', options:{}},
    { text:'17개 시도교육청별로 분산', options:{ bold:true, color:C.purple }},
    { text:'\n• 학부모는 자녀 학교 급식 확인이 어렵고', options:{}},
    { text:'\n• 교육청은 통합 모니터링 도구 부재', options:{}},
    { text:'\n• 영양사·교사는 데이터 기반 의사결정 한계', options:{}},
  ], {
    x:0.7, y:2.4, w:5.6, h:1.85,
    fontSize:13, color:C.text, fontFace:FACE_BODY,
    paraSpaceAfter: 4,
  });

  // 핵심 가치 카드
  s.addShape('roundRect', {
    x:6.83, y:1.7, w:6.0, h:2.6,
    fill:{color:C.navy}, line:{type:'none'}, rectRadius:0.12,
  });
  s.addText('🎯  핵심 가치 제안', {
    x:7.03, y:1.85, w:5.6, h:0.45,
    fontSize:16, bold:true, color:'CADCFC', fontFace:FACE_BODY,
  });
  const values = [
    '✓  전국 학교급식 데이터 한눈에 시각화 (Leaflet GIS)',
    '✓  3대 LLM 기반 AI 분석 — Claude · GPT · Gemini',
    '✓  알레르기 안전망 · 다문화 8개 언어 지원',
    '✓  교육청 정책 의사결정 대시보드 (B2G)',
  ];
  s.addText(values.join('\n'), {
    x:7.03, y:2.4, w:5.6, h:1.85,
    fontSize:12, color:C.white, fontFace:FACE_BODY,
    lineSpacing: 22,
  });

  // 핵심 수치 4개
  const stats = [
    { n:'12,066', l:'전국 학교 좌표 (NEIS+OSM)',c:C.primary },
    { n:'99%+',   l:'NEIS 17개 시도 커버율',     c:C.purple  },
    { n:'92%',    l:'국내산 식재료 비율',         c:C.green   },
    { n:'785',    l:'평균 칼로리 (kcal)',         c:C.orange  },
  ];
  stats.forEach((st, i) => {
    addStatCard(s, 0.5 + i*3.13, 4.55, 2.97, 1.6, st.n, st.l, st.c);
  });

  // 라벨
  s.addText('PROJECT  KEY  METRICS', {
    x:0.5, y:6.3, w:12.3, h:0.3,
    fontSize:9, bold:true, color:C.textLight, fontFace:FACE_BODY,
    charSpacing:4,
  });

  addFooter(s, 3, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 4: 문제 정의
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '02  문제 정의');
  addSubtitle(s, '학부모·교육청·영양사가 공통으로 겪는 4가지 문제');

  const probs = [
    {
      n:'01', e:'🌐', t:'데이터 파편화',
      desc:'17개 시도교육청별 시스템 분산\n학부모는 개별 사이트 접속 필요\n포맷·제공 방식 통일성 부족',
      c:C.red,
    },
    {
      n:'02', e:'📱', t:'정보 접근성 부족',
      desc:'PC 중심 설계, 모바일 UX 저조\n비직관적 UI로 이탈률 높음\n실시간 알림 기능 부재',
      c:C.orange,
    },
    {
      n:'03', e:'📊', t:'분석 도구 부재',
      desc:'영양 트렌드·원산지 통계 미비\n교육청 정책 근거 데이터 부족\n학교별 비교 분석 불가능',
      c:C.purple,
    },
    {
      n:'04', e:'⏱', t:'실시간성 부족',
      desc:'급식 변경사항 즉시 반영 안 됨\n알레르기 사전 확인 어려움\n학생·학부모 피드백 시스템 부재',
      c:C.cyan,
    },
  ];

  probs.forEach((p, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 6.33;
    const y = 1.7 + row * 2.5;
    const w = 6.0;
    const h = 2.3;

    s.addShape('roundRect', {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.12,
    });
    // 좌측 컬러
    s.addShape('rect', { x, y:y+0.2, w:0.1, h:h-0.4, fill:{color:p.c}, line:{type:'none'} });
    // 이모지 박스
    s.addShape('roundRect', {
      x: x+0.3, y: y+0.3, w: 0.9, h: 0.9,
      fill: { color: p.c, transparency: 88 },
      line: { type:'none' },
      rectRadius: 0.1,
    });
    s.addText(p.e, {
      x: x+0.3, y: y+0.3, w: 0.9, h: 0.9,
      fontSize: 32, align: 'center', valign: 'middle',
    });
    // 번호
    s.addText('PROBLEM ' + p.n, {
      x: x+1.35, y: y+0.3, w: 4.5, h: 0.3,
      fontSize: 10, bold: true, color: p.c,
      fontFace: FACE_BODY, charSpacing: 3,
    });
    // 제목
    s.addText(p.t, {
      x: x+1.35, y: y+0.6, w: 4.5, h: 0.5,
      fontSize: 20, bold: true, color: C.text,
      fontFace: FACE_BODY,
    });
    // 설명
    s.addText(p.desc, {
      x: x+0.3, y: y+1.3, w: w-0.5, h: h-1.4,
      fontSize: 12, color: C.textLight,
      fontFace: FACE_BODY, lineSpacing: 18,
    });
  });

  addFooter(s, 4, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 5: AI 솔루션 아키텍처 (3 Layer)
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '03  AI 솔루션 아키텍처');
  addSubtitle(s, '데이터 수집 → AI 분석 → 시각화·서비스 3단계 레이어 구조');

  const layers = [
    {
      label: 'LAYER 01', t: '데이터 수집·통합', e: '📡', c: C.primary,
      items: [
        'NEIS 학교기본·급식식단 API · 81K 일 데이터',
        '공공데이터포털 (data.go.kr) · 전국초·중등학교 위치표준',
        '학교알리미 공시정보 · 학생·교원·만족도',
        'OSM Overpass + Nominatim · 12,066개 좌표 병합',
        '10중 CORS 프록시 race + 영구 백업 캐시',
      ],
    },
    {
      label: 'LAYER 02', t: 'AI 분석 엔진', e: '🤖', c: C.purple,
      items: [
        '3대 LLM 멀티 호스팅 — Claude 4.5 / GPT-4o / Gemini 1.5',
        'AI Vision · 가정식 사진 자동 영양 분석',
        'AI 챗봇 (RAG) · 학교 컨텍스트 다중 턴 대화',
        '7개 지표 평가 — 열량·다양성·신선도·균형·원산지·계절·종합',
        'LLM 자동 번역 (DOM 워커) · 8개 언어 실시간',
      ],
    },
    {
      label: 'LAYER 03', t: '시각화·서비스', e: '🎨', c: C.green,
      items: [
        'Leaflet + OSM · 12K 학교 SVG 일러스트 마커',
        '학생/학부모 익명 커뮤니티 · 자동 닉네임 마스킹',
        '모바일 풀블리드 + sticky 헤더 + safe-area',
        '심층분석 화이트 모드 · SVG 음식 일러스트 8종',
        '음성 인터페이스 + 5탭 차트 + GIS 격차 히트맵',
      ],
    },
  ];

  layers.forEach((L, i) => {
    const x = 0.5 + i * 4.27;
    const y = 1.7;
    const w = 4.1;
    const h = 5.0;

    s.addShape('roundRect', {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.14,
    });
    // 헤더
    s.addShape('roundRect', {
      x, y, w, h: 1.4,
      fill: { color: L.c },
      line: { type: 'none' },
      rectRadius: 0.14,
    });
    // 헤더 하단 직각 처리
    s.addShape('rect', {
      x, y: y+0.7, w, h: 0.7,
      fill: { color: L.c },
      line: { type: 'none' },
    });

    s.addText(L.label, {
      x: x+0.25, y: y+0.18, w: w-0.5, h: 0.3,
      fontSize: 9, bold: true, color: 'FFFFFF',
      fontFace: FACE_BODY, charSpacing: 4, transparency: 20,
    });
    s.addText(L.e, {
      x: x+0.25, y: y+0.4, w: 0.7, h: 0.7,
      fontSize: 32, color: 'FFFFFF',
    });
    s.addText(L.t, {
      x: x+1.0, y: y+0.5, w: w-1.2, h: 0.7,
      fontSize: 18, bold: true, color: 'FFFFFF',
      fontFace: FACE_BODY,
    });

    // 항목 리스트
    s.addText(
      L.items.map(it => '•  ' + it).join('\n'),
      {
        x: x+0.25, y: y+1.6, w: w-0.5, h: h-1.8,
        fontSize: 11, color: C.text, fontFace: FACE_BODY,
        lineSpacing: 18, paraSpaceAfter: 4,
      }
    );
  });

  addFooter(s, 5, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 6: 핵심 기능 (8대 모듈)
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '03  핵심 기능 · 8대 모듈');
  addSubtitle(s, '학부모·학생·영양사·교육청 모두를 위한 통합 기능');

  const features = [
    { e:'🗺', t:'12K 학교 정밀 지도',   d:'NEIS+OSM+Nominatim·자치구 GeoJSON 경계',    c:C.primary },
    { e:'📊', t:'SCHOOL MEAL REPORT', d:'7지표+시도 평균 비교·ESG·탄소 발자국',     c:C.purple },
    { e:'🛡', t:'학교알리미 정확값',    d:'apiType 34/22로 학생/교원수 실데이터',      c:C.red },
    { e:'❤️', t:'급식 좋아요+감성분석',d:'학부모/학생 별 감성 분석·실시간 카운트',    c:C.pink },
    { e:'🌍', t:'다문화 LLM 자동번역', d:'8개 언어 DOM 워커 실시간 자동 번역',        c:C.green },
    { e:'📸', t:'AI Vision 사진 분석', d:'가정식 + 학교 급식 합산 영양 균형 분석',    c:C.cyan },
    { e:'🎙', t:'AI 음성 코치',         d:'9개 의도 인식·풀스크린 네비·다국어 TTS',   c:C.orange },
    { e:'🤖', t:'AI 챗봇 (RAG)',       d:'3대 LLM 멀티 호스팅·학교 컨텍스트 RAG',    c:C.yellow },
  ];

  features.forEach((f, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = 0.5 + col * 3.13;
    const y = 1.7 + row * 2.55;
    const w = 2.95;
    const h = 2.35;

    s.addShape('roundRect', {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.12,
    });
    // 상단 컬러 띠
    s.addShape('roundRect', {
      x, y, w, h: 0.18,
      fill: { color: f.c },
      line: { type: 'none' },
      rectRadius: 0.12,
    });
    s.addShape('rect', { x, y:y+0.06, w, h:0.12, fill:{color:f.c}, line:{type:'none'} });

    // 이모지 박스
    s.addShape('roundRect', {
      x: x+0.3, y: y+0.45, w: 0.9, h: 0.9,
      fill: { color: f.c, transparency: 88 },
      line: { type: 'none' },
      rectRadius: 0.1,
    });
    s.addText(f.e, {
      x: x+0.3, y: y+0.45, w: 0.9, h: 0.9,
      fontSize: 30, align: 'center', valign: 'middle',
    });
    // 번호
    s.addText(`MODULE ${String(i+1).padStart(2,'0')}`, {
      x: x+0.3, y: y+1.42, w: w-0.6, h: 0.25,
      fontSize: 8, bold: true, color: f.c,
      fontFace: FACE_BODY, charSpacing: 3,
    });
    // 제목
    s.addText(f.t, {
      x: x+0.3, y: y+1.65, w: w-0.6, h: 0.4,
      fontSize: 14, bold: true, color: C.text,
      fontFace: FACE_BODY,
    });
    // 설명
    s.addText(f.d, {
      x: x+0.3, y: y+1.97, w: w-0.6, h: 0.4,
      fontSize: 9, color: C.textLight,
      fontFace: FACE_BODY,
    });
  });

  addFooter(s, 6, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 7: 실제 앱 화면 미리보기 (스크린샷 5장)
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '04  실제 앱 화면 미리보기');
  addSubtitle(s, '지도 · 차트 · AI 메뉴 · 가정식 분석 · 분석센터 — 실 운영 화면');

  // iPhone 비율 6.5:13.5 ≈ 0.48 (목업 화면 비율)
  // 슬라이드 가로 13.33, 세로 7.5
  // 5장 가로 배치 — 각 폭 2.3", 세로 5.0"
  const fs = require('fs');
  const path = require('path');
  const screenshots = [
    { file:'01_map.png',      label:'지도',          tone:C.primary,  desc:'12,066개교 NEIS LIVE' },
    { file:'02_chart.png',    label:'차트',          tone:C.purple,   desc:'분포·영양·메뉴·정책·예산·비교' },
    { file:'03_ai_menu.png',  label:'AI 메뉴',       tone:C.green,    desc:'5일 식단 자동 설계' },
    { file:'04_ai_photo.png', label:'AI 가정식 분석',tone:C.pink,     desc:'사진으로 영양 균형' },
    { file:'05_alerts.png',   label:'분석센터',      tone:C.orange,   desc:'내 학교·증감 원인' },
  ];

  // 5개 슬롯 — 가로 균등
  const totalW = 12.4;
  const slotW = (totalW - 4 * 0.18) / 5; // 5칸 + 4 gap = 약 2.4"
  const startX = 0.5;
  const slotY = 1.7;
  const imgH = 4.5;  // 이미지 최대 높이

  screenshots.forEach((sc, i) => {
    const x = startX + i * (slotW + 0.18);
    const filePath = path.join(__dirname, 'screenshots', sc.file);
    const exists = fs.existsSync(filePath);

    // 카드 배경
    s.addShape('roundRect', {
      x, y: slotY, w: slotW, h: imgH + 0.85,
      fill: { color: C.white },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.12,
    });

    // 컬러 띠 (상단)
    s.addShape('roundRect', {
      x, y: slotY, w: slotW, h: 0.12,
      fill: { color: sc.tone },
      line: { type:'none' },
      rectRadius: 0.06,
    });

    if (exists) {
      // 이미지 — sizing: 'contain' 으로 비율 유지
      s.addImage({
        path: filePath,
        x: x + 0.15, y: slotY + 0.3, w: slotW - 0.3, h: imgH,
        sizing: { type: 'contain', w: slotW - 0.3, h: imgH },
      });
    } else {
      // 이미지 없으면 플레이스홀더
      s.addShape('roundRect', {
        x: x + 0.15, y: slotY + 0.3, w: slotW - 0.3, h: imgH,
        fill: { color: C.light },
        line: { color: C.border, width: 0.4, dashType:'dash' },
        rectRadius: 0.08,
      });
      s.addText('📱\n이미지 없음\n\nscreenshots/' + sc.file, {
        x: x + 0.15, y: slotY + 0.3, w: slotW - 0.3, h: imgH,
        fontSize: 9, color: C.textLight, align: 'center', valign: 'middle',
        fontFace: FACE_BODY,
      });
    }

    // 라벨 (이미지 하단)
    s.addText(sc.label, {
      x, y: slotY + imgH + 0.32, w: slotW, h: 0.3,
      fontSize: 13, bold: true, color: sc.tone,
      fontFace: FACE_BODY, align: 'center',
    });
    s.addText(sc.desc, {
      x, y: slotY + imgH + 0.6, w: slotW, h: 0.25,
      fontSize: 9, color: C.textLight,
      fontFace: FACE_BODY, align: 'center',
    });
  });

  // 하단 navy 배너
  s.addShape('roundRect', {
    x: 0.5, y: 6.85, w: 12.3, h: 0.4,
    fill: { color: C.navy }, line: { type:'none' }, rectRadius: 0.08,
  });
  s.addText([
    { text:'🚀  LIVE @ kmeal.kr  ', options:{ bold:true, color:C.green, charSpacing:3 }},
    { text:'전국 12,066개 학교  ·  17개 시도  ·  3대 LLM  ·  실 운영 중',
      options:{ color:'CADCFC' }},
  ], {
    x:0.7, y:6.85, w:12.0, h:0.4,
    fontSize:11, fontFace:FACE_BODY, valign:'middle',
  });

  addFooter(s, 7, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 8: 기술 스택 (구 7번)
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '04  기술 스택');
  addSubtitle(s, 'No-build 단일 HTML SPA · React 18 + Babel Standalone · 10중 CORS 폴백');

  const stacks = [
    {
      cat:'Frontend', e:'⚛️', c:C.primary,
      items: [
        'React 18 (UMD CDN)',
        'Babel Standalone (브라우저 JSX 컴파일)',
        'Wanted Design System (Pretendard JP)',
        '모바일 반응형 100dvh + safe-area',
      ],
    },
    {
      cat:'데이터 시각화', e:'📊', c:C.purple,
      items: [
        'Leaflet 1.9.4 + OSM',
        'SVG 음식 일러스트 8종 (밥·국·고기·김치 등)',
        'Racing Bar + 12개월 시계열',
        'Chart.js · Sankey · Heatmap',
      ],
    },
    {
      cat:'공공데이터 API', e:'🔌', c:C.green,
      items: [
        'NEIS 학교기본·급식식단·classInfo API',
        'data.go.kr 학교 위치 표준데이터',
        '학교알리미 OpenAPI (apiType 34/22 정확값)',
        '시군구 코드 257개 매핑 + 10중 CORS race',
      ],
    },
    {
      cat:'AI / ML', e:'🤖', c:C.orange,
      items: [
        'Claude Sonnet 4.5 (Anthropic)',
        'GPT-4o-mini (OpenAI)',
        'Gemini 1.5 Flash (Google)',
        'Vision + LLM DOM 자동 번역',
      ],
    },
    {
      cat:'모바일 / 접근성', e:'📱', c:C.cyan,
      items: [
        'Web Speech API (음성 인식·TTS)',
        '8개 언어 LLM 자동 번역 + 캐시',
        '풀블리드 + sticky 헤더 + 글래스모피즘',
        '저시력·큰 글자·색맹 친화',
      ],
    },
    {
      cat:'개발·배포', e:'🛠', c:C.pink,
      items: [
        'Claude Code (AI 페어 프로그래밍)',
        'Git / GitHub (브랜치 전략)',
        'Railway (자동 배포 PaaS)',
        'GitHub Pages (정적 호스팅)',
      ],
    },
  ];

  stacks.forEach((st, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.5 + col * 4.27;
    const y = 1.7 + row * 2.55;
    const w = 4.1;
    const h = 2.35;

    s.addShape('roundRect', {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.12,
    });
    // 좌측 컬러 띠
    s.addShape('rect', { x, y:y+0.2, w:0.08, h:h-0.4, fill:{color:st.c}, line:{type:'none'} });

    // 헤더 (이모지 + 카테고리)
    s.addShape('roundRect', {
      x: x+0.3, y: y+0.3, w: 0.6, h: 0.6,
      fill: { color: st.c, transparency: 85 },
      line: { type: 'none' },
      rectRadius: 0.08,
    });
    s.addText(st.e, {
      x: x+0.3, y: y+0.3, w: 0.6, h: 0.6,
      fontSize: 20, align: 'center', valign: 'middle',
    });
    s.addText(st.cat, {
      x: x+1.0, y: y+0.4, w: w-1.2, h: 0.4,
      fontSize: 16, bold: true, color: st.c,
      fontFace: FACE_BODY,
    });
    s.addText(`STACK ${String(i+1).padStart(2,'0')}`, {
      x: x+1.0, y: y+0.7, w: w-1.2, h: 0.25,
      fontSize: 8, color: C.textLight,
      fontFace: FACE_BODY, charSpacing: 3,
    });

    // 항목
    s.addText(
      st.items.map(it => '•  ' + it).join('\n'),
      {
        x: x+0.3, y: y+1.05, w: w-0.5, h: h-1.15,
        fontSize: 10, color: C.text,
        fontFace: FACE_BODY, lineSpacing: 16,
      }
    );
  });

  addFooter(s, 8, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 8: Claude Code 활용
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '05  개발 파이프라인 · 5단계 풀스택');
  addSubtitle(s, 'Figma UI Kits → Claude Design → Claude Code → GitHub Push → Railway 배포');

  // 좌측 다크 카드 — 핵심 메시지
  s.addShape('roundRect', {
    x: 0.5, y: 1.7, w: 4.4, h: 5.0,
    fill: { color: C.navy },
    line: { type: 'none' },
    rectRadius: 0.14,
  });
  s.addText('AI-NATIVE  PIPELINE', {
    x: 0.7, y: 1.9, w: 4.0, h: 0.3,
    fontSize: 10, bold: true, color: '8FA0BB',
    fontFace: FACE_BODY, charSpacing: 4,
  });
  s.addText('디자인부터\n배포까지\nAI 협업', {
    x: 0.7, y: 2.25, w: 4.0, h: 1.5,
    fontSize: 26, bold: true, color: 'FFFFFF',
    fontFace: FACE_BODY,
  });
  s.addShape('rect', { x:0.7, y:3.85, w:4.0, h:0.04, fill:{color:'FFFFFF', transparency:60}, line:{type:'none'} });
  s.addText('5배', {
    x: 0.7, y: 4.0, w: 2.0, h: 1.0,
    fontSize: 56, bold: true, color: C.green,
    fontFace: FACE_DISPLAY, charSpacing: -2,
  });
  s.addText('생산성 향상\n예상 120h → 실제 24h', {
    x: 2.7, y: 4.15, w: 2.2, h: 0.85,
    fontSize: 11, color: 'CADCFC',
    fontFace: FACE_BODY,
  });
  s.addText('"단일 개발자가 디자인·코딩·배포\n전 영역을 24시간 안에 완수"', {
    x: 0.7, y: 5.5, w: 4.0, h: 0.9,
    fontSize: 11, italic: true, color: 'FFFFFF', transparency: 20,
    fontFace: FACE_BODY,
  });

  // 우측 5단계 파이프라인
  const phases = [
    { n:'1', t:'Figma UI Kits',  d:'iOS Wanted DS·컴포넌트 라이브러리 수집',       c:C.pink },
    { n:'2', t:'Claude Design',  d:'화면 와이어프레임·핸드오프 번들 자동 생성',     c:C.purple },
    { n:'3', t:'Claude Code',    d:'단일 HTML SPA·NEIS API·Leaflet·Chart 자동 구현', c:C.primary },
    { n:'4', t:'GitHub Push',    d:'브랜치 전략·PR 리뷰·이슈 추적·버전 관리',       c:C.orange },
    { n:'5', t:'Railway 배포',   d:'main push → 자동 빌드 → CDN 글로벌 배포',       c:C.green },
  ];

  phases.forEach((p, i) => {
    const x = 5.2, y = 1.7 + i * 1.04, w = 7.6, h = 0.92;

    s.addShape('roundRect', {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.12,
    });
    // 번호 동그라미
    s.addShape('ellipse', {
      x: x+0.18, y: y+0.16, w: 0.6, h: 0.6,
      fill: { color: p.c },
      line: { type: 'none' },
    });
    s.addText(p.n, {
      x: x+0.18, y: y+0.16, w: 0.6, h: 0.6,
      fontSize: 20, bold: true, color: 'FFFFFF',
      fontFace: FACE_DISPLAY, align: 'center', valign: 'middle',
    });
    // 화살표 (마지막 카드는 생략)
    if (i < phases.length - 1) {
      s.addText('▼', {
        x: x+0.32, y: y+h-0.05, w: 0.32, h: 0.2,
        fontSize: 11, color: p.c, transparency: 30,
        fontFace: FACE_BODY, align: 'center',
      });
    }
    // 제목·설명
    s.addText('STEP ' + p.n.padStart(2,'0'), {
      x: x+0.95, y: y+0.13, w: w-1.1, h: 0.22,
      fontSize: 8, bold: true, color: p.c,
      fontFace: FACE_BODY, charSpacing: 4,
    });
    s.addText(p.t, {
      x: x+0.95, y: y+0.32, w: w-1.1, h: 0.32,
      fontSize: 15, bold: true, color: C.text,
      fontFace: FACE_BODY,
    });
    s.addText(p.d, {
      x: x+0.95, y: y+0.62, w: w-1.1, h: 0.28,
      fontSize: 11, color: C.textLight,
      fontFace: FACE_BODY,
    });
  });

  addFooter(s, 9, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 11: 데이터 분석 결과
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '06  데이터 분석 결과');
  addSubtitle(s, 'NEIS + 학교알리미 통합 데이터 + AI 분석 인사이트');

  // 인사이트 1: 국산 식재료
  s.addShape('roundRect', {
    x:0.5, y:1.7, w:6.0, h:5.0,
    fill:{color:C.white}, line:{color:C.border, width:0.5}, rectRadius:0.14,
  });
  s.addShape('roundRect', {
    x:0.5, y:1.7, w:6.0, h:0.6,
    fill:{color:C.green}, line:{type:'none'}, rectRadius:0.14,
  });
  s.addShape('rect', { x:0.5, y:2.1, w:6.0, h:0.2, fill:{color:C.green}, line:{type:'none'} });
  s.addText('🌾  INSIGHT 01 · 국내산 식재료 사용 증가', {
    x:0.7, y:1.78, w:5.6, h:0.5,
    fontSize:13, bold:true, color:'FFFFFF', fontFace:FACE_BODY,
    valign: 'middle',
  });
  s.addText('92.3%', {
    x:0.7, y:2.5, w:5.6, h:1.2,
    fontSize:64, bold:true, color:C.green, fontFace:FACE_DISPLAY,
    charSpacing: -3,
  });
  s.addText('전국 평균 국내산 비율 (전년 대비 +5.1%p)', {
    x:0.7, y:3.7, w:5.6, h:0.4,
    fontSize:13, color:C.text, fontFace:FACE_BODY,
  });

  // 막대 차트 (시도별)
  const bars = [
    { l:'전남', v:96.8, c:C.green },
    { l:'전북', v:95.2, c:C.green },
    { l:'경북', v:94.1, c:C.green },
    { l:'평균', v:92.3, c:C.primary },
    { l:'서울', v:88.4, c:C.orange },
  ];
  bars.forEach((b, i) => {
    const y = 4.3 + i * 0.4;
    s.addText(b.l, {
      x: 0.7, y, w: 0.7, h: 0.3,
      fontSize: 10, bold: true, color: C.text, fontFace: FACE_BODY,
    });
    s.addShape('rect', {
      x: 1.5, y: y+0.05, w: 4.5, h: 0.2,
      fill: { color: 'F0F0F2' },
      line: { type:'none' },
    });
    s.addShape('rect', {
      x: 1.5, y: y+0.05, w: 4.5 * (b.v/100), h: 0.2,
      fill: { color: b.c },
      line: { type:'none' },
    });
    s.addText(b.v + '%', {
      x: 6.0, y, w: 0.5, h: 0.3,
      fontSize: 10, bold: true, color: C.text, fontFace: FACE_BODY,
    });
  });

  // 인사이트 2 + 3 (우측 두 카드)
  // 인사이트 2: 칼로리
  s.addShape('roundRect', {
    x:6.83, y:1.7, w:6.0, h:2.4,
    fill:{color:C.white}, line:{color:C.border, width:0.5}, rectRadius:0.14,
  });
  s.addShape('roundRect', {
    x:6.83, y:1.7, w:6.0, h:0.6,
    fill:{color:C.purple}, line:{type:'none'}, rectRadius:0.14,
  });
  s.addShape('rect', { x:6.83, y:2.1, w:6.0, h:0.2, fill:{color:C.purple}, line:{type:'none'} });
  s.addText('🔥  INSIGHT 02 · 학교급별 칼로리 적정성', {
    x:7.03, y:1.78, w:5.6, h:0.5,
    fontSize:13, bold:true, color:'FFFFFF', fontFace:FACE_BODY, valign:'middle',
  });

  const cals = [
    { lvl:'초등', kcal:'685', range:'650~700', c:C.primary },
    { lvl:'중학', kcal:'785', range:'750~800', c:C.purple },
    { lvl:'고등', kcal:'885', range:'850~900', c:C.orange },
  ];
  cals.forEach((c, i) => {
    const x = 6.93 + i * 1.95;
    s.addShape('roundRect', {
      x, y: 2.55, w: 1.85, h: 1.45,
      fill: { color: c.c, transparency: 90 },
      line: { type:'none' },
      rectRadius: 0.1,
    });
    s.addText(c.lvl, {
      x, y: 2.65, w: 1.85, h: 0.35,
      fontSize: 11, bold: true, color: c.c, fontFace: FACE_BODY,
      align: 'center',
    });
    s.addText(c.kcal, {
      x, y: 2.95, w: 1.85, h: 0.6,
      fontSize: 26, bold: true, color: c.c, fontFace: FACE_DISPLAY,
      align: 'center',
    });
    s.addText('권장 ' + c.range, {
      x, y: 3.55, w: 1.85, h: 0.35,
      fontSize: 9, color: C.textLight, fontFace: FACE_BODY,
      align: 'center',
    });
  });

  // 인사이트 3: 만족도
  s.addShape('roundRect', {
    x:6.83, y:4.3, w:6.0, h:2.4,
    fill:{color:C.white}, line:{color:C.border, width:0.5}, rectRadius:0.14,
  });
  s.addShape('roundRect', {
    x:6.83, y:4.3, w:6.0, h:0.6,
    fill:{color:C.orange}, line:{type:'none'}, rectRadius:0.14,
  });
  s.addShape('rect', { x:6.83, y:4.7, w:6.0, h:0.2, fill:{color:C.orange}, line:{type:'none'} });
  s.addText('⭐  INSIGHT 03 · 만족도 향상', {
    x:7.03, y:4.38, w:5.6, h:0.5,
    fontSize:13, bold:true, color:'FFFFFF', fontFace:FACE_BODY, valign:'middle',
  });

  s.addText('4.2', {
    x:7.03, y:5.0, w:1.8, h:1.0,
    fontSize:48, bold:true, color:C.orange, fontFace:FACE_DISPLAY,
  });
  s.addText('/ 5.0', {
    x:7.03, y:5.95, w:1.8, h:0.4,
    fontSize:11, color:C.textLight, fontFace:FACE_BODY,
  });
  s.addText('학생 만족도\n전년 대비 +0.3↑', {
    x:9.0, y:5.0, w:3.7, h:0.85,
    fontSize:12, bold:true, color:C.text, fontFace:FACE_BODY,
  });
  s.addText('학부모: 4.5/5.0\n메뉴 다양성 확대 희망 32%\n채식 옵션 확대 47%', {
    x:9.0, y:5.85, w:3.7, h:0.85,
    fontSize:10, color:C.textLight, fontFace:FACE_BODY,
  });

  addFooter(s, 10, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 12: 사용자 시나리오
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '07  사용자 시나리오');
  addSubtitle(s, '학부모 · 영양사 · 교육청 — 3-Tier 페르소나');

  const personas = [
    {
      e:'👩‍👧', t:'학부모 김지은 (38)',
      role:'초등 4학년 자녀 · 견과류 알레르기',
      scenario:'출근 전 모바일로 주간 급식 확인\n→ 목요일 땅콩 포함 자동 알림\n→ 도시락 준비',
      effect:'알레르기 사고 예방 100%\n확인 시간 90% 단축',
      c:C.primary,
    },
    {
      e:'👩‍🍳', t:'영양사 박수진 (35)',
      role:'중학교 영양사 · PRO 모드 사용',
      scenario:'전국 인기 메뉴 TOP 10 확인\n→ 우수 학교 벤치마킹\n→ AI로 영양·예산 자동 검증',
      effect:'메뉴 기획 25% 단축\n만족도 4.0 → 4.5 상승',
      c:C.purple,
    },
    {
      e:'👨‍💼', t:'교육청 이현수 (42)',
      role:'서울시교육청 급식 담당 장학사',
      scenario:'GIS 격차 지도로 사각지대 식별\n→ 국산 80% 미만 15개교 발견\n→ 개선 권고 공문 발송',
      effect:'모니터링 시간 80% 단축\n데이터 기반 정책 수립',
      c:C.green,
    },
  ];

  personas.forEach((p, i) => {
    const x = 0.5 + i * 4.27;
    const y = 1.7;
    const w = 4.1;
    const h = 5.0;

    s.addShape('roundRect', {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.14,
    });
    // 상단 컬러 영역
    s.addShape('roundRect', {
      x, y, w, h: 1.5,
      fill: { color: p.c },
      line: { type: 'none' },
      rectRadius: 0.14,
    });
    s.addShape('rect', { x, y:y+0.7, w, h:0.8, fill:{color:p.c}, line:{type:'none'} });

    // 큰 이모지
    s.addText(p.e, {
      x, y: y+0.2, w, h: 1.1,
      fontSize: 60, align: 'center', valign: 'middle',
    });

    // 페르소나 이름
    s.addShape('rect', {
      x, y: y+1.5, w, h: 0.6,
      fill: { color: '141828' },
      line: { type:'none' },
    });
    s.addText(p.t, {
      x: x+0.2, y: y+1.55, w: w-0.4, h: 0.3,
      fontSize: 14, bold: true, color: 'FFFFFF',
      fontFace: FACE_BODY,
    });
    s.addText(p.role, {
      x: x+0.2, y: y+1.82, w: w-0.4, h: 0.25,
      fontSize: 10, color: 'CADCFC',
      fontFace: FACE_BODY,
    });

    // 시나리오
    s.addText('📌  사용 시나리오', {
      x: x+0.2, y: y+2.25, w: w-0.4, h: 0.3,
      fontSize: 10, bold: true, color: p.c,
      fontFace: FACE_BODY, charSpacing: 2,
    });
    s.addText(p.scenario, {
      x: x+0.2, y: y+2.55, w: w-0.4, h: 1.3,
      fontSize: 11, color: C.text,
      fontFace: FACE_BODY, lineSpacing: 18,
    });

    // 기대효과
    s.addShape('rect', { x:x+0.2, y:y+3.85, w:w-0.4, h:0.02, fill:{color:C.border}, line:{type:'none'} });
    s.addText('💡  기대 효과', {
      x: x+0.2, y: y+3.95, w: w-0.4, h: 0.3,
      fontSize: 10, bold: true, color: p.c,
      fontFace: FACE_BODY, charSpacing: 2,
    });
    s.addText(p.effect, {
      x: x+0.2, y: y+4.25, w: w-0.4, h: 0.7,
      fontSize: 12, bold: true, color: C.text,
      fontFace: FACE_BODY, lineSpacing: 20,
    });
  });

  addFooter(s, 11, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 13: 차별성 — 기존 급식 앱과의 비교
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '08  차별성 · 국내 급식/학교생활 앱 5종 비교');
  addSubtitle(s, '오늘학교 · 김급식 · 슬기로운 학교생활 · 급식시간 vs 급식 어때 — 공개 스토어 설명 기준');

  // 5개 앱 비교 테이블 (CRITERIA + 5 apps = 6 columns)
  const colX = [0.5, 2.95, 4.95, 6.95, 8.95, 10.95];
  const colW = [2.4, 1.95, 1.95, 1.95, 1.95, 1.85];
  const headerY = 1.6;
  const headerH = 0.65;

  const headers = [
    { label:'비교 항목',           sub:'CRITERIA' },
    { label:'오늘학교',            sub:'TODAY SCHOOL',  tone:'학생 종합' },
    { label:'김급식',              sub:'KIM GUPSIK',    tone:'리워드형' },
    { label:'슬기로운 학교생활',   sub:'SLG SCHOOL',    tone:'다중 학교' },
    { label:'급식시간',            sub:'GUPSIK TIME',   tone:'급식 특화' },
    { label:'급식 어때?',          sub:'KMEAL  ·  OURS',tone:'지도형 통합', ours:true },
  ];
  headers.forEach((h, i) => {
    const isOurs = !!h.ours;
    s.addShape('roundRect', {
      x: colX[i], y: headerY, w: colW[i], h: headerH,
      fill: { color: isOurs ? C.primary : (i === 0 ? C.navy : C.white) },
      line: { color: isOurs ? C.primary : (i === 0 ? C.navy : C.border), width: 0.5 },
      rectRadius: 0.08,
    });
    s.addText(h.sub, {
      x: colX[i]+0.1, y: headerY+0.05, w: colW[i]-0.2, h: 0.22,
      fontSize: 7, bold: true, color: isOurs ? 'CADCFC' : (i === 0 ? 'CADCFC' : C.textLight),
      fontFace: FACE_BODY, charSpacing: 2,
    });
    s.addText(h.label, {
      x: colX[i]+0.1, y: headerY+0.24, w: colW[i]-0.2, h: 0.28,
      fontSize: i === 0 ? 12 : 11, bold: true,
      color: isOurs ? 'FFFFFF' : (i === 0 ? 'FFFFFF' : C.text),
      fontFace: FACE_BODY,
    });
    if (h.tone) {
      s.addText(h.tone, {
        x: colX[i]+0.1, y: headerY+0.46, w: colW[i]-0.2, h: 0.18,
        fontSize: 8, color: isOurs ? 'FFFFFF' : C.textLight,
        fontFace: FACE_BODY, transparency: isOurs ? 15 : 0,
      });
    }
  });

  // 행 데이터 — 5개 앱 비교
  const rows = [
    { k:'급식 확인 강도',    v:['중간 (정보 묶음 일부)','중간 (포인트 동반)','중간 (다중 학교 중)','강함 (조·중·석 분리)','강함 (지도+자동) ★'] },
    { k:'알레르기 대응',     v:['언급 없음','언급 없음','언급 없음','경고 표시','자동 LLM 분석 ★'] },
    { k:'다중 학교 조회',    v:['단일 학교 중심','단일 학교 중심','동시 조회 강점','단일 학교','지도 12,066개교 ★'] },
    { k:'데이터 소스',       v:['NEIS 단일','NEIS + 자체','NEIS 다중','NEIS 단일','NEIS+학교알리미+OSM ★'] },
    { k:'AI/영양 분석',      v:['없음','없음','없음','없음','3대 LLM + 7지표 ★'] },
    { k:'커뮤니티/UGC',      v:['커뮤니티 강함','사진+포인트 강함','없음','없음','감성분석+익명 ★'] },
    { k:'다문화·다국어',     v:['한국어','한국어','한국어','한국어','8개 언어 자동 번역 ★'] },
    { k:'플랫폼·접근성',     v:['앱 (50만+)','앱 (리워드)','앱 (다수 학교)','앱 (조·중·석)','웹 — 설치 0초 ★'] },
  ];

  const rowH = 0.46;
  const rowY0 = headerY + headerH + 0.08;

  rows.forEach((r, i) => {
    const y = rowY0 + i * rowH;
    // 좌측 라벨
    s.addShape('rect', {
      x: colX[0], y, w: colW[0], h: rowH-0.04,
      fill: { color: i % 2 === 0 ? C.white : 'F5F5F0' },
      line: { type: 'none' },
    });
    s.addText(r.k, {
      x: colX[0]+0.12, y, w: colW[0]-0.2, h: rowH-0.04,
      fontSize: 10, bold: true, color: C.text,
      fontFace: FACE_BODY, valign: 'middle',
    });
    // 5개 앱 셀
    r.v.forEach((val, j) => {
      const ci = j + 1;
      const isOurs = ci === 5;
      s.addShape('rect', {
        x: colX[ci], y, w: colW[ci], h: rowH-0.04,
        fill: { color: isOurs ? C.primary : (i % 2 === 0 ? C.white : 'F5F5F0'), transparency: isOurs ? 90 : 0 },
        line: { type: 'none' },
      });
      s.addText(val, {
        x: colX[ci]+0.1, y, w: colW[ci]-0.18, h: rowH-0.04,
        fontSize: 8.5, bold: isOurs,
        color: isOurs ? C.primary_d : C.textLight,
        fontFace: FACE_BODY, valign: 'middle',
      });
    });
  });

  // 하단 핵심 차별 포인트 — navy 배너
  s.addShape('roundRect', {
    x:0.5, y:6.45, w:12.3, h:0.55,
    fill:{color:C.navy}, line:{type:'none'}, rectRadius:0.12,
  });
  s.addText([
    { text:'🗺  KMEAL  EDGE  ', options:{ bold:true, color:C.green, charSpacing:3 }},
    { text:'지도형 웹 탐색 + 알레르기 자동 + 영양 7지표 + 3대 LLM + 8개 언어 — ',
      options:{ color:'CADCFC' }},
    { text:'5개 경쟁군 중 유일하게 4개 차원에서 우위 ★',
      options:{ color:'FFFFFF', bold:true }},
  ], {
    x:0.7, y:6.45, w:12.0, h:0.55,
    fontSize:10, fontFace:FACE_BODY, valign:'middle',
  });

  addFooter(s, 12, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 15: 포지셔닝 · 한 줄 요약 + 목적별 추천 + 우수성
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '08-2  포지셔닝 · 급식 어때의 우수성');
  addSubtitle(s, '5개 앱 한 줄 포지셔닝 → 목적별 추천 → 급식 어때만의 5대 차별 가치');

  // 좌측 상단: 한 줄 포지셔닝 (5개 앱)
  s.addShape('roundRect', {
    x: 0.5, y: 1.55, w: 6.3, h: 2.85,
    fill: { color: C.white }, line: { color: C.border, width: 0.5 },
    rectRadius: 0.12,
  });
  s.addText('ONE-LINE  POSITIONING', {
    x: 0.7, y: 1.7, w: 6.0, h: 0.3,
    fontSize: 9, bold: true, color: C.primary, fontFace: FACE_BODY, charSpacing: 4,
  });
  s.addText('한 줄 포지셔닝', {
    x: 0.7, y: 1.95, w: 6.0, h: 0.35,
    fontSize: 16, bold: true, color: C.text, fontFace: FACE_BODY,
  });

  const positions = [
    { app:'오늘학교',           tag:'올인원',   desc:'가장 대중적인 학생 종합 플랫폼',    c:C.orange },
    { app:'김급식',             tag:'리워드',   desc:'가장 강한 참여형·게이미피케이션',   c:C.pink },
    { app:'슬기로운 학교생활',  tag:'다중',     desc:'가장 실용적인 다중 학교 조회',      c:C.cyan },
    { app:'급식시간',           tag:'특화',     desc:'가장 직접적인 급식 확인 (조·중·석)',c:C.green },
    { app:'급식 어때 ★',        tag:'지도형',   desc:'가장 차별적인 지도 기반 웹 탐색',   c:C.primary },
  ];
  positions.forEach((p, i) => {
    const y = 2.4 + i * 0.4;
    const isOurs = i === 4;
    s.addShape('rect', { x:0.7, y, w:0.08, h:0.32, fill:{color:p.c}, line:{type:'none'} });
    s.addText(p.tag, {
      x: 0.85, y: y, w: 0.7, h: 0.32,
      fontSize: 8, bold: true, color: p.c, fontFace: FACE_BODY, valign: 'middle',
    });
    s.addText(p.app, {
      x: 1.55, y: y, w: 1.85, h: 0.32,
      fontSize: 11, bold: true, color: isOurs ? C.primary : C.text,
      fontFace: FACE_BODY, valign: 'middle',
    });
    s.addText(p.desc, {
      x: 3.4, y: y, w: 3.3, h: 0.32,
      fontSize: 9, color: isOurs ? C.text : C.textLight,
      fontFace: FACE_BODY, valign: 'middle', italic: !isOurs,
    });
  });

  // 우측 상단: 목적별 추천
  s.addShape('roundRect', {
    x: 7.0, y: 1.55, w: 5.83, h: 2.85,
    fill: { color: C.navy }, line: { type: 'none' },
    rectRadius: 0.12,
  });
  s.addText('USE-CASE  RECOMMENDATION', {
    x: 7.2, y: 1.7, w: 5.5, h: 0.3,
    fontSize: 9, bold: true, color: 'CADCFC', fontFace: FACE_BODY, charSpacing: 4,
  });
  s.addText('목적별 추천', {
    x: 7.2, y: 1.95, w: 5.5, h: 0.35,
    fontSize: 16, bold: true, color: 'FFFFFF', fontFace: FACE_BODY,
  });

  const usecases = [
    { goal:'학생 B2C 앱',         rec:'오늘학교 · 김급식',      note:'습관·체류시간 강점',    c:C.orange },
    { goal:'학부모/교직원 도구',  rec:'슬기로운 학교생활 · 급식시간', note:'실용·다중·알레르기', c:C.cyan },
    { goal:'차별화 UX 노릴 때',   rec:'급식 어때  ★',           note:'지도형 웹 — 유일',      c:C.primary },
  ];
  usecases.forEach((u, i) => {
    const y = 2.4 + i * 0.65;
    s.addShape('roundRect', {
      x: 7.2, y, w: 5.5, h: 0.55,
      fill: { color: 'FFFFFF', transparency: 90 },
      line: { color: u.c, width: 0.5, transparency: 50 },
      rectRadius: 0.08,
    });
    s.addText(u.goal, {
      x: 7.35, y: y+0.05, w: 1.9, h: 0.45,
      fontSize: 10, bold: true, color: 'FFFFFF', fontFace: FACE_BODY, valign: 'middle',
    });
    s.addText(u.rec, {
      x: 9.25, y: y+0.05, w: 2.2, h: 0.45,
      fontSize: 11, bold: true, color: u.c, fontFace: FACE_BODY, valign: 'middle',
    });
    s.addText(u.note, {
      x: 11.45, y: y+0.05, w: 1.2, h: 0.45,
      fontSize: 8, color: 'CADCFC', fontFace: FACE_BODY, valign: 'middle', italic: true,
    });
  });

  // 하단: 급식 어때 5대 우수성 카드
  s.addShape('roundRect', {
    x: 0.5, y: 4.55, w: 12.3, h: 2.4,
    fill: { color: C.white }, line: { color: C.primary, width: 1 },
    rectRadius: 0.14,
  });
  s.addText([
    { text:'⭐  KMEAL  EDGE  ·  ', options:{ bold:true, color:C.primary, charSpacing:3 }},
    { text:'급식 어때만의 5대 우수성',
      options:{ bold:true, color:C.text, fontSize:14 }},
  ], {
    x: 0.75, y: 4.7, w: 12.0, h: 0.35,
    fontSize: 10, fontFace: FACE_BODY,
  });

  const edges = [
    { ico:'🗺', t:'지도형 통합', n:'12,066',     u:'개교 LIVE',   d:'경쟁사 단일학교 vs 우리 전국 지도 — 유일',         c:C.primary },
    { ico:'🤖', t:'AI 영양 분석', n:'3대',         u:'LLM 호스팅',  d:'Claude·GPT·Gemini — 7개 지표 자동 평가',         c:C.purple },
    { ico:'⚠️', t:'알레르기 자동',n:'18종',        u:'법정 표시',   d:'급식시간과 동급 + LLM 가정식 사진 분석',         c:C.red },
    { ico:'🌏', t:'다국어 지원',  n:'8개',         u:'언어 번역',   d:'경쟁 5개 앱 모두 한국어 — 우리만 다문화 대응',   c:C.green },
    { ico:'⚡', t:'설치 0초',    n:'WEB',         u:'kmeal.kr',    d:'앱스토어 다운로드 불필요 — QR/링크 즉시 실행',  c:C.orange },
  ];
  const cardY = 5.15;
  const cardH = 1.65;
  const cardW = 2.36;
  edges.forEach((e, i) => {
    const x = 0.7 + i * (cardW + 0.07);
    s.addShape('roundRect', {
      x, y: cardY, w: cardW, h: cardH,
      fill: { color: e.c, transparency: 92 },
      line: { color: e.c, width: 0.5, transparency: 60 },
      rectRadius: 0.1,
    });
    s.addText(e.ico, {
      x: x+0.15, y: cardY+0.1, w: 0.5, h: 0.4,
      fontSize: 18, valign: 'middle',
    });
    s.addText(e.t, {
      x: x+0.6, y: cardY+0.1, w: cardW-0.7, h: 0.4,
      fontSize: 11, bold: true, color: C.text, fontFace: FACE_BODY, valign: 'middle',
    });
    s.addText([
      { text: e.n, options: { fontSize: 22, bold: true, color: e.c, fontFace: FACE_DISPLAY }},
      { text: '  ' + e.u, options: { fontSize: 10, color: C.textLight }},
    ], {
      x: x+0.15, y: cardY+0.55, w: cardW-0.3, h: 0.5,
      fontFace: FACE_BODY,
    });
    s.addText(e.d, {
      x: x+0.15, y: cardY+1.05, w: cardW-0.3, h: 0.55,
      fontSize: 8, color: C.textLight, fontFace: FACE_BODY,
    });
  });

  addFooter(s, 13, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 14: 기대효과 + 로드맵
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.cream);
  addTitle(s, '09  기대효과 및 로드맵');
  addSubtitle(s, '4대 사회적 가치 + 12개월 단계별 실행 계획');

  // 좌측: 4대 기대효과
  const effects = [
    { e:'🔍', t:'투명성 강화', n:'100%', d:'전국 급식 정보 실시간 공개\n원산지 투명성 확보', c:C.primary },
    { e:'⚡', t:'운영 효율화', n:'80%', d:'교육청 모니터링 자동화\n데이터 기반 정책 수립', c:C.green },
    { e:'⭐', t:'품질 개선',   n:'25%', d:'만족도 4.2 → 5.0 목표\n영양 기준 100% 충족',  c:C.orange },
    { e:'🏠', t:'학부모 만족', n:'40%', d:'급식 확인 90% 단축\n알레르기 사고 제로화', c:C.purple },
  ];

  effects.forEach((eff, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 0.5 + col * 3.13;
    const y = 1.7 + row * 1.6;
    const w = 3.0;
    const h = 1.45;

    s.addShape('roundRect', {
      x, y, w, h,
      fill: { color: C.white },
      line: { color: C.border, width: 0.5 },
      rectRadius: 0.12,
    });
    s.addShape('rect', { x, y:y+0.15, w:0.08, h:h-0.3, fill:{color:eff.c}, line:{type:'none'} });

    s.addText(eff.e, {
      x: x+0.25, y: y+0.2, w: 0.5, h: 0.5,
      fontSize: 22, valign: 'middle',
    });
    s.addText(eff.t, {
      x: x+0.8, y: y+0.2, w: w-0.95, h: 0.4,
      fontSize: 13, bold: true, color: C.text,
      fontFace: FACE_BODY,
    });
    s.addText(eff.n, {
      x: x+0.25, y: y+0.55, w: w-0.4, h: 0.55,
      fontSize: 26, bold: true, color: eff.c, fontFace: FACE_DISPLAY,
    });
    s.addText(eff.d, {
      x: x+0.25, y: y+1.0, w: w-0.4, h: 0.4,
      fontSize: 9, color: C.textLight, fontFace: FACE_BODY,
    });
  });

  // 우측: 12개월 로드맵
  s.addShape('roundRect', {
    x: 6.83, y: 1.7, w: 6.0, h: 5.0,
    fill: { color: C.navy }, line: {type:'none'},
    rectRadius: 0.14,
  });
  s.addText('ROADMAP  ·  12 MONTHS', {
    x: 7.03, y: 1.9, w: 5.6, h: 0.3,
    fontSize: 10, bold: true, color: 'CADCFC',
    fontFace: FACE_BODY, charSpacing: 4,
  });
  s.addText('단계별 실행 계획', {
    x: 7.03, y: 2.2, w: 5.6, h: 0.5,
    fontSize: 22, bold: true, color: 'FFFFFF', fontFace: FACE_BODY,
  });

  const phases = [
    { ph:'Phase 1', range:'1~3개월', t:'MVP 출시',
      d:'서울 500개교 파일럿 · 베타 1,000명',  c:C.primary },
    { ph:'Phase 2', range:'4~6개월', t:'전국 확대',
      d:'17개 시도 12,066개교 · 프리미엄 도입', c:C.green },
    { ph:'Phase 3', range:'7~9개월', t:'고도화',
      d:'알레르기 푸시 · API 오픈 · 다국어 확장', c:C.orange },
    { ph:'Phase 4', range:'10~12개월', t:'사업화',
      d:'B2G 3개 교육청 계약 · 유료 2만명 BEP', c:C.purple },
  ];

  phases.forEach((p, i) => {
    const y = 2.95 + i * 0.9;
    s.addShape('rect', { x:7.4, y:y+0.35, w:0.04, h:0.6, fill:{color:p.c, transparency:30}, line:{type:'none'} });
    if (i === 0) {
      s.addShape('rect', { x:7.4, y:2.7, w:0.04, h:0.3, fill:{color:p.c, transparency:30}, line:{type:'none'} });
    }
    s.addShape('ellipse', {
      x: 7.3, y: y+0.05, w: 0.24, h: 0.24,
      fill: { color: p.c }, line: { color: 'FFFFFF', width: 1.5 },
    });
    s.addText(p.ph, {
      x: 7.65, y: y, w: 1.3, h: 0.3,
      fontSize: 10, bold: true, color: p.c, fontFace: FACE_BODY, charSpacing: 2,
    });
    s.addText(p.range, {
      x: 8.95, y: y, w: 1.5, h: 0.3,
      fontSize: 10, color: 'CADCFC', fontFace: FACE_BODY,
    });
    s.addText(p.t, {
      x: 7.65, y: y+0.28, w: 5.0, h: 0.35,
      fontSize: 14, bold: true, color: 'FFFFFF', fontFace: FACE_BODY,
    });
    s.addText(p.d, {
      x: 7.65, y: y+0.6, w: 5.0, h: 0.3,
      fontSize: 10, color: '8FA0BB', fontFace: FACE_BODY,
    });
  });

  addFooter(s, 14, TOTAL);
}

// ═══════════════════════════════════════════
// 슬라이드 17: 감사 & 시연
// ═══════════════════════════════════════════
{
  const s = pres.addSlide();
  addBg(s, C.navy);
  // 좌측 컬러 바
  s.addShape('rect', { x:0, y:0, w:0.3, h:7.5, fill:{color:C.primary}, line:{type:'none'} });
  s.addShape('rect', { x:0.3, y:0, w:0.15, h:7.5, fill:{color:C.purple}, line:{type:'none'} });
  // 큰 이모지
  s.addText('🍱', {
    x: 9.5, y: 0.3, w: 4, h: 4,
    fontSize: 280, color: 'FFFFFF', align: 'center', transparency: 92,
  });

  s.addText('THANK YOU', {
    x: 1.0, y: 0.7, w: 11, h: 0.5,
    fontSize: 14, bold: true, color: C.primary,
    fontFace: FACE_BODY, charSpacing: 8,
  });

  s.addText('급식 어때?', {
    x: 1.0, y: 1.2, w: 11, h: 1.4,
    fontSize: 80, bold: true, color: 'FFFFFF',
    fontFace: FACE_DISPLAY, charSpacing: -3,
  });

  s.addText('"더 투명하고 건강한 학교 급식,\nAI 기술로 시작합니다."', {
    x: 1.0, y: 2.8, w: 11, h: 1.0,
    fontSize: 18, italic: true, color: 'CADCFC', fontFace: FACE_BODY,
  });

  // 핵심 성과 박스
  s.addShape('roundRect', {
    x: 1.0, y: 4.0, w: 6.5, h: 2.7,
    fill: { color: C.navy2 },
    line: { color: C.primary, width: 1 },
    rectRadius: 0.12,
  });
  s.addText('CORE  ACHIEVEMENTS', {
    x: 1.2, y: 4.15, w: 6.1, h: 0.3,
    fontSize: 10, bold: true, color: C.primary, fontFace: FACE_BODY, charSpacing: 4,
  });

  const ach = [
    '✓  전국 12,066개 학교 좌표 + 자치구 GeoJSON 경계',
    '✓  학교알리미 OpenAPI (apiType 34/22)로 정확한 학생·교원수',
    '✓  3대 LLM 멀티 호스팅 + 8개 언어 DOM 자동 번역',
    '✓  급식 좋아요·감성 분석·익명 마스킹 커뮤니티',
    '✓  AI 음성 코치·3D 일러스트 랜딩·시도 평균 비교',
    '✓  Claude Code · GitHub · Railway 풀스택 (단일 SPA)',
  ];
  s.addText(ach.join('\n'), {
    x: 1.2, y: 4.5, w: 6.1, h: 2.0,
    fontSize: 13, color: 'FFFFFF',
    fontFace: FACE_BODY, lineSpacing: 24,
  });

  // 우측 시연 + 팀
  s.addShape('roundRect', {
    x: 8.0, y: 4.0, w: 4.83, h: 2.7,
    fill: { color: C.navy2 },
    line: { color: C.purple, width: 1 },
    rectRadius: 0.12,
  });
  s.addText('LIVE  DEMO', {
    x: 8.2, y: 4.15, w: 4.43, h: 0.3,
    fontSize: 10, bold: true, color: C.purple,
    fontFace: FACE_BODY, charSpacing: 4,
  });
  s.addText('🔗  실시간 시연', {
    x: 8.2, y: 4.5, w: 4.43, h: 0.4,
    fontSize: 16, bold: true, color: 'FFFFFF', fontFace: FACE_BODY,
  });
  s.addText('kmeal.kr', {
    x: 8.2, y: 4.95, w: 4.43, h: 0.35,
    fontSize: 11, color: 'CADCFC', fontFace: 'Consolas',
  });

  // 팀 정보
  s.addShape('rect', { x:8.2, y:5.4, w:4.43, h:0.02, fill:{color:'CADCFC', transparency:60}, line:{type:'none'} });
  s.addText('팀 판테라  PANTERA', {
    x: 8.2, y: 5.5, w: 4.43, h: 0.3,
    fontSize: 10, bold: true, color: C.purple,
    fontFace: FACE_BODY, charSpacing: 3,
  });
  s.addText('박준범 · 박세윤', {
    x: 8.2, y: 5.85, w: 4.43, h: 0.4,
    fontSize: 16, bold: true, color: 'FFFFFF', fontFace: FACE_BODY,
  });
  s.addText('박준범(개발 총괄·백엔드) · 박세윤(프론트엔드·데이터 분석)', {
    x: 8.2, y: 6.25, w: 4.43, h: 0.4,
    fontSize: 9, color: '8FA0BB', fontFace: FACE_BODY,
  });

  // 푸터
  s.addText('제8회 교육 공공데이터 AI 활용대회  ·  2026년 5월', {
    x: 1.0, y: 7.0, w: 11.83, h: 0.3,
    fontSize: 10, color: '6B7280',
    fontFace: FACE_BODY, charSpacing: 3,
  });
}

// 저장
pres.writeFile({ fileName: '급식어때_판테라_제안서_v10.pptx' })
  .then(name => console.log('✓ Created:', name));

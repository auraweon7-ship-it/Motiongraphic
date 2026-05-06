# Website to Hyperframes — 웹사이트 → 비디오 변환 파이프라인

웹사이트/제품을 분석하여 Hyperframes 비디오로 자동 변환하는 7단계 워크플로우.

## 7단계 파이프라인

### 1. Capture & Understand — 캡처 및 분석

웹사이트/제품의 핵심 요소 파악:
- 브랜드 색상, 폰트, 톤
- 핵심 기능/메시지
- 타겟 오디언스
- 차별화 포인트

### 2. Write DESIGN.md — 디자인 시스템 정의

분석 결과를 기반으로 비디오용 디자인 시스템 작성:
- 색상 팔레트 (primary, secondary, accent, bg, fg)
- 타이포그래피 (headline, body 폰트/크기/weight)
- 스페이싱 토큰
- 모션 프리셋 (ease, duration)

### 3. Write SCRIPT — 스크립트 작성

비디오 유형에 맞는 스크립트 작성:
- hook → problem → solution → features → CTA
- 각 씬의 화면 설명 포함

### 4. Write STORYBOARD — 스토리보드

씬별 시각 구성:
- 레이아웃 스케치
- 텍스트 배치
- 전환 효과 지정
- 타이밍 계획

### 5. Generate VO + Map Timing — 나레이션 생성 및 타이밍 매핑

```bash
# TTS로 나레이션 생성
npx hyperframes tts --file script.txt --voice af_heart --output narration.wav

# 타임스탬프 추출
npx hyperframes transcribe narration.wav --output timestamps.json
```

타임스탬프를 씬 `data-start`/`data-duration`에 매핑.

### 6. Build Compositions — HTML 합성 빌드

스토리보드 + 타이밍을 기반으로 HTML composition 작성:
- 각 씬을 `<div class="clip">` 으로 구현
- GSAP 타임라인 빌드
- 에셋 (이미지, 비디오, 오디오) 배치

### 7. Validate & Deliver — 검증 및 전달

```bash
npx hyperframes lint composition.html
npx hyperframes validate composition.html
npx hyperframes render composition.html -o output.mp4 --quality high
```

## 비디오 유형별 가이드

| 유형 | 길이 | 용도 |
|------|------|------|
| Social Ad | 10-15초 | SNS 광고 |
| Product Demo | 30-60초 | 제품 데모 |
| Feature Announcement | 15-30초 | 기능 소개 |
| Brand Reel | 20-45초 | 브랜드 영상 |
| Launch Teaser | 10-20초 | 출시 티저 |

## 출력 형식

| 형식 | 해상도 | 용도 |
|------|--------|------|
| 1920x1080 | 16:9 가로 | YouTube, 웹 |
| 1080x1920 | 9:16 세로 | Instagram Reels, TikTok, Shorts |
| 1080x1080 | 1:1 정사각 | Instagram Feed, LinkedIn |

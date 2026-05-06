# Hyperframes — Core Skill

HTML-native 비디오 합성 프레임워크. HTML 파일에 `data-*` 속성을 사용하여 비디오를 렌더링한다.

## 핵심 개념

### Composition 구조

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; }
    .clip { position: absolute; inset: 0; }
  </style>
</head>
<body data-composition-id="my-video" data-width="1920" data-height="1080">

  <!-- Scene 1 -->
  <div class="clip" id="scene-1" data-start="0" data-duration="5">
    <h1>Hello World</h1>
  </div>

  <!-- Scene 2 -->
  <div class="clip" id="scene-2" data-start="5" data-duration="5">
    <p>Second scene</p>
  </div>

  <script src="https://unpkg.com/gsap@3/dist/gsap.min.js"></script>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.from("#scene-1 h1", { opacity: 0, y: 30, duration: 0.6 });
    tl.from("#scene-2 p", { opacity: 0, duration: 0.5 }, 5);
    window.__timelines = { "my-video": tl };
  </script>
</body>
</html>
```

### 필수 속성

| 속성 | 용도 | 예시 |
|------|------|------|
| `data-composition-id` | composition 고유 ID (`<body>`에 지정) | `"intro-video"` |
| `data-width` / `data-height` | 캔버스 크기 | `1920` / `1080` |
| `data-start` | 씬 시작 시간 (초) | `"0"`, `"5.5"` |
| `data-duration` | 씬 지속 시간 (초) | `"4"` |
| `data-track-index` | 트랙 레이어 순서 | `"0"` (뒤), `"1"` (앞) |
| `data-media-start` | 미디어 재생 시작 오프셋 | `"2.5"` |
| `data-volume` | 오디오 볼륨 (0~1) | `"0.8"` |

### Sub-composition 삽입

```html
<div class="clip" id="intro"
     data-start="0" data-duration="5"
     data-composition-src="./intro.html">
</div>
```

### Variables 시스템

선언:
```html
<body data-composition-id="my-video"
      data-composition-variables='[
        {"name": "headline", "type": "string", "default": "Welcome"},
        {"name": "bgColor", "type": "string", "default": "#1a1a2e"}
      ]'>
```

읽기:
```js
const vars = window.__hyperframes.getVariables();
document.querySelector("h1").textContent = vars.headline;
```

오버라이드: `--variables '{"headline":"New Title"}'` 또는 `--variables-file vars.json`

## 레이아웃 규칙

1. **레이아웃 먼저, 애니메이션 나중**: 최종 상태를 먼저 CSS로 구축하고, `gsap.from()`으로 입장 애니메이션 적용
2. **flexbox/padding 사용**: 절대 위치 지정 하드코딩 금지 (콘텐츠 컨테이너에)
3. `gsap.from()` → 입장, `gsap.to()` → 퇴장

## Timeline 규약

```js
// 항상 paused: true
const tl = gsap.timeline({ paused: true });

// 동기적으로 빌드
tl.from(".title", { opacity: 0, y: 30, duration: 0.6 });
tl.from(".subtitle", { opacity: 0, duration: 0.4 }, "-=0.2");

// window.__timelines에 등록 (key = composition-id)
window.__timelines = window.__timelines || {};
window.__timelines["my-video"] = tl;
```

## 비디오/오디오 처리

```html
<!-- 비디오: 항상 muted -->
<video src="clip.mp4" muted data-start="0" data-duration="10"></video>

<!-- 오디오: 별도 요소 -->
<audio src="narration.mp3" data-start="0" data-duration="30" data-volume="1"></audio>
```

- 비디오 dimensions를 직접 애니메이션하지 마라
- 비디오를 timed div 안에 중첩하지 마라

## 절대 금지 사항

| 금지 | 이유 |
|------|------|
| `Math.random()` / `Date.now()` | 결정론적 렌더링 위반 |
| `repeat: -1` / 무한 루프 | 유한 타임라인 필수 |
| `visibility` / `display` 애니메이션 | `opacity` / `autoAlpha` 사용 |
| 비동기 타임라인 빌드 | 동기적으로 빌드해야 함 |
| `gsap.set()` (미래 씬 요소) | `tl.set()` 사용 |
| `<br>` (흐르는 텍스트 내) | CSS로 간격 제어 |
| 렌더 타임 네트워크 fetch | 로컬 에셋만 사용 |

## 씬 전환 규칙

- 씬 사이에 항상 transition 사용
- 입장은 항상 `gsap.from()` 사용
- 마지막 씬 외에는 퇴장 애니메이션 금지 — transition이 씬 전환 처리
- 레지스트리에서 transition 블록 사용 가능 (`npx hyperframes add <transition-name>`)

## 디자인 시스템 워크플로우

1. **design.md** 확인 — 색상, 타이포그래피, 스페이싱 토큰
2. **visual-styles.md** — 8개 프리셋 스타일 중 선택
3. **house-style.md** — 기본 크리에이티브 디렉션

**Hard Gate**: HTML 작성 전에 반드시 비주얼 아이덴티티 확인

## 작업 순서

```
Design System → Prompt Expansion → Plan → Implement
```

## 품질 검증

```bash
# 블로킹 (필수 통과)
npx hyperframes lint composition.html
npx hyperframes validate composition.html

# 병렬 (권장)
npx hyperframes inspect composition.html
# contrast audit
```

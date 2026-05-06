# Tailwind CSS — Hyperframes용 Tailwind v4.2

브라우저 런타임으로 빌드 없이 사용. `@tailwindcss/browser@4.2.4` 고정.

## 설정

```html
<head>
  <script src="https://unpkg.com/@tailwindcss/browser@4.2.4"></script>
  <style type="text/tailwindcss">
    @theme {
      --color-primary: #7B68EE;
      --color-surface: #0A0A1A;
      --font-display: "Space Grotesk", sans-serif;
    }
  </style>
</head>
```

## 핵심 규칙

### CSS-First 설정 (v4 방식)

```html
<style type="text/tailwindcss">
  /* @theme으로 디자인 토큰 정의 */
  @theme {
    --color-brand: #E63946;
    --spacing-section: 5rem;
  }

  /* @utility로 커스텀 유틸리티 */
  @utility text-gradient {
    background: linear-gradient(135deg, var(--color-primary), var(--color-brand));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
</style>
```

**v3 디렉티브 사용 금지**: `@apply`, `@layer`, `theme()` 함수 등 v3 문법 사용하지 마라.

### Ready 이벤트 대기

```js
window.addEventListener("__tailwindReady", () => {
  // Tailwind 처리 완료 후 타임라인 빌드
  const tl = gsap.timeline({ paused: true });
  // ...
  window.__timelines = { "my-video": tl };
});
```

또는:
```js
await new Promise(r => {
  if (window.__tailwindReady) r();
  else window.addEventListener("__tailwindReady", r);
});
```

### Dynamic Class — 완전한 클래스명 사용

```html
<!-- 올바름 -->
<div class="bg-red-500">...</div>

<!-- 잘못됨 — 동적 조합 금지 -->
<div class={`bg-${color}-500`}>...</div>
```

### 비디오 가드레일

- **안정적 dimensions**: 컨테이너 크기 변경 금지
- **애니메이션**: `transform`, `opacity`만 사용
- **레이아웃 시프트 방지**: 초기 상태에서 고정 크기 설정

## 자주 쓰는 클래스 조합

```html
<!-- 중앙 정렬 전체화면 -->
<div class="flex items-center justify-center h-full w-full">

<!-- 텍스트 카드 -->
<div class="p-20 flex flex-col justify-center h-full bg-surface">
  <h1 class="text-7xl font-bold text-white">Title</h1>
  <p class="text-2xl text-white/70 mt-4">Subtitle</p>
</div>

<!-- 그리드 레이아웃 -->
<div class="grid grid-cols-2 gap-8 p-16 h-full">
  <div class="bg-white/10 rounded-2xl p-8">Card 1</div>
  <div class="bg-white/10 rounded-2xl p-8">Card 2</div>
</div>
```

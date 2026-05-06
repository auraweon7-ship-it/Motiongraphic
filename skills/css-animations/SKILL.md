# CSS Animations — Hyperframes CSS 키프레임 어댑터

장식적 루프, 마스크, 글로우, 쉬머 등에 적합. GSAP과 함께 보조적으로 사용.

## 기본 규칙

1. **유한 duration/iterations** — 무한 애니메이션 금지
2. **`animation-fill-mode: both`** — 항상 설정
3. **레이아웃 속성 애니메이션 금지** — `width`, `height`, `top`, `left` 등 대신 `transform`, `opacity` 사용

## 사용 패턴

### 기본 키프레임

```css
@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.element {
  animation: fadeSlideIn 0.6s ease-out both;
  animation-iteration-count: 1;
}
```

### Stagger (CSS Custom Properties)

```css
.item {
  animation: fadeIn 0.4s ease-out both;
  animation-delay: calc(var(--stagger-index) * 0.1s);
}
```

```html
<div class="item" style="--stagger-index: 0">Item 1</div>
<div class="item" style="--stagger-index: 1">Item 2</div>
<div class="item" style="--stagger-index: 2">Item 3</div>
```

### 글로우 효과

```css
@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(123, 104, 238, 0.3); }
  50% { box-shadow: 0 0 40px rgba(123, 104, 238, 0.6); }
}

.glow-element {
  animation: glow 2s ease-in-out both;
  animation-iteration-count: 3;  /* 유한 반복 */
}
```

### 쉬머 스윕

```css
@keyframes shimmer {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}

.shimmer-overlay {
  animation: shimmer 1.5s ease-in-out both;
  animation-iteration-count: 1;
}
```

## 적합한 사용 사례

- 배경 장식 효과 (그레인, 글로우)
- 마스크 애니메이션
- 미묘한 반복 효과 (유한 횟수)
- CSS-only 트랜지션 보조

## 부적합한 사용 사례 (GSAP 사용 권장)

- 복잡한 시퀀스 애니메이션
- 정밀한 타이밍 제어
- 타임라인 동기화가 필요한 경우
- 인터랙티브 애니메이션

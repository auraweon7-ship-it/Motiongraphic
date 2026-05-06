# GSAP — Hyperframes 애니메이션 엔진

Hyperframes의 주요 애니메이션 시스템. 모든 타임라인은 결정론적이어야 한다.

## 타임라인 규약

```js
// 1. 항상 paused: true
const tl = gsap.timeline({ paused: true });

// 2. 동기적으로 빌드 (async 금지)
tl.from(".title", { opacity: 0, y: 40, duration: 0.6, ease: "power3.out" });
tl.from(".body", { opacity: 0, y: 20, duration: 0.4 }, "-=0.2");

// 3. window.__timelines에 등록 (key = data-composition-id)
window.__timelines = window.__timelines || {};
window.__timelines["my-composition"] = tl;
```

## 핵심 메서드

### gsap.to() — 현재 → 목표 상태

```js
tl.to(".box", { x: 200, opacity: 0.5, duration: 0.5 });
```

### gsap.from() — 시작 상태 → 현재 (입장 애니메이션)

```js
tl.from(".title", { opacity: 0, y: 30, duration: 0.6 });
```

### gsap.fromTo() — 명시적 시작/끝

```js
tl.fromTo(".bar", { width: 0 }, { width: "80%", duration: 1 });
```

### tl.set() — 즉시 설정 (gsap.set() 대신 사용)

```js
tl.set(".element", { opacity: 0 });  // 타임라인 내에서 사용
// gsap.set() 사용 금지 (미래 씬 요소에 대해)
```

## Transform 단축 속성

| 단축 | CSS 대응 |
|------|---------|
| `x`, `y` | `translateX`, `translateY` |
| `scale` | `scale` |
| `scaleX`, `scaleY` | 개별 축 스케일 |
| `rotation` | `rotate` (도 단위) |
| `skewX`, `skewY` | `skew` |

## autoAlpha

`opacity: 0` + `visibility: hidden`을 동시 처리. `visibility`/`display` 직접 애니메이션 대신 사용:

```js
tl.from(".element", { autoAlpha: 0, duration: 0.5 });
```

## Position 파라미터

```js
tl.to(".a", { x: 100, duration: 1 });
tl.to(".b", { x: 100, duration: 1 }, "-=0.5");   // 0.5초 겹침
tl.to(".c", { x: 100, duration: 1 }, "+=0.3");   // 0.3초 간격
tl.to(".d", { x: 100, duration: 1 }, 2);          // 절대 시간 2초
tl.to(".e", { x: 100, duration: 1 }, "myLabel");  // 라벨 위치
```

## Label

```js
tl.addLabel("section2", 5);
tl.from(".section2-title", { opacity: 0, duration: 0.5 }, "section2");
tl.from(".section2-body", { opacity: 0, duration: 0.4 }, "section2+=0.2");
```

## Stagger

```js
tl.from(".item", {
  opacity: 0,
  y: 20,
  duration: 0.4,
  stagger: 0.1  // 각 요소 0.1초 간격
});
```

## 중첩 타임라인

```js
const main = gsap.timeline({ paused: true });

const scene1 = gsap.timeline();
scene1.from(".s1-title", { opacity: 0, duration: 0.5 });

const scene2 = gsap.timeline();
scene2.from(".s2-title", { opacity: 0, duration: 0.5 });

main.add(scene1, 0);
main.add(scene2, 5);

window.__timelines = { "my-video": main };
```

## Ease 참조

| ease | 특성 |
|------|------|
| `power1.out` | 부드러운 감속 |
| `power2.out` | 자연스러운 감속 |
| `power3.out` | 강한 감속 |
| `power4.out` | 급격한 감속 |
| `back.out(1.7)` | 오버슈트 후 정착 |
| `elastic.out(1, 0.3)` | 탄성 효과 |
| `bounce.out` | 바운스 |
| `sine.inOut` | 부드러운 가감속 |
| `expo.out` | 극적인 감속 |

## 금지 사항

- `repeat: -1` 또는 무한 루프
- `gsap.set()` 사용 (미래 씬 요소) → `tl.set()` 사용
- 비동기 타임라인 빌드
- `Math.random()`, `Date.now()` 사용
- `visibility`/`display` 직접 애니메이션 → `autoAlpha` 사용
- camelCase가 아닌 CSS 속성명 (예: `background-color` → `backgroundColor`)

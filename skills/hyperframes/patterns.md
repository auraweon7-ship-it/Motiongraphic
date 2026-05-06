# Patterns — 자주 사용하는 합성 패턴

## PiP (Picture-in-Picture)

```html
<div class="clip" id="pip-scene" data-start="0" data-duration="10">
  <video src="main.mp4" muted style="width:100%; height:100%; object-fit:cover;"></video>
  <div style="position:absolute; bottom:20px; right:20px; width:320px; height:180px; border-radius:12px; overflow:hidden;">
    <video src="speaker.mp4" muted style="width:100%; height:100%; object-fit:cover;"></video>
  </div>
</div>
```

## Text Behind Subject (텍스트 뒤 피사체)

배경 제거 영상을 사용하여 텍스트가 피사체 뒤에 보이는 효과.

```html
<div class="clip" id="text-behind" data-start="0" data-duration="8">
  <!-- Layer 0: 배경 -->
  <div style="position:absolute; inset:0; background:#1a1a2e;"></div>
  
  <!-- Layer 1: 텍스트 (중간 레이어) -->
  <h1 style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
             font-size:120px; color:#fff; z-index:1;">TITLE</h1>
  
  <!-- Layer 2: 배경 제거된 피사체 (전면) -->
  <video src="subject-nobg.webm" muted
         style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:2;"></video>
</div>
```

## Title Card with Fade

```html
<div class="clip" id="title-card" data-start="0" data-duration="4">
  <div style="display:flex; flex-direction:column; justify-content:center; align-items:center;
              height:100%; background:#0d0d0d; color:#f2f2f2;">
    <h1 class="title" style="font-size:80px; font-weight:700;">Main Title</h1>
    <p class="subtitle" style="font-size:24px; opacity:0.7; margin-top:16px;">Subtitle here</p>
  </div>
</div>

<script>
const tl = gsap.timeline({ paused: true });
tl.from(".title", { opacity: 0, y: 40, duration: 0.6, ease: "power3.out" });
tl.from(".subtitle", { opacity: 0, y: 20, duration: 0.4, ease: "power2.out" }, "-=0.2");
window.__timelines = { "my-video": tl };
</script>
```

## Slide Show with Section Headers

```html
<!-- Section Header -->
<div class="clip" id="section-1" data-start="0" data-duration="3">
  <div style="display:flex; justify-content:center; align-items:center; height:100%; background:#e63946;">
    <h2 style="font-size:64px; color:#fff; font-weight:800;">Section One</h2>
  </div>
</div>

<!-- Content Slides -->
<div class="clip" id="slide-1" data-start="3" data-duration="5">
  <div style="padding:80px; height:100%; background:#f5f5f0;">
    <h3 style="font-size:48px; margin-bottom:24px;">Slide Title</h3>
    <p style="font-size:24px; line-height:1.6;">Content goes here...</p>
  </div>
</div>
```

## Top-level Composition 중첩

여러 sub-composition을 하나의 타임라인으로 결합:

```html
<body data-composition-id="full-video" data-width="1920" data-height="1080">
  
  <div class="clip" id="intro" data-start="0" data-duration="5"
       data-composition-src="./scenes/intro.html"></div>
  
  <div class="clip" id="main" data-start="5" data-duration="20"
       data-composition-src="./scenes/main-content.html"></div>
  
  <div class="clip" id="outro" data-start="25" data-duration="5"
       data-composition-src="./scenes/outro.html"></div>

</body>
```

## Data Visualization 패턴

숫자에 시각적 무게감 부여:

```html
<div class="clip" id="stat-card" data-start="0" data-duration="4">
  <div style="display:flex; flex-direction:column; justify-content:center; align-items:center; height:100%;">
    <span class="stat-number" style="font-size:160px; font-weight:900; color:#7B68EE;">42%</span>
    <span class="stat-label" style="font-size:24px; color:#888; margin-top:8px;">Growth Rate</span>
  </div>
</div>
```

- 관련 통계는 시각적 연속성 유지
- 파이 차트, 다축 그래프, 6패널 대시보드 금지
- 차트 라이브러리 대신 직접 HTML/CSS로 시각화

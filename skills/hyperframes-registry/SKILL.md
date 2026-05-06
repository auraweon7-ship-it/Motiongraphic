# Hyperframes Registry — 블록/컴포넌트 레지스트리

## 블록 추가

```bash
npx hyperframes add <name>
```

- **blocks** → `compositions/` 폴더에 설치
- **components** → `compositions/components/` 폴더에 설치

## 블록 연결 (Wiring)

### Sub-composition으로 연결

```html
<div class="clip" id="intro" data-start="0" data-duration="5"
     data-composition-src="./compositions/logo-outro.html"></div>
```

### 컴포넌트 삽입

컴포넌트의 HTML/CSS/JS를 직접 composition에 붙여넣기.

## 레지스트리 목록

### Examples (8개)
| 이름 | 설명 |
|------|------|
| `warm-grain` | 필름 그레인 오버레이 |
| `play-mode` | 재생 모드 데모 |
| `swiss-grid` | 스위스 그리드 레이아웃 |
| `vignelli` | 비녤리 스타일 |
| `decision-tree` | 의사결정 트리 |
| `kinetic-type` | 키네틱 타이포그래피 |
| `product-promo` | 상품 홍보 |
| `nyt-graph` | NYT 스타일 그래프 |

### Blocks (3개)
| 이름 | 설명 |
|------|------|
| `data-chart` | 데이터 차트 |
| `flowchart` | 플로우차트 |
| `logo-outro` | 로고 아웃트로 |

### Components (3개)
| 이름 | 설명 |
|------|------|
| `grain-overlay` | 필름 그레인 효과 |
| `shimmer-sweep` | 쉬머 스윕 효과 |
| `grid-pixelate-wipe` | 그리드 픽셀화 와이프 |

### Social Blocks (15+)
`instagram-follow`, `tiktok-follow`, `yt-lower-third`, `x-post`, `reddit-post`, `spotify-card` 등

### Transitions (15+)
`domain-warp-dissolve`, `ridged-burn`, `whip-pan`, `sdf-iris`, `ripple-waves`, `gravitational-lens`, `cinematic-zoom`, `glitch`, `swirl-vortex`, `thermal-distortion` 등

## 발견 및 탐색

전체 목록은 `registry.json` 또는 [hyperframes.heygen.com](https://hyperframes.heygen.com) 참조.

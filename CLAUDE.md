# Motiongraphic — Hyperframes 모션그래픽 작업 환경

## 도구

- **Hyperframes**: HTML-native 비디오 합성 프레임워크
- **GSAP**: 애니메이션 타임라인 엔진
- **Tailwind CSS v4.2**: 스타일링 (브라우저 런타임)
- **FFmpeg**: 비디오 렌더링 (필수 설치)
- **Node.js >= 22**: 런타임 (필수)

## Skills 참조

| Skill | 용도 |
|-------|------|
| `skills/hyperframes/` | 핵심 composition 규약, 디자인 시스템, 패턴 |
| `skills/hyperframes-cli/` | CLI 명령어 (init, lint, validate, render) |
| `skills/hyperframes-media/` | TTS, 음성 전사, 배경 제거 |
| `skills/hyperframes-registry/` | 블록/컴포넌트 레지스트리 |
| `skills/gsap/` | GSAP 애니메이션 작성 규약 |
| `skills/css-animations/` | CSS 키프레임 보조 애니메이션 |
| `skills/tailwind/` | Tailwind v4.2 사용법 |
| `skills/website-to-hyperframes/` | 웹사이트→비디오 변환 파이프라인 |

## 워크플로우

```
기획 → 스크립트 → 녹음(mp4) → Hyperframes 씬 제작 → 검증 → 렌더링
```

## 필수 규칙

1. HTML composition 작성 전에 `skills/hyperframes/visual-styles.md` 에서 비주얼 스타일 선택
2. 모든 GSAP 타임라인은 `{ paused: true }`로 생성, `window.__timelines`에 등록
3. 렌더 전 `lint` + `validate` 반드시 통과
4. `Math.random()`, `Date.now()`, 무한 루프, 비동기 타임라인 빌드 금지
5. 비디오는 항상 `muted`, 오디오는 별도 `<audio>` 요소

# Hyperframes CLI

요구사항: Node.js >= 22, FFmpeg 설치 필수

## 설치

```bash
npx hyperframes init my-video
```

## 명령어

### init — 프로젝트 초기화

```bash
npx hyperframes init <project-name>
```

기본 composition 템플릿과 폴더 구조 생성.

### lint — 문법 검사

```bash
npx hyperframes lint composition.html
```

data-* 속성, timeline 규약, 필수 요소 검증. **렌더 전 반드시 통과 필수.**

### validate — 구조 검증

```bash
npx hyperframes validate composition.html
```

composition 무결성, 타이밍 충돌, 누락된 에셋 확인. **렌더 전 반드시 통과 필수.**

### inspect — 상세 분석

```bash
npx hyperframes inspect composition.html
```

타임라인 구조, 트랙 배치, duration 분석 출력.

### preview — 브라우저 미리보기

```bash
npx hyperframes preview composition.html
```

로컬 서버를 실행하고 브라우저에서 실시간 미리보기.

### render — 비디오 렌더링

```bash
npx hyperframes render composition.html -o output.mp4
npx hyperframes render composition.html -o output.mp4 --quality high
```

품질 옵션:
| 레벨 | 용도 |
|------|------|
| `draft` | 빠른 확인, 저해상도 |
| `standard` | 일반 용도 (기본값) |
| `high` | 최종 출력, 최고 품질 |

### add — 레지스트리에서 블록 추가

```bash
npx hyperframes add <block-name>
```

## 공유

Studio URL 형식으로 공유 가능:
```
https://studio.hyperframes.heygen.com/share/<id>
```

## 검증 워크플로우

```bash
# 1. 필수 (블로킹)
npx hyperframes lint composition.html
npx hyperframes validate composition.html

# 2. 권장 (병렬 실행 가능)
npx hyperframes inspect composition.html

# 3. 렌더링
npx hyperframes render composition.html -o output.mp4
```

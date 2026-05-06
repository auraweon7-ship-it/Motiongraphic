# Hyperframes Media — TTS, 음성 전사, 배경 제거

## tts — 텍스트 음성 변환

Kokoro-82M TTS 엔진. 54개 음성, 다국어 지원.

```bash
npx hyperframes tts "안녕하세요, 오늘 소개할 내용입니다." --voice af_heart --output narration.wav
npx hyperframes tts --file script.txt --voice af_heart --output narration.wav
npx hyperframes tts "Hello world" --voice af_heart --speed 1.2 --output fast.wav
```

### 지원 언어
`en`, `es`, `fr`, `hi`, `it`, `pt`, `ja`, `zh`

### 한국어 사용 시
한국어는 현재 직접 지원하지 않으므로, 외부 TTS 서비스 사용 권장.

### 주요 옵션
| 옵션 | 설명 |
|------|------|
| `--voice` | 음성 선택 (54개 중) |
| `--output` | 출력 파일 경로 |
| `--speed` | 속도 조절 (기본 1.0) |
| `--file` | 텍스트 파일에서 읽기 |

## transcribe — 음성 전사 (STT)

Whisper 기반. 단어 단위 타임스탬프 제공.

```bash
npx hyperframes transcribe recording.mp4 --output transcript.json
npx hyperframes transcribe recording.mp4 --model large-v3 --output transcript.json
```

### 모델 선택
| 모델 | 정확도 | 속도 |
|------|--------|------|
| `tiny` | 낮음 | 매우 빠름 |
| `base` | 보통 | 빠름 |
| `small` | 좋음 | 보통 |
| `medium` | 높음 | 느림 |
| `large-v3` | 최고 | 매우 느림 |

**주의**: 비영어 콘텐츠에 `.en` 모델 사용 금지 (예: `tiny.en` 금지)

### 출력 형식

```json
[
  { "id": 0, "text": "안녕하세요", "start": 0.0, "end": 0.85 },
  { "id": 1, "text": "오늘", "start": 0.85, "end": 1.2 },
  { "id": 2, "text": "소개할", "start": 1.2, "end": 1.65 }
]
```

flat array, 각 항목에 `id`, `text`, `start`, `end` (초 단위).

## remove-background — 배경 제거

u2net_human_seg 모델 사용.

```bash
npx hyperframes remove-background input.mp4 --output subject.webm
npx hyperframes remove-background input.mp4 --output subject.webm --quality best
npx hyperframes remove-background input.mp4 --output subject.mov --format prores
npx hyperframes remove-background input.mp4 --output subject.webm --background-output plate.mp4
```

### 출력 형식
| 형식 | 확장자 | 특징 |
|------|--------|------|
| VP9+alpha WebM | `.webm` | 웹 호환, 기본값 |
| ProRes 4444 | `.mov` | 전문 편집, 높은 품질 |
| PNG 시퀀스 | `.png` | 프레임별 개별 파일 |

### 품질 프리셋
| 레벨 | 속도 | 품질 |
|------|------|------|
| `fast` | 빠름 | 보통 |
| `balanced` | 보통 | 좋음 (기본값) |
| `best` | 느림 | 최고 |

### `--background-output` 옵션

피사체가 제거된 배경 영상(hole-cut plate) 별도 출력. Text-behind-subject 합성에 사용:

```
원본 → subject.webm (피사체만) + plate.mp4 (배경만, 피사체 부분 빈 곳)
```

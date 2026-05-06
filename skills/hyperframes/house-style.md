# House Style — 크리에이티브 디렉션 기본값

## 피해야 할 AI 디자인 특성

- 과도한 그래디언트 남용
- 의미 없는 글래스모피즘
- 모든 요소에 둥근 모서리
- 고대비 네온 색상 남발
- 클립아트 느낌의 일러스트

## 색상 전략

| 콘텐츠 성격 | 모드 | 근거 |
|-------------|------|------|
| 정보 전달 / 교육 | Light | 가독성, 신뢰감 |
| 분위기 / 브랜드 | Dark | 몰입감, 프리미엄 |
| 데이터 / 기술 | Dark | 대비, 집중 |
| 일상 / 라이프스타일 | Light | 친근함, 접근성 |

## 시각적 깊이

- 최소 3단계 레이어: 배경 → 미드그라운드 → 포그라운드
- 미묘한 그림자와 오버레이로 깊이감 표현
- 텍스트와 배경 사이 충분한 대비 유지

## 모션 기준

| 항목 | 값 |
|------|-----|
| 기본 duration | 0.3s ~ 0.6s |
| ease 다양화 | 같은 ease를 연속 3회 이상 반복 금지 |
| 입장 | `gsap.from()` — 항상 |
| 퇴장 | transition 블록에 위임 |
| 스태거 | 0.05s ~ 0.15s 간격 |

## 타이포그래피 기준

| 요소 | weight | 최소 크기 |
|------|--------|----------|
| 헤드라인 | 700 ~ 900 | 60px |
| 본문 | 300 ~ 400 | 20px |
| 캡션 | 400 | 14px |

- 최대 2개 폰트 패밀리 사용
- 헤드라인-본문 weight 대비 유지

## 9가지 범주별 색상 팔레트

1. **Corporate** — Navy, White, Silver
2. **Tech** — Deep Blue, Electric Cyan, Dark Grey
3. **Creative** — Magenta, Yellow, Black
4. **Education** — Teal, Warm White, Slate
5. **Health** — Mint, Coral, Cream
6. **Finance** — Charcoal, Gold, White
7. **Entertainment** — Purple, Hot Pink, Black
8. **Nature** — Forest Green, Earth Brown, Sky Blue
9. **Minimal** — Off-White, Black, single accent

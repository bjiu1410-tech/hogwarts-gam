# 일러스트 요청 목록

지금은 모든 그림이 **코드로 자동 생성한 임시 도트**로 들어가 있습니다.
아래 파일을 주시면 해당 자리에 그대로 들어갑니다. 우선순위 순서입니다.

## 규격

| 종류 | 위치 | 크기 (권장) | 비고 |
|---|---|---|---|
| 초상화 | `img/portrait/<캐릭터>_<감정>.png` | 정사각형 64×64 또는 128×128 도트, 배경 투명 | 대사창 위에 128×128로 표시 |
| 이벤트 CG | `img/cg/<아이디>.png` | 384×216 도트 (2배인 768×432도 가능) | 화면 전체에 표시 |
| 걷기 스프라이트 | `img/sprite/<캐릭터>.png` | 48×96 시트 (16×24 칸 × 가로 3프레임 × 세로 4방향) | 행 순서: 아래, 왼쪽, 오른쪽, 위 / 열: 정지, 걸음1, 걸음2 |

감정 이름: `normal` `smile` `smirk` `angry` `sad` `surprise` `blush` `cry`
(감정별 그림이 없으면 `_normal` 그림을 대신 씁니다.)

## 1순위: 히로인 드레이코 (TS, 원작 성격)
- `portrait/draco_normal.png` ~ `draco_cry.png` (감정 8종 — 특히 `smirk` 비웃음, `blush` 당황이 많이 나옴)
- `sprite/draco.png`
- 설정: 백금발 긴 생머리, 회색 눈, 창백한 피부, 슬리데린 교복(초록·은색 넥타이). 도도하고 거만한 표정이 기본

## 2순위: 주인공 해리
- `portrait/harry_normal.png`, `harry_smile`, `harry_blush`, `harry_sad`, `harry_surprise`, `harry_angry`
- `sprite/harry.png`

## 3순위: 이벤트 CG (등장 순서)
| 아이디 | 장면 |
|---|---|
| `y1_malkin` | 말킨 부인 옷가게, 발판 위에서 턱을 치켜든 어린 드레이코 (해리 시점) |
| `y1_handshake` | 호그와트 급행열차 칸, 해리에게 손을 내미는 드레이코 (옆에 화난 론) |
| `y1_sorting` | 대연회장, 분류 모자를 쓴 해리 |
| `y1_troll` | 트롤을 쓰러뜨린 뒤 화장실의 해리·론·헤르미온느 |
| `y1_forest` | 금지된 숲, 울먹이며 해리의 로브 자락을 붙잡은 드레이코 |
| `y4_yule` | 크리스마스 무도회, 은빛 드레스의 드레이코와 해리 |
| `y6_bathroom` | 3층 화장실, 왼팔 표식을 보이며 우는 드레이코를 안아 주는 해리 |
| `y7_fiendfyre` | 악마의 화염 속, 빗자루 위에서 드레이코에게 손을 내미는 해리 |
| `end_true` | 동이 트는 천문탑, 손을 내미는 드레이코 (트루 엔딩) |

## 4순위: 조연 초상화 (normal 1장씩이면 충분)
`hermione` `ron` `lucius` `narcissa` `snape` `dumbledore` `mcgonagall` `hagrid` `dobby`
`neville` `ginny` `pansy` `blaise` `crabbe` `goyle` `lupin` `moody` `umbridge` `cedric`
`voldemort` `bellatrix` `myrtle` `lockhart` `quirrell` `firenze`

## 그림을 넣는 방법 (제가 처리합니다)
1. 파일을 `app/src/main/assets/www/img/` 아래 위 경로에 넣고
2. `img/manifest.js` 의 `ILLUST_FILES` 목록에 경로를 추가하면 끝.

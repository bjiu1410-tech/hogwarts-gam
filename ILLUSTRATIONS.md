# 일러스트 요청 목록

지금은 모든 그림이 **코드로 자동 생성한 임시 도트**로 들어가 있습니다.
아래 파일을 주시면 해당 자리에 그대로 들어갑니다. 우선순위 순서입니다.

## 규격

| 종류 | 위치 | 크기 (권장) | 비고 |
|---|---|---|---|
| 초상화 | `img/portrait/<캐릭터>_<감정>.png` | 정사각형 96×96 또는 128×128 도트, 배경 투명 | 대사창 위에 높이 112px로 표시 |
| 이벤트 CG | `img/cg/<아이디>.png` | 384×216 도트 (2배인 768×432도 가능) | 화면 전체에 표시 |
| 걷기 스프라이트 | `img/sprite/<캐릭터>.png` | 48×80 시트 (16×20 칸 × 가로 3프레임 × 세로 4방향) | 행 순서: 아래, 왼쪽, 오른쪽, 위 / 열: 정지, 걸음1, 걸음2 |

감정 이름: `normal` `smile` `smirk` `angry` `sad` `surprise` `blush` `cry`
(감정별 그림이 없으면 `_normal` 그림을 대신 씁니다.)

## 1순위: 주인공 드레이코 (TS)
- `portrait/draco_normal.png` ~ `draco_cry.png` (감정 8종)
- `sprite/draco.png`
- 설정: 은백색 긴 생머리, 회색 눈, 슬리데린 교복(초록·은색 넥타이), 1학년 땐 11살 → 학년 따라 같은 그림 사용

## 2순위: 해리
- `portrait/harry_normal.png`, `harry_smile`, `harry_blush`, `harry_sad`, `harry_surprise`, `harry_angry`, `harry_cry`
- `sprite/harry.png`

## 3순위: 이벤트 CG (등장 순서)
| 아이디 | 장면 |
|---|---|
| `y1_mirror` | 저택 침실 거울 앞, 처음으로 자기 모습을 보고 놀란 어린 드레이코 |
| `y1_malkin` | 말킨 부인 옷가게, 발판 위의 해리와 첫 만남 |
| `y1_handshake` | 호그와트 급행열차 칸, 해리에게 손을 내미는 드레이코 (옆에 론) |
| `y1_sorting` | 대연회장, 분류 모자를 쓴 드레이코 |
| `y1_troll` | 트롤을 쓰러뜨린 뒤 화장실의 네 사람 |
| `y1_forest` | 금지된 숲, 울먹이는 드레이코의 손을 잡아 주는 해리 |
| `y3_tower` | 별이 쏟아지는 천문탑 계단, 대부 이야기를 하는 해리와 드레이코 |
| `y4_yule` | 크리스마스 무도회, 은빛 드레스의 드레이코와 해리 |
| `y5_patronus` | 필요의 방, 은빛 흰 공작 패트로누스 |
| `y6_bathroom` | 3층 화장실, 왼팔 표식을 보이며 우는 드레이코를 안아 주는 해리 |
| `y7_fiendfyre` | 악마의 화염 속으로 손을 내미는 빗자루 위의 해리 |
| `end_true` | 동이 트는 천문탑, 고백 (트루 엔딩) |

## 4순위: 조연 초상화 (normal 1장씩이면 충분)
`hermione` `ron` `lucius` `narcissa` `snape` `dumbledore` `mcgonagall` `hagrid` `dobby`
`neville` `ginny` `pansy` `blaise` `crabbe` `goyle` `lupin` `moody` `umbridge` `cedric`
`voldemort` `bellatrix` `myrtle` `lockhart` `quirrell` `firenze`

## 그림을 넣는 방법 (제가 처리합니다)
1. 파일을 `app/src/main/assets/www/img/` 아래 위 경로에 넣고
2. `img/manifest.js` 의 `ILLUST_FILES` 목록에 경로를 추가하면 끝.

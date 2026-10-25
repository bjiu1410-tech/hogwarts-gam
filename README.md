# TS 말포이: 은빛 운명

해리 포터 세계에 **여자아이 드레이코 말포이로 빙의**한 주인공이, 원작 지식을 무기로
몰락 엔딩을 피하고 해리와의 운명을 바꿔 가는 **비공식·비영리 2차 창작 도트 게임**입니다.

- 1~7학년 원작 흐름을 따라가는 8개 장 + 엔딩 4종 (해리 / 우정 / 노멀 / 배드)
- 탐험(도트 맵 이동) + 비주얼노벨 대화 + 선택지에 따른 호감도·용기·어둠 수치
- 미니게임: 빗자루 비행(기억구슬 / 스니치 / 악마의 화염), 마법 결투, 마법약 조제, 무도회 리듬
- 자동 저장 · 장 선택 · 설정(글자 속도, 음악, 효과음)

## APK 받기
어느 브랜치든 푸시하면 GitHub Actions가 APK를 빌드합니다.
저장소의 **Releases** 페이지에서 최신 `ts-malfoy.apk`를 휴대폰으로 받아 설치하세요.
(처음 설치할 때 '출처를 알 수 없는 앱' 설치를 허용해야 합니다.)

## 조작
| | 휴대폰 | 키보드 |
|---|---|---|
| 이동 / 선택 | 왼쪽 십자키 | 방향키, WASD |
| 결정 / 대화 넘기기 | A, 화면 터치 | Z, Enter, Space |
| 빨리 넘기기 / 달리기 | B 누르고 있기 | X, Shift |
| 메뉴 | ≡ 버튼, 뒤로 가기 | Esc, M |

## 구조
```
app/src/main/assets/www/   게임 본체 (HTML5 Canvas, 외부 라이브러리 없음)
  js/story.js               시나리오 (문법은 파일 상단 주석 참고)
  js/maps.js                도트 맵
  js/art.js                 캐릭터·타일·초상화 도트 생성기
  js/minigames.js           미니게임
  js/engine.js              스크립트 실행기, 탐험, UI
  img/                      직접 그린 일러스트 (ILLUSTRATIONS.md 참고)
app/src/main/java/...       WebView로 게임을 띄우는 안드로이드 껍데기
```
PC 브라우저에서 `app/src/main/assets/www/index.html`을 열면 바로 테스트할 수 있습니다.
`index.html?test`로 열면 선택지를 자동으로 고르며 끝까지 돌려 보는 테스트 모드가 됩니다.

## 고지
해리 포터 및 관련 캐릭터의 권리는 J.K. 롤링과 Warner Bros.에 있습니다.
이 게임은 팬이 만든 비영리 2차 창작물이며, 판매하지 않습니다.
폰트: [갈무리(Galmuri)](https://github.com/quiple/galmuri) — SIL Open Font License 1.1.
APK 서명 키(`app/fan-release.keystore`)는 업데이트 설치용 고정 키로, 비밀 정보가 아닙니다.

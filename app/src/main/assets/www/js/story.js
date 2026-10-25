'use strict';
/* ================= 시나리오 =================
 문법
  == 학년 | 제목 | 부제          장 시작 카드 (자동 저장 / 장 선택 해금)
  # 라벨                          점프 대상
  이름(감정): 대사                감정: normal smile smirk angry sad surprise blush cry
  이름(감정)*: 속마음              * = 속마음 (파란 글씨)
  : 나레이션
  > 선택지 {harry+2, dark+1} -> 라벨     [if 조건] 을 맨 앞에 붙이면 조건부 선택지
  @if 조건 -> 라벨                조건 예: harry>=10 && !dark_route || courage>3
  @goto 라벨 / @set 플래그 [값] / @add 수치 n
  @bg 맵 [x y] / @bg black / @tint rgba(...) / @tint off
  @cg 아이디 | 캐릭터:감정,... | 설명      (img/cg/아이디.png 가 있으면 그 그림을 표시)
  @cgoff / @music 곡 / @sfx 효과음 / @fade / @shake / @flash [색] / @wait 초
  @explore 맵 x y 방향 → @npc id x y 방향 -> 라벨 / @obj x y -> 라벨 / @exit x y -> 라벨 / @goal 목표 → @play
  @back                           탐험으로 돌아가기 (출구였으면 한 칸 뒤로)
  @mini flight remembrall|snitch|fiendfyre  / duel troll|harry|hooded|boggart|dementor|deatheater / potion / dance
  @ending true|friend|normal|bad
 수치: harry(해리 호감도) hermione ron courage(용기) dark(어둠)
============================================ */
const STORY = String.raw`
== 1학년 | 마법사의 돌 | 눈을 뜨니, 은발의 소녀
@music dark
@bg black
: ……알람 소리가 아니다.
: 이불이 이상하게 부드럽다. 실크? 내 자취방 이불은 분명 만 원짜리 극세사였는데.
@bg room 6 4
@music slyth
: 초록색 캐노피, 은실로 수놓인 뱀 문양, 끝도 없이 높은 천장.
나*: (……여긴 어디야?)
@explore room 4 4 down
@goal 방을 둘러보자 (거울 · 옷장 · 문)
@obj 5 1 -> y1_mirror
@obj 11 3 -> y1_wardrobe
@exit 7 9 -> y1_room_door
@play

# y1_mirror
@cg y1_mirror | draco:surprise | 거울 속의 낯선 소녀
: 거울 속에서 은발의 여자아이가 나를 보고 있었다.
: 창백한 피부, 회색 눈동자. 열한 살쯤 되었을까. 겁먹은 얼굴로 입을 벌리고 있다.
나*: (손을 들면… 거울 속 아이도 손을 든다.)
나*: (……설마.)
@cgoff
: 거울 틀에 금박으로 이름이 새겨져 있다. 『드레이코 L. 말포이』
드레이코(surprise)*: (드레이코…… 말포이?!)
드레이코(surprise)*: (해리 포터의 그 말포이? 금발 올백에 툭하면 아버지 이름 팔던 그 녀석?)
드레이코(sad)*: (근데 왜…… 여자애인 건데?)
@set seen_mirror
@back

# y1_wardrobe
: 옷장 안에는 초록과 은색 드레스, 그리고 아직 포장도 뜯지 않은 검은 교복 로브가 걸려 있다.
: 로브에 꽂힌 쪽지 — "호그와트 입학을 축하한다, 우리 딸. 엄마가."
드레이코*: (입학 직전이라는 거네. 1991년 여름… 원작 1권이 시작하는 시점.)
@back

# y1_room_door
@if !seen_mirror -> y1_room_notyet
@goto y1_memory
# y1_room_notyet
나*: (잠깐, 나가기 전에 내 모습부터 확인해야 할 것 같은데… 저 거울.)
@back

# y1_memory
@bg room 7 5
드레이코(sad)*: (정리해 보자. 나는 분명 한국의 평범한 대학생이었고, 어젯밤에도 해리 포터 팬픽을 읽다가 잠들었다.)
드레이코*: (그리고 눈을 떠 보니 드레이코 말포이. 그것도 여자.)
드레이코(sad)*: (원작의 드레이코가 어떻게 됐더라. 죽음을 먹는 자가 되고, 덤블도어를 죽이라는 임무를 받고, 가문은 몰락하고…….)
드레이코(angry)*: (……싫어. 그런 결말은 절대 싫어.)
드레이코*: (원작을 아는 건 이 세상에서 나 하나뿐이야. 이번엔 다르게 살아 보겠어.)
@sfx door
나르시사(smile): 드레이코, 아직 자니? 오늘은 다이애건 앨리에 가는 날이란다.
드레이코(surprise): 아, 네! 엄마…… 아니, 어머니!
나르시사(smile): 후후, 잠이 덜 깼구나. 아래층에서 기다리마. 아버지께서 기다리시는 걸 싫어하시는 건 알지?
@fade
@explore manor 11 2 down
@goal 현관(아래쪽 문)으로 나가자
@npc dobby 7 4 down -> y1_dobby
@npc lucius 17 6 left -> y1_lucius
@npc narcissa 14 10 left -> y1_narcissa
@exit 12 11 -> y1_manor_exit
@play

# y1_dobby
도비(sad): 아, 아가씨! 도비는 아가씨의 구두를 아직 다 닦지 못했습니다! 도비는 벌을 받아야 합니다!
: 집요정은 스스로 머리를 벽난로 받침에 박으려 한다.
> 그만둬! 다치잖아. {courage+1} -> y1_dobby_kind
> "구두는 됐으니까 쉬어. 아버지께는 비밀이야." {courage+1} -> y1_dobby_kind
> 원작의 드레이코처럼 무시한다 {dark+1} -> y1_dobby_cold
# y1_dobby_kind
도비(surprise): 아가씨가… 도비에게… 쉬라고요?
도비(cry): 이렇게 위대하고 상냥한 마법사는 처음 봅니다! 도비는 이 은혜를 잊지 않을 겁니다!
드레이코(blush)*: (목소리가 너무 커! 아버지한테 들리겠어.)
@set dobby_kind
@back
# y1_dobby_cold
드레이코(smirk): …알아서 해.
도비(sad): 네, 아가씨…….
드레이코(sad)*: (원작대로 해야 의심을 안 받겠지만… 기분이 별로야.)
@back

# y1_lucius
루시우스: 드레이코. 말포이 가문의 상속녀라는 걸 잊지 마라.
루시우스: 다이애건 앨리에는 잡것들이 많다. 머글 태생이나 위즐리 같은 피의 배신자들과 어울리지 않도록.
> "네, 아버지." -> y1_lucius_ok
> "하지만 아버지, 피가 그렇게 중요한가요?" {courage+2} -> y1_lucius_q
# y1_lucius_ok
루시우스: 착하구나.
@back
# y1_lucius_q
루시우스(angry): ……뭐라고 했지?
드레이코(surprise): 아, 아뇨! 그냥… 실력이 더 중요하지 않을까 해서요. 말포이는 실력도 최고니까요!
루시우스(smirk): 흠. 말은 잘하는구나. 그 입담, 슬리데린에 어울리겠어.
드레이코*: (휴… 살았다. 루시우스한테 정면으로 대드는 건 아직 무리야.)
@back

# y1_narcissa
나르시사(smile): 준비됐니? 오늘은 교복이랑 지팡이를 맞추러 갈 거란다.
@back

# y1_manor_exit
@sfx door
@fade
@music school
@explore alley 2 6 right
@goal 말킨 부인의 옷가게에서 교복을 맞추자 (왼쪽 첫 번째 문)
@npc narcissa 2 4 down -> y1_alley_mom
@npc hagrid 9 3 down -> y1_alley_hagrid
@npc student2 18 6 left -> y1_alley_kid
@exit 5 1 -> y1_malkin
@exit 15 1 -> y1_alley_closed
@exit 25 1 -> y1_alley_closed
@play

# y1_alley_mom
나르시사: 엄마는 지팡이 상자를 보러 다녀오마. 먼저 말킨 부인 가게에 가 있으렴.
@back
# y1_alley_hagrid
해그리드(smile): 어이쿠, 미안하다, 꼬마 아가씨. 내 덩치가 길을 다 막았지?
드레이코*: (해그리드! 그렇다면 지금 말킨 가게 안에는…….)
@back
# y1_alley_kid
학생: 우와, 저 쇼윈도에 있는 님부스 2000 봤어? 세상에서 제일 빠른 빗자루래!
@back
# y1_alley_closed
: 지금은 볼일이 없다. 먼저 교복부터 맞추자.
@back

# y1_malkin
@sfx door
@explore malkin 7 7 up
@goal 발판 위에 선 소년에게 말을 걸어 보자
@npc harry 9 4 down -> y1_meet_harry
@play

# y1_meet_harry
@cg y1_malkin | harry:surprise | 말킨 부인의 가게에서
: 헐렁한 옷, 테이프로 붙인 동그란 안경, 덥수룩한 검은 머리.
드레이코(surprise)*: (해리 포터다……! 진짜 해리 포터!)
드레이코*: (원작에선 여기서 드레이코가 잘난 척하다가 첫인상을 망쳤지.)
해리(surprise): 어… 안녕. 너도 호그와트 가?
> "응! 나는 드레이코야. 너는?" 상냥하게 이름을 묻는다 {harry+2} -> y1_mh_kind
> "당연하지. 너희 부모님도 마법사야?" 원작처럼 묻는다 {dark+1} -> y1_mh_canon
> "…그 안경, 테이프 붙인 거야? 패션이야?" 장난스럽게 {harry+1} -> y1_mh_tease
# y1_mh_kind
해리(smile): 난 해리. 해리… 포터.
드레이코(smile): 반가워, 해리. 너도 호그와트 처음이지? 나도 엄청 떨려.
해리(smile): 다행이다. 나만 아무것도 모르는 줄 알았어.
@goto y1_mh_end
# y1_mh_canon
해리(sad): 어… 잘 모르겠어. 우리 부모님은 돌아가셨거든.
드레이코(sad)*: (아. 내가 무슨 소릴…….)
드레이코(sad): …미안. 몰랐어.
해리: 괜찮아.
@goto y1_mh_end
# y1_mh_tease
해리(blush): 이, 이건… 사촌이 부숴서.
드레이코(smile): 레파로! …아, 아직 지팡이가 없구나. 호그와트에서 고쳐 줄게.
해리(smile): …너 좀 이상한 애구나.
드레이코(smirk): 칭찬으로 들을게.
@goto y1_mh_end
# y1_mh_end
: 창밖에서 거구의 남자가 아이스크림 두 개를 들고 손을 흔든다.
해리(smile): 해그리드다! 난 이만 가 볼게.
해리: 나중에 학교에서 보자. …음, 이름이 드레이코였지?
드레이코(blush): 응. 학교에서 봐.
@cgoff
@set met_harry
드레이코*: (첫 만남은 나쁘지 않았어. 문제는 그다음…… 호그와트 급행열차야.)
@fade

== 1학년 | 호그와트 급행열차 | 운명의 악수
@music school
@explore train 1 5 right
@goal 열차 안을 돌아다니며 해리를 찾자 (오른쪽 칸)
@npc crabbe 1 6 right -> y1_tr_cg
@npc goyle 2 6 right -> y1_tr_cg
@npc neville 13 2 down -> y1_tr_neville
@npc hermione 15 6 left -> y1_tr_hermione
@npc harry 22 2 down -> y1_tr_harry
@npc ron 23 2 down -> y1_tr_ron
@obj 28 3 -> y1_tr_toad
@play

# y1_tr_cg
크레이브: 말포이, 간식 카트 언제 와?
고일: 배고파.
드레이코(smirk)*: (원작의 든든한 꼬붕 둘… 나쁜 애들은 아니니까 일단 데리고 다니자.)
@back

# y1_tr_neville
@if gave_toad -> y1_tr_nev_done
@if found_toad -> y1_tr_nev_give
네빌(cry): 내 두꺼비 트레버 못 봤니? 또 없어졌어…….
드레이코*: (트레버! 원작에서도 계속 도망 다니던 그 두꺼비.)
@back
# y1_tr_nev_give
드레이코(smile): 여기. 맨 끝 칸 의자 밑에 숨어 있더라.
네빌(surprise): 트레버! 고, 고마워! 넌 슬리데린 갈 것 같은 분위기인데 착하구나…….
드레이코(smirk): 그거 칭찬 맞지?
@set gave_toad
@add hermione 1
@back
# y1_tr_nev_done
네빌(smile): 트레버가 네 냄새를 좋아하나 봐. 계속 너 쪽을 봐.
@back

# y1_tr_toad
@if found_toad -> y1_tr_toad_none
: 의자 밑에서 개굴, 소리가 난다. 통통한 두꺼비다!
드레이코: 너 트레버지? 주인이 울고 있어.
@set found_toad
@sfx sparkle
@back
# y1_tr_toad_none
: 빈 의자뿐이다.
@back

# y1_tr_hermione
@if her_talk2 -> y1_tr_her3
@if gave_toad -> y1_tr_her2
@if her_talk1 -> y1_tr_her3
헤르미온느: 혹시 두꺼비 못 봤니? 네빌이라는 애가 잃어버렸대.
헤르미온느: 아, 난 헤르미온느 그레인저야. 교과서는 벌써 다 외웠어. 너는?
드레이코(smile): 드레이코 말포이. …교과서를 다 외웠다고?
헤르미온느(smile): 물론이지! 너무 재미있었어.
드레이코*: (역시 헤르미온느다.)
@set her_talk1
@back
# y1_tr_her2
헤르미온느(surprise): 네가 트레버를 찾아 줬다며? 고마워. 순수혈통 집안 애들은 다 거만한 줄 알았는데.
드레이코(smirk): 거만한 건 맞아. 두꺼비한테만 관대할 뿐이야.
헤르미온느(smile): 풉. 너 재밌다.
@set her_talk2
@add hermione 1
@back
# y1_tr_her3
헤르미온느: 곧 도착한대. 로브로 갈아입어야 해!
@back

# y1_tr_ron
론: …뭐야, 슬리데린 냄새 나는데.
드레이코(smirk)*: (이쪽은 벌써 날 싫어하네. 아직 이름도 안 댔는데.)
@back

# y1_tr_harry
@cg y1_handshake | draco:normal,harry:surprise,ron:angry | 운명의 악수
해리(surprise): 어, 드레이코! 말킨 가게에서 만났던.
론: 해리, 얘 알아? 말포이 집안이잖아. 아빠가 그러는데 그 집은…….
드레이코*: (원작에서 드레이코는 여기서 론을 비웃고, 해리에게 손을 내밀었다가 거절당했다.)
드레이코*: (여기가 첫 번째 갈림길이야.)
> 론에게 먼저 정중히 인사하고 해리에게 손을 내민다 {harry+3, ron+2} -> y1_hs_good
> 원작처럼 위즐리를 비웃으며 손을 내민다 {dark+2, ron-2} -> y1_hs_bad
> 악수 대신 같이 간식을 먹자고 한다 {harry+1, ron+1} -> y1_hs_snack
# y1_hs_good
드레이코(smile): 위즐리 맞지? 너희 형들 퀴디치 엄청 잘한다던데. 난 드레이코 말포이야.
론(surprise): 어… 어, 론이야. 론 위즐리.
드레이코: 우리 아버지랑 너희 아버지 사이 안 좋은 거 알아. 그건 어른들 일이고.
드레이코(smile): 해리. 친구 하자. 너랑, 론이랑, 다.
: 해리는 잠시 놀란 얼굴로 내민 손을 내려다보다가— 그 손을 꼭 잡았다.
해리(smile): 응. 좋아.
드레이코(blush)*: (……잡았다. 원작이 바뀌었어.)
@set handshake
@goto y1_tr_end
# y1_hs_bad
드레이코(smirk): 빨간 머리에 물려받은 로브라. 위즐리구나. 해리, 친구는 가려 사귀는 게 좋아. 내가 도와줄게.
해리(angry): 친구는 내가 알아서 고를 수 있어. 고마워.
드레이코(sad)*: (……아. 원작이랑 똑같이 해 버렸어. 나, 왜 이랬지.)
@goto y1_tr_end
# y1_hs_snack
드레이코: 악수 같은 건 됐고. 개구리 초콜릿 있는데 같이 먹을래? 카드 바꾸기 하자.
론(surprise): 너 아그리파 카드 있어?!
드레이코(smirk): 세 장.
론(smile): …너 생각보다 괜찮은 애일지도.
해리(smile): 하하. 고마워, 드레이코.
@goto y1_tr_end
# y1_tr_end
@cgoff
@fade

@music title
@bg hall 11 6
: 수천 개의 촛불이 허공에 떠 있는 대연회장. 천장에는 밤하늘이 그대로 비친다.
맥고나걸: 이름을 부르면 앞으로 나와 모자를 쓰도록. …말포이, 드레이코!
@cg y1_sorting | hat:normal,draco:surprise | 분류 모자
분류 모자: 호오…… 이건 처음 보는 머리로구나.
분류 모자: 영혼이 두 겹이야. 이 아이의 것이 아닌 기억이 보여. 아주 먼 곳의… 아주 이상한 세상의 기억.
드레이코(surprise)*: (모, 모자한테 들켰어?!)
분류 모자: 걱정 마라, 나는 비밀을 지킨다. 자, 어디로 보내 줄까.
> "슬리데린으로요. 가족 곁에서 운명을 바꿀 거예요." {courage+1} -> y1_sort_sly
> "그리핀도르는… 안 될까요?" {courage+2, harry+1} -> y1_sort_gry
# y1_sort_gry
분류 모자: 용기는 충분해. 하지만 네가 지키고 싶은 것들은 대부분 뱀의 굴 안에 있지 않니?
분류 모자: 네 어머니, 네 아버지, 그리고 네 자신의 미래까지.
드레이코(sad)*: (……맞아. 슬리데린에서 도망치면 말포이 가문은 그대로 무너질 거야.)
# y1_sort_sly
분류 모자: 좋다. 그렇다면— 슬리데린!
@cgoff
@sfx sparkle
: 초록 테이블에서 환호가 터진다.
: 잠시 후, 해리 포터의 이름이 불렸고— 모자는 "그리핀도르!"라고 외쳤다.
@if handshake -> y1_sort_wave
드레이코*: (해리는 그리핀도르. 원작대로네.)
@goto y1_sort_end
# y1_sort_wave
: 그리핀도르 테이블로 걸어가던 해리가 돌아보며 작게 손을 흔들었다.
드레이코(blush)*: (…저렇게 웃으면 반칙이잖아.)
@add harry 1
# y1_sort_end
@fade
@music slyth
@explore slyth 9 8 up
@goal 슬리데린 휴게실. 친구들과 이야기한 뒤 수업에 가자 (아래 문)
@npc pansy 5 4 down -> y1_sl_pansy
@npc blaise 13 5 left -> y1_sl_blaise
@npc goyle 12 8 up -> y1_sl_cg
@exit 9 9 -> y1_potions
@play

# y1_sl_pansy
팬지: 드레이코! 너 아까 포터한테 손 흔들던데? 설마 그리핀도르 애랑 친해?
> "친하면 안 돼?" {courage+1} -> y1_sl_p1
> "…착각이야." -> y1_sl_p2
# y1_sl_p1
팬지(surprise): 와… 너 진짜 대담하다. 아버님이 아시면 어쩌려고.
드레이코(smirk): 그러니까 너만 알고 있어.
@back
# y1_sl_p2
팬지(smile): 그렇지? 역시 드레이코야.
@back
# y1_sl_blaise
블레이즈: 말포이. 너 좀 달라 보여. 순수혈통 자랑도 안 하고.
드레이코(smirk): 자랑할 게 그것밖에 없는 사람들이나 하는 거지.
블레이즈(smile): …흥, 마음에 드는 대답이네.
@back
# y1_sl_cg
고일: 첫 수업은 마법약이래. 스네이프 교수님.
@back

# y1_potions
@bg classroom 10 4
스네이프: 이 수업에서는 어리석게 지팡이를 휘두르지 않는다. 마법약이라는 섬세한 기술을 이해할 수 있는 자가 이 중 몇이나 될지 모르겠군.
스네이프(smirk): 포터. 우리의 새로운… 유명 인사. 아스포델 뿌리 가루를 쑥 우린 물에 넣으면 무엇이 되지?
해리(surprise): …모르겠습니다.
드레이코*: (정답은 '살아 있는 죽음의 약'. 원작 팬이라면 다 아는 거.)
> 몰래 쪽지에 답을 적어 해리에게 넘긴다 {harry+2, courage+1} -> y1_pt_note
> 손을 들어 직접 대답한다 {hermione+1} -> y1_pt_answer
> 원작처럼 크레이브, 고일과 키득거린다 {dark+1, harry-1} -> y1_pt_laugh
# y1_pt_note
: 해리가 쪽지를 펼쳐 보고 눈을 크게 뜬다.
해리: …살아 있는 죽음의 약, 입니다.
스네이프(angry): ……. 커닝으로 그리핀도르 1점 감점. 그리고 쪽지를 넘긴 미스 말포이.
드레이코(surprise): 넵.
스네이프: …답은 정확하니 슬리데린 1점. 앉도록.
: 해리가 고개를 돌려 입 모양으로 '고마워'라고 말했다.
@goto y1_pt_brew
# y1_pt_answer
드레이코: 살아 있는 죽음의 약입니다, 교수님.
스네이프: …정확하다. 슬리데린 5점. 포터, 명성만으로는 이 수업을 따라올 수 없다.
: 앞자리의 헤르미온느가 '나도 알았는데!' 하는 얼굴로 돌아본다.
@goto y1_pt_brew
# y1_pt_laugh
: 크레이브와 고일이 따라 웃는다. 해리의 귀가 빨개진다.
드레이코(sad)*: (…이건 아니었어. 다음엔 다르게 하자.)
# y1_pt_brew
스네이프: 오늘은 종기 치료약이다. 미스 말포이, 시범을.
@mini potion
@if last==win -> y1_pt_win
스네이프: …평범하군. 연습하도록.
@goto y1_flying
# y1_pt_win
스네이프(smirk): 훌륭하다. 이것이 제대로 된 종기 치료약이다. 슬리데린 10점.
: 해리와 론이 '저게 된다고?' 하는 표정을 짓는다.
@add courage 1

# y1_flying
@fade
@music school
@bg grounds 12 8
: 첫 비행 수업. 네빌이 빗자루에서 떨어져 손목을 다쳤고, 후치 선생님이 그를 의무실로 데려갔다.
: 잔디밭에 유리구슬 하나가 반짝인다. 네빌의 기억구슬이다.
드레이코*: (이 장면…! 원작에선 드레이코가 이걸 던지고, 해리가 받아 내서 수색꾼이 됐지.)
드레이코*: (해리가 수색꾼이 되는 건 바뀌면 안 돼. 하지만 내가 악당일 필요는 없잖아?)
해리(angry): 드레이코, 그거 네빌 거야.
> "알아. 네빌한테 내가 직접 돌려줄게." {harry+2} -> y1_fl_return
> "그럼 잡아 봐, 포터!" 하늘로 던지고 같이 날아오른다 {courage+1} -> y1_fl_race
# y1_fl_return
해리(surprise): …어? 아, 응. 고마워.
: 그 순간 강한 돌풍이 불어 기억구슬이 드레이코의 손에서 튕겨 날아갔다!
해리(angry): 내가 잡을게!
: 해리가 빗자루를 박차고 날아올랐다. 그리고 땅에 닿기 직전, 구슬을 낚아챘다.
드레이코(surprise)*: (……운명은 어떻게든 원래 길로 가려는구나.)
@goto y1_fl_after
# y1_fl_race
해리(smirk): 좋아. 후회하지 마!
: 두 사람이 동시에 날아올랐다. 떨어지는 구슬을 향해—
@mini flight remembrall
@if last==win -> y1_fl_win
: 해리가 한 뼘 차이로 먼저 구슬을 낚아챘다.
해리(smile): 내가 이겼어!
드레이코(angry): 이번만 봐준 거야!
@goto y1_fl_after
# y1_fl_win
: 드레이코의 손끝에 구슬이 닿았다. 바로 옆에서 해리가 아깝다는 듯 웃는다.
해리(smile): 너 진짜 잘 난다!
드레이코(blush): 다, 당연하지. 말포이니까.
@add harry 1
@set fl_win
# y1_fl_after
맥고나걸(surprise): 해리 포터! 당장 이리 오도록!
: 맥고나걸 교수가 해리를 데려갔다.
: 그날 저녁, 해리가 백 년 만의 최연소 수색꾼이 되었다는 소문이 돌았다.
@if !fl_win -> y1_halloween
: 그리고… 왜인지 슬리데린 퀴디치 주장도 드레이코를 눈여겨보기 시작했다.
@set seeker_scout

# y1_halloween
@fade
@music tension
@bg hall 11 8
: 할로윈 만찬. 호박 램프가 둥둥 떠다닌다.
: 그런데 헤르미온느의 자리가 비어 있다. 론이 무심코 한 말에 상처받고 화장실에서 울고 있다는 소문이다.
드레이코(surprise)*: (오늘이 그날이야. 곧 퀴렐이 뛰어 들어올 거야!)
퀴렐(surprise): 트, 트롤이…! 지하 감옥에 트롤이…! 알려 드려야 할 것 같아서…….
@shake
: 퀴렐이 기절하자 연회장이 아수라장이 된다.
> 헤르미온느가 있는 화장실로 직접 달려간다 {courage+2} -> y1_hw_run
> 반장에게 헤르미온느가 화장실에 있다고 알린다 {hermione+1} -> y1_hw_tell
> 슬리데린 무리를 따라 기숙사로 돌아간다 {dark+1} -> y1_hw_ignore
# y1_hw_tell
: 반장은 바쁘다며 드레이코의 말을 흘려들었다. 결국 원작대로 해리와 론이 화장실로 향했다.
: 다음 날, 세 사람은 단짝이 되어 있었다.
드레이코*: (…그래도 무사해서 다행이야.)
@goto y1_forest
# y1_hw_ignore
: 다음 날, 해리와 론과 헤르미온느가 트롤을 쓰러뜨렸다는 소문이 돌았다.
드레이코(sad)*: (원작대로야. 거기에 내 자리는 없었네.)
@goto y1_forest
# y1_hw_run
@explore corridor 3 6 right
@goal 3층 여자 화장실로! (오른쪽 위 문)
@npc troll 15 3 right
@exit 24 1 -> y1_hw_bath
@play
# y1_hw_bath
@bg bathroom 7 4
헤르미온느(cry): 드, 드레이코?! 여긴 여자 화장실… 아, 너도 여자지. 아니 그게 아니라—
드레이코(angry): 그게 중요한 게 아니야! 뒤에!
@shake
: 쿵. 쿵. 4미터는 될 법한 트롤이 몽둥이를 끌고 들어온다.
@mini duel troll
@if last==win -> y1_hw_win
: 트롤의 몽둥이에 세면대가 산산조각 나고— 그 순간 해리와 론이 뛰어들었다.
론(angry): 윙가르디움 레비오사!
: 몽둥이가 둥실 떠올랐다가 트롤의 머리 위로 떨어졌다. 쿵.
@goto y1_hw_after
# y1_hw_win
: 드레이코의 부유 마법에 들린 몽둥이가 트롤의 머리 위로 떨어졌다. 쿵!
: 뒤늦게 뛰어든 해리와 론이 입을 떡 벌린다.
론(surprise): …저거 슬리데린이 한 거야?
해리(smile): 드레이코, 너 대단하다!
@add harry 1
@add ron 1
# y1_hw_after
헤르미온느(cry): 고마워… 다들, 진짜 고마워.
드레이코(smile): 울지 마. 론, 너도 사과해. 네가 한 말 때문에 여기 있었던 거잖아.
론(sad): …미안, 헤르미온느. 내가 바보였어.
헤르미온느(smile): …응.
@cg y1_troll | hermione:smile,draco:smile,harry:smile,ron:smile | 트롤 사건 이후
: 그날 이후, 그리핀도르 세 명과 슬리데린 한 명이라는 이상한 조합이 도서관에서 자주 목격되었다.
@add hermione 3
@set troll_friends
@cgoff

# y1_forest
@fade
@music dark
@bg grounds 6 12
: 시간이 흘러 봄. 해그리드의 아기 용 노버트를 몰래 떠나보내던 밤—
@if troll_friends -> y1_fo_friend
: 드레이코는 해리 일행의 뒤를 밟다가 함께 필치에게 붙잡혔다.
@goto y1_fo_go
# y1_fo_friend
: 망을 봐 주겠다며 따라나선 드레이코는, 결국 다 함께 필치에게 붙잡혔다.
# y1_fo_go
: 벌칙은… 금지된 숲에서 다친 유니콘을 찾는 것.
드레이코(sad)*: (원작에서 드레이코가 비명을 지르고 도망쳤던 장면이야. 그리고 그 숲에는…… 볼드모트가 있어.)
@explore forest 16 13 up
@goal 은빛 피의 흔적을 따라가자 (위쪽 공터)
@npc harry 17 12 up -> y1_fo_harry
@npc hagrid 15 11 right -> y1_fo_hagrid
@obj 17 4 -> y1_fo_unicorn
@obj 18 4 -> y1_fo_unicorn
@play
# y1_fo_harry
해리: 괜찮아? 무서우면 내 뒤에 있어.
드레이코(blush): 누, 누가 무섭대! …그냥 조금 춥다는 거지.
해리(smile): 응, 그래. 춥구나.
@back
# y1_fo_hagrid
해그리드: 유니콘 피는 은빛이라 달빛에 잘 보일 게다. 너희 둘은 저 위쪽을 맡아라.
@back
# y1_fo_unicorn
@npc hooded 17 2 down
@npc harry 16 5 up
@music tension
: 은빛 웅덩이 위에 쓰러진 유니콘. 그리고 그 위에 엎드린 두건 쓴 형체가— 피를 마시고 있었다.
@shake
???: …….
: 형체가 고개를 든다. 은빛으로 젖은 입. 이쪽을 향해 미끄러지듯 다가온다.
해리(surprise): 으윽…! 흉터가…!
: 해리가 이마를 감싸 쥐고 무릎을 꿇는다.
드레이코(surprise)*: (원작의 드레이코는 여기서 도망쳤어. 지금 도망쳐도 아무도 날 탓하지 않겠지만—)
> 해리 앞을 막아서며 지팡이를 든다 {harry+3, courage+2} -> y1_fo_stay
> 비명을 지르며 도망친다 (원작대로) {dark+1} -> y1_fo_flee
# y1_fo_stay
드레이코(angry): 오, 오지 마! 해리한테서 떨어져!
@mini duel hooded
: 떨리는 지팡이 끝에서 튀어나간 빛이 형체의 두건을 스쳤다. 형체가 잠시 멈칫한다.
: 그 순간, 말발굽 소리와 함께 켄타우로스가 뛰어들었다.
@hide hooded
피렌체: 물러서라!
: 두건 쓴 형체는 어둠 속으로 사라졌다.
피렌체(smile): 용감한 아이로구나. 별들이 말하더군. 은빛의 아이가 운명의 실을 바꿀 거라고.
드레이코(surprise)*: (…별들까지 날 알아본다고?)
해리(sad): 드레이코… 괜찮아? 너 떨고 있어.
드레이코(cry): 안 떨거든…!
: 해리가 말없이 드레이코의 손을 잡았다. 차가운 두 손이 조금씩 따뜻해졌다.
@cg y1_forest | draco:cry,harry:sad | 금지된 숲의 밤
드레이코(blush)*: (……심장 소리, 들리면 안 되는데.)
@cgoff
@set forest_stay
@goto y1_end
# y1_fo_flee
: 드레이코는 뒤도 돌아보지 않고 달렸다. 등 뒤에서 말발굽 소리가 들렸다.
: 다음 날, 해리가 무사하다는 소식을 들었다. 켄타우로스가 구해 줬다고 했다.
드레이코(sad)*: (…다리가 멋대로 움직였어. 나 정말 비겁하다.)

# y1_end
@fade
@music romance
@bg hall 11 6
: 학년 말. 해리는 퀴렐— 아니, 그의 뒤통수에 붙어 있던 볼드모트로부터 마법사의 돌을 지켜 냈다.
: 기숙사 우승컵은 덤블도어 교장의 막판 점수 몰아주기로 그리핀도르에게 돌아갔다.
팬지(angry): 이게 말이 돼?! 마지막에 점수를 저렇게 막 주는 게 어딨어!
드레이코(smirk)*: (원작 읽을 때도 그건 좀 너무했다고 생각했어.)
@bg station 14 5
@music school
: 킹스크로스역, 9와 3/4 승강장.
@if harry>=6 -> y1_end_good
해리: 방학 잘 보내, 말포이.
드레이코*: (아직은 '말포이'구나. 그래도 원작보단 나아.)
@goto y1_end_end
# y1_end_good
해리(smile): 드레이코! 방학 동안… 편지 보내도 돼?
드레이코(surprise): 편지? 머글 집에 부엉이가 가도 괜찮아?
해리(smile): 이모부가 기절하겠지. 그래서 더 좋아.
드레이코(smile): 큭… 좋아. 매주 보낼게. 답장 안 하면 하울러 보낼 거야.
해리(blush): 하, 하울러는 좀…….
@set letters
# y1_end_end
드레이코*: (1학년, 끝. 운명은 조금씩 바뀌고 있어.)
@fade

== 2학년 | 비밀의 방 | 일기장과 은빛 수색꾼
@music slyth
@bg manor 11 6
@if letters -> y2_letters
: 여름 방학. 해리에게서는 아무 소식이 없었다.
@goto y2_dobby
# y2_letters
: 여름 방학. 처음 몇 주는 해리와 편지를 주고받았지만, 어느 날부터 답장이 뚝 끊겼다.
드레이코*: (원작대로라면… 도비가 해리의 편지를 가로채고 있을 때야.)
# y2_dobby
@if !dobby_kind -> y2_book
도비(sad): 아가씨… 도비는 아가씨께 거짓말을 할 수 없습니다.
도비(cry): 도비는 해리 포터의 편지를 숨기고 있습니다! 해리 포터가 호그와트에 가면 위험하기 때문입니다! 끔찍한 일이…!
드레이코: 알아, 도비. 비밀의 방이지?
도비(surprise): 어, 어떻게…!
드레이코(smile): 편지는 돌려줘. 대신 해리는 내가 지킬게. 약속해.
도비(cry): 아가씨……!
@set dobby_ally
@add courage 1

# y2_book
@fade
@music school
@explore bookshop 8 7 up
@goal 플러리시 앤 블롯츠. 아버지를 지켜보자
@npc lockhart 9 4 down -> y2_lockhart
@npc lucius 4 6 right -> y2_lucius
@npc ginny 6 7 left -> y2_ginny
@npc harry 12 7 left -> y2_bs_harry
@play
# y2_lockhart
록허트(smile): 오, 아름다운 숙녀분! 사인이 필요하신가요? 신간 『마법 같은 나』 출간 기념이랍니다!
드레이코(smirk)*: (이 사람, 기억 지우는 마법만 잘하는 사기꾼이지.)
@back
# y2_bs_harry
@if harry>=6 -> y2_bs_harry2
해리: …말포이. 너도 왔구나.
@back
# y2_bs_harry2
해리(smile): 드레이코! 편지 답장 못 해서 미안. 이상한 집요정이 다 막고 있었어.
드레이코(smirk): 알아. …그 집요정, 사실 착한 애야. 너무 미워하지 마.
@back
# y2_ginny
지니(blush): (해리 포터다… 진짜 해리 포터…!)
드레이코*: (지니 위즐리. 아버지가 저 아이 솥에 일기장을 넣으려고 하는 거지.)
@back
# y2_lucius
루시우스(smirk): 드레이코. 잠시 저쪽에 가 있거라. 아버지는 위즐리 가문과… 볼일이 있다.
: 루시우스의 손에 낡은 검은 일기장이 들려 있다.
드레이코*: (톰 리들의 일기장! 저게 지니 손에 들어가면 1년 내내 지니가 조종당해.)
> 몰래 일기장을 빼내려 한다 {courage+1} -> y2_swap
> 지니에게 "솥 안을 잘 확인해"라고 귀띔한다 -> y2_warn_ginny
> 아무것도 하지 않는다 -> y2_nothing
# y2_swap
: 손을 뻗으려던 순간, 루시우스가 차가운 눈으로 돌아본다.
루시우스(angry): 무엇을 하는 거지, 드레이코.
@if courage>=4 -> y2_swap_bluff
드레이코(surprise): 아, 아무것도요!
루시우스: …요즘 네 행동이 이상하다는 이야기를 들었다. 처신 잘하거라.
@set lucius_suspect
@goto y2_bs_fail
# y2_swap_bluff
드레이코(smirk): 아버지 로브에 먼지가 묻어서요. 위즐리네 먼지일까 봐.
루시우스(smirk): …하. 그래, 이런 곳은 먼지투성이지.
# y2_bs_fail
: 결국 검은 일기장은 지니의 솥 안으로 사라졌다.
드레이코(sad)*: (실패야. 그렇다면 지니를 계속 지켜보는 수밖에.)
@goto y2_bs_end
# y2_warn_ginny
드레이코: 저기, 위즐리. 솥 안에 모르는 물건이 있으면 절대 쓰지 마. 특히 일기장.
지니(surprise): 응? …응.
@set warned_ginny
@goto y2_bs_end
# y2_nothing
드레이코(sad)*: (원작대로 흘러가게 두자. 섣불리 바꾸면 해리가 비밀의 방을 못 찾을지도 몰라.)

# y2_bs_end
@fade
@music quidditch
@bg pitch 13 5
: 2학년 가을. 루시우스는 슬리데린 팀 전원에게 최신형 님부스 2001을 선물했다.
@if seeker_scout -> y2_seek_skill
: 그리고 드레이코는 슬리데린의 새 수색꾼이 되었다. …솔직히 아버지 돈 덕분이다.
@goto y2_mud
# y2_seek_skill
: 그리고 드레이코는 슬리데린의 새 수색꾼이 되었다. 1학년 때 비행 실력을 눈여겨본 주장의 추천이었다.
: …물론 빗자루는 아버지 돈이지만.
# y2_mud
: 경기장 사용 시간을 두고 그리핀도르 팀과 실랑이가 벌어졌다.
론(angry): 슬리데린은 빗자루를 돈으로 샀잖아!
헤르미온느(angry): 적어도 그리핀도르 팀엔 돈으로 들어온 사람은 없어. 다들 실력으로 뽑혔다고!
: 슬리데린 팀원들이 일제히 드레이코를 쳐다본다. 원작에서 드레이코는 여기서— 그 끔찍한 말을 했다.
> 원작처럼 헤르미온느를 '잡종'이라고 모욕한다 {dark+3, hermione-3, harry-2, ron-2} -> y2_mud_bad
> "실력은 경기에서 증명하지. 그때 보자, 그레인저." {hermione+2, courage+1} -> y2_mud_proud
> "…빗자루는 돈으로 산 거 맞아. 하지만 수색꾼 자리는 아니야." {hermione+1, harry+1} -> y2_mud_honest
# y2_mud_bad
드레이코(angry): 누가 너한테 의견을 물어봤어, 이 더러운 잡종아.
: 순간 공기가 얼어붙었다. 헤르미온느의 얼굴이 하얗게 질린다.
론(angry): 너 이 자식—!
: 론의 부러진 지팡이가 역화해서, 론은 민달팽이를 토하기 시작했다. 아무도 웃지 않았다.
드레이코(sad)*: (…방금 내 입에서 나온 말 맞아? 이 몸이… 이 집안의 말투가 날 집어삼키고 있어.)
@set said_mudblood
@goto y2_match
# y2_mud_proud
헤르미온느(surprise): …좋아. 기대할게.
: 슬리데린 팀원들이 김빠진 얼굴을 한다. 주장 플린트가 투덜거렸다. "말포이, 요즘 왜 이렇게 순해졌냐?"
@goto y2_match
# y2_mud_honest
론(surprise): …어. 인정하네?
헤르미온느(smile): 정직한 슬리데린이라니, 희귀종이야.
드레이코(smirk): 희귀한 건 원래 비싼 법이지.

# y2_match
@fade
@bg pitch 13 5
: 슬리데린 대 그리핀도르. 드레이코의 첫 공식 경기.
: 그런데 블러저 하나가 이상할 정도로 해리만 쫓아다닌다.
드레이코*: (누가 마법을 건 블러저야. 해리 팔이 부러지는 그 경기!)
@mini flight snitch
@if last==win -> y2_match_win
: 해리가 블러저에 팔을 맞으면서도 스니치를 낚아챘다.
해리(smile): …잡았다…!
드레이코(surprise): 바보야! 팔 꺾였잖아!
: 그리고 록허트가 '치료'한다며 해리 팔의 뼈를 전부 사라지게 했다.
@goto y2_match_end
# y2_match_win
: 드레이코의 손에 골든 스니치가 퍼덕였다. 슬리데린 응원석이 폭발했다.
: 하지만 그 순간, 미친 블러저가 해리의 팔을 강타했다.
드레이코(surprise): 해리!
: 드레이코는 빗자루에서 뛰어내려 해리에게 달려갔다.
해리(smile): …축하해. 진짜 잘 날더라.
드레이코(cry): 그게 지금 중요해?!
@add harry 2
# y2_match_end
@if !dobby_ally -> y2_polyjuice
: 그날 밤, 드레이코는 의무실 창가에서 도비를 붙잡았다.
드레이코(angry): 도비. 그 블러저, 너지?
도비(cry): 도비는 해리 포터를 집에 보내려고…! 다치면 집에 갈 줄 알았습니다…!
드레이코(sad): …마음은 알아. 근데 그런 식으로 지키는 건 지키는 게 아니야.

# y2_polyjuice
@fade
@music slyth
: 겨울. "비밀의 방이 열렸다"는 붉은 글씨가 벽에 나타났고, 머글 태생 학생들이 차례로 돌처럼 굳어 갔다.
: 크리스마스 방학, 텅 빈 슬리데린 휴게실.
@explore slyth 9 8 up
@goal 크레이브와 고일이… 뭔가 이상하다
@npc crabbe 6 5 down -> y2_pj
@npc goyle 7 5 down -> y2_pj
@play
# y2_pj
: 크레이브는 안경을 쓰고 있었다. 고일은 연신 머리를 긁적이며 휴게실 비밀번호도 기억 못 하는 얼굴이다.
드레이코(smirk)*: (…폴리주스 마법약. 해리랑 론이구나. 안경 벗는 거 까먹었네, 해리.)
크레이브: 어, 그, 말포이. 비밀의 방 말인데… 누가 연 건지 알아?
> 모르는 척하며 결정적인 힌트를 흘린다 {harry+2, ron+1} -> y2_pj_hint
> "안경은 벗고 오지 그랬어, 포터?" 정체를 폭로한다 {harry+1, ron-1} -> y2_pj_reveal
> 원작처럼 위즐리 가족을 실컷 흉본다 {dark+1, ron-2} -> y2_pj_canon
# y2_pj_hint
드레이코: 아버지 말로는 50년 전에 방이 열렸을 때 머글 태생 여학생이 한 명 죽었대. 화장실에서.
드레이코: 그 화장실엔 지금 유령이 하나 산다지? 울보 머틀이었나.
드레이코(smirk): 아, 그리고 요즘 거미들이 줄지어 성 밖으로 도망치던데. 웃기지?
고일(surprise): …! 그, 그래. 웃기네. 우린 이만!
: 두 사람은 허둥지둥 뛰쳐나갔다. 뛰는 도중 고일의 머리카락이 빨갛게 변하기 시작했다.
드레이코(smile)*: (아슬아슬했네. 잘 해 봐, 둘 다.)
@set pj_hint
@goto y2_petrify
# y2_pj_reveal
드레이코(smirk): 안경은 벗고 오지 그랬어, 포터? 그리고 위즐리, 고일은 그렇게 얌전하게 안 앉아.
크레이브(surprise): ……!!
고일(surprise): 해리, 튀어!
드레이코: 기다려. 일러바칠 생각 없어. 대신 하나만 알려 줄게. 방을 연 건 슬리데린 학생이 아니야.
: 두 사람은 반쯤 녹아내리는 얼굴로 어색하게 고맙다고 하고는 달아났다.
@goto y2_petrify
# y2_pj_canon
드레이코(smirk): 위즐리 집안은 피의 배신자야. 그 아버지라는 사람은 머글 물건에 미쳐서…….
: 고일의 얼굴이 시뻘게졌다. 크레이브가 그의 팔을 붙잡는다.
드레이코*: (…원작대로 말하긴 했는데, 론 얼굴이 진짜 불쌍해.)

# y2_petrify
@fade
@music sad
: 그리고 봄. 헤르미온느가 석화된 채 발견되었다.
@explore hospital 9 7 up
@goal 의무실. 헤르미온느를 보러 가자
@npc hermione 6 3 down -> y2_hosp
@npc harry 8 4 left -> y2_hosp_h
@play
# y2_hosp_h
@if said_mudblood -> y2_hosp_h_bad
해리(sad): …드레이코. 와 줬구나.
@back
# y2_hosp_h_bad
해리(angry): 네가 여기 왜 왔어. 헤르미온느한테 그런 말을 해 놓고.
드레이코(sad): …사과하러 왔어. 듣지 못하더라도.
@back
# y2_hosp
: 굳어 버린 헤르미온느의 손에 구겨진 종이 한 장이 쥐어져 있다.
드레이코*: (원작대로야. 헤르미온느는 괴물의 정체를 알아냈어. 바실리스크.)
> 헤르미온느의 손을 잡고 말을 건다 {hermione+2} -> y2_hosp_talk
> 해리에게 종이를 가리켜 준다 {harry+1} -> y2_hosp_paper
# y2_hosp_talk
@if said_mudblood -> y2_hosp_sorry
드레이코(sad): …다 끝나면 같이 도서관 가자. 네가 좋아하는 그 두꺼운 책 얘기, 끝까지 들어 줄게.
@goto y2_hosp_paper
# y2_hosp_sorry
드레이코(cry): 그때 했던 말… 진심 아니었어. 미안해, 헤르미온느. 깨어나면 다시 말할게.
@set sorry_hermione
@add hermione 2
# y2_hosp_paper
: 드레이코는 헤르미온느 손안의 종이를 해리 쪽으로 슬쩍 밀었다.
해리(surprise): 이건…… 바실리스크? 파이프…! 그래서 벽 속에서 목소리가 들렸던 거야!

@fade
@music tension
@bg corridor 15 5
: 지니 위즐리가 비밀의 방으로 끌려갔다는 소식이 퍼졌다.
@if !warned_ginny -> y2_ch_go
: 사실 지니는 며칠 전 드레이코를 찾아왔었다. "네가 말한 일기장… 버렸는데 다시 돌아왔어." 그 말을 끝으로 지니는 사라졌다.
드레이코(cry)*: (경고만으론 부족했어. 그 일기장은 사람을 놓아주지 않아.)
# y2_ch_go
해리(angry): 론, 가자. 머틀의 화장실이야.
> "나도 갈래." 따라가겠다고 한다 {courage+1} -> y2_ch_follow
> "선생님들께 알릴게. 너희는 가!" {harry+1} -> y2_ch_teacher
# y2_ch_follow
해리(sad): 안 돼. 바실리스크 눈을 보면 죽어. 너까지 위험하게 할 순 없어.
드레이코(angry): 너는 되고 나는 안 된다는 거야?
해리(smile): …밖에서 나 기다려 줘. 꼭 돌아올게. 약속.
드레이코(blush): ……약속 어기면 하울러 보낼 거야.
@goto y2_ch_end
# y2_ch_teacher
드레이코: 맥고나걸 교수님께 알릴게. 너희는 가. 그리고 록허트는 믿지 마. 그 사람 사기꾼이야.
론(surprise): 그걸 어떻게 알았어?!
# y2_ch_end
@fade
@music title
: 그날 밤, 해리는 바실리스크를 쓰러뜨리고 일기장을 파괴했다. 지니는 무사했다.
: 다음 날, 교장실 앞 복도.
@bg corridor 15 5
루시우스(angry): 도비! 따라와라!
: 해리가 낡은 양말이 끼워진 일기장을 루시우스에게 건넨다. 루시우스가 무심코 양말을 내던졌고— 도비가 그것을 받았다.
도비(cry): 주인님이 도비에게 옷을 주셨습니다! 도비는… 자유입니다!
루시우스(angry): 네 이놈…!
: 루시우스가 지팡이를 해리에게 겨눈다.
> 아버지와 해리 사이에 끼어든다 {courage+2, harry+2} -> y2_dobby_free
> 아버지 뒤에 선다 {dark+1} -> y2_dobby_father
# y2_dobby_free
드레이코(angry): 아버지! 그만하세요. 여긴 교장실 앞이에요. 덤블도어가 보고 있어요.
루시우스(angry): ……드레이코.
: 루시우스는 이를 갈며 지팡이를 내렸다. 그리고 망토를 휘날리며 떠났다.
@if !dobby_kind -> y2_df_end
도비(cry): 아가씨! 아가씨는 약속을 지켜 주셨습니다! 해리 포터를 지켜 주셨습니다!
도비(smile): 도비는 이제 자유로운 요정입니다. 하지만 아가씨가 부르시면 언제든 달려가겠습니다!
@set dobby_friend
# y2_df_end
해리(smile): …고마워, 드레이코. 아버지한테 혼나지 않을까?
드레이코(smirk): 혼나겠지. 근데 바실리스크랑 싸운 너보다는 덜 무서워.
@goto y2_end
# y2_dobby_father
: 도비가 손가락을 튕기자 루시우스가 계단 아래로 날아갔다. 드레이코는 아버지를 부축해 자리를 떴다.
드레이코(sad)*: (원작대로야. 하지만… 도비의 눈을 제대로 볼 수가 없었어.)
# y2_end
드레이코*: (2학년, 끝. 일기장은 부서졌어. 그게 무엇인지 아는 사람은… 아직 나와 덤블도어뿐이겠지.)
@fade

== 3학년 | 아즈카반의 죄수 | 디멘터와 히포그리프
@music sad
@explore train 16 5 right
@tint rgba(10,20,50,0.5)
: 3학년 개학. 비가 쏟아지는 열차 안에서, 갑자기 모든 불이 꺼졌다.
: 창문에 성에가 끼고, 숨이 하얗게 얼어붙는다. 디멘터다.
@goal 해리가 있는 칸으로! (오른쪽 칸)
@npc lupin 21 2 down
@npc harry 22 2 down -> y3_tr_harry
@npc ron 23 2 down
@npc hermione 24 2 down
@play
# y3_tr_harry
: 해리가 창백한 얼굴로 쓰러져 있다. 루핀 교수가 막 디멘터를 쫓아낸 참이다.
루핀(smile): 슬리데린 학생이 여기까지 오다니. 친구인가?
드레이코: …네. 친구예요.
> 품에서 초콜릿을 꺼내 해리에게 건넨다 {harry+2} -> y3_choco
> 해리의 손을 꼭 잡아 준다 {harry+2, courage+1} -> y3_hand
# y3_choco
드레이코: 이거 먹어. 디멘터한테 당하면 초콜릿이 최고래.
루핀(smile): 내 대사를 뺏겼군. 아주 정확한 처방이란다.
해리(smile): …달다. 고마워.
@goto y3_tr_end
# y3_hand
: 해리의 손은 얼음장처럼 차가웠다. 드레이코가 두 손으로 감싸자, 해리가 천천히 눈을 떴다.
해리(blush): …드레이코? 너 손 따뜻하다.
드레이코(blush): 주, 죽은 줄 알았잖아, 바보야.
# y3_tr_end
@tint off
드레이코*: (해리는 디멘터에게 특히 약해. 부모님이 돌아가시던 순간을 다시 듣게 되니까.)
드레이코*: (그리고 이번 해에는… 벅빅. 그 히포그리프를 지켜야 해.)
@fade
@music school
@explore grounds 14 7 left
@goal 해그리드의 신비한 동물 돌보기 수업. 히포그리프에게 다가가 보자
@npc hagrid 11 6 down -> y3_hagrid
@npc buckbeak 13 9 left -> y3_buckbeak
@npc harry 15 9 up
@npc ron 16 9 up
@npc hermione 17 8 left
@npc crabbe 14 10 up
@play
# y3_hagrid
해그리드(smile): 히포그리프는 자존심이 아주 세단다. 먼저 정중하게 절을 하고, 녀석이 받아 줄 때까지 기다려야 해. 절대 모욕해선 안 된다!
드레이코*: (원작의 드레이코는 여기서 벅빅을 모욕하고 팔을 다쳤어. 그리고 벅빅은 사형 선고를 받았지.)
@back
# y3_buckbeak
: 은회색 깃털, 날카로운 주황색 눈. 벅빅이 드레이코를 가만히 바라본다.
> 눈을 피하지 않고 정중하게 고개 숙여 절한다 {courage+1} -> y3_bb_bow
> "너 같은 덩치 큰 닭은 하나도 안 무서워." 원작처럼 모욕한다 {dark+2} -> y3_bb_insult
# y3_bb_bow
: 드레이코가 천천히 허리를 숙였다. 긴 침묵. 그리고— 벅빅이 앞다리를 굽혀 절을 받았다.
해그리드(smile): 오오! 잘했다, 말포이! 슬리데린 10점… 아, 내가 점수를 줄 수 있었던가?
: 벅빅이 부리를 드레이코의 손바닥에 비빈다.
해리(smile): 너 벅빅한테 인기 많다.
드레이코(smile): 원래 귀족끼리는 통하는 법이야.
@set buckbeak_safe
@add harry 1
@goto y3_boggart
# y3_bb_insult
: 드레이코의 입에서 원작의 대사가 튀어나왔다. 다음 순간, 번뜩이는 발톱이 팔을 할퀴었다.
@shake
드레이코(cry): 아악…!
: 사건은 루시우스의 귀에 들어갔고, 벅빅에게는 사형 선고가 내려졌다.
헤르미온느(angry): 너 때문에 해그리드가 얼마나 울었는지 알아?!
@add hermione -2

# y3_boggart
@fade
@music slyth
@bg classroom 10 5
루핀: 보가트는 보는 사람이 가장 두려워하는 모습으로 변한단다. 주문은 리디큘러스. 웃음이야말로 보가트를 물리치는 무기지.
루핀: 다음, 미스 말포이.
: 옷장에서 튀어나온 보가트가 꿈틀거리더니— 커다란 거울로 변했다.
: 거울 속의 드레이코는 어른이 되어 있었다. 텅 빈 저택, 왼팔에 새겨진 어둠의 표식. 그리고 아무도 오지 않은 장례식.
드레이코(cry)*: (원작의 결말. 모든 걸 잃은 나.)
@mini duel boggart
@if last==win -> y3_bg_win
: 손이 떨려서 주문이 나오지 않는다. 루핀이 재빨리 앞을 막아섰다.
루핀(sad): …괜찮다. 오늘은 여기까지 하자.
@goto y3_bg_end
# y3_bg_win
드레이코(angry): 리디큘러스!
: 거울 속 어둠의 표식이 분홍색 리본 팔찌로 변했다. 어른 드레이코가 당황해서 리본을 풀려고 낑낑댄다.
: 교실이 웃음바다가 되었다.
@add courage 1
# y3_bg_end
@if harry<8 -> y3_hogs
: 수업이 끝나고, 해리가 복도에서 드레이코를 붙잡았다.
해리(sad): 아까 그 거울… 너 그런 게 무서운 거야?
드레이코(sad): …응. 혼자가 되는 거. 결국 아무것도 못 바꾸는 거.
해리: 넌 혼자 안 돼. 내가 있잖아. 론이랑 헤르미온느도.
드레이코(blush)*: (……얘는 이런 말을 아무렇지 않게 해.)
@add harry 2

# y3_hogs
@fade
@music school
@bg library 9 5
: 시리우스 블랙이 해리를 노린다는 소문으로 성 안이 뒤숭숭하다.
드레이코*: (진실은 반대지. 시리우스는 해리의 대부고, 진짜 배신자는 론의 쥐… 피터 페티그루야.)
드레이코*: (이걸 해리에게 어떻게 알리지? '원작 읽어서 알아'라고 할 순 없잖아.)
> 익명 쪽지로 "스캐버스는 애니마구스다"라고 알린다 {courage+1} -> y3_rat_note
> 해리에게 직접 "론의 쥐를 조심해"라고 말한다 {harry+1, ron-1} -> y3_rat_tell
> 아무 말도 하지 않는다 -> y3_rat_none
# y3_rat_note
: 다음 날, 론이 비명을 질렀다. 스캐버스가 쪽지 냄새를 맡자마자 사라졌다는 것이다.
드레이코(sad)*: (…도망치게 만들었네. 어쩌면 원작보다 나빠졌을지도.)
@goto y3_end
# y3_rat_tell
해리(surprise): 스캐버스를? 왜?
드레이코: 그냥… 열두 해나 사는 쥐가 이상하잖아. 발가락도 하나 없고.
해리: …생각해 볼게.
@goto y3_end
# y3_rat_none
드레이코*: (지금 바꾸면 해리가 시리우스를 만나지 못할지도 몰라. 일단은 지켜보자.)

# y3_end
@fade
@music romance
@bg grounds 10 6
@if buckbeak_safe -> y3_end_bb
: 학년 말. 해리와 헤르미온느는 시간을 되돌려, 사형 직전의 벅빅과 시리우스를 함께 구해 냈다고 한다.
@goto y3_end2
# y3_end_bb
: 학년 말. 해리는 시리우스를 구해 냈다. 사형 선고 따위 받은 적 없는 벅빅은, 해그리드의 '산책'을 핑계로 시리우스를 태우고 밤하늘로 날아갔다고 한다.
# y3_end2
@if harry>=12 -> y3_end_star
드레이코*: (3학년, 끝. 해리에게 가족이 생겼어. 비록 도망자지만.)
@goto y4_start
# y3_end_star
: 그날 밤, 천문탑 계단에서 해리를 만났다.
해리(smile): 나한테 대부가 있었어. 언젠가 같이 살 수 있을지도 몰라.
드레이코(smile): 잘됐다, 진짜로.
해리(blush): 그때 되면… 너도 놀러 와. 시리우스한테 소개해 주고 싶어.
드레이코(smirk): 말포이를 블랙 집안에? 시리우스는 우리 엄마 사촌이야. 아마 기절할걸.
해리(smile): 그럼 더 재밌겠다.
@cg y3_tower | draco:blush,harry:smile | 별이 쏟아지는 밤
드레이코(blush)*: (……이상하다. 원작에서 이런 장면은 없었는데, 왜 이렇게 익숙한 기분이지.)
@add harry 1
@cgoff
# y4_start
@fade

== 4학년 | 불의 잔 | 크리스마스 무도회
@music tension
@explore forest 12 6 down
@tint rgba(70,10,10,0.45)
: 퀴디치 월드컵 결승전이 끝난 밤. 캠핑장에 불길이 치솟았다.
: 가면을 쓴 무리가 머글 가족을 공중에 띄워 놓고 웃고 있다. 그중 한 명의 걸음걸이를, 드레이코는 알고 있었다.
드레이코(sad)*: (…아버지.)
@goal 숲에서 헤매는 해리 일행을 찾자 (왼쪽 아래)
@npc harry 6 11 up -> y4_wc
@npc ron 7 11 up -> y4_wc
@npc hermione 8 11 up -> y4_wc
@play
# y4_wc
헤르미온느(surprise): 드레이코?!
드레이코(angry): 조용히! 저 사람들이 노리는 건 머글이랑… 머글 태생이야. 헤르미온느, 넌 숨어야 해.
론(angry): 너희 아버지도 저기 있지? 그렇지?
드레이코(sad): …….
> "…응. 그러니까 내 말 들어. 이쪽 길로 가." {hermione+2, courage+1, ron+1} -> y4_wc_guide
> "대답 못 해. 그냥 빨리 가." {hermione+1} -> y4_wc_short
# y4_wc_guide
: 드레이코는 가면 쓴 자들이 순찰하지 않는 길을 알려 주었다. 해리가 뒤돌아본다.
해리(sad): 너는? 너도 같이 가.
드레이코(smile): 말포이는 저 사람들이 지켜 줘. 웃기지? …난 괜찮아.
@set wc_guide
@goto y4_wc_end
# y4_wc_short
: 세 사람은 드레이코가 가리킨 방향으로 달려갔다.
# y4_wc_end
@flash #3aff6a
: 하늘에 초록빛 해골이 떠올랐다. 어둠의 표식.
드레이코(sad)*: (시작됐어. 그 사람이 돌아오는 해야.)
@fade
@music school
@bg hall 11 7
: 트라이위저드 대회. 불의 잔은 네 번째 이름을 뱉어 냈다. 해리 포터.
: 슬리데린 아이들 사이에서 배지가 돌았다. 『세드릭 디고리를 응원하라 — 포터는 구려』
팬지(smirk): 드레이코, 너도 하나 달아. 네가 제일 먼저 만들 줄 알았는데.
> 원작처럼 배지를 달고 해리를 놀린다 {dark+1, harry-2} -> y4_badge_bad
> 배지에 마법을 걸어 『해리 포터 화이팅』으로 바꾼다 {harry+3, courage+1} -> y4_badge_good
> 배지는 거절하고 그냥 지나간다 {harry+1} -> y4_badge_none
# y4_badge_bad
: 드레이코가 배지를 번쩍이자 해리가 지친 얼굴로 고개를 돌렸다.
: 다음 순간, 무디 교수의 지팡이가 번뜩였다.
@flash
무디(angry): 등 뒤에서 얍삽하게 구는 놈은 질색이다!
: 하얀 족제비 한 마리가 복도 바닥을 통통 튀어 다녔다.
론(smile): 우와, 튀어 오르는 놀라운 족제비다!
드레이코(cry)*: (원작의 그 명장면을… 내가 당할 줄이야…!)
@goto y4_ball
# y4_badge_good
: 드레이코가 지팡이를 톡 치자 배지 글씨가 바뀌었다. 『해리 포터 화이팅 ♥』
: 하트는… 실수였다. 아마도.
팬지(surprise): 드레이코?!
해리(blush): ……어, 고, 고마워. 근데 하트는 뭐야?
드레이코(blush): 주문 실수야! 지우는 법을 몰라서 그래!
론(smirk): 지우는 법 내가 아는데. 알려 줄까?
드레이코(angry): 닥쳐, 위즐리.
@set badge_heart
@goto y4_ball
# y4_badge_none
: 드레이코는 배지를 팬지에게 돌려주었다. 해리가 그 모습을 멀리서 보고 있었다.

# y4_ball
@fade
@music romance
@bg corridor 15 5
: 크리스마스 무도회가 다가온다. 모두가 파트너를 구하느라 정신이 없다.
@if harry>=14 -> y4_ball_ask
: 해리는 파르바티와 가기로 했다는 소문이 들렸다.
@if courage>=6 -> y4_ball_brave
드레이코(sad)*: (…그래. 원작대로겠지.)
: 드레이코는 블레이즈와 '친구로서' 무도회에 가기로 했다.
@goto y4_ball_alone
# y4_ball_brave
드레이코*: (아니. 이번엔 가만히 있지 않을 거야.)
: 무도회 당일, 드레이코는 파르바티와 첫 곡을 마친 해리 앞에 섰다.
드레이코(blush): 포터. …한 곡만. 같이 춰 줄 수 있어?
해리(surprise): 어? 어… 응!
@goto y4_dance
# y4_ball_ask
: 그런데 어느 날 저녁, 해리가 복도에서 드레이코를 붙잡았다. 얼굴이 새빨갛다.
해리(blush): 드, 드레이코. 그… 무도회 말인데.
해리(blush): 파트너… 있어?
드레이코(surprise)*: (원작에선 다른 애한테 거절당하고 파르바티랑 갔는데… 지금 나한테?)
> "…없어. 기다리고 있었어." {harry+2} -> y4_ask_yes
> "슬리데린이랑 그리핀도르가? 다들 난리 날걸." 장난스럽게 승낙 {harry+1, courage+1} -> y4_ask_yes2
> "미안. 친구로 남고 싶어." -> y4_ask_no
# y4_ask_yes
해리(smile): 지, 진짜? 아, 다행이다. 열 번은 연습했는데.
드레이코(smile): 열 번이나? 누구 앞에서?
해리(blush): …론 앞에서. 론이 네 역할 했어.
드레이코(smile): 큭… 그건 좀 보고 싶었다.
@goto y4_dance
# y4_ask_yes2
드레이코(smirk): 좋아. 대신 발 밟으면 슬리데린 전체가 너한테 저주 걸 거야.
해리(smile): 연습할게!
@goto y4_dance
# y4_ask_no
해리(sad): …그렇구나. 알았어. 그래도 친구지?
드레이코(sad): 당연하지.
@set ball_friend
# y4_ball_alone
: 무도회 날. 드레이코는 연회장 구석에서 춤추는 사람들을 바라보았다.
: 헤르미온느가 크룸과 함께 계단을 내려오자 모두가 숨을 삼켰다.
@if hermione<8 -> y4_task3
헤르미온느(smile): 드레이코! 너 오늘 진짜 예쁘다.
드레이코(smirk): 너야말로. 론 표정 봐, 완전 넋이 나갔어.
헤르미온느(blush): 바, 바보 같은 소리!
@add hermione 1
@goto y4_task3
# y4_dance
@bg hall 11 7
@music ball
@cg y4_yule | draco:blush,harry:blush | 크리스마스 무도회
: 은빛 드레스를 입은 드레이코가 계단을 내려오자, 슬리데린 테이블과 그리핀도르 테이블이 동시에 조용해졌다.
해리(blush): ……와.
드레이코(blush): 뭐야, 그 반응은.
해리(blush): 아니, 그냥… 예뻐서.
@cgoff
@mini dance
@if last==win -> y4_dance_win
: 해리가 드레이코의 발을 세 번 밟았다. 둘 다 웃음을 참지 못했다.
해리(smile): 미안! 열 번 연습한 거 맞는데…!
드레이코(smile): 괜찮아. 생각보다 재밌어.
@add harry 1
@goto y4_dance_end
# y4_dance_win
: 마지막 음이 끝나고, 둘은 서로를 바라본 채 숨을 골랐다. 연회장 어딘가에서 박수가 터졌다.
해리(blush): 우리… 꽤 잘하지 않았어?
드레이코(blush): …응. 꽤.
@add harry 3
# y4_dance_end
@set yule_dance
@music romance
: 무도회가 끝난 뒤, 얼어붙은 장미 정원.
해리(blush): 드레이코. 오늘… 고마워. 나, 사실 대회 때문에 계속 무서웠거든.
드레이코(smile): 알아. 그러니까 세 번째 과제 때는 꼭 내 말 들어.
해리(surprise): 세 번째 과제?
드레이코(sad)*: (우승컵은 포트키야. 거기 손대는 순간 묘지로 가게 돼. 그리고 세드릭이…….)

# y4_task3
@fade
@music tension
@bg pitch 13 5
: 세 번째 과제의 날. 퀴디치 경기장은 거대한 미로가 되어 있었다.
드레이코*: (우승컵은 포트키야. 볼드모트에게로 데려가는. 그리고 세드릭 디고리는 거기서 죽어.)
드레이코*: (지금 말하지 않으면 영영 기회가 없어.)
> 해리와 세드릭에게 "우승컵에 절대 같이 손대지 마"라고 경고한다 {courage+2} -> y4_warn
> 덤블도어에게 무디가 수상하다고 말한다 {courage+1} -> y4_warn_dd
> 아무 말도 하지 않는다 -> y4_nowarn
# y4_warn
드레이코(angry): 해리, 세드릭. 내 말 잘 들어. 우승컵에 손대지 마. 특히 둘이 같이는 절대.
세드릭(surprise): 슬리데린이 경고를? …왜?
드레이코: 설명할 시간 없어. 그냥 믿어 줘.
@if harry>=16 || courage>=8 -> y4_warn_trust
해리(sad): …무슨 소린지 모르겠어. 하지만 기억할게.
@goto y4_maze
# y4_warn_trust
해리: …알았어. 네가 그렇게 말하는 데는 이유가 있겠지. 믿을게.
@set trusted
@goto y4_maze
# y4_warn_dd
덤블도어: 무디 교수가 수상하다고? …흥미로운 이야기로구나, 미스 말포이. 내가 지켜보마.
드레이코*: (지켜보는 걸로는 늦어요, 교수님…….)
@goto y4_maze
# y4_nowarn
드레이코(sad)*: (…말해도 믿어 주지 않을 거야. 원작은 바뀌지 않아.)
# y4_maze
@fade
@music dark
@bg black
: 미로 한가운데. 해리와 세드릭이 동시에 우승컵 앞에 섰다.
@if trusted -> y4_cedric_live
: 둘은 함께 컵을 잡았고— 사라졌다.
: 한참 뒤, 해리는 세드릭의 시신을 끌어안은 채 돌아왔다.
해리(cry): 그가 돌아왔어…! 볼드모트가 돌아왔어!
드레이코(cry)*: (……결국 막지 못했어.)
@goto y4_end
# y4_cedric_live
: 해리는 마지막 순간 손을 뗐다. 세드릭 혼자 우승컵에 닿았고, 혼자 사라졌다.
: 해리는 미로 밖으로 달려 나와 외쳤다. "포트키예요! 세드릭이 위험해요!"
: 덤블도어와 교수들이 곧장 추적했다. 세드릭은 피투성이로 쓰러진 채 발견되었지만— 살아 있었다.
세드릭(sad): 그 사람이… 돌아왔어요. 볼드모트가.
: 볼드모트의 부활은 막지 못했다. 하지만 세드릭 디고리는 살아남았다.
드레이코(cry)*: (……살았어. 살렸어. 처음으로 원작 속 죽음을 바꿨어.)
@set cedric_alive
@add courage 2
# y4_end
@if !cedric_alive -> y5_start
해리(cry): 드레이코…. 네가 말해 줬잖아. 아니었으면 나도, 세드릭도…….
: 해리가 드레이코를 꽉 끌어안았다. 떨림이 멈출 때까지, 오래.
@add harry 3
# y5_start
@fade

== 5학년 | 불사조 기사단 | 분홍색 독재와 은빛 수호령
@music slyth
@bg corridor 15 5
: 마법부는 볼드모트의 부활을 부정했다. 그리고 호그와트에는 분홍색 카디건의 악몽이 찾아왔다.
엄브리지(smile): 에헴, 에헴. 미스 말포이. 당신 같은 훌륭한 집안의 학생이 조사단에 들어와 준다면 정말 기쁠 거예요.
드레이코*: (원작에서 드레이코는 엄브리지의 조사단원이 되어 해리를 잡으러 다녔지.)
@if hermione>=8 -> y5_da_invite
> 조사단에 들어간다 {dark+1} -> y5_squad
> 거절한다 {courage+1} -> y5_refuse
# y5_da_invite
: 그날 밤, 헤르미온느가 몰래 쪽지를 건넸다. 『필요의 방. 목요일 8시. 해리가 가르쳐 줄 거야. — H』
> 조사단에 들어가는 척하며 DA에 몰래 합류한다 {courage+2, harry+1, hermione+1} -> y5_double
> DA에만 합류한다 {harry+2, hermione+1} -> y5_da
> 조사단에 들어간다 {dark+1} -> y5_squad
# y5_squad
: 드레이코는 은색 'I' 배지를 달았다. 해리의 눈빛이 차가워졌다.
@add harry -2
@goto y5_ministry
# y5_refuse
엄브리지(angry): …그래요? 아쉽네요. 정말, 정말 아쉬워요. 에헴.
드레이코(smirk)*: (저 웃음, 진짜 소름 끼쳐.)
@goto y5_ministry
# y5_double
: 낮에는 조사단의 은색 배지, 밤에는 DA의 금화. 드레이코는 이중첩자가 되었다.
드레이코(smirk)*: (조사단 순찰 경로는 다 내 손안에 있어. 해리, 오늘 8시 이후 7층 복도는 안전해.)
@set double_agent
# y5_da
@set da_member
@fade
@music romance
@explore ror 11 10 up
@goal 필요의 방. 해리에게 말을 걸자
@npc harry 10 6 down -> y5_patronus
@npc hermione 6 8 right -> y5_ror_her
@npc ron 15 7 left -> y5_ror_ron
@npc neville 9 4 down -> y5_ror_nev
@play
# y5_ror_her
헤르미온느(smile): 네가 와 줘서 정말 다행이야. 조사단 정보까지 있으니 훨씬 안전해졌어.
@back
# y5_ror_ron
@if ron_ror -> y5_ror_ron2
론(smirk): 솔직히 처음엔 스파이인 줄 알았어. …지금은 아니고.
@set ron_ror
@add ron 1
@back
# y5_ror_ron2
론: 패트로누스 연습해. 해리가 너 기다려.
@back
# y5_ror_nev
네빌(smile): 드레이코! 1학년 때 트레버 찾아 줬던 거 기억나? 나 이제 무장해제 마법 할 줄 알아!
@back
# y5_patronus
해리: 오늘은 패트로누스야. 가장 행복한 기억을 떠올려. 그 기억에 모든 걸 걸어.
드레이코(sad)*: (가장 행복한 기억…. 전생의 기억? 아니면 이 세계에서의…….)
> [if forest_stay] 금지된 숲에서 해리가 손을 잡아 주던 밤 {harry+2} -> y5_pat_forest
> [if yule_dance] 크리스마스 무도회에서 춤추던 순간 {harry+2} -> y5_pat_ball
> 처음으로 친구들과 웃었던 날 {hermione+1, ron+1} -> y5_pat_friends
# y5_pat_forest
: 차가운 숲, 떨리던 두 손, 조금씩 번지던 온기.
@goto y5_pat_cast
# y5_pat_ball
: 은빛 드레스, 발을 밟고 웃던 얼굴, "예뻐서"라던 목소리.
@goto y5_pat_cast
# y5_pat_friends
: 도서관 구석, 넷이서 몰래 나눠 먹던 개구리 초콜릿.
# y5_pat_cast
드레이코(angry): 익스펙토 페트로눔!
@mini duel dementor
@flash #e8f0ff
: 지팡이 끝에서 은빛 안개가 터져 나와— 날개를 활짝 편 흰 공작이 되었다.
해리(surprise): 와…. 공작이야.
드레이코(smirk): 말포이 저택 정원에 사는 애들이야. 우아하지?
해리(smile): 응. 너랑 닮았어.
드레이코(blush): ……그거 칭찬이야, 놀리는 거야?
해리(blush): 칭찬이야.
@cg y5_patronus | draco:blush,harry:smile | 은빛 공작
@add harry 1
@cgoff
@set patronus

# y5_ministry
@fade
@music tension
@bg ministry 11 5
: 6월. 해리는 시리우스가 고문당하는 환영을 보고 마법부로 향했다. 원작대로라면— 그건 함정이다.
@if da_member -> y5_min_da
: 드레이코는 그 소식을 다음 날 아침에야 들었다.
@goto y5_min_after
# y5_min_da
> 해리를 막는다 "그건 함정이야!" {courage+1} -> y5_min_stop
> 따라가서 함께 싸운다 {courage+2, harry+2} -> y5_min_fight
# y5_min_stop
해리(angry): 시리우스가 고문당하고 있다고! 함정이어도 가야 해!
드레이코(cry): 해리, 제발…!
: 해리는 결국 떠났다.
@goto y5_min_after
# y5_min_fight
: 신비부의 예언의 방. 수천 개의 유리구슬 사이로 가면 쓴 그림자들이 나타났다.
죽음을 먹는 자: 루시우스의 딸이로군. 이쪽으로 오너라. 아버님이 기다리신다.
드레이코(angry): 싫어요. 엑스펠리아르무스!
@mini duel deatheater
: 예언 구슬이 산산조각 나고, 불사조 기사단이 도착했다.
# y5_min_after
: 시리우스 블랙은 베일 너머로 사라졌다.
: 루시우스 말포이는 체포되어 아즈카반으로 보내졌다.
@fade
@bg manor 11 6
@music sad
나르시사(cry): 드레이코…. 아버지가… 아버지가…….
드레이코(cry): 엄마. 괜찮아요. 제가 있어요.
드레이코(sad)*: (원작대로 아버지는 감옥에 갔어. 그리고 이제… 그 사람이 나에게 임무를 줄 거야.)
@if harry<16 -> y6_start
: 그 여름, 해리에게서 짧은 편지가 왔다.
해리(sad): "시리우스가 죽었어. 너희 아버지가 거기 있었다는 것도 알아. 그래도 너를 미워할 수가 없어. 그게 더 화가 나. — H"
드레이코(cry)*: (……바보. 미워해도 되는데.)
@add harry 1
# y6_start
@fade

== 6학년 | 혼혈왕자 | 화장실의 눈물
@music dark
@bg manor 11 6
@tint rgba(10,0,20,0.55)
: 여름. 말포이 저택의 대응접실은 이제 그 사람의 것이었다.
볼드모트: 드레이코. 네 아버지는 실패했다. 아들이 아닌 딸이라도… 말포이의 피가 쓸모 있기를 바란다.
볼드모트: 알버스 덤블도어를 죽여라. 실패하면— 네 어머니가 대가를 치를 것이다.
나르시사(cry): 제발, 주인님, 아이는 아직…!
: 차가운 손가락이 드레이코의 왼팔을 붙잡았다. 살갗이 타들어 가는 고통. 해골과 뱀.
@shake
드레이코(cry)*: (……보가트가 보여 줬던 그 미래가, 지금 내 팔에 새겨지고 있어.)
@tint off
@fade
@music slyth
@bg corridor 15 5
: 호그와트. 드레이코는 매일 밤 필요의 방에서 사라지는 캐비닛을 고쳤다. 해리의 시선이 끈질기게 따라붙었다.
@explore bathroom 7 7 up
@goal 3층 화장실. 아무도 없는 곳에서……
@npc myrtle 3 2 down -> y6_myrtle
@obj 7 5 -> y6_sink
@obj 8 5 -> y6_sink
@play
# y6_myrtle
모우닝 머틀(sad): 또 왔구나. 울고 싶으면 울어. 여긴 아무도 안 와. …나 말고는.
@back
# y6_sink
: 세면대를 붙잡은 손이 떨린다. 거울 속 소녀의 눈이 빨갛다.
드레이코(cry): 못 해…. 난 사람을 못 죽여. 근데 안 하면 엄마가…….
@sfx door
: 문이 열렸다. 거울 속에, 해리가 서 있었다.
@npc harry 7 7 up
@face draco down
해리(surprise): …드레이코?
: 반사적으로 지팡이를 쥐었다. 원작에서는 여기서 둘이 서로에게 저주를 날렸고, 해리의 섹툼셈프라가 드레이코를 피투성이로 만들었다.
> 지팡이를 내리고 왼팔의 표식을 보여 준다 {harry+3, courage+2} -> y6_confide
> 지팡이를 겨눈다 (원작대로) {dark+2} -> y6_duel
# y6_confide
@if harry>=18 -> y6_confide_ok
: 드레이코가 소매를 걷어 올리자 해리의 얼굴이 굳었다.
해리(angry): 역시… 너도 그쪽이었구나.
드레이코(cry): 아니야, 해리, 들어 줘—
해리(sad): …듣고 싶지만, 지금은 못 믿겠어. 미안.
: 해리는 등을 돌려 나갔다. 섹툼셈프라는 없었지만, 그보다 아팠다.
@goto y6_tower
# y6_confide_ok
: 드레이코가 소매를 걷어 올렸다. 해골과 뱀. 해리가 숨을 들이켰다.
드레이코(cry): 그 사람이 덤블도어를 죽이래. 안 하면 엄마를 죽이겠대.
드레이코(cry): 난 못 해. 근데 도망칠 곳도 없어. 해리, 나 어떡해…?
: 해리는 한참을 말없이 서 있다가, 천천히 다가와 드레이코를 끌어안았다.
해리(sad): …같이 방법을 찾자. 덤블도어 교수님께 말하자. 네 어머니도 기사단이 지킬 수 있을 거야.
해리(sad): 넌 혼자가 아니야. 3학년 때 말했잖아.
@cg y6_bathroom | draco:cry,harry:sad | 화장실의 고백
드레이코(cry)*: (……기억하고 있었구나.)
@cgoff
@set confided
@goto y6_tower
# y6_duel
드레이코(angry): 오지 마!
@mini duel harry
@flash #ff2a2a
해리(surprise): 섹툼셈프라!
: 보이지 않는 칼날이 드레이코를 베었다. 바닥에 붉은 물이 번진다. 해리의 얼굴이 하얗게 질렸다.
해리(cry): 아냐, 아냐, 이럴 생각이 아니었어…!
: 스네이프가 뛰어 들어와 노래하듯 주문을 읊으며 상처를 꿰매기 시작했다.
@set sectum

# y6_tower
@fade
@music tension
@explore tower 8 7 up
@goal 천문탑 꼭대기. 덤블도어가 기다리고 있다
@npc dumbledore 7 3 down -> y6_dd
@play
# y6_dd
덤블도어: 좋은 저녁이구나, 드레이코.
@if confided -> y6_dd_known
덤블도어: 너는 살인자가 아니란다. 나는 처음부터 알고 있었지.
@goto y6_dd_choice
# y6_dd_known
덤블도어(smile): 해리에게 들었단다. 용기를 냈구나. 네 어머니는 이미 기사단이 몰래 지키고 있다.
드레이코(cry): 정말… 정말요?
덤블도어(smile): 다만 내 운명은 이미 정해져 있단다. 이 손을 보렴. 저주가 퍼진 지 오래야. 세베루스와 나는… 이미 약속을 했지.
드레이코(sad)*: (알아요. 스네이프 교수님이 당신을 죽이는 것도, 그게 당신의 계획이라는 것도.)
# y6_dd_choice
: 계단 아래에서 발소리가 올라온다. 죽음을 먹는 자들이다.
> 지팡이를 내린다 {courage+1} -> y6_lower
> 지팡이를 겨눈다 {dark+3} -> y6_aim
# y6_lower
드레이코(cry): …못 하겠어요.
덤블도어(smile): 알고 있다. 그것이 네가 너라는 증거란다.
@set lowered
@goto y6_snape
# y6_aim
: 드레이코의 지팡이 끝이 덤블도어의 심장을 향했다. 손은 떨리지 않았다.
덤블도어(sad): …드레이코. 너는 아직 선택할 수 있단다.
드레이코*: (……이게 내가 원하던 길이었나?)
# y6_snape
@npc snape 8 6 up
스네이프: …….
덤블도어(sad): 세베루스…… 부탁하네.
@flash #3aff6a
: 초록빛 섬광. 그리고 정적.
: 드레이코는 스네이프에게 끌려 성을 빠져나왔다. 등 뒤에서 해리의 외침이 들렸다.
@if dark>=10 -> y6_bad
@goto y7_start
# y6_bad
@fade
@music sad
: 그 후 드레이코는 더 이상 망설이지 않았다. 볼드모트는 그녀를 칭찬했고, 그녀는 웃었다.
@goto end_bad
# y7_start
@fade

== 7학년 | 죽음의 성물 | 은빛 운명
@music dark
@bg manor 11 6
@tint rgba(10,0,20,0.55)
: 1998년 봄. 말포이 저택 지하에 포로들이 끌려왔다. 얼굴이 퉁퉁 부어오른 소년 하나와, 빨간 머리, 그리고 곱슬머리 소녀.
벨라트릭스: 드레이코, 이리 와 보렴. 이게 해리 포터니? 똑바로 보고 말해.
: 부어오른 얼굴 너머로, 녹색 눈이 드레이코를 바라보았다.
드레이코*: (해리…!)
> "…모르겠어요. 잘 안 보여요." {harry+3, courage+2} -> y7_deny
> "네. 해리 포터예요." {dark+5} -> end_bad_manor
# y7_deny
벨라트릭스(angry): 모르겠다고? 학교에서 7년을 봤으면서?
드레이코(angry): 얼굴이 저렇게 부어 있는데 어떻게 알아요! 틀리면 이모가 책임질 거예요?
: 벨라트릭스가 이를 갈며 헤르미온느를 위층으로 끌고 갔다.
@if !dobby_friend -> y7_dobby2
: 펑. 지하실에 도비가 나타났다. 도비는 해리보다 먼저 드레이코를 향해 고개를 숙였다.
도비(smile): 아가씨가 부르셨습니다. 도비는 약속을 지킵니다!
드레이코(smile): 도비…! 모두를 데려가 줘. 그리고— 벨라 이모의 단검을 조심해. 꼭.
도비(surprise): 단검… 네! 도비는 명심하겠습니다!
@set dobby_alive
@goto y7_escape
# y7_dobby2
: 그때, 펑 소리와 함께 도비가 지하실에 나타났다.
# y7_escape
: 혼란 속에서 해리가 드레이코의 손에서 지팡이를 낚아채려 했다.
> 저항하지 않고 지팡이를 내어 준다 "가져가. 이기고 돌아와." {harry+2} -> y7_wand
> 지팡이를 빼앗긴다 -> y7_wand2
# y7_wand
해리(surprise): 드레이코, 너…!
드레이코(smile): 산사나무, 유니콘 털, 10인치. 꽤 말 잘 들어. 잘 부탁해.
해리: …반드시 돌려줄게. 직접.
@set gave_wand
@goto y7_battle
# y7_wand2
: 지팡이를 잃은 손이 허공을 붙잡았다. 도비와 함께 사라지는 해리의 뒷모습.

# y7_battle
@tint off
@fade
@music tension
@bg ror 11 6
: 호그와트 전투. 필요의 방. 해리는 레이번클로의 보관을 찾고 있었고— 크레이브가 악마의 화염을 풀어 버렸다.
: 거대한 불의 짐승들이 잡동사니 산을 집어삼킨다. 드레이코는 불길에 갇혀 탈출구를 잃었다.
@tint rgba(120,30,0,0.4)
드레이코(cry): 해리…!
해리(angry): 드레이코! 손 잡아!
@cg y7_fiendfyre | harry:angry,draco:cry | 불길 속으로 내민 손
: 빗자루를 탄 해리가 불길 속으로 뛰어들었다.
@cgoff
@mini flight fiendfyre
@if last==win -> y7_ff_win
: 불꽃이 빗자루 끝을 핥았지만, 론과 헤르미온느가 문 앞에서 둘을 끌어냈다.
@goto y7_ff_end
# y7_ff_win
: 불길의 틈을 꿰뚫고, 빗자루는 문밖으로 튀어나왔다. 두 사람은 복도 바닥을 데굴데굴 굴렀다.
@add harry 1
# y7_ff_end
@tint off
해리(angry): 바보야! 왜 여기 있었어!
드레이코(cry): 너, 너 도와주려고… 보관이 어디 있는지 알려 주려고…!
해리(sad): …살아 있으면 됐어.
: 해리가 드레이코를 한 번 꽉 안았다가, 다시 전장으로 달려갔다.
@fade
@music sad
@bg forest 16 6
: 그리고 해리는 금지된 숲으로 걸어 들어갔다. 혼자서.
: 이건 나중에 들은 이야기다. 볼드모트의 저주를 맞고 쓰러진 해리를, 나르시사가 살펴보았다고 한다.
나르시사(sad): (작게) 드레이코는 살아 있니? 성 안에 있니?
해리(sad): (작게) …살아 있어요. 그녀는… 저를 몇 번이나 구했어요.
나르시사: …죽었습니다.
@fade
@music tension
@bg hall 11 7
: 대연회장. 해리 포터는 살아 있었다. 그리고 그는 볼드모트 앞에 섰다.
@if gave_wand -> y7_final_wand
: 해리가 쥔 것은 말포이 저택에서 빼앗은 산사나무 지팡이. 딱총나무 지팡이의 충성은— 그 주인을 이긴 해리에게 넘어와 있었다.
@goto y7_final
# y7_final_wand
: 해리가 쥔 것은 드레이코가 직접 건네준 산사나무 지팡이.
: 빼앗지 않고 건네받은 지팡이였지만, 해리의 손안에서 그것은 따뜻하게 빛났다. 그녀의 마음까지 담겨 있는 것처럼.
# y7_final
볼드모트(angry): 아바다 케다브라!
해리(angry): 엑스펠리아르무스!
@flash #ffffff
: 붉은빛과 초록빛이 부딪쳤다. 그리고— 어둠의 왕은 쓰러졌다.
@shake
: 전쟁이 끝났다.
@music romance
@if dark>=8 -> end_normal
@if harry>=30 && dark<6 -> y7_confess
@if harry>=14 || hermione>=10 -> end_friend
@goto end_normal

# y7_confess
@fade
@explore tower 8 7 up
@goal 동이 트는 천문탑. 해리가 기다리고 있다
@npc harry 8 3 down -> y7_cf
@play
# y7_cf
해리(smile): 여기 있을 줄 알았어.
드레이코(smile): 예전에 여기서 가장 무서운 밤을 보냈거든. 오늘로 덮어쓰고 싶었어.
드레이코(smirk): 원작에선… 아, 아니다.
해리: 원작?
드레이코(smirk): 그런 게 있어. 언젠가 다 말해 줄게. 아주 긴 이야기야.
해리(blush): …그럼 오래 같이 있어야겠네. 다 들으려면.
@if gave_wand -> y7_cf_w
해리: 이거. 저택에서 억지로 빼앗았던 거. …미안해. 돌려줄게.
@goto y7_cf2
# y7_cf_w
해리(smile): 반드시 직접 돌려준다고 했잖아.
# y7_cf2
: 해리가 내민 산사나무 지팡이를 받아 들며, 드레이코는 숨을 골랐다.
드레이코(blush): ……바보.
> "해리. 나, 1학년 때부터 너 좋아했어." 고백한다 -> end_true
> "고마워. 앞으로도… 좋은 친구로 있어 줘." -> end_friend

# end_true
@cg end_true | draco:blush,harry:blush | 은빛 운명
해리(blush): …나는 2학년 때부터. 블러저 맞고 쓰러졌는데 네가 울면서 뛰어오던 거 보고.
드레이코(cry): 그게 언제 적 얘기야…!
해리(smile): 그러니까. 오래 기다렸어.
: 아침 햇살 속에서 해리가 드레이코의 손을 잡았다. 열한 살, 열차 안에서 처음 잡았던 그 손을.
@cgoff
@fade
@bg station 14 5
@music title
: — 몇 년 후. 킹스크로스역 9와 3/4 승강장.
: 새 학기를 맞은 아이들이 열차에 오른다. 플랫폼 한쪽에서, 은발의 여자와 검은 머리 남자가 나란히 서서 손을 흔들었다.
@if !cedric_alive -> end_true2
: 멀리서 퀴디치 국가대표 유니폼을 입은 세드릭 디고리가 인사를 보낸다.
# end_true2
@if !dobby_alive -> end_true3
: 그들의 발치에선 자유로운 집요정 도비가 양말 열두 켤레를 자랑하고 있었다.
# end_true3
드레이코(smile)*: (원작의 결말은 바뀌었어. 그리고 나는, 여기서 행복해.)
@ending true

# end_friend
@fade
@bg station 14 5
@music title
: — 몇 년 후. 킹스크로스역 9와 3/4 승강장.
: 해리와 지니, 론과 헤르미온느. 그리고 그 옆에 드레이코.
론(smirk): 말포이, 너 또 늦었어.
드레이코(smirk): 말포이는 늦는 게 아니라 등장하는 거야, 위즐리.
헤르미온느(smile): 둘 다 그만해. 애들 보고 있어.
해리(smile): …변함없네, 우리.
드레이코(smile)*: (사랑은 아니었을지도 몰라. 하지만 원작의 드레이코가 끝내 갖지 못했던 것— 친구들이 여기 있어.)
@ending friend

# end_normal
@fade
@bg station 14 5
@music sad
: — 몇 년 후. 킹스크로스역 9와 3/4 승강장.
: 승강장 건너편에서 해리 일행이 웃고 있다. 드레이코는 멀리서 고개만 살짝 숙여 인사했다.
: 해리도 고개를 끄덕였다. 그것이 전부였다.
드레이코(sad)*: (살아남았어. 가족도 지켰어. 하지만… 조금만 더 용기를 냈다면 어땠을까.)
@ending normal

# end_bad_manor
@music dark
드레이코(smirk): 네. 해리 포터예요.
벨라트릭스(smile): 착한 아이구나! 주인님을 불러야겠어!
: 해리의 녹색 눈이 천천히 감겼다. 마치 처음부터 알고 있었다는 듯이.
# end_bad
@fade
@bg black
@music sad
: 볼드모트는 승리했다. 말포이 가문은 다시 영광을 되찾았다.
: 그리고 드레이코의 왼팔에서 해골과 뱀은 영원히 지워지지 않았다.
드레이코(sad)*: (원작보다 나쁜 결말. 나는… 무엇을 바꾸고 싶었던 거지?)
@ending bad
`;

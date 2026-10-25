'use strict';
// 맵 문자 범례는 art.js 의 buildTiles() 참고. 행 길이가 달라도 'V'로 자동 채움.
const MAPS = {
  room: { name: '말포이 저택 - 드레이코의 방', rows: [
    'TTTTTTTTTTTTTT',
    'T#W##m###W###T',
    'T,,,,,,,,,,,,T',
    'T,bb,,,,,,,r,T',
    'T,dd,,____,,,T',
    'T,,,,,____,,,T',
    'T,,,,,____,,,T',
    'T,,,,,,,,,,a,T',
    'T,,,,,,,,,,,,T',
    'T######D#####T',
  ] },
  manor: { name: '말포이 저택 - 대응접실', rows: [
    'VTTTTTTTTTTTTTTTTTTTTTTV',
    'VT#W##S##W#kk#W##S##W#TV',
    'VT,,,,,,,,,,,,,,,,,,,,TV',
    'VT,,a,____________a,,,TV',
    'VT,,,,____________,,,,TV',
    'VT,P,,____________,,P,TV',
    'VT,,,,____________,,,,TV',
    'VT,,,,____________,,,,TV',
    'VT,P,,____________,,P,TV',
    'VT,,,,,,,,,,,,,,,,,,,,TV',
    'VT,,,,,,,,,,,,,,,,,,,,TV',
    'VT####F#####D#########TV',
  ] },
  alley: { name: '다이애건 앨리', rows: [
    'HHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',
    'HMHHHDHMHHHHHHHDHHMHHHHHHDHMHH',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CLCCCCCCCCCCCLCCCCCCCCCCCLCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'CLCCCCCCCCCCCLCCCCCCCCCCCLCCCC',
    'CCCCCCCCCCCCCCCCCCCCCCCCCCCCCC',
    'HHHHHHMHHHHHHHHHHHMHHHHHHHHHHH',
  ] },
  malkin: { name: '말킨 부인의 옷가게', rows: [
    'TTTTTTTTTTTTTTTT',
    'T#W##r#r#r##W##T',
    'T,,,,,,,,,,,,,,T',
    'T,r,,,,,,,,,,r,T',
    'T,,,,,,_,_,,,,,T',
    'T,r,,,,,,,,,,r,T',
    'T,,,,,KKKK,,,,,T',
    'T,,,,,,,,,,,,,,T',
    'T######D#######T',
  ] },
  bookshop: { name: '플러리시 앤 블롯츠', rows: [
    'TTTTTTTTTTTTTTTTTT',
    'TBBBBBW#BB#WBBBBBT',
    'T,,,,,,,,,,,,,,,,T',
    'T,BB,BB,,,,BB,BB,T',
    'T,,,,,,,,,,,,,,,,T',
    'T,BB,BB,KKKK,BB,,T',
    'T,,,,,,,,,,,,,,,,T',
    'T,,,,,,,,,,,,,,,,T',
    'T#######D########T',
  ] },
  train: { name: '호그와트 급행열차', rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'TxxxxTxxxxTxxxxTxxxxTxxxxTxxxxT',
    'TssssTssssTssssTssssTssssTssssT',
    'T,,,,T,,,,T,,,,T,,,,T,,,,T,,,,T',
    'T#,##T#,##T#,##T#,##T#,##T#,##T',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
    'T,,,,,,,,,,,,,,,,,,,,,,,,,,,,,T',
    'TxxxxxxxxxxxxxxxxxxxxxxxxxxxxxT',
  ] },
  hall: { name: '대연회장', rows: [
    'VTTTTTTTTTTTTTTTTTTTTTTV',
    'VT#WR#W#YW#kk#W#UW#SW#TV',
    'VT,,,,,,,,,,,,,,,,,,,,TV',
    'VT,,tttttttttttttttt,,TV',
    'VT,,,,,,,,,,,,,,,,,,,,TV',
    'VT,,t,,,t,,,,,,t,,,t,,TV',
    'VT,,t,,,t,,,,,,t,,,t,,TV',
    'VT,,t,,,t,,,,,,t,,,t,,TV',
    'VT,,t,,,t,,,,,,t,,,t,,TV',
    'VT,,t,,,t,,,,,,t,,,t,,TV',
    'VT,,t,,,t,,,,,,t,,,t,,TV',
    'VT,,t,,,t,,,,,,t,,,t,,TV',
    'VT,,,,,,,,,,,,,,,,,,,,TV',
    'VT,,,,,,,,,,,,,,,,,,,,TV',
    'VT##########DD########TV',
  ] },
  slyth: { name: '슬리데린 휴게실', tint: 'rgba(20,80,60,0.18)', rows: [
    'VTTTTTTTTTTTTTTTTTTV',
    'VT#W#S#W#FF#W#S#W#TV',
    'VT,,,,,,,,,,,,,,,,TV',
    'VT,a,,a,,____,,a,,TV',
    'VT,,,,,,,____,,,,,TV',
    'VT,,,,,,,____,,,,,TV',
    'VT,a,,,,,,,,,,,,a,TV',
    'VT,,,,,tt,,,,tt,,,TV',
    'VT,,,,,,,,,,,,,,,,TV',
    'VT#######D########TV',
  ] },
  corridor: { name: '호그와트 복도', rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
    'T#W#k#D#W#k#S#W#k#R#W#k#D#W#kT',
    'T............................T',
    'T.P......P......P......P.....T',
    'T............................T',
    'D============================D',
    'T............................T',
    'T.P......P......P......P.....T',
    'T............................T',
    'T#####D######?#####D#########T',
  ], hidden: { '13,9': 'D' } },
  classroom: { name: '지하 마법약 교실', tint: 'rgba(20,40,30,0.25)', rows: [
    'TTTTTTTTTTTTTTTTTTTT',
    'T#B#k#BBBB#k#B#W#B#T',
    'T,,,,,,,,,,,,,,,,,,T',
    'T,,,,,,,tttt,,,,,,,T',
    'T,,,,,,,,,,,,,,,,,,T',
    'T,v,,v,,v,,v,,v,,v,T',
    'T,,,,,,,,,,,,,,,,,,T',
    'T,v,,v,,v,,v,,v,,v,T',
    'T,,,,,,,,,,,,,,,,,,T',
    'T########D#########T',
  ] },
  library: { name: '도서관', floor: ',', rows: [
    'VTTTTTTTTTTTTTTTTTTV',
    'VTBBBBBW#k#WBBBBBBTV',
    'VT,,,,,,,,,,,,,,,,TV',
    'VTBBB,BBB,,BBB,BBBTV',
    'VT,,,,,,,,,,,,,,,,TV',
    'VT,tt,,tt,,tt,,tt,TV',
    'VT,,,,,,,,,,,,,,,,TV',
    'VTBBB,BBB,,BBB,BBBTV',
    'VT&,,,,,,,,,,,,,,,TV',
    'VT#######D########TV',
  ], chests: { '2,8': 'spell:revelio' } },
  grounds: { name: '호그와트 교정', floor: 'g', chests: { '32,5': 'card' }, rows: [
    'TTTTTTTTTTTTTTTTTTTTTTggggggggggwwww',
    '#W##k##W##D##W##k##W#Tggggggggggwwww',
    'ggggggggggpggggggggggggGgggggggwwwww',
    'ggGggggggggpggggggggggggggggggwwwwww',
    'ggggggggggggpppppppppppppgggggwwwwww',
    'gggfggggggggpgggggggggggpgggggzz$www',
    'ggfffgggggggpggggggGggggpggggggwwwww',
    'gfffffgghhhgpgggggggggggpgggggggwwww',
    'gfffffgghDhppgggggggggggpggggggggwww',
    'ffffffggggggpggggggggggggpggggggggww',
    'ffffffgggggGpggggggggggggpgggggggggg',
    'fffffffgggggpgggggggggggggpggggggggg',
    'ffffffffpppppgggggggggggggpggggggggg',
    'fffffffpggggggggggggggggggpggggggggg',
    'ffffffpfggggggggggggggggggpggggggggg',
    'ffffffffffffffffffffffffffffffffffff',
  ] },
  forest: { name: '금지된 숲', tint: 'rgba(5,10,40,0.45)', rows: [
    'ffffffffffffffffffffffff',
    'ffffffggffffffffgggfffff',
    'fffffgggggfffffgggggffff',
    'ffffggpggggfffgggGgggfff',
    'fffgggpggggggggggggggfff',
    'fffggppppgggggggggpgggff',
    'ffgggggGppppppppppgggfff',
    'ffgggggggggggggggpgggfff',
    'fffggGgggggggggggpggffff',
    'ffffggggggggfgggpgggffff',
    'fffffgggggffffggpggfffff',
    'ffffffpgggfffffgpgffffff',
    'fffffppffffffffgpgffffff',
    'ffffffpfffffffffpfffffff',
  ] },
  bathroom: { name: '3층 여자 화장실', rows: [
    'TTTTTTTTTTTTTTTT',
    'T#Z#Z#Z#Z#W#W##T',
    'TiiiiiiiiiiiiiiT',
    'TiiiiiiiiiiiiiiT',
    'TiiiiiOOOOiiiiiT',
    'TiiiiiiiiiiiiiiT',
    'TiiiiiiiiiiiiiiT',
    'TiiiiiiiiiiiiiiT',
    'T######D#######T',
  ] },
  tower: { name: '천문탑 꼭대기', tint: 'rgba(10,20,70,0.35)', rows: [
    'nnnnnnnnnnnnnnnn',
    'nQQQQQQQQQQQQQQn',
    'nQ............Qn',
    'nQ............Qn',
    'nQ............Qn',
    'nQ............Qn',
    'nQ............Qn',
    'nQ............Qn',
    'nQQQQQQ..QQQQQQn',
    'nnnnnnnTDTnnnnnn',
  ] },
  ror: { name: '필요의 방', tint: 'rgba(40,20,10,0.2)', rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTT',
    'T#J#J##J#k##J#J##J#k#J#T',
    'T......J.......J.......T',
    'T.JJ.....JJJ......JJ...T',
    'T.J...........c....J...T',
    'T......JJ........J.....T',
    'T..J.......JJ.......J..T',
    'T.JJJ..J.........JJ....T',
    'T........J...J.........T',
    'T...JJ..........JJJ....T',
    'T......................T',
    'T##########D###########T',
  ] },
  pitch: { name: '퀴디치 경기장', rows: [
    'gggggggggggggggggggggggggggg',
    'gjjjjjjjjjjjjjjjjjjjjjjjjjjg',
    'gggggggggggggggggggggggggggg',
    'gggGggggggggggggggggggggGggg',
    'ggggggggggggpggggggggggggggg',
    'gggggggggggppppgggggggggggggg',
    'ggggggggggggpggggggggggggggg',
    'gggGggggggggggggggggggggGggg',
    'gggggggggggggggggggggggggggg',
    'gjjjjjjjjjjjjjjjjjjjjjjjjjjg',
    'gggggggggggggggggggggggggggg',
  ] },
  station: { name: '킹스크로스역 9와 3/4 승강장', rows: [
    'eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    'eeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
    'uuPuuuuuuuuPuuuuuuuuuPuuuuuuuu',
    'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
    'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
    'uuPuuuuuuuuPuuuuuuuuuPuuuuuuuu',
    'uuuuuuuuuuuuuuuuuuuuuuuuuuuuuu',
    'HHHHHHHHHHHHHMHHHHHHHHHHHHHHHH',
  ] },
  ministry: { name: '마법부 신비부', tint: 'rgba(10,10,40,0.35)', rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTT',
    'T#k#####k#####k#####k##T',
    'T......................T',
    'T.BB.BB.BB.BB.BB.BB.BB.T',
    'T......................T',
    'T.BB.BB.BB.BB.BB.BB.BB.T',
    'T......................T',
    'T.BB.BB.BB.BB.BB.BB.BB.T',
    'T......................T',
    'T##########D###########T',
  ] },
  gryff: { name: '그리핀도르 휴게실', floor: ',', chests: { '16,5': 'card' }, rows: [
    'VTTTTTTTTTTTTTTTTTTV',
    'VT#W#R#W#FF#W#R#W#TV',
    'VT,,,,,,,,,,,,,,,,TV',
    'VT,a,,a,,====,,a,,TV',
    'VT,,,,,,,====,,,,,TV',
    'VT,,,,,,,====,,,$,TV',
    'VT,a,,,,,,,,,,,,a,TV',
    'VT,,,,,tt,,,,tt,,,TV',
    'VT,,,,,,,,,,,,,,,,TV',
    'VT#######D########TV',
  ] },
  secret: { name: '비밀의 방 (복도 아래)', dark: true, chests: { '2,3': 'card', '11,3': 'spell:accio', '2,6': 'heal' }, items: [{ x: 10, y: 6, item: 'card' }], rows: [
    'TTTTTTTTTTTTTT',
    'T#k####B###k#T',
    'T............T',
    'T.$........&.T',
    'T............T',
    'T....q.q.....T',
    'T.$.o.....o..T',
    'T............T',
    'T######D#####T',
  ] },
  trapdoor: { name: '지하 함정 (마법사의 돌)', dark: true, chests: { '2,12': 'heal', '21,1': 'card' },
    puzzle: { set: [[21, 1, '$']], msg: '네 개의 화로가 타오르자, 벽 한쪽이 스르르 열렸다!' }, hidden: {}, rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTT',
    'T;;;;;;;;;;#.........?.T',
    'T;;......;;#...........T',
    'T;........;#...!...!...T',
    'T;.........X...........T',
    'T;;......;;#...!...!...T',
    'T;;;;;;;;;;#...........T',
    'T#####;#################',
    'T.....;.....#..........T',
    'T...........#..........T',
    'T..o........#....E.....T',
    'T...........#..........T',
    'T.$.........#..........T',
    'T...........#..........T',
    'T...........X..........T',
    'TTTTTTTTTTTTTTTTTTTTTTTT',
  ] },
  chamber: { name: '비밀의 방으로 가는 하수관', dark: true, tint: 'rgba(20,40,20,0.25)', rows: [
    'TTTTTTTTTTTTTTTTTTTTTTTTTT',
    'T#####k#######k#######k##T',
    'T....q.......o.....w.....T',
    'T....q.......o.....w.....T',
    'T....q.......o.....w.....T',
    'T###################.....T',
    'VVVVVVVVVVVVVVVVVVVT.....T',
    'VVVVVVVVVVVVVVVVVVVT..P..T',
    'VVVVVVVVVVVVVVVVVVVT.....T',
    'VVVVVVVVVVVVVVVVVVVT##S##T',
  ] },
  maze: { name: '트라이위저드 미로', floor: 'g', tint: 'rgba(10,20,40,0.35)', dark: true, rows: [
    'fffffffffffffffffffffffff',
    'fgggggqgggggggggggggggggf',
    'fgffffffffff^ffffffffffgf',
    'fgfgggggggggggggggqgggfgf',
    'fgfgfffffffffffffffffgfgf',
    'fgfgfgggggggggggggggfgfgf',
    'fgfgfgfffffffffffffgfgfgf',
    'fgfgfgfgggggggggggfgfgfgf',
    'fgfgfgqgggggggggggfgfgfgf',
    'fgfgfgfgggggggggggfgfgfgf',
    'fgfgfgfffffffffffffgfgfgf',
    'fgfgfgggggggggggggggfgfgf',
    'fgfgffffffff%ffffffffgfgf',
    'fgfgggggggggggggggggggfgf',
    'fgfffffffffffffffffffffgf',
    'fgggggggggggggggggggggggf',
    'ffffffffffffgffffffffffff',
  ] },
  hospital: { name: '의무실', rows: [
    'VTTTTTTTTTTTTTTTTTTV',
    'VT#W###W###W###W##TV',
    'VT................TV',
    'VT.b..b..b..b..b..TV',
    'VT................TV',
    'VT................TV',
    'VT.b..b..b..b..b..TV',
    'VT................TV',
    'VT#######D########TV',
  ] },
};
// 정규화
for (const [id, m] of Object.entries(MAPS)) {
  m.id = id;
  m.w = Math.max(...m.rows.map(r => r.length));
  m.rows = m.rows.map(r => r.padEnd(m.w, 'V'));
  m.base = m.rows.slice();
  m.h = m.rows.length;
  m.canvas = null;
}
function tileAt(m, x, y) { if (x < 0 || y < 0 || x >= m.w || y >= m.h) return 'V'; return m.rows[y][x]; }
function isSolid(m, x, y) { return SOLID.has(tileAt(m, x, y)); }
const FLOORS = new Set('.,_=igGpCuj'.split(''));
const WALLFACE = new Set('#WkSRYUFmBEcHM'.split(''));
function mapCanvas(m) {
  if (m.canvas) return m.canvas;
  const c = mk(m.w * TS, m.h * TS), g = c.getContext('2d');
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
    const ch = m.rows[y][x], t = TILES[ch] || TILES['V'];
    const X = x * TS, Y = y * TS;
    // 나무·가구 아래에는 바닥을 먼저 깐다
    if (ch === 'f') g.drawImage(TILES['g'], X, Y);
    g.drawImage(t, X, Y);
    // 칸마다 다른 잔무늬
    const r = seeded(x * 7919 + y * 104729 + ch.charCodeAt(0) * 13);
    if (ch === '.' || ch === 'C' || ch === 'u') {
      if (r() < 0.35) { const cx = X + 2 + (r() * 11 | 0), cy = Y + 2 + (r() * 11 | 0); R(cx, cy, 3, 1, 'rgba(0,0,0,.18)'); R(cx + 2, cy + 1, 2, 1, 'rgba(0,0,0,.18)'); }
      if (r() < 0.25) R(X + (r() * 14 | 0), Y + (r() * 14 | 0), 2, 2, 'rgba(255,255,255,.07)');
      if (r() < 0.1) R(X + (r() * 12 | 0), Y + (r() * 12 | 0), 3, 2, 'rgba(70,110,60,.25)');
    } else if (ch === 'g' || ch === 'G') {
      for (let i = 0; i < 3; i++) { if (r() < 0.6) { const gx = X + (r() * 13 | 0), gy = Y + 3 + (r() * 11 | 0); R(gx, gy, 1, 2, '#5aa04a'); R(gx + 2, gy, 1, 2, '#5aa04a'); R(gx + 1, gy + 1, 1, 2, '#2e5e2a'); } }
      if (r() < 0.06) { const fx = X + (r() * 12 | 0), fy = Y + (r() * 12 | 0); R(fx, fy, 2, 2, ['#f2e86a', '#f8f8f8', '#e88ab0', '#9ab8ff'][r() * 4 | 0]); }
      g.fillStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,255,200'},${(r() * 0.06).toFixed(3)})`; g.fillRect(X, Y, TS, TS);
    } else if (ch === ',') {
      if (r() < 0.3) { const kx = X + (r() * 12 | 0), ky = Y + 1 + (r() * 3 | 0) * 4; R(kx, ky, 2, 1, '#4e321c'); }
      g.fillStyle = `rgba(0,0,0,${(r() * 0.08).toFixed(3)})`; g.fillRect(X, Y, TS, TS);
    } else if (ch === 'f') {
      g.fillStyle = `rgba(0,${r() < 0.5 ? 0 : 30},0,${(0.05 + r() * 0.12).toFixed(3)})`; g.fillRect(X, Y, TS, TS);
      R(X + 4 + (r() * 6 | 0), Y + 3 + (r() * 4 | 0), 2, 1, 'rgba(160,220,140,.35)');
    }
    // 벽 아랫단 / 윗단
    if (WALLFACE.has(ch)) {
      if (!isSolid(m, x, y + 1)) { R(X, Y + 14, TS, 2, 'rgba(0,0,0,.35)'); R(X, Y + 13, TS, 1, 'rgba(255,255,255,.06)'); }
      if (tileAt(m, x, y - 1) === 'T') R(X, Y, TS, 1, 'rgba(255,255,255,.12)');
    }
    if (ch === 'T' && !isSolid(m, x, y + 1)) R(X, Y + 14, TS, 2, '#15151b');
  }
  // 그림자 (벽·가구 아래 바닥)
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
    if (isSolid(m, x, y)) continue;
    const X = x * TS, Y = y * TS;
    if (isSolid(m, x, y - 1)) { for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(0,0,0,${0.32 - i * 0.05})`; g.fillRect(X, Y + i, TS, 1); } }
    if (isSolid(m, x - 1, y)) { g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(X, Y, 2, TS); }
    if (isSolid(m, x + 1, y)) { g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(X + TS - 2, Y, 2, TS); }
  }
  m.lights = [];
  for (let y = 0; y < m.h; y++) for (let x = 0; x < m.w; x++) {
    const ch = m.rows[y][x];
    if (ch === 'k' || ch === 'F' || ch === 'L') m.lights.push({ x: x * TS + 8, y: y * TS + (ch === 'F' ? 12 : 5), r: ch === 'F' ? 56 : 40, ph: x * 1.7 + y });
    if (ch === 'v') m.lights.push({ x: x * TS + 8, y: y * TS + 6, r: 22, ph: x + y, col: '90,230,120' });
  }
  return (m.canvas = c);
}

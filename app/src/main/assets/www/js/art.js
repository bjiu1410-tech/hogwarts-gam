'use strict';
// ===== 캐릭터 정의 =====
const GRY = '#b3322f', SLY = '#2f8a4e', HUF = '#d9a62e', RAV = '#2f5fa8';
const CHARS = {
  draco:     { name: '드레이코', hair: '#f1ecd2', hair2: '#cfc6a2', eye: '#8494ab', skin: '#f8e3d3', trim: SLY, style: 'long', female: true, voice: 1.25 },
  harry:     { name: '해리', hair: '#1f1a1d', hair2: '#3a2e33', eye: '#3f9b4a', skin: '#f1d4bb', trim: GRY, style: 'messy', glasses: true, scar: true, voice: 0.9 },
  ron:       { name: '론', hair: '#d8642b', hair2: '#a8461a', eye: '#4f7bb5', skin: '#f6dccb', trim: GRY, style: 'short', freckles: true, voice: 0.85 },
  hermione:  { name: '헤르미온느', hair: '#7a4a2a', hair2: '#5a331b', eye: '#6b4428', skin: '#f2d5bf', trim: GRY, style: 'bushy', female: true, voice: 1.15 },
  neville:   { name: '네빌', hair: '#6a4a32', hair2: '#4a3220', eye: '#6a5a3a', skin: '#f3d7c3', trim: GRY, style: 'short', voice: 0.9 },
  ginny:     { name: '지니', hair: '#d8562b', hair2: '#a8401a', eye: '#6b4428', skin: '#f6dccb', trim: GRY, style: 'long', female: true, freckles: true, voice: 1.2 },
  lucius:    { name: '루시우스', hair: '#ece6cc', hair2: '#c8bf9e', eye: '#7c8899', skin: '#f2dccc', robe: '#14151a', trim: '#4a4f5a', style: 'longm', voice: 0.7 },
  narcissa:  { name: '나르시사', hair: '#f3e8c0', hair2: '#2b2522', eye: '#6f8ab0', skin: '#f6e2d4', robe: '#1a1c24', trim: '#3c4560', style: 'updo', female: true, voice: 1.05 },
  snape:     { name: '스네이프', hair: '#141416', hair2: '#26262a', eye: '#1a1a1a', skin: '#e8d9c6', robe: '#0f0f13', trim: '#26262c', style: 'greasy', voice: 0.65 },
  dumbledore:{ name: '덤블도어', hair: '#e9e9ef', hair2: '#c8c8d2', eye: '#5b8fd6', skin: '#f0d8c6', robe: '#5b3c8f', trim: '#d8b44a', style: 'beard', hat: '#5b3c8f', halfmoon: true, voice: 0.75 },
  mcgonagall:{ name: '맥고나걸', hair: '#2c2a2a', hair2: '#555', eye: '#4a6a4a', skin: '#efd6c4', robe: '#1f4a34', trim: '#1f4a34', style: 'bun', hat: '#1b2a22', female: true, voice: 1.0 },
  hagrid:    { name: '해그리드', hair: '#3a2a1c', hair2: '#24180e', eye: '#1a1a1a', skin: '#e9c9ad', robe: '#5a4030', trim: '#3c2a1e', style: 'hagrid', voice: 0.6 },
  crabbe:    { name: '크레이브', hair: '#3b3026', hair2: '#2a2018', eye: '#333', skin: '#efd1bb', trim: SLY, style: 'short', voice: 0.7 },
  goyle:     { name: '고일', hair: '#1c1c1c', hair2: '#333', eye: '#333', skin: '#e6c7ae', trim: SLY, style: 'short', voice: 0.7 },
  pansy:     { name: '팬지', hair: '#151313', hair2: '#2c2626', eye: '#444', skin: '#f5dccc', trim: SLY, style: 'bob', female: true, voice: 1.2 },
  blaise:    { name: '블레이즈', hair: '#161210', hair2: '#2a2220', eye: '#3a2a1a', skin: '#8d5a3b', trim: SLY, style: 'short', voice: 0.85 },
  dobby:     { name: '도비', skin: '#cfcba8', eye: '#3fa34a', style: 'elf', robe: '#d8d0bc', trim: '#b8af98', voice: 1.5 },
  cedric:    { name: '세드릭', hair: '#5a3a22', hair2: '#3e2814', eye: '#5a6a7a', skin: '#f1d4bb', trim: HUF, style: 'short', voice: 0.9 },
  lupin:     { name: '루핀', hair: '#8a7258', hair2: '#6a5640', eye: '#7a6a4a', skin: '#ecd3c0', robe: '#4a4038', trim: '#6a5a48', style: 'short', scars: true, voice: 0.8 },
  moody:     { name: '무디', hair: '#7a6e64', hair2: '#5a5048', eye: '#3a3a3a', skin: '#d9b9a0', robe: '#3a3028', trim: '#2a2018', style: 'greasy', magicEye: true, voice: 0.6 },
  umbridge:  { name: '엄브리지', hair: '#8a6a4a', hair2: '#6a4a2a', eye: '#4a3a2a', skin: '#f5d6c6', robe: '#e889b0', trim: '#f4b8d0', style: 'bob', female: true, bow: true, voice: 1.3 },
  voldemort: { name: '볼드모트', skin: '#e3e8e2', eye: '#d02020', robe: '#101012', trim: '#1c1c20', style: 'bald', snake: true, voice: 0.55 },
  bellatrix: { name: '벨라트릭스', hair: '#121012', hair2: '#2a2228', eye: '#2a1a1a', skin: '#efdcd4', robe: '#141016', trim: '#2a2030', style: 'curly', female: true, voice: 1.1 },
  myrtle:    { name: '모우닝 머틀', hair: '#b8c8d8', hair2: '#98a8bc', eye: '#7a8aa0', skin: '#d8e4ee', trim: RAV, style: 'pigtail', female: true, glasses: true, ghost: true, voice: 1.4 },
  hat:       { name: '분류 모자', special: 'hat', voice: 0.7 },
  firenze:   { name: '피렌체', hair: '#e8d8a0', hair2: '#c8b880', eye: '#3a6ab0', skin: '#f0d0b0', robe: '#c8a878', trim: '#a88858', style: 'longm', voice: 0.8 },
  quirrell:  { name: '퀴렐', skin: '#ecd6c4', eye: '#4a4a6a', robe: '#4a2a5a', trim: '#6a3a7a', style: 'turban', voice: 0.95 },
  lockhart:  { name: '록허트', hair: '#e8c060', hair2: '#c89c38', eye: '#3a7ac8', skin: '#f5dcc8', robe: '#7aa0e0', trim: '#b8d0f8', style: 'short', voice: 1.0 },
  krum:      { name: '크룸', hair: '#1a1a1a', hair2: '#333', eye: '#2a2a2a', skin: '#e8cbb4', robe: '#7a1a1a', trim: '#4a0e0e', style: 'short', voice: 0.7 },
  student:   { name: '학생', hair: '#5a4030', hair2: '#3a2a20', eye: '#4a4a4a', skin: '#f0d4c0', trim: '#888', style: 'short', voice: 1.0 },
  student2:  { name: '학생', hair: '#c89a5a', hair2: '#a07a40', eye: '#4a4a4a', skin: '#f3dccc', trim: RAV, style: 'long', female: true, voice: 1.15 },
  student3:  { name: '학생', hair: '#2a2020', hair2: '#1a1414', eye: '#4a4a4a', skin: '#c99b78', trim: HUF, style: 'short', voice: 0.95 },
  hooded:    { name: '???', skin: '#dcdcdc', eye: '#d02020', robe: '#0c0c10', trim: '#0c0c10', style: 'hood', voice: 0.5 },
  deatheater:{ name: '죽음을 먹는 자', skin: '#bfc4c8', eye: '#111', robe: '#0c0c10', trim: '#0c0c10', style: 'mask', voice: 0.6 },
  troll:     { name: '트롤', special: 'troll', skin: '#8a9a7a', voice: 0.4 },
  buckbeak:  { name: '벅빅', special: 'hippogriff', voice: 0.5 },
  owl:       { name: '부엉이', special: 'owl', voice: 1.6 },
};
// 이름(한글) → id
const NAME2ID = {};
for (const [id, c] of Object.entries(CHARS)) if (!NAME2ID[c.name]) NAME2ID[c.name] = id;
Object.assign(NAME2ID, { '머틀': 'myrtle', '모자': 'hat', '분류모자': 'hat', '미스터 말포이': 'lucius', '말포이 부인': 'narcissa', '어둠의 왕': 'voldemort', '두건 쓴 자': 'hooded', '매드아이 무디': 'moody', '죽먹자': 'deatheater' });

function shade(hex, f) {
  const n = parseInt(norm(hex).slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = clamp(Math.round(r * f), 0, 255); g = clamp(Math.round(g * f), 0, 255); b = clamp(Math.round(b * f), 0, 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// ===== 타일 =====
const SOLID = new Set('VT#WkSRYUBtFbdPfwHKrLsxZOnQJehmavMjEcoX%q;^z!*?$0&'.split(''));
const TILES = {};
function buildTiles() {
  const defs = {
    'V': g => { R(g, 0, 0, 16, 16, '#000'); },
    'T': g => { R(g, 0, 0, 16, 16, '#23232c'); R(g, 0, 14, 16, 2, '#191920'); noise(g, '#2c2c36', 6); },
    '#': g => stoneWall(g),
    'W': g => { stoneWall(g); R(g, 3, 2, 10, 12, '#4a4a58'); R(g, 4, 3, 8, 11, '#1c2c52'); R(g, 4, 3, 8, 3, '#2c4a7a'); R(g, 7, 3, 2, 11, '#4a4a58'); R(g, 4, 8, 8, 1, '#4a4a58'); R(g, 5, 4, 1, 1, '#dfe8ff'); },
    'k': g => { stoneWall(g); R(g, 7, 7, 2, 6, '#5a3a1e'); R(g, 6, 6, 4, 1, '#3a2a1a'); R(g, 6, 3, 4, 3, '#ffb23c'); R(g, 7, 2, 2, 2, '#ffe28a'); },
    'S': g => banner(g, SLY, '#c9d1e0'), 'R': g => banner(g, GRY, '#e8c450'),
    'Y': g => banner(g, HUF, '#222'), 'U': g => banner(g, RAV, '#b8925a'),
    '.': g => { R(g, 0, 0, 16, 16, '#5d5d68'); noise(g, '#686874', 10); noise(g, '#52525c', 8); R(g, 0, 15, 16, 1, '#4c4c56'); R(g, 15, 0, 1, 16, '#4c4c56'); },
    ',': g => { R(g, 0, 0, 16, 16, '#7a5232'); for (let y = 0; y < 16; y += 4) R(g, 0, y, 16, 1, '#5e3e24'); R(g, 5, 0, 1, 4, '#5e3e24'); R(g, 11, 4, 1, 4, '#5e3e24'); R(g, 3, 8, 1, 4, '#5e3e24'); R(g, 9, 12, 1, 4, '#5e3e24'); noise(g, '#86603c', 6); },
    '_': g => carpet(g, '#1f5a36', '#2f7a4a', '#c9d1e0'),
    '=': g => carpet(g, '#7a1f22', '#9a2f2c', '#d8b44a'),
    'i': g => { R(g, 0, 0, 16, 16, '#c8ccd2'); R(g, 0, 7, 16, 1, '#9ea4ac'); R(g, 7, 0, 1, 16, '#9ea4ac'); R(g, 15, 0, 1, 16, '#9ea4ac'); R(g, 0, 15, 16, 1, '#9ea4ac'); },
    'B': g => { R(g, 0, 0, 16, 16, '#4a2e18'); const cols = ['#8a2a2a', '#2a5a8a', '#2f6a3a', '#8a6a2a', '#5a2a6a', '#aa8a5a']; const r = seeded(7); for (let s = 0; s < 3; s++) { let x = 1; while (x < 15) { const w = 1 + Math.floor(r() * 2), h = 3 + Math.floor(r() * 2); R(g, x, 1 + s * 5 + (4 - h), w, h, cols[Math.floor(r() * cols.length)]); x += w; } R(g, 0, 5 + s * 5, 16, 1, '#2e1c0e'); } },
    't': g => { R(g, 0, 0, 16, 16, '#5a3a1e'); R(g, 0, 0, 16, 2, '#7a5232'); R(g, 0, 14, 16, 2, '#3e2814'); noise(g, '#6a4628', 5); R(g, 6, 5, 4, 3, '#d8d0bc'); R(g, 7, 4, 2, 1, '#e8c060'); },
    'F': g => { stoneWall(g); R(g, 2, 4, 12, 12, '#3a3a44'); R(g, 4, 7, 8, 9, '#110a06'); R(g, 5, 10, 6, 6, '#e8641e'); R(g, 6, 9, 4, 4, '#ffb23c'); R(g, 7, 8, 2, 3, '#ffe28a'); R(g, 1, 3, 14, 2, '#6a6a76'); },
    'b': g => { R(g, 0, 0, 16, 16, '#3e2814'); R(g, 1, 1, 14, 14, '#1f5a36'); R(g, 2, 2, 12, 4, '#e8e8f0'); R(g, 1, 8, 14, 1, '#2f7a4a'); R(g, 1, 12, 14, 1, '#c9d1e0'); },
    'd': g => { R(g, 0, 0, 16, 16, '#3e2814'); R(g, 1, 0, 14, 15, '#1f5a36'); R(g, 1, 3, 14, 1, '#2f7a4a'); R(g, 1, 9, 14, 1, '#2f7a4a'); R(g, 1, 14, 14, 1, '#c9d1e0'); },
    'P': g => { R(g, 0, 0, 16, 16, '#5d5d68'); R(g, 3, 0, 10, 16, '#8a8a96'); R(g, 4, 0, 2, 16, '#a2a2ae'); R(g, 11, 0, 2, 16, '#6e6e7a'); R(g, 2, 0, 12, 2, '#9a9aa6'); R(g, 2, 14, 12, 2, '#6e6e7a'); },
    'g': g => { R(g, 0, 0, 16, 16, '#3f7a3a'); noise(g, '#4a8a42', 14); noise(g, '#356a30', 10); },
    'G': g => { R(g, 0, 0, 16, 16, '#3f7a3a'); noise(g, '#4a8a42', 10); R(g, 3, 4, 2, 2, '#f2e86a'); R(g, 10, 9, 2, 2, '#e88ab0'); R(g, 6, 12, 2, 2, '#f8f8f8'); R(g, 12, 3, 1, 1, '#f8f8f8'); },
    'f': g => { R(g, 0, 0, 16, 16, '#2e5a2a'); R(g, 6, 10, 4, 6, '#4a3020'); for (const [x, y, rr, c] of [[8, 6, 7, '#1e4a22'], [6, 5, 4, '#2a6030'], [10, 4, 3, '#2f6a34']]) circ(g, x, y, rr, c); },
    'w': g => { R(g, 0, 0, 16, 16, '#1e4a7a'); noise(g, '#2a5a8e', 8); R(g, 2, 4, 5, 1, '#5a8ac0'); R(g, 9, 11, 5, 1, '#5a8ac0'); },
    'p': g => { R(g, 0, 0, 16, 16, '#8a6a44'); noise(g, '#9a7a52', 10); noise(g, '#7a5a38', 8); },
    'D': g => { R(g, 0, 0, 16, 16, '#3a2a1a'); R(g, 2, 1, 12, 15, '#6a4426'); R(g, 7, 1, 2, 15, '#4a2e18'); R(g, 3, 2, 10, 1, '#7a5232'); R(g, 10, 8, 2, 2, '#e8c060'); R(g, 4, 8, 2, 2, '#e8c060'); },
    'C': g => { R(g, 0, 0, 16, 16, '#6a6a72'); for (let y = 0; y < 16; y += 4) for (let x = (y / 4) % 2 * 2; x < 16; x += 5) R(g, x, y, 4, 3, '#7e7e88'); },
    'H': g => { R(g, 0, 0, 16, 16, '#7a3a2a'); for (let y = 0; y < 16; y += 4) { R(g, 0, y + 3, 16, 1, '#4a2218'); for (let x = (y / 4) % 2 * 4; x < 16; x += 8) R(g, x, y, 1, 3, '#4a2218'); } },
    'M': g => { defs['H'](g); R(g, 1, 3, 14, 9, '#2a1a10'); R(g, 2, 4, 12, 7, '#d8b44a'); R(g, 4, 6, 8, 1, '#2a1a10'); R(g, 4, 8, 6, 1, '#2a1a10'); },
    'K': g => { R(g, 0, 0, 16, 16, '#4a2e18'); R(g, 0, 0, 16, 4, '#8a6034'); R(g, 0, 4, 16, 1, '#2e1c0e'); noise(g, '#5a3a1e', 4); },
    'r': g => { R(g, 0, 0, 16, 16, '#5d5d68'); R(g, 1, 1, 14, 1, '#8a8a96'); for (const [x, c] of [[2, '#20242b'], [6, SLY], [10, '#5b3c8f']]) { R(g, x, 2, 4, 12, c); R(g, x + 1, 2, 2, 1, '#ddd'); } },
    'L': g => { R(g, 0, 0, 16, 16, '#6a6a72'); for (let y = 0; y < 16; y += 4) for (let x = (y / 4) % 2 * 2; x < 16; x += 5) R(g, x, y, 4, 3, '#7e7e88'); R(g, 7, 4, 2, 12, '#1c1c22'); R(g, 5, 0, 6, 5, '#1c1c22'); R(g, 6, 1, 4, 3, '#ffd36a'); },
    's': g => { R(g, 0, 0, 16, 16, '#7a5232'); R(g, 0, 2, 16, 12, '#8a2a2a'); R(g, 0, 2, 16, 3, '#aa3a3a'); R(g, 0, 13, 16, 1, '#5a1a1a'); },
    'x': g => { R(g, 0, 0, 16, 16, '#5a1a1a'); R(g, 2, 3, 12, 9, '#c9d8ee'); R(g, 3, 4, 10, 7, '#6a9a5a'); R(g, 3, 4, 10, 3, '#8ab8e8'); R(g, 0, 14, 16, 2, '#3a0e0e'); },
    'Z': g => { R(g, 0, 0, 16, 16, '#c8ccd2'); R(g, 1, 0, 14, 15, '#7a8a7a'); R(g, 2, 1, 12, 13, '#8a9a8a'); R(g, 11, 7, 2, 2, '#c8b060'); },
    'O': g => { R(g, 0, 0, 16, 16, '#c8ccd2'); R(g, 1, 3, 14, 10, '#e8ecf0'); R(g, 3, 5, 10, 6, '#9ab0c0'); R(g, 7, 1, 2, 3, '#a0a0a8'); },
    'n': g => { R(g, 0, 0, 16, 16, '#0a0e24'); const r = seeded(3); for (let i = 0; i < 3; i++) R(g, Math.floor(r() * 16), Math.floor(r() * 16), 1, 1, r() > 0.5 ? '#fff' : '#9ab0ff'); },
    'Q': g => { R(g, 0, 0, 16, 16, '#4c4c58'); R(g, 0, 0, 16, 5, '#7a7a88'); R(g, 0, 5, 16, 1, '#3a3a44'); R(g, 4, 8, 1, 4, '#3a3a44'); R(g, 11, 9, 1, 4, '#3a3a44'); },
    'J': g => { R(g, 0, 0, 16, 16, '#5d5d68'); R(g, 1, 6, 9, 9, '#6a4426'); R(g, 6, 2, 8, 8, '#4a3a5a'); R(g, 2, 3, 5, 4, '#8a7a5a'); R(g, 9, 10, 6, 5, '#7a2a2a'); R(g, 10, 4, 2, 2, '#d8b44a'); R(g, 3, 9, 3, 1, '#c9d1e0'); },
    'u': g => { R(g, 0, 0, 16, 16, '#8a8478'); R(g, 0, 15, 16, 1, '#6a6458'); R(g, 15, 0, 1, 16, '#6a6458'); noise(g, '#968e82', 6); },
    'e': g => { R(g, 0, 0, 16, 16, '#9a1e1e'); R(g, 0, 0, 16, 2, '#6a1010'); R(g, 0, 13, 16, 3, '#2a2a2a'); R(g, 3, 4, 10, 6, '#e8d8a0'); R(g, 4, 5, 8, 4, '#2c3a5a'); },
    'h': g => { R(g, 0, 0, 16, 16, '#6a4a2a'); for (let y = 0; y < 16; y += 4) R(g, 0, y, 16, 1, '#4a3018'); },
    'm': g => { stoneWall(g); R(g, 3, 1, 10, 14, '#d8b44a'); R(g, 4, 2, 8, 12, '#a8c0d8'); R(g, 5, 3, 2, 5, '#e8f0ff'); },
    'a': g => { R(g, 0, 0, 16, 16, '#7a5232'); R(g, 2, 2, 12, 12, '#1f5a36'); R(g, 2, 2, 12, 4, '#2f7a4a'); R(g, 1, 5, 2, 9, '#164a2a'); R(g, 13, 5, 2, 9, '#164a2a'); },
    'v': g => { R(g, 0, 0, 16, 16, '#5d5d68'); circ(g, 8, 9, 6, '#222228'); R(g, 3, 4, 10, 3, '#3a3a44'); R(g, 4, 4, 8, 2, '#5ac85a'); R(g, 6, 2, 1, 1, '#8af08a'); R(g, 9, 1, 1, 1, '#8af08a'); },
    'E': g => { R(g, 0, 0, 16, 16, '#5d5d68'); R(g, 2, 1, 12, 15, '#d8b44a'); R(g, 3, 2, 10, 13, '#cfe0f0'); R(g, 4, 3, 3, 6, '#ffffff'); R(g, 1, 14, 14, 2, '#8a6a2a'); },
    'c': g => { R(g, 0, 0, 16, 16, '#5d5d68'); R(g, 1, 3, 14, 12, '#3a2a40'); R(g, 2, 4, 12, 10, '#2a1a30'); R(g, 7, 4, 2, 10, '#5a4a60'); R(g, 6, 8, 1, 2, '#d8b44a'); R(g, 9, 8, 1, 2, '#d8b44a'); },
    'o': g => { R(g, 0, 0, 16, 16, '#5d5d68'); noise(g, '#686874', 8); circ(g, 8, 9, 6, '#6e6a62'); circ(g, 7, 8, 5, '#8a857a'); R(g, 5, 5, 3, 2, '#a8a294'); R(g, 3, 13, 10, 2, 'rgba(0,0,0,.3)'); },
    'X': g => { R(g, 0, 0, 16, 16, '#3a2a1a'); R(g, 2, 1, 12, 15, '#5a3a20'); R(g, 7, 1, 2, 15, '#3e2814'); for (let y = 3; y < 16; y += 4) R(g, 2, y, 12, 1, '#2a1a0e'); R(g, 6, 7, 4, 4, '#b8b8c0'); R(g, 7, 8, 2, 2, '#202024'); R(g, 7, 10, 2, 2, '#202024'); },
    '%': g => { stoneWall(g); R(g, 7, 2, 1, 4, '#1a1a20'); R(g, 6, 5, 1, 3, '#1a1a20'); R(g, 8, 6, 1, 4, '#1a1a20'); R(g, 7, 9, 1, 4, '#1a1a20'); R(g, 9, 9, 3, 1, '#1a1a20'); R(g, 4, 8, 2, 1, '#1a1a20'); },
    'q': g => { R(g, 0, 0, 16, 16, '#4a4a40'); for (let i = 0; i < 6; i++) { R(g, i * 3, 0, 1, 16, '#5a7a3a'); R(g, 0, i * 3, 16, 1, '#c8c8c0'); } R(g, 3, 3, 3, 3, '#6a8a4a'); R(g, 10, 9, 3, 3, '#6a8a4a'); },
    ';': g => { R(g, 0, 0, 16, 16, '#1e2a14'); for (let i = 0; i < 7; i++) { const x = (i * 5) % 16; R(g, x, 0, 2, 16, i % 2 ? '#2e4a1e' : '#3a5a24'); } R(g, 3, 4, 4, 2, '#4a7a2a'); R(g, 9, 10, 4, 2, '#4a7a2a'); R(g, 6, 7, 2, 2, '#7aaa3a'); },
    '^': g => { R(g, 0, 0, 16, 16, '#2a1008'); R(g, 1, 6, 14, 10, '#c83a10'); R(g, 3, 3, 10, 10, '#e8641e'); R(g, 5, 1, 6, 10, '#ffb23c'); R(g, 7, 3, 2, 6, '#ffe28a'); R(g, 1, 2, 2, 5, '#e8641e'); R(g, 12, 3, 3, 5, '#e8641e'); },
    'z': g => { R(g, 0, 0, 16, 16, '#1e4a7a'); noise(g, '#2a5a8e', 6); R(g, 0, 4, 5, 8, '#7a5232'); R(g, 11, 5, 5, 7, '#7a5232'); R(g, 1, 5, 3, 1, '#5e3e24'); R(g, 6, 9, 3, 2, '#6a4628'); },
    '+': g => { R(g, 0, 0, 16, 16, '#1e4a7a'); R(g, 0, 3, 16, 10, '#7a5232'); for (let x = 0; x < 16; x += 4) R(g, x, 3, 1, 10, '#5e3e24'); R(g, 0, 3, 16, 1, '#8a6034'); R(g, 0, 12, 16, 1, '#4a2e18'); },
    '!': g => { R(g, 0, 0, 16, 16, '#5d5d68'); noise(g, '#686874', 6); R(g, 4, 6, 8, 6, '#3a3a44'); R(g, 3, 5, 10, 2, '#6a6a76'); R(g, 6, 12, 4, 3, '#2a2a30'); R(g, 5, 7, 6, 2, '#1a1a1e'); },
    '*': g => { R(g, 0, 0, 16, 16, '#5d5d68'); noise(g, '#686874', 6); R(g, 4, 6, 8, 6, '#3a3a44'); R(g, 3, 5, 10, 2, '#6a6a76'); R(g, 6, 12, 4, 3, '#2a2a30'); R(g, 5, 1, 6, 5, '#e8641e'); R(g, 6, 0, 4, 4, '#ffb23c'); R(g, 7, 1, 2, 3, '#ffe28a'); },
    '?': g => { stoneWall(g); R(g, 15, 3, 1, 10, '#3a3a44'); },
    '$': g => { R(g, 0, 0, 16, 16, '#5d5d68'); noise(g, '#686874', 6); R(g, 2, 5, 12, 9, '#7a4a20'); R(g, 2, 5, 12, 3, '#9a6030'); R(g, 2, 8, 12, 1, '#d8b44a'); R(g, 7, 7, 2, 3, '#d8b44a'); R(g, 3, 13, 10, 2, 'rgba(0,0,0,.3)'); },
    '0': g => { R(g, 0, 0, 16, 16, '#5d5d68'); noise(g, '#686874', 6); R(g, 2, 8, 12, 6, '#7a4a20'); R(g, 2, 3, 12, 4, '#5a3418'); R(g, 3, 8, 10, 2, '#2a1a0e'); R(g, 2, 7, 12, 1, '#d8b44a'); },
    '&': g => { R(g, 0, 0, 16, 16, '#5d5d68'); noise(g, '#686874', 6); R(g, 2, 5, 12, 9, '#5a3a5a'); R(g, 2, 5, 12, 3, '#7a4a7a'); R(g, 2, 8, 12, 1, '#b8b8c0'); R(g, 6, 8, 4, 4, '#b8b8c0'); R(g, 7, 9, 2, 2, '#202024'); },
    'j': g => { R(g, 0, 0, 16, 16, '#3f7a3a'); R(g, 1, 1, 14, 14, '#8a6034'); R(g, 1, 1, 14, 2, '#aa7a44'); R(g, 3, 5, 10, 8, '#6a4426'); },
  };
  for (const [ch, fn] of Object.entries(defs)) { const c = mk(16, 16), g = c.getContext('2d'); fn(g); TILES[ch] = c; }
  function R(g, x, y, w, h, c) { g.fillStyle = c; g.fillRect(x, y, w, h); }
  function noise(g, c, n) { const r = seeded(c.length * 31 + n * 7 + c.charCodeAt(2)); g.fillStyle = c; for (let i = 0; i < n; i++) g.fillRect(Math.floor(r() * 16), Math.floor(r() * 16), 1, 1); }
  function circ(g, cx, cy, rr, c) { g.fillStyle = c; for (let y = -rr; y <= rr; y++) for (let x = -rr; x <= rr; x++) if (x * x + y * y <= rr * rr) g.fillRect(cx + x, cy + y, 1, 1); }
  function stoneWall(g) { R(g, 0, 0, 16, 16, '#4a4a56'); for (let y = 0; y < 16; y += 5) { R(g, 0, y + 4, 16, 1, '#36363f'); for (let x = (y / 5) % 2 * 4; x < 16; x += 8) R(g, x, y, 1, 4, '#36363f'); } R(g, 0, 0, 16, 1, '#5c5c6a'); }
  function banner(g, c, c2) { stoneWall(g); R(g, 3, 0, 10, 13, c); R(g, 3, 13, 5, 2, c); R(g, 8, 13, 5, 2, c); R(g, 3, 15, 2, 1, c); R(g, 11, 15, 2, 1, c); R(g, 6, 4, 4, 5, c2); R(g, 7, 5, 2, 3, c); R(g, 2, 0, 12, 1, '#d8b44a'); }
  function carpet(g, a, b, edge) { R(g, 0, 0, 16, 16, a); for (let i = 0; i < 16; i += 4) { R(g, i, i, 2, 2, b); R(g, 15 - i, i, 1, 1, b); } noise(g, b, 6); }
}

// ===== 공통: 색 보조 / 외곽선 =====
function mix(a, b, t) {
  const pa = parseInt(norm(a).slice(1), 16), pb = parseInt(norm(b).slice(1), 16);
  const ch = (p, s) => (p >> s) & 255;
  const c = s => Math.round(ch(pa, s) + (ch(pb, s) - ch(pa, s)) * t);
  return '#' + ((1 << 24) | (c(16) << 16) | (c(8) << 8) | c(0)).toString(16).slice(1);
}
function norm(hex) { return hex.length === 4 ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] : hex.slice(0, 7); }
function lum(hex) { const n = parseInt(norm(hex).slice(1), 16); return (((n >> 16) & 255) * 0.3 + ((n >> 8) & 255) * 0.59 + (n & 255) * 0.11) / 255; }
// 머리색 4단계: 기본 / 그늘 / 깊은 그늘 / 하이라이트
function hairTones(c) {
  const h = norm(c.hair || c.skin), L = lum(h);
  return {
    h, s: c.hair2 && lum(norm(c.hair2)) < L ? norm(c.hair2) : shade(h, L > 0.7 ? 0.84 : 0.72),
    d: L > 0.7 ? shade(h, 0.66) : L < 0.18 ? mix(h, '#000000', 0.5) : shade(h, 0.5),
    l: L > 0.7 ? '#ffffff' : L < 0.18 ? mix(h, '#8fa0c8', 0.45) : mix(h, '#ffffff', 0.38),
  };
}
// 선택적 외곽선: 투명 픽셀 중 불투명 이웃이 있으면 이웃 색을 어둡게 해서 칠한다
function outline(cvs, k = 0.42) {
  const g = cvs.getContext('2d'), w = cvs.width, h = cvs.height;
  const im = g.getImageData(0, 0, w, h), d = im.data, src = new Uint8ClampedArray(d);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4; if (src[i + 3] > 40) continue;
    let best = -1;
    for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
      const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const j = (ny * w + nx) * 4; if (src[j + 3] > 160) { best = j; break; }
    }
    if (best < 0) continue;
    d[i] = src[best] * k * 0.8 + 12; d[i + 1] = src[best + 1] * k * 0.8 + 8; d[i + 2] = src[best + 2] * k * 0.8 + 18; d[i + 3] = 255;
  }
  g.putImageData(im, 0, 0);
}

// ===== 스프라이트 (16x24, 4방향 x 3프레임) =====
const SPR = {};
const SPR_W = 16, SPR_H = 24;
function getSprite(id) {
  if (SPR[id]) return SPR[id];
  const custom = Img.get('sprite/' + id + '.png');
  if (custom) return (SPR[id] = custom);
  const c = CHARS[id] || CHARS.student;
  const sheet = mk(SPR_W * 3, SPR_H * 4), g = sheet.getContext('2d');
  // 방향 순서: 0 아래, 1 왼쪽, 2 오른쪽, 3 위
  for (const dir of [0, 1, 3]) for (let f = 0; f < 3; f++) {
    const fr = mk(SPR_W, SPR_H), fg = fr.getContext('2d');
    drawSprite(fg, c, dir, f);
    outline(fr);
    fg.globalCompositeOperation = 'destination-over';
    fg.fillStyle = 'rgba(0,0,0,.28)'; fg.fillRect(4, 22, 8, 2); fg.fillRect(3, 23, 10, 1);
    g.drawImage(fr, f * SPR_W, dir * SPR_H);
  }
  for (let f = 0; f < 3; f++) { // 오른쪽 = 왼쪽 반전
    g.save(); g.translate(f * SPR_W + SPR_W, 2 * SPR_H); g.scale(-1, 1);
    g.drawImage(sheet, f * SPR_W, SPR_H, SPR_W, SPR_H, 0, 0, SPR_W, SPR_H); g.restore();
  }
  return (SPR[id] = sheet);
}
function drawSprite(g, c, dir, f) {
  const P = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  if (c.special) return drawSpecialSprite(g, c, dir, f, P);
  if (c.ghost) g.globalAlpha = 0.8;
  const sk = norm(c.skin), skS = shade(sk, 0.86), H = hairTones(c);
  const robe = norm(c.robe || '#23262e'), rS = shade(robe, 0.68), rL = mix(robe, '#ffffff', 0.16);
  const trim = norm(c.trim || '#777777'), boot = '#1c1a22', line = '#1b1520', st = c.style;
  const eye = norm(c.eye || '#444444');
  if (st === 'elf') {
    P(5, 13, 6, 6, robe); P(5, 13, 6, 1, trim); P(9, 14, 2, 5, shade(robe, 0.85));
    P(6, 19, 1, 3, sk); P(9, 19, 1, 3, sk);
    P(4, 6, 8, 7, sk); P(11, 7, 1, 5, skS);
    if (dir !== 3) { P(0, 7, 4, 2, sk); P(12, 7, 4, 2, skS); P(1, 7, 2, 1, '#e8b0a0'); }
    if (dir === 0) { P(5, 8, 2, 3, eye); P(9, 8, 2, 3, eye); P(5, 8, 1, 1, '#fff'); P(9, 8, 1, 1, '#fff'); P(7, 11, 2, 1, skS); }
    if (dir === 1) { P(4, 8, 2, 3, eye); P(4, 8, 1, 1, '#fff'); P(3, 10, 1, 1, sk); }
    return;
  }
  // 다리 (걸음 프레임마다 한쪽 다리를 든다)
  const lu = f === 1 ? 1 : 0, ru = f === 2 ? 1 : 0;
  if (dir === 1) { P(6, 19, 2, 3 - lu, boot); P(8, 19, 2, 3 - ru, '#2c2a34'); }
  else { P(5, 19, 2, 3 - lu, boot); P(9, 19, 2, 3 - ru, boot); }
  // 뒷머리 (몸통 뒤)
  const longish = st === 'long' || st === 'longm' || st === 'updo';
  if (dir === 0) {
    if (st === 'long') { P(2, 5, 12, 11, H.s); P(3, 16, 3, 1, H.s); P(10, 16, 3, 1, H.s); }
    if (st === 'longm' || st === 'greasy') P(2, 5, 12, 8, H.s);
    if (st === 'bushy' || st === 'curly' || st === 'hagrid') P(1, 3, 14, 11, H.s);
    if (st === 'pigtail') { P(0, 5, 2, 7, H.h); P(14, 5, 2, 7, H.s); }
  }
  // 몸통
  if (dir === 1) {
    P(5, 12, 6, 7, robe); P(5, 12, 1, 7, rL); P(5, 18, 6, 1, rS);
    const sw = f === 1 ? -1 : f === 2 ? 1 : 0;
    P(7 + sw, 13, 2, 4, rS); P(7 + sw, 17, 2, 1, sk);
  } else {
    P(4, 12, 8, 7, robe); P(10, 12, 2, 7, rS); P(4, 18, 8, 1, rS); P(4, 12, 1, 6, rL);
    P(3, 13, 1, 4, robe); P(12, 13, 1, 4, rS); P(3, 17, 1, 1, sk); P(12, 17, 1, 1, skS);
    if (dir === 0) { P(6, 12, 4, 1, '#ecebf2'); P(7, 13, 2, 3, trim); P(7, 13, 2, 1, shade(trim, 0.75)); }
    else P(5, 12, 6, 1, rS);
  }
  if (c.bow && dir !== 3) P(5, 1, 6, 2, '#f088b8');
  // 머리
  if (st === 'hood' || st === 'mask') {
    P(2, 2, 12, 10, robe); P(3, 1, 10, 1, robe); P(12, 3, 2, 9, rS);
    if (dir === 0) { P(4, 4, 8, 7, st === 'mask' ? '#c8ccd0' : '#08080c'); P(5, 7, 2, 1, st === 'mask' ? '#111' : eye); P(9, 7, 2, 1, st === 'mask' ? '#111' : eye); }
    if (dir === 1) { P(3, 4, 5, 7, st === 'mask' ? '#c8ccd0' : '#08080c'); P(4, 7, 1, 1, st === 'mask' ? '#111' : eye); }
    return;
  }
  if (dir === 3) { // 뒤통수
    if (st === 'bald') { P(3, 1, 10, 10, sk); P(10, 2, 2, 8, skS); return; }
    if (st === 'turban') { P(2, 0, 12, 7, '#6a3a7a'); P(2, 2, 12, 1, '#8a5a9a'); P(4, 7, 8, 4, sk); return; }
    P(3, 1, 10, 11, H.h); P(2, 2, 12, 9, H.h); P(10, 2, 3, 9, H.s); P(5, 2, 4, 1, H.l);
    if (st === 'long') { P(2, 10, 12, 7, H.h); P(10, 10, 4, 7, H.s); P(4, 17, 8, 1, H.s); }
    if (st === 'longm' || st === 'greasy') { P(3, 10, 10, 3, H.h); P(10, 10, 3, 3, H.s); }
    if (st === 'bushy' || st === 'curly' || st === 'hagrid') { P(1, 1, 14, 13, H.h); P(11, 2, 4, 12, H.s); }
    if (st === 'bun') P(6, 0, 4, 3, H.s);
    if (st === 'updo') { P(5, 0, 6, 3, H.s); }
    if (st === 'pigtail') { P(0, 5, 2, 7, H.h); P(14, 5, 2, 7, H.s); }
    if (st === 'messy') { P(1, 2, 1, 2, H.h); P(14, 3, 1, 2, H.h); P(6, 0, 3, 1, H.h); }
    if (c.hat) hatSprite(P, c.hat);
    return;
  }
  if (dir === 0) {
    // 얼굴
    P(3, 4, 10, 7, sk); P(4, 11, 8, 1, sk); P(11, 5, 2, 6, skS); P(5, 11, 6, 1, skS);
    // 눈
    for (const x of [4, 10]) {
      P(x, 7, 2, 1, line); P(x, 8, 2, 2, eye); P(x, 8, 1, 1, '#ffffff');
      if (c.eye === '#d02020') P(x, 8, 2, 2, '#ff3030');
    }
    if (c.female) { P(3, 7, 1, 1, line); P(12, 7, 1, 1, line); P(3, 10, 2, 1, '#f4a8b0'); P(11, 10, 2, 1, '#f4a8b0'); }
    P(7, 10, 2, 1, shade(sk, 0.72));
    if (st !== 'bald' && st !== 'turban') {
      P(3, 1, 10, 4, H.h); P(2, 2, 12, 4, H.h); P(10, 2, 3, 3, H.s); P(5, 2, 4, 1, H.l); P(4, 3, 2, 1, H.l);
      P(3, 5, 10, 1, H.h);
      if (st === 'messy') { P(1, 2, 1, 2, H.h); P(14, 2, 1, 3, H.h); P(5, 0, 2, 1, H.h); P(9, 0, 3, 1, H.h); P(3, 6, 1, 1, H.h); P(7, 6, 2, 1, H.h); P(11, 6, 2, 1, H.s); P(6, 6, 1, 1, '#c03838'); }
      else if (st === 'long' || st === 'bob' || st === 'pigtail') { P(3, 6, 2, 1, H.h); P(6, 6, 1, 1, H.h); P(9, 6, 3, 1, H.h); P(2, 5, 2, st === 'bob' ? 7 : 11, H.h); P(12, 5, 2, st === 'bob' ? 7 : 11, H.s); P(2, 6, 1, 4, H.l); }
      else if (st === 'longm' || st === 'greasy') { P(2, 5, 2, 8, H.h); P(12, 5, 2, 8, H.s); P(7, 1, 2, 2, H.s); }
      else if (st === 'bushy' || st === 'curly' || st === 'hagrid') { P(1, 1, 14, 5, H.h); P(1, 5, 2, 8, H.h); P(13, 5, 2, 8, H.s); P(4, 6, 2, 1, H.h); P(10, 6, 2, 1, H.h); }
      else if (st === 'bun') { P(6, 0, 4, 2, H.s); }
      else if (st === 'updo') { P(6, 0, 4, 2, H.s); P(2, 5, 1, 5, H.h); P(13, 5, 1, 5, H.d); }
      else { P(2, 4, 1, 4, H.h); P(13, 4, 1, 4, H.s); P(4, 6, 2, 1, H.h); P(9, 6, 2, 1, H.h); }
      if (st === 'beard' || st === 'hagrid') { P(4, 9, 8, 6, H.h); P(5, 15, 6, 2, H.h); P(10, 9, 2, 7, H.s); P(5, 9, 6, 1, H.s); }
    }
    if (st === 'bald') { P(5, 2, 3, 1, '#ffffff66'); }
    if (st === 'turban') { P(2, 0, 12, 5, '#6a3a7a'); P(2, 2, 12, 1, '#8a5a9a'); P(10, 0, 4, 5, '#532c60'); }
    if (c.glasses) { const gc = '#26222a'; for (const x of [3, 9]) { P(x, 7, 4, 1, gc); P(x, 10, 4, 1, gc); P(x, 8, 1, 2, gc); P(x + 3, 8, 1, 2, gc); } P(7, 8, 2, 1, gc); }
    if (c.hat) hatSprite(P, c.hat);
    g.globalAlpha = 1;
    return;
  }
  // 왼쪽 옆모습
  if (st === 'long') { P(8, 4, 6, 13, H.h); P(11, 4, 3, 13, H.s); P(9, 17, 4, 1, H.s); }
  if (st === 'bushy' || st === 'curly' || st === 'hagrid') { P(5, 1, 10, 13, H.h); P(11, 2, 4, 12, H.s); }
  if (st === 'pigtail') { P(12, 5, 3, 7, H.h); }
  P(3, 4, 8, 7, sk); P(4, 11, 6, 1, sk); P(2, 8, 1, 1, sk); P(9, 5, 2, 6, skS);
  P(4, 7, 2, 1, line); P(4, 8, 1, 2, c.eye === '#d02020' ? '#ff3030' : eye); P(5, 8, 1, 2, '#ffffff');
  if (c.female) { P(3, 7, 1, 1, line); P(4, 10, 2, 1, '#f4a8b0'); }
  P(3, 10, 1, 1, shade(sk, 0.72));
  if (st !== 'bald' && st !== 'turban') {
    P(3, 1, 10, 4, H.h); P(2, 2, 12, 3, H.h); P(8, 3, 6, 6, H.h); P(11, 3, 3, 6, H.s); P(4, 2, 4, 1, H.l);
    P(3, 5, 4, 1, H.h); P(3, 6, 1, 1, H.h);
    if (st === 'messy') { P(1, 2, 1, 2, H.h); P(13, 1, 2, 1, H.h); P(5, 0, 3, 1, H.h); P(14, 4, 1, 2, H.h); }
    if (st === 'longm' || st === 'greasy') { P(8, 9, 6, 4, H.h); P(11, 9, 3, 4, H.s); }
    if (st === 'bob') { P(8, 9, 5, 2, H.h); }
    if (st === 'bun') { P(11, 0, 4, 3, H.s); }
    if (st === 'updo') { P(11, 0, 4, 3, H.d); }
    if (st === 'beard' || st === 'hagrid') { P(2, 9, 6, 6, H.h); P(3, 15, 4, 2, H.h); }
  }
  if (st === 'turban') { P(2, 0, 12, 5, '#6a3a7a'); P(2, 2, 12, 1, '#8a5a9a'); }
  if (c.glasses) { P(3, 7, 4, 1, '#26222a'); P(3, 10, 3, 1, '#26222a'); P(6, 7, 1, 4, '#26222a'); }
  if (c.hat) hatSprite(P, c.hat);
  g.globalAlpha = 1;
}
function hatSprite(P, h) { P(1, 3, 14, 1, h); P(4, 1, 8, 2, h); P(5, 0, 6, 1, h); P(4, 2, 8, 1, shade(norm(h), 1.3)); }
function drawSpecialSprite(g, c, dir, f, P) {
  if (c.special === 'hat') { P(2, 14, 12, 5, '#6a4a2a'); P(4, 8, 8, 6, '#5a3e22'); P(6, 4, 4, 4, '#5a3e22'); P(9, 2, 3, 2, '#4a3018'); P(5, 11, 2, 1, '#2a1a0e'); P(9, 11, 2, 1, '#2a1a0e'); P(6, 13, 4, 1, '#2a1a0e'); return; }
  if (c.special === 'owl') { P(4, 9, 8, 10, '#e8e0d0'); P(4, 9, 8, 2, '#c8b8a0'); P(5, 11, 2, 2, '#d8a020'); P(9, 11, 2, 2, '#d8a020'); P(7, 13, 2, 2, '#8a6a2a'); P(10, 12, 2, 6, '#c8c0b0'); return; }
  if (c.special === 'troll') { const s = norm(c.skin); P(1, 2, 14, 18, s); P(3, 4, 10, 5, shade(s, 0.85)); P(4, 6, 3, 1, '#300'); P(9, 6, 3, 1, '#300'); P(5, 9, 6, 1, '#4a3a2a'); P(0, 9, 2, 9, s); P(14, 9, 2, 9, shade(s, 0.8)); P(2, 15, 12, 4, '#5a4a30'); P(3, 20, 4, 2, shade(s, 0.7)); P(9, 20, 4, 2, shade(s, 0.7)); return; }
  if (c.special === 'hippogriff') { P(2, 9, 12, 9, '#8a8a92'); P(10, 10, 4, 7, '#6e6e76'); P(2, 4, 5, 7, '#d0d0d8'); P(0, 6, 2, 2, '#d8b44a'); P(3, 5, 1, 1, '#d87a1e'); P(8, 7, 7, 4, '#9a9aa2'); P(9, 6, 5, 1, '#b8b8c0'); P(3, 18, 2, 4, '#5a5a62'); P(11, 18, 2, 4, '#5a5a62'); return; }
}

// ===== 초상화 (64x64 → 2배 확대해 128x128으로 표시) =====
const PORTRAIT_EMOS = ['normal', 'smile', 'smirk', 'angry', 'sad', 'surprise', 'blush', 'cry'];
const POR = {};
const POR_SIZE = 64;
// 직접 그린 일러스트가 있는 캐릭터는, 없는 감정을 가장 가까운 그림으로 대신한다 (도트와 섞이지 않게)
const EMO_FALLBACK = {
  normal: ['smirk', 'smile', 'blush', 'angry'], smile: ['smirk', 'normal', 'blush'], smirk: ['normal', 'smile', 'angry'],
  angry: ['smirk', 'normal', 'surprise'], sad: ['blush', 'cry', 'normal'], cry: ['sad', 'blush', 'normal'],
  surprise: ['blush', 'angry', 'normal'], blush: ['sad', 'surprise', 'normal', 'smile'],
};
function customPortrait(id, emo) {
  for (const e of [emo, ...(EMO_FALLBACK[emo] || []), ...PORTRAIT_EMOS]) {
    const im = Img.get('portrait/' + id + '_' + e + '.png'); if (im) return im;
  }
  return null;
}
function isIllust(p) { return p && !(p instanceof HTMLCanvasElement); }
function getPortrait(id, emo) {
  const key = id + '_' + emo;
  const custom = customPortrait(id, emo);
  if (custom) return custom;
  if (POR[key]) return POR[key];
  const c = CHARS[id]; if (!c) return null;
  const cvs = mk(POR_SIZE, POR_SIZE), g = cvs.getContext('2d');
  if (c.special) { const t = mk(48, 48); drawSpecialPortrait(t.getContext('2d'), c, emo); g.drawImage(t, 8, 16); }
  else drawPortrait(g, c, emo);
  outline(cvs, 0.38);
  return (POR[key] = cvs);
}
function drawPortrait(g, c, emo) {
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x | 0, y | 0, w | 0, h | 0); };
  const E = (cx, cy, rx, ry, col, y0 = -99, y1 = 999) => {
    g.fillStyle = col;
    for (let y = -ry; y <= ry; y++) { if (cy + y < y0 || cy + y > y1) continue; const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); if (hw > 0) g.fillRect(cx - hw, cy + y, hw * 2, 1); }
  };
  // 끝이 뾰족한 머리 다발: (x,y)에서 아래로 len, 폭 w, 기울기 sl
  const lock = (x, y, w, len, sl, col, edge) => {
    for (let i = 0; i < len; i++) {
      const ww = Math.max(1, Math.round(w * (1 - Math.pow(i / len, 1.6))));
      const xx = Math.round(x + sl * i - ww / 2);
      R(xx, y + i, ww, 1, col);
      if (edge && ww > 2) R(xx + ww - 1, y + i, 1, 1, edge);
    }
  };
  if (c.ghost) g.globalAlpha = 0.85;
  const sk = norm(c.skin), skS = shade(sk, 0.88), skD = shade(sk, 0.76), H = hairTones(c);
  const robe = norm(c.robe || '#23262e'), rS = shade(robe, 0.68), rL = mix(robe, '#ffffff', 0.14), trim = norm(c.trim || '#777777');
  const st = c.style, line = '#1e1622', iris = norm(c.eye || '#555555');
  const cx = 32;
  const faceHW = y => y < 14 ? 0 : y < 18 ? 10 + (y - 14) * 0.8 : y <= 33 ? 13 : y <= 46 ? Math.max(1, 13 * (1 - Math.pow((y - 33) / 13, 1.7))) : 0;

  // --- 뒷머리 ---
  if (st === 'long') {
    E(cx, 30, 21, 20, H.s); R(11, 30, 42, 26, H.s);
    for (let x = 12; x < 52; x += 5) lock(x + 2, 52, 6, 10, (x - 32) * 0.02, H.s);
    R(13, 30, 3, 26, H.d); R(48, 30, 3, 26, H.d);
  }
  if (st === 'longm' || st === 'firenze') { E(cx, 30, 19, 18, H.s); R(14, 30, 36, 18, H.s); for (let x = 15; x < 50; x += 6) lock(x + 2, 46, 6, 8, 0, H.s); }
  if (st === 'updo') { E(cx, 24, 18, 17, H.s); E(cx + 8, 12, 8, 7, H.d); }
  if (st === 'bushy' || st === 'curly' || st === 'hagrid') {
    E(cx, 30, 27, 26, H.s);
    for (let i = 0; i < 14; i++) { const a = Math.PI * (0.05 + i / 13 * 0.9) + Math.PI; const x = cx + Math.cos(a) * 25, y = 30 - Math.sin(a) * 24; E(x | 0, y | 0, 5, 5, i % 2 ? H.s : H.d); }
    for (let i = 0; i < 6; i++) E(8 + i * 10, 52 + (i % 2) * 3, 6, 6, i % 2 ? H.d : H.s);
  }
  if (st === 'greasy') { R(13, 18, 38, 34, H.s); }
  if (st === 'bob') { E(cx, 26, 19, 18, H.s); R(13, 26, 38, 18, H.s); R(13, 43, 38, 1, H.d); }
  if (st === 'pigtail') { E(9, 40, 6, 14, H.h); E(55, 40, 6, 14, H.s); R(8, 30, 3, 20, H.l); }
  if (st === 'hood' || st === 'mask') { E(cx, 30, 22, 26, robe); R(10, 30, 44, 34, robe); E(cx, 30, 18, 22, rS); }

  // --- 몸 ---
  for (let y = 50; y < 64; y++) {
    const hw = Math.min(31, 14 + (y - 50) * 3);
    R(cx - hw, y, hw * 2, 1, robe);
    R(cx + Math.round(hw * 0.4), y, Math.round(hw * 0.6), 1, rS);
    R(cx - hw, y, 2, 1, rL);
  }
  const adult = !!c.robe;
  if (adult && st !== 'hood' && st !== 'mask' && st !== 'elf') {
    // 어른: 높은 깃의 로브
    for (let i = 0; i < 10; i++) { R(cx - 7 + Math.floor(i / 2), 48 + i, 3, 1, rL); R(cx + 4 - Math.floor(i / 2), 48 + i, 3, 1, rS); }
    R(cx - 2, 52, 4, 12, shade(robe, 0.5)); R(cx - 1, 52, 2, 12, trim);
  } else if (st !== 'hood' && st !== 'mask' && st !== 'elf') {
    // 셔츠 깃 + 넥타이
    for (let i = 0; i < 8; i++) { R(cx - 9 + i, 49 + i, 2, 1, '#ecebf2'); R(cx + 7 - i, 49 + i, 2, 1, '#d8d7e2'); }
    R(cx - 4, 50, 8, 14, '#ecebf2'); R(cx + 2, 50, 2, 14, '#d0cfda');
    R(cx - 2, 51, 4, 3, shade(trim, 0.8)); R(cx - 2, 54, 4, 10, trim); R(cx - 3, 57, 6, 7, trim);
    for (let y = 56; y < 64; y += 3) R(cx - 3, y, 6, 1, mix(trim, '#e8d8a0', 0.45));
    R(cx - 12, 52, 2, 12, rS); R(cx + 10, 52, 2, 12, shade(robe, 0.55));
  }
  if (st === 'elf') { R(10, 52, 44, 12, robe); R(10, 52, 44, 2, trim); }
  // 목
  R(cx - 5, 43, 10, 8, skS); R(cx - 5, 43, 10, 3, skD);
  // 귀
  if (st === 'elf') { E(10, 30, 9, 4, sk); E(54, 30, 9, 4, skS); E(10, 30, 5, 2, '#e8a8a0'); E(54, 30, 5, 2, '#d89890'); }
  else { R(17, 28, 3, 7, sk); R(44, 28, 3, 7, skS); R(18, 30, 1, 3, skD); R(45, 30, 1, 3, skD); }
  // 얼굴
  for (let y = 12; y <= 46; y++) { const hw = Math.round(faceHW(y)); if (hw) R(cx - hw, y, hw * 2, 1, sk); }
  for (let y = 20; y <= 44; y++) { const hw = Math.round(faceHW(y)); if (hw > 2) R(cx + hw - 2, y, 2, 1, skS); }
  R(cx - 3, 46, 6, 1, skS);

  // --- 앞머리 ---
  const cap = (ry = 13, yc = 21, y1 = 24, rx = 18) => { E(cx, yc, rx, ry, H.h, 0, y1); E(cx + 6, yc, rx - 6, ry - 1, H.s, 0, y1 - 2); E(cx - 2, yc - 2, rx - 6, ry - 3, H.h, 0, y1 - 3); };
  const ring = (y0 = 11, span = 13) => { const col = lum(H.h) < 0.2 ? mix(H.h, '#5a6488', 0.35) : H.l; for (let x = cx - span; x <= cx + span - 4; x += 1) { if ((x + 3) % 7 > 4) continue; const y = Math.round(y0 + Math.pow((x - cx + 2) / span, 2) * 5); R(x, y, 1, 2, col); } };
  if (st === 'long') {
    cap(14, 22, 26, 19);
    // 옆으로 넘긴 앞머리 (가르마 왼쪽)
    lock(19, 16, 7, 14, 0.05, H.h, H.s); lock(23, 15, 6, 10, 0.25, H.h, H.s); lock(28, 14, 7, 13, 0.32, H.h, H.s);
    lock(34, 14, 6, 10, 0.3, H.h, H.s); lock(39, 15, 6, 12, 0.32, H.s, H.d); lock(44, 17, 6, 13, 0.12, H.s, H.d);
    // 얼굴 옆 머리 (앞쪽)
    lock(15, 20, 7, 40, 0.04, H.h, H.s); lock(49, 20, 7, 40, -0.04, H.s, H.d);
    R(14, 24, 1, 22, H.l); R(22, 9, 1, 4, H.d); ring(10, 14);
  } else if (st === 'longm') {
    cap(13, 21, 22, 18); R(14, 18, 5, 22, H.h); R(45, 18, 5, 22, H.s); lock(16, 38, 6, 12, 0.05, H.h); lock(47, 38, 6, 12, -0.05, H.s);
    for (let x = 20; x < 44; x += 4) R(x, 9 + Math.abs(x - 32) / 4, 1, 8, H.s); ring(10, 12);
  } else if (st === 'messy') {
    cap(14, 21, 23, 19);
    for (const [x, y, w, l, s] of [[14, 11, 7, 6, -0.8], [19, 7, 7, 5, -0.6], [27, 5, 8, 4, -0.2], [36, 5, 8, 4, 0.3], [44, 8, 7, 5, 0.7], [49, 13, 6, 6, 0.9], [12, 18, 5, 6, -0.6], [51, 20, 5, 5, 0.6]]) {
      // 위/바깥으로 뻗은 삐침
      for (let i = 0; i < l; i++) { const ww = Math.max(1, Math.round(w * (i / l))); R(Math.round(x + s * (l - i) - ww / 2), y + i, ww, 1, i < 2 ? H.s : H.h); }
    }
    lock(18, 18, 6, 10, -0.15, H.h, H.s); lock(24, 18, 5, 8, 0.1, H.h, H.s); lock(37, 18, 6, 9, 0.2, H.h, H.s); lock(43, 18, 6, 11, 0.3, H.s, H.d); lock(31, 18, 4, 5, 0, H.h);
    ring(10, 12);
  } else if (st === 'short') {
    cap(13, 21, 22, 18); R(15, 18, 3, 10, H.h); R(46, 18, 3, 10, H.s);
    lock(20, 18, 6, 6, 0.1, H.h, H.s); lock(26, 18, 6, 5, 0.2, H.h, H.s); lock(32, 18, 6, 6, 0.2, H.h, H.s); lock(38, 18, 6, 5, 0.25, H.s, H.d); lock(44, 18, 5, 6, 0.2, H.s, H.d);
    ring(10, 12);
  } else if (st === 'bushy' || st === 'curly') {
    cap(14, 21, 24, 21);
    for (let i = 0; i < 8; i++) E(16 + i * 4.6 | 0, 21 + (i % 2) * 2, 4, 4, i % 3 === 2 ? H.s : H.h);
    R(13, 20, 5, 26, H.h); R(46, 20, 5, 26, H.s);
    for (let i = 0; i < 5; i++) { E(14, 26 + i * 6, 3, 3, i % 2 ? H.s : H.h); E(50, 26 + i * 6, 3, 3, H.s); }
    ring(10, 13);
  } else if (st === 'hagrid') {
    cap(14, 21, 24, 21); E(cx, 50, 20, 15, H.h); E(cx, 43, 12, 4, H.h); E(cx + 6, 52, 12, 11, H.s); R(cx - 5, 42, 10, 2, '#a86a5a');
  } else if (st === 'greasy') {
    cap(13, 21, 22, 18); R(14, 17, 6, 34, H.h); R(44, 17, 6, 34, H.s); R(20, 18, 4, 10, H.h); R(40, 18, 4, 10, H.s); R(31, 8, 2, 12, H.d);
  } else if (st === 'bun') {
    cap(13, 21, 21, 17); E(cx, 7, 7, 6, H.h); E(cx + 2, 8, 5, 4, H.s); R(15, 18, 3, 8, H.h); R(46, 18, 3, 8, H.s); for (let x = 19; x < 46; x += 3) R(x, 12 + Math.abs(x - 32) / 3, 1, 8, H.s);
  } else if (st === 'updo') {
    cap(13, 21, 23, 18); R(cx, 9, 18, 16, H.d); E(cx + 6, 20, 12, 12, H.d, 0, 24);
    lock(16, 18, 6, 22, 0.05, H.h, H.s); lock(48, 18, 6, 22, -0.05, H.d); lock(22, 17, 6, 8, 0.2, H.h, H.s); ring(10, 10);
  } else if (st === 'bob') {
    cap(14, 21, 24, 19); R(13, 18, 6, 26, H.h); R(45, 18, 6, 26, H.s); R(18, 18, 28, 6, H.h); R(18, 23, 28, 1, H.s); ring(10, 12);
  } else if (st === 'beard') {
    cap(12, 21, 20, 17); R(15, 18, 4, 16, H.h); R(45, 18, 4, 16, H.s);
    E(cx, 52, 15, 16, H.h); E(cx + 5, 54, 9, 12, H.s); E(cx, 41, 9, 3, H.h); R(cx - 4, 40, 8, 1, H.s); R(cx - 2, 42, 4, 2, '#a86a5a');
  } else if (st === 'pigtail') {
    cap(14, 21, 23, 19); R(18, 18, 28, 4, H.h); R(18, 21, 28, 1, H.s); R(14, 18, 4, 16, H.h); R(46, 18, 4, 16, H.s);
  } else if (st === 'turban') {
    E(cx, 15, 20, 12, '#6a3a7a', 0, 22); for (let y = 6; y < 22; y += 4) R(13, y, 38, 1, '#8a5a9a'); E(cx + 8, 15, 10, 10, '#532c60', 0, 22);
  } else if (st === 'hood') {
    for (let y = 12; y <= 46; y++) { const hw = Math.round(faceHW(y)); if (hw) R(cx - hw, y, hw * 2, 1, '#06060a'); }
    E(cx, 18, 22, 12, robe, 0, 22); R(cx - 6, 29, 4, 2, iris); R(cx + 3, 29, 4, 2, iris);
    g.globalAlpha = 1; return;
  } else if (st === 'mask') {
    for (let y = 12; y <= 46; y++) { const hw = Math.round(faceHW(y)); if (hw) R(cx - hw, y, hw * 2, 1, '#c8ccd0'); }
    R(22, 27, 8, 4, '#111'); R(34, 27, 8, 4, '#111'); for (let i = 0; i < 5; i++) R(22 + i * 4, 40, 2, 1, '#8a8e94');
    E(cx, 18, 22, 12, robe, 0, 20);
    g.globalAlpha = 1; return;
  }
  // 앞머리 아래 그늘
  if (st !== 'bald' && st !== 'turban' && st !== 'elf') for (let x = cx - 12; x < cx + 12; x++) { if (g.getImageData(x, 25, 1, 1).data[0] === parseInt(sk.slice(1, 3), 16)) R(x, 25, 1, 1, skS); }

  // --- 눈썹 ---
  const brow = lum(H.h) > 0.7 ? shade(H.h, 0.7) : st === 'bald' ? skD : shade(H.h, 0.9);
  const L = 25, Rx = 39, ey = 29;
  const browAt = (c0, side) => { // side: -1 왼쪽 눈, +1 오른쪽 눈
    for (let i = 0; i < 8; i++) {
      const t = side < 0 ? i : 7 - i; // t: 0 = 바깥쪽, 7 = 안쪽
      let dy = 0;
      if (emo === 'angry') dy = Math.round(t * 0.45);
      else if (emo === 'sad' || emo === 'cry') dy = -Math.round(t * 0.35) + 2;
      else if (emo === 'surprise') dy = -2;
      else if (emo === 'smirk') dy = side > 0 ? -1 : 0;
      else dy = t < 2 ? 1 : 0;
      R(c0 - 4 + i, 24 + dy, 1, c.female ? 1 : 2, brow);
    }
  };
  if (st !== 'hood') { browAt(L, -1); browAt(Rx, 1); }
  // --- 눈 ---
  const irisD = shade(iris, 0.55), irisL = mix(iris, '#ffffff', 0.35);
  const eyeOpen = (x, side, top = 0) => {
    R(x - 3, ey + top, 6, 1, '#ffffff'); R(x - 4, ey + 1 + top, 8, 5 - top, '#ffffff'); R(x - 3, ey + 6, 6, 1, '#f2eef2');
    R(x - 2, ey + top, 5, 7 - top, iris); R(x - 2, ey + top, 5, 2, irisD); R(x - 1, ey + 5, 3, 1, irisL);
    R(x - 1, ey + 2 + Math.max(0, top - 1), 2, 3, '#140e18');
    R(x - 2, ey + 1 + top, 2, 2, '#ffffff'); R(x + 2, ey + 5, 1, 1, '#ffffff');
    // 윗속눈썹
    R(x - 4, ey - 1 + top, 9, 2, line);
    if (side < 0) { R(x - 6, ey + top, 2, 1, line); R(x - 5, ey + 1 + top, 1, 1, line); } else { R(x + 5, ey + top, 2, 1, line); R(x + 5, ey + 1 + top, 1, 1, line); }
    if (c.female) { if (side < 0) { R(x - 7, ey - 1 + top, 1, 1, line); R(x - 5, ey - 2 + top, 2, 1, line); } else { R(x + 7, ey - 1 + top, 1, 1, line); R(x + 4, ey - 2 + top, 2, 1, line); } }
    R(x - 3, ey + 7, 6, 1, skD);
  };
  const eyeClosed = (x) => { R(x - 4, ey + 4, 1, 1, line); R(x - 3, ey + 3, 2, 2, line); R(x - 1, ey + 2, 3, 2, line); R(x + 2, ey + 3, 2, 2, line); R(x + 4, ey + 4, 1, 1, line); };
  const eyeWide = (x, side) => {
    R(x - 4, ey - 1, 8, 8, '#ffffff'); R(x - 1, ey + 1, 3, 4, iris); R(x, ey + 2, 1, 2, '#140e18'); R(x - 1, ey + 1, 1, 1, '#ffffff');
    R(x - 4, ey - 2, 8, 1, line); if (side < 0) R(x - 5, ey - 1, 1, 1, line); else R(x + 4, ey - 1, 1, 1, line);
  };
  for (const [x, side] of [[L, -1], [Rx, 1]]) {
    if (st === 'bald' && c.eye === '#d02020') { R(x - 4, ey + 1, 8, 4, '#f8f0f0'); R(x - 1, ey + 1, 3, 4, '#e02020'); R(x, ey + 1, 1, 4, '#200'); R(x - 4, ey, 8, 1, line); continue; }
    if (emo === 'smile') eyeClosed(x);
    else if (emo === 'smirk' || emo === 'angry') eyeOpen(x, side, 2);
    else if (emo === 'surprise') eyeWide(x, side);
    else eyeOpen(x, side, emo === 'blush' ? 1 : 0);
  }
  if (c.magicEye) { E(Rx, ey + 3, 6, 6, '#d8d8e0'); E(Rx, ey + 3, 4, 4, '#3a7ad8'); R(Rx - 1, ey + 2, 2, 2, '#111'); }
  // 코
  R(cx, 36, 1, 1, skD); R(cx + 1, 37, 1, 1, skS);
  if (st === 'bald') { R(cx - 2, 36, 1, 2, '#8a948a'); R(cx + 2, 36, 1, 2, '#8a948a'); }
  // 입
  const lip = c.female ? '#c8606a' : shade(sk, 0.62), dark = '#5a2028';
  if (emo === 'smile') { R(cx - 3, 40, 1, 1, lip); R(cx - 2, 41, 5, 2, dark); R(cx - 1, 42, 3, 1, '#e8808a'); R(cx + 3, 40, 1, 1, lip); }
  else if (emo === 'blush') { R(cx - 2, 41, 1, 1, lip); R(cx - 1, 42, 2, 1, lip); R(cx + 1, 41, 1, 1, lip); R(cx + 2, 42, 1, 1, lip); }
  else if (emo === 'smirk') { R(cx - 3, 42, 4, 1, lip); R(cx + 1, 41, 2, 1, lip); R(cx + 3, 40, 1, 1, lip); R(cx + 4, 39, 1, 1, skD); }
  else if (emo === 'surprise') { R(cx - 1, 40, 3, 4, dark); R(cx, 42, 1, 1, '#c04050'); }
  else if (emo === 'angry') { R(cx - 3, 41, 7, 3, dark); R(cx - 2, 41, 5, 1, '#f4f0f0'); }
  else if (emo === 'sad' || emo === 'cry') { R(cx - 3, 43, 1, 1, lip); R(cx - 2, 42, 5, 1, lip); R(cx + 3, 43, 1, 1, lip); }
  else R(cx - 2, 42, 4, 1, lip);
  // 볼, 눈물, 장식
  if (emo === 'blush' || (c.female && emo !== 'angry')) {
    const a = emo === 'blush' ? '#f2909a' : '#f6c0c4';
    R(19, 36, 6, 2, a); R(39, 36, 6, 2, a);
    if (emo === 'blush') for (let i = 0; i < 3; i++) { R(20 + i * 2, 35 + 0, 1, 1, '#e0707c'); R(40 + i * 2, 35, 1, 1, '#e0707c'); }
  }
  if (emo === 'cry') { R(L - 3, ey + 7, 2, 8, '#9ad8ff'); R(Rx + 2, ey + 7, 2, 9, '#9ad8ff'); R(L - 3, ey + 8, 1, 2, '#e8f8ff'); R(Rx + 2, ey + 8, 1, 2, '#e8f8ff'); }
  if (c.freckles) for (const [x, y] of [[21, 34], [23, 35], [25, 34], [39, 34], [41, 35], [43, 34]]) R(x, y, 1, 1, '#c87a50');
  if (c.scars) { R(20, 33, 7, 1, '#d8a090'); R(41, 22, 1, 8, '#d8a090'); }
  if (c.glasses) {
    const gc = '#2a2430';
    for (const x of [L, Rx]) { R(x - 5, ey - 2, 10, 1, gc); R(x - 5, ey + 8, 10, 1, gc); R(x - 6, ey - 1, 1, 9, gc); R(x + 5, ey - 1, 1, 9, gc); R(x - 4, ey - 1, 2, 1, '#ffffff55'); }
    R(L + 6, ey + 1, Rx - L - 11, 1, gc);
  }
  if (c.halfmoon) for (const x of [L, Rx]) { R(x - 5, ey + 3, 10, 1, '#d8b44a'); R(x - 5, ey + 4, 10, 4, '#d8b44a33'); R(x - 5, ey + 8, 10, 1, '#d8b44a'); }
  if (c.scar) { R(27, 15, 2, 1, '#c03838'); R(26, 16, 2, 1, '#c03838'); R(27, 17, 3, 1, '#c03838'); R(26, 18, 2, 1, '#c03838'); R(25, 19, 2, 1, '#c03838'); }
  if (c.bow) { E(22, 8, 5, 4, '#f088b8'); E(42, 8, 5, 4, '#f088b8'); E(cx, 9, 3, 3, '#d0609a'); }
  if (c.snake) { R(4, 50, 4, 14, '#3a6a3a'); E(6, 48, 4, 3, '#4a7a4a'); R(5, 47, 1, 1, '#d02020'); }
  if (c.hat) {
    const h = norm(c.hat);
    R(8, 12, 48, 3, h); R(8, 14, 48, 1, shade(h, 0.7));
    for (let i = 0; i < 13; i++) R(19 + i, 11 - i, 26 - i * 2, 1, h);
    for (let i = 0; i < 6; i++) R(31 + i * 2, 0 + i, 3, 1, h);
    R(20, 10, 24, 1, mix(h, '#ffffff', 0.25));
    if (c.name === '덤블도어') { R(24, 6, 2, 2, '#d8b44a'); R(36, 3, 2, 2, '#d8b44a'); R(30, 8, 1, 1, '#ffe28a'); }
  }
  g.globalAlpha = 1;
}
function drawSpecialPortrait(g, c, emo) {
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  const E = (cx, cy, rx, ry, col) => { g.fillStyle = col; for (let y = -ry; y <= ry; y++) { const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); g.fillRect(cx - hw, cy + y, hw * 2, 1); } };
  if (c.special === 'hat') {
    E(24, 40, 22, 6, '#5a3e22'); E(24, 30, 14, 12, '#6a4a2a'); for (let i = 0; i < 14; i++) R(18 + (i > 7 ? 4 : 0), 18 - i, 10 - (i > 7 ? 6 : i / 2 | 0), 1, '#6a4a2a');
    R(30, 4, 6, 3, '#5a3e22'); R(15, 27, 6, 2, '#2a1a0e'); R(27, 27, 6, 2, '#2a1a0e'); R(17, 35, 14, 2, '#2a1a0e'); R(19, 37, 10, 1, '#3a2614');
    R(10, 38, 6, 2, '#7a5a3a'); R(34, 33, 5, 3, '#4a3018'); R(28, 22, 8, 2, '#7a5a3a');
    return;
  }
  if (c.special === 'troll') { E(24, 26, 20, 20, '#8a9a7a'); E(24, 20, 14, 8, '#7a8a6a'); R(14, 20, 6, 3, '#300'); R(28, 20, 6, 3, '#300'); R(16, 34, 16, 3, '#3a2a1a'); R(18, 34, 2, 2, '#ddd'); R(28, 34, 2, 2, '#ddd'); return; }
  if (c.special === 'hippogriff') { E(24, 30, 18, 16, '#8a8a92'); E(24, 20, 12, 14, '#c8c8d0'); E(28, 16, 8, 6, '#e0e0e8'); R(30, 22, 14, 6, '#d8b44a'); R(40, 26, 4, 4, '#b8942a'); R(26, 16, 4, 4, '#d87a1e'); R(27, 17, 2, 2, '#111'); return; }
  if (c.special === 'owl') { E(24, 28, 16, 18, '#e8e0d0'); E(17, 22, 6, 6, '#fff'); E(31, 22, 6, 6, '#fff'); E(17, 22, 3, 3, '#d8a020'); E(31, 22, 3, 3, '#d8a020'); R(22, 28, 4, 4, '#8a6a2a'); return; }
}

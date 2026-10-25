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
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = clamp(Math.round(r * f), 0, 255); g = clamp(Math.round(g * f), 0, 255); b = clamp(Math.round(b * f), 0, 255);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

// ===== 타일 =====
const SOLID = new Set('VT#WkSRYUBtFbdPfwHKrLsxZOnQJehmavMjEc'.split(''));
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

// ===== 스프라이트 (16x20, 4방향 x 3프레임) =====
const SPR = {};
function getSprite(id) {
  if (SPR[id]) return SPR[id];
  const c = CHARS[id] || CHARS.student;
  const sheet = mk(16 * 3, 20 * 4), g = sheet.getContext('2d');
  // 방향 순서: 0 아래, 1 왼쪽, 2 오른쪽, 3 위
  for (const dir of [0, 1, 3]) for (let f = 0; f < 3; f++) {
    g.save(); g.translate(f * 16, dir * 20); drawSprite(g, c, dir, f); g.restore();
  }
  for (let f = 0; f < 3; f++) { // 오른쪽 = 왼쪽 반전
    g.save(); g.translate(f * 16 + 16, 2 * 20); g.scale(-1, 1); g.drawImage(sheet, f * 16, 20, 16, 20, 0, 0, 16, 20); g.restore();
  }
  // 커스텀 스프라이트 시트가 있으면 사용 (img/sprite/<id>.png, 48x80)
  const custom = Img.get('sprite/' + id + '.png');
  return (SPR[id] = custom || sheet);
}
function drawSprite(g, c, dir, f) {
  const P = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y + 4, w, h); };
  if (c.special) return drawSpecialSprite(g, c, dir, f, P);
  const skin = c.skin, hair = c.hair || skin, hd = c.hair2 || hair, robe = c.robe || '#20242b', trim = c.trim || '#777';
  const eye = '#1c1a22', boot = '#17161b';
  const ghost = c.ghost;
  if (ghost) g.globalAlpha = 0.75;
  g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(4, 18, 8, 2);
  if (c.style === 'elf') { // 도비: 작고 귀가 큼
    P(5, 9, 6, 5, robe); P(5, 9, 6, 1, c.trim);
    P(6, 14, 1, 2, skin); P(9, 14, 1, 2, skin);
    P(5, 3, 6, 6, skin);
    if (dir !== 3) { P(2, 4, 3, 2, skin); P(11, 4, 3, 2, skin); }
    if (dir === 0) { P(6, 5, 2, 2, c.eye); P(9, 5, 2, 2, c.eye); }
    if (dir === 1) { P(5, 5, 2, 2, c.eye); P(10, 4, 3, 2, skin); }
    return;
  }
  // 다리
  const lu = f === 1 ? 1 : 0, ru = f === 2 ? 1 : 0;
  if (dir === 1) { P(6, 14 - lu, 2, 2 + lu, boot); P(8, 14 - ru, 2, 2 + ru, boot); }
  else { P(5, 14 - lu, 2, 2 + lu, boot); P(9, 14 - ru, 2, 2 + ru, boot); }
  // 뒷머리 (몸통 뒤)
  if (dir === 0) {
    if (c.style === 'bushy' || c.style === 'curly' || c.style === 'hagrid') P(3, 1, 10, 9, hair);
    if (c.style === 'long' || c.style === 'longm' || c.style === 'updo') P(4, 2, 8, c.style === 'long' ? 9 : 7, hd);
  }
  // 몸통
  if (dir === 1) {
    P(5, 8, 6, 6, robe); P(7, 9 + (f ? 1 : 0), 2, 4, shade(robe, 0.75)); P(7, 13 + (f ? 0 : 0), 2, 1, skin);
  } else {
    P(4, 8, 8, 6, robe); P(3, 9, 1, 4, robe); P(12, 9, 1, 4, robe); P(3, 13, 1, 1, skin); P(12, 13, 1, 1, skin);
    if (dir === 0) { P(6, 8, 4, 1, '#e8e8ee'); P(7, 9, 2, 3, trim); if (c.female) P(4, 13, 8, 1, shade(robe, 0.7)); }
    else P(4, 8, 8, 1, shade(robe, 0.8));
  }
  if (c.bow && dir === 0) { P(6, 1, 4, 2, '#f088b8'); }
  // 머리
  const st = c.style;
  if (st === 'hood' || st === 'mask') {
    P(4, 1, 8, 8, robe);
    if (dir === 0) { P(5, 3, 6, 5, st === 'mask' ? c.skin : '#000'); P(6, 5, 1, 1, c.eye === '#111' ? '#000' : c.eye); P(9, 5, 1, 1, c.eye === '#111' ? '#000' : c.eye); }
    if (dir === 1) { P(4, 3, 4, 5, st === 'mask' ? c.skin : '#000'); P(5, 5, 1, 1, c.eye); }
    return;
  }
  if (st === 'turban') { // 퀴렐
    if (dir === 3) { P(4, 0, 8, 6, '#6a3a7a'); P(5, 6, 6, 2, skin); return; }
    P(5, 2, 6, 6, skin); P(4, 0, 8, 4, '#6a3a7a'); P(4, 1, 8, 1, '#8a5a9a');
    if (dir === 0) { P(6, 5, 1, 1, eye); P(9, 5, 1, 1, eye); } else P(5, 5, 1, 1, eye);
    return;
  }
  if (dir === 3) {
    if (st === 'bald') { P(5, 2, 6, 6, skin); return; }
    P(4, 1, 8, 7, hair); P(5, 1, 6, 1, hd);
    if (st === 'long' || st === 'longm' || st === 'greasy') P(4, 7, 8, 3 + (st === 'long' ? 2 : 0), hair);
    if (st === 'bushy' || st === 'curly' || st === 'hagrid') { P(3, 1, 10, 9, hair); P(4, 9, 8, 2, hd); }
    if (st === 'bun' ) P(6, -1, 4, 2, hair);
    if (st === 'updo') P(6, 0, 4, 2, hd);
    if (st === 'pigtail') { P(2, 5, 2, 4, hair); P(12, 5, 2, 4, hair); }
    if (c.hat) { P(3, 1, 10, 1, c.hat); P(5, -2, 6, 3, c.hat); P(6, -4, 4, 2, c.hat); P(7, -5, 2, 1, c.hat); }
    return;
  }
  if (dir === 0) {
    if (st === 'bushy' || st === 'curly' || st === 'hagrid') P(3, 1, 10, 5, hair);
    P(5, 2, 6, 6, skin);
    P(6, 5, 1, 1, eye); P(9, 5, 1, 1, eye);
    if (c.eye === '#d02020') { P(6, 5, 1, 1, '#d02020'); P(9, 5, 1, 1, '#d02020'); }
    if (c.female) { P(5, 5, 1, 1, eye); P(10, 5, 1, 1, eye); }
    if (st !== 'bald') {
      P(4, 1, 8, 2, hair); P(5, 3, 6, 1, hair);
      if (st === 'messy') { P(3, 1, 1, 2, hair); P(12, 2, 1, 2, hair); P(6, 0, 3, 1, hair); P(6, 4, 1, 1, hair); P(9, 4, 1, 1, hair); }
      if (st === 'long') { P(4, 3, 1, 8, hair); P(11, 3, 1, 8, hair); P(5, 1, 3, 1, c.hair2 === hair ? hair : '#ffffff55'); }
      if (st === 'longm' || st === 'greasy') { P(4, 3, 1, 6, hair); P(11, 3, 1, 6, hair); }
      if (st === 'bob') { P(4, 3, 1, 4, hair); P(11, 3, 1, 4, hair); }
      if (st === 'bun') P(6, 0, 4, 1, hair);
      if (st === 'updo') { P(6, 0, 4, 1, hd); P(4, 3, 1, 3, hair); P(11, 3, 1, 3, hair); }
      if (st === 'pigtail') { P(2, 4, 2, 4, hair); P(12, 4, 2, 4, hair); }
      if (st === 'beard' || st === 'hagrid') { P(5, 6, 6, 5, hair); P(6, 11, 4, 2, hair); }
    }
    if (c.glasses) { P(5, 5, 2, 1, '#2a2a2a'); P(9, 5, 2, 1, '#2a2a2a'); P(7, 5, 2, 1, '#2a2a2a'); }
    if (c.hat) { P(3, 1, 10, 1, c.hat); P(5, -2, 6, 3, c.hat); P(6, -4, 4, 2, c.hat); P(7, -5, 2, 1, c.hat); }
    return;
  }
  // 왼쪽
  if (st === 'bushy' || st === 'curly' || st === 'hagrid') P(5, 1, 8, 9, hair);
  if (st === 'long') P(8, 2, 4, 9, hair);
  P(4, 2, 6, 6, skin);
  P(5, 5, 1, 1, c.eye === '#d02020' ? '#d02020' : eye);
  if (st !== 'bald') {
    P(4, 1, 8, 2, hair); P(8, 3, 4, 4, hair); P(4, 3, 3, 1, hair);
    if (st === 'messy') { P(3, 1, 1, 2, hair); P(11, 0, 2, 1, hair); }
    if (st === 'longm' || st === 'greasy') P(8, 7, 4, 3, hair);
    if (st === 'bob') P(8, 7, 3, 1, hair);
    if (st === 'bun') P(10, 0, 3, 2, hair);
    if (st === 'updo') P(10, 0, 3, 2, hd);
    if (st === 'pigtail') P(11, 4, 2, 5, hair);
    if (st === 'beard' || st === 'hagrid') { P(3, 6, 5, 5, hair); }
  }
  if (c.glasses) P(4, 5, 3, 1, '#2a2a2a');
  if (c.hat) { P(3, 1, 10, 1, c.hat); P(5, -2, 6, 3, c.hat); P(6, -4, 4, 2, c.hat); P(7, -5, 2, 1, c.hat); }
  g.globalAlpha = 1;
}
function drawSpecialSprite(g, c, dir, f, P) {
  g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(3, 18, 10, 2);
  if (c.special === 'hat') { P(3, 10, 10, 4, '#6a4a2a'); P(5, 5, 6, 5, '#5a3e22'); P(7, 2, 3, 3, '#5a3e22'); P(9, 1, 2, 2, '#4a3018'); P(5, 8, 2, 1, '#2a1a0e'); P(9, 8, 2, 1, '#2a1a0e'); return; }
  if (c.special === 'owl') { P(5, 6, 6, 8, '#d8d0c0'); P(5, 6, 6, 1, '#a89880'); P(6, 8, 1, 1, '#d8a020'); P(9, 8, 1, 1, '#d8a020'); P(7, 10, 2, 1, '#8a6a2a'); return; }
  if (c.special === 'troll') { P(1, 2, 14, 14, c.skin); P(3, 4, 10, 4, shade(c.skin, 0.85)); P(5, 5, 2, 1, '#300'); P(9, 5, 2, 1, '#300'); P(0, 8, 2, 7, c.skin); P(14, 8, 2, 7, c.skin); P(2, 12, 12, 3, '#5a4a30'); return; }
  if (c.special === 'hippogriff') { P(2, 6, 12, 8, '#8a8a92'); P(2, 2, 5, 6, '#c8c8d0'); P(0, 4, 2, 2, '#d8b44a'); P(3, 3, 1, 1, '#d87a1e'); P(8, 4, 6, 3, '#9a9aa2'); P(3, 14, 2, 2, '#5a5a62'); P(11, 14, 2, 2, '#5a5a62'); return; }
}

// ===== 초상화 (48x48 → 2배 확대해 96x96으로 표시) =====
const PORTRAIT_EMOS = ['normal', 'smile', 'smirk', 'angry', 'sad', 'surprise', 'blush', 'cry'];
const POR = {};
function getPortrait(id, emo) {
  const key = id + '_' + emo;
  const custom = Img.get('portrait/' + key + '.png') || Img.get('portrait/' + id + '_normal.png');
  if (custom) return custom;
  if (POR[key]) return POR[key];
  const c = CHARS[id]; if (!c) return null;
  const cvs = mk(48, 48), g = cvs.getContext('2d');
  drawPortrait(g, c, emo);
  return (POR[key] = cvs);
}
function drawPortrait(g, c, emo) {
  const R = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  const E = (cx, cy, rx, ry, col, y0 = -99, y1 = 99) => {
    g.fillStyle = col;
    for (let y = -ry; y <= ry; y++) { if (cy + y < y0 || cy + y > y1) continue; const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry)))); g.fillRect(cx - hw, cy + y, hw * 2, 1); }
  };
  if (c.special) return drawSpecialPortrait(g, c, emo, R, E);
  if (c.ghost) g.globalAlpha = 0.8;
  const skin = c.skin, sk2 = shade(skin, 0.86), hair = c.hair || skin, hd = c.hair2 || shade(hair, 0.8);
  const robe = c.robe || '#20242b', trim = c.trim || '#777', st = c.style;
  const line = '#2a1e22', iris = c.eye || '#555';
  // 뒷머리
  if (st === 'long' || st === 'longm') { E(24, 22, 15, 16, hd); R(9, 22, 30, st === 'long' ? 24 : 16, hd); }
  if (st === 'updo') { E(24, 20, 14, 14, hd); }
  if (st === 'bushy' || st === 'curly' || st === 'hagrid') { E(24, 22, 20, 19, hd); E(24, 20, 19, 17, hair); for (let i = 0; i < 9; i++) E(6 + i * 4.5 | 0, 32 + (i % 2) * 3, 3, 4, i % 2 ? hd : hair); }
  if (st === 'greasy') { R(10, 12, 28, 24, hair); }
  if (st === 'bob') { E(24, 20, 15, 14, hair); R(9, 20, 30, 12, hair); }
  if (st === 'pigtail') { E(8, 30, 4, 9, hair); E(40, 30, 4, 9, hair); }
  if (st === 'hood' || st === 'mask') { E(24, 22, 17, 19, robe); R(7, 22, 34, 26, robe); }
  // 몸
  E(24, 50, 22, 12, robe); R(4, 42, 40, 6, robe);
  if (st !== 'hood' && st !== 'mask' && st !== 'elf') {
    R(18, 38, 12, 4, '#ecebf2'); R(19, 42, 10, 6, '#ecebf2');
    R(22, 39, 4, 9, trim); R(22, 41, 4, 1, shade(trim, 1.4)); R(22, 44, 4, 1, shade(trim, 1.4));
    R(14, 40, 4, 8, shade(robe, 0.7)); R(30, 40, 4, 8, shade(robe, 0.7));
    if (c.female) { R(18, 38, 3, 2, '#ecebf2'); R(27, 38, 3, 2, '#ecebf2'); }
  }
  if (st === 'elf') { R(8, 40, 32, 8, robe); R(8, 40, 32, 1, c.trim); }
  // 목, 얼굴
  R(20, 32, 8, 7, sk2);
  if (st === 'elf') { E(6, 22, 7, 3, skin); E(42, 22, 7, 3, skin); E(6, 22, 4, 1, sk2); E(42, 22, 4, 1, sk2); }
  else { R(12, 21, 3, 5, skin); R(33, 21, 3, 5, skin); }
  E(24, 22, 11, 12, skin);
  R(14, 30, 20, 2, skin);
  E(24, 33, 6, 2, skin);
  // 앞머리
  if (st === 'long') {
    E(24, 13, 13, 9, hair, 0, 16);
    R(11, 14, 3, 26, hair); R(34, 14, 3, 26, hair); R(13, 14, 2, 14, hair); R(33, 14, 2, 14, hair);
    for (const [x, h] of [[14, 5], [17, 4], [20, 6], [23, 3], [26, 5], [29, 4], [32, 6]]) R(x, 15, 3, h, hair);
    R(16, 7, 10, 1, '#ffffff'); R(14, 8, 3, 1, '#ffffffaa'); R(12, 20, 1, 14, hd); R(35, 20, 1, 14, hd);
  } else if (st === 'longm') {
    E(24, 13, 13, 9, hair, 0, 15); R(11, 14, 3, 20, hair); R(34, 14, 3, 20, hair);
    R(13, 14, 4, 4, hair); R(31, 14, 4, 4, hair); R(24, 6, 1, 8, hd); R(17, 7, 6, 1, '#ffffffaa');
  } else if (st === 'messy') {
    E(24, 13, 13, 8, hair, 0, 16);
    for (const [x, y, w, h] of [[10, 9, 3, 6], [35, 9, 3, 6], [12, 5, 4, 3], [30, 5, 5, 3], [18, 3, 5, 3], [25, 2, 4, 3], [14, 15, 4, 4], [19, 15, 3, 3], [27, 15, 3, 4], [31, 15, 4, 3]]) R(x, y, w, h, hair);
    R(20, 7, 6, 1, hd);
  } else if (st === 'short') {
    E(24, 13, 12, 8, hair, 0, 15); R(12, 12, 3, 8, hair); R(33, 12, 3, 8, hair);
    R(14, 15, 20, 2, hair); R(16, 17, 4, 1, hair); R(25, 17, 5, 1, hair); R(19, 7, 6, 1, hd);
  } else if (st === 'bushy' || st === 'curly') {
    E(24, 12, 14, 8, hair, 0, 17); R(11, 12, 4, 18, hair); R(33, 12, 4, 18, hair);
    for (let i = 0; i < 7; i++) E(14 + i * 3.4 | 0, 16 + (i % 2), 2, 2, i % 2 ? hd : hair);
  } else if (st === 'hagrid') {
    E(24, 12, 14, 8, hair, 0, 16); E(24, 34, 14, 10, hair); E(24, 30, 8, 3, hair); R(19, 31, 10, 2, '#a86a5a');
  } else if (st === 'greasy') {
    E(24, 13, 13, 8, hair, 0, 15); R(11, 13, 5, 23, hair); R(32, 13, 5, 23, hair); R(16, 14, 3, 8, hair); R(29, 14, 3, 8, hair); R(23, 6, 2, 9, hd);
  } else if (st === 'bun') {
    E(24, 13, 12, 8, hair, 0, 15); E(24, 4, 5, 4, hair); R(12, 13, 3, 6, hair); R(33, 13, 3, 6, hair); R(16, 14, 16, 1, hd);
  } else if (st === 'updo') {
    E(24, 13, 13, 8, hair, 0, 16); E(24, 4, 6, 4, hair); R(11, 13, 4, 14, hair); R(33, 13, 4, 14, hd); R(33, 13, 1, 14, hair); R(14, 15, 7, 3, hair); R(27, 15, 7, 3, hd);
  } else if (st === 'bob') {
    E(24, 13, 13, 8, hair, 0, 16); R(11, 13, 4, 18, hair); R(33, 13, 4, 18, hair); R(14, 15, 20, 3, hair);
  } else if (st === 'beard') {
    E(24, 13, 12, 7, hair, 0, 14); R(11, 14, 3, 14, hair); R(34, 14, 3, 14, hair);
    E(24, 36, 11, 12, hair); E(24, 30, 8, 2, hair); R(20, 29, 8, 1, hd); R(23, 31, 2, 2, '#a86a5a');
  } else if (st === 'pigtail') {
    E(24, 13, 13, 8, hair, 0, 16); R(14, 15, 20, 2, hair); R(12, 14, 3, 12, hair); R(33, 14, 3, 12, hair);
  } else if (st === 'turban') {
    E(24, 10, 14, 9, '#6a3a7a', 0, 16); for (let y = 4; y < 16; y += 3) R(11, y, 26, 1, '#8a5a9a');
  } else if (st === 'hood') {
    E(24, 22, 11, 12, '#050508'); E(24, 12, 15, 7, robe, 0, 16);
  } else if (st === 'mask') {
    E(24, 22, 11, 12, '#c8ccd0'); R(17, 21, 5, 3, '#111'); R(26, 21, 5, 3, '#111'); for (let i = 0; i < 4; i++) R(16 + i * 4, 28, 2, 1, '#8a8e94'); E(24, 12, 15, 7, robe, 0, 15);
  }
  if (st === 'hood' || st === 'mask') {
    if (st === 'hood') { R(18, 21, 3, 2, c.eye); R(27, 21, 3, 2, c.eye); }
    g.globalAlpha = 1; return;
  }
  // 눈썹
  const brow = st === 'long' || st === 'longm' ? shade(hair, 0.75) : shade(hair, 0.85);
  const L = 18, Rr = 30, ey = 22;
  if (emo === 'angry') { R(L - 3, 18, 2, 1, brow); R(L - 1, 19, 3, 1, brow); R(Rr - 1, 19, 3, 1, brow); R(Rr + 2, 18, 2, 1, brow); }
  else if (emo === 'sad' || emo === 'cry') { R(L - 3, 19, 3, 1, brow); R(L, 18, 2, 1, brow); R(Rr - 1, 18, 2, 1, brow); R(Rr + 1, 19, 3, 1, brow); }
  else if (emo === 'surprise') { R(L - 3, 16, 6, 1, brow); R(Rr - 3, 16, 6, 1, brow); }
  else if (emo === 'smirk') { R(L - 3, 18, 6, 1, brow); R(Rr - 3, 17, 6, 1, brow); }
  else { R(L - 3, 18, 6, 1, brow); R(Rr - 3, 18, 6, 1, brow); }
  // 눈
  const eyeOpen = (x) => {
    R(x - 3, ey - 1, 6, 4, '#ffffff'); R(x - 2, ey - 1, 4, 4, iris); R(x - 1, ey, 2, 2, shade(iris, 0.45)); R(x - 2, ey - 1, 1, 1, '#ffffff');
    R(x - 3, ey - 2, 6, 1, line); if (c.female) { R(x - 4, ey - 2, 1, 1, line); R(x + 3, ey - 3, 1, 2, line); }
  };
  const eyeClosed = (x) => { R(x - 3, ey + 1, 1, 1, line); R(x - 2, ey, 4, 1, line); R(x + 2, ey + 1, 1, 1, line); };
  const eyeHalf = (x) => { R(x - 3, ey, 6, 3, '#ffffff'); R(x - 2, ey, 4, 3, iris); R(x - 1, ey + 1, 2, 2, shade(iris, 0.45)); R(x - 3, ey - 1, 6, 1, line); if (c.female) R(x + 3, ey - 2, 1, 2, line); };
  const eyeWide = (x) => { R(x - 3, ey - 2, 6, 5, '#ffffff'); R(x - 1, ey - 1, 2, 3, iris); R(x - 3, ey - 3, 6, 1, line); };
  for (const x of [L, Rr]) {
    if (emo === 'smile') eyeClosed(x);
    else if (emo === 'smirk' || emo === 'angry') eyeHalf(x);
    else if (emo === 'surprise') eyeWide(x);
    else eyeOpen(x);
  }
  if (c.eye === '#d02020') { R(L - 1, ey, 2, 2, '#ff3030'); R(Rr - 1, ey, 2, 2, '#ff3030'); }
  if (c.magicEye) { E(Rr, ey + 1, 5, 5, '#d8d8e0'); E(Rr, ey + 1, 3, 3, '#3a7ad8'); R(Rr - 1, ey, 2, 2, '#111'); }
  // 코
  R(24, 26, 1, 2, sk2); if (st === 'bald') { R(22, 26, 1, 1, '#9aa09a'); R(25, 26, 1, 1, '#9aa09a'); }
  // 입
  const lip = c.female ? '#c86a6a' : '#a65a50', dark = '#5a2028';
  if (emo === 'smile' || emo === 'blush') { R(21, 29, 1, 1, lip); R(22, 30, 4, 1, lip); R(26, 29, 1, 1, lip); }
  else if (emo === 'smirk') { R(21, 30, 4, 1, lip); R(25, 29, 2, 1, lip); R(27, 28, 1, 1, lip); }
  else if (emo === 'surprise') { R(22, 29, 3, 3, dark); }
  else if (emo === 'angry') { R(21, 30, 6, 2, dark); R(22, 30, 4, 1, '#f0f0f0'); }
  else if (emo === 'sad' || emo === 'cry') { R(21, 31, 1, 1, lip); R(22, 30, 4, 1, lip); R(26, 31, 1, 1, lip); }
  else R(22, 30, 4, 1, lip);
  // 볼, 눈물, 장식
  if (emo === 'blush') { R(14, 25, 5, 2, '#f39aa0'); R(29, 25, 5, 2, '#f39aa0'); R(15, 25, 1, 1, '#fff6'); R(31, 25, 1, 1, '#fff6'); }
  if (emo === 'cry') { R(L - 3, ey + 3, 1, 5, '#8cd0ff'); R(Rr + 2, ey + 3, 1, 6, '#8cd0ff'); R(L - 3, ey + 8, 1, 1, '#c8ecff'); }
  if (c.freckles) for (const [x, y] of [[16, 26], [18, 27], [20, 26], [28, 26], [30, 27], [32, 26]]) R(x, y, 1, 1, '#c87a50');
  if (c.scars) { R(15, 24, 6, 1, '#d8a090'); R(29, 18, 1, 6, '#d8a090'); }
  if (c.glasses) {
    for (const x of [L, Rr]) { R(x - 4, ey - 3, 8, 1, '#222'); R(x - 4, ey + 3, 8, 1, '#222'); R(x - 5, ey - 2, 1, 5, '#222'); R(x + 4, ey - 2, 1, 5, '#222'); }
    R(22, ey - 1, 4, 1, '#222');
  }
  if (c.halfmoon) for (const x of [L, Rr]) { R(x - 4, ey + 1, 8, 1, '#d8b44a'); R(x - 4, ey + 2, 8, 1, '#d8b44a55'); }
  if (c.scar) { R(21, 12, 2, 1, '#c03838'); R(20, 13, 2, 1, '#c03838'); R(21, 14, 2, 1, '#c03838'); R(20, 15, 2, 1, '#c03838'); }
  if (c.bow) { R(16, 3, 6, 4, '#f088b8'); R(26, 3, 6, 4, '#f088b8'); R(22, 4, 4, 3, '#d0609a'); }
  if (c.snake) { R(4, 40, 3, 8, '#3a6a3a'); R(3, 38, 5, 3, '#4a7a4a'); }
  if (c.hat) {
    const h = c.hat;
    R(7, 10, 34, 3, h); for (let i = 0; i < 11; i++) R(14 + i, 9 - i, 20 - i * 2, 1, h);
    R(15, 8, 18, 1, shade(h, 1.3));
    if (c.name === '덤블도어') { R(18, 5, 2, 2, '#d8b44a'); R(27, 2, 2, 2, '#d8b44a'); }
  }
  g.globalAlpha = 1;
}
function drawSpecialPortrait(g, c, emo, R, E) {
  if (c.special === 'hat') {
    E(24, 40, 22, 6, '#5a3e22'); E(24, 30, 14, 12, '#6a4a2a'); for (let i = 0; i < 14; i++) R(18 + (i > 7 ? 4 : 0), 18 - i, 10 - (i > 7 ? 6 : i / 2 | 0), 1, '#6a4a2a');
    R(30, 4, 6, 3, '#5a3e22'); R(15, 27, 6, 2, '#2a1a0e'); R(27, 27, 6, 2, '#2a1a0e'); R(17, 35, 14, 2, '#2a1a0e'); R(19, 37, 10, 1, '#3a2614');
    R(10, 38, 6, 2, '#7a5a3a'); R(34, 33, 5, 3, '#4a3018');
    return;
  }
  if (c.special === 'troll') { E(24, 26, 20, 20, c.skin); R(14, 20, 6, 3, '#300'); R(28, 20, 6, 3, '#300'); R(16, 34, 16, 3, '#3a2a1a'); R(18, 34, 2, 2, '#ddd'); R(28, 34, 2, 2, '#ddd'); return; }
  if (c.special === 'hippogriff') { E(24, 30, 18, 16, '#8a8a92'); E(24, 20, 12, 14, '#c8c8d0'); R(30, 22, 14, 6, '#d8b44a'); R(40, 26, 4, 4, '#b8942a'); R(26, 16, 4, 4, '#d87a1e'); R(27, 17, 2, 2, '#111'); return; }
  if (c.special === 'owl') { E(24, 28, 16, 18, '#e8e0d0'); E(17, 22, 6, 6, '#fff'); E(31, 22, 6, 6, '#fff'); E(17, 22, 3, 3, '#d8a020'); E(31, 22, 3, 3, '#d8a020'); R(22, 28, 4, 4, '#8a6a2a'); return; }
}

'use strict';
// ===== 마법 시스템: 주문 / 시전 / 적 / 맵 퍼즐 / 자유 시간 =====

// motion: 지팡이 동작 (학습 미니게임에서 따라 하는 방향 입력)
const SPELLS = {
  lumos:       { name: '루모스', desc: '지팡이 끝에 빛을 밝힌다. 어둠을 비추고, 빛을 싫어하는 악마의 덫을 움츠러들게 한다. 다시 외우면 꺼진다.', type: 'self', col: '#fff6c0', motion: ['up'] },
  wingardium:  { name: '윙가르디움 레비오사', short: '윙가르디움', desc: '물체를 띄워 옮긴다. 바위를 밀어 옮기고, 트롤의 몽둥이를 띄워 떨어뜨린다.', type: 'bolt', col: '#c8e0ff', motion: ['right', 'down', 'up'] },
  flipendo:    { name: '플리펜도', desc: '밀쳐내기 주문. 바위를 밀고 적을 뒤로 날린다.', type: 'bolt', col: '#a0c8ff', dmg: 1, push: 1, motion: ['right', 'right'] },
  alohomora:   { name: '알로호모라', desc: '잠긴 문과 자물쇠 달린 상자를 연다.', type: 'bolt', col: '#ffe28a', motion: ['down', 'right', 'up'] },
  incendio:    { name: '인센디오', desc: '불꽃을 쏜다. 거미줄과 덩굴, 악마의 덫을 태우고 화로에 불을 붙인다.', type: 'bolt', col: '#ff8a3a', dmg: 2, motion: ['up', 'down', 'up'] },
  expelliarmus:{ name: '엑스펠리아르무스', short: '엑스펠리아르무스', desc: '무장해제 주문. 적의 지팡이를 날려 공격을 멈추게 한다.', type: 'bolt', col: '#ff4a4a', dmg: 1, disarm: 1, motion: ['left', 'right', 'down'] },
  immobulus:   { name: '이모빌러스', desc: '대상을 그 자리에 얼린다. 날아다니는 픽시에 특효.', type: 'bolt', col: '#9ae8ff', dmg: 1, freeze: 3, motion: ['down', 'down'] },
  reparo:      { name: '레파로', desc: '부서진 것을 고친다. 무너진 다리를 되살린다.', type: 'bolt', col: '#c8ffd8', motion: ['left', 'down', 'right', 'up'] },
  arania:      { name: '아라니아 엑숨아이', short: '아라니아', desc: '거미를 날려 버리는 주문. 거미에게 아주 강하다.', type: 'bolt', col: '#d8ff8a', dmg: 1, push: 2, motion: ['left', 'up', 'right'] },
  riddikulus:  { name: '리디큘러스', desc: '보가트를 우스운 모습으로 바꿔 물리친다. 웃음이 무기다.', type: 'bolt', col: '#ff9ad8', motion: ['up', 'left', 'down'] },
  patronus:    { name: '익스펙토 페트로눔', short: '패트로누스', desc: '은빛 수사슴을 불러낸다. 주변의 디멘터를 몰아내는 유일한 주문.', type: 'nova', col: '#e8f0ff', motion: ['up', 'right', 'down', 'left'] },
  accio:       { name: '아씨오', desc: '멀리 있는 물건을 끌어온다. 손이 닿지 않는 곳의 물건도 OK.', type: 'bolt', col: '#ffd8a0', motion: ['left', 'left'] },
  stupefy:     { name: '스투페파이', desc: '기절 주문. 대부분의 적에게 큰 피해를 주고 잠깐 멈춘다.', type: 'bolt', col: '#ff5a5a', dmg: 2, freeze: 1, motion: ['right', 'down', 'right'] },
  reducto:     { name: '리덕토', desc: '단단한 것을 산산조각 낸다. 금 간 벽을 부순다.', type: 'bolt', col: '#ffb0ff', dmg: 3, motion: ['down', 'up', 'down'] },
  diffindo:    { name: '디핀도', desc: '잘라내기 주문. 덩굴과 거미줄을 끊는다.', type: 'bolt', col: '#e8e8ff', dmg: 1, motion: ['left', 'right'] },
  aguamenti:   { name: '아구아멘티', desc: '물줄기를 쏜다. 불길을 끄고 화로를 끈다.', type: 'bolt', col: '#5ab0ff', motion: ['down', 'left', 'down'] },
  protego:     { name: '프로테고', desc: '방패 주문. 잠시 모든 공격을 막고 날아온 주문을 되튕긴다.', type: 'self', col: '#a0d8ff', motion: ['up', 'up'] },
  petrificus:  { name: '페트리피쿠스 토탈루스', short: '페트리피쿠스', desc: '전신 마비 주문. 적을 오랫동안 굳혀 버린다.', type: 'bolt', col: '#c0c0d8', dmg: 1, freeze: 6, motion: ['down', 'right', 'down', 'left'] },
  revelio:     { name: '레벨리오', desc: '주변에 숨겨진 문과 물건을 드러낸다.', type: 'self', col: '#ffe8ff', motion: ['right', 'up', 'left'] },
  levicorpus:  { name: '레비코르푸스', desc: '대상을 발목째 공중에 거꾸로 매단다. (혼혈왕자의 책에서 배운 주문)', type: 'bolt', col: '#d0a0ff', dmg: 1, freeze: 4, motion: ['up', 'down', 'down'] },
};
const SPELL_ORDER = Object.keys(SPELLS);

// 적: only = 이 주문들만 통함, weak = 그 주문으로 주는 피해량
const ENEMIES = {
  pixie:      { name: '콘월 픽시', hp: 2, speed: 62, dmg: 1, erratic: 1, weak: { immobulus: 3 } },
  spider:     { name: '아크로맨툴라', hp: 4, speed: 42, dmg: 1, weak: { arania: 6, incendio: 3 } },
  dementor:   { name: '디멘터', hp: 4, speed: 26, dmg: 1, only: ['patronus'], weak: { patronus: 4 }, float: 1 },
  boggart:    { name: '보가트', hp: 1, speed: 30, dmg: 1, only: ['riddikulus'], weak: { riddikulus: 9 } },
  troll:      { name: '트롤', hp: 3, speed: 20, dmg: 2, only: ['wingardium', 'stupefy'], weak: { wingardium: 3, stupefy: 1 } },
  skrewt:     { name: '폭탄꼬리 스크루트', hp: 5, speed: 24, dmg: 2, only: ['stupefy', 'reducto', 'incendio', 'petrificus', 'immobulus', 'levicorpus'], weak: { reducto: 4 } },
  deatheater: { name: '죽음을 먹는 자', hp: 4, speed: 30, dmg: 1, shoot: 2.4, keep: 1, weak: { stupefy: 3 } },
  bellatrix:  { name: '벨라트릭스', hp: 8, speed: 44, dmg: 1, shoot: 1.3, keep: 1, weak: { stupefy: 2 } },
  dummy:      { name: '연습용 표적', hp: 3, speed: 0, dmg: 0 },
};

// 타일에 주문을 쐈을 때의 변화 (F = 그 맵의 바닥)
const TILE_SPELL = {
  'X': { alohomora: 'D', msg: '찰칵! 자물쇠가 풀렸다.' },
  '&': { alohomora: '$', msg: '찰칵! 상자의 자물쇠가 열렸다.' },
  '%': { reducto: 'F', msg: '쾅! 금 간 벽이 무너졌다.' },
  'q': { incendio: 'F', diffindo: 'F', msg: '길을 막던 덩굴이 사라졌다.' },
  ';': { incendio: 'F', msg: '악마의 덫이 불에 타 움츠러들었다!' },
  '^': { aguamenti: 'F', msg: '치이익— 불길이 꺼졌다.' },
  'z': { reparo: '+', msg: '부서진 다리 조각들이 날아와 맞춰졌다!' },
  '!': { incendio: '*', msg: '화로에 불이 붙었다.' },
  '*': { aguamenti: '!', msg: '화로의 불이 꺼졌다.' },
  'o': { wingardium: 'push', flipendo: 'push', reducto: 'F' },
};

const CARDS = ['알버스 덤블도어', '멀린', '모르가나', '아그리파', '키르케', '파라켈수스', '니콜라스 플라멜', '헬가 후플푸프', '로위너 래번클로', '고드릭 그리핀도르', '살라자르 슬리데린', '클리오드나', '버티 보츠', '글래디스 거전'];

const Magic = {
  cd: 0, floats: [], fx: [], bolts: [], shield: 0, nova: null, hurtT: 0, lumosMsg: false,

  // --- 주문 습득 / 선택 ---
  known() { return SPELL_ORDER.filter(id => G.flags['sp_' + id]); },
  learn(id) {
    if (!SPELLS[id] || G.flags['sp_' + id]) return;
    G.flags['sp_' + id] = 1;
    if (!G.flags._cur) G.flags._cur = id;
    G.toasts.push({ text: `새 주문: ${SPELLS[id].name}`, col: '#c8f0ff', t: 3 });
    if (this.known().length === 1) G.toasts.push({ text: '✦ 버튼(C키)으로 시전 · ⇄(V키)로 주문 바꾸기', col: '#ffe28a', t: 6 });
    Snd.sfx('sparkle');
  },
  current() { const k = this.known(); if (!k.length) return null; if (!G.flags._cur || !G.flags['sp_' + G.flags._cur]) G.flags._cur = k[0]; return G.flags._cur; },
  cycle(d = 1) {
    const k = this.known(); if (k.length < 2) return;
    const i = k.indexOf(this.current());
    G.flags._cur = k[(i + d + k.length) % k.length]; Snd.sfx('sel');
  },

  // --- 탐험 시작 시 ---
  reset() {
    this.bolts = []; this.fx = []; this.floats = []; this.nova = null; this.shield = 0; this.cd = 0;
    G.hp = G.maxHp = 5; G.lumos = false;
  },
  addEnemy(type, x, y) {
    const d = ENEMIES[type]; if (!d || !G.ex) return;
    G.ex.enemies.push({ type, d, hp: d.hp, x: x * TS + 8, y: y * TS + 8, hx: x * TS + 8, hy: y * TS + 8, frz: 0, hit: 0, t: Math.random() * 9, shootT: 1 + Math.random() * 2, disarmed: 0, dir: 0 });
    G.flags.enemies = G.ex.enemies.length; G.ex.hadEnemies = true;
  },

  // --- 입력 & 시전 ---
  input() {
    if (Input.pressed.spell) this.cast();
    if (Input.pressed.swap) this.cycle(1);
  },
  cast() {
    const id = this.current();
    if (!id) { this.float('아직 아는 주문이 없다', '#c9d1e0'); return; }
    if (this.cd > 0) return;
    this.cd = 0.38;
    const S = SPELLS[id], p = G.ex.player;
    const cx = p.px + 8, cy = p.py + 2;
    this.float(S.name + '!', S.col);
    Snd.sfx('spell');
    if (S.type === 'self') {
      if (id === 'lumos') { G.lumos = !G.lumos; if (!G.lumos) this.float('녹스', '#9ab0d0'); this.burst(cx, cy, S.col, 10); }
      if (id === 'protego') { this.shield = 1.8; }
      if (id === 'revelio') this.revelio(p);
      return;
    }
    if (S.type === 'nova') { this.nova = { x: cx, y: cy, r: 4, hit: new Set() }; return; }
    const [dx, dy] = DV[p.dir];
    this.bolts.push({ x: cx, y: cy, vx: dx * 170, vy: dy * 170, id, life: 0.75, mine: true });
  },
  float(text, col) { const p = G.ex && G.ex.player; if (!p) return; this.floats.push({ text, col, x: p.px + 8, y: p.py - 12, t: 1.1 }); },
  floatAt(text, col, x, y) { this.floats.push({ text, col, x, y, t: 1.1 }); },
  burst(x, y, col, n = 8) { for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, s = rnd(20, 70); this.fx.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, t: rnd(0.3, 0.6), col }); } },

  // --- 맵 수정 (퍼즐) ---
  floorOf(m) { return m.floor || '.'; },
  setTile(m, x, y, ch) {
    if (ch === 'F') ch = this.floorOf(m);
    m.rows[y] = m.rows[y].slice(0, x) + ch + m.rows[y].slice(x + 1);
    const mods = G.flags._mods || (G.flags._mods = {});
    (mods[m.id] || (mods[m.id] = {}))[x + ',' + y] = ch;
    m.canvas = null;
    this.checkPuzzle(m);
  },
  checkPuzzle(m) {
    const pz = m.puzzle; if (!pz || G.flags['pz_' + m.id]) return;
    if (m.rows.some(r => r.includes('!'))) return;
    G.flags['pz_' + m.id] = 1;
    for (const [x, y, ch] of pz.set) this.setTile(m, x, y, ch);
    G.toasts.push({ text: pz.msg || '어디선가 철컥 소리가 났다.', col: '#ffe28a', t: 3 }); Snd.sfx('door');
  },
  applyMods(m) {
    const mods = (G.flags._mods || {})[m.id] || {};
    const sig = JSON.stringify(mods);
    if (m._sig === sig) return;
    m.rows = m.base.slice();
    for (const [k, ch] of Object.entries(mods)) { const [x, y] = k.split(',').map(Number); m.rows[y] = m.rows[y].slice(0, x) + ch + m.rows[y].slice(x + 1); }
    m._sig = sig; m.canvas = null;
  },
  tileHit(m, tx, ty, b) {
    const ch = tileAt(m, tx, ty), rule = TILE_SPELL[ch];
    if (!rule || !rule[b.id]) return false;
    const r = rule[b.id];
    if (r === 'push') return this.push(m, tx, ty, Math.sign(b.vx), Math.sign(b.vy));
    this.setTile(m, tx, ty, r);
    if (rule.msg) G.toasts.push({ text: rule.msg, col: '#ffe28a', t: 2.2 });
    if (ch === 'o' && b.id === 'reducto') G.toasts.push({ text: '바위가 산산조각 났다!', col: '#ffe28a', t: 2 });
    Snd.sfx(ch === 'X' || ch === '&' ? 'door' : 'sparkle');
    this.burst(tx * TS + 8, ty * TS + 8, SPELLS[b.id].col, 14);
    return true;
  },
  push(m, tx, ty, dx, dy) {
    const nx = tx + dx, ny = ty + dy, dest = tileAt(m, nx, ny);
    const blocked = (isSolid(m, nx, ny) && dest !== 'w') || G.ex.npcs.some(n => n.x === nx && n.y === ny) || (G.ex.player.x === nx && G.ex.player.y === ny);
    if (blocked) { this.floatAt('꿈쩍도 하지 않는다', '#c9d1e0', tx * TS + 8, ty * TS); return true; }
    this.setTile(m, tx, ty, 'F');
    if (dest === 'w') { this.setTile(m, nx, ny, '+'); G.toasts.push({ text: '바위가 물에 가라앉아 디딤돌이 되었다!', col: '#ffe28a', t: 2.4 }); }
    else this.setTile(m, nx, ny, 'o');
    Snd.sfx('door'); this.burst(nx * TS + 8, ny * TS + 8, '#c8e0ff', 10);
    return true;
  },
  revelio(p) {
    const m = G.ex.map; let n = 0;
    for (let y = p.y - 6; y <= p.y + 6; y++) for (let x = p.x - 6; x <= p.x + 6; x++) {
      if (tileAt(m, x, y) !== '?') continue;
      this.setTile(m, x, y, (m.hidden && m.hidden[x + ',' + y]) || 'D'); n++;
      this.burst(x * TS + 8, y * TS + 8, '#ffe8ff', 16);
    }
    G.toasts.push({ text: n ? '숨겨져 있던 것이 모습을 드러냈다!' : '주변엔 숨겨진 것이 없는 것 같다.', col: '#ffe8ff', t: 2.2 });
  },
  openChest(m, x, y) {
    const item = (m.chests && m.chests[x + ',' + y]) || 'card';
    this.setTile(m, x, y, '0'); Snd.sfx('sparkle');
    this.give(item);
  },
  give(item) {
    if (item === 'heal') { G.hp = G.maxHp; G.toasts.push({ text: '버티 보츠 젤리빈! 체력 회복', col: '#ff9ab8', t: 2.4 }); return; }
    if (item.startsWith('spell:')) {
      const id = item.slice(6);
      if (G.flags['sp_' + id]) { G.toasts.push({ text: `이미 아는 주문(${SPELLS[id].name})의 책이다`, col: '#c9d1e0', t: 2 }); return; }
      G.toasts.push({ text: `주문책 발견: ${SPELLS[id].name}`, col: '#c8f0ff', t: 2.5 });
      G.mode = 'mini'; const back = G.ex ? 'explore' : 'idle';
      Mini.start('learn', id, () => { this.learn(id); G.mode = back; if (G.music) { Snd.cur = null; Snd.music(G.music); } });
      return;
    }
    // 개구리 초콜릿 카드
    const got = (G.flags._cards || '').split('|').filter(Boolean);
    const left = CARDS.filter(c => !got.includes(c));
    const c = left.length ? left[Math.floor(Math.random() * left.length)] : null;
    if (c) { got.push(c); G.flags._cards = got.join('|'); }
    G.hp = Math.min(G.maxHp, G.hp + 2);
    G.toasts.push({ text: c ? `개구리 초콜릿 카드: ${c} (${got.length}/${CARDS.length})` : '개구리 초콜릿! (체력 회복)', col: '#ffd08a', t: 3 });
  },

  // --- 매 프레임 ---
  update(dt) {
    const e = G.ex; if (!e) return;
    const m = e.map, p = e.player;
    if (this.cd > 0) this.cd -= dt; if (this.shield > 0) this.shield -= dt; if (this.hurtT > 0) this.hurtT -= dt;
    for (const f of this.floats) { f.t -= dt; f.y -= dt * 14; } this.floats = this.floats.filter(f => f.t > 0);
    for (const f of this.fx) { f.t -= dt; f.x += f.vx * dt; f.y += f.vy * dt; f.vx *= 0.92; f.vy *= 0.92; } this.fx = this.fx.filter(f => f.t > 0);
    // 루모스: 가까운 악마의 덫이 움츠러든다
    if (G.lumos) for (const [dx, dy] of [[0, 1], [1, 0], [-1, 0], [0, -1]]) if (tileAt(m, p.x + dx, p.y + dy) === ';') { this.setTile(m, p.x + dx, p.y + dy, 'F'); if (!this.lumosMsg) { this.lumosMsg = true; G.toasts.push({ text: '악마의 덫이 빛을 피해 움츠러들었다!', col: '#fff6c0', t: 2.4 }); } }
    // 패트로누스 파동
    if (this.nova) {
      const n = this.nova; n.r += dt * 150;
      for (const en of e.enemies) if (!n.hit.has(en) && Math.hypot(en.x - n.x, en.y - n.y) < n.r) { n.hit.add(en); this.hitEnemy(en, 'patronus', (en.x - n.x) / (n.r || 1), (en.y - n.y) / (n.r || 1)); }
      if (n.r > 84) this.nova = null;
    }
    // 주문 탄
    for (const b of this.bolts) {
      const steps = 4;
      for (let i = 0; i < steps && b.life > 0; i++) {
        b.x += b.vx * dt / steps; b.y += b.vy * dt / steps;
        const tx = Math.floor(b.x / TS), ty = Math.floor((b.y + 6) / TS);
        if (b.mine) {
          const en = e.enemies.find(en => Math.hypot(en.x - b.x, en.y - b.y - 4) < 10);
          if (en) { this.hitEnemy(en, b.id, Math.sign(b.vx), Math.sign(b.vy)); b.life = 0; break; }
          if (b.id === 'accio') { const it = (e.items || []).find(it => Math.hypot(it.x - b.x, it.y - b.y) < 10); if (it) { it.pull = 1; b.life = 0; break; } }
        } else if (Math.hypot(p.px + 8 - b.x, p.py + 4 - b.y) < 8) {
          if (this.shield > 0) { b.vx = -b.vx * 1.3; b.vy = -b.vy * 1.3; b.mine = true; b.id = 'stupefy'; b.life = 0.8; this.floatAt('튕겨 냈다!', '#a0d8ff', b.x, b.y - 8); continue; }
          this.hurt(1); b.life = 0; break;
        }
        if (isSolid(m, tx, ty) && tileAt(m, tx, ty) !== 'w') {
          if (b.mine) this.tileHit(m, tx, ty, b);
          this.burst(b.x, b.y, b.mine ? SPELLS[b.id].col : '#ff3030', 5); b.life = 0; break;
        }
      }
      b.life -= dt;
    }
    this.bolts = this.bolts.filter(b => b.life > 0);
    // 끌어오는 물건
    for (const it of (e.items || [])) {
      if (it.pull) { const a = Math.atan2(p.py + 8 - it.y, p.px + 8 - it.x); it.x += Math.cos(a) * 140 * dt; it.y += Math.sin(a) * 140 * dt; }
      if (Math.hypot(p.px + 8 - it.x, p.py + 8 - it.y) < 10) { it.got = 1; G.flags['item_' + it.key] = 1; this.give(it.item); }
    }
    if (e.items) e.items = e.items.filter(it => !it.got);
    // 적
    for (const en of e.enemies) this.updateEnemy(en, dt, m, p);
    const before = e.enemies.length;
    e.enemies = e.enemies.filter(en => en.hp > 0);
    G.flags.enemies = e.enemies.length;
    if (before && !e.enemies.length) G.toasts.push({ text: '주변이 조용해졌다.', col: '#9ad0b0', t: 2 });
  },
  hitEnemy(en, id, dx, dy) {
    const S = SPELLS[id], d = en.d;
    if (d.only && !d.only.includes(id)) { this.floatAt('효과가 없다!', '#9ab0d0', en.x, en.y - 18); Snd.sfx('no'); return; }
    let dmg = d.weak && d.weak[id] !== undefined ? d.weak[id] : (S.dmg || 0);
    if (id === 'wingardium' && en.type !== 'troll') dmg = 0;
    if (S.freeze) en.frz = Math.max(en.frz, S.freeze);
    if (S.disarm && d.shoot) { en.disarmed = 1; this.floatAt('지팡이를 빼앗았다!', '#ffe28a', en.x, en.y - 26); }
    if (S.push || id === 'flipendo') { const k = 14 * (S.push || 1); this.moveEnemy(en, dx * k, dy * k, G.ex.map); }
    if (en.type === 'troll' && id === 'wingardium') this.floatAt('몽둥이가 떠올랐다가 머리 위로—쿵!', '#c8e0ff', en.x, en.y - 30);
    if (en.type === 'boggart' && id === 'riddikulus') this.floatAt('푸핫! 우스꽝스러운 모습이 됐다!', '#ff9ad8', en.x, en.y - 30);
    if (dmg > 0) { en.hp -= dmg; en.hit = 0.2; this.floatAt('-' + dmg, '#ffe28a', en.x, en.y - 18); Snd.sfx('hit'); }
    this.burst(en.x, en.y, S.col, 10);
    if (en.hp <= 0) { this.burst(en.x, en.y, '#ffffff', 18); if (Math.random() < 0.35) (G.ex.items || (G.ex.items = [])).push({ x: en.x, y: en.y, item: 'heal', key: 'drop' + Math.random() }); }
  },
  moveEnemy(en, dx, dy, m) {
    const nx = en.x + dx, ny = en.y + dy;
    if (en.d.float || !isSolid(m, Math.floor(nx / TS), Math.floor(en.y / TS))) en.x = nx;
    if (en.d.float || !isSolid(m, Math.floor(en.x / TS), Math.floor(ny / TS))) en.y = ny;
  },
  updateEnemy(en, dt, m, p) {
    en.t += dt; if (en.hit > 0) en.hit -= dt;
    if (en.frz > 0) { en.frz -= dt; return; }
    const d = en.d, px = p.px + 8, py = p.py + 8;
    const dist = Math.hypot(px - en.x, py - en.y);
    if (d.speed && dist < 150) {
      let ang = Math.atan2(py - en.y, px - en.x);
      if (d.erratic) ang += Math.sin(en.t * 5) * 1.2;
      let sp = d.speed;
      if (d.keep && dist < 56) sp = -d.speed * 0.6;
      if (d.keep && dist < 80 && dist >= 56) sp = 0;
      // 패트로누스의 빛 근처에선 디멘터가 물러남
      this.moveEnemy(en, Math.cos(ang) * sp * dt, Math.sin(ang) * sp * dt, m);
      en.dir = Math.abs(px - en.x) > Math.abs(py - en.y) ? (px > en.x ? 2 : 1) : (py > en.y ? 0 : 3);
    }
    if (d.shoot && !en.disarmed && dist < 170) {
      en.shootT -= dt;
      if (en.shootT <= 0) {
        en.shootT = d.shoot;
        const a = Math.atan2(py - en.y, px - en.x);
        this.bolts.push({ x: en.x, y: en.y - 4, vx: Math.cos(a) * 115, vy: Math.sin(a) * 115, id: 'stupefy', life: 1.6, mine: false });
      }
    }
    if (d.dmg && dist < 11) this.hurt(d.dmg, en.type === 'dementor');
  },
  hurt(n, drain) {
    if (this.hurtT > 0 || TEST) return;
    if (this.shield > 0) { this.floatAt('막았다!', '#a0d8ff', G.ex.player.px + 8, G.ex.player.py - 10); this.hurtT = 0.4; return; }
    G.hp -= n; this.hurtT = 1.0; G.shake = 0.2; Snd.sfx('hit');
    if (drain) G.toasts.push({ text: '온몸이 얼어붙는다… 행복한 기억이 빠져나간다', col: '#9ab0d0', t: 1.6 });
    if (G.hp <= 0) {
      const e = G.ex, s = e.start;
      G.toasts.push({ text: '정신을 잃었다… 다시 일어선다', col: '#ff9ab8', t: 2.6 });
      e.player.x = s.x; e.player.y = s.y; e.player.px = s.x * TS; e.player.py = s.y * TS; e.player.moving = 0;
      G.hp = G.maxHp; this.bolts = []; G.fade = 1; G.fadeDir = -1; updateCam(true);
    }
  },

  // --- 그리기 ---
  drawWorld(ox, oy) {
    const e = G.ex; if (!e) return;
    const t = performance.now() / 1000;
    for (const it of (e.items || [])) { const y = it.y + oy + Math.sin(t * 4) * 2; ctx.fillStyle = it.item === 'heal' ? '#ff9ab8' : '#ffd08a'; ctx.fillRect(Math.round(it.x + ox - 3), Math.round(y - 3), 6, 6); ctx.fillStyle = '#fff'; ctx.fillRect(Math.round(it.x + ox - 2), Math.round(y - 2), 2, 2); }
    for (const en of e.enemies) this.drawEnemy(en, ox, oy, t);
    // 목표 표시
    for (const tg of (e.targets || [])) { const bob = Math.sin(t * 5) * 2; drawStar(tg.x * TS + 8 + ox, tg.y * TS - 6 + oy + bob, '#ffe28a'); }
    for (const b of this.bolts) {
      const col = b.mine ? SPELLS[b.id].col : '#ff3a3a';
      ctx.fillStyle = col; ctx.globalAlpha = 0.35; ctx.fillRect(Math.round(b.x + ox - b.vx * 0.03 - 2), Math.round(b.y + oy - b.vy * 0.03 - 2), 4, 4); ctx.globalAlpha = 1;
      ctx.fillRect(Math.round(b.x + ox - 3), Math.round(b.y + oy - 3), 6, 6); ctx.fillStyle = '#fff'; ctx.fillRect(Math.round(b.x + ox - 1), Math.round(b.y + oy - 1), 2, 2);
    }
    for (const f of this.fx) { ctx.globalAlpha = Math.min(1, f.t * 3); ctx.fillStyle = f.col; ctx.fillRect(Math.round(f.x + ox), Math.round(f.y + oy), 2, 2); } ctx.globalAlpha = 1;
    const p = e.player;
    if (this.shield > 0) { ctx.strokeStyle = `rgba(160,216,255,${0.4 + 0.3 * Math.sin(t * 20)})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.px + 8 + ox, p.py + 4 + oy, 14, 0, 6.28); ctx.stroke(); }
    if (this.nova) { const n = this.nova; ctx.strokeStyle = 'rgba(232,240,255,.8)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(n.x + ox, n.y + oy, n.r, 0, 6.28); ctx.stroke(); drawStag(n.x + ox + Math.min(n.r, 40), n.y + oy); }
  },
  drawEnemy(en, ox, oy, t) {
    const x = Math.round(en.x + ox), y = Math.round(en.y + oy);
    if (en.hit > 0 && Math.floor(t * 30) % 2) return;
    const R = (a, b, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x + a, y + b, w, h); };
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(x - 6, y + 6, 12, 3);
    const k = en.type;
    if (k === 'pixie') { const fl = Math.sin(t * 30) > 0; R(-3, -10, 6, 7, '#3a7ad8'); R(-2, -9, 4, 2, '#5a9af8'); R(-2, -7, 1, 1, '#fff'); R(1, -7, 1, 1, '#fff'); R(fl ? -8 : -7, -12, 5, 3, '#c8e8ff'); R(fl ? 3 : 2, -12, 5, 3, '#c8e8ff'); R(-1, -3, 2, 3, '#2a5aa8'); }
    else if (k === 'spider') { R(-6, -6, 12, 8, '#2a2420'); R(-4, -9, 8, 4, '#3a3028'); R(-3, -8, 1, 1, '#ff3030'); R(2, -8, 1, 1, '#ff3030'); for (let i = 0; i < 4; i++) { const l = Math.sin(t * 12 + i) > 0 ? 1 : 0; R(-10, -5 + i * 2 + l, 4, 1, '#1a1410'); R(6, -5 + i * 2 - l, 4, 1, '#1a1410'); } }
    else if (k === 'skrewt') { R(-7, -6, 14, 9, '#8a7a5a'); R(-7, -6, 14, 2, '#a89a72'); R(5, -9, 4, 4, '#c87a3a'); if (Math.sin(t * 8) > 0.6) R(8, -11, 3, 3, '#ffd23a'); R(-6, 3, 2, 2, '#5a4a3a'); R(4, 3, 2, 2, '#5a4a3a'); }
    else if (k === 'dummy') { R(-1, -2, 2, 10, '#6a4426'); R(-6, -14, 12, 12, '#d8c8a0'); R(-4, -12, 8, 8, '#c84040'); R(-2, -10, 4, 4, '#f0e8d8'); }
    else {
      const id = k === 'dementor' || k === 'boggart' ? 'hooded' : k;
      if (k === 'dementor') ctx.globalAlpha = 0.85;
      const sh = getSprite(id), f = Math.floor(t * 4) % 3;
      ctx.drawImage(sh, (k === 'dementor' ? 0 : f) * SPR_W, en.dir * SPR_H, SPR_W, SPR_H, x - 8, y - 18 + (en.d.float ? Math.sin(t * 3) * 2 : 0), k === 'troll' ? 20 : SPR_W, k === 'troll' ? 30 : SPR_H);
      ctx.globalAlpha = 1;
    }
    if (en.frz > 0) { ctx.strokeStyle = 'rgba(154,232,255,.8)'; ctx.lineWidth = 1; ctx.strokeRect(x - 8, y - 18, 16, 24); }
    if (en.hp < en.d.hp) { R(-7, -22, 14, 2, '#300'); R(-7, -22, Math.max(1, Math.round(14 * en.hp / en.d.hp)), 2, '#e84a4a'); }
  },
  // 어두운 맵: 시야 원 (루모스/패트로누스/불빛이 넓혀 줌)
  drawDark(ox, oy) {
    const e = G.ex; if (!e || !e.map.dark) return;
    const c = this._dk || (this._dk = mk(W, H)), g = c.getContext('2d');
    g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
    g.fillStyle = 'rgba(2,3,10,.93)'; g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'destination-out';
    const hole = (x, y, r) => { const gr = g.createRadialGradient(x, y, r * 0.35, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); };
    const p = e.player, t = performance.now() / 1000;
    hole(p.px + 8 + ox, p.py + 4 + oy, (G.lumos ? 92 : 30) + Math.sin(t * 6) * 2);
    if (this.nova) hole(this.nova.x + ox, this.nova.y + oy, this.nova.r + 30);
    for (const L of (e.map.lights || [])) hole(L.x + ox, L.y + oy, L.r * 0.9);
    for (let y = 0; y < e.map.h; y++) for (let x = 0; x < e.map.w; x++) if (e.map.rows[y][x] === '*') hole(x * TS + 8 + ox, y * TS + 6 + oy, 52);
    for (const b of this.bolts) hole(b.x + ox, b.y + oy, 22);
    ctx.drawImage(c, 0, 0);
  },
  drawHud() {
    const id = this.current(); if (!G.ex || G.mode !== 'explore') return;
    const name = id ? SPELLS[id].name : '주문 없음', col = id ? SPELLS[id].col : '#777';
    const w = tw(name) + 34;
    panel(4, H - 24, w, 20, 0.85);
    ctx.fillStyle = col; ctx.fillRect(10, H - 18, 8, 8); ctx.fillStyle = '#fff'; ctx.fillRect(12, H - 16, 2, 2);
    txt(name, 24, H - 21, col);
    if (this.cd > 0) { ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(5, H - 23, (w - 2) * (this.cd / 0.38), 18); }
    const kn = this.known().length;
    if (kn > 1) txt('⇄', w + 8, H - 21, '#9ab0d0');
    // 체력
    if (G.ex.enemies.length || G.hp < G.maxHp || G.ex.map.dark) for (let i = 0; i < G.maxHp; i++) drawHeart(8 + i * 12, (G.goalH || 4) + 2, i < G.hp);
    if (G.ex.roam) txt('자유 시간 · 문으로 다른 장소에 갈 수 있다', W / 2, H - 38, '#9ad0b0aa', 'center');
  },
  drawFloats(ox, oy) {
    for (const f of this.floats) { ctx.globalAlpha = Math.min(1, f.t * 2); txt(f.text, f.x + ox, f.y + oy, f.col, 'center'); } ctx.globalAlpha = 1;
  },
};
function drawStar(x, y, col) { x = Math.round(x); y = Math.round(y); ctx.fillStyle = col; ctx.fillRect(x - 1, y - 4, 2, 8); ctx.fillRect(x - 4, y - 1, 8, 2); ctx.fillStyle = '#fff'; ctx.fillRect(x - 1, y - 1, 2, 2); }
function drawHeart(x, y, on) { const c = on ? '#ff5a7a' : '#3a2a30'; ctx.fillStyle = c; ctx.fillRect(x, y + 1, 4, 3); ctx.fillRect(x + 5, y + 1, 4, 3); ctx.fillRect(x + 1, y, 2, 1); ctx.fillRect(x + 6, y, 2, 1); ctx.fillRect(x + 1, y + 4, 7, 2); ctx.fillRect(x + 3, y + 6, 3, 2); if (on) { ctx.fillStyle = '#ffc0cc'; ctx.fillRect(x + 1, y + 1, 1, 1); } }
function drawStag(x, y) { ctx.fillStyle = 'rgba(232,240,255,.85)'; const R = (a, b, w, h) => ctx.fillRect(Math.round(x + a), Math.round(y + b), w, h); R(-6, -4, 12, 6); R(4, -9, 4, 6); R(6, -14, 1, 5); R(8, -13, 1, 4); R(3, -14, 1, 4); R(-5, 2, 2, 6); R(3, 2, 2, 6); }

// ===== 호그와트 자유 시간: 맵 연결 =====
// (x,y)의 문을 밟으면 to 맵의 (tx,ty)로 이동 (자유 시간에만)
const MAP_LINKS = {
  corridor: [
    { x: 0, y: 5, to: 'gryff', tx: 9, ty: 8, dir: 'up' },
    { x: 29, y: 5, to: 'grounds', tx: 10, ty: 2, dir: 'down' },
    { x: 6, y: 1, to: 'library', tx: 9, ty: 8, dir: 'up' },
    { x: 24, y: 1, to: 'bathroom', tx: 7, ty: 7, dir: 'up' },
    { x: 6, y: 9, to: 'hall', tx: 12, ty: 13, dir: 'up' },
    { x: 19, y: 9, to: 'classroom', tx: 9, ty: 8, dir: 'up' },
    { x: 13, y: 9, to: 'secret', tx: 7, ty: 7, dir: 'up' },
  ],
  gryff: [{ x: 9, y: 9, to: 'corridor', tx: 1, ty: 5, dir: 'right' }],
  hall: [{ x: 12, y: 14, to: 'corridor', tx: 6, ty: 8, dir: 'down' }, { x: 13, y: 14, to: 'corridor', tx: 6, ty: 8, dir: 'down' }],
  library: [{ x: 9, y: 9, to: 'corridor', tx: 6, ty: 2, dir: 'down' }],
  bathroom: [{ x: 7, y: 8, to: 'corridor', tx: 24, ty: 2, dir: 'down' }],
  classroom: [{ x: 9, y: 9, to: 'corridor', tx: 19, ty: 8, dir: 'up' }],
  secret: [{ x: 7, y: 8, to: 'corridor', tx: 13, ty: 8, dir: 'up' }],
  grounds: [{ x: 10, y: 1, to: 'corridor', tx: 28, ty: 5, dir: 'left' }, { x: 6, y: 14, to: 'forest', tx: 16, ty: 12, dir: 'up' }],
  forest: [{ x: 16, y: 13, to: 'grounds', tx: 7, ty: 13, dir: 'up' }],
};
// 자유 시간마다 늘 있는 배경 인물과 소소한 대사 (라벨 없이 바로 말함)
const ROAM_CHATTER = {
  gryff: [['student3', 4, 4, 'down', '그리핀도르 학생: 뚱뚱한 귀부인 초상화가 또 노래 연습 중이야. 귀가 아파.']],
  library: [['student2', 13, 6, 'left', '레번클로 학생: 쉿. 금서 구역 옆 자물쇠 상자, 알로호모라로 열린다는 소문이 있어.']],
  hall: [['student', 6, 9, 'left', '후플푸프 학생: 오늘 저녁은 스테이크 앤드 키드니 파이래!']],
  grounds: [['student3', 18, 6, 'left', '학생: 호수 위 작은 섬에 상자가 있대. 다리가 무너져서 아무도 못 갔지만.']],
  corridor: [['student2', 15, 6, 'up', '학생: 이 복도 아래쪽 벽… 가끔 문이 보였다 안 보였다 한대. 레벨리오 같은 걸로 찾을 수 있으려나?']],
};

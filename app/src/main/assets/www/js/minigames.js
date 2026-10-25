'use strict';
// ===== 미니게임 =====
// 공통: Mini.start(type, variant, done) → done('win' | 'lose')
const Mini = {
  cur: null,
  start(type, variant, done) {
    const def = MINIS[type];
    if (!def) { console.error('unknown minigame', type); done('win'); return; }
    if (TEST) { done('win'); return; }
    const m = { type, variant, t: 0, phase: 'intro', pt: 0, result: null, done };
    def.init(m, variant);
    this.cur = m;
  },
  update(dt) {
    const m = this.cur; if (!m) return;
    m.t += dt; m.pt += dt;
    if (m.phase === 'intro') { if (m.pt > 1.6) { m.phase = 'play'; m.pt = 0; } }
    else if (m.phase === 'play') MINIS[m.type].update(m, dt);
    else if (m.phase === 'end') {
      if (m.pt > 1.8 || (m.pt > 0.6 && Input.ok())) { const d = m.done, r = m.result; this.cur = null; d(r); }
    }
  },
  finish(m, r) { if (m.phase !== 'play') return; m.result = r; m.phase = 'end'; m.pt = 0; Snd.sfx(r === 'win' ? 'sparkle' : 'no'); },
  draw() {
    const m = this.cur; if (!m) return;
    MINIS[m.type].draw(m);
    if (m.phase === 'intro') {
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 80, W, 56);
      bigTxt(m.title || '', W / 2, 86, 2, '#f1ecd2');
      txt(m.help || '', W / 2, 118, '#c9d1e0', 'center');
    } else if (m.phase === 'end') {
      ctx.fillStyle = 'rgba(0,0,0,.55)'; ctx.fillRect(0, 84, W, 48);
      bigTxt(m.result === 'win' ? (m.winText || '성공!') : (m.loseText || '실패…'), W / 2, 92, 2, m.result === 'win' ? '#ffe28a' : '#9ab0d0');
    }
  },
};

function drawArrow(x, y, dir, col, s = 1) {
  ctx.fillStyle = col;
  for (let i = 0; i < 6; i++) {
    const w = (i * 2 + 1) * s, l = 6 * s;
    if (dir === 'up') ctx.fillRect(x - w / 2, y - l + i * s * 2 - 2, w, s * 2);
    if (dir === 'down') ctx.fillRect(x - w / 2, y + l - i * s * 2, w, s * 2);
    if (dir === 'left') ctx.fillRect(x - l + i * s * 2 - 2, y - w / 2, s * 2, w);
    if (dir === 'right') ctx.fillRect(x + l - i * s * 2, y - w / 2, s * 2, w);
  }
}
function drawChar(id, x, y, dir = 0, frame = 0, scale = 1) {
  const sh = getSprite(id);
  ctx.drawImage(sh, frame * SPR_W, dir * SPR_H, SPR_W, SPR_H, Math.round(x - 8 * scale), Math.round(y - SPR_H * scale), SPR_W * scale, SPR_H * scale);
}
function skyBg(t, top = '#3a6ab0', bot = '#9ac8f0', clouds = true) {
  const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, top); gr.addColorStop(1, bot);
  ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  if (!clouds) return;
  ctx.fillStyle = 'rgba(255,255,255,.75)';
  for (let i = 0; i < 6; i++) {
    const x = ((i * 97 - t * (14 + i * 4)) % (W + 80) + W + 80) % (W + 80) - 40, y = 20 + i * 27 % 120;
    ctx.fillRect(x, y, 34, 6); ctx.fillRect(x + 6, y - 4, 20, 4);
  }
}
function broomRider(id, x, y, t, passenger) {
  const bob = Math.round(Math.sin(t * 6) * 1.5);
  ctx.fillStyle = '#6a4426'; ctx.fillRect(x - 14, y + bob - 3, 26, 2);
  ctx.fillStyle = '#c8a050'; ctx.fillRect(x - 20, y + bob - 5, 7, 6);
  if (passenger) drawChar(passenger, x - 7, y + bob, 2, 0);
  drawChar(id, x, y + bob, 2, 0);
}

const MINIS = {
  // --- 빗자루 비행 ---
  flight: {
    init(m, v) {
      m.px = 70; m.py = 110; m.stun = 0; m.hp = 3; m.obs = []; m.spawn = 0;
      if (v === 'remembrall') { m.title = '기억구슬을 잡아라!'; m.help = '방향키로 날아서 떨어지는 구슬에 닿기'; m.ball = { x: 300, y: 24, vx: -18, vy: 6 }; m.winText = '잡았다!'; }
      if (v === 'snitch') { m.title = '골든 스니치!'; m.help = '말포이보다 먼저 스니치를 잡자. 블러저 주의!'; m.sn = { x: 300, y: 60, tx: 260, ty: 80, tt: 0 }; m.rv = { x: 60, y: 160, stun: 0 }; m.winText = '스니치를 잡았다!'; m.loseText = '말포이가 먼저 잡았다…'; }
      if (v === 'fiendfyre') { m.title = '악마의 화염에서 탈출!'; m.help = '불길을 피해 22초간 버텨라!'; m.timeLimit = 22; m.winText = '탈출 성공!'; m.loseText = '불길에 휩싸였다…!'; }
    },
    update(m, dt) {
      const a = Input.axis(), sp = 115;
      if (m.stun > 0) m.stun -= dt;
      else { m.px = clamp(m.px + a.x * sp * dt, 16, W - 16); m.py = clamp(m.py + a.y * sp * dt, 20, H - 8); }
      if (Input.tap && m.stun <= 0) { m.px = lerp(m.px, Input.tap.x, 0.5); m.py = lerp(m.py, Input.tap.y, 0.5); }
      if (m.variant === 'remembrall') {
        const b = m.ball; b.vy += 22 * dt; b.x += b.vx * dt + Math.sin(m.t * 3) * 0.6; b.y += b.vy * dt;
        if (Math.hypot(b.x - m.px, b.y - (m.py - 10)) < 13) return Mini.finish(m, 'win');
        if (b.y > H - 6) return Mini.finish(m, 'lose');
      }
      if (m.variant === 'snitch') {
        const s = m.sn; s.tt -= dt;
        if (s.tt <= 0) { s.tx = rnd(40, W - 30); s.ty = rnd(30, H - 30); s.tt = rnd(0.5, 1.1); }
        const ang = Math.atan2(s.ty - s.y, s.tx - s.x); s.x += Math.cos(ang) * 120 * dt; s.y += Math.sin(ang) * 120 * dt;
        const r = m.rv; if (r.stun > 0) r.stun -= dt;
        else { const ra = Math.atan2(s.y - (r.y - 10), s.x - r.x), rs = 52 + m.pt * 2.2; r.x += Math.cos(ra) * rs * dt; r.y += Math.sin(ra) * rs * dt; }
        m.spawn -= dt;
        if (m.spawn <= 0) { m.spawn = rnd(1.4, 2.4); m.obs.push({ x: W + 10, y: rnd(30, H - 20), vx: -rnd(140, 190) }); }
        for (const o of m.obs) {
          o.x += o.vx * dt;
          if (!o.hit && Math.hypot(o.x - m.px, o.y - (m.py - 10)) < 12) { o.hit = 1; m.stun = 0.8; Snd.sfx('hit'); }
          if (!o.hit2 && Math.hypot(o.x - r.x, o.y - (r.y - 10)) < 12) { o.hit2 = 1; r.stun = 0.9; }
        }
        m.obs = m.obs.filter(o => o.x > -20);
        if (Math.hypot(s.x - m.px, s.y - (m.py - 10)) < 11) return Mini.finish(m, 'win');
        if (Math.hypot(s.x - r.x, s.y - (r.y - 10)) < 8) return Mini.finish(m, 'lose');
      }
      if (m.variant === 'fiendfyre') {
        m.spawn -= dt;
        if (m.spawn <= 0) {
          m.spawn = Math.max(0.45, 1.1 - m.pt * 0.03);
          if (Math.random() < 0.5) { const gap = rnd(40, 160); m.obs.push({ kind: 'wall', x: W + 10, gap, gh: 62, vx: -120 }); }
          else m.obs.push({ kind: 'ball', x: W + 10, y: rnd(20, H - 10), vx: -rnd(150, 210), vy: rnd(-30, 30) });
        }
        for (const o of m.obs) {
          o.x += o.vx * dt; if (o.vy) o.y += o.vy * dt;
          const py = m.py - 10;
          let hit = false;
          if (o.kind === 'wall') hit = Math.abs(o.x - m.px) < 9 && (py < o.gap - o.gh / 2 || py > o.gap + o.gh / 2);
          else hit = Math.hypot(o.x - m.px, o.y - py) < 11;
          if (hit && !o.hit && m.stun <= 0) { o.hit = 1; m.hp--; m.stun = 0.6; Snd.sfx('hit'); }
        }
        m.obs = m.obs.filter(o => o.x > -30);
        if (m.hp <= 0) return Mini.finish(m, 'lose');
        if (m.pt >= m.timeLimit) return Mini.finish(m, 'win');
      }
    },
    draw(m) {
      const t = m.t;
      if (m.variant === 'fiendfyre') {
        ctx.fillStyle = '#2a1008'; ctx.fillRect(0, 0, W, H);
        for (let i = 0; i < 14; i++) { const x = ((i * 53 - t * 60) % (W + 60) + W + 60) % (W + 60) - 30; ctx.fillStyle = '#3a2418'; ctx.fillRect(x, H - 40 - (i * 17 % 50), 26, 60); }
        for (const o of m.obs) {
          if (o.kind === 'wall') {
            for (let y = 0; y < H; y += 6) { if (Math.abs(y - o.gap) < o.gh / 2) continue; const fl = Math.sin(y * 0.4 + t * 18) * 3; ctx.fillStyle = (y / 6) % 2 ? '#ff6a1e' : '#ffb23c'; ctx.fillRect(o.x - 7 + fl, y, 14, 6); }
          } else {
            ctx.fillStyle = '#ff4a1e'; ctx.fillRect(o.x - 7, o.y - 7, 14, 14); ctx.fillStyle = '#ffd36a'; ctx.fillRect(o.x - 4, o.y - 4, 8, 8);
            ctx.fillStyle = 'rgba(255,120,30,.5)'; ctx.fillRect(o.x + 7, o.y - 4, 10, 8);
          }
        }
        if (m.stun <= 0 || Math.floor(t * 20) % 2) broomRider('harry', m.px, m.py, t, 'draco');
        for (let i = 0; i < 3; i++) { ctx.fillStyle = i < m.hp ? '#ff5a7a' : '#4a3a3a'; ctx.fillRect(10 + i * 14, 10, 10, 9); }
        txt('남은 시간 ' + Math.max(0, Math.ceil(m.timeLimit - m.pt)) + '초', W - 10, 8, '#ffe28a', 'right');
        return;
      }
      skyBg(t);
      // 성 실루엣 / 경기장 골대
      ctx.fillStyle = '#5a6a8a';
      for (let i = 0; i < 8; i++) { const x = ((i * 70 - t * 20) % (W + 70) + W + 70) % (W + 70) - 35; ctx.fillRect(x, H - 60 - (i % 3) * 18, 22, 80); ctx.fillRect(x + 5, H - 70 - (i % 3) * 18, 12, 10); }
      ctx.fillStyle = '#3f7a3a'; ctx.fillRect(0, H - 8, W, 8);
      if (m.variant === 'remembrall') {
        const b = m.ball; ctx.fillStyle = '#e8f0ff'; ctx.fillRect(b.x - 4, b.y - 4, 8, 8); ctx.fillStyle = '#e83a3a'; ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
        ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(b.x - 3, b.y - 3, 2, 2);
      }
      if (m.variant === 'snitch') {
        for (const o of m.obs) { ctx.fillStyle = '#1c1c22'; ctx.fillRect(o.x - 6, o.y - 6, 12, 12); ctx.fillStyle = '#4a4a56'; ctx.fillRect(o.x - 4, o.y - 4, 4, 4); }
        const r = m.rv; broomRider('draco', r.x, r.y, t + 1);
        const s = m.sn, wing = Math.floor(t * 30) % 2;
        ctx.fillStyle = '#e8ecf0'; ctx.fillRect(s.x - 8, s.y - 3 - wing * 2, 5, 3); ctx.fillRect(s.x + 3, s.y - 3 - wing * 2, 5, 3);
        ctx.fillStyle = '#ffd23a'; ctx.fillRect(s.x - 3, s.y - 3, 6, 6); ctx.fillStyle = '#fff6b0'; ctx.fillRect(s.x - 2, s.y - 2, 2, 2);
      }
      if (m.stun <= 0 || Math.floor(t * 20) % 2) broomRider('harry', m.px, m.py, t);
    },
  },
  // --- 마법 결투 ---
  duel: {
    init(m, v) {
      const E = { quirrell: ['quirrell', 4, 1.4], draco: ['draco', 3, 1.35], harry: ['harry', 3, 1.3], troll: ['troll', 3, 1.0], deatheater: ['deatheater', 4, 1.5], bellatrix: ['bellatrix', 4, 1.7], boggart: ['hooded', 3, 1.2], hooded: ['hooded', 3, 1.25], dementor: ['hooded', 3, 1.3] }[v] || ['harry', 3, 1.3];
      m.enemy = E[0]; m.ehp = E[1]; m.emax = E[1]; m.speed = E[2]; m.hp = 3; m.cur = 0; m.dir = 1;
      m.zone = 0.5; m.zw = 0.22; m.flash = 0; m.msg = ''; m.mt = 0; m.cool = 0;
      m.title = { quirrell: '퀴렐을 막아라!', troll: '트롤을 막아라!', hooded: '두건 쓴 자를 막아라!', boggart: '보가트를 물리쳐라!', dementor: '디멘터를 쫓아내라!' }[v] || '마법 결투!';
      m.help = '막대가 초록 구간에 왔을 때 A(또는 화면 터치)!';
      m.spells = { troll: ['스투페파이!', '익스펠리아르무스!'], boggart: ['리디큘러스!'], dementor: ['익스펙토 페트로눔!'] }[v] || ['엑스펠리아르무스!', '스투페파이!', '프로테고!', '리크투셈프라!'];
      m.newZone = () => { m.zw = Math.max(0.1, 0.22 - (m.emax - m.ehp) * 0.03); m.zone = rnd(0.15 + m.zw / 2, 0.85 - m.zw / 2); };
      m.newZone();
    },
    update(m, dt) {
      m.cur += m.dir * m.speed * dt * (1 + (m.emax - m.ehp) * 0.15);
      if (m.cur > 1) { m.cur = 1; m.dir = -1; } if (m.cur < 0) { m.cur = 0; m.dir = 1; }
      if (m.flash > 0) m.flash -= dt; if (m.mt > 0) m.mt -= dt; if (m.cool > 0) m.cool -= dt;
      if (Input.ok() && m.cool <= 0) {
        m.cool = 0.35;
        if (Math.abs(m.cur - m.zone) <= m.zw / 2) { m.ehp--; m.msg = m.spells[irnd(0, m.spells.length - 1)]; m.mt = 0.9; m.flash = 0.3; m.who = 'p'; Snd.sfx('spell'); }
        else { m.hp--; m.msg = '공격을 맞았다!'; m.mt = 0.9; m.flash = 0.3; m.who = 'e'; Snd.sfx('hit'); }
        m.newZone();
        if (m.ehp <= 0) return Mini.finish(m, 'win');
        if (m.hp <= 0) return Mini.finish(m, 'lose');
      }
    },
    draw(m) {
      const dark = m.variant === 'dementor' || m.variant === 'deatheater' || m.variant === 'bellatrix';
      ctx.fillStyle = dark ? '#10131c' : '#2a2a34'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = dark ? '#1a1e2a' : '#4a4a56'; ctx.fillRect(0, 120, W, 96);
      for (let x = 0; x < W; x += 32) { ctx.fillStyle = dark ? '#151924' : '#3c3c46'; ctx.fillRect(x, 120, 1, 96); }
      const shakeP = m.flash > 0 && m.who === 'e' ? irnd(-2, 2) : 0, shakeE = m.flash > 0 && m.who === 'p' ? irnd(-2, 2) : 0;
      drawChar('harry', 90 + shakeP, 150, 2, 0, 3);
      const big = m.enemy === 'troll' ? 4 : 3;
      if (m.variant === 'dementor' || m.variant === 'boggart') ctx.globalAlpha = 0.85;
      drawChar(m.enemy, 294 + shakeE, 150, 1, 0, big);
      ctx.globalAlpha = 1;
      if (m.flash > 0) {
        ctx.fillStyle = m.who === 'p' ? (m.variant === 'dementor' ? '#e8f0ff' : '#ff4a4a') : '#9a4aff';
        const x0 = m.who === 'p' ? 110 : 270, x1 = m.who === 'p' ? 280 : 100;
        for (let i = 0; i < 12; i++) { const k = i / 12; ctx.fillRect(lerp(x0, x1, k), 110 + Math.sin(k * 9 + m.t * 30) * 4, 6, 3); }
      }
      // HP
      txt('해리', 20, 14, '#f1ecd2');
      for (let i = 0; i < 3; i++) { ctx.fillStyle = i < m.hp ? '#7fd1a0' : '#333'; ctx.fillRect(20 + i * 12, 30, 9, 7); }
      txt(CHARS[m.enemy].name, W - 20, 14, '#f1ecd2', 'right');
      for (let i = 0; i < m.emax; i++) { ctx.fillStyle = i < m.ehp ? '#e86a6a' : '#333'; ctx.fillRect(W - 29 - i * 12, 30, 9, 7); }
      // 게이지
      const gx = 72, gy = 186, gw = 240;
      ctx.fillStyle = '#0c0e14'; ctx.fillRect(gx - 2, gy - 2, gw + 4, 14);
      ctx.fillStyle = '#3a2a3a'; ctx.fillRect(gx, gy, gw, 10);
      ctx.fillStyle = '#2f8a4e'; ctx.fillRect(gx + (m.zone - m.zw / 2) * gw, gy, m.zw * gw, 10);
      ctx.fillStyle = '#7fd1a0'; ctx.fillRect(gx + (m.zone - m.zw / 4) * gw, gy, m.zw * gw / 2, 10);
      ctx.fillStyle = '#fff'; ctx.fillRect(gx + m.cur * gw - 1, gy - 4, 3, 18);
      if (m.mt > 0) bigTxt(m.msg, W / 2, 56, 2, m.who === 'p' ? '#ffe28a' : '#d0a0ff');
    },
  },
  // --- 마법약 (순서 기억) ---
  potion: {
    init(m, v) {
      m.title = '마법약 조제'; m.help = '재료가 들어가는 순서를 기억해서 똑같이 넣자!';
      m.ing = { up: ['쐐기풀', '#5ac85a'], right: ['호저 가시', '#e8e0c0'], down: ['뿔 달팽이', '#c87a3a'], left: ['월장석 가루', '#a0b8ff'] };
      m.round = 0; m.lens = v === 'hard' ? [4, 5, 6] : [3, 4, 5]; m.miss = 0; m.newRound = () => {
        m.seq = []; for (let i = 0; i < m.lens[m.round]; i++) m.seq.push(DIRS[irnd(0, 3)]);
        m.show = 0; m.st = 0; m.inp = 0; m.sub = 'show'; m.lit = null; m.lt = 0;
      };
      m.newRound(); m.bub = [];
    },
    update(m, dt) {
      if (m.lt > 0) m.lt -= dt; else m.lit = null;
      if (Math.random() < 0.3) m.bub.push({ x: rnd(170, 214), y: 120, v: rnd(10, 30) });
      for (const b of m.bub) b.y -= b.v * dt; m.bub = m.bub.filter(b => b.y > 80);
      if (m.sub === 'show') {
        m.st += dt;
        if (m.st > 0.75) { m.st = 0; if (m.show < m.seq.length) { m.lit = m.seq[m.show]; m.lt = 0.5; m.show++; Snd.sfx('sel'); } else m.sub = 'input'; }
        return;
      }
      let d = DIRS.find(k => Input.pressed[k]);
      if (!d && Input.tap) { const p = Input.tap; for (const k of DIRS) { const [x, y] = this.pos(k); if (Math.abs(p.x - x) < 50 && Math.abs(p.y - y) < 20) d = k; } }
      if (!d) return;
      m.lit = d; m.lt = 0.25;
      if (d === m.seq[m.inp]) { m.inp++; Snd.sfx('ok'); if (m.inp >= m.seq.length) { m.round++; if (m.round >= m.lens.length) return Mini.finish(m, 'win'); m.newRound(); m.st = -0.6; } }
      else { m.miss++; Snd.sfx('no'); if (m.miss >= 3) return Mini.finish(m, 'lose'); m.show = 0; m.st = -0.6; m.inp = 0; m.sub = 'show'; }
    },
    pos(k) { return { up: [192, 44], down: [192, 182], left: [84, 116], right: [300, 116] }[k]; },
    draw(m) {
      ctx.fillStyle = '#14181a'; ctx.fillRect(0, 0, W, H);
      ctx.drawImage(mapCanvas(MAPS.classroom), (W - MAPS.classroom.w * TS) / 2, (H - MAPS.classroom.h * TS) / 2);
      ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#1a1a20'; ctx.fillRect(160, 100, 64, 44); ctx.fillRect(154, 96, 76, 8);
      ctx.fillStyle = m.lit ? m.ing[m.lit][1] : '#5ac85a'; ctx.fillRect(160, 96, 64, 6);
      for (const b of m.bub) { ctx.fillStyle = '#8af08a'; ctx.fillRect(b.x, b.y, 3, 3); }
      for (const k of DIRS) {
        const [x, y] = this.pos(k), [nm, col] = m.ing[k], on = m.lit === k;
        panel(x - 48, y - 16, 96, 32, on ? 1 : 0.8);
        ctx.fillStyle = col; ctx.fillRect(x - 42, y - 6, 12, 12);
        if (on) { ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(x - 47, y - 15, 94, 30); }
        txt(nm, x - 26, y - 6, on ? '#ffe28a' : '#e8e8f0');
        const ax = k === 'left' ? x - 58 : k === 'right' ? x + 58 : x, ay = k === 'up' ? y - 24 : k === 'down' ? y + 24 : y;
        drawArrow(ax, ay, k, on ? '#ffe28a' : '#c9d1e0');
      }
      txt(`${m.round + 1}/${m.lens.length}단계  실수 ${m.miss}/3`, 8, 6, '#c9d1e0');
      txt(m.sub === 'show' ? '잘 봐…' : `입력! (${m.inp}/${m.seq.length})`, W - 8, 6, '#ffe28a', 'right');
    },
  },
  // --- 크리스마스 무도회 리듬 ---
  dance: {
    init(m) {
      m.title = '크리스마스 무도회'; m.help = '화살표가 원에 닿을 때 같은 방향을 눌러!';
      const beat = 60 / 132;
      m.notes = []; for (let i = 0; i < 26; i++) m.notes.push({ t: 2 + i * beat * 2 + (i % 4 === 3 ? beat : 0), d: DIRS[irnd(0, 3)], s: 0 });
      m.hit = 0; m.fb = ''; m.ft = 0; m.hx = 70;
      Snd.music('ball');
    },
    update(m, dt) {
      if (m.ft > 0) m.ft -= dt;
      const now = m.pt;
      let d = DIRS.find(k => Input.pressed[k]);
      if (!d && Input.tap) { const p = Input.tap; d = Math.abs(p.x - W / 2) > Math.abs(p.y - H / 2) * 1.8 ? (p.x > W / 2 ? 'right' : 'left') : (p.y > H / 2 ? 'down' : 'up'); }
      if (d) {
        const n = m.notes.find(n => !n.s && Math.abs(n.t - now) < 0.22);
        if (n && n.d === d) { n.s = 1; m.hit++; m.fb = Math.abs(n.t - now) < 0.09 ? '완벽해!' : '좋아!'; m.ft = 0.4; Snd.sfx('sel'); }
        else if (n) { n.s = 2; m.fb = '삐끗!'; m.ft = 0.4; }
      }
      for (const n of m.notes) if (!n.s && now - n.t > 0.22) { n.s = 2; m.fb = '놓쳤다'; m.ft = 0.4; }
      if (now > m.notes[m.notes.length - 1].t + 1) Mini.finish(m, m.hit / m.notes.length >= 0.6 ? 'win' : 'lose');
    },
    draw(m) {
      ctx.drawImage(mapCanvas(MAPS.hall), 0, 0, W, H, 0, 0, W, H);
      ctx.fillStyle = 'rgba(20,30,60,.55)'; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 30; i++) { ctx.fillStyle = i % 3 ? '#e8f0ff' : '#ffe28a'; ctx.fillRect((i * 61 + Math.sin(m.t + i) * 8) % W, (i * 37 + m.t * 12) % 120, 2, 2); }
      const f = Math.floor(m.t * 2.2) % 3;
      drawChar('harry', W / 2 - 12, 150, f === 1 ? 2 : 0, f, 3); drawChar('draco', W / 2 + 22, 150, 1, (f + 1) % 3, 3);
      ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, 168, W, 40);
      ctx.strokeStyle = '#ffe28a'; ctx.lineWidth = 2; ctx.strokeRect(m.hx - 14, 174, 28, 28);
      for (const n of m.notes) {
        if (n.s === 1) continue;
        const x = m.hx + (n.t - m.pt) * 140; if (x < -10 || x > W + 10) continue;
        drawArrow(x, 188, n.d, n.s === 2 ? '#666' : { up: '#7fd1a0', down: '#ffb23c', left: '#9ab0ff', right: '#ff8ab0' }[n.d]);
      }
      txt(`${m.hit} / ${m.notes.length}`, W - 8, 6, '#ffe28a', 'right');
      if (m.ft > 0) bigTxt(m.fb, m.hx + 60, 140, 2, '#ffe28a');
    },
  },
  // --- 주문 학습: 지팡이 동작 따라 하기 + 주문 외우기 타이밍 ---
  learn: {
    init(m, v) {
      const S = SPELLS[v]; m.S = S; m.seq = S.motion;
      m.title = '주문 연습: ' + S.name; m.help = '지팡이 동작을 기억해 따라 한 뒤, 빛이 가운데 올 때 A!';
      m.sub = 'show'; m.st = -0.3; m.show = 0; m.inp = 0; m.miss = 0; m.lit = -1; m.lt = 0; m.cur = 0; m.cdir = 1; m.trail = [];
      m.winText = S.name + ' 습득!'; m.loseText = '어설프지만… 일단 익혔다!';
    },
    update(m, dt) {
      if (m.lt > 0) m.lt -= dt; else m.lit = -1;
      for (const t of m.trail) t.t -= dt; m.trail = m.trail.filter(t => t.t > 0);
      if (m.sub === 'show') {
        m.st += dt;
        if (m.st > 0.62) { m.st = 0; if (m.show < m.seq.length) { m.lit = m.show; m.lt = 0.45; m.show++; Snd.sfx('sel'); } else { m.sub = 'input'; } }
        return;
      }
      if (m.sub === 'input') {
        let d = DIRS.find(k => Input.pressed[k]);
        if (!d && Input.tap) { const p = Input.tap; d = Math.abs(p.x - W / 2) > Math.abs(p.y - 100) ? (p.x > W / 2 ? 'right' : 'left') : (p.y > 100 ? 'down' : 'up'); }
        if (!d) return;
        m.trail.push({ d, t: 0.5 });
        if (d === m.seq[m.inp]) { m.inp++; Snd.sfx('ok'); if (m.inp >= m.seq.length) { m.sub = 'chant'; m.cur = 0; } }
        else { m.miss++; Snd.sfx('no'); if (m.miss >= 3) return Mini.finish(m, 'lose'); m.sub = 'show'; m.show = 0; m.inp = 0; m.st = -0.5; }
        return;
      }
      if (m.sub === 'chant') {
        m.cur += m.cdir * dt * 1.25; if (m.cur > 1) { m.cur = 1; m.cdir = -1; } if (m.cur < 0) { m.cur = 0; m.cdir = 1; }
        if (Input.ok()) {
          if (Math.abs(m.cur - 0.5) < 0.13) { Snd.sfx('spell'); return Mini.finish(m, 'win'); }
          m.miss++; Snd.sfx('no'); if (m.miss >= 3) return Mini.finish(m, 'lose');
        }
      }
    },
    draw(m) {
      ctx.fillStyle = '#10141c'; ctx.fillRect(0, 0, W, H);
      ctx.drawImage(mapCanvas(MAPS.classroom), (W - MAPS.classroom.w * TS) / 2, (H - MAPS.classroom.h * TS) / 2);
      ctx.fillStyle = 'rgba(5,8,16,.72)'; ctx.fillRect(0, 0, W, H);
      const S = m.S;
      bigTxt(S.name, W / 2, 10, 2, S.col);
      txt(m.sub === 'show' ? '지팡이 동작을 잘 봐…' : m.sub === 'input' ? `따라 해! (${m.inp}/${m.seq.length})` : '지금이다— 주문을 외워! (A)', W / 2, 44, '#c9d1e0', 'center');
      // 동작 화살표
      const n = m.seq.length, gap = 40, x0 = W / 2 - (n - 1) * gap / 2;
      m.seq.forEach((d, i) => {
        const x = x0 + i * gap, y = 82, done = i < m.inp, on = m.lit === i;
        panel(x - 16, y - 16, 32, 32, 0.9);
        const show = m.sub === 'show' ? i < m.show : true;
        if (show) drawArrow(x, y, d, on ? '#ffe28a' : done ? S.col : (m.sub === 'show' ? '#c9d1e0' : '#3a4050'));
      });
      // 해리와 지팡이
      drawChar('harry', 80, 190, 2, 0, 3);
      const t = performance.now() / 1000, wx = 112, wy = 140;
      ctx.fillStyle = '#6a4426'; ctx.fillRect(wx, wy, 14, 2);
      ctx.fillStyle = S.col; ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 8); ctx.fillRect(wx + 13, wy - 2, 5, 5); ctx.globalAlpha = 1;
      for (const tr of m.trail) { ctx.globalAlpha = tr.t * 2; drawArrow(wx + 30 + ({ left: -12, right: 12 }[tr.d] || 0), wy + ({ up: -12, down: 12 }[tr.d] || 0), tr.d, S.col); } ctx.globalAlpha = 1;
      // 주문 외우기 타이밍 바
      if (m.sub === 'chant') {
        const gx = 170, gy = 150, gw = 180;
        ctx.fillStyle = '#0c0e14'; ctx.fillRect(gx - 2, gy - 2, gw + 4, 14);
        ctx.fillStyle = '#2a2a3a'; ctx.fillRect(gx, gy, gw, 10);
        ctx.fillStyle = S.col; ctx.globalAlpha = 0.6; ctx.fillRect(gx + gw * 0.37, gy, gw * 0.26, 10); ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff'; ctx.fillRect(gx + m.cur * gw - 1, gy - 4, 3, 18);
        txt('「' + S.name + '!」', gx + gw / 2, gy + 18, S.col, 'center');
      }
      txt(`실수 ${m.miss}/3`, W - 8, H - 16, '#9ab0d0', 'right');
      const lines = wrap(S.desc, 190); lines.slice(0, 3).forEach((l, i) => txt(l, 170, 100 + i * 14 + (m.sub === 'chant' ? -6 : 10), '#9ab0d0'));
    },
  },
};

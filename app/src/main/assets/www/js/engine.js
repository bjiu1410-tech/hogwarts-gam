'use strict';
// ===== 스크립트 파서 =====
// 문법 요약 (story.js 상단 주석 참고)
const STAT_NAMES = { draco: '드레이코', hermione: '헤르미온느', ron: '론', courage: '용기' };
const HEART_STATS = ['draco', 'hermione', 'ron'];
let PLAYER = 'harry';
const Script = {
  lines: [], labels: {}, chapters: [],
  parse(src) {
    const L = [], labels = {}, errs = [];
    src.split('\n').forEach((raw, i) => {
      const ln = i + 1, s = raw.trim();
      if (!s || s.startsWith('//')) return;
      const push = o => { o.ln = ln; L.push(o); };
      if (s.startsWith('# ')) { const n = s.slice(2).trim(); if (labels[n] !== undefined) errs.push(`중복 라벨 ${n} (${ln})`); labels[n] = L.length; return; }
      if (s.startsWith('> ')) { // 선택지
        let body = s.slice(2), cond = null, fx = [], to = null;
        let m = body.match(/^\[if ([^\]]+)\]\s*/); if (m) { cond = m[1]; body = body.slice(m[0].length); }
        m = body.match(/\s*->\s*(\S+)\s*$/); if (m) { to = m[1]; body = body.slice(0, m.index); }
        m = body.match(/\s*\{([^}]*)\}\s*$/); if (m) { fx = parseFx(m[1]); body = body.slice(0, m.index); }
        const prev = L[L.length - 1];
        const opt = { text: body.trim(), cond, fx, to };
        if (prev && prev.t === 'choice' && !prev.closed) prev.opts.push(opt); else push({ t: 'choice', opts: [opt] });
        return;
      }
      const prevC = L[L.length - 1]; if (prevC && prevC.t === 'choice') prevC.closed = true;
      if (s.startsWith('==')) { const [a, b, c] = s.slice(2).split('|').map(x => x.trim()); push({ t: 'chapter', year: a, title: b || '', sub: c || '' }); return; }
      if (s.startsWith('@')) {
        const [cmd, ...rest] = s.slice(1).split(/\s+/); const arg = s.slice(1 + cmd.length).trim();
        const to = (arg.match(/->\s*(\S+)$/) || [])[1];
        switch (cmd) {
          case 'goto': push({ t: 'goto', to: arg }); break;
          case 'if': push({ t: 'if', cond: arg.replace(/->.*$/, '').trim(), to }); break;
          case 'add': push({ t: 'add', k: rest[0], v: +rest[1] }); break;
          case 'set': push({ t: 'set', k: rest[0], v: rest[1] === undefined ? 1 : (isNaN(rest[1]) ? rest[1] : +rest[1]) }); break;
          case 'bg': push({ t: 'bg', id: rest[0], x: rest[1] !== undefined ? +rest[1] : null, y: rest[2] !== undefined ? +rest[2] : null }); break;
          case 'cg': { const [id, chars, cap] = arg.split('|').map(x => x.trim()); push({ t: 'cg', id, chars: chars ? chars.split(',').map(x => x.trim()) : [], cap: cap || '' }); break; }
          case 'cgoff': push({ t: 'cgoff' }); break;
          case 'music': push({ t: 'music', id: rest[0] }); break;
          case 'sfx': push({ t: 'sfx', id: rest[0] }); break;
          case 'wait': push({ t: 'wait', s: +rest[0] || 1 }); break;
          case 'fade': push({ t: 'fade' }); break;
          case 'shake': push({ t: 'shake' }); break;
          case 'flash': push({ t: 'flash', col: rest[0] || '#fff' }); break;
          case 'tint': push({ t: 'tint', v: rest[0] === 'off' ? null : arg }); break;
          case 'explore': push({ t: 'explore', map: rest[0], x: +rest[1], y: +rest[2], dir: rest[3] || 'down' }); break;
          case 'npc': push({ t: 'npc', id: rest[0], x: +rest[1], y: +rest[2], dir: rest[3], to }); break;
          case 'obj': push({ t: 'obj', x: +rest[0], y: +rest[1], to }); break;
          case 'exit': push({ t: 'exit', x: +rest[0], y: +rest[1], to }); break;
          case 'goal': push({ t: 'goal', text: arg }); break;
          case 'play': push({ t: 'play' }); break;
          case 'back': push({ t: 'back' }); break;
          case 'mini': push({ t: 'mini', type: rest[0], v: rest[1] }); break;
          case 'save': push({ t: 'save' }); break;
          case 'ending': push({ t: 'ending', id: rest[0] }); break;
          case 'move': push({ t: 'move', id: rest[0], path: rest.slice(1).join('') }); break;
          case 'face': push({ t: 'face', id: rest[0], dir: rest[1] }); break;
          case 'hide': push({ t: 'hide', id: rest[0] }); break;
          case 'player': push({ t: 'player', id: rest[0] }); break;
          case 'learn': push({ t: 'learn', id: rest[0] }); break;
          case 'givespell': push({ t: 'givespell', id: rest[0] }); break;
          case 'enemy': push({ t: 'enemy', type: rest[0], x: +rest[1], y: +rest[2] }); break;
          case 'roam': push({ t: 'roam', map: rest[0], x: +rest[1], y: +rest[2], dir: rest[3] || 'down' }); break;
          case 'rnpc': push({ t: 'rnpc', map: rest[0], id: rest[1], x: +rest[2], y: +rest[3], dir: rest[4], to }); break;
          case 'robj': push({ t: 'robj', map: rest[0], x: +rest[1], y: +rest[2], to }); break;
          case 'target': push({ t: 'target', map: rest[0], x: +rest[1], y: +rest[2], to }); break;
          case 'heal': push({ t: 'heal' }); break;
          case 'onclear': push({ t: 'onclear', to }); break;
          default: errs.push(`알 수 없는 명령 @${cmd} (${ln})`);
        }
        return;
      }
      // 대사: 이름(감정)*: 내용  /  : 나레이션
      const m = s.match(/^([^:(（*]*)(?:\(([a-z]+)\))?(\*)?\s*:\s?(.*)$/);
      if (m) {
        const name = m[1].trim(); const emo = m[2] || 'normal';
        if (emo && !PORTRAIT_EMOS.includes(emo)) errs.push(`알 수 없는 감정 ${emo} (${ln})`);
        push({ t: 'say', name, id: NAME2ID[name] || null, emo, thought: !!m[3], text: m[4] });
        return;
      }
      errs.push(`해석 불가 (${ln}): ${s}`);
    });
    // 라벨 검사
    for (const l of L) {
      const chk = to => { if (to && labels[to] === undefined) errs.push(`없는 라벨 ${to} (${l.ln})`); };
      chk(l.to); if (l.t === 'choice') l.opts.forEach(o => chk(o.to));
      if (l.t === 'explore' && !MAPS[l.map]) errs.push(`없는 맵 ${l.map} (${l.ln})`);
      if (l.t === 'bg' && l.id !== 'black' && !MAPS[l.id]) errs.push(`없는 배경 ${l.id} (${l.ln})`);
      if (l.t === 'mini' && !MINIS[l.type]) errs.push(`없는 미니게임 ${l.type} (${l.ln})`);
      if ((l.t === 'npc' || l.t === 'rnpc') && !CHARS[l.id]) errs.push(`없는 캐릭터 ${l.id} (${l.ln})`);
      if ((l.t === 'learn' || l.t === 'givespell') && !SPELLS[l.id]) errs.push(`없는 주문 ${l.id} (${l.ln})`);
      if (l.t === 'enemy' && !ENEMIES[l.type]) errs.push(`없는 적 ${l.type} (${l.ln})`);
      if ((l.t === 'roam' || l.t === 'rnpc' || l.t === 'robj' || l.t === 'target') && !MAPS[l.map]) errs.push(`없는 맵 ${l.map} (${l.ln})`);
    }
    this.lines = L; this.labels = labels;
    this.chapters = L.map((l, i) => l.t === 'chapter' ? i : -1).filter(i => i >= 0);
    if (errs.length) console.error('스크립트 오류:\n' + errs.join('\n'));
    return errs;
  },
};
function parseFx(s) { return s.split(',').map(x => x.trim()).filter(Boolean).map(x => { const m = x.match(/^(\w+)\s*([+-]\d+|=\S+)$/); if (!m) return { k: x, set: 1 }; return m[2][0] === '=' ? { k: m[1], set: m[2].slice(1) } : { k: m[1], v: +m[2] }; }); }

// ===== 게임 상태 =====
const DIRN = { down: 0, left: 1, right: 2, up: 3 };
const DV = [[0, 1], [-1, 0], [1, 0], [0, -1]];
const G = {
  scene: 'title', pc: 0, flags: {}, mode: 'idle',
  bg: 'black', camX: 0, camY: 0, tint: null, cg: null, music: null,
  say: null, choice: null, waitT: 0, fade: 0, fadeDir: 0, shake: 0, flash: 0, flashCol: '#fff',
  ex: null, toasts: [], card: null, goal: '', checkpoint: null, pause: null, ending: null,
  title: { sel: 0, t: 0, sub: null },
};

function newGame() {
  G.flags = { draco: 0, hermione: 0, ron: 0, courage: 0 };
  startAt(0);
}
function startAt(pc, flags, extra) {
  if (flags) G.flags = JSON.parse(JSON.stringify(flags));
  G.scene = 'play'; G.pc = pc; G.mode = 'idle'; G.cg = null; G.say = null; G.choice = null; G.ex = null; G.goal = ''; G.tint = null;
  G.bg = 'black';
  if (extra) { if (extra.bg) setBg(extra.bg, extra.camX, extra.camY, true); if (extra.music) { G.music = extra.music; Snd.music(extra.music); } G.tint = extra.tint || null; }
  G.fade = 1; G.fadeDir = -1;
  step();
}
function checkpoint(pc) {
  const cp = { pc, flags: JSON.parse(JSON.stringify(G.flags)), bg: G.bg, camX: G.camX, camY: G.camY, music: G.music, tint: G.tint, ch: currentChapter(pc), time: Date.now() };
  G.checkpoint = cp; Store.set('tsm_save', cp);
}
function currentChapter(pc) { let c = 0; Script.chapters.forEach((ci, i) => { if (ci <= pc) c = i; }); return c; }

function setBg(id, x, y, instant) {
  G.bg = id;
  const m = MAPS[id];
  if (m) {
    Magic.applyMods(m);
    const cx = x != null ? x * TS + 8 : m.w * TS / 2, cy = y != null ? y * TS + 8 : m.h * TS / 2;
    G.camX = camClamp(cx - W / 2, m.w * TS, W); G.camY = camClamp(cy - H / 2 + 20, m.h * TS, H);
    G.tint = m.tint || null;
  }
}
function camClamp(v, size, view) { if (size <= view) return (size - view) / 2; return clamp(v, 0, size - view); }

function evalCond(s) {
  return s.split('||').some(part => part.split('&&').every(a => {
    a = a.trim(); let neg = false; if (a[0] === '!') { neg = true; a = a.slice(1); }
    const m = a.match(/^(\w+)\s*(>=|<=|==|!=|>|<)\s*(\S+)$/);
    let r;
    if (!m) r = !!G.flags[a];
    else {
      let x = G.flags[m[1]], y = m[3];
      if (!isNaN(y)) { y = +y; x = +(x || 0); }
      r = { '>=': x >= y, '<=': x <= y, '==': x == y, '!=': x != y, '>': x > y, '<': x < y }[m[2]];
    }
    return neg ? !r : r;
  }));
}
function applyFx(list) {
  for (const f of list) {
    if (f.set !== undefined) { G.flags[f.k] = f.set; continue; }
    G.flags[f.k] = (G.flags[f.k] || 0) + f.v;
    if (STAT_NAMES[f.k]) {
      const heart = HEART_STATS.includes(f.k);
      G.toasts.push({ text: `${STAT_NAMES[f.k]} ${heart ? '호감도' : ''} ${f.v > 0 ? '▲' : '▼'}${Math.abs(f.v)}`.replace('  ', ' '), col: f.v > 0 ? (heart ? '#ff9ab8' : '#ffe28a') : '#9ab0d0', t: 2.2 });
      Snd.sfx(f.v > 0 && heart ? 'heart' : 'sel');
    }
  }
}

// ===== 실행기 =====
function step() {
  for (let guard = 0; guard < 5000; guard++) {
    const L = Script.lines[G.pc];
    if (!L) { toTitle(); return; }
    G.pc++;
    switch (L.t) {
      case 'say': startSay(L); return;
      case 'choice': {
        const opts = L.opts.filter(o => !o.cond || evalCond(o.cond));
        G.choice = { opts, sel: 0, t: 0 }; G.mode = 'choice'; return;
      }
      case 'goto': G.pc = Script.labels[L.to]; break;
      case 'if': if (evalCond(L.cond)) G.pc = Script.labels[L.to]; break;
      case 'add': applyFx([{ k: L.k, v: L.v }]); break;
      case 'set': G.flags[L.k] = L.v; break;
      case 'bg': G.ex = null; G.roam = null; G.goal = ''; if (L.id === 'black') { G.bg = 'black'; G.tint = null; } else setBg(L.id, L.x, L.y); break;
      case 'cg': G.cg = { id: L.id, chars: L.chars, cap: L.cap, t: 0 }; break;
      case 'cgoff': G.cg = null; break;
      case 'music': G.music = L.id; Snd.music(L.id); break;
      case 'sfx': Snd.sfx(L.id); break;
      case 'wait': G.waitT = TEST ? 0 : L.s; G.mode = 'wait'; return;
      case 'fade': G.fade = 0; G.fadeDir = 1; G.mode = 'fade'; if (TEST) { G.fade = 0; G.fadeDir = 0; break; } return;
      case 'shake': G.shake = 0.5; Snd.sfx('shock'); break;
      case 'flash': G.flash = 0.5; G.flashCol = L.col; break;
      case 'tint': G.tint = L.v; break;
      case 'explore': setupExplore(L, G.pc - 1); break;
      case 'npc': if (G.ex) { G.ex.npcs = G.ex.npcs.filter(n => n.id !== L.id); G.ex.npcs.push({ id: L.id, x: L.x, y: L.y, dir: DIRN[L.dir] ?? 0, to: L.to, px: L.x * TS, py: L.y * TS, path: '', moving: 0, frame: 0 }); } break;
      case 'obj': if (G.ex) G.ex.objs.push({ x: L.x, y: L.y, to: L.to }); break;
      case 'exit': if (G.ex) G.ex.exits.push({ x: L.x, y: L.y, to: L.to }); break;
      case 'learn': G.lastSay = null; G.mode = 'mini'; Mini.start('learn', L.id, () => { Magic.learn(L.id); G.mode = 'idle'; if (G.music) { Snd.cur = null; Snd.music(G.music); } step(); }); return;
      case 'givespell': Magic.learn(L.id); break;
      case 'enemy': Magic.addEnemy(L.type, L.x, L.y); break;
      case 'heal': G.hp = G.maxHp; break;
      case 'onclear': if (G.ex) G.ex.onClear = L.to; break;
      case 'roam': setupExplore(L, G.pc - 1); G.roam = { npcs: [], objs: [], targets: [] }; populateRoam(); break;
      case 'rnpc': if (G.roam) { G.roam.npcs.push(L); if (G.ex && G.ex.map.id === L.map) G.ex.npcs.push({ id: L.id, x: L.x, y: L.y, dir: DIRN[L.dir] ?? 0, to: L.to, px: L.x * TS, py: L.y * TS, moving: 0, frame: 0 }); } break;
      case 'robj': if (G.roam) { G.roam.objs.push(L); if (G.ex && G.ex.map.id === L.map) G.ex.objs.push({ x: L.x, y: L.y, to: L.to }); } break;
      case 'target': if (G.roam) { G.roam.targets.push(L); if (G.ex && G.ex.map.id === L.map) { G.ex.objs.push({ x: L.x, y: L.y, to: L.to }); G.ex.targets.push(L); } } break;
      case 'player': G.flags._player = L.id; if (G.ex) G.ex.player.id = L.id; break;
      case 'hide': if (G.ex) G.ex.npcs = G.ex.npcs.filter(n => n.id !== L.id); break;
      case 'face': { const n = findActor(L.id); if (n) n.dir = DIRN[L.dir] ?? 0; break; }
      case 'move': { const n = findActor(L.id); if (n) { n.path = L.path; G.mode = 'move'; G.moveActor = n; return; } break; }
      case 'goal': G.goal = L.text; break;
      case 'play': G.lastSay = null; if (G.ex) { checkpoint(G.ex.pcStart); G.ex.pcStart = G.ex.pcStart; } G.mode = 'explore'; return;
      case 'back': { G.lastSay = null;
        if (G.ex && G.ex.pushBack) { const p = G.ex.player; p.x = G.ex.pushBack[0]; p.y = G.ex.pushBack[1]; p.px = p.x * TS; p.py = p.y * TS; G.ex.pushBack = null; }
        G.mode = 'explore'; return;
      }
      case 'mini': G.lastSay = null; G.mode = 'mini'; Mini.start(L.type, L.v, r => { G.flags.last = r; G.mode = 'idle'; if (G.music) { Snd.cur = null; Snd.music(G.music); } step(); }); return;
      case 'chapter': {
        G.cg = null; G.ex = null; G.goal = '';
        G.card = { ...L, t: 0 }; G.mode = 'card';
        checkpoint(G.pc - 1);
        const sys = Store.get('tsm_sys', { endings: [], chapters: {} });
        const idx = Script.chapters.indexOf(G.pc - 1);
        sys.chapters[idx] = { pc: G.pc - 1, flags: G.flags };
        Store.set('tsm_sys', sys);
        return;
      }
      case 'save': checkpoint(G.pc); break;
      case 'ending': showEnding(L.id); return;
    }
  }
  console.error('step guard 초과 (무한 루프?) pc=' + G.pc);
}
function findActor(id) { if (!G.ex) return null; if (id === 'player' || id === G.ex.player.id) return G.ex.player; return G.ex.npcs.find(n => n.id === id); }

function startSay(L) {
  G.lastSay = null;
  let text = L.text.replace(/\{(\w+)\}/g, (_, k) => G.flags[k] ?? '');
  const w = L.id ? 268 : 356;
  const lines = wrap(text, w);
  const pages = []; for (let i = 0; i < lines.length; i += 3) pages.push(lines.slice(i, i + 3));
  G.say = { L, pages, page: 0, shown: 0, t: 0, blip: 0 };
  G.mode = 'say';
}

// ===== 탐험 모드 =====
function setupExplore(L, pc, keepRoam) {
  const m = MAPS[L.map];
  Magic.applyMods(m);
  if (!keepRoam) { G.roam = null; Magic.reset(); }
  G.bg = L.map; G.tint = m.tint || null; G.cg = null;
  G.ex = {
    map: m, pcStart: pc, npcs: [], objs: [], exits: [], pushBack: null, done: new Set(),
    enemies: [], targets: [], start: { x: L.x, y: L.y },
    items: (m.items || []).filter(it => !G.flags['item_' + m.id + it.x + '_' + it.y]).map(it => ({ x: it.x * TS + 8, y: it.y * TS + 8, item: it.item, key: m.id + it.x + '_' + it.y })),
    player: { id: G.flags._player || PLAYER, x: L.x, y: L.y, px: L.x * TS, py: L.y * TS, dir: DIRN[L.dir] ?? 0, moving: 0, frame: 0, ft: 0, path: '' },
  };
  if (!keepRoam) G.goal = '';
  G.flags.enemies = 0;
  updateCam(true);
}
// 자유 시간: 현재 맵에 해당하는 인물/대상 배치
function populateRoam() {
  const e = G.ex, r = G.roam; if (!e || !r) return;
  e.roam = true;
  const id = e.map.id;
  for (const [cid, x, y, dir, line] of (ROAM_CHATTER[id] || [])) e.npcs.push({ id: cid, x, y, dir: DIRN[dir] ?? 0, line, px: x * TS, py: y * TS, moving: 0, frame: 0 });
  for (const n of r.npcs) if (n.map === id) e.npcs.push({ id: n.id, x: n.x, y: n.y, dir: DIRN[n.dir] ?? 0, to: n.to, px: n.x * TS, py: n.y * TS, moving: 0, frame: 0 });
  for (const o of r.objs) if (o.map === id) e.objs.push({ x: o.x, y: o.y, to: o.to });
  for (const t of r.targets) if (t.map === id) { e.objs.push({ x: t.x, y: t.y, to: t.to }); e.targets.push(t); }
}
function roamWarp(link) {
  const keepGoal = G.goal;
  setupExplore({ map: link.to, x: link.tx, y: link.ty, dir: link.dir }, G.ex.pcStart, true);
  populateRoam(); G.goal = keepGoal;
  G.fade = 1; G.fadeDir = -1; Snd.sfx('door');
}
function sayLine(id, text) { // 라벨 없이 한 줄 대사 (자유 시간 배경 인물)
  const m = text.match(/^([^:]+):\s*(.*)$/);
  const name = m ? m[1] : (CHARS[id] || {}).name, body = m ? m[2] : text;
  startSay({ t: 'say', name, id, emo: 'normal', thought: false, text: body });
  G.sayReturn = 'explore';
}
function occupied(x, y, self) {
  const e = G.ex; if (isSolid(e.map, x, y)) return true;
  for (const n of e.npcs) if (n !== self && n.x === x && n.y === y) return true;
  if (self !== e.player && e.player.x === x && e.player.y === y) return true;
  return false;
}
function stepActor(a, dt, speed = 72) {
  if (!a.moving) return false;
  const tx = a.x * TS, ty = a.y * TS;
  const dx = tx - a.px, dy = ty - a.py, d = Math.hypot(dx, dy), mv = speed * dt;
  if (d <= mv) { a.px = tx; a.py = ty; a.moving = 0; return true; }
  a.px += dx / d * mv; a.py += dy / d * mv;
  a.ft += dt; if (a.ft > 0.14) { a.ft = 0; a.frame = a.frame === 1 ? 2 : 1; }
  return false;
}
function tryMove(a, dir) {
  a.dir = dir;
  const [dx, dy] = DV[dir], nx = a.x + dx, ny = a.y + dy;
  if (occupied(nx, ny, a)) return false;
  a.prev = [a.x, a.y]; a.x = nx; a.y = ny; a.moving = 1; a.ft = a.ft || 0;
  return true;
}
function updateExplore(dt) {
  if (!G.ex) { G.mode = 'idle'; return; }
  const e = G.ex, p = e.player;
  for (const n of e.npcs) { if (n.moving) stepActor(n, dt); else n.frame = 0; }
  Magic.update(dt);
  if (e.onClear && e.hadEnemies && !e.enemies.length && G.mode === 'explore' && !p.moving) { const t = e.onClear; e.onClear = null; runLabel(t); return; }
  if (G.mode !== 'explore') return;
  if (p.moving) {
    if (stepActor(p, dt, Input.held.b ? 110 : 72)) {
      const ex = e.exits.find(x => x.x === p.x && x.y === p.y);
      if (ex) { e.pushBack = p.prev; p.frame = 0; runLabel(ex.to); return; }
      const link = e.roam && (MAP_LINKS[e.map.id] || []).find(l => l.x === p.x && l.y === p.y);
      if (link) { roamWarp(link); return; }
    } else { Magic.input(); return; }
  }
  if (Input.pressed.menu) { openPause(); return; }
  Magic.input();
  const a = Input.axis();
  let dir = null;
  if (a.y < 0) dir = 3; else if (a.y > 0) dir = 0; else if (a.x < 0) dir = 1; else if (a.x > 0) dir = 2;
  if (dir !== null) { if (!tryMove(p, dir)) p.frame = 0; }
  else p.frame = 0;
  if (Input.pressed.a || (Input.tap && !document.body.classList.contains('touch'))) {
    const [dx, dy] = DV[p.dir], fx = p.x + dx, fy = p.y + dy;
    const n = e.npcs.find(n => n.x === fx && n.y === fy && n.to);
    if (n) { n.dir = [3, 2, 1, 0][p.dir]; e.done.add(n); Snd.sfx('sel'); runLabel(n.to); return; }
    const o = e.objs.find(o => o.x === fx && o.y === fy) || e.objs.find(o => o.x === p.x && o.y === p.y);
    if (o) { e.done.add(o); Snd.sfx('sel'); runLabel(o.to); return; }
    const ln = e.npcs.find(n => n.x === fx && n.y === fy && n.line);
    if (ln) { ln.dir = [3, 2, 1, 0][p.dir]; sayLine(ln.id, ln.line); return; }
    const ch = tileAt(e.map, fx, fy);
    if (ch === '$') { Magic.openChest(e.map, fx, fy); return; }
    if (ch === '&') { Magic.floatAt('잠겨 있다. (알로호모라?)', '#c9d1e0', fx * TS + 8, fy * TS); return; }
    if (ch === 'X') { Magic.floatAt('잠긴 문이다. (알로호모라?)', '#c9d1e0', fx * TS + 8, fy * TS); return; }
    if (ch === ';') { Magic.floatAt('악마의 덫이 꿈틀거린다…', '#9ad0b0', fx * TS + 8, fy * TS); return; }
    if (ch === 'o') { Magic.floatAt('무거운 바위. 마법으로 옮길 수 있을 것 같다.', '#c9d1e0', fx * TS + 8, fy * TS); return; }
    if (ch === 'z') { Magic.floatAt('무너진 다리다. (레파로?)', '#c9d1e0', fx * TS + 8, fy * TS); return; }
    if (ch === '%') { Magic.floatAt('금이 간 벽이다. 부술 수 있을지도.', '#c9d1e0', fx * TS + 8, fy * TS); return; }
    if (ch === '^') { Magic.floatAt('불길이 길을 막고 있다.', '#ffb08a', fx * TS + 8, fy * TS); return; }
    if (ch === 'q') { Magic.floatAt('질긴 덩굴과 거미줄이 뒤엉켜 있다.', '#c9d1e0', fx * TS + 8, fy * TS); return; }
  }
  if (TEST) testExplore();
}
function testExplore() { // 자동 테스트: 모든 대상과 상호작용 후 출구 사용
  const e = G.ex; e.testN = (e.testN || 0) + 1;
  e.enemies = []; G.flags.enemies = 0;
  if (e.roam && G.roam.targets.length && e.testN > 2) { runLabel(G.roam.targets[0].to); return; }
  if (e.testN > 60) { console.error('탐험 테스트 정지: ' + e.map.name + ' line ' + Script.lines[e.pcStart].ln); G.mode = 'stuck'; return; }
  const next = [...e.npcs.filter(n => n.to), ...e.objs].find(t => !e.done.has(t));
  if (next) { e.done.add(next); runLabel(next.to); return; }
  const ex = e.exits[(e.testN) % Math.max(1, e.exits.length)];
  if (ex) { e.pushBack = [e.player.x, e.player.y]; runLabel(ex.to); }
}
function runLabel(to) { G.pc = Script.labels[to]; G.mode = 'idle'; step(); }
function updateCam(instant) {
  const e = G.ex, m = e.map, p = e.player;
  const tx = camClamp(p.px + 8 - W / 2, m.w * TS, W), ty = camClamp(p.py + 8 - H / 2, m.h * TS, H);
  if (instant) { G.camX = tx; G.camY = ty; } else { G.camX = lerp(G.camX, tx, 0.2); G.camY = lerp(G.camY, ty, 0.2); }
}

// ===== 그리기 =====
function drawWorld() {
  if (G.bg === 'black' || !MAPS[G.bg]) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); return; }
  const m = MAPS[G.bg], c = mapCanvas(m);
  const ox = Math.round(-G.camX + (G.shake > 0 ? irnd(-3, 3) : 0)), oy = Math.round(-G.camY);
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  ctx.drawImage(c, ox, oy);
  if (G.ex && G.ex.map === m) {
    const ents = [...G.ex.npcs, G.ex.player].sort((a, b) => a.py - b.py);
    for (const a of ents) {
      const sh = getSprite(a.id);
      ctx.drawImage(sh, (a.frame || 0) * SPR_W, a.dir * SPR_H, SPR_W, SPR_H, Math.round(a.px + ox), Math.round(a.py + oy - 9), SPR_W, SPR_H);
    }
    Magic.drawWorld(ox, oy);
    if (G.mode === 'explore') { // 상호작용 표시
      const p = G.ex.player, [dx, dy] = DV[p.dir];
      const n = G.ex.npcs.find(n => n.x === p.x + dx && n.y === p.y + dy && n.to) || G.ex.objs.find(o => o.x === p.x + dx && o.y === p.y + dy);
      if (n) { const bob = Math.sin(performance.now() / 150) * 2; ctx.fillStyle = '#ffe28a'; ctx.fillRect(Math.round((n.px ?? n.x * TS) + ox + 6), Math.round((n.py ?? n.y * TS) + oy - 14 + bob), 4, 6); ctx.fillRect(Math.round((n.px ?? n.x * TS) + ox + 6), Math.round((n.py ?? n.y * TS) + oy - 6 + bob), 4, 2); }
    }
  }
  if (G.tint) { ctx.fillStyle = G.tint; ctx.fillRect(0, 0, W, H); }
  // 횃불·벽난로 불빛
  if (m.lights && m.lights.length) {
    const t = performance.now() / 1000;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const L of m.lights) {
      const x = L.x + ox, y = L.y + oy; if (x < -60 || y < -60 || x > W + 60 || y > H + 60) continue;
      const r = L.r * (1 + Math.sin(t * 7 + L.ph) * 0.05 + Math.sin(t * 13 + L.ph) * 0.03);
      const gr = ctx.createRadialGradient(x, y, 2, x, y, r);
      const col = L.col || '255,160,70', a = G.tint ? 0.32 : 0.16;
      gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = gr; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
    ctx.restore();
  }
  if (G.ex && G.ex.map === m) { Magic.drawDark(ox, oy); Magic.drawFloats(ox, oy); }
  // 떠다니는 먼지 / 반딧불
  if (G.tint) {
    const t = performance.now() / 1000;
    for (let i = 0; i < 14; i++) {
      const px = (i * 61.7 + Math.sin(t * 0.7 + i) * 18 + t * 4) % W, py = (i * 37.3 + Math.cos(t * 0.5 + i * 2) * 12 + 216) % H;
      ctx.fillStyle = `rgba(255,240,170,${0.25 + 0.25 * Math.sin(t * 3 + i)})`; ctx.fillRect(px | 0, py | 0, 1, 1);
    }
  }
}
function drawCG() {
  const cg = G.cg; if (!cg) return;
  const img = Img.get('cg/' + cg.id + '.png');
  if (img) { ctx.imageSmoothingEnabled = img.width > W * 1.5; ctx.drawImage(img, 0, 0, W, H); ctx.imageSmoothingEnabled = false; return; }
  // 대체 CG: 배경을 어둡게 + 등장인물 크게
  ctx.fillStyle = 'rgba(8,10,20,.7)'; ctx.fillRect(0, 0, W, H);
  const n = cg.chars.length, size = n <= 2 ? 144 : n === 3 ? 112 : 88, gap = size + (n <= 2 ? 16 : 6);
  cg.chars.forEach((id, i) => {
    const [cid, emo] = id.split(':'); const p = getPortrait(cid, emo || 'normal'); if (!p) return;
    const w = Math.round(p.width * size / p.height);
    const x = W / 2 + (i - (n - 1) / 2) * gap - w / 2;
    ctx.imageSmoothingEnabled = isIllust(p); ctx.drawImage(p, Math.round(x), 152 - size, w, size); ctx.imageSmoothingEnabled = false;
  });
  for (let i = 0; i < 18; i++) { ctx.fillStyle = i % 2 ? '#e8f0ff' : '#ffe28a'; const t = performance.now() / 1000; ctx.fillRect((i * 47 + t * 9) % W, (i * 29 + Math.sin(t + i) * 10 + 216) % 140, 2, 2); }
  if (cg.cap) { ctx.fillStyle = 'rgba(0,0,0,.5)'; ctx.fillRect(0, 4, W, 18); txt('✦ ' + cg.cap, W / 2, 7, '#e8e0c0', 'center'); }
}
function drawSay() {
  const s = G.say; if (!s) return;
  const L = s.L, isDraco = L.id === PLAYER;
  const por = L.id ? getPortrait(L.id, L.emo) : null;
  if (por && !G.cg) {
    if (isIllust(por)) {
      // 일러스트: 크게, 아랫부분은 대사창 뒤로 (비주얼노벨식)
      const ph = 176, pw = Math.round(por.width * ph / por.height);
      const x = isDraco ? -8 : W - pw + 8;
      ctx.imageSmoothingEnabled = por.height !== ph;
      ctx.drawImage(por, x, 176 - ph, pw, ph);
      ctx.imageSmoothingEnabled = false;
    } else {
      const ph = 128, pw = Math.round(por.width * ph / por.height);
      ctx.drawImage(por, isDraco ? 6 : W - pw - 6, 150 - ph, pw, ph);
    }
  }
  panel(4, 148, W - 8, 64, 0.97);
  let tx = 14;
  if (por && G.cg) { ctx.imageSmoothingEnabled = isIllust(por); ctx.drawImage(por, 10, 154, 52, 52); ctx.imageSmoothingEnabled = false; tx = 70; }
  if (L.name) {
    const nm = L.thought ? L.name + ' (속마음)' : L.name, nw = tw(nm) + 14;
    const nx = isDraco || !por ? 10 : W - 10 - nw;
    panel(nx, 134, nw, 17, 1);
    txt(nm, nx + 7, 137, isDraco ? '#ffd8c8' : L.id === 'draco' ? '#e8f0d0' : '#ffe8b0');
  }
  const col = L.thought ? '#a8c8e8' : (L.name ? '#f4f4f8' : '#e0d8c0');
  const page = s.pages[s.page]; let left = Math.floor(s.shown);
  page.forEach((line, i) => {
    if (left <= 0) return;
    const part = [...line].slice(0, left).join(''); left -= [...line].length;
    txt(part, tx, 156 + i * LH, col);
  });
  if (s.shown >= pageLen(s)) { const b = Math.floor(performance.now() / 300) % 2; ctx.fillStyle = '#c9d1e0'; ctx.fillRect(W - 18, 200 + b, 6, 3); ctx.fillRect(W - 17, 203 + b, 4, 1); }
}
function pageLen(s) { return s.pages[s.page].reduce((a, l) => a + [...l].length, 0); }
function drawChoice() {
  const c = G.choice; if (!c) return;
  const h = c.opts.length * 20 + 12, y = Math.max(24, Math.min(130 - h, 110 - h / 2));
  panel(48, y, W - 96, h);
  c.opts.forEach((o, i) => {
    const on = i === c.sel, oy = y + 8 + i * 20;
    if (on) { ctx.fillStyle = 'rgba(47,138,78,.45)'; ctx.fillRect(54, oy - 2, W - 108, 18); }
    txt((on ? '▶ ' : '  ') + o.text, 60, oy + 1, on ? '#ffe28a' : '#e8e8f0');
  });
  c.rect = { y, h };
}
function drawHud() {
  if (G.goal && (G.mode === 'explore' || G.mode === 'idle')) {
    const lines = wrap(G.goal, W - 70).slice(0, 2), w = Math.max(...lines.map(tw)) + 20;
    panel(4, 4, w, 6 + lines.length * 14, 0.8); lines.forEach((l, i) => txt(l, 12, 7 + i * 14, '#ffe28a'));
    G.goalH = 10 + lines.length * 14;
  } else G.goalH = 4;
  if (G.mode === 'explore' && G.ex) { const nm = G.ex.map.name; txt(nm, W - 8, H - 16, '#c9d1e0aa', 'right'); Magic.drawHud(); }
  let y = Math.max(28, (G.goalH || 4) + 4);
  for (const t of G.toasts.slice(-4)) {
    const a = Math.min(1, t.t), w = Math.min(W - 16, tw(t.text) + 16);
    ctx.globalAlpha = a; panel(W - 6 - w, y, w, 18, 0.88); txt(t.text, W - w + 2, y + 3, t.col); ctx.globalAlpha = 1; y += 20;
  }
}
function drawCard() {
  const c = G.card; ctx.fillStyle = '#05060a'; ctx.fillRect(0, 0, W, H);
  const a = clamp(c.t / 0.8, 0, 1) * clamp((4 - c.t) / 0.6, 0, 1); ctx.globalAlpha = a;
  for (let i = 0; i < 40; i++) { ctx.fillStyle = i % 3 ? '#9ab0ff' : '#fff'; ctx.fillRect((i * 97) % W, (i * 53) % H, 1, 1); }
  bigTxt(c.year, W / 2, 56, 2, '#9ad0b0');
  bigTxt(c.title, W / 2, 86, 3, '#f1ecd2');
  txt(c.sub, W / 2, 138, '#c9d1e0', 'center');
  ctx.fillStyle = '#2f8a4e'; ctx.fillRect(W / 2 - 60, 130, 120, 1);
  ctx.globalAlpha = 1;
}

// ===== 일시정지 메뉴 =====
function openPause() { G.pause = { sel: 0, page: 'main', prevMode: G.mode }; G.mode = 'pause'; Snd.sfx('sel'); }
const PAUSE_ITEMS = ['계속하기', '주문책', '관계 / 수집', '설정', '타이틀로'];
function updatePause() {
  const p = G.pause;
  if (p.page === 'book') { updateBook(p); return; }
  if (p.page !== 'main') { if (p.page === 'settings') { if (updateSettings(p)) p.page = 'main'; return; } if (Input.ok() || Input.pressed.b || Input.pressed.menu) p.page = 'main'; return; }
  const n = PAUSE_ITEMS.length;
  if (Input.pressed.up) { p.sel = (p.sel + n - 1) % n; Snd.sfx('sel'); }
  if (Input.pressed.down) { p.sel = (p.sel + 1) % n; Snd.sfx('sel'); }
  if (Input.tap) for (let i = 0; i < n; i++) if (inRect(Input.tap, 132, 58 + i * 22, 120, 20)) { p.sel = i; Input.pressed.a = true; }
  if (Input.pressed.b || Input.pressed.menu) { G.mode = p.prevMode; G.pause = null; return; }
  if (Input.pressed.a) {
    Snd.sfx('ok');
    if (p.sel === 0) { G.mode = p.prevMode; G.pause = null; }
    if (p.sel === 1) { p.page = 'book'; p.bsel = Math.max(0, Magic.known().indexOf(Magic.current())); }
    if (p.sel === 2) p.page = 'stats';
    if (p.sel === 3) { p.page = 'settings'; p.ssel = 0; }
    if (p.sel === 4) toTitle();
  }
}
function drawPause() {
  const p = G.pause; ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, W, H);
  if (p.page === 'stats') return drawStats();
  if (p.page === 'settings') return drawSettings(p);
  if (p.page === 'book') return drawBook(p);
  panel(120, 34, 144, 134); bigTxt('일시정지', W / 2, 38, 1, '#9ad0b0');
  PAUSE_ITEMS.forEach((s, i) => txt((i === p.sel ? '▶ ' : '  ') + s, 140, 60 + i * 22, i === p.sel ? '#ffe28a' : '#e8e8f0'));
  txt('체크포인트에서 자동 저장됩니다', W / 2, 170, '#9ab0d0', 'center');
}
function drawStats() {
  panel(40, 20, W - 80, 176);
  bigTxt('관계 / 상태', W / 2, 26, 1, '#9ad0b0');
  const rows = [['draco', '드레이코 말포이', '#c8e8ff'], ['hermione', '헤르미온느 그레인저', '#ffb88a'], ['ron', '론 위즐리', '#ffd08a'], ['courage', '용기', '#ffe28a']];
  rows.forEach(([k, nm, col], i) => {
    const v = G.flags[k] || 0, y = 54 + i * 28;
    const por = getPortrait(k === 'courage' ? 'harry' : k, k === 'draco' ? 'smirk' : 'normal');
    if (por) { ctx.imageSmoothingEnabled = isIllust(por); ctx.drawImage(por, 52, y - 4, 20, 20); ctx.imageSmoothingEnabled = false; }
    txt(nm, 80, y, '#e8e8f0');
    const max = k === 'draco' ? 50 : 15;
    ctx.fillStyle = '#222'; ctx.fillRect(200, y + 3, 120, 8);
    ctx.fillStyle = col; ctx.fillRect(200, y + 3, clamp(v / max, 0, 1) * 120, 8);
    txt(String(v), 328, y, col);
  });
  const cards = (G.flags._cards || '').split('|').filter(Boolean).length;
  txt(`배운 주문 ${Magic.known().length} / ${SPELL_ORDER.length}    개구리 초콜릿 카드 ${cards} / ${CARDS.length}`, W / 2, 166, '#c8f0ff', 'center');
  txt('A / B : 돌아가기', W / 2, 180, '#9ab0d0', 'center');
}
function updateSettings(p) {
  const n = 4;
  if (Input.pressed.up) p.ssel = (p.ssel + n - 1) % n; if (Input.pressed.down) p.ssel = (p.ssel + 1) % n;
  if (Input.tap) for (let i = 0; i < n; i++) if (inRect(Input.tap, 70, 56 + i * 24, 244, 22)) { p.ssel = i; Input.pressed.a = true; }
  const lr = Input.pressed.left ? -1 : Input.pressed.right || Input.pressed.a ? 1 : 0;
  if (lr) {
    Snd.sfx('sel');
    if (p.ssel === 0) Settings.textSpeed = (Settings.textSpeed + lr + 3) % 3;
    if (p.ssel === 1) Settings.music = !Settings.music;
    if (p.ssel === 2) Settings.sound = !Settings.sound;
    if (p.ssel === 3 && Input.pressed.a) { saveSettings(); return true; }
    saveSettings();
  }
  if (Input.pressed.b || Input.pressed.menu) { saveSettings(); return true; }
  return false;
}
function drawSettings(p) {
  panel(60, 30, W - 120, 150); bigTxt('설정', W / 2, 34, 1, '#9ad0b0');
  const items = [`글자 속도 : ${['느림', '보통', '빠름'][Settings.textSpeed]}`, `배경음악 : ${Settings.music ? '켜기' : '끄기'}`, `효과음 : ${Settings.sound ? '켜기' : '끄기'}`, '돌아가기'];
  items.forEach((s, i) => txt((i === p.ssel ? '▶ ' : '  ') + s, 80, 60 + i * 24, i === p.ssel ? '#ffe28a' : '#e8e8f0'));
  txt('← → 또는 A로 변경', W / 2, 160, '#9ab0d0', 'center');
}

// ===== 엔딩 =====
const ENDINGS = {
  true: { name: '은빛 운명', sub: '드레이코 엔딩', col: '#ffe28a' },
  rival: { name: '영원한 라이벌', sub: '라이벌 엔딩', col: '#9ad0b0' },
  normal: { name: '승강장 건너편', sub: '노멀 엔딩', col: '#c9d1e0' },
};
function showEnding(id) {
  const sys = Store.get('tsm_sys', { endings: [], chapters: {} });
  if (!sys.endings.includes(id)) sys.endings.push(id);
  Store.set('tsm_sys', sys);
  G.ending = { id, t: 0 }; G.mode = 'ending'; G.cg = null;
  Snd.music(id === 'normal' ? 'sad' : 'title');
  if (TEST) { window.__TEST_ENDING = id; }
}
function drawEnding() {
  const e = G.ending, d = ENDINGS[e.id] || ENDINGS.normal;
  ctx.fillStyle = '#05060a'; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 60; i++) { ctx.fillStyle = i % 4 ? '#9ab0ff' : '#fff'; ctx.fillRect((i * 97 + e.t * (i % 5)) % W, (i * 53) % H, 1, 1); }
  const a = clamp(e.t / 1.2, 0, 1); ctx.globalAlpha = a;
  txt('ENDING', W / 2, 40, '#9ab0d0', 'center');
  bigTxt(d.name, W / 2, 62, 3, d.col);
  txt('— ' + d.sub + ' —', W / 2, 112, '#e8e8f0', 'center');
  const sys = Store.get('tsm_sys', { endings: [] });
  txt(`발견한 엔딩 ${sys.endings.filter(e => ENDINGS[e]).length} / ${Object.keys(ENDINGS).length}`, W / 2, 140, '#c9d1e0', 'center');
  if (e.t > 2) txt('A 버튼을 눌러 타이틀로', W / 2, 180, '#ffe28a', 'center');
  ctx.globalAlpha = 1;
}

// ===== 타이틀 =====
function toTitle() {
  G.scene = 'title'; G.mode = 'idle'; G.ex = null; G.cg = null; G.say = null; G.choice = null; G.pause = null; G.toasts = [];
  G.title = { sel: 0, t: 0, sub: null };
  Snd.music('title');
}
function titleItems() {
  const has = !!Store.get('tsm_save', null);
  return [['새로 시작', 'new'], ['이어하기', has ? 'cont' : null], ['장 선택', 'chap'], ['설정', 'set']];
}
function updateTitle(dt) {
  const T = G.title; T.t += dt;
  if (T.sub === 'set') { if (updateSettings(T)) T.sub = null; return; }
  if (T.sub === 'chap') return updateChapterSelect(T);
  const items = titleItems();
  if (Input.pressed.up) { T.sel = (T.sel + items.length - 1) % items.length; Snd.sfx('sel'); }
  if (Input.pressed.down) { T.sel = (T.sel + 1) % items.length; Snd.sfx('sel'); }
  if (Input.tap) items.forEach((_, i) => { if (inRect(Input.tap, 224, 116 + i * 19, 140, 18)) { T.sel = i; Input.pressed.a = true; } });
  if (Input.pressed.a && T.t > 0.3) {
    const act = items[T.sel][1];
    if (!act) { Snd.sfx('no'); return; }
    Snd.sfx('ok');
    if (act === 'new') newGame();
    if (act === 'cont') { const s = Store.get('tsm_save', null); startAt(s.pc, s.flags, s); }
    if (act === 'chap') { T.sub = 'chap'; T.csel = 0; }
    if (act === 'set') { T.sub = 'set'; T.ssel = 0; }
  }
}
function updateChapterSelect(T) {
  const sys = Store.get('tsm_sys', { endings: [], chapters: {} });
  const n = Script.chapters.length;
  if (Input.pressed.up) T.csel = (T.csel + n) % (n + 1); if (Input.pressed.down) T.csel = (T.csel + 1) % (n + 1);
  if (Input.tap) for (let i = 0; i <= n; i++) if (inRect(Input.tap, 80, 40 + i * 18, 224, 17)) { T.csel = i; Input.pressed.a = true; }
  if (Input.pressed.b) { T.sub = null; return; }
  if (Input.pressed.a) {
    if (T.csel === n) { T.sub = null; return; }
    const c = sys.chapters[T.csel];
    if (!c) { Snd.sfx('no'); return; }
    Snd.sfx('ok'); startAt(c.pc, c.flags);
  }
}
function drawTitle() {
  const T = G.title, t = T.t;
  const gr = ctx.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#05081a'); gr.addColorStop(1, '#1a2a4a');
  ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 80; i++) { const tw2 = (Math.sin(t * 2 + i) + 1) / 2; ctx.fillStyle = `rgba(220,230,255,${0.3 + tw2 * 0.7})`; ctx.fillRect((i * 97) % W, (i * 53) % 130, 1, 1); }
  ctx.fillStyle = '#e8e8d0'; ctx.fillRect(310, 24, 14, 14); ctx.fillStyle = '#05081a'; ctx.fillRect(315, 22, 12, 12);
  // 성 실루엣
  ctx.fillStyle = '#0a0e1c';
  const tw3 = [[20, 120, 18, 100], [40, 100, 14, 120], [56, 130, 40, 90], [96, 86, 16, 140], [112, 120, 50, 100], [160, 70, 18, 150], [178, 110, 60, 110], [238, 90, 14, 130], [252, 124, 46, 100], [298, 100, 16, 120], [314, 130, 50, 90]];
  for (const [x, y, w, h] of tw3) { ctx.fillRect(x, y + 40, w, h); for (let i = 0; i < w / 2; i++) ctx.fillRect(x + i, y + 40 - (w / 2 - i) * 0.9, w - i * 2, 1); }
  ctx.fillStyle = '#ffd36a';
  for (const [x, y] of [[100, 150], [166, 120], [190, 160], [244, 140], [260, 170], [120, 175], [305, 155]]) ctx.fillRect(x, y, 2, 3);
  ctx.fillStyle = '#0c1424'; ctx.fillRect(0, 200, W, 16);
  // 드레이코 실루엣 초상
  const por = getPortrait('draco', 'smirk');
  if (por) { const sz = isIllust(por) ? 200 : 128; ctx.imageSmoothingEnabled = isIllust(por) && por.height !== sz; ctx.drawImage(por, -10, H - sz + (isIllust(por) ? 14 : 0), sz, sz); ctx.imageSmoothingEnabled = false; }
  if (T.sub === 'set') return drawSettings(T);
  if (T.sub === 'chap') return drawChapterSelect(T);
  bigTxt('TS 말포이', 282, 24, 3, '#f1ecd2', 'center', '#2f8a4e');
  bigTxt('은빛 운명', 282, 74, 2, '#9ad0b0', 'center', '#000');
  titleItems().forEach(([s, act], i) => {
    const on = i === T.sel, y = 118 + i * 19;
    txt((on ? '▶ ' : '  ') + s, 244, y, !act ? '#555' : on ? '#ffe28a' : '#e8e8f0');
  });
  txt('비공식 2차 창작 팬게임 · 비영리', W - 6, H - 14, '#6a7a9a', 'right');
}
function drawChapterSelect(T) {
  const sys = Store.get('tsm_sys', { endings: [], chapters: {} });
  panel(70, 22, W - 140, 22 + (Script.chapters.length + 1) * 18 + 4);
  txt('장 선택 (한 번 본 장부터 다시 시작)', W / 2, 26, '#9ad0b0', 'center');
  Script.chapters.forEach((ci, i) => {
    const L = Script.lines[ci], open = !!sys.chapters[i], on = T.csel === i;
    txt((on ? '▶ ' : '  ') + (open ? `${L.year}  ${L.title}` : '???'), 84, 44 + i * 18, on ? '#ffe28a' : open ? '#e8e8f0' : '#555');
  });
  const i = Script.chapters.length; txt((T.csel === i ? '▶ ' : '  ') + '돌아가기', 84, 44 + i * 18, T.csel === i ? '#ffe28a' : '#e8e8f0');
}

// ===== 메인 업데이트 =====
function update(dt) {
  if (G.scene === 'title') return updateTitle(dt);
  for (const t of G.toasts) t.t -= dt; G.toasts = G.toasts.filter(t => t.t > 0);
  if (G.shake > 0) G.shake -= dt; if (G.flash > 0) G.flash -= dt;
  if (G.fadeDir) { G.fade += G.fadeDir * dt * 2.2; if (G.fade >= 1) { G.fade = 1; G.fadeDir = -1; if (G.mode === 'fade') { G.mode = 'idle'; step(); } } if (G.fade <= 0) { G.fade = 0; G.fadeDir = 0; } }
  if (G.cg) G.cg.t += dt;
  switch (G.mode) {
    case 'say': {
      if (Input.pressed.menu) { openPause(); return; }
      const s = G.say, len = pageLen(s), spd = [28, 48, 90][Settings.textSpeed];
      const fast = Input.held.b;
      if (s.shown < len) {
        const before = Math.floor(s.shown);
        s.shown = TEST ? len : Math.min(len, s.shown + dt * (fast ? 400 : spd));
        if (Math.floor(s.shown) !== before && Math.floor(s.shown) % 2 === 0) { if (Snd.ac && Settings.sound) { const c = CHARS[s.L.id]; Snd.tone(620 * (c ? c.voice : 1) + Math.random() * 40, Snd.ac.currentTime, 0.03, 'square', 0.02); } }
        if (Input.ok() && !fast) s.shown = len;
      } else if (Input.ok() || fast || TEST) {
        if (s.page < s.pages.length - 1) { s.page++; s.shown = 0; }
        else if (G.sayReturn) { G.mode = G.sayReturn; G.sayReturn = null; G.say = null; }
        else { G.lastSay = s; G.say = null; G.mode = 'idle'; step(); }
      }
      break;
    }
    case 'choice': {
      const c = G.choice; c.t += dt;
      if (Input.pressed.up) { c.sel = (c.sel + c.opts.length - 1) % c.opts.length; Snd.sfx('sel'); }
      if (Input.pressed.down) { c.sel = (c.sel + 1) % c.opts.length; Snd.sfx('sel'); }
      let pick = Input.pressed.a && c.t > 0.25;
      if (Input.tap && c.rect) c.opts.forEach((_, i) => { if (inRect(Input.tap, 48, c.rect.y + 6 + i * 20, W - 96, 20)) { c.sel = i; pick = c.t > 0.25; } });
      if (TEST) { c.sel = (window.__TEST_PICK || (() => 0))(c.opts); pick = true; }
      if (pick) {
        const o = c.opts[c.sel]; Snd.sfx('ok'); G.choice = null; G.lastSay = null; G.mode = 'idle';
        applyFx(o.fx); if (o.to) G.pc = Script.labels[o.to];
        step();
      }
      break;
    }
    case 'wait': G.waitT -= dt; if (G.waitT <= 0) { G.mode = 'idle'; step(); } break;
    case 'card': G.card.t += dt; if (G.card.t > 4.2 || (G.card.t > 1 && Input.ok()) || TEST) { G.card = null; G.mode = 'idle'; G.fade = 1; G.fadeDir = -1; step(); } break;
    case 'explore': updateExplore(dt); if (G.ex) updateCam(false); break;
    case 'move': {
      const a = G.moveActor;
      if (!a.moving) {
        if (!a.path.length) { a.frame = 0; G.mode = 'idle'; step(); break; }
        const d = { u: 3, d: 0, l: 1, r: 2 }[a.path[0]]; a.path = a.path.slice(1);
        a.dir = d; const [dx, dy] = DV[d]; a.x += dx; a.y += dy; a.moving = 1; a.ft = 0;
      }
      if (stepActor(a, TEST ? 10 : dt) && TEST) a.moving = 0;
      if (G.ex && a === G.ex.player) updateCam(false);
      break;
    }
    case 'mini': Mini.update(dt); break;
    case 'pause': updatePause(); break;
    case 'ending': G.ending.t += dt; if ((G.ending.t > 2 && Input.ok()) || (TEST && G.ending.t > 0)) toTitle(); break;
  }
}
function draw() {
  ctx.imageSmoothingEnabled = false;
  if (G.scene === 'title') { drawTitle(); return; }
  if (G.mode === 'mini') { Mini.draw(); }
  else if (G.mode === 'card') drawCard();
  else if (G.mode === 'ending') drawEnding();
  else {
    drawWorld(); drawCG();
    if (G.mode === 'say') drawSay();
    if (G.mode === 'choice') { if (G.lastSay) { const s = G.say; G.say = G.lastSay; drawSay(); G.say = s; } drawChoice(); }
    drawHud();
    if (G.mode === 'pause') drawPause();
  }
  if (G.flash > 0) { ctx.globalAlpha = clamp(G.flash * 2, 0, 1); ctx.fillStyle = G.flashCol; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (G.fade > 0) { ctx.fillStyle = `rgba(0,0,0,${G.fade})`; ctx.fillRect(0, 0, W, H); }
}

// ===== 주문책 =====
function updateBook(p) {
  const k = Magic.known();
  if (Input.pressed.b || Input.pressed.menu) { p.page = 'main'; return; }
  if (!k.length) { if (Input.ok()) p.page = 'main'; return; }
  if (Input.pressed.up) p.bsel = (p.bsel + k.length - 1) % k.length;
  if (Input.pressed.down) p.bsel = (p.bsel + 1) % k.length;
  if (Input.pressed.left) p.bsel = Math.max(0, p.bsel - 8);
  if (Input.pressed.right) p.bsel = Math.min(k.length - 1, p.bsel + 8);
  if (Input.tap) k.forEach((_, i) => { const col = Math.floor(i / 8), row = i % 8; if (inRect(Input.tap, 22 + col * 120, 34 + row * 15, 118, 14)) { p.bsel = i; Input.pressed.a = true; } });
  if (Input.pressed.a) { G.flags._cur = k[p.bsel]; Snd.sfx('ok'); G.toasts.push({ text: `장착: ${SPELLS[k[p.bsel]].name}`, col: SPELLS[k[p.bsel]].col, t: 1.6 }); }
}
function drawBook(p) {
  panel(14, 8, W - 28, H - 30);
  bigTxt('주문책', W / 2, 12, 1, '#9ad0b0');
  const k = Magic.known();
  if (!k.length) { txt('아직 배운 주문이 없다.', W / 2, 90, '#c9d1e0', 'center'); return; }
  k.forEach((id, i) => {
    const col = Math.floor(i / 8), row = i % 8, x = 24 + col * 120, y = 34 + row * 15, S = SPELLS[id], on = i === p.bsel;
    if (on) { ctx.fillStyle = 'rgba(47,138,78,.45)'; ctx.fillRect(x - 3, y - 2, 118, 14); }
    ctx.fillStyle = S.col; ctx.fillRect(x, y + 3, 6, 6);
    txt((id === Magic.current() ? '★' : '') + (S.short || S.name), x + 10, y, on ? '#ffe28a' : '#e8e8f0');
  });
  const S = SPELLS[k[p.bsel]];
  if (S) { const lines = wrap(S.name + ' — ' + S.desc, W - 60); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(22, 156, W - 44, 32); lines.slice(0, 2).forEach((l, i) => txt(l, 28, 158 + i * 15, '#c8f0ff')); }
  txt('A: 장착   B: 닫기   (탐험 중 ✦/C: 시전 · ⇄/V: 주문 바꾸기)', W / 2, H - 18, '#9ab0d0', 'center');
}

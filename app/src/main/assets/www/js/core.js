'use strict';
// ===== 기본 화면 / 유틸 =====
const W = 384, H = 216, TS = 16;
const FONT = '12px Galmuri11';
const LH = 15; // 줄 간격
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');
cv.width = W; cv.height = H;
const TEST = /[?&]test/.test(location.search);

function fit() {
  const dpr = window.devicePixelRatio || 1;
  const s = Math.min(innerWidth * dpr / W, innerHeight * dpr / H);
  const k = s >= 1 ? Math.floor(s) : s;
  cv.style.width = (W * k / dpr) + 'px';
  cv.style.height = (H * k / dpr) + 'px';
}
addEventListener('resize', fit);
fit();

const rnd = (a, b) => a + Math.random() * (b - a);
const irnd = (a, b) => Math.floor(rnd(a, b + 1));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
function seeded(s) {
  s = s % 2147483647; if (s <= 0) s += 2147483646;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

// ===== 텍스트 =====
function txt(s, x, y, col = '#fff', align = 'left', shadow = 'rgba(0,0,0,.65)') {
  ctx.font = FONT; ctx.textAlign = align; ctx.textBaseline = 'top';
  x = Math.round(x); y = Math.round(y);
  if (shadow) { ctx.fillStyle = shadow; ctx.fillText(s, x + 1, y + 1); }
  ctx.fillStyle = col; ctx.fillText(s, x, y);
}
function tw(s) { ctx.font = FONT; return ctx.measureText(s).width; }
// 큰 글씨: 12px로 그린 뒤 정수배 확대 (도트 유지)
const _big = mk(1, 1), _bg = _big.getContext('2d');
function bigTxt(s, x, y, scale, col = '#fff', align = 'center', shadow = '#000') {
  _bg.font = FONT;
  const w = Math.ceil(_bg.measureText(s).width) + 2, h = 15;
  _big.width = w; _big.height = h;
  _bg.font = FONT; _bg.textBaseline = 'top';
  if (shadow) { _bg.fillStyle = shadow; _bg.fillText(s, 1, 1); }
  _bg.fillStyle = col; _bg.fillText(s, 0, 0);
  let dx = x;
  if (align === 'center') dx = x - (w * scale) / 2;
  else if (align === 'right') dx = x - w * scale;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(_big, Math.round(dx), Math.round(y), w * scale, h * scale);
}
function wrap(s, maxW) {
  ctx.font = FONT;
  const out = [];
  for (const para of String(s).split('\n')) {
    let line = '';
    for (const w of para.split(' ')) {
      const test = line ? line + ' ' + w : w;
      if (ctx.measureText(test).width <= maxW) { line = test; continue; }
      if (line) { out.push(line); line = ''; }
      let cur = '';
      for (const ch of w) {
        if (ctx.measureText(cur + ch).width > maxW) { out.push(cur); cur = ch; } else cur += ch;
      }
      line = cur;
    }
    out.push(line);
  }
  return out;
}
// 슬리데린풍 패널
function panel(x, y, w, h, alpha = 0.92) {
  x = Math.round(x); y = Math.round(y); w = Math.round(w); h = Math.round(h);
  ctx.fillStyle = `rgba(12,16,24,${alpha})`; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = '#c9d1e0';
  ctx.fillRect(x + 1, y, w - 2, 1); ctx.fillRect(x + 1, y + h - 1, w - 2, 1);
  ctx.fillRect(x, y + 1, 1, h - 2); ctx.fillRect(x + w - 1, y + 1, 1, h - 2);
  ctx.fillStyle = '#2f8a4e';
  ctx.fillRect(x + 2, y + 2, w - 4, 1); ctx.fillRect(x + 2, y + h - 3, w - 4, 1);
  ctx.fillRect(x + 2, y + 2, 1, h - 4); ctx.fillRect(x + w - 3, y + 2, 1, h - 4);
}
function inRect(p, x, y, w, h) { return p && p.x >= x && p.x < x + w && p.y >= y && p.y < y + h; }

// ===== 입력 =====
const KEYMAP = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right', KeyZ: 'a', Enter: 'a', Space: 'a', KeyX: 'b', Backspace: 'b',
  ShiftLeft: 'b', Escape: 'menu', KeyM: 'menu', KeyC: 'spell', KeyJ: 'spell', KeyV: 'swap', KeyK: 'swap', Tab: 'swap',
};
const DIRS = ['up', 'down', 'left', 'right'];
const Input = {
  held: {}, pressed: {}, tap: null, rep: {},
  press(k) { if (!this.held[k]) { this.pressed[k] = true; this.rep[k] = 0; } this.held[k] = true; Snd.unlock(); },
  release(k) { this.held[k] = false; },
  update(dt) { // 방향키 길게 누르면 반복
    for (const d of DIRS) {
      if (!this.held[d]) continue;
      this.rep[d] = (this.rep[d] || 0) + dt;
      if (this.rep[d] > 0.38) { this.pressed[d] = true; this.rep[d] = 0.38 - 0.11; }
    }
  },
  endFrame() { this.pressed = {}; this.tap = null; },
  ok() { return this.pressed.a || !!this.tap; },
  axis() {
    return { x: (this.held.right ? 1 : 0) - (this.held.left ? 1 : 0), y: (this.held.down ? 1 : 0) - (this.held.up ? 1 : 0) };
  },
  clearAll() { this.held = {}; this.pressed = {}; this.tap = null; },
};
addEventListener('keydown', e => {
  const k = KEYMAP[e.code]; if (!k) return;
  e.preventDefault(); if (!e.repeat) Input.press(k);
});
addEventListener('keyup', e => { const k = KEYMAP[e.code]; if (k) Input.release(k); });
addEventListener('blur', () => Input.clearAll());
cv.addEventListener('pointerdown', e => {
  const r = cv.getBoundingClientRect();
  Input.tap = { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * H / r.height };
  Snd.unlock();
});

// 터치 패드
(function setupPad() {
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || /android/i.test(navigator.userAgent);
  if (isTouch) document.body.classList.add('touch');
  const dpad = document.getElementById('dpad');
  const arms = {}; for (const d of DIRS) arms[d] = dpad.querySelector('.' + d);
  let cur = null, pid = null;
  function setDir(d) {
    if (d === cur) return;
    if (cur) { Input.release(cur); arms[cur].classList.remove('on'); }
    cur = d;
    if (d) { Input.press(d); arms[d].classList.add('on'); }
  }
  function fromEvent(e) {
    const r = dpad.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) < 12) return null;
    return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  }
  dpad.addEventListener('pointerdown', e => { pid = e.pointerId; dpad.setPointerCapture(pid); setDir(fromEvent(e)); e.preventDefault(); });
  dpad.addEventListener('pointermove', e => { if (e.pointerId === pid) setDir(fromEvent(e)); });
  const end = e => { if (e.pointerId === pid) { pid = null; setDir(null); } };
  dpad.addEventListener('pointerup', end); dpad.addEventListener('pointercancel', end);
  document.querySelectorAll('[data-k]').forEach(el => {
    const k = el.dataset.k;
    el.addEventListener('pointerdown', e => { el.setPointerCapture(e.pointerId); el.classList.add('on'); Input.press(k); e.preventDefault(); });
    const up = () => { el.classList.remove('on'); Input.release(k); };
    el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
  });
})();
window.onAndroidBack = () => { Input.press('menu'); setTimeout(() => Input.release('menu'), 60); };

// ===== 저장 =====
const Store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* 저장 불가 환경 */ } },
};
const Settings = Object.assign({ textSpeed: 1, sound: true, music: true }, Store.get('tsm_settings', {}));
function saveSettings() { Store.set('tsm_settings', Settings); }

// ===== 일러스트 로더 =====
// img/manifest.js 의 ILLUST_FILES 목록에 있는 파일만 불러온다 (없으면 도트 자동 생성 그림 사용)
const Img = {
  cache: {},
  init() {
    for (const f of (window.ILLUST_FILES || [])) {
      const im = new Image();
      im.onload = () => { this.cache[f] = im; };
      im.src = 'img/' + f;
    }
  },
  get(path) { return this.cache[path] || null; },
};

// ===== 사운드 (WebAudio 칩튠, 자작 멜로디) =====
const NOTE_IDX = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
function noteFreq(n) {
  const m = n.match(/^([A-G]#?)(\d)$/); if (!m) return 0;
  return 440 * Math.pow(2, (NOTE_IDX[m[1]] + (+m[2] + 1) * 12 - 69) / 12);
}
const TRACKS = {
  // 각 보이스: "음:박자" (박자 = 8분음표 단위), "_" = 쉼표
  title: { bpm: 84, v: [
    ['triangle', .09, 'A4:2 C5:2 E5:4 D5:2 C5:2 B4:4 A4:2 B4:2 C5:2 E5:2 G4:8 F4:2 A4:2 C5:4 B4:2 A4:2 G#4:4 A4:2 E5:2 D5:2 B4:2 A4:8'],
    ['square', .035, 'A2:4 E3:4 A2:4 E3:4 F2:4 C3:4 G2:4 D3:4 F2:4 C3:4 E2:4 B2:4 F2:4 C3:4 E2:4 A2:4'],
  ] },
  school: { bpm: 112, v: [
    ['square', .05, 'G4:2 B4:2 D5:2 B4:2 C5:2 E5:2 D5:4 B4:2 G4:2 A4:2 B4:2 A4:6 _:2 G4:2 B4:2 D5:2 G5:2 F#5:2 E5:2 D5:4 C5:2 B4:2 A4:2 F#4:2 G4:6 _:2'],
    ['triangle', .08, 'G2:4 D3:4 C3:4 G2:4 E2:4 D2:4 D2:4 A2:4 G2:4 B2:4 C3:4 G2:4 C3:4 D3:4 G2:8'],
  ] },
  slyth: { bpm: 92, v: [
    ['triangle', .09, 'E4:2 G4:2 B4:3 A4:1 G4:2 F#4:2 E4:4 B3:2 E4:2 G4:2 C5:2 B4:4 _:4 C5:2 B4:2 A4:2 G4:2 F#4:2 G4:2 A4:4 B4:2 G4:2 F#4:2 D#4:2 E4:8'],
    ['square', .03, 'E2:2 E3:2 E2:2 E3:2 C2:2 C3:2 C2:2 C3:2 A1:2 A2:2 A1:2 A2:2 B1:2 B2:2 B1:2 B2:2'],
  ] },
  tension: { bpm: 140, v: [
    ['square', .04, 'D4:1 D4:1 F4:2 D4:1 D4:1 G#4:2 D4:1 D4:1 A4:2 G#4:2 F4:2 D4:1 D4:1 F4:2 D4:1 D4:1 C5:2 A4:2 G#4:2 F4:2 E4:2'],
    ['sawtooth', .025, 'D2:1 D2:1 D2:1 D2:1 D2:1 D2:1 D2:1 D2:1 A#1:1 A#1:1 A#1:1 A#1:1 A1:1 A1:1 A1:1 A1:1'],
  ] },
  romance: { bpm: 76, v: [
    ['triangle', .1, 'C5:3 D5:1 E5:2 G5:2 F5:4 E5:2 D5:2 C5:2 A4:2 B4:2 C5:2 D5:8 E5:3 F5:1 G5:2 C6:2 B5:4 A5:2 G5:2 F5:2 E5:2 D5:2 B4:2 C5:8'],
    ['square', .025, 'F2:4 C3:4 F2:4 C3:4 G2:4 D3:4 G2:4 D3:4 A2:4 E3:4 F2:4 C3:4 G2:4 D3:4 C3:8'],
  ] },
  sad: { bpm: 66, v: [
    ['triangle', .1, 'A4:4 G4:2 F4:2 E4:4 _:2 C4:2 D4:4 E4:2 F4:2 E4:8 F4:4 E4:2 D4:2 C4:4 B3:2 C4:2 D4:4 B3:4 A3:8'],
    ['triangle', .05, 'D3:8 A2:8 F2:8 C3:8 D3:8 A2:8 E2:8 A2:8'],
  ] },
  dark: { bpm: 70, v: [
    ['sawtooth', .02, 'D2:8 D#2:8 D2:8 C#2:8'],
    ['triangle', .07, 'D4:4 _:4 F4:2 E4:2 D#4:4 _:4 D4:4 _:4 A3:2 A#3:2 A3:4 _:4'],
  ] },
  ball: { bpm: 132, v: [
    ['triangle', .1, 'D5:2 F#5:1 A5:3 G5:2 E5:1 C#5:3 D5:2 E5:1 F#5:3 E5:6 B4:2 D5:1 G5:3 F#5:2 D5:1 A4:3 B4:2 C#5:1 E5:3 D5:6'],
    ['square', .03, 'D3:2 A3:2 A3:2 A2:2 E3:2 E3:2 D3:2 A3:2 A3:2 A2:2 C#3:2 C#3:2 G2:2 D3:2 D3:2 D3:2 A3:2 A3:2 A2:2 E3:2 E3:2 D3:2 A3:2 A3:2'],
  ] },
  quidditch: { bpm: 150, v: [
    ['square', .045, 'C5:1 C5:1 G4:2 C5:2 E5:2 D5:1 D5:1 G4:2 D5:2 F5:2 E5:1 E5:1 C5:2 G5:2 E5:2 D5:2 B4:2 G4:4'],
    ['triangle', .08, 'C3:2 G3:2 C3:2 G3:2 G2:2 D3:2 G2:2 D3:2 A2:2 E3:2 F2:2 C3:2 G2:2 D3:2 G2:4'],
  ] },
};
const Snd = {
  ac: null, out: null, cur: null, timer: null, voices: [], pendingMusic: null,
  unlock() {
    if (this.ac) { if (this.ac.state === 'suspended') this.ac.resume(); return; }
    try {
      this.ac = new (window.AudioContext || window.webkitAudioContext)();
      this.out = this.ac.createGain(); this.out.gain.value = 0.6; this.out.connect(this.ac.destination);
      if (this.pendingMusic) { const m = this.pendingMusic; this.cur = null; this.music(m); }
    } catch (e) { this.ac = null; }
  },
  tone(f, t, d, type = 'square', vol = 0.08) {
    if (!this.ac || !f) return;
    const o = this.ac.createOscillator(), g = this.ac.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0008, t + Math.max(0.05, d));
    o.connect(g); g.connect(this.out); o.start(t); o.stop(t + d + 0.05);
  },
  sfx(n) {
    if (!this.ac || !Settings.sound) return;
    const t = this.ac.currentTime;
    switch (n) {
      case 'blip': this.tone(880 + Math.random() * 60, t, 0.03, 'square', 0.025); break;
      case 'sel': this.tone(660, t, 0.05, 'square', 0.05); break;
      case 'ok': this.tone(784, t, 0.06, 'square', 0.06); this.tone(1175, t + 0.06, 0.08, 'square', 0.06); break;
      case 'no': this.tone(220, t, 0.12, 'square', 0.06); break;
      case 'spell': for (let i = 0; i < 6; i++) this.tone(600 + i * 180, t + i * 0.03, 0.06, 'triangle', 0.07); break;
      case 'hit': this.tone(140, t, 0.15, 'sawtooth', 0.09); this.tone(90, t + 0.05, 0.15, 'square', 0.07); break;
      case 'sparkle': for (let i = 0; i < 5; i++) this.tone(1400 + i * 220, t + i * 0.05, 0.08, 'triangle', 0.05); break;
      case 'heart': this.tone(988, t, 0.08, 'triangle', 0.08); this.tone(1319, t + 0.09, 0.14, 'triangle', 0.08); break;
      case 'door': this.tone(196, t, 0.08, 'triangle', 0.1); this.tone(147, t + 0.08, 0.12, 'triangle', 0.1); break;
      case 'step': this.tone(110, t, 0.02, 'triangle', 0.03); break;
      case 'shock': this.tone(80, t, 0.4, 'sawtooth', 0.1); this.tone(60, t + 0.1, 0.5, 'square', 0.06); break;
    }
  },
  music(name) {
    this.pendingMusic = name;
    if (this.cur === name) return;
    this.stopMusic();
    this.cur = name;
    if (!this.ac || !name || name === 'none' || !TRACKS[name]) return;
    const tr = TRACKS[name], beat = 60 / tr.bpm / 2; // 8분음표 길이
    const t0 = this.ac.currentTime + 0.1;
    this.voices = tr.v.map(([type, vol, seq]) => {
      const notes = seq.split(/\s+/).map(s => { const [n, l] = s.split(':'); return [n, +l || 1]; });
      return { type, vol, notes, i: 0, t: t0 };
    });
    this.timer = setInterval(() => this.tick(beat), 60);
  },
  tick(beat) {
    if (!this.ac) return;
    const ahead = this.ac.currentTime + 0.3;
    for (const v of this.voices) {
      while (v.t < ahead) {
        const [n, l] = v.notes[v.i];
        if (n !== '_' && Settings.music) this.tone(noteFreq(n), v.t, l * beat * 0.9, v.type, v.vol);
        v.t += l * beat; v.i = (v.i + 1) % v.notes.length;
      }
    }
  },
  stopMusic() { if (this.timer) clearInterval(this.timer); this.timer = null; this.voices = []; this.cur = null; },
};
document.addEventListener('visibilitychange', () => {
  if (!Snd.ac) return;
  if (document.hidden) Snd.ac.suspend(); else Snd.ac.resume();
});

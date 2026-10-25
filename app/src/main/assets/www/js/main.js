'use strict';
// ===== 시작 =====
(async function boot() {
  buildTiles();
  Img.init();
  try { await Promise.race([document.fonts.load(FONT), new Promise(r => setTimeout(r, 2500))]); } catch (e) { /* 폰트 없이 진행 */ }
  const errs = Script.parse(STORY);
  window.__SCRIPT_ERRORS = errs;
  toTitle();
  let last = performance.now();
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    Input.update(dt);
    try { for (let i = 0; i < (TEST ? 40 : 1); i++) update(dt); draw(); } catch (e) { console.error(e); window.__LAST_ERROR = String(e && e.stack || e); }
    Input.endFrame();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();

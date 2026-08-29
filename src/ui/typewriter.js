// 打字机效果（尊重 prefers-reduced-motion：直接显示）
export function typewriter(el, text, { speed = 26, reduced = false } = {}) {
  return new Promise((resolve) => {
    if (reduced) { el.textContent = text; resolve(); return; }
    el.textContent = '';
    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, speed);
      else resolve();
    };
    tick();
  });
}

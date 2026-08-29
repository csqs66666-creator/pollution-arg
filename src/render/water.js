// Canvas 湖面 + 眼睛渲染（多模态·视觉）
// getState() => { corruption: 0..3, eye: 0..1 } 由场景驱动
export function startWater(canvas, getState) {
  const ctx = canvas.getContext('2d');
  let raf = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.floor(r.width * dpr));
    canvas.height = Math.max(1, Math.floor(r.height * dpr));
  }
  resize();
  window.addEventListener('resize', resize);

  function drawEye(cx, cy, r, corruption) {
    ctx.save();
    ctx.translate(cx, cy);
    // 巩膜
    ctx.beginPath(); ctx.ellipse(0, 0, r, r * 0.62, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f3efe6'; ctx.fill();
    // 虹膜
    const iris = ctx.createRadialGradient(0, 0, r * 0.1, 0, 0, r * 0.55);
    if (corruption >= 2) { iris.addColorStop(0, '#ff1a1a'); iris.addColorStop(1, '#5a0000'); }
    else { iris.addColorStop(0, '#6fb6d6'); iris.addColorStop(1, '#16323f'); }
    ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2); ctx.fillStyle = iris; ctx.fill();
    // 瞳孔
    ctx.beginPath();
    if (corruption >= 3) ctx.ellipse(0, 0, r * 0.12, r * 0.42, 0, 0, Math.PI * 2);
    else ctx.arc(0, 0, r * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#000'; ctx.fill();
    ctx.restore();
  }

  function frame(t) {
    const { corruption, eye } = getState();
    const w = canvas.width, h = canvas.height;
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0e1620');
    g.addColorStop(1, corruption >= 2 ? '#1a0202' : '#0b1a24');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    // 波纹
    ctx.strokeStyle = corruption >= 2 ? 'rgba(255,26,26,0.22)' : 'rgba(111,182,214,0.16)';
    ctx.lineWidth = Math.max(1, w / 800);
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      const y = h * 0.42 + i * (h * 0.09) + Math.sin(t / 700 + i) * (h * 0.01);
      ctx.moveTo(0, y);
      for (let x = 0; x <= w; x += w / 60) ctx.lineTo(x, y + Math.sin((x / (w / 12)) + (t / 600) + i) * (h * 0.012));
      ctx.stroke();
    }

    // 眼睛升起
    if (eye > 0.01) {
      const cx = w / 2, cy = h * 0.6 - eye * (h * 0.28);
      const r = (w * 0.06) * (0.6 + eye * 0.8);
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.4);
      rg.addColorStop(0, corruption >= 2 ? 'rgba(255,26,26,0.6)' : 'rgba(111,182,214,0.5)');
      rg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(cx, cy, r * 2.4, 0, Math.PI * 2); ctx.fill();
      drawEye(cx, cy, r, corruption);
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
}

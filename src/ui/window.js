// 假桌面 · 窗口管理器
// 通用 createWindow：可拖拽、可关闭、可聚焦。禁用全页动效，仅颜色/边框过渡。
let zCounter = 1000;

export function createWindow({ title = '', icon = '', width = 520, height = 400, x, y, onClose } = {}) {
  const el = document.createElement('div');
  el.className = 'app-window';
  el.style.width = width + 'px';
  el.style.height = height + 'px';
  // 错开默认位置，避免全堆在左上角
  const offset = (zCounter % 6) * 28;
  el.style.left = (x != null ? x : (80 + offset)) + 'px';
  el.style.top  = (y != null ? y : (60 + offset)) + 'px';
  el.style.zIndex = String(++zCounter);

  el.innerHTML = `
    <div class="win-titlebar">
      <span class="win-icon">${icon ? `<img src="${icon}" alt="">` : ''}</span>
      <span class="win-title">${title}</span>
      <button class="win-close" aria-label="关闭" type="button">×</button>
    </div>
    <div class="win-body"></div>
  `;

  const body = el.querySelector('.win-body');
  const titlebar = el.querySelector('.win-titlebar');
  const closeBtn = el.querySelector('.win-close');

  function focus() {
    zCounter += 1;
    el.style.zIndex = String(zCounter);
    el.classList.add('focused');
  }
  el.addEventListener('mousedown', focus);

  // 拖拽（仅在标题栏上 mousedown 触发；点击关闭按钮不触发）
  let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
  titlebar.addEventListener('mousedown', (e) => {
    if (e.target === closeBtn) return;
    dragging = true;
    sx = e.clientX; sy = e.clientY;
    ox = el.offsetLeft; oy = el.offsetTop;
    focus();
    e.preventDefault();
  });
  function onMove(e) {
    if (!dragging) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    const maxX = window.innerWidth - 40;
    const maxY = window.innerHeight - 40;
    el.style.left = Math.max(0, Math.min(ox + dx, maxX)) + 'px';
    el.style.top  = Math.max(0, Math.min(oy + dy, maxY)) + 'px';
  }
  function onUp() { dragging = false; }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);

  function close() {
    if (onClose) try { onClose(); } catch (e) { /* 忽略 */ }
    el.remove();
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
  closeBtn.addEventListener('click', close);

  document.body.appendChild(el);
  focus();
  return { el, body, close, focus };
}

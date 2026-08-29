// 入档重启卡：cold-boot 时若 cog=marked，主动给出重启入口
// 避免高潮（眼珠全屏）死锁——给玩家一个明确的"重置 / 继续"出口。
import { resetCog } from '../state/pollution.js';

export function restartScene(root, { go }) {
  root.innerHTML = `
    <div class="restart-card" role="alertdialog" aria-labelledby="rst-title" aria-describedby="rst-desc">
      <div class="restart-eyebrow">渊域 · 入档确认</div>
      <h2 id="rst-title">你已被定位</h2>
      <p id="rst-desc">上一段记忆留在 <code>localStorage</code> 里。要清掉重来，还是带着档案从序章再走？</p>
      <div class="restart-actions">
        <button class="restart-btn primary" data-act="reset" type="button">清掉，重新开始</button>
        <button class="restart-btn" data-act="continue" type="button">带着档案继续</button>
      </div>
      <div class="restart-hint">顶栏的「重置」按钮随时可用。</div>
    </div>
  `;
  function onClick(e) {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    if (btn.dataset.act === 'reset') resetCog();
    go('intro');
  }
  root.addEventListener('click', onClick);
  return {
    unmount() {
      root.removeEventListener('click', onClick);
      root.innerHTML = '';
    }
  };
}
// 场景四 · 结局（按污染态收尾）
import { getCog, resetCog } from '../state/pollution.js';

export function endingScene(root) {
  const cog = getCog() || 'clean';
  const ends = {
    clean: '你收了竿，假装什么都没发生。\n可水记得你。它从不急着要你。',
    compliant: '你说服自己，那只是月光。\n可从此，你总在凌晨 3:47 醒来，听见水面在枕边呼吸。',
    unstable: '眼睛在你枕边睁开。\n它一直都在。它只是，终于被你看见了。',
    marked: '档案已创建。\n你已入档。持续观测中。\n\n——祝您安眠。'
  };
  const text = ends[cog] || ends.clean;
  const label = { clean: '表层 · 清醒', compliant: '边缘 · 自欺', unstable: '渗血 · 缠上', marked: '深渊 · 入档' }[cog] || '表层 · 清醒';

  root.innerHTML = `
    <h1>结局</h1>
    <div class="terminal" id="end"></div>
    <p class="faint">认知污染状态：<span id="st">${label}</span>。
      刷新或重开，它仍在——除非你重置认知档案。</p>
    <div class="choices" id="choices"></div>
  `;
  const endEl = root.querySelector('#end');
  const ch = root.querySelector('#choices');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  (async () => {
    if (reduced) { endEl.textContent = text; }
    else {
      endEl.textContent = '';
      let i = 0;
      const tick = () => { endEl.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(tick, 28); };
      tick();
    }
    const again = document.createElement('button'); again.className = 'choice';
    again.textContent = '再玩一次（重置认知档案）';
    again.addEventListener('click', () => { resetCog(); location.reload(); });
    ch.appendChild(again);
  })();

  return { unmount: () => {} };
}

// 顶栏 HUD：品牌眼（全站母题位置①）+ 认知档案状态 + 重置入口
import { COG_LABEL, resetCog } from '../state/pollution.js';

const EYE_STATE = { clean: 'surface', compliant: 'awake', unstable: 'bleed', marked: 'abyss' };

export function initHud() {
  const bar = document.createElement('div');
  bar.className = 'topbar';
  bar.innerHTML = `
    <div class="brand">
      <svg class="eye" data-state="surface" viewBox="0 0 64 64" aria-label="钓渊徽标" width="22" height="22">
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" stroke-width="2"/>
        <circle class="iris" cx="32" cy="32" r="14"/>
        <circle class="pupil" cx="32" cy="32" r="5"/>
      </svg>
      <span>钓渊</span>
    </div>
    <div class="cog-state" id="cog-state">表层 · 清醒</div>
    <button class="reset" id="reset-cog" title="清除本地观测记录">重置认知档案</button>
  `;
  document.body.insertBefore(bar, document.body.firstChild);

  const label = bar.querySelector('#cog-state');
  const eye = bar.querySelector('.eye');
  const update = (cog) => {
    label.textContent = COG_LABEL[cog] || COG_LABEL.clean;
    eye.dataset.state = EYE_STATE[cog] || 'surface';
  };
  document.addEventListener('cog:change', (e) => update(e.detail.cog));
  bar.querySelector('#reset-cog').addEventListener('click', () => {
    if (confirm('重置后，你在本作的全部观测记录将被清除。是否继续？')) {
      resetCog();
      location.reload();
    }
  });
  update('clean');
  return { update };
}

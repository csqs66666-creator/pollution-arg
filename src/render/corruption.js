// 腐化调度：注入血覆层 + ③ 氛围呼吸层 + 深渊高潮层；监听 cog:change 切换 favicon / 标题
import { applyCog } from '../state/pollution.js';
import { clueOnCog } from '../ui/console-clues.js';

const FAV = {
  closed: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M4 16 Q16 9 28 16' fill='none' stroke='%238ea3b5' stroke-width='2'/%3E%3C/svg%3E",
  open:   "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='7' fill='%23ff1a1a'/%3E%3Ccircle cx='16' cy='16' r='2.5' fill='%23000'/%3E%3C/svg%3E"
};

export function initCorruption() {
  const overlay = document.createElement('div'); overlay.className = 'blood-overlay';
  // 【可改】③ 氛围呼吸层：随腐化档位暗角脉动，绝不位移正文（保护可读性 / 不眼酸）。全页抖动已移除。
  const veil = document.createElement('div'); veil.className = 'corrupt-veil';
  const climax = document.createElement('div'); climax.className = 'abyss-climax';
  // 【可改】高潮屏中央只用真实眼睛素材（不再叠 SVG 大眼）。默认 CRT 眼阵中心那只
  // （crt-eyes-array_r1c1.jpg）；换成 assets/pin/crops/ 下你想要的切片即可（如 eyes-collage_r1c1.jpg）。
  climax.innerHTML = `<img class="climax-eye-img" src="./assets/pin/crops/crt-eyes-array_r1c1.jpg" alt="" aria-hidden="true" />`;
  document.body.appendChild(overlay);
  document.body.appendChild(veil);
  document.body.appendChild(climax);

  // 【预览】调试用：URL 加 ?cog=1|2|3 可直接预览对应腐化档位，无需打通关（例：?go=forum&cog=3 看高潮眼）。
  // 注意：仅临时覆盖视觉档位，不写入 localStorage，刷新即恢复，不会把你的存档锁死在「入档」。
  document.addEventListener('cog:change', (e) => {
    const cog = e.detail.cog;
    const link = document.querySelector('link[rel="icon"]');
    if (link) link.href = (cog && cog !== 'clean') ? FAV.open : FAV.closed;
    if (!document.body.dataset.ending) {
      document.title = (cog && cog !== 'clean') ? '正在定位' : '钓渊 · Abyss Fishing';
    }
    clueOnCog(cog);
  });

  applyCog();

  // 【预览】在 applyCog 之后临时覆盖视觉档位（不持久化）
  const dbg = new URLSearchParams(location.search).get('cog');
  if (dbg === '1' || dbg === '2' || dbg === '3') {
    const cls = { '1': 'corrupt-1', '2': 'corrupt-2', '3': 'corrupt-3' }[dbg];
    const cog = { '1': 'compliant', '2': 'unstable', '3': 'marked' }[dbg];
    document.body.classList.remove('corrupt-1', 'corrupt-2', 'corrupt-3');
    document.body.classList.add(cls);
    document.body.dataset.cog = cog;
    document.dispatchEvent(new CustomEvent('cog:change', { detail: { cog } }));
  }
}

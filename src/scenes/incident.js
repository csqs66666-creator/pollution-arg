// 场景二 · 异变·钓上眼睛（触发污染态）
import { startWater } from '../render/water.js';
import { toBleeding, toSubliminal } from '../state/pollution.js';
import { typewriter } from '../ui/typewriter.js';

export function incidentScene(root, ctx) {
  const reeler = (ctx.payload && ctx.payload.reeler) || 'you';
  root.innerHTML = `
    <h1>异变 · 钓上眼睛</h1>
    <div class="stage"><canvas id="lake"></canvas>
      <div class="overlay"><p class="muted" id="narration"></p></div>
    </div>
    <div id="dialogue"></div>
    <div class="choices" id="choices"></div>
  `;
  const canvas = root.querySelector('#lake');
  let eye = 0;
  const stop = startWater(canvas, () => ({ corruption: 0, eye }));
  const narr = root.querySelector('#narration');
  const dia = root.querySelector('#dialogue');
  const ch = root.querySelector('#choices');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const say = async (who, text) => {
    const p = document.createElement('div'); p.className = 'dialogue';
    const w = document.createElement('span'); w.className = 'who'; w.textContent = who;
    const b = document.createElement('span');
    p.append(w, b); dia.appendChild(p);
    await typewriter(b, text, { reduced });
  };

  (async () => {
    await typewriter(narr, reeler === 'you' ? '你收线。线那头沉得反常。' : '朋友收线。线那头沉得反常。', { reduced });
    const t0 = performance.now();
    const rise = setInterval(() => {
      eye = Math.min(1, (performance.now() - t0) / 1600);
      if (eye >= 1) clearInterval(rise);
    }, 30);
    await new Promise(r => setTimeout(r, 1750));
    await say('朋友', '……那不是鱼。');
    await say('你', '（浮出水面的是一只眼睛。它还在眨。）');
    // 【可改】表层误导钩子：钓上「眼」只是表象，真正沉在底下的不是眼（与搜索真相呼应）
    await say('你', '（你以为那是眼。可水底沉着的，从不是眼。）');
    choose();
  })();

  function choose() {
    ch.innerHTML = '';
    const look = document.createElement('button'); look.className = 'choice';
    look.textContent = '睁眼看它。';
    look.addEventListener('click', async () => {
      toBleeding();
      await say('你', '（你和它对视了。某种东西，顺着视线爬了进来。）');
      ch.innerHTML = '';
      const go = document.createElement('button'); go.className = 'choice';
      // 【可改】按钮文案：现在指向主页假桌面（回到家 → 自己开 Edge 调查），不再直冲论坛
      go.textContent = '回家。得查一查——别人也遇过这种事吗？';
      go.addEventListener('click', async () => {
        if (go.disabled) return;
        go.disabled = true;                                     // 防连点：say() 是异步的，点两下会跳两次
        // 【可改】回家旁白
        await say('你', '（你回到家。凌晨四点的房间，屏幕还亮着。）');
        ctx.go('desktop');
      });
      ch.appendChild(go);
    });
    const away = document.createElement('button'); away.className = 'choice';
    away.textContent = '别过头，把竿扔回水里。';
    away.addEventListener('click', async () => {
      toSubliminal();
      await say('你', '（你告诉自己那是月光。可眼皮底下，有什么被你放走了。）');
      ch.innerHTML = '';
      const go = document.createElement('button'); go.className = 'choice';
      // 【可改】按钮文案：同样指向主页假桌面
      go.textContent = '回家。但手机在兜里震了一下……';
      go.addEventListener('click', async () => {
        if (go.disabled) return;
        go.disabled = true;                                     // 防连点
        // 【可改】回家旁白
        await say('你', '（你回到家。凌晨四点的房间，屏幕还亮着。）');
        ctx.go('desktop');
      });
      ch.appendChild(go);
    });
    ch.append(look, away);
  }

  return { unmount: stop };
}

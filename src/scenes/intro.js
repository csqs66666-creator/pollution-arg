// 场景一 · 序章·陪钓（多交互：对话选择）
import { startWater } from '../render/water.js';
import { setFlag } from '../state/progress.js';
import { typewriter } from '../ui/typewriter.js';

export function introScene(root, ctx) {
  root.innerHTML = `
    <h1>序章 · 陪钓</h1>
    <div class="stage"><canvas id="lake"></canvas>
      <div class="overlay"><p class="muted" id="narration"></p></div>
    </div>
    <div id="dialogue"></div>
    <div class="choices" id="choices"></div>
  `;
  const canvas = root.querySelector('#lake');
  const stop = startWater(canvas, () => ({ corruption: 0, eye: 0 }));
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
  const choose = (opts) => {
    ch.innerHTML = '';
    for (const o of opts) {
      const b = document.createElement('button'); b.className = 'choice'; b.textContent = o.label;
      b.addEventListener('click', o.onClick); ch.appendChild(b);
    }
  };

  (async () => {
    await typewriter(narr, '湖边。凌晨三点。朋友把竿递给你，说今晚鱼口好。', { reduced });
    await say('朋友', '你盯了一晚上手机，出来透透气。');
    await say('朋友', '嘘——别出声，鱼精得很。');
    choose([
      { label: '「随便聊聊吧。」', onClick: async () => {
          await say('你', '（聊了些无关紧要的。）'); nextLook(); } },
      { label: '「……我盯着这水面看会儿。」', onClick: async () => {
          setFlag('staredWater', true);
          await say('你', '（水面平静得，不像真的。）');
          await say('朋友', '（笑）你别看太久，看久了会觉得水下有人看你。');
          nextLook(); } },
    ]);
  })();

  function nextLook() {
    choose([
      { label: '浮标动了。收线。', onClick: () => ctx.go('incident', { reeler: 'you' }) },
      { label: '再等等。', onClick: async () => {
          await say('朋友', '（忽然压低声音）……不对，这口太死了。');
          choose([{ label: '过去看看。', onClick: () => ctx.go('incident', { reeler: 'friend' }) }]); } },
    ]);
  }

  return { unmount: stop };
}

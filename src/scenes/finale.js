// 场景 · 终局三结局（养成 / 臣服 / 反杀）
// 网页载体：呈现为一扇「腐生社 · 终局」门户（faux 网页）。
// 三种结局均由玩家主动选择，区别于旧 ending.js 的污染态收尾。
import { clearClues } from '../state/clues.js';
import { resetCog } from '../state/pollution.js';

// 【可改】三结局文案：每项为多行文本（\n 分隔，逐字显示）。
const ENDINGS = {
  raise: {
    tag: '结局 · 养成',
    cls: 'finale-raise', // 【可改】视觉态（见 finale.css）
    // 【可改】养成结局文案
    text: '你把幼苗养在了阳台的鱼缸里。\n它每天长大一点，你也每天少一点自己。\n第三十七天，它开了。\n花瓣，是你的脸。\n——你成了它最满意的园丁。'
  },
  submit: {
    tag: '结局 · 臣服',
    cls: 'finale-submit',
    // 【可改】臣服结局文案
    text: '你跪下来，把额头贴上水面。\n腐生社收下了你。\n从此你不再独自失眠——\n因为有什么，替你醒着。\n——信徒 · 已归档。'
  },
  reverse: {
    tag: '结局 · 反杀',
    cls: 'finale-reverse',
    // 【可改】反杀结局文案（你试图杀它，反被它从自己体内开出）
    text: '你举起竿，刺向那朵莲。\n莲没有躲。\n它只是，在你刺穿它的瞬间，\n从你自己的胸口，开了出来。\n——反杀。你被自己杀死了。'
  }
};

export function finaleScene(root, ctx) {
  root.innerHTML = `
    <div class="finale-root">
      <div class="finale-portal">
        <div class="finale-chrome">
          <span class="fc-dot"></span><span class="fc-dot"></span><span class="fc-dot"></span>
          <span class="fc-url">腐生社 · 终局 — huichuan://finale</span>
        </div>
        <div class="finale-body" id="fbody">
          <h1 class="finale-title">你已抵达终局</h1>
          <p class="finale-lead">你拼出了真相：洄川水底沉着的是 <b>腐土青莲</b> 幼体，属莲花阵营 · 腐生社。其余三路（眼 / 欲肉 / 圣临）皆为其回声。</p>
          <p class="finale-prompt">现在，你要怎么对待它？</p>  <!-- 【可改】引导语 -->
          <div class="finale-choices" id="choices">
            <button class="finale-choice" data-end="raise">
              <span class="fc-name">养成</span>
              <span class="fc-desc">把它养起来。像养一株会呼吸的花。</span>  <!-- 【可改】 -->
            </button>
            <button class="finale-choice" data-end="submit">
              <span class="fc-name">臣服</span>
              <span class="fc-desc">跪下来。成为它的人。</span>
            </button>
            <button class="finale-choice" data-end="reverse">
              <span class="fc-name">反杀</span>
              <span class="fc-desc">毁掉它。在它开花之前。</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  const fbody = root.querySelector('#fbody');

  function showEnding(key) {
    const e = ENDINGS[key];
    if (!e) return;
    document.body.classList.add(e.cls);
    fbody.innerHTML = `
      <h1 class="finale-title">${e.tag}</h1>
      <div class="terminal finale-term" id="end"></div>
      <div class="choices" id="again"></div>
    `;
    const endEl = fbody.querySelector('#end');
    const again = fbody.querySelector('#again');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { endEl.textContent = e.text; }
    else {
      endEl.textContent = '';
      let i = 0;
      const tick = () => { endEl.textContent = e.text.slice(0, ++i); if (i < e.text.length) setTimeout(tick, 32); };
      tick();
    }
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = '再玩一次（重置认知档案与线索）';
    btn.addEventListener('click', () => { clearClues(); resetCog(); location.reload(); });
    again.appendChild(btn);
  }

  root.querySelectorAll('.finale-choice').forEach(b => {
    b.addEventListener('click', () => showEnding(b.dataset.end));
  });

  return {
    unmount: () => {
      document.body.classList.remove('finale-raise', 'finale-submit', 'finale-reverse');
    }
  };
}

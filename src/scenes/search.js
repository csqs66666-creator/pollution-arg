// 场景 · 搜索解密核心（伪造搜索引擎 UI）
// 输入词条 → 匹配关键词表 → 解锁隐藏网站 / 线索。
// 线索存 src/state/clues.js（localStorage 'yuanyu.clues'）。
//
// 美学：暗色等宽、克制，无全页 animation、无 transform 抖动（守「③ 氛围呼吸」）。
import { addClue, hasClue } from '../state/clues.js';

// 真相线索 id（命中「莲」相关词时记录）
const TRUTH_ID = 'clue_lotus_truth'; // 【可改】真相线索 id
// 终局支撑线索：真相已知 + 下面 ≥2 条已收集 → 解锁终局入口
// 【可改】支撑线索集合（与下方 CLUE_DEFS 的 id 对应）
const SUPPORT_CLUES = ['clue_coord', 'clue_rot13', 'clue_zhouyu'];

// ROT13（仅用于 purazvna 彩蛋解码展示；中文不处理）
function rot13(s) {
  return s.replace(/[a-zA-Z]/g, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
  });
}

// ===== 关键词 → 结果映射 =====
// 【可改】本数组每条的 keywords（搜索词，大小写不敏感，中文不做 rot13）与
//        render() 返回的卡片文案（含 card-tag / card-title / card-body 及 truth 面板）均为
//        【可改】内容，青司可自由改写词与文；每条命中即记录一条线索并渲染一张卡。
// 匹配规则：查询（trim + 转小写）包含任一 keyword 即触发该结果；多组可叠加。
const CLUE_DEFS = [
  {
    id: 'clue_coord',            // 【可改】线索 id
    kind: 'base',
    keywords: ['洄川', '夜钓', '04-23-17', 'lake://042317'], // 【可改】触发词
    render: () => `
      <div class="card-tag">基础线索</div>
      <h4 class="card-title">04-23-17 水域</h4>
      <p class="card-body">坐标指向洄川下游那片野湖。论坛里「04-23-17 这片水域，别下竿」一帖，勾连着同一个编号。<br>这天之后，洄川的水不一样了。</p>
    `,
  },
  {
    id: 'clue_eye_misdirect',    // 【可改】线索 id（表层误导）
    kind: 'misdirect',
    keywords: ['眼睛', '钓上眼睛', '眼'], // 【可改】触发词
    render: () => `
      <div class="card-tag">线索 · 久远之瞳？</div>
      <h4 class="card-title">你钓上来的，是眼。</h4>
      <p class="card-body">一只人的眼，还带着温度，瞳孔在你手电光里缩了一下。<br>……可这眼睛是别人的。真正沉在底下的，不是眼。</p>
    `,
  },
  {
    id: 'clue_rot13',            // 【可改】线索 id（彩蛋）
    kind: 'egg',
    keywords: ['purazvna'], // 【可改】触发词（ROT13 = chenmian = 沉眠）
    render: () => `
      <div class="card-tag">彩蛋 · ROT13</div>
      <h4 class="card-title">purazvna → 沉眠（${rot13('purazvna')}）</h4>
      <p class="card-body">它在水底，一直醒着等。</p>
    `,
  },
  {
    id: 'clue_lotus_truth',      // 【可改】线索 id（真相 · 真站）
    kind: 'truth',
    keywords: ['青莲', '腐土青莲', '莲花', '莲'], // 【可改】触发词
    render: () => `
      <div class="card-tag">真站 · 已解锁</div>
      <div class="lotus-station">
        <h3>腐土青莲 · 腐生社残档</h3>
        <p>检索命中隐藏节点。这是腐土青莲阵营（腐生社）的内网残档。</p>
        <p class="truth-line">钓上来的是腐土青莲幼体，属莲花阵营。</p>
        <p>其余三路（眼 / 欲肉 / 圣临）皆为其放出的干扰回声。</p>
      </div>
    `,
  },
  {
    id: 'clue_flesh_misdirect',  // 【可改】线索 id（欲肉干扰）
    kind: 'misdirect',
    keywords: ['欲肉', '欲肉之面'], // 【可改】触发词
    render: () => `
      <div class="card-tag">干扰 · 欲肉教</div>
      <h4 class="card-title">欲肉之面</h4>
      <p class="card-body">检索到一些黏腻的低频呼吸声，和网络里长出的肉。这只是干扰回声，与洄川真相无关。</p>
    `,
  },
  {
    id: 'clue_gaze_misdirect',   // 【可改】线索 id（圣临干扰）
    kind: 'misdirect',
    keywords: ['圣临', '圣临之眼'], // 【可改】触发词
    render: () => `
      <div class="card-tag">干扰 · 圣临会</div>
      <h4 class="card-title">圣临之眼</h4>
      <p class="card-body">检索到祈祷时天花板睁开的那只金眼。这也是干扰回声，不是水底真正沉着的东西。</p>
    `,
  },
  {
    id: 'clue_zhouyu',           // 【可改】线索 id（好友线索）
    kind: 'base',
    keywords: ['周屿'], // 【可改】触发词
    render: () => `
      <div class="card-tag">好友线索</div>
      <h4 class="card-title">周屿</h4>
      <p class="card-body">周屿就是在这片水域失踪的。装备还在岸上，人没了。和 04-23-17 那串编号指向同一片水。</p>
    `,
  },
];

export function searchScene(root, ctx) {
  // 【可改】返回目标：当前回 forum；若要回 incident 改成 'incident'
  const backTarget = 'forum'; // 【可改】返回场景名

  // 【可改】以下顶部文案（标题 / 副标题 / 输入框占位 / 提示）青司可改
  root.innerHTML = `
    <div class="search-wrap">
      <a href="#" class="search-back" id="back">← 返回</a>
      <div class="search-title">洄川检索</div>
      <div class="search-sub">// 内网检索终端 · 输入词条以解锁隐藏节点</div>
      <div class="search-row">
        <input class="search-box" id="q" type="text" placeholder="检索：洄川 / 编号 / 你钓上来的东西" autocomplete="off" />
        <button class="search-btn" id="go">搜索</button>
      </div>
      <div class="search-hint">提示：试试你钓上来的东西，或那串编号。</div>
      <div class="search-results" id="results"></div>
    </div>
  `;
  const input = root.querySelector('#q');
  const btn = root.querySelector('#go');
  const results = root.querySelector('#results');
  const back = root.querySelector('#back');

  back.addEventListener('click', (e) => { e.preventDefault(); ctx.go(backTarget); });

  function noneCard(msg) {
    const p = document.createElement('div');
    p.className = 'search-hint';
    p.textContent = msg;
    return p;
  }

  function maybeFinale() {
    const old = results.querySelector('.search-finale');
    if (old) old.remove();
    const supportCount = SUPPORT_CLUES.filter(hasClue).length;
    if (hasClue(TRUTH_ID) && supportCount >= 2) {
      const fb = document.createElement('button');
      fb.className = 'search-finale';
      fb.textContent = '前往终局入口 →';
      // 【可改】终局三结局场景（养成/臣服/反杀），由 finale.js 呈现为「腐生社·终局」网页门户
      // 显式 breakOut：绕开 FIELD_SCENES 缓存（即使旧缓存里没有 'finale'，也能强制破窗+全屏）。
      fb.addEventListener('click', () => {
        if (ctx.breakOut) ctx.breakOut('finale');
        else ctx.go('finale');
      });
      results.appendChild(fb);
    }
  }

  function renderResults(q) {
    results.innerHTML = '';
    const triggered = CLUE_DEFS.filter(def =>
      def.keywords.some(k => q.includes(k.toLowerCase()))
    );
    if (triggered.length === 0) {
      results.appendChild(noneCard('无结果。试试你钓上来的东西，或那串编号。'));
      return;
    }
    for (const def of triggered) {
      addClue(def.id); // 每次命中记录线索
      const card = document.createElement('div');
      card.className = `search-card ${def.kind}`;
      card.innerHTML = def.render();
      results.appendChild(card);
    }
    maybeFinale();
  }

  function submit() {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      results.innerHTML = '';
      results.appendChild(noneCard('无结果。试试你钓上来的东西，或那串编号。'));
      return;
    }
    renderResults(q);
  }

  btn.addEventListener('click', submit);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });

  // 已解锁终局入口的情况（线索跨会话持久化）：进入时直接显现
  if (hasClue(TRUTH_ID) && SUPPORT_CLUES.filter(hasClue).length >= 2) {
    results.innerHTML = '<div class="search-hint">你已拼出足够线索，终局入口已显现。</div>';
    maybeFinale();
  }

  input.focus();
  return { unmount: () => {} };
}

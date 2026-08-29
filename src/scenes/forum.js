// 场景三 · 缠染·论坛（板块 → 主题列表 → 帖子详情，天涯 / phpBB 风）
// 真实论坛密度：面包屑 / 用户组 / 楼层 / 引用 / 签名 / 时间戳 / 浏览数 / 回复数。
// 都市怪谈首帖 = 四大污染全中；档案馆首帖 = 「值班室」节点索引线索。
import { BOARDS, makeTopics, makeThread } from '../data/forum-data.js';
import { POLLUTIONS } from '../data/pollutions.js';
import { getCog, toBleeding, toMarked } from '../state/pollution.js';
import { setFlag } from '../state/progress.js';
import { typewriter } from '../ui/typewriter.js';

// 论坛「实时更新」：进入板块后，按当前污染等级定时冒新帖到主题列表顶部。
// clean/compliant/unstable/marked 四档内容逐级诡异；marked 直接冒腐生社帖。
// 【可改】增删帖子、改冒帖间隔（LIVE_INTERVAL）、最多保留条数（LIVE_MAX）。
const LIVE_POOLS = {
  clean: [
    { title: '【寻人】周屿家属求助：再提供线索有酬', author: '周屿家属', group: '洄川吧务',
      content: '孩子 27，4-23 下午出门钓鱼再没回来。最后定位 04-23-17 水域。跪求任何线索。' },
    { title: '今晚洄川风静，有人一起夜钓吗', author: '阿伟', group: '钓友',
      content: '明天休，想去下游试试。有去的吱一声。' },
    { title: '04-23-17 到底能不能下竿？管理处说不行', author: '临湖老周', group: '本地',
      content: '今天路过看见警示桩又多了。大家别去那片了，真出过事。' },
    { title: '湖面绿光是啥？有懂的吗', author: '夜钓新人', group: '新人',
      content: '前天凌晨看见水面一片绿，持续不到半分钟。是船灯还是啥？' },
  ],
  compliant: [
    { title: '绿光第二次了，这次更亮', author: '夜钓新人', group: '新人',
      content: '我又看见了，比上次亮，而且……位置好像挪了。' },
    { title: '钓上来的不是鱼，那是什么', author: '老陈', group: '钓友',
      content: '我侄子前天钓上东西，不是鱼。他回来把竿烧了，不说话。' },
    { title: 'purazvna 是什么？有人懂反读吗', author: '路过的', group: '新人',
      content: '群里有人发这串字母，说反着读。我反读不出来，是不是我笨。' },
  ],
  unstable: [
    { title: '「别下竿」· 你钓上来的不是鱼', author: '匿名', group: '未知',
      content: '看到这帖的你，今晚别去。你钓上来的不会是鱼。' },
    { title: '水温三夜异常，仪器没坏', author: '巡查员', group: '管理',
      content: '我们测了三次，水温比历史高 5 度以上。仪器校准过。' },
    { title: '04-23-17 水下有人说能住', author: '潜水佬', group: '钓友',
      content: '我憋气下去过，底下不是空的。有东西在动。' },
    { title: '听到水下有女人唱，别去听第二遍', author: '已搬走', group: '本地',
      content: '听一次没事，听第二次你就想回去。我已经搬了。' },
  ],
  marked: [
    { title: '你已被点名 · 请按你看到的回去', author: '腐生社', group: '沉眠',
      content: '档案已建。你读到这里，说明你愿意。下一步，按你看到的回去。' },
    { title: '腐土青莲已开封 · 请勿外传', author: '腐生社', group: '沉眠',
      content: '莲已开。它认得你。把网址删了也没用。' },
    { title: '周屿已不再被需要', author: '腐生社', group: '沉眠',
      content: '前例已完成。下一例：你。' },
  ]
};
const LIVE_INTERVAL = 9000; // 冒帖间隔（毫秒）
const LIVE_MAX = 4;         // 列表顶部最多保留的实时帖条数

export function forumScene(root, ctx) {
  const resp = (ctx.payload && ctx.payload.response) || 'look';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 内部三态导航
  let mode = 'boards';
  let currentBoard = null;
  let currentTopic = null;
  let currentTopics = null;
  let currentThread = null;
  // 实时更新：定时器 + 已播过的帖索引，避免重复冒同一帖
  let liveTimer = null;
  const liveSeen = new Set();

  root.innerHTML = `
    <div class="forum-shell">
      <nav class="forum-crumb" id="crumb"></nav>
      <div class="forum-stage" id="stage"></div>
    </div>
    <div id="dialogue"></div>
    <div class="choices" id="choices"></div>
    <style id="forum-backlink-style">
      /* 【可改】返回按钮样式：颜色 / 间距 / hover 行为在此调（默认暗灰字，hover 变红，无动画） */
      .back-link { display: inline-block; margin: 0 0 12px; color: #8a8a8a; cursor: pointer; text-decoration: none; user-select: none; }
      .back-link:hover { color: var(--blood-bright, #e23b3b); }
    </style>
  `;
  const crumb = root.querySelector('#crumb');
  const stage = root.querySelector('#stage');
  const dia = root.querySelector('#dialogue');
  const ch = root.querySelector('#choices');

  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function renderCrumb() {
    const parts = ['<a href="#" data-nav="boards">论坛</a>'];
    if (currentBoard) parts.push(`<a href="#" data-nav="topics">${esc(currentBoard.name)}</a>`);
    if (currentTopic) {
      const t = esc(currentTopic.title.length > 22 ? currentTopic.title.slice(0, 22) + '…' : currentTopic.title);
      parts.push(`<span>${t}</span>`);
    }
    crumb.innerHTML = parts.join(' <span class="crumb-sep">/</span> ');
    crumb.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => { e.preventDefault(); navigate(el.dataset.nav); });
    });
  }

  // ─────────── 实时更新（定时冒新帖） ───────────
  function livePool() {
    const cog = getCog() || 'clean';
    return LIVE_POOLS[cog] || LIVE_POOLS.clean;
  }

  function spawnLive() {
    const list = stage.querySelector('.topic-list');
    if (!list) return;
    const pool = livePool();
    // 从未播过的帖里随机取一条
    const candidates = pool.map((p, i) => ({ p, i })).filter(x => !liveSeen.has(x.i));
    if (!candidates.length) return;
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    liveSeen.add(pick.i);
    const post = pick.p;

    const li = document.createElement('li');
    li.className = 'topic-item live';
    li.dataset.live = String(pick.i);
    li.innerHTML = `
      <div class="topic-main">
        <span class="tag live-tag">新</span>
        <span class="topic-title">${esc(post.title)}</span>
      </div>
      <div class="topic-meta">
        <span class="topic-author">${esc(post.author)}</span>
        <span class="topic-group">[${esc(post.group)}]</span>
      </div>
      <div class="topic-stats">
        <span class="topic-replies">0</span>
        <span class="topic-time live-time">刚刚</span>
      </div>
    `;
    li.addEventListener('click', () => openLiveThread(post));
    list.insertBefore(li, list.firstChild);

    // 超出上限则移除最老的实时帖
    const lives = list.querySelectorAll('.topic-item.live');
    if (lives.length > LIVE_MAX) lives[lives.length - 1].remove();

    if (!reduced) {
      li.classList.add('live-in');
      setTimeout(() => li.classList.remove('live-in'), 600);
    }
  }

  function startLive() {
    stopLive();
    // 进板块先冒一条，之后按间隔冒
    spawnLive();
    liveTimer = setInterval(spawnLive, LIVE_INTERVAL);
  }

  function stopLive() {
    if (liveTimer) { clearInterval(liveTimer); liveTimer = null; }
  }

  // 实时帖点击：简化版帖子视图（不走 makeThread，避免污染 forum-data）
  function openLiveThread(post) {
    stopLive();
    renderCrumb();
    stage.innerHTML = `
      <a href="#" class="back-link" data-back="topics">← 返回 ${esc(currentBoard ? currentBoard.name : '论坛')}</a>
      <h2 class="thread-title">${esc(post.title)}</h2>
      <div class="thread-meta muted">
        <span>1 楼</span> · <span>实时</span> · <span>作者 ${esc(post.author)}</span>
      </div>
      <div class="post-list">
        <article class="forum-post">
          <header class="post-head">
            <span class="post-floor">#1</span>
            <span class="post-author">${esc(post.author)}</span>
            <span class="post-group">[${esc(post.group)}]</span>
            <span class="post-time">刚刚</span>
          </header>
          <div class="post-body">${esc(post.content).replace(/\n/g, '<br>')}</div>
          <footer class="post-sig">—— 来自「洄川夜钓吧」实时推送 ——</footer>
        </article>
      </div>
    `;
    bindBackLinks();
  }

  function navigate(to, payload) {
    if (to === 'boards') {
      mode = 'boards'; currentBoard = null; currentTopic = null;
      currentTopics = null; currentThread = null;
      stopLive();
      renderBoards();
    } else if (to === 'topics') {
      mode = 'topics'; currentBoard = payload; currentTopic = null;
      currentTopics = makeTopics(payload.id);
      currentThread = null;
      renderTopics();
    } else if (to === 'thread') {
      mode = 'thread'; currentTopic = payload;
      currentThread = makeThread(payload);
      renderThread();
    }
  }

  function bindBackLinks() {
    stage.querySelectorAll('[data-back]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (el.dataset.back === 'topics') navigate('topics', currentBoard);
        else navigate(el.dataset.back);
      });
    });
  }

  function renderBoards() {
    renderCrumb();
    // 【可改】论坛落地标题 + 一句氛围旁白
    stage.innerHTML = `
      <h1 class="thread-title">缠染 · 论坛</h1>
      <p class="muted">「洄川夜钓吧」——一个你从没注册过、却自动登录了的论坛。</p>
      <ul class="board-list">
        ${BOARDS.map(b => `
          <li class="board-item" data-board="${b.id}">
            <div class="board-icon" style="color:${b.color}">${b.icon}</div>
            <div class="board-info">
              <h3>${esc(b.name)}</h3>
              <p class="muted">${esc(b.desc)}</p>
            </div>
            <div class="board-stats">
              <div class="num">${b.topicCount.toLocaleString()}</div>
              <div class="lbl">主题</div>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
    stage.querySelectorAll('[data-board]').forEach(el => {
      el.addEventListener('click', () => {
        const b = BOARDS.find(x => x.id === el.dataset.board);
        if (b) navigate('topics', b);
      });
    });
    afterForumEntry(resp);
  }

  function renderTopics() {
    renderCrumb();
    // 【可改】返回按钮文案/位置：下面这行「← 返回论坛」可改文案或挪位置
    stage.innerHTML = `
      <a href="#" class="back-link" data-back="boards">← 返回论坛</a>
      <h2 class="thread-title">${esc(currentBoard.name)}</h2>
      <p class="muted">${esc(currentBoard.desc)}</p>
      <ul class="topic-list">
        ${currentTopics.map(t => {
          const tagCls = t.tag === 'all' ? 'tag all' : 'tag';
          const tagName = t.tag ? (POLLUTIONS[t.tag]?.name || t.tag) : '';
          const tagHtml = t.tag ? `<span class="${tagCls}">${esc(tagName)}</span>` : '<span class="tag empty">·</span>';
          return `
          <li class="topic-item ${t.hasAllFour ? 'topic-all' : ''}" data-topic="${esc(t.id)}">
            <div class="topic-main">
              ${tagHtml}
              <span class="topic-title">${esc(t.title)}</span>
            </div>
            <div class="topic-meta">
              <span class="topic-author">${esc(t.author)}</span>
              <span class="topic-group">[${esc(t.group)}]</span>
            </div>
            <div class="topic-stats">
              <span class="topic-replies" title="回复">${t.replies}</span>
              <span class="topic-time">${esc(t.lastReply)}</span>
            </div>
          </li>`;
        }).join('')}
      </ul>
    `;
    stage.querySelectorAll('[data-topic]').forEach(el => {
      el.addEventListener('click', () => {
        const t = currentTopics.find(x => x.id === el.dataset.topic);
        if (t) navigate('thread', t);
      });
    });
    bindBackLinks();
    startLive(); // 进入板块即开始冒实时新帖
  }

  function renderThread() {
    renderCrumb();
    // 【可改】返回按钮文案/位置：下面这行「← 返回 {板块名}」可改文案或挪位置
    const t = currentThread;
    const renderPost = (p) => `
      <article class="forum-post" data-floor="${p.floor}">
        <header class="post-head">
          <span class="post-floor">#${p.floor}</span>
          <span class="post-author">${esc(p.author)}</span>
          <span class="post-group">[${esc(p.group)}]</span>
          <span class="post-time">${esc(p.time)}</span>
        </header>
        ${p.quote ? `<blockquote class="post-quote"><span class="post-quote-author">引用 ${p.quote.floor}楼</span> ${esc(p.quote.text)}</blockquote>` : ''}
        <div class="post-body">${esc(p.content).replace(/\n/g, '<br>')}</div>
        <footer class="post-sig">${esc(p.signature)}</footer>
      </article>
    `;
    stage.innerHTML = `
      <a href="#" class="back-link" data-back="topics">← 返回 ${esc(currentBoard.name)}</a>
      <h2 class="thread-title">${esc(t.title)}</h2>
      <div class="thread-meta muted">
        <span>${1 + t.replies.length} 楼</span> · <span>${(currentTopic.views != null ? currentTopic.views : (200 + Math.floor(Math.random() * 9000))).toLocaleString()} 浏览</span>
      </div>
      <div class="post-list">
        ${renderPost(t.original)}
        ${t.replies.map(renderPost).join('')}
      </div>
      <div class="thread-bottom muted">—— 已加载 / 翻页请回板块 ——</div>
    `;
    bindBackLinks();
  }

  const say = async (who, text) => {
    const p = document.createElement('div'); p.className = 'dialogue';
    const w = document.createElement('span'); w.className = 'who'; w.textContent = who;
    const b = document.createElement('span');
    p.append(w, b); dia.appendChild(p);
    await typewriter(b, text, { reduced });
  };

  async function afterForumEntry(resp) {
    // 【可改】进入论坛后的旁白（"你"的视角）。想改台词就改这里。
    dia.innerHTML = '';
    if (resp === 'away') {
      await say('推送', '「洄川夜钓吧」：今夜又有钓友在 04-23-17 水域，钓上眼睛。');
    } else {
      await say('你', '（搜索「钓上眼睛」……结果很多。比你想象的多。）');
    }
    chooseEntry();
  }

  function chooseEntry() {
    // 【可改】两个分支按钮文案 + 各自旁白。
    ch.innerHTML = '';
    const dig = document.createElement('button'); dig.className = 'choice';
    dig.textContent = '深究下去。';
    dig.addEventListener('click', async () => {
      setFlag('dugForum', true);
      if (getCog() === 'compliant') toBleeding();
      await say('你', '（你拼出那个编号，点进了一扇不该打开的门。）');
      toMarked(); setFlag('reachedTruth', true);
      const no = '0' + Math.floor(Math.random() * 9000 + 1000);
      await say('终端', `档案 #${no} 已创建。你在自测里说：是。你已入档。`);
      const goBtn = document.createElement('button'); goBtn.className = 'choice';
      goBtn.textContent = '看结局。';
      goBtn.addEventListener('click', () => {
        // 优先破窗（在 Edge/桌面窗口内），否则全局跳转
        if (typeof ctx.breakOut === 'function') ctx.breakOut('finale');
        else ctx.go('finale');
      });
      ch.appendChild(goBtn);
      // 确保按钮出现在可视区（窗口内可能被对话内容挤到下方）
      goBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    const closeBtn = document.createElement('button'); closeBtn.className = 'choice';
    closeBtn.textContent = '关掉。装作没看见。';
    closeBtn.addEventListener('click', () => {
      if (typeof ctx.breakOut === 'function') ctx.breakOut('desktop');
      else ctx.go('desktop');
    });
    ch.append(dig, closeBtn);
  }

  navigate('boards');
  return { unmount: () => { stopLive(); } };
}
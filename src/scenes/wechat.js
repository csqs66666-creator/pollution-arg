// 场景零 · 引子·微信（通讯录 + 多联系人聊天）
// 点击联系人进入单聊；聊天顶栏 ‹ 返回通讯录。
// 每个联系人独立 SCRIPT，方便青司后续改写对话。

// 【可改】联系人列表：头像、昵称、最近一条预览、时间、完整对话脚本。
// 想新增/删除联系人、改对话，改这里即可。
const CONTACTS = [
  {
    id: 'zhouyu',
    name: '周屿',
    avatar: '🎣',
    preview: '出来夜钓',
    time: '22:15',
    online: true,
    script: [
      { type: 'time',  text: '今天 22:14' },
      { type: 'text',  side: 'friend', text: '在？' },
      { type: 'text',  side: 'me',     text: '干嘛' },
      { type: 'time',  text: '今天 22:15' },
      { type: 'text',  side: 'friend', text: '出来夜钓' },
      { type: 'text',  side: 'me',     text: '老地方？' },
      { type: 'text',  side: 'friend', text: '湖边那' },
      { type: 'text',  side: 'me',     text: '几点' },
      { type: 'text',  side: 'friend', text: '十点半 你带竿 我带饵' },
      { type: 'text',  side: 'me',     text: '行' },
      { type: 'voice', side: 'friend', dur: 38 },
      { type: 'text',  side: 'friend', text: '记得带外套 山里冷' },
      { type: 'text',  side: 'me',     text: '嗯' },
      { type: 'recall', who: '周屿' },
      { type: 'text',  side: 'friend', text: '听说最近那边有点邪门' },
      { type: 'text',  side: 'me',     text: '？' },
    ],
    // 【可改】聊完后的行动按钮：想改触发场景，改这里
    action: { text: '出发 →', target: 'intro', payload: null }
  },
  {
    id: 'mom',
    name: '妈妈',
    avatar: '👩',
    preview: '你最近怎么老往湖边跑',
    time: '昨天',
    online: false,
    script: [
      { type: 'time',  text: '昨天 20:03' },
      { type: 'text',  side: 'friend', text: '你最近怎么老往湖边跑' },
      { type: 'text',  side: 'me',     text: '周屿约我钓鱼' },
      { type: 'text',  side: 'friend', text: '小时候你就不该靠近那片水' },
      { type: 'text',  side: 'me',     text: '什么意思' },
      { type: 'text',  side: 'friend', text: '你爸以前也在那钓过一次' },
      { type: 'text',  side: 'friend', text: '回来高烧了半个月' },
      { type: 'text',  side: 'me',     text: '……' },
      { type: 'text',  side: 'friend', text: '别去' },
    ],
    action: { text: '收起手机 →', target: 'desktop', payload: null }
  },
  {
    id: 'group',
    name: '洄川钓友群',
    avatar: '👥',
    preview: '04-23-17 那片水别下竿',
    time: '18:42',
    online: true,
    script: [
      { type: 'time',  text: '今天 18:42' },
      { type: 'text',  side: 'friend', text: '老陈：04-23-17 那片水别下竿', author: '老陈' },
      { type: 'text',  side: 'friend', text: '阿伟：咋了', author: '阿伟' },
      { type: 'text',  side: 'friend', text: '老陈：我侄子前天在那钓上个东西', author: '老陈' },
      { type: 'text',  side: 'friend', text: '老陈：不是鱼', author: '老陈' },
      { type: 'text',  side: 'friend', text: '老陈：事后他把竿烧了', author: '老陈' },
      { type: 'text',  side: 'me',     text: '什么东西', author: '你' },
      { type: 'text',  side: 'friend', text: '老陈：你最好别知道', author: '老陈' },
    ],
    action: { text: '去搜搜看 →', target: 'desktop', payload: null }
  },
  {
    id: 'stranger',
    name: '陌生人',
    avatar: '👁️',
    preview: '你看见了，对吗',
    time: '03:47',
    online: true,
    script: [
      { type: 'time',  text: '今天 03:47' },
      { type: 'text',  side: 'friend', text: '你看见了，对吗' },
      { type: 'text',  side: 'me',     text: '你是谁' },
      { type: 'text',  side: 'friend', text: '它也在看你' },
      { type: 'text',  side: 'friend', text: 'purazvna' },
      { type: 'text',  side: 'me',     text: '？' },
      { type: 'text',  side: 'friend', text: '沉眠者终将醒来' },
      { type: 'text',  side: 'friend', text: '而你，已经把它吵醒了' },
    ],
    action: { text: '打开检索 →', target: 'desktop', payload: null }
  }
];

function findContact(id) { return CONTACTS.find(c => c.id === id) || CONTACTS[0]; }

export function wechatScene(root, ctx) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const contactId = ctx.payload && ctx.payload.contact;

  if (!contactId) {
    renderContactsList(root, ctx);
  } else {
    renderChat(root, ctx, findContact(contactId));
  }

  return {
    unmount() { root.innerHTML = ''; }
  };
}

// ============ 通讯录列表 ============
function renderContactsList(root, ctx) {
  root.innerHTML = `
    <div class="wechat wechat-list">
      <header class="wechat-header">
        <span class="wechat-back" aria-hidden="true">‹</span>
        <span class="wechat-name">微信</span>
        <span class="wechat-status"></span>
      </header>
      <main class="wechat-main" id="wc-main">
        <div class="wc-search">搜索</div>
        <ul class="wc-contacts" id="wc-contacts"></ul>
      </main>
    </div>
  `;
  const list = root.querySelector('#wc-contacts');
  CONTACTS.forEach(c => {
    const li = document.createElement('li');
    li.className = 'wc-contact';
    li.dataset.id = c.id;
    li.innerHTML = `
      <div class="wc-contact-avatar">${c.avatar}</div>
      <div class="wechat-contact-info">
        <div class="wc-contact-top">
          <span class="wc-contact-name">${c.name}</span>
          <span class="wc-contact-time">${c.time}</span>
        </div>
        <div class="wc-contact-preview">${c.preview}</div>
      </div>
      ${c.online ? '<span class="wc-contact-online"></span>' : ''}
    `;
    li.addEventListener('click', () => {
      // 【修复】不走 ctx.go，直接在同一 root 重新渲染聊天视图
      // 避免 makeAppGo 动态 import 时把 wrap 卸载导致 play() 序列被中断
      renderChat(root, ctx, findContact(c.id));
    });
    list.appendChild(li);
  });
}

// ============ 单聊 ============
function renderChat(root, ctx, contact) {
  root.innerHTML = `
    <div class="wechat">
      <header class="wechat-header">
        <span class="wechat-back" id="wc-back" role="button" tabindex="0">‹</span>
        <span class="wechat-name">${contact.name}</span>
        <span class="wechat-status">${contact.online ? '在线' : ''}</span>
      </header>
      <main class="wechat-main" id="wc-main"></main>
      <footer class="wechat-input" aria-hidden="true">
        <span class="wechat-icon">🎤</span>
        <span class="wechat-text-input">发消息</span>
        <span class="wechat-icon">😊</span>
        <span class="wechat-icon">＋</span>
      </footer>
      <div class="wechat-go-wrap" id="wc-go" hidden>
        <button class="wechat-go" type="button">${contact.action.text}</button>
      </div>
    </div>
  `;

  const main = root.querySelector('#wc-main');
  const goWrap = root.querySelector('#wc-go');
  const goBtn = goWrap.querySelector('.wechat-go');
  const back = root.querySelector('#wc-back');

  function onBack() {
    // 返回通讯录：同 root 直接重渲染列表，避免 ctx.go 触发窗口级重载
    renderContactsList(root, ctx);
  }
  back.addEventListener('click', onBack);
  back.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') onBack(); });

  function scroll() { main.scrollTop = main.scrollHeight; }
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function addTime(text) {
    const t = document.createElement('div');
    t.className = 'wc-time';
    t.textContent = text;
    main.appendChild(t); scroll();
    return wait(180);
  }

  function addText(side, text, author) {
    // 群聊显示发言人
    if (author && side === 'friend') {
      const a = document.createElement('div');
      a.className = 'wc-author';
      a.textContent = author;
      main.appendChild(a);
    }
    const b = document.createElement('div');
    b.className = `wc-bubble ${side}`;
    b.textContent = text;                 // 直接出字，不要打字机（聊天消息是"弹"出来的）
    main.appendChild(b); scroll();
    return wait(reduced ? 60 : 260);      // 每条之间留一点呼吸感
  }

  function addVoice(side, dur) {
    const b = document.createElement('div');
    b.className = `wc-bubble ${side} voice`;
    b.innerHTML = `<span class="voice-icon">▶</span><span class="voice-bar"><span class="voice-bar-inner" style="width:100%"></span></span><span class="voice-dur">''${dur}"</span>`;
    main.appendChild(b); scroll();
    return wait(reduced ? 80 : 420);
  }

  function addRecall(who) {
    const r = document.createElement('div');
    r.className = 'wc-recall';
    r.textContent = `${who} 撤回了一条消息`;
    main.appendChild(r); scroll();
    return wait(reduced ? 80 : 420);
  }

  async function play() {
    for (const item of contact.script) {
      if (item.type === 'time')   await addTime(item.text);
      else if (item.type === 'text')   await addText(item.side, item.text, item.author);
      else if (item.type === 'voice')  await addVoice(item.side, item.dur);
      else if (item.type === 'recall') await addRecall(item.who || contact.name);
      await wait(reduced ? 60 : 220);
    }
    goWrap.hidden = false;
    goBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function onGo() {
    const { target, payload } = contact.action;
    // 从微信出发去夜钓：需要破窗跳出到全屏场景
    if (target === 'intro') {
      if (typeof ctx.breakOut === 'function') ctx.breakOut(target);
      else ctx.go(target, payload);
    } else {
      ctx.go(target, payload);
    }
  }
  goBtn.addEventListener('click', onGo);

  play();
}

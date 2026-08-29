// Edge 浏览器 app：
// 自绘 chrome + URL 栏 + 书签 + 返回/前进。
// 新标签页 = 「洄川镇居民信息网」（虚构地点·钓鱼小镇·正常/被污染两种形态）。
// 仅顶部 tab 与书签是真的"跳转"，其他卡片点开是同一 canvas 内的内页。
// 污染等级由 pollution.getCog 决定：clean → 干淨居民门户;
//                                         compliant → 头条与边角开始有「不对劲的字眼」
//                                         unstable → 多人称水源异常 / 邪门
//                                         marked → 整个门户被腐生社内网覆写
import { forumScene }   from '../scenes/forum.js';
import { searchScene }  from '../scenes/search.js';
import { getCog }       from '../state/pollution.js';

const SCENES = { forum: forumScene, search: searchScene };

export function edgeApp(body, ctx) {
  let currentCtrl = null;
  const history = [{ url: 'huichuan://newtab', label: '新标签页' }];
  let hIndex = 0;

  body.innerHTML = `
    <div class="edge-app">
      <div class="browser-chrome">
        <div class="browser-toolbar">
          <button class="browser-back" id="back" type="button" aria-label="返回">←</button>
          <div class="browser-url" id="url">huichuan://newtab</div>
        </div>
        <div class="browser-bookmarks">
          <div class="bookmark" data-url="huichuan://newtab">洄川镇</div>
          <div class="bookmark" data-url="huichuan://forum">洄川夜钓吧</div>
          <div class="bookmark" data-url="huichuan://search">洄川检索</div>
        </div>
      </div>
      <div class="browser-canvas" id="canvas"></div>
    </div>
  `;

  const canvas = body.querySelector('#canvas');
  const urlBar = body.querySelector('#url');
  const backBtn = body.querySelector('#back');

  function unmountCurrent() {
    if (currentCtrl && currentCtrl.unmount) {
      try { currentCtrl.unmount(); } catch (e) { /* 忽略 */ }
    }
    currentCtrl = null;
  }

  function mountScene(name) {
    unmountCurrent();
    canvas.innerHTML = '';
    const wrap = document.createElement('div');
    wrap.className = 'scene';
    canvas.appendChild(wrap);
    if (!SCENES[name]) {
      canvas.innerHTML = '<div class="browser-page">未找到页面。</div>';
      return;
    }
    currentCtrl = SCENES[name](wrap, { go: ctx.go, breakOut: ctx.breakOut, payload: null });
  }

  // ─────────── 内嵌新闻详情 / 天气 / 钓友动态 ───────────
  // 同 canvas 内切换，不再走 scene，更不会跳论坛。
  function renderArticle(articleId) {
    const ART = {
      'a-water': {
        bread: '首页 · 资讯 · 头条',
        tag: '独家',
        title: '洄川水域三度封禁：那晚 04-23-17 到底发生了什么',
        by: '本地频道 · 2小时前',
        body: [
          '近日，洄川水域管理处在三日内两度启动紧急封禁。',
          '"夜里两点前后，那一带水面亮度异常。"一名不愿具名的巡查员说，"我们接到过电话，但去到现场时水面已经平息了。"',
          '封禁区域内目前已设置警示桩。管理处提醒居民不要擅入。',
          '4 月 23 日 17 时记录在案的钓鱼者下落仍不明。'
        ],
        related: [
          { id: 'a-green', t: '凌晨洄川湖面出现绿光' },
          { id: 'a-miss', t: '27 岁男子失联，最后定位 04-23-17' }
        ]
      },
      'a-green': {
        bread: '首页 · 资讯 · 本地',
        tag: '目击',
        title: '凌晨四点的洄川水面出现绿光，持续约 17 秒，无人解释',
        by: '目击者投稿 · 7小时前',
        body: [
          '4 月 23 日凌晨，住在临湖街的周阿姨透过自家二层窗户，看到湖面上一片绿光。',
          '"不是我眼花，我叫老伴起来两个人一起看的。"她记得持续时间比看一集短剧还短。',
          '管理处目前未对光来源作进一步说明。'
        ],
        related: [
          { id: 'a-water', t: '洄川水域三度封禁' },
          { id: 'a-lotus', t: '湖面长出莲花？' }
        ]
      },
      'a-miss': {
        bread: '首页 · 资讯 · 寻找',
        tag: '寻人',
        title: '周屿，男，27 岁，至今失联，最后定位 04-23-17 水域',
        by: '寻人启事 · 1天前',
        body: [
          '周屿，男，27 岁，身高 178，4 月 23 日下午出门垂钓。',
          '家人称其带了一支旧玻璃钢竿、一只橙色桶，未带备用电池。',
          '若您有任何线索，请联系当地派出所。'
        ],
        related: [
          { id: 'a-water', t: '三度封禁记录' }
        ]
      },
      'a-lotus': {
        bread: '首页 · 资讯 · 奇闻',
        tag: '奇闻',
        title: '湖面长出莲花？当地渔民：从未见过。附模糊照片',
        by: '市民投稿 · 1天前',
        body: [
          '一名渔民声称自己在 04-23-17 区域靠岸时，看到一朵青色莲花贴在岸边石头上。',
          '"我活了六十多年，没见过那种颜色。"',
          '照片附后，经裁剪处理。'
        ],
        related: [
          { id: 'a-green', t: '凌晨绿光' }
        ]
      },
      'a-sing': {
        bread: '首页 · 资讯 · 民间',
        tag: '传说',
        title: '深夜湖面传来女人唱歌，目击者已搬走',
        by: '转载 · 3天前',
        body: [
          '有居民称夜里两三点从湖面方向听到哼唱。',
          '"声音不远，但听不清词。反复一段。"',
          '一名声称听过的居民，已于上周搬离。'
        ],
        related: []
      },
      'a-care': {
        bread: '首页 · 本地 · 政务',
        tag: '公告',
        title: '关于近期水源巡查次数增加的说明',
        by: '洄川水域管理处 · 今日',
        body: [
          '为保障饮水安全，4 月起本镇夜间巡查次数提升至 4 次 / 周。',
          '若您发现水面异常、水色变化或漂浮物，请拨打值班电话。',
          '值班电话 0432-0017-2304。'
        ],
        related: []
      }
    };
    const a = ART[articleId] || ART['a-water'];
    canvas.innerHTML = `
      <article class="browser-article">
        <div class="article-bread">${a.bread}</div>
        <div class="article-tag">${a.tag}</div>
        <h2 class="article-title">${a.title}</h2>
        <div class="article-by">${a.by}</div>
        <div class="article-body">
          ${a.body.map(p => `<p>${p}</p>`).join('')}
        </div>
        ${a.related && a.related.length ? `
          <div class="article-related">
            <div class="related-h">相关阅读</div>
            ${a.related.map(r => `<div class="related-item" data-aid="${r.id}">· ${r.t}</div>`).join('')}
          </div>` : ''}
        <div class="article-back" data-url="huichuan://newtab">‹ 返回门户</div>
      </article>
    `;
    canvas.querySelectorAll('.related-item').forEach(el => {
      el.addEventListener('click', () => renderArticle(el.dataset.aid));
    });
    canvas.querySelector('.article-back').addEventListener('click', () => renderNewTab());
  }

  // ─────────── 内嵌天气子页 ───────────
  function renderWeather() {
    canvas.innerHTML = `
      <div class="browser-page weather-page">
        <div class="weather-city">洄川镇</div>
        <div class="weather-h">48 小时天气</div>
        <table class="weather-table">
          <thead><tr><th>时段</th><th>天气</th><th>气温</th><th>湿度</th><th>水温</th></tr></thead>
          <tbody>
            <tr><td>今夜</td><td>静</td><td>14°</td><td>92%</td><td class="warn">21° 偏高</td></tr>
            <tr><td>明晨</td><td>轻雾</td><td>11°</td><td>95%</td><td>20°</td></tr>
            <tr><td>明日午后</td><td>多云</td><td>19°</td><td>71%</td><td>20°</td></tr>
            <tr><td>明夜</td><td>静</td><td>12°</td><td>94%</td><td>21° 偏高</td></tr>
          </tbody>
        </table>
        <div class="weather-note">⚠ 水温连续三日高于历史同期，请勿擅自夜钓。</div>
        <div class="article-back" data-url="huichuan://newtab">‹ 返回门户</div>
      </div>
    `;
    canvas.querySelector('.article-back').addEventListener('click', () => renderNewTab());
  }

  // ─────────── 内嵌钓友动态子页 ───────────
  function renderCatch() {
    canvas.innerHTML = `
      <div class="browser-page">
        <div class="weather-h">本周钓友动态</div>
        <ul class="catch-list">
          <li><b>@老陈</b> · 4-21 · 洄川上游 · 鲤鱼 2.3 公斤 · 备注：水温偏高了</li>
          <li><b>@阿伟</b> · 4-22 · 洄川下游 · 鲫鱼若干 · 备注：换了个新饵坑</li>
          <li><b>@周屿</b> · 4-23 · 04-23-17 · 已失联</li>
          <li><b>@阿伟</b> · 4-24 · 洄川下游 · 未下竿 · 备注：今天水太静</li>
        </ul>
        <div class="catch-note">注：4-23 之后，下游多位钓友表示「最近水源有点不对」。</div>
        <div class="article-back" data-url="huichuan://newtab">‹ 返回门户</div>
      </div>
    `;
    canvas.querySelector('.article-back').addEventListener('click', () => renderNewTab());
  }

  // ─────────── 新标签页 = 居民门户（按污染分级） ───────────
  function renderNewTab() {
    unmountCurrent();
    const cog = getCog() || 'clean';
    if      (cog === 'marked')     return renderPortalMarked();
    if      (cog === 'unstable')   return renderPortalUnstable();
    if      (cog === 'compliant')  return renderPortalCompliant();
    return renderPortalClean();
  }

  // 阳间版：头条封面为真顶部图，卡片为真的本地新闻
  function renderPortalClean() {
    canvas.innerHTML = `
      <div class="portal portal-clean">
        ${portalHeader('洄川镇 · 居民信息网', '为你聚合 • 本地 • 每一天')}
        <div class="portal-nav">
          <span class="portal-nav-item active">推荐</span>
          <span class="portal-nav-item">本地</span>
          <span class="portal-nav-item">政务</span>
          <span class="portal-nav-item" data-page="weather">天气</span>
          <span class="portal-nav-item">便民</span>
          <span class="portal-nav-item" data-page="catch">钓友</span>
        </div>
        <div class="portal-main">
          <div class="portal-hero" data-aid="a-water">
            <div class="hero-overlay">
              <div class="hero-tag">独家</div>
              <div class="hero-title">洄川水域三度封禁：那晚 04-23-17 到底发生了什么</div>
              <div class="hero-meta">2小时前 · 本地频道 · 4.7万阅读</div>
            </div>
          </div>
          <div class="portal-cards">
            ${cardClean('a-green', '01', '凌晨四点的洄川湖面出现绿光，持续约 17 秒，无人解释', '7小时前 · 48评')}
            ${cardClean('a-miss', '02', '周屿，男，27 岁，至今失联，最后定位 04-23-17 水域', '1天前 · 312评')}
            ${cardClean('a-care', '03', '关于近期水源巡查次数增加的说明 · 管理处', '今天 · 12评')}
            ${cardClean('a-lotus','04', '湖面长出莲花？当地渔民：从未见过。附模糊照片', '1天前 · 156评')}
            ${cardClean('a-sing', '05', '深夜湖面传来女人唱歌，目击者已搬走', '3天前 · 204评')}
            ${cardClean('a-water','06', '为什么 04-23-17 之后没人敢再下竿（长文）', '2天前 · 89评')}
          </div>
          ${widgetsClean()}
        </div>
      </div>
    `;
    bindPortal();
  }

  function cardClean(aid, no, title, meta) {
    return `<div class="portal-card" data-aid="${aid}"><div class="card-thumb">${no}</div><div class="card-title">${title}</div><div class="card-meta">${meta}</div></div>`;
  }
  function widgetsClean() {
    return `
      <div class="portal-widgets">
        <div class="widget weather">
          <div class="widget-h">天气 · 洄川</div>
          <div class="widget-b">
            <div class="w-city">今夜</div>
            <div class="w-temp">14°</div>
            <div class="w-info">湿度 92% · 能见度低 · 风 静</div>
          </div>
        </div>
        <div class="widget hot">
          <div class="widget-h">热搜榜</div>
          <div class="widget-b">
            <ol>
              <li>04-23-17</li>
              <li>周屿失联</li>
              <li>三度封禁</li>
              <li>水源巡查</li>
              <li>本地公交改线</li>
              <li>西瓜上市</li>
              <li>小学运动会</li>
            </ol>
          </div>
        </div>
        <div class="widget index">
          <div class="widget-h">本周便民</div>
          <div class="widget-b">
            <div>· 镇办食堂周日营业</div>
            <div>· 卫生院下周二义诊</div>
            <div>· 钓鱼证到期续办</div>
            <div>· 临湖街凌晨限行</div>
          </div>
        </div>
      </div>
    `;
  }

  // 自欺版：开始有「不对劲的字」混入
  function renderPortalCompliant() {
    canvas.innerHTML = `
      <div class="portal portal-compliant">
        ${portalHeader('洄川镇 · 居民信息网', '为你聚合 • 本地 • 每一天')}
        <div class="portal-nav">
          <span class="portal-nav-item active">推荐</span>
          <span class="portal-nav-item">本地</span>
          <span class="portal-nav-item" data-page="weather">天气</span>
          <span class="portal-nav-item">政务</span>
          <span class="portal-nav-item">便民</span>
          <span class="portal-nav-item" data-page="catch">钓友</span>
        </div>
        <div class="portal-main">
          <div class="portal-hero" data-aid="a-green">
            <div class="hero-overlay">
              <div class="hero-tag" style="background:#bfa14a">未解</div>
              <div class="hero-title">凌晨洄川湖面又出现绿光 · 比上次更亮</div>
              <div class="hero-meta">3小时前 · 本地频道 · 6.9万阅读</div>
            </div>
          </div>
          <div class="portal-cards">
            <div class="portal-card" data-aid="a-miss"><div class="card-thumb">01</div><div class="card-title">周屿失联第五天 · 警犬沿湖岸未寻获</div><div class="card-meta">2小时前 · 452评</div></div>
            <div class="portal-card" data-aid="a-care"><div class="card-thumb">02</div><div class="card-title">关于近期水源巡查次数增加的说明</div><div class="card-meta">今天 · 12评</div></div>
            <div class="portal-card" data-aid="a-lotus"><div class="card-thumb">03</div><div class="card-title">湖面长出莲花？渔民说我没见过这种颜色</div><div class="card-meta">1天前 · 156评</div></div>
            <div class="portal-card" data-aid="a-sing"><div class="card-thumb">04</div><div class="card-title">深夜湖面传来女人唱歌，目击者已搬走</div><div class="card-meta">3天前 · 204评</div></div>
            <div class="portal-card" data-aid="a-water"><div class="card-thumb">05</div><div class="card-title">「那不是鱼咬钩」 · 多名钓友反应浮标诡异</div><div class="card-meta">5小时前 · 22评</div></div>
            <div class="portal-card" data-aid="a-water"><div class="card-thumb">06</div><div class="card-title">为什么 04-23-17 之后没人敢再下竿（长文）</div><div class="card-meta">2天前 · 89评</div></div>
          </div>
          <div class="portal-widgets">
            <div class="widget weather">
              <div class="widget-h">天气 · 洄川</div>
              <div class="widget-b">
                <div class="w-city">今夜</div>
                <div class="w-temp">14°</div>
                <div class="w-info">湿度 92% · 能见度低 · 风 静</div>
                <div class="w-info warn">⚠ 水温异常偏高</div>
              </div>
            </div>
            <div class="widget hot">
              <div class="widget-h">热搜榜</div>
              <div class="widget-b">
                <ol>
                  <li>04-23-17</li>
                  <li>周屿失联</li>
                  <li>绿光再现</li>
                  <li>purazvna<span style="color:#aaa;font-size:11px">  （新）</span></li>
                  <li>本地公交改线</li>
                  <li>钓鱼证到期</li>
                  <li>古法沉眠</li>
                </ol>
              </div>
            </div>
            <div class="widget index">
              <div class="widget-h">便民 · 一栏</div>
              <div class="widget-b">
                <div>· 镇办食堂周日营业</div>
                <div>· 临湖街凌晨限行（试）</div>
                <div>· <span style="color:#999">第三产业招聘：水面巡查员</span></div>
                <div>· 古法研习 · 周五班</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    bindPortal();
  }

  // 渗血版：标题诡异、信息层级失效
  function renderPortalUnstable() {
    canvas.innerHTML = `
      <div class="portal portal-unstable">
        ${portalHeader('洄川镇 · 居民信息网', '为你聚合 • 本地 • 每一天 <span style="color:#c66;font-size:11px">/ 暂无更新</span>')}
        <div class="portal-nav">
          <span class="portal-nav-item active">推荐</span>
          <span class="portal-nav-item">本地</span>
          <span class="portal-nav-item" data-page="weather">天气</span>
          <span class="portal-nav-item" data-page="catch">钓友</span>
          <span class="portal-nav-item disabled">便民</span>
          <span class="portal-nav-item disabled">政务</span>
        </div>
        <div class="portal-main">
          <div class="portal-hero" data-aid="a-sing">
            <div class="hero-overlay">
              <div class="hero-tag" style="background:#7d3a3a">传闻</div>
              <div class="hero-title">「别下竿 · 你钓上来的不是鱼」</div>
              <div class="hero-meta">已发布身份不明 · 12小时</div>
            </div>
          </div>
          <div class="portal-cards">
            <div class="portal-card" data-aid="a-water"><div class="card-thumb">01</div><div class="card-title">04-23-17 · 水面以下他们说不会有人住</div><div class="card-meta">3小时前 · 88评</div></div>
            <div class="portal-card" data-aid="a-lotus"><div class="card-thumb">02</div><div class="card-title">凌晨绿光 · 其实持续了 17 秒以上</div><div class="card-meta">5小时前 · 33评</div></div>
            <div class="portal-card" data-aid="a-miss"><div class="card-thumb">03</div><div class="card-title">周屿失联：搜救队撤回 · 没有第二次</div><div class="card-meta">今天 · 199评</div></div>
            <div class="portal-card"><div class="card-thumb">04</div><div class="card-title">水温 · 三日内异常未解释</div><div class="card-meta">今天 · 9评</div></div>
            <div class="portal-card"><div class="card-thumb">05</div><div class="card-title">钓鱼者请勿独行 · 联合劝告</div><div class="card-meta">今天 · 41评</div></div>
            <div class="portal-card"><div class="card-thumb">06</div><div class="card-title">本地公交改线 · 限行延长至凌晨</div><div class="card-meta">今天</div></div>
          </div>
          <div class="portal-widgets">
            <div class="widget weather">
              <div class="widget-h">天气 · 洄川</div>
              <div class="widget-b">
                <div class="w-city">今夜</div>
                <div class="w-temp">13°</div>
                <div class="w-info">湿度 99% · 风 静</div>
                <div class="w-info warn">⚠ 水温：自记仪器未校准</div>
              </div>
            </div>
            <div class="widget hot">
              <div class="widget-h">热搜榜</div>
              <div class="widget-b">
                <ol>
                  <li>purazvna</li>
                  <li>04-23-17</li>
                  <li>腐土青莲</li>
                  <li>沉眠者</li>
                  <li>「别下竿」</li>
                  <li>26%人睡不好</li>
                  <li>反着读</li>
                </ol>
              </div>
            </div>
            <div class="widget index">
              <div class="widget-h">巡值安排</div>
              <div class="widget-b">
                <div>· 04-24 03 班：<span style="color:#999">已取消</span></div>
                <div>· 04-24 11 班：<span style="color:#999">已取消</span></div>
                <div>· 04-25 起：<span style="color:#7d3a3a">待通知</span></div>
                <div>· 古法研习：<span style="color:#aaa">延后</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    bindPortal();
  }

  // 深标版：门户被邪神网域覆写
  function renderPortalMarked() {
    canvas.innerHTML = `
      <div class="portal portal-marked">
        ${portalHeader('腐 生 社 · 内 网', '<span style="color:#7d3a3a">歡 迎 回 來</span>', true)}
        <div class="portal-nav">
          <span class="portal-nav-item active">沉眠之窗</span>
          <span class="portal-nav-item" data-page="weather">气象</span>
          <span class="portal-nav-item">污染指数</span>
          <span class="portal-nav-item" data-page="catch">眼讯</span>
          <span class="portal-nav-item disabled">政务</span>
          <span class="portal-nav-item disabled">便民</span>
        </div>
        <div class="portal-main">
          <div class="portal-hero" data-aid="a-water">
            <div class="hero-overlay">
              <div class="hero-tag" style="background:#3a0000">沉眠</div>
              <div class="hero-title">它已经醒来 · 你已被 点 名</div>
              <div class="hero-meta">仅一方可见</div>
            </div>
          </div>
          <div class="portal-cards">
            <div class="portal-card" data-aid="a-lotus"><div class="card-thumb">眼</div><div class="card-title">腐土青莲 · 已开封</div><div class="card-meta">你 12 小时前</div></div>
            <div class="portal-card" data-aid="a-miss"><div class="card-thumb">针</div><div class="card-title">周屿 · 不再被需要</div><div class="card-meta">所属：沉眠者</div></div>
            <div class="portal-card" data-aid="a-water"><div class="card-thumb">水</div><div class="card-title">04-23-17 · 已完成</div><div class="card-meta">下一例：你</div></div>
            <div class="portal-card"><div class="card-thumb">省</div><div class="card-title">当地水域：字已读完</div><div class="card-meta">剩余：你</div></div>
            <div class="portal-card"><div class="card-thumb">读</div><div class="card-title">purazvna — 反读</div><div class="card-meta">索取下文</div></div>
            <div class="portal-card"><div class="card-thumb">没</div><div class="card-title">请勿把网址告诉同住人</div><div class="card-meta">——腐生社</div></div>
          </div>
          <div class="portal-widgets">
            <div class="widget weather">
              <div class="widget-h">水 况 · 04-25</div>
              <div class="widget-b">
                <div class="w-city">湖底：亮</div>
                <div class="w-temp">14°</div>
                <div class="w-info warn">浮标 · 三重下沉</div>
                <div class="w-info warn">请按你看到的回去</div>
              </div>
            </div>
            <div class="widget hot">
              <div class="widget-h">点名榜</div>
              <div class="widget-b">
                <ol>
                  <li>周屿</li>
                  <li>你</li>
                  <li>请勿查看邻居</li>
                  <li>请勿拖延</li>
                  <li>请勿靠湖</li>
                  <li>请勿苏醒</li>
                  <li>请勿读出声</li>
                </ol>
              </div>
            </div>
            <div class="widget index">
              <div class="widget-h">最终安排</div>
              <div class="widget-b">
                <div>· 此前误读</div>
                <div>· <span style="color:#c66">最后对照</span></div>
                <div>· 可选三条路</div>
                <div>· 在 你读后补齐</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    bindPortal();
  }

  function portalHeader(title, sub, dark) {
    return `
      <div class="portal-header ${dark ? 'dark' : ''}">
        <div class="portal-logo">洄</div>
        <div class="portal-titles">
          <div class="portal-t">${title}</div>
          <div class="portal-s">${sub}</div>
        </div>
        <div class="portal-search"><span>搜索整个门户</span></div>
      </div>
    `;
  }

  function bindPortal() {
    // Hero / 卡 → 同 canvas 内展开新闻
    canvas.querySelector('.portal-hero')?.addEventListener('click', e => {
      const aid = e.currentTarget.dataset.aid;
      if (aid) renderArticle(aid);
    });
    canvas.querySelectorAll('.portal-card').forEach(c => {
      c.addEventListener('click', () => {
        const aid = c.dataset.aid;
        if (aid) renderArticle(aid);
      });
    });
    // nav 项目：天气/钓友 走子页，其他占位
    canvas.querySelectorAll('.portal-nav-item').forEach(n => {
      n.addEventListener('click', () => {
        if (n.classList.contains('disabled')) return;
        const p = n.dataset.page;
        if (p === 'weather') renderWeather();
        else if (p === 'catch') renderCatch();
      });
    });
  }

  // ─────────── 路由 ───────────
  function updateBack() { backBtn.disabled = hIndex <= 0; }

  function navigate(url, push) {
    urlBar.textContent = url;
    if (push) {
      history.splice(hIndex + 1);
      history.push({ url, label: url });
      hIndex = history.length - 1;
    }
    if      (url === 'huichuan://newtab') renderNewTab();
    else if (url === 'huichuan://forum')  mountScene('forum');
    else if (url === 'huichuan://search') mountScene('search');
    else canvas.innerHTML = '<div class="browser-page">未找到页面。</div>';
    updateBack();
  }

  backBtn.addEventListener('click', () => {
    if (hIndex > 0) {
      hIndex -= 1;
      const e = history[hIndex];
      navigate(e.url, false);
    }
  });

  // 书签栏 = 真正的三个站点
  body.querySelectorAll('.bookmark').forEach(bm => {
    bm.addEventListener('click', () => navigate(bm.dataset.url, true));
  });

  navigate('huichuan://newtab', false);

  return {
    unmount: () => { unmountCurrent(); }
  };
}

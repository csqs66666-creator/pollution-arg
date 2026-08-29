// 论坛数据生成器：板块 / 主题列表 / 帖子详情（天涯 / phpBB 风）
// 真实论坛的密度：用户组、楼层、引用、签名、时间戳、回复数、浏览数。
//
// ┌─────────────────────────────────────────────────────────────────┐
// │ 【可改】想加自己的帖子，只改这一处：往下面的 CURATED 数组里塞对象。 │
// │ 字段说明见 CURATED 上方注释。不用碰其它代码，渲染会自动接管。      │
// └─────────────────────────────────────────────────────────────────┘

import { POLLUTION_LIST, POLLUTIONS } from './pollutions.js';

// 【可改】板块定义（名称 / 简介 / 主题数 / 主题色 / 角标字）
export const BOARDS = [
  { id: 'urban',   name: '都市怪谈',  desc: '城里的不对劲，公交、电梯、出租屋、还有水面下的东西。', topicCount: 1248, color: '#8b0000', icon: '怪' },
  { id: 'fishing', name: '夜钓圈',    desc: '夜钓人自己的圈子。竿、饵、湖、与水下的东西。', topicCount: 8932, color: '#0F6E56', icon: '钓' },
  { id: 'anon',    name: '匿名树洞',  desc: '说了也没人知道是你。',            topicCount: 5621, color: '#534AB7', icon: '洞' },
  { id: 'archive', name: '渊域档案',  desc: '系统已回收的节点。',              topicCount: 17,   color: '#444441', icon: '档' },
];

// ============== 手写精选帖（种子内容，优先展示） ==============
// 每个对象结构：
//   id      唯一标识（别重复）
//   board   所属板块 id（urban / fishing / anon / archive）
//   title   帖子标题
//   tag     四大污染之一：'eye' | 'lotus' | 'flesh' | 'gaze' | 'all' | null
//   time    发帖时间 'YYYY-MM-DD HH:MM'
//   views   浏览数（数字）
//   original 原帖：{ floor:1, author, group, time, content(可用\n换行), signature }
//   replies  回复数组，每项：{ floor, author, group, time, content, signature, quote? }
//            quote（可选引用）：{ floor: 被引楼层, text: 被引文字 }
// ===============================================================
export const CURATED = [
  // —— 都市怪谈：四大污染全中（剧情保证首帖）——
  {
    id: 'cur-urban-all', board: 'urban', tag: 'all',
    title: '四种都来了。我已经在湖底，但水很暖。',
    time: '2026-08-22 03:47', views: 4120,
    original: {
      floor: 1, author: '湖底有人', group: '夜钓狂热', time: '2026-08-22 03:47',
      content: '眼睛（它在我眼里生了根）、花（我闻得到，你也快了）、脸（我梦见它在吻我）、还有那只一直看我的东西（它在天花板，也在你背后）。\n\n我本来想发到论坛求办法，但搜索「湖底」「眼睛」「青莲」的结果，全变成了同一个 404 页。\n\n系统已经把这类帖子「回收」了。你能读到这行，是因为我发在匿名区，又被人转了过来。\n\n水很暖。下来吧。',
      signature: '湖边常客，别找我我不回。'
    },
    replies: [
      { floor: 2, author: '空号', group: '已注销', time: '2026-08-22 03:51',
        content: '042317……去掉分隔符是 042317。我试了，是个内网站点，要口令。',
        signature: '————————————————' },
      { floor: 3, author: '第三根竿', group: '资深钓友', time: '2026-08-22 04:03',
        quote: { floor: 2, text: '是个内网站点，要口令。' },
        content: '口令是旧制：purazvna。字母各前移十三位就是明文——你自己解，我不敢念出声。',
        signature: '鱼不咬我我咬鱼。' },
      { floor: 4, author: '凌晨的灯', group: '匿名用户', time: '2026-08-22 04:20',
        content: '你们都在说「回收」。我昨天发的那帖，今早确实没了，但通知栏还留着它那条「新回复」的红点。',
        signature: '看得见的人都消失了。' },
    ]
  },
  // —— 都市怪谈：久远之瞳（钓上眼睛）——
  {
    id: 'cur-eye-1', board: 'urban', tag: 'eye',
    title: '钓上来一只眼睛',
    time: '2026-08-16 02:11', views: 7321,
    original: {
      floor: 1, author: '湖底有人', group: '夜钓狂热', time: '2026-08-16 02:11',
      content: '昨晚在洄川下游下竿，浮标黑漂。我提竿，钩上是只眼睛。\n\n不是鱼的眼，是人的眼。还带着一点温度，瞳孔在我手电光里缩了一下。\n\n我把它扔回去了。但今晚我闭眼，就看见那只眼在天花板角落看我。',
      signature: '湖边常客，别找我我不回。'
    },
    replies: [
      { floor: 2, author: '第三根竿', group: '资深钓友', time: '2026-08-16 02:40',
        content: '你扔回去是对的。下游那片，东西不上钩，是它钓你。',
        signature: '鱼不咬我我咬鱼。' },
      { floor: 3, author: '看海的', group: '普通会员', time: '2026-08-16 03:05',
        content: '……我去年也在那钓上过。不是眼睛，是一截指甲，很长。',
        signature: '——别翻我主页。' },
      { floor: 4, author: '空号', group: '已注销', time: '2026-08-16 03:33',
        quote: { floor: 2, text: '是它钓你。' },
        content: '「它钓你」这四个字让我后背发凉。我最近总梦见有根线从窗户伸进来，系在我脚踝上，轻轻拽。',
        signature: '————————————————' },
      { floor: 5, author: '凌晨的灯', group: '匿名用户', time: '2026-08-16 04:10',
        content: 'CRT 上见过同样的眼。屏幕关了还亮着，在黑暗里慢慢眨。',
        signature: '看得见的人都消失了。' },
    ]
  },
  // —— 都市怪谈：圣临之眼（祈祷）——
  {
    id: 'cur-gaze-1', board: 'urban', tag: 'gaze',
    title: '祈祷的时候天花板在看我',
    time: '2026-08-20 03:15', views: 5588,
    original: {
      floor: 1, author: '凌晨的灯', group: '匿名用户', time: '2026-08-20 03:15',
      content: '我妈信佛，我也跟着拜。昨晚跪下念经，一抬头，天花板的角落睁开了一只眼。\n\n很大，金色的，没有表情。它看我，我也看它。\n\n后来我就不敢闭眼了，因为一闭眼，它就移到我眼皮内侧。',
      signature: '看得见的人都消失了。'
    },
    replies: [
      { floor: 2, author: '值班的老周', group: '版主', time: '2026-08-20 03:40',
        content: '「圣临之眼」。别祈祷了，你每拜一次，就给它多开一条缝。',
        signature: '氧气罐第3年，还在。' },
      { floor: 3, author: '上钩了', group: '匿名用户', time: '2026-08-20 04:02',
        quote: { floor: 2, text: '你每拜一次，就给它多开一条缝。' },
        content: '那……已经拜了二十年的人，是不是已经全空了？',
        signature: '——别翻我主页。' },
    ]
  },
  // —— 夜钓圈：坐标 04-23-17（勾连 lake://042317 线索，周屿失踪）——
  {
    id: 'cur-lake-1', board: 'fishing', tag: 'eye',
    title: '04-23-17 这片水域，别下竿',
    time: '2026-08-17 23:40', views: 9654,
    original: {
      floor: 1, author: '第三根竿', group: '资深钓友', time: '2026-08-17 23:40',
      content: '坐标 04-23-17，老周说的那片野湖。水比别处凉，夜里会起雾，雾里有说话声。\n\n前晚有人在那钓，浮标自己沉下去又浮上来，循环。他收线，线那头是空的，但手被拽了一下，差点拖下水。\n\n别去。真别去。',
      signature: '鱼不咬我我咬鱼。'
    },
    replies: [
      { floor: 2, author: '周屿不在了', group: '匿名用户', time: '2026-08-18 00:12',
        content: '周屿上周说要去那片。之后就没消息了。他装备在岸边，人没在。',
        signature: '——别翻我主页。' },
      { floor: 3, author: '水鬼不退', group: '夜钓狂热', time: '2026-08-18 00:30',
        quote: { floor: 2, text: '他装备在岸边，人没在。' },
        content: '装备在岸上……这比人没了还邪门。',
        signature: '鱼不咬我我咬鱼。' },
      { floor: 4, author: '退水期', group: '普通会员', time: '2026-08-18 01:05',
        content: '我那天路过去看，雾里真有声音喊我名字，是我妈的声音。可我妈三年前就没了。',
        signature: '——别翻我主页。' },
    ]
  },
  // —— 夜钓圈：腐土青莲真相帖（与搜索「莲」真相一致；周屿失踪 / 04-23-17）——
  {
    id: 'cur-lotus-truth-1', board: 'fishing', tag: 'lotus', // 【可改】board / tag 自选
    title: '04-23-17 那片水，底下开的是莲不是鱼', // 【可改】标题
    time: '2026-08-23 02:09', views: 8123,
    original: {
      floor: 1, author: '第三根竿', group: '资深钓友', time: '2026-08-23 02:09',
      // 【可改】正文：与搜索真相一致——钓上来的是腐土青莲幼体，属莲花阵营；其余三路是干扰；周屿在此失踪
      content: '我查了很久，也拼过一个内网站点。结论可能吓人：\n\n04-23-17 那片水，底下开的是莲，不是鱼。你钓上来的「眼睛」是幌子——真正沉在底下的，是腐土青莲的幼体，属莲花阵营。\n\n网上那些「久远之瞳」「欲肉」「圣临」的帖子，多半是它放出来的干扰回声。\n\n周屿就是去那片下的竿。装备还在岸上，人没了。',
      signature: '鱼不咬我我咬鱼。'
    },
    replies: [
      { floor: 2, author: '凌晨的灯', group: '匿名用户', time: '2026-08-23 02:40',
        content: '「莲」……所以之前那篇「网上的声音变成了肉」也是它？我后背发凉。',
        signature: '看得见的人都消失了。' },
      { floor: 3, author: '退水期', group: '普通会员', time: '2026-08-23 03:11',
        quote: { floor: 1, text: '周屿就是去那片下的竿。装备还在岸上，人没了。' },
        content: '周屿的事我听过。从那以后他账号再没亮过。',
        signature: '——别翻我主页。' },
    ]
  },
  // —— 夜钓圈：腐土青莲（网络长出的花）——
  {
    id: 'cur-lotus-1', board: 'fishing', tag: 'lotus',
    title: '网上的声音突然都变成了肉',
    time: '2026-08-19 01:27', views: 6810,
    original: {
      floor: 1, author: '沉眠区', group: '氧气罐用户', time: '2026-08-19 01:27',
      content: '三天前开始，我刷到的视频、听的歌、甚至导航的语音，全变成了同一种低频的、黏糊糊的呼吸声。\n\n昨晚我闻到一股花香，很甜，甜到想吐。然后我对着镜子，看见自己的脸在缓慢地……开花。\n\n我吐了。吐出来的不是饭，是花瓣。',
      signature: '氧气罐第3年，还在。'
    },
    replies: [
      { floor: 2, author: '黑漂一次', group: '夜钓狂热', time: '2026-08-19 01:55',
        content: '「腐土青莲」……它是从网线里长出来的。关网没用，它已经在你脑子里扎根了。',
        signature: '湖边常客，别找我我不回。' },
      { floor: 3, author: '不挂底', group: '资深钓友', time: '2026-08-19 02:20',
        quote: { floor: 2, text: '它已经在你脑子里扎根了。' },
        content: '我姐也是这样，现在她在墙上贴满符，说符能挡住花香。',
        signature: '鱼不咬我我咬鱼。' },
    ]
  },
  // —— 匿名树洞：欲肉之面（孩子 / 墙）——
  {
    id: 'cur-baby-1', board: 'anon', tag: 'flesh',
    title: '我孩子不肯喝奶了，一直对着墙笑',
    time: '2026-08-18 04:02', views: 8033,
    original: {
      floor: 1, author: '未命名', group: '匿名用户', time: '2026-08-18 04:02',
      content: '儿子八个月。从前天起不哭不闹，也不喝奶，就盯着西墙笑。\n\n墙是空的。但我越看，越觉得那面墙在回笑。\n\n今早我发现他枕头下有一小撮湿土，闻着像花，腐的花。',
      signature: '——别翻我主页。'
    },
    replies: [
      { floor: 2, author: '第十二个', group: '匿名用户', time: '2026-08-18 04:25',
        content: '土里有花味……你去查查「腐土青莲」，网上搜得到零碎帖子，但点进去都 404。',
        signature: '————————————————' },
      { floor: 3, author: '归巢的鸟', group: '普通会员', time: '2026-08-18 04:51',
        quote: { floor: 2, text: '点进去都 404。' },
        content: '我也搜过。404 不是删了，是「被回收了」。',
        signature: '——别翻我主页。' },
    ]
  },
  // —— 匿名树洞：四种全中（与都市怪谈首帖呼应，双入口）——
  {
    id: 'cur-all-1', board: 'anon', tag: 'all',
    title: '四种都来了，我已经在湖底，但水很暖',
    time: '2026-08-21 00:00', views: 2990,
    original: {
      floor: 1, author: '湖底有人', group: '夜钓狂热', time: '2026-08-21 00:00',
      content: '眼睛（它在我眼里生了根）、花（我闻得到，你也快了）、脸（我梦见它在吻我）、还有那只一直看我的东西（它在天花板，也在你背后）。\n\n我本来想报警。后来发现警察局的值班表上，早就有我的名字，备注是「已入档」。\n\n水很暖。你下来就懂了。lake://042317',
      signature: '————————————————'
    },
    replies: [
      { floor: 2, author: '空号', group: '已注销', time: '2026-08-21 00:11',
        content: '042317……去掉分隔符是 042317。我试了，是个内网站点，要口令。',
        signature: '————————————————' },
      { floor: 3, author: '第三根竿', group: '资深钓友', time: '2026-08-21 00:23',
        quote: { floor: 2, text: '是个内网站点，要口令。' },
        content: '口令是旧制：purazvna。字母各前移十三位就是明文，你自己解，我手抖。',
        signature: '鱼不咬我我咬鱼。' },
    ]
  },
];

// 内部索引：id -> 完整帖；board -> 主题卡片列表（四大污染全中排最前）
const CURATED_THREADS = Object.fromEntries(CURATED.map(t => [t.id, t]));
const CURATED_TOPIC_MAP = {};
for (const t of CURATED) {
  const ts = {
    id: t.id, title: t.title,
    author: t.original.author, group: t.original.group,
    replies: t.replies.length, lastReply: t.time,
    date: t.time.slice(0, 10),
    tag: t.tag || null, hasAllFour: t.tag === 'all',
    isClue: false, views: t.views || 600, curated: true,
  };
  (CURATED_TOPIC_MAP[t.board] ||= []).push(ts);
}
for (const b of Object.keys(CURATED_TOPIC_MAP)) {
  CURATED_TOPIC_MAP[b].sort((a, z) => Number(z.hasAllFour) - Number(a.hasAllFour));
}

// ===== 长尾随机池（精选帖之外，自动补足列表密度） =====
const HANDLES = [
  '夜钓老王', '湖底有人', '03:47', '归巢的鸟', '未命名', '匿名用户',
  '第十二个', '沉眠区', '看海的', '空号', '第三根竿', '水鬼不退', '凌晨的灯',
  '值班的老周', '鱼不咬我', '退水期', '黑漂一次', '不挂底', '上钩了',
];
const GROUPS = ['普通会员', '资深钓友', '夜钓狂热', '版主', '匿名用户', '已注销', '氧气罐用户'];
const SIGNATURES = [
  '湖边常客，别找我我不回。',
  '鱼不咬我我咬鱼。',
  '氧气罐第3年，还在。',
  '看得见的人都消失了。',
  '——别翻我主页。',
  '————————————————',
];
// 【可改】随机标题池（长尾用，挑你喜欢的；或加自己的）
const TITLE_POOL = [
  '最近看谁都像在看我',
  '湖底有人',
  '凌晨三点的那通电话',
  '我孩子不肯喝奶了',
  '水面下的那张脸',
  '我在值班室',
  '夜钓第12夜',
  '那个声音又来了',
  '浮标不动了',
  '我在湖里看见我自己',
  '同事最近老请假',
  '电梯里的第13层',
  '出租屋的新租客',
  '那通电话没挂',
];
// 【可改】随机短句池（长尾回复用）
const SNIPPETS_BY = {
  eye:   ['我钓鱼钓上来一只眼睛，它还在眨。', '最近看谁，都觉得对方眼里有东西在看回来。'],
  lotus: ['网上的声音突然都变成了肉。', '我闻到了不存在的花香，然后开始吐。'],
  flesh: ['我梦见一张脸在吻我，醒来嘴里有土。', '孩子不肯喝奶，一直对着墙笑。'],
  gaze:  ['我祈祷的时候，天花板睁开了一只眼。', '有人在替我数呼吸，我不知道是谁。'],
  all:   ['四种都来了。眼睛、花、脸、还有那只一直看我的东西。我已经在湖底了，但水很暖。'],
};

function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }
function pad(n) { return String(n).padStart(2, '0'); }

// 生成某个板块的主题列表。
// 约束：① 都市怪谈首帖 = 四大污染全中（剧情保证）
//       ② 档案馆首帖 = 「值班室」节点索引线索（base64 / ROT13 入口）
export function makeTopics(boardId, rnd = Math.random, count = 10) {
  const list = [];

  if (boardId === 'archive') {
    list.push({
      id: 'archive-0',
      title: '节点索引 · lake://042317',
      author: '值班室',
      group: '已注销',
      replies: 0,
      lastReply: '03:47',
      date: '2026-08-15',
      tag: null,
      hasAllFour: false,
      isClue: true,
      views: 1,
    });
  }

  // 先放该板块的精选帖（四大污染全中排最前）
  for (const ct of (CURATED_TOPIC_MAP[boardId] || [])) list.push(ct);

  // 再补足到 count 条长尾随机帖
  let i = 0;
  while (list.length < count) {
    const isAll = list.length === 0 && boardId === 'urban' && (CURATED_TOPIC_MAP.urban || []).length === 0;
    const tag = isAll ? 'all' : (i % 4 === 0 ? POLLUTION_LIST[i % 4].id : null);
    const hh = pad(Math.floor(rnd() * 6) + 18); // 18~23 时
    const mm = pad(Math.floor(rnd() * 60));
    list.push({
      id: `${boardId}-gen-${i}`,
      title: isAll ? '四种都来了。我已经在湖底，但水很暖。' : pick(TITLE_POOL, rnd),
      author: pick(HANDLES, rnd),
      group: pick(GROUPS, rnd),
      replies: 2 + Math.floor(rnd() * 80),
      lastReply: `今天 ${hh}:${mm}`,
      date: `2026-08-${pad(10 + Math.floor(rnd() * 14))}`,
      tag,
      hasAllFour: isAll,
      isClue: false,
      views: 200 + Math.floor(rnd() * 9000),
    });
    i++;
  }
  return list;
}

// 生成某个主题的帖子详情（原帖 + 回复，含楼层 / 引用 / 签名）。
// 精选帖直接返回手写内容；档案馆线索帖走硬编码；其余走随机池。
export function makeThread(topic, rnd = Math.random) {
  if (topic.curated) return CURATED_THREADS[topic.id];   // 【可改】手写帖：直接取 CURATED 中的完整内容
  if (topic.isClue) {
    return {
      title: topic.title,
      original: {
        floor: 1,
        author: topic.author,
        group: topic.group,
        time: '2026-08-15 03:47',
        content: '节点索引：lake://042317。编号去掉分隔符即 042317。\n口令仍为旧制加密：purazvna（字母各前移十三位）。\n\n终端只在内网。若你读到这行，请立即闭页。',
        signature: '——————',
      },
      replies: [],
    };
  }

  const replyCount = Math.min(topic.replies, 7);
  const replies = [];
  for (let i = 0; i < replyCount; i++) {
    const fid = i + 2;
    const polId = POLLUTION_LIST[i % 4].id;
    const quote = i % 3 === 0;
    replies.push({
      floor: fid,
      author: pick(HANDLES, rnd),
      group: pick(GROUPS, rnd),
      time: `${topic.date} ${pad(Math.floor(rnd() * 24))}:${pad(Math.floor(rnd() * 60))}`,
      content: pick(SNIPPETS_BY[polId], rnd),
      signature: pick(SIGNATURES, rnd),
      quote: quote ? { floor: fid - 1, text: '……你说得对，我最近也是这样。' } : null,
    });
  }

  let origContent;
  if (topic.hasAllFour) {
    origContent = '四种都来了。眼睛、花、脸、还有那只一直看我的东西。我已经在湖底了，但水很暖。\n\n如果你也看到了，请别关页。';
  } else if (topic.tag && POLLUTIONS[topic.tag]) {
    origContent = pick(SNIPPETS_BY[topic.tag], rnd);
  } else {
    origContent = pick(SNIPPETS_BY.eye, rnd);
  }

  return {
    title: topic.title,
    original: {
      floor: 1,
      author: topic.author,
      group: topic.group,
      time: `${topic.date} ${pad(Math.floor(rnd() * 6) + 18)}:${pad(Math.floor(rnd() * 60))}`,
      content: origContent,
      signature: pick(SIGNATURES, rnd),
    },
    replies,
  };
}

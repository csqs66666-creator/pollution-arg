// 论坛受害者生成器（程序化 / 多模态中的"生成"维度）
// 必含一名被四大污染全中的可怜人。
import { POLLUTION_LIST } from './pollutions.js';

const HANDLES = [
  '夜钓老王', '湖底有人', '03:47', '归巢的鸟', '未命名', '匿名用户',
  '第十二个', '沉眠区', '看海的', '空号', '第三根竿', '水鬼不退', '凌晨的灯'
];
const SNIPPETS = {
  eye:   ['我钓鱼钓上来一只眼睛，它还在眨。', '最近看谁，都觉得对方眼里有东西在看回来。'],
  lotus: ['网上的声音突然都变成了肉。', '我闻到了不存在的花香，然后开始吐。'],
  flesh: ['我梦见一张脸在吻我，醒来嘴里有土。', '孩子不肯喝奶，一直对着墙笑。'],
  gaze:  ['我祈祷的时候，天花板睁开了一只眼。', '有人在替我数呼吸，我不知道是谁。'],
  all:   ['四种都来了。眼睛、花、脸、还有那只一直看我的东西。我已经在湖底了，但水很暖。']
};

function pick(arr, rnd) { return arr[Math.floor(rnd() * arr.length)]; }

export function makeVictim(rnd = Math.random, opts = {}) {
  const forceAll = opts.forceAll;
  let infected;
  if (forceAll) {
    infected = POLLUTION_LIST.map(p => p.id);
  } else {
    const n = 1 + Math.floor(rnd() * 3); // 1~3 种
    const shuffled = [...POLLUTION_LIST].sort(() => rnd() - 0.5);
    infected = shuffled.slice(0, n).map(p => p.id);
  }
  const primary = infected[0];
  const snippet = forceAll ? SNIPPETS.all[0] : pick(SNIPPETS[primary], rnd);
  const handle = pick(HANDLES, rnd);
  const hh = String(Math.floor(rnd() * 4)).padStart(2, '0'); // 00~03 时
  const mm = String(Math.floor(rnd() * 60)).padStart(2, '0');
  return { handle, infected, snippet, time: `${hh}:${mm}`, forceAll: !!forceAll };
}

export function makeForum(rnd = Math.random, count = 12) {
  const list = [];
  list.push(makeVictim(rnd, { forceAll: true })); // 必含四大污染全中者
  for (let i = 1; i < count; i++) list.push(makeVictim(rnd));
  return list;
}

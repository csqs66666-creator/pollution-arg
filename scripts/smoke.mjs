// 离线冒烟测试：给浏览器全局打桩，真把 main.js 跑一遍，抓导入/导出与顶层运行错误。
// 不验证渲染，只验证模块图能正确加载、无抛错。
function makeEl() {
  const el = {
    className: '', innerHTML: '', textContent: '', href: '', title: '', tabIndex: 0,
    dataset: {}, style: {}, classList: { add() {}, remove() {}, contains() { return false; } },
    children: [],
    append() {}, appendChild() { return el; }, insertBefore() { return el; },
    addEventListener() {}, removeEventListener() {}, setAttribute() {}, getAttribute() { return null; },
    querySelector() { return makeEl(); }, querySelectorAll() { return []; },
    getContext() { return null; }, getBoundingClientRect() { return { width: 800, height: 450 }; },
    focus() {}, click() {},
  };
  return el;
}
const doc = {
  body: makeEl(), firstChild: null,
  getElementById() { return makeEl(); },
  createElement() { return makeEl(); },
  querySelector() { return makeEl(); },
  addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
};
globalThis.window = globalThis;
globalThis.document = doc;
globalThis.addEventListener = () => {};
globalThis.localStorage = { getItem() { return null; }, setItem() {}, removeItem() {} };
globalThis.matchMedia = () => ({ matches: false, addEventListener() {} });
globalThis.performance = { now: () => 0 };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};
globalThis.CustomEvent = class { constructor(t, o) { this.type = t; this.detail = o && o.detail; } };
globalThis.confirm = () => false;
globalThis.location = { reload() {}, href: '' };
globalThis.devicePixelRatio = 1;

let failed = false;
process.on('unhandledRejection', (e) => { console.error('unhandledRejection:', e); failed = true; });

try {
  await import('../src/main.js');
  console.log('OK   main.js 加载并初始化完成（无顶层抛错）');
} catch (e) {
  console.error('FAIL main.js:', e);
  failed = true;
}

// 顺带验证数据层
try {
  const { makeForum } = await import('../src/data/victims.js');
  const list = makeForum();
  const all = list.filter(v => v.forceAll);
  console.log(`OK   victims：生成 ${list.length} 帖，其中四大污染全中者 ${all.length} 名`);
  if (all.length !== 1) { console.error('FAIL：应恰好有 1 名全中者'); failed = true; }
} catch (e) { console.error('FAIL victims:', e); failed = true; }

console.log(failed ? '\n结果：存在错误' : '\n结果：全部通过');
process.exit(failed ? 1 : 0);

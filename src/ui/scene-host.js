// 窗口内场景宿主 · 把全局场景契约 (root, ctx) => { unmount } 挂进任意容器
//
// 为什么单独一个模块：微信窗和 Edge 窗都要「卸旧 → 建 wrap → 挂新」这套动作，
// 抽出来避免两处重复实现（也让「破窗白名单」只有一个来源）。
//
// 注意：wrap 上**不加** .scene 类。窗口本身已经嵌在 main.js 建的 .scene 里，
//       search.js 的 `.scene .search-wrap` 一类后代选择器天然命中；
//       再加一层 .scene 会把 820px max-width / 70vh min-height 带进窗口里。

// 【可改】破窗白名单：这些是「全屏外景」，在窗口里跑没有意义，一律关窗 + 全局 go()
export const FIELD_SCENES = ['intro', 'incident', 'ending', 'restart'];

export function isFieldScene(name) {
  return FIELD_SCENES.includes(name);
}

export function createSceneHost(container) {
  let current = null;

  function clear() {
    if (current && typeof current.unmount === 'function') {
      try { current.unmount(); } catch (e) { console.error('[scene-host] 场景 unmount 失败', e); }
    }
    current = null;
    container.innerHTML = '';
  }

  // sceneFn: (root, ctx) => { unmount } ；ctx 由调用方给（内含该窗自己的 go）
  function mount(sceneFn, ctx) {
    clear();
    const wrap = document.createElement('div');
    wrap.className = 'win-scene';
    container.appendChild(wrap);
    current = sceneFn(wrap, ctx) || { unmount() {} };
    container.scrollTop = 0;
    return current;
  }

  return {
    mount,
    clear,
    unmount: clear,
    get current() { return current; }
  };
}

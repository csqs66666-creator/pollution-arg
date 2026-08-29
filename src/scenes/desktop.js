// 场景 · 桌面（主页/入口）
// 仿电脑桌面：壁纸 + 3 图标（Edge / 微信 / 线索档案）+ 任务栏 + 时钟
// 点击图标 → createWindow + app.mount，窗口可拖/关/聚焦。
// ctx.go('intro/incident/ending/restart') 由 window 内的 go 拦截 → 关闭窗口 + 全屏跳出。
import { createWindow } from '../ui/window.js';
import { wechatApp }   from '../apps/wechat.js';
import { edgeApp }     from '../apps/edge.js';
import { folderApp }   from '../apps/folder.js';

// 【可改】应用注册表：key=图标 data-app, name=窗口标题, icon=图标 url, mount=app 函数, w/h=默认尺寸
const APPS = {
  edge:   { name: 'Edge — 洄川内网',   icon: './assets/desktop/icon-edge.png',   mount: edgeApp,   w: 920, h: 600 },
  wechat: { name: '微信',              icon: './assets/desktop/icon-wechat.jpg', mount: wechatApp, w: 380, h: 580 },
  folder: { name: '线索档案',          icon: './assets/desktop/icon-folder.png', mount: folderApp, w: 680, h: 460 }
};

// 这些场景触发"破窗"：关闭所有窗口 + 全局跳（全屏场）
const FIELD_SCENES = new Set(['intro', 'incident', 'ending', 'restart', 'finale']);

let openWindows = []; // 任务栏用

export function desktopScene(root, ctx) {
  // 暴露给各 app 的 breakOut：关窗 + 全局跳转
  ctx.breakOut = (name) => {
    closeAllWindows();
    ctx.go(name);
  };

  document.body.classList.add('on-desktop');

  root.innerHTML = `
    <div class="desktop-root">
      <div class="desktop-icons">
        <div class="desktop-icon" data-app="edge" tabindex="0">
          <img src="./assets/desktop/icon-edge.png" alt="Edge">
          <span>Edge</span>
        </div>
        <div class="desktop-icon" data-app="wechat" tabindex="0">
          <img src="./assets/desktop/icon-wechat.jpg" alt="微信">
          <span>微信</span>
        </div>
        <div class="desktop-icon" data-app="folder" tabindex="0">
          <img src="./assets/desktop/icon-folder.png" alt="线索档案">
          <span>线索档案</span>
        </div>
      </div>
      <div class="taskbar">
        <div class="taskbar-items" id="taskbar-items"></div>
        <div class="taskbar-status" id="taskbar-status">网速 · 异常</div>
        <div class="taskbar-clock" id="taskbar-clock">--:--</div>
      </div>
    </div>
  `;

  const taskbarItems = root.querySelector('#taskbar-items');
  const taskbarClock = root.querySelector('#taskbar-clock');
  const taskbarStatus = root.querySelector('#taskbar-status');

  function updateClock() {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    taskbarClock.textContent = `${hh}:${mm}`;
  }
  updateClock();
  const clockTimer = setInterval(updateClock, 10000);

  // 状态指示：每 8-12 秒小幅波动（不带 animation，文字内容变化，让主页"在呼吸"）
  // 【可改】状态文案/范围
  function updateStatus() {
    const tags = ['异常', '波动', '延迟偏高', '丢包 2%', '恢复中', '异常'];
    const ms = 230 + Math.floor(Math.random() * 90);
    const tag = tags[Math.floor(Math.random() * tags.length)];
    taskbarStatus.textContent = `网速 · ${tag} · ${ms}ms`;
  }
  updateStatus();
  const statusTimer = setInterval(updateStatus, 9000);

  function updateTaskbar() {
    taskbarItems.innerHTML = '';
    openWindows.forEach(w => {
      const item = document.createElement('div');
      item.className = 'taskbar-item' + (w.focused ? ' active' : '');
      item.innerHTML = `<img src="${w.icon}" alt=""><span>${w.title}</span>`;
      item.addEventListener('click', () => focusWindow(w));
      taskbarItems.appendChild(item);
    });
  }

  function focusWindow(w) {
    openWindows.forEach(x => { x.focused = false; });
    w.focused = true;
    try { w.win.focus(); } catch (e) { /* 忽略 */ }
    updateTaskbar();
  }

  function closeAllWindows() {
    // 先复制再迭代（close 会从 openWindows 移除元素）
    [...openWindows].forEach(w => w.close());
  }

  // 为单个窗口的 app 提供 go：
  //  - 命中 FIELD_SCENES → breakOut（关窗 + 全局）
  //  - 否则（论坛/检索/微信）→ 在窗口 body 内切场景
  function makeAppGo(win, currentCtrlRef) {
    return (name, payload) => {
      if (FIELD_SCENES.has(name)) {
        ctx.breakOut(name);
        return;
      }
      // 动态 import 现场场景：按需载入
      import(`../scenes/${name}.js`).then(mod => {
        const sceneFn = mod[`${name}Scene`];
        if (typeof sceneFn !== 'function') {
          console.warn('[desktop] 无场景函数:', name);
          return;
        }
        if (currentCtrlRef.ctrl && currentCtrlRef.ctrl.unmount) {
          try { currentCtrlRef.ctrl.unmount(); } catch (e) { /* 忽略 */ }
        }
        win.body.innerHTML = '';
        const wrap = document.createElement('div');
        wrap.className = 'scene';
        win.body.appendChild(wrap);
        const innerGo = makeAppGo(win, currentCtrlRef);
        currentCtrlRef.ctrl = sceneFn(wrap, { go: innerGo, payload });
      }).catch(err => {
        console.warn('[desktop] 加载场景失败:', name, err);
      });
    };
  }

  function openApp(appId) {
    const app = APPS[appId];
    if (!app) return;

    const currentCtrlRef = { ctrl: null };
    const winId = `${appId}_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

    const win = createWindow({
      title: app.name,
      icon: app.icon,
      width: app.w,
      height: app.h,
      onClose: () => {
        if (currentCtrlRef.ctrl && currentCtrlRef.ctrl.unmount) {
          try { currentCtrlRef.ctrl.unmount(); } catch (e) { /* 忽略 */ }
        }
        openWindows = openWindows.filter(w => w.id !== winId);
        updateTaskbar();
      }
    });

    const winEntry = {
      id: winId,
      appId,
      title: app.name,
      icon: app.icon,
      win,
      focused: false
    };
    openWindows.push(winEntry);
    focusWindow(winEntry);

    // 给 app 用的 ctx：go 由 desktop 提供（处理 breakOut + in-window mount）
    const go = makeAppGo(win, currentCtrlRef);
    const appCtx = { go, breakOut: ctx.breakOut };

    // app.mount 返回 { unmount }（有些 app 直接返回 ctrl；统一处理）
    const ret = app.mount(win.body, appCtx);
    if (ret && ret.unmount) currentCtrlRef.ctrl = ret;
  }

  // 图标点击 → 打开应用（同时高亮选中）
  root.querySelectorAll('.desktop-icon').forEach(icon => {
    const onActivate = () => {
      const appId = icon.dataset.app;
      root.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
      openApp(appId);
    };
    icon.addEventListener('click', onActivate);
    icon.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActivate(); }
    });
  });

  // 空白处点击取消选中
  root.querySelector('.desktop-root').addEventListener('mousedown', (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('desktop-icons')) {
      root.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    }
  });

  return {
    unmount: () => {
      clearInterval(clockTimer);
      clearInterval(statusTimer);
      closeAllWindows();
      document.body.classList.remove('on-desktop');
    }
  };
}

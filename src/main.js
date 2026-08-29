// 钓渊 · 引导 + 场景路由
import { initHud } from './ui/hud.js';
import { initCorruption } from './render/corruption.js';
import { introScene } from './scenes/intro.js';
import { incidentScene } from './scenes/incident.js';
import { forumScene } from './scenes/forum.js';
import { endingScene } from './scenes/ending.js';
import { getCog } from './state/pollution.js';
import { restartScene } from './scenes/restart.js';
import { wechatScene } from './scenes/wechat.js'; // 引子·微信聊天
import { searchScene } from './scenes/search.js'; // 搜索解密核心
import { desktopScene } from './scenes/desktop.js'; // 主页·假桌面沉浸层（入口）
import { finaleScene } from './scenes/finale.js'; // 终局三结局（养成/臣服/反杀）

// 场景表。desktop = 主页/入口（假桌面）：微信 / 论坛 / 检索都在它的窗口里跑；
// intro / incident / ending / restart 是「全屏外景」，由窗口内的 breakOut 关窗后跳过来。
const scenes = { intro: introScene, restart: restartScene, wechat: wechatScene, incident: incidentScene, forum: forumScene, ending: endingScene, search: searchScene, desktop: desktopScene, finale: finaleScene };
let current = null;
const root = document.getElementById('app');

function go(name, payload) {
  if (current && current.unmount) { try { current.unmount(); } catch {} }
  const wrap = document.createElement('div'); wrap.className = 'scene';
  root.innerHTML = ''; root.appendChild(wrap);
  current = scenes[name](wrap, { go, payload });
}

initHud();
initCorruption();
// cold-boot 修复：若上次已被入档（cog=marked），先弹重启卡，避免眼珠全屏死锁
// 【预览】调试用：URL 加 ?go=intro|incident|wechat|forum|search|ending|restart|desktop|finale
//        可直接跳到该场景（例：?go=forum&cog=3 看高潮眼；?go=desktop 看主页假桌面；?go=finale 看终局三结局）
const startScene = new URLSearchParams(location.search).get('go');
go(startScene && scenes[startScene] ? startScene : (getCog() === 'marked' ? 'restart' : 'desktop'));

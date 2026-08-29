// 微信 app：把 wechat 场景装进假窗口
// wechat.js 现在自带"通讯录 → 多联系人聊天"结构，点击联系人后通过 ctx.go('wechat', {contact}) 切回同一场景。
// "出发"按钮需要破窗到 intro，因此把 breakOut 也传进去。
import { wechatScene } from '../scenes/wechat.js';

export function wechatApp(body, ctx) {
  // 【可改】如果想替换默认打开的联系人，改 payload（null = 通讯录列表）
  return wechatScene(body, { go: ctx.go, breakOut: ctx.breakOut, payload: null });
}

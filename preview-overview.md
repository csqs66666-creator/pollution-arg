# 钓渊 · 本轮改动概览（预览就绪）

日期：2026-08-24
目标：按青司拍板的方向收口——删全页抖动、上"氛围呼吸"、论坛内容加厚、标注可改点、产出可润色预览。

## 一、动效（③ 氛围呼吸，已落地）
- `src/styles/motion.css`：删除 `body.corrupt-1/2/3` 的 `screenShake` 全页位移（就是你说的"眼酸/看不清"元凶）。
  改为 `.corrupt-veil` 暗角脉动：corrupt-2/3 时暗角呼吸、绝不位移正文。
- `src/render/corruption.js`：注入 `.corrupt-veil` 层 + 高潮屏中央叠真实眼睛素材
  （默认 `assets/pin/crops/crt-eyes-array_r1c1.jpg`，screen 混合 + 去色，只做"质感渗透"）。

## 二、论坛内容加厚（你点名"太少/没意思"）
- `src/data/forum-data.js`：新增 `CURATED` 手写精选帖 7 篇，全部串回世界观：
  - 钓上眼睛（久远之瞳）、04-23-17 水域禁钓（勾连 `lake://042317` + 周屿失踪）、
    腐土青莲（网络长出的花）、欲肉之面（孩子/墙）、圣临之眼（祈祷）、
    以及两处"四种全中"双入口帖（含 `purazvna` 口令梗）。
  - 长尾随机帖自动补足列表密度，不抢戏。

## 三、`【可改】` 标注（你后期自改代码的路标）
- `forum-data.js`：板块、`CURATED`、随机标题/短句池均标 `【可改】`。
- `forum.js`：论坛标题/氛围旁白、进入旁白、两个分支按钮文案标 `【可改】`。
- `wechat.js`：`SCRIPT` 对话数组 + 朋友昵称"周屿"标 `【可改】`。

## 四、预览调试钩子（不用打通关就能看效果）
- `src/main.js`：`?go=forum|wechat|incident|intro|ending` 直接跳场景。
- `corruption.js`：`?cog=1|2|3` 临时覆盖腐化档位（**不写 localStorage**，刷新即恢复，不会锁死存档）。
  - 例：`?go=forum&cog=2` 看氛围呼吸 + 加厚内容；`?go=forum&cog=3` 看高潮真实眼。

## 五、运行
- 离线：`node serve.mjs` → http://localhost:5173 （当前已在跑）
- 有网后：`npm install && npm run dev`（工程结构不变）

## 待青司润色/决策
- 高潮眼用哪张切片？（默认 CRT 眼阵中心；想要"真实人眼"可改 `eyes-collage_r1c1.jpg`）
- 论坛手写帖的语气/人名是否要换成你自己的梗？
- 个人主页需求已按你要求**放弃**，本会话只做钓渊游戏站。

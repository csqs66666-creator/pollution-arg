# 钓渊 · Abyss Fishing — 项目概览（v1 最小可玩）

> 渊域（Abyssal Domain）世界观下的**多模态叙事恐怖游戏**。
> 主角陪朋友夜钓，钓上来一只眼睛，被「久远之瞳」缠上；论坛里还有别的倒霉蛋被随机污染缠上，有人甚至被四大污染全中。
> 产物落点：`D:\workbuddy\2026-08-24-18-47-34\abyss-fishing\`

---

## 1. 它是什么（核心体验）

一条**你能"活过"**的叙事线，而不是"观看"的静态站：

```
序章·陪钓  →  异变·钓上眼睛  →  缠染·论坛  →  结局
(intro)        (incident)          (forum)       (ending)
```

- 陪朋友钓鱼，可以选择「盯着水面看」→ 埋下被缠上的伏笔。
- 收线钓上**一只还在眨的眼睛**（Canvas 实时绘制，随污染加深而睁大、渗血）。
- 选择「睁眼看它」或直接「别过头」—— 决定认知污染的第一步走向。
- 进入论坛：那里有被随机污染缠上的普通人，程序化生成，且**必有一名被四大污染全中的可怜人**。
- 选择「深究下去」会一路推到真相、被「入档」；「关掉」则退回表层。
- 结局按你当前的污染态分四种文本收尾。

---

## 2. 为什么这样设计（支柱）

| 支柱 | 落地方式 |
|------|----------|
| **认知即代价**（非玩家成长，而是玩家退化） | 四态 `clean → subliminal(自欺) → bleeding(缠上) → marked(入档)`，持久化于 `localStorage['yuanyu.cog']`；表现为全站视觉退化，不是爽点解锁 |
| **多模态、多交互** | 视觉(Canvas 湖面+眼)、文本(对话+论坛)、程序生成(受害者)、越界发现(meta/控制台/localStorage/隐形文字)；听觉(Web Audio 嗡鸣)为设计项，v1 尚未接入 |
| **复用渊域地基，不重建** | 四大污染定义、认知污染状态机、线索编码（base64 / ROT13 / 控制台 / 隐形文字）全部来自青司《污染从何而来？》与 prior-session 的 `design/` 文档 |

---

## 3. 架构（ES Modules 浏览器原生，零运行时依赖）

```
abyss-fishing/
├─ index.html              # 入口：5 个 CSS + ./src/main.js；<meta> 藏越界线索
├─ serve.mjs               # 零依赖离线服务器（Node 内置模块，无需 npm install）
├─ vite.config.js          # base:'./'，便于部署
├─ package.json            # type:module；dev/build/preview/serve 脚本
├─ src/
│  ├─ main.js              # 引导 + 场景路由（mount/unmount 切换场景）
│  ├─ state/
│  │   ├─ pollution.js     # 认知污染状态机（四态 + localStorage + cog:change 广播）
│  │   └─ progress.js      # 会话内 flags（staredWater / reachedTruth ...）
│  ├─ data/
│  │   ├─ pollutions.js    # 四大污染定义（faithful to 渊域 bible）
│  │   └─ victims.js       # 程序化论坛受害者（必含 1 名四大全中者）
│  ├─ scenes/
│  │   ├─ intro.js         # 序章·陪钓（对话选择）
│  │   ├─ incident.js      # 异变·钓上眼睛（Canvas 眼 + 触发污染）
│  │   ├─ forum.js         # 缠染·论坛（随机受害者 + 全中者 + 线索）
│  │   └─ ending.js        # 按污染态收尾（4 文本结局 + 再玩一次）
│  ├─ ui/
│  │   ├─ hud.js           # 顶栏品牌眼 + 污染态标签 + 重置按钮
│  │   ├─ typewriter.js    # 打字机（尊重 reduced-motion）
│  │   └─ console-clues.js # 控制台线索（unstable/marked 时打印 base64/ROT13）
│  ├─ render/
│  │   ├─ water.js         # Canvas 湖面波纹 + 上升的眼睛（getState 回调驱动）
│  │   └─ corruption.js    # 腐化调度：blood-overlay / 深渊眼 / favicon·title 切换
│  └─ styles/
│      ├─ tokens.css       # 全部 CSS 变量（湖畔夜 surface + 渊域 deep）
│      ├─ surface.css      # topbar / scene / dialogue / forum / hud
│      ├─ deep.css         # corrupt-0..3 视觉阶梯 + 眼母题 + 隐形线索
│      ├─ motion.css       # 关键帧（screenShake/eyePulse/bleedDrip/glitch...）
│      └─ a11y.css         # prefers-reduced-motion 兜底 / 可见性隐藏
├─ public/                 # 静态 SVG 资源位（供后续接入 AI 生成素材）
└─ scripts/
    └─ smoke.mjs           # 无浏览器冒烟测试（stub DOM，验证加载 + 受害者生成）
```

**关键设计决策**
- **污染阶梯只动 token 与动画，不动版式**：`body.corrupt-0..3` 切换时，布局不变，仅配色/质感/特效插值。这是从渊域 style-bible 继承的铁律，保证可读性随恐怖感同步上升而不崩坏。
- **眼母题仅两处**：顶栏品牌眼（位置①）+ 深渊高潮（`.abyss-climax`）。避免视觉疲劳与 >3Hz 闪烁（a11y）。
- **确定性状态转移**：`toSubliminal / toBleeding / toMarked` 由玩家选择触发，非随机/非计时抽奖 —— 体验可复现、可讲解。
- **反应式 UI**：`pollution.js` 用 `CustomEvent('cog:change')` 广播，HUD / corruption / console-clues 各自订阅，互不耦合。

---

## 4. 怎么运行

### A. 此刻就跑（离线，零依赖）
```bash
cd D:\workbuddy\2026-08-24-18-47-34\abyss-fishing
node serve.mjs
# 浏览器打开 http://localhost:5173
```

### B. 标准 Vite 开发流（有网、npm install 之后）
```bash
npm install
npm run dev      # 热更新开发
npm run build    # 产出 dist/（base 已设为 './'，可直接部署）
npm run preview  # 预览构建产物
```
两套方式工程结构完全一致，切换无需改代码。

---

## 5. 验证状态（已通过）

| 检查 | 结果 |
|------|------|
| `node --check` 全部 15 个 JS 文件 | 全部 OK |
| `node serve.mjs` 启动 | `GET /` → 200 `text/html`；`/src/main.js` → 200 `text/javascript`；`/src/styles/tokens.css` → 200 `text/css` |
| `scripts/smoke.mjs` 冒烟测试 | `main.js` 加载初始化无顶层抛错；`makeForum()` 生成 12 帖，其中四大污染全中者 **恰好 1 名** |

---

## 6. 已知缺口 / 后续（v1 之外的路）

- [ ] **AI 生成素材接入**：论坛 `.media-slot` 与 `public/` 已留位，待青司提供海螺/ComfyUI 产出的图片/视频后接入。
- [ ] **Web Audio 低温嗡鸣**：README 列为多模态落点，但 v1 未接线（无 audio 模块）—— 是设计项而非已实现。
- [ ] **v2 分支**：开「圣临之眼」(`gaze`) 专线 + 秘商交易（真删线索）玩法。
- [ ] **安眠所 ARG 网站（prior-session 规划）**：已被本钓鱼游戏概念取代，未实际建造，需向青司做正式收尾说明。

---

_本概览由阿墨在 v1 代码落盘并验证通过后撰写，供后续迭代与资产接入参照。_

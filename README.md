# 钓渊 · Abyss Fishing

渊域（Abyssal Domain）世界观下的**多模态叙事恐怖游戏**。
主角陪朋友去夜钓，钓上来一只眼睛，被「久远之瞳」缠上；论坛里还有别的倒霉蛋也被随机污染缠上，有人甚至被四大污染全中。

> 复用渊域地基：四大污染定义 + 认知污染状态机（clean → subliminal → bleeding → marked）+ 线索编码（base64 / ROT13 / 控制台 / 隐形文字）。

## 两种运行方式

### A. 此刻就跑（零依赖，离线）
不需要安装任何东西，直接用 Node 内置模块起一个静态服务器：
```bash
node serve.mjs
# 浏览器打开 http://localhost:5173
```

### B. 标准 Vite 开发流（有网时）
```bash
npm install
npm run dev        # 开发服务器，热更新
npm run build      # 产出 dist/，可直接部署（base 已设为 './'）
npm run preview    # 预览构建产物
```

两种方式的工程结构完全一致，切换无需改动代码。

## 多模态 / 多交互落点
- **视觉**：Canvas 湖面波纹 + 眼睛母题；污染加深时全站走 `corrupt-0 → 3` 视觉阶梯（token 插值，版式不动）
- **文本**：序章对话选择 + 论坛线索流
- **听觉**：Web Audio 合成的低温环境嗡鸣，随污染加深而变浓（可一键关闭，不依赖外部音频文件）
- **程序生成**：论坛受害者帖由种子随机生成，必含一名「被四大污染全中」的可怜人
- **越界发现**：线索藏在 `<meta>`、控制台、`localStorage`、可见但低调的文字里

## 目录结构
```
abyss-fishing/
├─ index.html              # 入口（链接 CSS、挂载 #app）
├─ serve.mjs               # 零依赖离线服务器
├─ vite.config.js          # Vite 配置（base:'./'）
├─ package.json
├─ src/
│  ├─ main.js              # 引导 + 场景路由
│  ├─ state/               # pollution.js 污染状态机 / progress.js 进度
│  ├─ data/                # pollutions.js 四大污染 / victims.js 随机受害者
│  ├─ scenes/              # intro / incident / forum / ending
│  ├─ ui/                  # hud / typewriter / console-clues
│  ├─ render/              # water(画布) / corruption(腐化调度)
│  └─ styles/              # tokens / surface / deep / motion / a11y
└─ public/                 # 静态 SVG 资源（可放 AI 生成的受害者画像/录像位）
```

## 当前进度（v1 最小可玩）
- [x] 工程骨架（Vite 形态 + 零依赖服务器）
- [x] 污染状态机（复用渊域四态 + localStorage 持久化）
- [x] 序章·陪钓（对话选择）
- [x] 异变·钓上眼睛（Canvas 眼睛 + 触发污染）
- [x] 缠染·论坛（随机污染受害者 + 四大污染全中者 + 线索）
- [x] HUD + 多结局分支（按污染态收尾）
- [ ] AI 生成素材接入（海螺/ComfyUI 产物放进 public/ 与论坛位）
- [ ] v2：开圣临之眼分支 + 秘商交易（真删线索）

# claude

纸感、留白与陶土色：一个取材自 Anthropic 品牌色板（ivory / oat / clay / slate）的布吉岛主题，衬线标题 + 无衬线正文，左侧可折叠侧栏。

> 主题名与配色只是致敬，星芒标志为原创绘制，不使用任何商标素材。

## 特性

- **品牌色板** — 亮色：象牙纸底 `#f0eee6` + 陶土 `#d97757`；暗色：暖灰 `#262624`，边框与阴影都极轻
- **衬线排版** — 页面标题、卡片标题、金额数字使用衬线字体（Tiempos / Source Serif / Georgia 回退），正文使用系统无衬线
- **可折叠侧栏** — 桌面端可收起为图标栏（状态持久化）；平板 / 手机为抽屉；手机另有底部标签栏
- **浅色 / 深色 / 跟随系统** — 在侧栏底部的用户菜单中切换，切换时从点击位置圆形扩散
- **Element Plus 变量桥接** — 弹窗、输入框、提示条等组件自动跟随主题
- **完整页面** — 概览 / 订阅 / 节点 / 财务（含用量趋势图）/ 教程 / 公告 / 个性化配置 / 登录

## 目录结构

```
claude/
├── assets/style/
│   ├── _tokens.scss        # 品牌色板与语义令牌（亮色 / 暗色）
│   ├── _element-plus.scss  # Element Plus 变量桥接
│   └── main.scss           # 基础排版、工具类、动效
├── components/
│   ├── layout/             # SideBar / BottomTabBar / AppShell / AuthShell
│   ├── ui/                 # ClButton / ClCard / ClStat / ClCopyField / ClBadge / ClSegmented / ClSwitch / ClDialog / ClEmpty / ClMark
│   ├── tutorial/           # 教程步骤渲染
│   ├── AddCredit.vue
│   ├── TrafficChart.vue
│   ├── NodeConnectDialog.vue
│   ├── AnnouncementModal.vue
│   └── StatusCard.vue
├── composables/
│   ├── useSidebar.ts       # 侧栏折叠 / 抽屉状态
│   └── useCreditDialog.ts  # 全局充值弹窗
├── router/
│   ├── routes.ts
│   └── router.ts
└── views/
```

业务逻辑来自共享的 `@/composables/*`，主题只负责渲染。

## 设计令牌速查

| 变量                              | 用途                     |
| --------------------------------- | ------------------------ |
| `--cl-bg` / `--cl-surface`        | 页面 / 卡片背景          |
| `--cl-sidebar-bg`                 | 侧栏背景                 |
| `--cl-text` / `-2` / `-3`         | 主文字 / 次要 / 弱文字   |
| `--cl-accent` / `--cl-accent-ink` | 陶土强调色 / 用于文字的深一档 |
| `--cl-border` / `--cl-border-strong` | 发丝边框                |
| `--cl-font-serif` / `--cl-font-sans` | 衬线 / 无衬线字体栈     |

## 许可

MIT License © 2026 こはらちゃん

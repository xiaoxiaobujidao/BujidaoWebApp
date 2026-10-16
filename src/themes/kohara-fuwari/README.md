# kohara-fuwari

像 [Fuwari](https://github.com/saicaca/fuwari) / 小原 blog 一样的布吉岛主题：圆角卡片、浮动导航栏、可调主题色，以及从点击位置扩散开的明暗切换动画。

## 特性

- **可调主题色** — 所有颜色由一个 `--hue` 色相值通过 oklch 派生，在导航栏「显示设置」里拖动滑块即可实时换色，持久化到本地
- **浅色 / 深色 / 跟随系统** — 三态颜色模式，切换时使用 View Transitions API 从点击位置圆形扩散
- **单一响应式布局** — 桌面：浮动导航栏 + 左侧个人卡片 / 导航组件 + 内容列；平板：隐藏侧栏；手机：底部标签栏 + 顶部菜单面板。不再按设备刷新页面
- **Element Plus 变量桥接** — 弹窗、输入框、提示条等组件自动跟随主题色相与明暗模式
- **完整页面** — 概览 / 订阅 / 节点 / 财务（含用量趋势图）/ 教程 / 公告 / 个性化配置 / 登录
- **站点主题切换** — 在「显示设置」面板里切换到其它主题

## 目录结构

```
kohara-fuwari/
├── assets/style/
│   ├── _tokens.scss        # 设计令牌（亮色 / 暗色）
│   ├── _element-plus.scss  # Element Plus 变量桥接
│   └── main.scss           # 基础排版、Fuwari 风格工具类、动效
├── components/
│   ├── layout/             # NavBar / SideProfile / SideNav / BottomTabBar / DisplaySettings / AppShell / AuthShell
│   ├── ui/                 # FwButton / FwCard / FwStat / FwCopyField / FwBadge / FwSegmented / FwSwitch / FwDialog / FwEmpty
│   ├── tutorial/           # 教程步骤渲染
│   ├── AddCredit.vue       # 充值流程
│   ├── TrafficChart.vue    # ECharts 用量趋势
│   ├── NodeConnectDialog.vue
│   ├── AnnouncementModal.vue
│   └── StatusCard.vue
├── composables/
│   ├── useHue.ts           # 主题色相
│   └── useCreditDialog.ts  # 全局充值弹窗
├── router/
│   ├── routes.ts           # 单一路由表
│   └── router.ts           # 主题入口 + 路由守卫
└── views/                  # 各页面（全部复用 AppShell / AuthShell）
```

业务逻辑（账户、订阅、财务、节点、配置、公告、登录）来自共享的 `@/composables/*`，主题只负责渲染。

## 设计令牌速查

| 变量                       | 用途                               |
| -------------------------- | ---------------------------------- |
| `--hue`                    | 主题色相（0–360），其余颜色由此派生 |
| `--primary`                | 主题色                             |
| `--page-bg` / `--card-bg`  | 页面 / 卡片背景                    |
| `--text-1` / `-2` / `-3`   | 主文字 / 次要文字 / 弱文字         |
| `--btn-regular-bg`         | 淡色按钮背景                       |
| `--btn-plain-bg-hover`     | 无底按钮悬停背景                   |
| `--line-divider`           | 分割线                             |
| `--success` / `--warning` / `--danger` | 语义色（含 `-soft` 淡色版本） |

## 许可

MIT License © 2026 こはらちゃん

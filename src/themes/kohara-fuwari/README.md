# bujidaotheme-koharachan

像小原 blog 3.2 一样的布吉岛 Web 应用主题。

## 特性

- **响应式布局** — 手机 / 平板 / 桌面三端自适应，根据屏幕尺寸自动切换路由和 UI
- **暗色模式** — 完善的黑夜模式支持，基于 CSS 变量 + Element Plus 暗色主题
- **Element Plus** — 基于 Element Plus 组件库构建，风格统一
- **ECharts 图表** — 流量使用趋势可视化，支持暗色主题
- **Pinia 状态管理** — 轻量级的全局状态管理
- **VueUse** — 暗色模式自动检测与系统主题同步

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 + Composition API | 前端框架 |
| Vue Router 4 | 路由管理，支持设备类型动态路由 |
| Pinia | 状态管理 |
| Element Plus | UI 组件库 |
| ECharts | 数据可视化 |
| Sass / SCSS | 样式预处理 |
| VueUse | 工具组合 (useDark 等) |
| Vite | 构建工具 |

## 项目结构

```
kohara-fuwari/
├── components/           # 通用组件
│   ├── HeaderItem.vue    # 顶部导航栏 (含暗色模式切换)
│   ├── UserMenu.vue      # 用户侧边菜单
│   ├── ThemeSwitcher.vue # 主题切换器
│   ├── DarkTheme.vue     # 暗色模式组件
│   ├── ScreenSize.vue    # 屏幕尺寸监听
│   ├── AddCredit.vue     # 充值组件
│   └── TrafficHistory.vue# 流量历史图表
├── views/
│   ├── MainLayout.vue    # 主布局
│   ├── pc/               # 桌面端视图
│   ├── phone/            # 手机端视图
│   └── shared/           # 共享视图 (登录、注册等)
├── router/
│   ├── router.ts         # 路由入口 + 守卫
│   ├── desktop_router.ts # 桌面路由
│   ├── tablet_router.ts  # 平板路由
│   └── phone_router.ts   # 手机路由
├── stores/
│   └── screenStore.ts    # 屏幕尺寸状态
└── assets/
    └── style/
        └── main.scss     # 全局样式 + CSS 变量
```

## 暗色模式

基于 CSS 变量实现主题切换，布局级 `class="dark"` 控制。关键设计：

- **CSS 变量体系** — `main.scss` 中定义 `:root` (亮色) 和 `:root.dark` (暗色) 两套变量
- **组件覆盖** — 各组件通过 `.dark` 选择器覆盖特定样式
- **Element Plus 暗色** — 导入 `element-plus/theme-chalk/dark/css-vars.css` 实现组件暗色
- **ECharts 暗色** — 图表实例使用内置的 `'dark'` 主题
- **系统同步** — 通过 VueUse 的 `useDark()` 监听系统主题偏好

### CSS 变量速查

| 变量 | 用途 |
|------|------|
| `--primary` | 主题色 |
| `--page-bg` | 页面背景 |
| `--card-bg` | 卡片背景 |
| `--card-border` | 卡片边框 |
| `--deep-text` | 正文文字色 |
| `--title-active` | 激活标题色 |
| `--btn-content` | 按钮文字色 |
| `--btn-regular-bg` | 普通按钮背景 |

## 页面功能

- **概览** — 用户流量 / 余额 / 到期时间总览
- **订阅** — 套餐购买与管理
- **财务** — 余额与充值记录
- **公告** — 站点公告展示
- **节点** — 节点列表与详情
- **教程** — 各平台客户端配置教程（Android / iOS / macOS / Windows / 个性化）
- **个性化** — 主题与外观自定义

## 响应式断点

| 设备 | 宽度 | 路由文件 |
|------|------|----------|
| 手机 | < 768px | `phone_router.ts` |
| 平板 | 768px ~ 1024px | `tablet_router.ts` |
| 桌面 | > 1024px | `desktop_router.ts` |

## 开发

```bash
# 安装依赖 (在项目根目录)
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build
```

## 许可

MIT License © 2026 こはらちゃん
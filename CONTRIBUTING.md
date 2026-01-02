# 主题定制指南

本指南面向希望定制主题的开发者。项目采用模块化主题系统，每个主题完全独立，可自定义路由、组件、样式和资源。

## 快速开始

```bash
npm install
npm run dev
```

## 主题系统架构

### 核心机制

- **自动发现**: 系统通过 `import.meta.glob` 自动扫描 `src/themes/` 目录下的所有主题
- **动态加载**: 路由和组件按需动态导入，支持代码分割
- **完全隔离**: 每个主题拥有独立的组件、视图、路由和状态管理
- **持久化**: 当前主题选择通过 Pinia 持久化存储

### 主题发现流程

```typescript
// src/stores/themeStore.ts
const themeModules = import.meta.glob('../themes/*/router/router.ts')
```

系统会扫描所有包含 `router/router.ts` 的主题目录，目录名即为主题名称。

## 创建新主题

### 1. 目录结构

在 `src/themes/` 下创建你的主题目录，例如 `mytheme/`：

```
src/themes/mytheme/
├── router/
│   ├── router.ts          # 必需：主路由文件
│   ├── desktop_router.ts  # 可选：桌面端路由
│   ├── phone_router.ts    # 可选：移动端路由
│   └── tablet_router.ts   # 可选：平板路由
├── views/
│   ├── MainLayout.vue     # 主布局组件
│   └── [your-views]/      # 你的视图组件
├── components/            # 主题特定组件
├── stores/                # 主题特定状态管理
└── assets/                # 主题资源文件
```

### 2. 路由配置

**必需文件**: `router/router.ts`

```typescript
import type { RouteRecordRaw } from 'vue-router'
import { useScreenStore } from '@/stores/screenStore' // 或使用主题别名

export default function getRoutes(): RouteRecordRaw[] {
  const screenStore = useScreenStore()
  
  // 根据设备类型返回不同路由
  if (screenStore.getDeviceType() === 'phone') {
    return phoneRouter
  }
  if (screenStore.getDeviceType() === 'tablet') {
    return tabletRouter
  }
  return desktopRouter
}

// 可选：路由守卫
export function setupRouterGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    // 你的守卫逻辑
    next()
  })
}
```

**路由导出格式**:
- 默认导出可以是函数 `() => RouteRecordRaw[]` 或数组 `RouteRecordRaw[]`
- 如果导出函数，系统会在运行时调用以获取路由
- 可选择性导出 `setupRouterGuard` 函数用于路由守卫

### 3. 主题别名配置

在 `vite.config.ts` 中为主题添加别名（可选，但推荐）：

```typescript
resolve: {
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '@mytheme': fileURLToPath(new URL('./src/themes/mytheme', import.meta.url)),
  },
}
```

同时更新 `tsconfig.app.json` 中的 `paths` 配置：

```json
{
  "compilerOptions": {
    "paths": {
      "@mytheme/*": ["./src/themes/mytheme/*"]
    }
  }
}
```

## 共享资源

### 全局资源

以下资源可在所有主题中使用：

- `@/stores/userInfoStore` - 用户信息
- `@/stores/announcementStore` - 公告
- `@/stores/themeStore` - 主题管理
- `@/utils/*` - 工具函数
- `@/config/*` - 配置文件

### 主题特定资源

主题目录内的资源应使用主题别名导入：

```typescript
// ✅ 推荐：使用别名
import MyComponent from '@mytheme/components/MyComponent.vue'
import { useMyStore } from '@mytheme/stores/myStore'

// ❌ 不推荐：使用相对路径
import MyComponent from '../components/MyComponent.vue'
```

## 主题切换

系统提供 `ThemeSwitcher` 组件用于切换主题。你可以：

1. **使用默认组件**: 复制 `bujidao/components/ThemeSwitcher.vue` 并自定义
2. **自定义切换器**: 使用 `useThemeStore` 实现自己的切换逻辑

```typescript
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()

// 获取可用主题
themeStore.availableThemes // ['bujidao', 'test', 'mytheme']

// 切换主题（会刷新页面）
await themeStore.switchTheme('mytheme')

// 获取当前主题
themeStore.currentTheme // 'mytheme'
```

## 代码规范

### TypeScript

- 所有代码必须通过类型检查：`npm run type-check`
- 使用明确的类型定义，避免 `any`

### 代码格式化

项目使用 Prettier，提交前运行：

```bash
npm run format
```

配置：
- 无分号
- 单引号
- 行宽 100

## 调试

### 开发工具

- Vue DevTools: 已集成 `vite-plugin-vue-devtools`
- 类型检查: `npm run type-check`
- 构建测试: `npm run build`

### 常见问题

**主题未显示在切换列表中**
- 确保 `router/router.ts` 文件存在
- 检查文件路径是否正确
- 查看控制台的 "Available themes" 日志

**路由未加载**
- 检查 `router.ts` 的导出格式
- 确认路由配置符合 Vue Router 规范
- 查看控制台错误信息

**别名导入失败**
- 确认 `vite.config.ts` 和 `tsconfig.app.json` 都已配置
- 重启开发服务器

## 参考实现

查看现有主题作为参考：

- `src/themes/bujidao/` - 主主题，完整实现
- `src/themes/test/` - 测试主题，正在开发中的岛

## 提交规范

提交信息格式：

```
<type>(theme): <description>

feat(theme): 添加新主题 mytheme
fix(theme): 修复路由守卫问题
refactor(theme): 重构组件结构
```

---

Happy Theming! 🎨

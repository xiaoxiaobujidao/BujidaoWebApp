import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from './App.vue'
import router from './router'
import '@/assets/style/main.scss'

// element-plus 依赖，后续去除
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

import { useThemeStore } from './stores/themeStore'
import { checkVersion } from './utils/version'
// 初始化应用
async function initApp() {
  const app = createApp(App)

  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)
  app.use(ElementPlus)

  // 初始化主题 store
  const themeStore = useThemeStore()

  // 加载主题路由
  const routes = await themeStore.initTheme()

  // 动态添加路由
  routes.forEach((route) => {
    router.addRoute(route)
  })

  // 加载主题的路由守卫（如果存在）
  try {
    const routerModule = await import(`./themes/${themeStore.currentTheme}/router/router.ts`)
    if (routerModule.setupRouterGuard) {
      routerModule.setupRouterGuard(router)
    }
  } catch (error) {
    // 如果主题没有定义守卫函数，忽略错误
    console.warn('Theme router guard not found or failed to load:', error)
  }

  // 设置路由守卫，没有找到匹配路由，直接回首页
  router.beforeEach((to, from, next) => {
    if (to.matched.length === 0) {
      next('/')
    } else {
      next()
    }
  })

  // 启动时检查版本
  checkVersion()
  // 每20分钟定期检查版本
  setInterval(checkVersion, 1000 * 60 * 20)

  app.use(router)

  app.mount('#app')
}
// 启动应用
initApp().catch((error) => {
  console.error('Failed to initialize app:', error)
})

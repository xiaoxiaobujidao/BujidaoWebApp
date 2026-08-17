import { defineStore } from 'pinia'
import { ref, shallowRef, type Ref, type ShallowRef } from 'vue'
import type { RouteRecordRaw } from 'vue-router'
import { defaultTheme } from '@/config/config'
import { changeTheme } from '@/utils/user'
import { useUserInfoStore } from '@/stores/userInfoStore'
interface ThemeStore {
  currentTheme: Ref<string>
  themeRoutes: ShallowRef<RouteRecordRaw[]>
  availableThemes: Ref<string[]>
  scanAvailableThemes: () => void
  setTheme: (themeName: string) => void
  loadTheme: () => void
  loadThemeRoutes: (themeName: string) => Promise<RouteRecordRaw[]>
  initTheme: () => Promise<RouteRecordRaw[]>
  switchTheme: (themeName: string) => Promise<void>
}

export const useThemeStore = defineStore(
  'theme',
  (): ThemeStore => {
    // 当前主题名称，默认为 defaultTheme，在 config.ts 中定义
    const currentTheme = ref<string>(defaultTheme)

    // 路由含组件引用，使用 shallowRef 避免组件被做成深层响应式
    const themeRoutes = shallowRef<RouteRecordRaw[]>([])

    // 可用的主题列表
    const availableThemes = ref<string[]>([])

    /**
     * 扫描并加载所有可用的主题
     */
    function scanAvailableThemes() {
      // 使用 Vite 的 import.meta.glob 来扫描 themes 目录下的所有主题
      const themeModules = import.meta.glob('../themes/*/router/router.ts')

      // 从路径中提取主题名称
      const themes = Object.keys(themeModules)
        .map((path) => {
          const match = path.match(/\.\.\/themes\/([^/]+)\/router\/router\.ts/)
          return match ? match[1] : null
        })
        .filter((theme): theme is string => theme !== null)

      availableThemes.value = themes.length > 0 ? themes : [defaultTheme]

      console.log('Available themes:', availableThemes.value)
    }

    /**
     * 设置当前主题
     * @param themeName 主题名称
     */
    function setTheme(themeName: string) {
      if (availableThemes.value.includes(themeName)) {
        currentTheme.value = themeName
      } else {
        console.warn(`Theme "${themeName}" not found. Using default theme.`)
        currentTheme.value = defaultTheme
      }
    }

    /**
     * 从持久化存储加载主题设置（由 pinia-plugin-persistedstate 自动处理）
     */
    function loadTheme() {
      // 持久化插件会自动恢复 currentTheme，这里只需要验证主题是否可用
      if (currentTheme.value && !availableThemes.value.includes(currentTheme.value)) {
        currentTheme.value = defaultTheme
      }
    }

    /**
     * 动态加载指定主题的路由
     * @param themeName 主题名称
     */
    async function loadThemeRoutes(themeName: string): Promise<RouteRecordRaw[]> {
      try {
        // 动态导入主题路由文件
        const routerModule = await import(`../themes/${themeName}/router/router.ts`)
        // 如果导出的是函数，调用它（可能返回 Promise）；如果是数组，直接返回
        if (typeof routerModule.default === 'function') {
          return await routerModule.default()
        }
        return routerModule.default || []
      } catch (error) {
        console.error(`Failed to load routes for theme "${themeName}":`, error)
        // 如果加载失败且不是default主题，尝试加载default主题
        if (themeName !== defaultTheme) {
          console.warn(`Falling back to default theme routes`)
          const defaultModule = await import(`../themes/${defaultTheme}/router/router.ts`)
          if (typeof defaultModule.default === 'function') {
            return await defaultModule.default()
          }
          return defaultModule.default || []
        }
        return []
      }
    }

    /**
     * 初始化主题系统
     */
    async function initTheme() {
      // 扫描可用的主题
      scanAvailableThemes()

      // 加载保存的主题设置
      loadTheme()

      // 加载当前主题的路由
      themeRoutes.value = await loadThemeRoutes(currentTheme.value)

      return themeRoutes.value
    }

    /**
     * 切换主题
     * @param themeName 要切换到的主题名称
     */
    async function switchTheme(themeName: string) {
      // 判断是否存在该主题
      if (!availableThemes.value.includes(themeName)) {
        return Promise.resolve()
      }
      // 判断是否和当前主题一致
      if (themeName === currentTheme.value) {
        return Promise.resolve()
      }
      setTheme(themeName)
      themeRoutes.value = await loadThemeRoutes(themeName)
      await changeTheme(themeName)
      // 同步更新 userInfoStore 中的 theme，避免刷新后 watch 再次触发
      const userInfoStore = useUserInfoStore()
      const userInfo = userInfoStore.getUserInfo()
      if (userInfo) {
        userInfo.theme = themeName
        userInfoStore.setUserInfo(userInfo)
      }
      // 触发路由刷新
      window.location.reload()
    }

    return {
      currentTheme,
      themeRoutes,
      availableThemes,
      scanAvailableThemes,
      setTheme,
      loadTheme,
      loadThemeRoutes,
      initTheme,
      switchTheme,
    }
  },
  {
    persist: {
      // 只持久化 currentTheme，不持久化 themeRoutes 和 availableThemes
      pick: ['currentTheme'],
    },
  },
)

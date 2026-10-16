import type { RouteRecordRaw, Router } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { routes } from './routes'

/** 主题系统入口：返回路由表（本主题各端共用同一张表） */
export default function getRoutes(): RouteRecordRaw[] {
  return routes
}

/** 路由守卫：未登录只能访问 meta.public 页面；同步页面标题 */
export function setupRouterGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const userInfoStore = useUserInfoStore()
    if (to.meta.public || userInfoStore.getToken()) {
      next()
    } else {
      next('/login')
    }
  })

  router.afterEach((to) => {
    const title = to.meta.title as string | undefined
    document.title = title ? `${title} · 布吉岛` : '小小布吉岛～'
  })
}

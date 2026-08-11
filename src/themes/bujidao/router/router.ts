import type { RouteRecordRaw, Router } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useScreenStore } from '@bujidao/stores/screenStore'

// 按设备动态加载对应路由表；页面组件在各 router 内静态合并，避免按页拆 chunk
export default async function getRoutes(): Promise<RouteRecordRaw[]> {
  const screenStore = useScreenStore()
  const deviceType = screenStore.getDeviceType()
  if (deviceType === 'phone') {
    return (await import('./phone_router')).default
  }
  if (deviceType === 'tablet') {
    return (await import('./tablet_router')).default
  }
  return (await import('./desktop_router')).default
}

// 白名单
const whiteList = ['/login', '/register', '/google-oauth', '/signout', '/gateway/unsubscribe']

// 路由守卫设置函数
export function setupRouterGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const userInfoStore = useUserInfoStore()
    if (whiteList.includes(to.path)) {
      next()
    } else {
      if (userInfoStore.getToken()) {
        next()
      } else {
        next('/login')
      }
    }
  })
}

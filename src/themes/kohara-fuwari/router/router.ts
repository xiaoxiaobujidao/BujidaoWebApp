import type { RouteRecordRaw, Router } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useScreenStore } from '@kohara-fuwari/stores/screenStore'
import phoneRouter from './phone_router'
import tabletRouter from './tablet_router'
import desktopRouter from './desktop_router'
export default function getRoutes(): RouteRecordRaw[] {
  const screenStore = useScreenStore()
  if (screenStore.getDeviceType() === 'phone') {
    return phoneRouter
  }
  if (screenStore.getDeviceType() === 'tablet') {
    return tabletRouter
  }
  return desktopRouter
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
import type { RouteRecordRaw, Router } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfoStore'
import MainLayout from '@blush-cherry-blossoms/views/MainLayout.vue'
import HomeView from '@blush-cherry-blossoms/views/HomeView.vue'
import LoginView from '@blush-cherry-blossoms/views/LoginView.vue'
import RegisterView from '@blush-cherry-blossoms/views/RegisterView.vue'
import GoogleOauth from '@blush-cherry-blossoms/views/GoogleOauth.vue'
import UnsubscribeView from '@blush-cherry-blossoms/views/UnsubscribeView.vue'
import SignOutView from '@blush-cherry-blossoms/views/SignOutView.vue'
import UserView from '@blush-cherry-blossoms/views/UserView.vue'
import SubView from '@blush-cherry-blossoms/views/SubView.vue'
import NodeListView from '@blush-cherry-blossoms/views/NodeListView.vue'
import BalanceView from '@blush-cherry-blossoms/views/BalanceView.vue'
import AnnouncementView from '@blush-cherry-blossoms/views/AnnouncementView.vue'
import CustomizedConfigView from '@blush-cherry-blossoms/views/CustomizedConfigView.vue'

import '@blush-cherry-blossoms/assets/styles/global.css'

export default [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: HomeView,
        meta: { title: '布吉岛' },
      },
      {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { title: '登录' },
      },
      {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { title: '注册' },
      },
      {
        path: '/google-oauth',
        name: 'google_oauth',
        component: GoogleOauth,
        meta: { title: '登录中' },
      },
      {
        path: '/gateway/unsubscribe',
        name: 'unsubscribe',
        component: UnsubscribeView,
        meta: { title: '退订邮件' },
      },
      {
        path: '/signout',
        name: 'signout',
        component: SignOutView,
        meta: { title: '退出登录' },
      },
      {
        path: '/user',
        name: 'user',
        component: UserView,
        meta: { title: '账户' },
      },
      {
        path: '/sub',
        name: 'sub',
        component: SubView,
        meta: { title: '订阅' },
      },
      {
        path: '/node_list',
        name: 'node_list',
        component: NodeListView,
        meta: { title: '节点' },
      },
      {
        path: '/balance',
        name: 'balance',
        component: BalanceView,
        meta: { title: '资产' },
      },
      {
        path: '/announcement',
        name: 'announcement',
        component: AnnouncementView,
        meta: { title: '公告' },
      },
      {
        path: '/cc',
        name: 'cc',
        component: CustomizedConfigView,
        meta: { title: '自定义配置' },
      },
    ],
  },
] satisfies RouteRecordRaw[]

const whiteList = ['/', '/login', '/register', '/google-oauth', '/gateway/unsubscribe', '/signout']

export function setupRouterGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const userInfoStore = useUserInfoStore()
    if (whiteList.includes(to.path) || userInfoStore.getToken()) {
      next()
    } else {
      next('/login')
    }
  })

  router.afterEach((to) => {
    const title = to.meta.title as string | undefined
    document.title = title && title !== '布吉岛' ? `${title} · 布吉岛` : '布吉岛'
  })
}

import type { RouteRecordRaw, Router } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfoStore'
import RoseView from '@violet-rose/views/RoseView.vue'
import LoginView from '@violet-rose/views/LoginView.vue'
import RegisterView from '@violet-rose/views/RegisterView.vue'

import '@violet-rose/assets/styles/global.css'

export default [
  {
    path: '/',
    component: () => import('@violet-rose/views/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: RoseView,
        meta: { title: '布吉岛', public: true },
      },
      {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { title: '登录', public: true },
      },
      {
        path: '/register',
        name: 'register',
        component: RegisterView,
        meta: { title: '注册', public: true },
      },
      {
        path: '/google-oauth',
        name: 'google_oauth',
        component: () => import('@violet-rose/views/GoogleOauth.vue'),
        meta: { title: '登录中', public: true },
      },
      {
        path: '/gateway/unsubscribe',
        name: 'unsubscribe',
        component: () => import('@violet-rose/views/UnsubscribeView.vue'),
        meta: { title: '退订邮件', public: true },
      },
      {
        path: '/signout',
        name: 'signout',
        component: () => import('@violet-rose/views/SignOutView.vue'),
        meta: { title: '退出登录' },
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@violet-rose/views/UserView.vue'),
        meta: { title: '账户' },
      },
      {
        path: '/sub',
        name: 'sub',
        component: () => import('@violet-rose/views/SubView.vue'),
        meta: { title: '订阅' },
      },
      {
        path: '/node_list',
        name: 'node_list',
        component: () => import('@violet-rose/views/NodeListView.vue'),
        meta: { title: '节点' },
      },
      {
        path: '/balance',
        name: 'balance',
        component: () => import('@violet-rose/views/BalanceView.vue'),
        meta: { title: '资产' },
      },
      {
        path: '/announcement',
        name: 'announcement',
        component: () => import('@violet-rose/views/AnnouncementView.vue'),
        meta: { title: '公告' },
      },
      {
        path: '/cc',
        name: 'cc',
        component: () => import('@violet-rose/views/CustomizedConfigView.vue'),
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

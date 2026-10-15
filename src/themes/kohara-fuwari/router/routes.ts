import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@kohara-fuwari/views/MainLayout.vue'
import UserView from '@kohara-fuwari/views/UserView.vue'
import SubView from '@kohara-fuwari/views/SubView.vue'
import NodeListView from '@kohara-fuwari/views/NodeListView.vue'
import BalanceView from '@kohara-fuwari/views/BalanceView.vue'
import TutorialView from '@kohara-fuwari/views/TutorialView.vue'
import AnnouncementView from '@kohara-fuwari/views/AnnouncementView.vue'
import CustomConfigView from '@kohara-fuwari/views/CustomConfigView.vue'
import LoginView from '@kohara-fuwari/views/LoginView.vue'
import GoogleOauthView from '@kohara-fuwari/views/GoogleOauthView.vue'
import SignOutView from '@kohara-fuwari/views/SignOutView.vue'
import UnsubscribeView from '@kohara-fuwari/views/UnsubscribeView.vue'

/**
 * 单一响应式路由表：桌面 / 平板 / 手机共用同一套页面，由 CSS 适配布局。
 * meta.public 标记无需登录即可访问的页面。
 */
export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: MainLayout,
    redirect: '/user',
    children: [
      { path: '/user', name: 'user', component: UserView, meta: { title: '概览' } },
      { path: '/sub', name: 'sub', component: SubView, meta: { title: '订阅' } },
      { path: '/node_list', name: 'node_list', component: NodeListView, meta: { title: '节点' } },
      { path: '/balance', name: 'balance', component: BalanceView, meta: { title: '财务' } },
      { path: '/tutorial', name: 'tutorial', component: TutorialView, meta: { title: '教程' } },
      { path: '/t', name: 't', component: TutorialView, meta: { title: '教程' } },
      {
        path: '/announcement',
        name: 'announcement',
        component: AnnouncementView,
        meta: { title: '公告' },
      },
      { path: '/cc', name: 'cc', component: CustomConfigView, meta: { title: '个性化配置' } },
      {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { title: '登录', public: true },
      },
      {
        path: '/register',
        name: 'register',
        component: LoginView,
        meta: { title: '注册', public: true },
      },
      {
        path: '/google-oauth',
        name: 'google_oauth',
        component: GoogleOauthView,
        meta: { title: '登录中', public: true },
      },
      {
        path: '/signout',
        name: 'signout',
        component: SignOutView,
        meta: { title: '退出登录', public: true },
      },
      {
        path: '/gateway/unsubscribe',
        name: 'unsubscribe',
        component: UnsubscribeView,
        meta: { title: '退订邮件', public: true },
      },
    ],
  },
]

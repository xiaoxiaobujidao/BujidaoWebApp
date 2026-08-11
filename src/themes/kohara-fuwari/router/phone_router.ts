import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@kohara-fuwari/views/MainLayout.vue'
import UserView from '@kohara-fuwari/views/phone/UserView.vue'
import SubView from '@kohara-fuwari/views/phone/SubView.vue'
import SignOut from '@kohara-fuwari/views/shared/SignOut.vue'
import GoogleOauth from '@kohara-fuwari/views/shared/GoogleOauth.vue'
import LoginView from '@kohara-fuwari/views/shared/LoginView.vue'
import AnnouncementView from '@kohara-fuwari/views/phone/AnnouncementView.vue'
import Unsubscribe from '@kohara-fuwari/views/shared/Unsubscribe.vue'

export default [
  {
    path: '/',
    redirect: '/user',
    // 用于全局挂载一些奇奇怪怪的东西
    component: MainLayout,
    children: [
      {
        path: '/user',
        name: 'user',
        component: UserView,
      },
      {
        path: '/sub',
        name: 'sub',
        component: SubView,
      },
      {
        path: '/signout',
        name: 'signout',
        component: SignOut,
      },
      {
        path: '/google-oauth',
        name: 'google_oauth',
        component: GoogleOauth,
      },
      {
        path: '/login',
        name: 'login',
        component: LoginView,
      },
      {
        path: '/announcement',
        name: 'Announcement',
        component: AnnouncementView,
      },
      {
        path: '/register',
        name: 'register',
        component: LoginView,
      },
      {
        path: '/gateway/unsubscribe',
        name: 'unsubscribe',
        component: Unsubscribe,
      },
    ],
  },
] as RouteRecordRaw[]

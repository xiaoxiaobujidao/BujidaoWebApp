import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@bujidao/views/MainLayout.vue'
import UserView from '@bujidao/views/phone/UserView.vue'
import SubView from '@bujidao/views/phone/SubView.vue'
import AnnouncementView from '@bujidao/views/phone/AnnouncementView.vue'
import sharedRouter from './shared_router'

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
        path: '/announcement',
        name: 'Announcement',
        component: AnnouncementView,
      },
      ...sharedRouter,
    ],
  },
] as RouteRecordRaw[]

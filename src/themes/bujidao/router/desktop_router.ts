import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@bujidao/views/MainLayout.vue'
import UserView from '@bujidao/views/pc/UserView.vue'
import SubView from '@bujidao/views/pc/SubView.vue'
import TutorialView from '@bujidao/views/pc/tutorial/TutorialView.vue'
import CustomizedConfiguration from '@bujidao/views/pc/CustomizedConfiguration.vue'
import NodeList from '@bujidao/views/pc/NodeList.vue'
import BalanceView from '@bujidao/views/pc/BalanceView.vue'
import AnnouncementView from '@bujidao/views/pc/AnnouncementView.vue'
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
        path: '/tutorial',
        name: 'tutorial',
        component: TutorialView,
      },
      {
        path: '/t',
        name: 't',
        component: TutorialView,
      },
      {
        path: '/cc',
        name: 'CustomizedConfiguration',
        component: CustomizedConfiguration,
      },
      {
        path: '/node_list',
        name: 'node_list',
        component: NodeList,
      },
      {
        path: '/balance',
        name: 'balance',
        component: BalanceView,
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

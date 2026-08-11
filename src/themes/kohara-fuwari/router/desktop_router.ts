import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@kohara-fuwari/views/MainLayout.vue'
import UserView from '@kohara-fuwari/views/pc/UserView.vue'
import SubView from '@kohara-fuwari/views/pc/SubView.vue'
import TutorialView from '@kohara-fuwari/views/pc/tutorial/TutorialView.vue'
import CustomizedConfiguration from '@kohara-fuwari/views/pc/CustomizedConfiguration.vue'
import NodeList from '@kohara-fuwari/views/pc/NodeList.vue'
import BalanceView from '@kohara-fuwari/views/pc/BalanceView.vue'
import SignOut from '@kohara-fuwari/views/shared/SignOut.vue'
import GoogleOauth from '@kohara-fuwari/views/shared/GoogleOauth.vue'
import LoginView from '@kohara-fuwari/views/shared/LoginView.vue'
import AnnouncementView from '@kohara-fuwari/views/pc/AnnouncementView.vue'
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

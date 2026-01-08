import type { RouteRecordRaw } from 'vue-router'
export default [
  {
    path: '/',
    redirect: '/user',
    // 用于全局挂载一些奇奇怪怪的东西
    component: () => import('@kohara-fuwari/views/MainLayout.vue'),
    children: [
      {
        path: '/user',
        name: 'user',
        component: () => import('@kohara-fuwari/views/pc/UserView.vue'),
      },
      {
        path: '/sub',
        name: 'sub',
        component: () => import('@kohara-fuwari/views/pc/SubView.vue'),
      },
      {
        path: '/tutorial',
        name: 'tutorial',
        component: () => import('@kohara-fuwari/views/pc/tutorial/TutorialView.vue'),
      },
      {
        path: '/t',
        name: 't',
        component: () => import('@kohara-fuwari/views/pc/tutorial/TutorialView.vue'),
      },
      {
        path: '/cc',
        name: 'CustomizedConfiguration',
        component: () => import('@kohara-fuwari/views/pc/CustomizedConfiguration.vue'),
      },
      {
        path: '/node_list',
        name: 'node_list',
        component: () => import('@kohara-fuwari/views/pc/NodeList.vue'),
      },
      {
        path: '/balance',
        name: 'balance',
        component: () => import('@kohara-fuwari/views/pc/BalanceView.vue'),
      },
      {
        path: '/signout',
        name: 'signout',
        component: () => import('@kohara-fuwari/views/shared/SignOut.vue'),
      },
      {
        path: '/google-oauth',
        name: 'google_oauth',
        component: () => import('@kohara-fuwari/views/shared/GoogleOauth.vue'),
      },
      {
        path: '/login',
        name: 'login',
        component: () => import('@kohara-fuwari/views/shared/LoginView.vue'),
      },
      {
        path: '/announcement',
        name: 'Announcement',
        component: () => import('@kohara-fuwari/views/pc/AnnouncementView.vue'),
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@kohara-fuwari/views/shared/LoginView.vue'),
      },
      {
        path: '/gateway/unsubscribe',
        name: 'unsubscribe',
        component: () => import('@kohara-fuwari/views/shared/Unsubscribe.vue'),
      },
    ],
  },
] as RouteRecordRaw[]
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
        component: () => import('@kohara-fuwari/views/phone/UserView.vue'),
      },
      {
        path: '/sub',
        name: 'sub',
        component: () => import('@kohara-fuwari/views/phone/SubView.vue'),
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
        component: () => import('@kohara-fuwari/views/phone/AnnouncementView.vue'),
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
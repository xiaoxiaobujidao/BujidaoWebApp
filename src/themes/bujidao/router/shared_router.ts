import type { RouteRecordRaw } from 'vue-router'
import SignOut from '@bujidao/views/shared/SignOut.vue'
import GoogleOauth from '@bujidao/views/shared/GoogleOauth.vue'
import LoginView from '@bujidao/views/shared/login/LoginView.vue'
import Unsubscribe from '@bujidao/views/shared/Unsubscribe.vue'

export default [
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
    path: '/register',
    name: 'register',
    component: LoginView,
  },
  {
    path: '/gateway/unsubscribe',
    name: 'unsubscribe',
    component: Unsubscribe,
  },
] as RouteRecordRaw[]

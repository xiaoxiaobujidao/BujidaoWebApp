<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { checkLoginKey, loginWithTelegram, loginWithEmailPasswd } from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref } from 'vue'
import GoogleOauth from '@bujidao/components/icons/GoogleOauth.vue'
import TelegramImage from '@bujidao/components/icons/TelegramImage.vue'
import TelegramWhite from '@bujidao/components/icons/TelegramWhite.vue'

import { useUserInfoStore } from '@/stores/userInfoStore'
import DarkTheme from '@bujidao/components/DarkTheme.vue'
import EmailLogin from './components/EmailLogin.vue'
import PasswordLogin from './components/PasswordLogin.vue'
import IslandBackground from '@bujidao/components/island/IslandBackground.vue'
import '@bujidao/assets/styles/global.css'
const userInfoStore = useUserInfoStore()

// 获取邀请码
const inviter = ref()
const login_key = ref()
const email_login_show = ref(false)
const password_login_show = ref(false)

if (userInfoStore.getToken()) {
  finishLogin()
}

// TG验证
declare const window: any
const bot_name = import.meta.env.VITE_BOT_NAME
function onTelegramAuth(user: any) {
  loginWithTelegram(user, inviter.value)
    .then((res_data: any) => {
      if (res_data.result) {
        finishLogin(res_data.result.login_token)
      } else {
        ElMessage.error(res_data.error?.message)
      }
    })
    .catch(() => {
      ElMessage.error('网络错误，请检查网络后重试，如有疑问请联系管理员')
    })
}
window.onTelegramAuth = onTelegramAuth
const bot_id = import.meta.env.VITE_BOT_ID
function telegramDirectAuth() {
  const origin = window.location.origin
  const authUrl = `https://oauth.telegram.org/auth?bot_id=${bot_id}&origin=${encodeURIComponent(origin)}&embed=1&return_to=${encodeURIComponent(origin)}/login`
  // 弹出窗口或重定向
  window.location.href = authUrl
}

// 谷歌登录
const google_id = import.meta.env.VITE_GOOGLE_OAUTH
const google_login = function () {
  location.href =
    'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&include_granted_scopes=true&response_type=token&redirect_uri=https://app.bujidao.org/google-oauth&client_id=' +
    google_id
}
const init = () => {
  inviter.value = router.currentRoute.value.query.code
    ? router.currentRoute.value.query.code
    : undefined
  if (inviter.value) {
    localStorage.setItem('inviter', inviter.value)
  }
  login_key.value = router.currentRoute.value.query.login_key
    ? router.currentRoute.value.query.login_key
    : undefined
  if (login_key.value != undefined) {
    checkLoginKey(login_key.value)
      .then((res: any) => {
        if (res.result) {
          finishLogin(res.result)
        } else {
          ElMessage.error(res.error)
        }
      })
      .catch((err: any) => {
        ElMessage.error(err)
      })
  }
}
init()
const login_with_email = () => {
  email_login_show.value = true
}
const show_login = () => {
  password_login_show.value = true
}
const go_chat = () => {
  location.href = 'https://bujidaoChat.t.me'
}
</script>

<template>
  <div class="login-page">
    <IslandBackground />
    <div class="login-page__content">
      <div class="login-card">
        <div class="login-card__hero">
          <img src="/favicon.webp" alt="logo" class="login-card__logo" />
          <h1>登陆到布吉岛</h1>
          <p class="login-card__subtitle">百慕大里的小小岛屿，等你靠岸</p>
        </div>

        <div class="login-card__actions">
          <el-button type="primary" size="large" round @click="login_with_email">邮件登陆或注册</el-button>
          <el-button size="large" round @click="show_login">账号密码登陆</el-button>
        </div>

        <div class="login-card__divider">
          <span>或</span>
        </div>

        <div class="login-card__social">
          <el-button type="primary" size="large" round class="login-card__social-btn" @click="google_login">
            <GoogleOauth />使用谷歌账号登录或注册
          </el-button>
          <div style="display: none">
            <component
              :is="'script'"
              async
              src="https://telegram.org/js/telegram-widget.js?22"
              :data-telegram-login="bot_name"
              data-size="large"
              data-onauth="window.onTelegramAuth(user)"
            />
          </div>
          <el-button type="primary" size="large" round class="login-card__social-btn" @click="telegramDirectAuth">
            <TelegramWhite />使用 Telegram 登录或注册
          </el-button>
        </div>
      </div>
    </div>
  </div>
  <EmailLogin v-model="email_login_show" :inviter="inviter" />
  <PasswordLogin v-model="password_login_show" />
  <div class="help" @click="go_chat()">
    <TelegramImage />
  </div>
  <DarkTheme />
</template>

<style lang="scss" scoped>
.help {
  position: fixed;
  top: calc(12px + var(--safe-area-top));
  right: 12px;
  z-index: 10;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-fab-bg);
  border: 1px solid var(--color-surface-border);
  backdrop-filter: var(--color-fab-backdrop);
  -webkit-backdrop-filter: var(--color-fab-backdrop);

  svg {
    width: 28px;
    height: 28px;
  }
}

.login-page {
  position: relative;
  min-height: 100dvh;
}

.login-page__content {
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.login-card {
  width: min(420px, 100%);
  padding: 2rem 1.75rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-surface-border);
  background: var(--color-surface);
  box-shadow: var(--shadow-soft), var(--shadow-glow);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.login-card__hero {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-card__logo {
  width: 76px;
  height: 76px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  box-shadow: 0 8px 28px rgba(61, 165, 232, 0.25);
}

h1 {
  margin: 0 0 0.45rem;
  font-size: 1.45rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-text-primary);
}

.login-card__subtitle {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.login-card__actions,
.login-card__social {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.login-card__actions :deep(.el-button),
.login-card__social :deep(.el-button) {
  width: 100%;
  margin: 0;
}

.login-card__divider {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  margin: 1.25rem 0;
  color: var(--color-text-secondary);
  font-size: 0.82rem;
  font-style: italic;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--color-surface-border);
  }
}

.login-card__social-btn :deep(> span) {
  gap: 0.35em;

  svg {
    width: 1.35em;
    height: 1.35em;
  }
}
</style>

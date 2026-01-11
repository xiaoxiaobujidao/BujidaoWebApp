<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { checkLoginKey, loginWithTelegram, loginWithEmailPasswd } from '@/utils/user'
import { useRouter } from 'vue-router'
const router = useRouter()
import { ref } from 'vue'
import GoogleOauth from '@test/components/icons/GoogleOauth.vue'
import TelegramImage from '@test/components/icons/TelegramImage.vue'
import TelegramWhite from '@test/components/icons/TelegramWhite.vue'

import { useUserInfoStore } from '@/stores/userInfoStore'
import DarkTheme from '@test/components/DarkTheme.vue'
import EmailLogin from './components/EmailLogin.vue'
import PasswordLogin from './components/PasswordLogin.vue'
const userInfoStore = useUserInfoStore()

// 获取邀请码
const inviter = ref()
const login_key = ref()
const email_login_show = ref(false)
const password_login_show = ref(false)

// 跳转
function go_to_user() {
  ElMessage.success('登录成功，跳转到用户中心')
  router.push({
    path: '/user',
    query: {},
  })
}
if (userInfoStore.getToken()) {
  go_to_user()
}

// TG验证
declare const window: any
const bot_name = import.meta.env.VITE_BOT_NAME
function onTelegramAuth(user: any) {
  loginWithTelegram(user, inviter.value)
    .then((res_data: any) => {
      if (res_data.result) {
        userInfoStore.setToken(res_data.result.login_token)
        go_to_user()
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
          userInfoStore.setToken(res.result)
          go_to_user()
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
  <div class="login-main">
    <div class="login-card">
      <img src="/favicon.ico" alt="logo" class="logo" />
      <h1>登陆到布吉岛</h1>
      <div class="login-button">
        <div>
          <el-button type="primary" size="large" @click="login_with_email" round
            >邮件登陆或注册</el-button
          >
        </div>
        <div>
          <el-button type="primary" size="large" @click="show_login" round>账号密码登陆</el-button>
        </div>
      </div>
      <div v-if="false">
        <el-button type="primary" size="large" @click="login_with_email" round
          >恢复密钥登陆</el-button
        >
      </div>
      <div class="c_h">
        <div class="c_g"></div>
        <span>或</span>
        <div class="c_g"></div>
      </div>
      <div>
        <el-button type="primary" size="large" @click="google_login" round class="login-button">
          <GoogleOauth />使用谷歌账号登录或注册
        </el-button>
      </div>
      <!-- 只隐藏，需要保留以便于自动调用方法 -->
      <div style="display: none">
        <component
          :is="'script'"
          async
          src="https://telegram.org/js/telegram-widget.js?22"
          :data-telegram-login="bot_name"
          data-size="large"
          data-onauth="window.onTelegramAuth(user)"
        >
        </component>
      </div>
      <div>
        <el-button
          type="primary"
          size="large"
          @click="telegramDirectAuth"
          round
          class="login-button"
        >
          <TelegramWhite />使用 Telegram 登录或注册
        </el-button>
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
  top: 10px;
  right: 10px;

  svg {
    width: 50px;
    height: 50px;
  }
}

h1 {
  margin: 25px 0;
}

.login-main {
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 280px;
}

.login-card > div {
  margin-bottom: 10px;
}

.login-button {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  :deep(> span) {
    gap: 0.2em;

    svg {
      width: 1.5em;
      height: 1.5em;
    }
  }
}

.logo {
  border-radius: 50%;
  width: 80px;
}

.login-card :deep(.el-button--primary) {
  --el-button-bg-color: #54a9eb;
}

.c_g {
  border-top-style: solid;
  width: 100%;
  flex: 1 0 50px;
  border-top-width: 1px;
  border-color: rgb(182, 182, 182);
}

.c_h {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  justify-content: space-between;
  /* overflow: hidden; */
  align-items: center;
  color: rgb(182, 182, 182);
  font-family:
    -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    'Helvetica Neue', Arial, sans-serif;
  font-style: italic;
}

.dark {
  .left {
    position: fixed;
    top: 40vh;
    left: -82vw;
    width: 100vw;
    height: 100vw;
    border-radius: 50vw;
    background: linear-gradient(45deg, #c179df, #ffffff);
    -webkit-filter: blur(100px);
    filter: blur(100px);
    opacity: 0.25;
    z-index: -1;
  }

  .right {
    position: fixed;
    top: -60vw;
    right: -60vw;
    width: 80vw;
    height: 80vw;
    border-radius: 50vw;
    background: linear-gradient(225deg, #c179df, #ffffff);
    -webkit-filter: blur(100px);
    filter: blur(100px);
    opacity: 0.25;
    z-index: -1;
  }

  .left {
    background: linear-gradient(45deg, #38afff, #222);
  }

  .right {
    background: linear-gradient(225deg, #208dec, #222);
  }
}
</style>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  checkLoginKey,
  loginWithTelegram,
  loginWithEmail,
  loginWithEmailPasswd,
} from '@/utils/user'
import { useRouter } from 'vue-router'
const router = useRouter()
import { markRaw } from 'vue'
import { ref } from 'vue'
import { Lock, User } from '@element-plus/icons-vue'
import GoogleOauth from '@test/components/icons/GoogleOauth.vue'
import TelegramImage from '@test/components/icons/TelegramImage.vue'

import { useDark, useToggle } from '@vueuse/core'
import { useUserInfoStore } from '@/stores/userInfoStore'
import DarkTheme from '@test/components/DarkTheme.vue'
const isDark = useDark()
const userInfoStore = useUserInfoStore()

// 获取邀请码
const inviter = ref()
const login_key = ref()

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
const bot_id = import.meta.env.VITE_BOT_ID
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
function isEmail(email: string) {
  let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return regex.test(email)
}

const login_with_email_passwd = () => {
  ElMessageBox.prompt('请输入您的邮箱地址', '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern:
      /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: 'Invalid Email',
    inputType: 'email',
    autofocus: true,
    type: 'info',
    icon: markRaw(User),
  })
    .then(({ value }) => {
      let email = value
      ElMessageBox.prompt('请输入您的密码', '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputType: 'password',
        type: 'info',
        icon: markRaw(Lock),
      })
        .then(({ value }) => {
          let passwd = value
          loginWithEmailPasswd(email, passwd)
            .then((res: any) => {
              if (res.result) {
                ElMessage.success('登陆成功')
                userInfoStore.setToken(res.result.login_token)
                go_to_user()
              } else {
                ElMessage.error(res.error?.message)
              }
            })
            .catch((e: any) => {
              console.log(e)
              ElMessage.error('网络连接失败，请检查网络后重试，如有疑问请联系管理员')
            })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Input canceled',
          })
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
// 邮件密码登录
const email = ref()
const email_ref = ref()
const passwd = ref()
const login = () => {
  loginWithEmailPasswd(email.value, passwd.value)
    .then((res: any) => {
      if (res.result) {
        ElMessage.success('登陆成功')
        userInfoStore.setToken(res.result.login_token)
        go_to_user()
      } else {
        ElMessage.error(res.error?.message)
      }
    })
    .catch((e: any) => {
      console.log(e)
      ElMessage.error('网络连接失败，请检查网络后重试，如有疑问请联系管理员')
    })
}

const login_with_email = () => {
  ElMessageBox.prompt('请输入您的邮箱地址', '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern:
      /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: 'Invalid Email',
    inputType: 'email',
    // autoComplete: true,
    autofocus: true,
    type: 'info',
  })
    .then(({ value }) => {
      loginWithEmail(value, inviter.value)
        .then((res: any) => {
          if (res.result) {
            ElMessage.success('登陆邮件发送成功，请使用邮件中的登陆链接登陆')
          } else {
            ElMessage.error('邮件发送失败，如邮箱正确，请联系管理员')
            ElMessage.error(res.error?.message)
          }
        })
        .catch((e: any) => {
          console.log(e)
          ElMessage.error('网络连接失败，请检查网络后重试，如有疑问请联系管理员')
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
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
const login_with_email_passwd_show = ref(false)
const show_login = () => {
  login_with_email_passwd_show.value = true
}
const focus_email = () => {
  email_ref.value.focus()
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
          <!-- <el-tooltip content="没有账号会自动注册" placement="top"> -->
          <el-button type="primary" size="large" @click="login_with_email" round
            >邮件登陆或注册</el-button
          >
          <!-- </el-tooltip> -->
        </div>
        <div v-if="false">
          <el-button type="primary" size="large" @click="login_with_email_passwd" round
            >账号密码登陆</el-button
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
        <el-button type="primary" size="large" @click="google_login" round>
          <GoogleOauth />使用谷歌账号登录或注册
        </el-button>
      </div>
      <div>
        <component
          :is="'script'"
          async
          src="https://telegram.org/js/telegram-widget.js?22"
          :data-telegram-login="bot_id"
          data-size="large"
          data-onauth="window.onTelegramAuth(user)"
        >
        </component>
      </div>
    </div>
  </div>
  <el-dialog
    v-if="login_with_email_passwd_show"
    v-model="login_with_email_passwd_show"
    title="登录"
    width="420"
    destroy-on-close
    align-center
    @opened="focus_email"
  >
    <div class="login-box">
      <div>
        <el-input
          v-model="email"
          @keyup.enter="login"
          placeholder="您的邮箱地址"
          type="email"
          autocomplete
          autofocus
          ref="email_ref"
          :prefix-icon="User"
        />
        <el-input
          v-model="passwd"
          @keyup.enter="login"
          style="width: 240px"
          type="password"
          placeholder="您的密码"
          show-password
          autocomplete
          :prefix-icon="Lock"
        />
      </div>
      <div class="login-button">
        <el-button type="primary" autofocus @click="login">登录</el-button>
      </div>
    </div>
  </el-dialog>
  <div class="help" @click="go_chat()">
    <TelegramImage />
  </div>
  <DarkTheme />
  <div class="left"></div>
  <div class="right"></div>
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

.login-box {
  --el-messagebox-title-color: var(--el-text-color-primary);
  --el-messagebox-width: 420px;
  --el-messagebox-border-radius: 4px;
  --el-messagebox-box-shadow: var(--el-box-shadow);
  --el-messagebox-font-size: var(--el-font-size-large);
  --el-messagebox-content-font-size: var(--el-font-size-base);
  --el-messagebox-content-color: var(--el-text-color-regular);
  --el-messagebox-error-font-size: 12px;
  --el-messagebox-padding-primary: 12px;
  --el-messagebox-font-line-height: var(--el-font-line-height-primary);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  background-color: var(--el-bg-color);
  border-radius: var(--el-messagebox-border-radius);
  // box-shadow: var(--el-messagebox-box-shadow);
  box-sizing: border-box;
  display: inline-block;
  font-size: var(--el-messagebox-font-size);
  max-width: var(--el-messagebox-width);
  overflow: hidden;
  overflow-wrap: break-word;
  padding: var(--el-messagebox-padding-primary);
  position: relative;
  text-align: left;
  vertical-align: middle;
  width: 100%;

  .el-input {
    margin-bottom: 10px;
  }
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

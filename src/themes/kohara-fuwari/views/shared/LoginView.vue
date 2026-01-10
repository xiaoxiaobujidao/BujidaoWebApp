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

// Font Awesome 配置
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faShieldAlt,
  faBolt,
  faUserCheck,
  faEnvelope,
  faKey,
  faSpinner
} from '@fortawesome/free-solid-svg-icons'

// 添加图标到库
library.add(
  faShieldAlt,
  faBolt,
  faUserCheck,
  faEnvelope,
  faKey,
  faSpinner
)
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
// 移除弹窗逻辑，直接显示登录表单
const focus_email = () => {
  email_ref.value.focus()
}
// 登录方式切换相关
const activeTab = ref('password') // 默认显示密码登录
const agreeTerms = ref(false)
const rememberMe = ref(false)
const isLoading = ref(false)

// 切换到邮件登录
const switchToEmail = () => {
  activeTab.value = 'email'
}

// 切换到密码登录
const switchToPassword = () => {
  activeTab.value = 'password'
}

// 页面加载时自动聚焦到邮箱输入框
setTimeout(focus_email, 500)
const go_chat = () => {
  location.href = 'https://bujidaoChat.t.me'
}
</script>

<template>
  <div class="login-main">
    <div class="login-container">
      <!-- 左侧信息区域 -->
      <div class="info-section">
        <div class="info-content">
          <div class="logo-section">
            <img src="/favicon.ico" alt="logo" class="logo" />
            <span class="logo-text">布吉岛</span>
          </div>
          
          <h1 class="welcome-title">欢迎回来</h1>
          <p class="welcome-text">
            使用多种安全便捷的方式登录您的账户。我们提供邮件登录、密码登录以及第三方登录，确保您能快速访问。
          </p>
          
          <div class="features-list">
            <div class="feature-item">
              <div class="feature-icon security-icon">
                <FontAwesomeIcon icon="fa-solid fa-shield-alt" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title">安全可靠</h3>
                <p class="feature-desc">采用行业标准加密技术保护您的数据</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon speed-icon">
                <FontAwesomeIcon icon="fa-solid fa-bolt" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title">快速便捷</h3>
                <p class="feature-desc">一键登录，无需记住复杂密码</p>
              </div>
            </div>
            
            <div class="feature-item">
              <div class="feature-icon sync-icon">
                <FontAwesomeIcon icon="fa-solid fa-user-check" />
              </div>
              <div class="feature-content">
                <h3 class="feature-title">多设备同步</h3>
                <p class="feature-desc">在任意设备上访问您的账户</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="copyright">
          <p>© 2023 布吉岛. 保留所有权利。</p>
        </div>
      </div>
      
      <!-- 右侧登录区域 -->
      <div class="login-section">
        <div class="login-content">
          <div class="login-header">
            <h2 class="login-title">登录您的账户</h2>
            <p class="login-subtitle">选择您喜欢的登录方式</p>
          </div>
          
          <!-- 登录方式切换标签 -->
          <div class="login-tabs">
            <button id="email-tab" class="tab-button tab-active" @click="switchToEmail">
              <FontAwesomeIcon icon="fa-solid fa-envelope" class="mr-2" />邮件登录
            </button>
            <button id="password-tab" class="tab-button" @click="switchToPassword">
              <FontAwesomeIcon icon="fa-solid fa-key" class="mr-2" />账号密码登录
            </button>
          </div>
          
          <!-- 邮件登录表单 -->
          <form v-if="activeTab === 'email'" @submit.prevent="login_with_email" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">邮箱地址</label>
              <el-input
                v-model="email"
                @keyup.enter="login_with_email"
                placeholder="请输入您的邮箱地址"
                type="email"
                autocomplete
                autofocus
                ref="email_ref"
                :prefix-icon="User"
                class="form-input"
              />
              <p class="form-hint">我们将向该邮箱发送一个安全的登录链接</p>
            </div>
            
            <div class="form-group">
              <div class="checkbox-group">
                <input id="terms" type="checkbox" v-model="agreeTerms" class="custom-checkbox">
                <label for="terms" class="checkbox-label">我同意接收登录链接邮件</label>
              </div>
            </div>
            
            <el-button type="primary" size="large" @click="login_with_email" class="submit-button" :loading="isLoading">
              <span v-if="!isLoading">发送登录链接</span>
              <span v-else><FontAwesomeIcon icon="fa-solid fa-spinner" class="fa-spin mr-2" />发送中...</span>
            </el-button>
          </form>
          
          <!-- 密码登录表单 -->
          <form v-else @submit.prevent="login" class="login-form">
            <div class="form-group">
              <label for="email" class="form-label">邮箱地址</label>
              <el-input
                v-model="email"
                @keyup.enter="login"
                placeholder="您的邮箱地址"
                type="email"
                autocomplete
                autofocus
                ref="email_ref"
                :prefix-icon="User"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <label for="passwd" class="form-label">密码</label>
              <el-input
                v-model="passwd"
                @keyup.enter="login"
                type="password"
                placeholder="您的密码"
                show-password
                autocomplete
                :prefix-icon="Lock"
                class="form-input"
              />
            </div>
            
            <div class="form-group">
              <div class="checkbox-group">
                <input id="remember" type="checkbox" v-model="rememberMe" class="custom-checkbox">
                <label for="remember" class="checkbox-label">记住我</label>
              </div>
              <a href="#" class="forgot-password">忘记密码？</a>
            </div>
            
            <el-button type="primary" size="large" @click="login" class="submit-button" :loading="isLoading">
              <span v-if="!isLoading">登录</span>
              <span v-else><i class="fas fa-spinner fa-spin mr-2"></i>登录中...</span>
            </el-button>
            
            <div class="register-link">
              <p>还没有账户？ <a href="#" class="register-text">立即注册</a></p>
            </div>
          </form>
          
          <!-- 第三方登录 -->
          <div class="third-party-login">
            <div class="divider">
              <div class="divider-line"></div>
              <span class="divider-text">或使用第三方登录</span>
              <div class="divider-line"></div>
            </div>
            
            <div class="third-party-buttons">
              <el-button type="primary" size="large" @click="google_login" class="third-party-button">
                <GoogleOauth />使用谷歌账号登录或注册
              </el-button>
              
              <div class="telegram-widget">
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
        </div>
      </div>
    </div>
  </div>

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
  z-index: 1000;

  svg {
    width: 50px;
    height: 50px;
  }
}

// 主容器样式
.login-main {
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 'Helvetica Neue', Arial, sans-serif;
}

// 容器样式
.login-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  background-color: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), 0 10px 20px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.5s ease-in-out;
}

// 左侧信息区域
.info-section {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  border-radius: 50%;
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #334155;
}

.welcome-title {
  font-size: 36px;
  font-weight: bold;
  color: #1e293b;
  line-height: 1.2;
}

.welcome-text {
  font-size: 18px;
  color: #64748b;
  line-height: 1.6;
}

// 特性列表
.features-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.feature-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;
}

.security-icon {
  background-color: #dbeafe;
  color: #2563eb;
}

.speed-icon {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.sync-icon {
  background-color: #fee2e2;
  color: #dc2626;
}

.feature-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  color: #334155;
}

.feature-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
}

// 版权信息
.copyright {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
  font-size: 14px;
  color: #94a3b8;
}

// 右侧登录区域
.login-section {
  padding: 40px;
}

.login-content {
  max-width: 500px;
  margin: 0 auto;
}

.login-header {
  margin-bottom: 40px;
}

.login-title {
  font-size: 32px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 8px;
}

.login-subtitle {
  font-size: 16px;
  color: #64748b;
}

// 登录标签
.login-tabs {
  display: flex;
  background-color: #f1f5f9;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
}

.tab-button {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-button:hover {
  color: #3b82f6;
}

.tab-button.tab-active {
  background-color: white;
  color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

// 表单样式
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

.form-input {
  width: 100%;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.form-input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-hint {
  font-size: 13px;
  color: #94a3b8;
  margin-top: 4px;
}

// 复选框
.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.custom-checkbox {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
}

// 按钮样式
.submit-button {
  width: 100%;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  transition: all 0.3s ease;
}

.submit-button:hover {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

// 注册链接
.register-link {
  text-align: center;
  margin-top: 8px;
}

.register-link p {
  font-size: 14px;
  color: #64748b;
}

.register-text {
  color: #3b82f6;
  font-weight: 600;
  text-decoration: none;
}

.register-text:hover {
  text-decoration: underline;
}

// 第三方登录
.third-party-login {
  margin-top: 40px;
}

.divider {
  display: flex;
  align-items: center;
  margin-bottom: 24px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #e2e8f0;
}

.divider-text {
  padding: 0 16px;
  font-size: 14px;
  color: #94a3b8;
}

.third-party-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.third-party-button {
  width: 100%;
  border-radius: 12px;
  transition: all 0.3s ease;
}

// 忘记密码
.forgot-password {
  font-size: 14px;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式设计
@media (min-width: 768px) {
  .login-container {
    flex-direction: row;
  }
  
  .info-section {
    width: 40%;
  }
  
  .login-section {
    width: 60%;
  }
  
  .third-party-buttons {
    flex-direction: row;
  }
}

@media (max-width: 767px) {
  .login-main {
    padding: 10px;
  }
  
  .info-section {
    padding: 24px;
  }
  
  .login-section {
    padding: 24px;
  }
  
  .welcome-title {
    font-size: 28px;
  }
  
  .welcome-text {
    font-size: 16px;
  }
  
  .login-title {
    font-size: 24px;
  }
}

.dark {
  .login-main {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }

  .login-container {
    background-color: #2d3748;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .info-section {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  }

  .logo-text {
    color: #e2e8f0;
  }

  .welcome-title {
    color: #f7fafc;
  }

  .welcome-text {
    color: #cbd5e0;
  }

  .feature-title {
    color: #e2e8f0;
  }

  .feature-desc {
    color: #a0aec0;
  }

  .copyright {
    border-top: 1px solid #4a5568;
    color: #a0aec0;
  }

  .login-section {
    background-color: #2d3748;
  }

  .login-title {
    color: #f7fafc;
  }

  .login-subtitle {
    color: #cbd5e0;
  }

  .login-tabs {
    background-color: #4a5568;
  }

  .tab-button {
    color: #cbd5e0;
  }

  .tab-button:hover {
    color: #63b3ed;
  }

  .tab-button.tab-active {
    background-color: #4a5568;
    color: #63b3ed;
    box-shadow: 0 4px 12px rgba(99, 179, 237, 0.2);
  }

  .form-label {
    color: #e2e8f0;
  }

  .form-hint {
    color: #a0aec0;
  }

  .checkbox-label {
    color: #cbd5e0;
  }

  .custom-checkbox {
    accent-color: #63b3ed;
  }

  .forgot-password {
    color: #63b3ed;
  }

  .register-link p {
    color: #cbd5e0;
  }

  .register-text {
    color: #63b3ed;
  }

  .divider-line {
    background-color: #4a5568;
  }

  .divider-text {
    color: #a0aec0;
  }

  .security-icon {
    background-color: #2c5282;
    color: #90cdf4;
  }

  .speed-icon {
    background-color: #553c9a;
    color: #d6bcfa;
  }

  .sync-icon {
    background-color: #97266d;
    color: #fbb6ce;
  }

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

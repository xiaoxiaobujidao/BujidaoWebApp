import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  checkLoginKey,
  loginWithEmail,
  loginWithEmailPasswd,
  loginWithTelegram,
} from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'
import { useUserInfoStore } from '@/stores/userInfoStore'

export const EMAIL_PATTERN =
  /^[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?$/

const NETWORK_ERROR = '网络连接失败，请检查网络后重试，如有疑问请联系管理员'

/**
 * 登录页通用逻辑：邀请码、邮件链接登录、密码登录、第三方登录跳转。
 * 视图只负责渲染表单，调用这里的方法即可。
 */
export function useAuth() {
  const router = useRouter()
  const userInfoStore = useUserInfoStore()

  const email = ref('')
  const password = ref('')
  const inviter = ref<string | undefined>()
  const loading = ref(false)
  /** 邮件链接已发送（用于展示“去邮箱查收”提示） */
  const mailSent = ref(false)

  function isValidEmail(value: string) {
    return EMAIL_PATTERN.test(value.trim())
  }

  /** 读取 URL 上的邀请码 / 登录 key；已登录则直接完成登录流程 */
  function initAuth() {
    const route = router.currentRoute.value
    const urlCode = route.query.code ? String(route.query.code) : undefined
    const savedCode = localStorage.getItem('inviter') ?? undefined
    if (urlCode) {
      if (urlCode !== savedCode) localStorage.setItem('inviter', urlCode)
      inviter.value = urlCode
    } else {
      inviter.value = savedCode
    }

    const loginKey = route.query.login_key
    if (loginKey) {
      loading.value = true
      checkLoginKey(String(loginKey))
        .then((res) => {
          if (res.result) {
            finishLogin(res.result)
          } else {
            ElMessage.error(res.error?.message ?? '登录链接无效或已过期')
          }
        })
        .catch(() => ElMessage.error('验证失败，请重试'))
        .finally(() => {
          loading.value = false
        })
    }

    if (userInfoStore.getToken()) {
      finishLogin()
    }
  }

  /** 邮件魔法链接登录 */
  async function sendMagicLink() {
    const value = email.value.trim()
    if (!value) return ElMessage.warning('请输入邮箱地址')
    if (!isValidEmail(value)) return ElMessage.warning('请输入有效的邮箱地址')
    loading.value = true
    try {
      const res = await loginWithEmail(value, inviter.value ?? null)
      if (res.result) {
        mailSent.value = true
        ElMessage.success('登录邮件已发送，请使用邮件中的链接登录')
      } else {
        ElMessage.error(res.error?.message ?? '邮件发送失败，如邮箱正确请联系管理员')
      }
    } catch {
      ElMessage.error(NETWORK_ERROR)
    } finally {
      loading.value = false
    }
  }

  /** 邮箱 + 密码登录 */
  async function loginWithPassword() {
    const value = email.value.trim()
    if (!value || !password.value) return ElMessage.warning('请输入邮箱地址和密码')
    if (!isValidEmail(value)) return ElMessage.warning('请输入有效的邮箱地址')
    loading.value = true
    try {
      const res = await loginWithEmailPasswd(value, password.value)
      if (res.result) {
        await finishLogin(res.result.login_token)
      } else {
        ElMessage.error(res.error?.message ?? '登录失败，请检查邮箱和密码')
      }
    } catch {
      ElMessage.error(NETWORK_ERROR)
    } finally {
      loading.value = false
    }
  }

  function googleAuth() {
    const googleId = import.meta.env.VITE_GOOGLE_OAUTH
    const redirectUri = `${window.location.origin}/google-oauth`
    location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email' +
      '&include_granted_scopes=true&response_type=token&redirect_uri=' +
      encodeURIComponent(redirectUri) +
      '&client_id=' +
      googleId
  }

  function telegramAuth() {
    const botId = import.meta.env.VITE_BOT_ID
    const origin = window.location.origin
    const returnTo = origin + router.currentRoute.value.path
    location.href =
      `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(origin)}` +
      `&embed=1&return_to=${encodeURIComponent(returnTo)}`
  }

  /** Telegram 登录组件回调（telegram-widget.js 会调用 window.onTelegramAuth） */
  function setupTelegramCallback() {
    const win = window as Window & { onTelegramAuth?: (user: unknown) => void }
    win.onTelegramAuth = (user: unknown) => {
      loading.value = true
      loginWithTelegram(user, inviter.value ?? null)
        .then((res) => {
          if (res.result) {
            finishLogin(res.result.login_token)
          } else {
            ElMessage.error(res.error?.message ?? '登录失败')
          }
        })
        .catch(() => ElMessage.error(NETWORK_ERROR))
        .finally(() => {
          loading.value = false
        })
    }
  }

  return {
    email,
    password,
    inviter,
    loading,
    mailSent,
    isValidEmail,
    initAuth,
    sendMagicLink,
    loginWithPassword,
    googleAuth,
    telegramAuth,
    setupTelegramCallback,
  }
}

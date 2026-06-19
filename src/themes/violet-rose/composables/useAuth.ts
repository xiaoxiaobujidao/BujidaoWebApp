import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { checkLoginKey, loginWithTelegram } from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'
import { useUserInfoStore } from '@/stores/userInfoStore'

const EMAIL_PATTERN =
  /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/

export function useAuth() {
  const router = useRouter()
  const userInfoStore = useUserInfoStore()
  const inviter = ref<string | undefined>()
  const inviterLocked = ref(false)
  const loading = ref(false)

  function isValidEmail(email: string) {
    return EMAIL_PATTERN.test(email)
  }

  function initAuth() {
    const route = router.currentRoute.value
    const urlCode = route.query.code ? String(route.query.code) : undefined
    const savedCode = localStorage.getItem('inviter') ?? undefined

    if (urlCode) {
      if (urlCode !== savedCode) {
        localStorage.setItem('inviter', urlCode)
      }
      inviter.value = urlCode
    } else if (savedCode) {
      inviter.value = savedCode
    } else {
      inviter.value = undefined
    }

    inviterLocked.value = !!inviter.value

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
        .catch(() => {
          ElMessage.error('验证失败，请重试')
        })
        .finally(() => {
          loading.value = false
        })
    }

    if (userInfoStore.getToken()) {
      finishLogin()
    }
  }

  function googleAuth() {
    const googleId = import.meta.env.VITE_GOOGLE_OAUTH
    const redirectUri = `${window.location.origin}/google-oauth`
    location.href =
      'https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&include_granted_scopes=true&response_type=token&redirect_uri=' +
      encodeURIComponent(redirectUri) +
      '&client_id=' +
      googleId
  }

  function telegramAuth() {
    const botId = import.meta.env.VITE_BOT_ID
    const origin = window.location.origin
    const returnPath = router.currentRoute.value.path
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(origin)}&embed=1&return_to=${encodeURIComponent(origin + returnPath)}`
    window.location.href = authUrl
  }

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
        .catch(() => {
          ElMessage.error('网络错误，请检查网络后重试')
        })
        .finally(() => {
          loading.value = false
        })
    }
  }

  return {
    inviter,
    inviterLocked,
    loading,
    initAuth,
    isValidEmail,
    googleAuth,
    telegramAuth,
    setupTelegramCallback,
    userInfoStore,
  }
}

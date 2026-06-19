import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { getUserInfo as fetchUserInfo } from '@/utils/user'
import { useThemeStore } from '@/stores/themeStore'
export interface UserInfo {
  user_id: string
  user_name: string | null
  email: string | null
  telegram_id: number | null
  balance: number
  rebate: number
  points: number
  tron_address: string | null
  xmr_address: string | null
  sub_address: string[]
  email_opt_in: number
  theme: string | null
}
interface UserInfoStore {
  userInfo: Ref<UserInfo | null>
  token: Ref<string | null>
  setUserInfo: (userInfo: UserInfo) => void
  getUserInfo: () => UserInfo | null
  setToken: (token: string | null) => void
  getToken: () => string | null
  clearUserInfo: () => void
  updateUserInfo: () => Promise<boolean>
  syncUserTheme: () => Promise<boolean>
  completeLogin: (loginToken?: string | null) => Promise<boolean>
}
export const useUserInfoStore = defineStore(
  'userInfo',
  (): UserInfoStore => {
    const userInfo = ref<UserInfo | null>(null)
    const token = ref<string | null>(null)
    const setUserInfo = (newUserInfo: UserInfo) => {
      userInfo.value = newUserInfo
    }
    const getUserInfo = () => {
      return userInfo.value
    }
    async function syncUserTheme(): Promise<boolean> {
      const userTheme = userInfo.value?.theme
      if (!userTheme) return false

      const themeStore = useThemeStore()
      if (themeStore.availableThemes.length === 0) {
        themeStore.scanAvailableThemes()
      }
      if (!themeStore.availableThemes.includes(userTheme)) return false
      if (userTheme === themeStore.currentTheme) return false

      await themeStore.switchTheme(userTheme)
      return true
    }
    const setToken = (newToken: string | null) => {
      token.value = newToken
    }
    const getToken = () => {
      return token.value
    }
    const clearUserInfo = () => {
      userInfo.value = null
      token.value = null
    }
    let updateUserInfoPromise: Promise<boolean> | null = null
    const updateUserInfo = async () => {
      if (updateUserInfoPromise) {
        return updateUserInfoPromise
      }
      updateUserInfoPromise = (async () => {
        try {
          const res = await fetchUserInfo()
          if (res.result) {
            userInfo.value = res.result
            return await syncUserTheme()
          }
          if (res.error) {
            clearUserInfo()
            window.location.href = '/'
          }
          return false
        } finally {
          updateUserInfoPromise = null
        }
      })()
      return updateUserInfoPromise
    }
    async function completeLogin(loginToken?: string | null): Promise<boolean> {
      if (loginToken) {
        token.value = loginToken
      }
      return updateUserInfo()
    }
    return {
      userInfo,
      token,
      setUserInfo,
      getUserInfo,
      setToken,
      getToken,
      clearUserInfo,
      updateUserInfo,
      syncUserTheme,
      completeLogin,
    }
  },
  {
    persist: true,
  },
)

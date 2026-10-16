import { computed, h, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { bindTelegram, cancel, changeEmail, changePasswd, updateEmailOptIn } from '@/utils/user'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { closeTelegramWebApp } from '@/utils/telegram'
import { EMAIL_PATTERN } from './useAuth'

const NETWORK_ERROR = '网络连接失败，请检查网络后重试，如有疑问请联系管理员'

/**
 * 账户页通用逻辑：资料修改、营销邮件订阅、注销账号（两步确认）。
 * 弹窗统一走 Element Plus 的 MessageBox，由各主题通过 CSS 变量定制外观。
 */
export function useAccount() {
  const userInfoStore = useUserInfoStore()
  const userInfo = computed(() => userInfoStore.getUserInfo())

  const emailOptIn = ref(false)
  /** 已绑定邮箱但从未设置过订阅偏好时，提示一次 */
  const showOptInPrompt = ref(false)
  let optInPrompted = false

  watch(
    userInfo,
    (info) => {
      if (!info) return
      emailOptIn.value = info.email_opt_in > 0
      if (info.email && info.email_opt_in === 0 && !optInPrompted) {
        optInPrompted = true
        showOptInPrompt.value = true
      }
    },
    { immediate: true },
  )

  function refresh() {
    return userInfoStore.updateUserInfo()
  }

  const balanceYuan = computed(() => ((userInfo.value?.balance ?? 0) / 100).toFixed(2))
  const pointsYuan = computed(() => ((userInfo.value?.points ?? 0) / 100).toFixed(2))
  const rebateYuan = computed(() => ((userInfo.value?.rebate ?? 0) / 100).toFixed(2))
  /** 余额不足 10 元时提示充值 */
  const lowBalance = computed(() => (userInfo.value?.balance ?? 0) < 1000)
  const primarySub = computed(() => userInfo.value?.sub_address[0] ?? '')
  const backupSub = computed(() => userInfo.value?.sub_address[1] ?? '')
  const antiHijackSub = computed(() => (primarySub.value ? primarySub.value + '&addr=ip' : ''))

  async function toggleEmailOptIn(value?: boolean) {
    if (typeof value === 'boolean') emailOptIn.value = value
    try {
      const res = await updateEmailOptIn(emailOptIn.value)
      if (res.error) {
        ElMessage.error('订阅状态更改失败，如有疑问，请联系管理员')
        emailOptIn.value = !emailOptIn.value
      } else {
        ElMessage.success(emailOptIn.value ? '已订阅营销邮件' : '已取消订阅')
        showOptInPrompt.value = false
        await refresh()
      }
    } catch {
      ElMessage.error(NETWORK_ERROR)
    }
  }

  async function changeEmailPrompt() {
    try {
      const { value } = await ElMessageBox.prompt('请输入新的邮箱地址', '绑定邮箱', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputPattern: EMAIL_PATTERN,
        inputErrorMessage: '邮箱格式不正确',
        inputType: 'email',
        inputValue: userInfo.value?.email ?? '',
      })
      const res = await changeEmail(value.trim())
      if (res.result) {
        ElMessage.success('邮箱更改成功')
        await refresh()
      } else {
        ElMessage.error(res.error?.message ?? '邮箱更改失败，如有疑问，请联系管理员')
      }
    } catch (e) {
      if (e === 'cancel' || e === 'close') return
      ElMessage.error(NETWORK_ERROR)
    }
  }

  async function changePasswordPrompt() {
    try {
      const { value } = await ElMessageBox.prompt('请输入新密码（至少 6 位）', '更改密码', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputType: 'password',
        inputValidator: (v: string) => v.length >= 6 || '密码至少 6 位',
      })
      const res = await changePasswd(value)
      if (res.result) {
        ElMessage.success('密码更改成功')
      } else {
        ElMessage.error(res.error?.message ?? '密码更改失败，如有疑问，请联系管理员')
      }
    } catch (e) {
      if (e === 'cancel' || e === 'close') return
      ElMessage.error(NETWORK_ERROR)
    }
  }

  async function bindTelegramPrompt() {
    try {
      const { value } = await ElMessageBox.prompt(
        h('div', { class: 'app-prompt-body' }, [
          h('p', null, '请输入您的 Telegram ID（纯数字）'),
          h('p', { class: 'app-prompt-tip' }, [
            '可向 ',
            h(
              'a',
              { href: 'https://bujidao_bot.t.me', target: '_blank', rel: 'noopener' },
              '@Bujidao_Bot',
            ),
            ' 发送任意消息获取',
          ]),
        ]),
        '绑定 Telegram',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputPattern: /^\d{5,}$/,
          inputErrorMessage: '请输入纯数字的 Telegram ID',
          inputValue: userInfo.value?.telegram_id ? String(userInfo.value.telegram_id) : '',
        },
      )
      const res = await bindTelegram(Number(value))
      if (!res.error) {
        ElMessage.success('绑定成功')
        await refresh()
      } else {
        ElMessage.error(res.error.message ?? '绑定失败')
      }
    } catch (e) {
      if (e === 'cancel' || e === 'close') return
      ElMessage.error(NETWORK_ERROR)
    }
  }

  /** 注销账号：两步确认，明确区分“退出登录”与“注销” */
  async function cancelAccount() {
    try {
      await ElMessageBox.confirm(
        h('div', { class: 'app-prompt-body' }, [
          h('p', null, [
            '您即将',
            h('strong', null, '注销账号'),
            '。这与“退出登录”完全不同：退出登录只是暂时离开，账号与数据保留；',
            h('strong', null, '注销会永久删除账号、余额、订阅地址及全部使用记录，且无法恢复。'),
          ]),
          h('p', { class: 'app-prompt-tip' }, '如只是想换个账号登录，请使用“登出”。'),
        ]),
        '确认注销账号？',
        { confirmButtonText: '我已了解，继续', cancelButtonText: '取消', type: 'warning' },
      )
      await ElMessageBox.confirm(
        '最后确认：确定要彻彻底底、完完全全清除一切存在于岛的痕迹吗？此操作不可撤销。',
        '最后一步',
        {
          confirmButtonText: '是的，消灭我 🔥',
          cancelButtonText: '再想想',
          type: 'error',
          confirmButtonClass: 'el-button--danger',
        },
      )
    } catch {
      return
    }
    try {
      const res = await cancel()
      if (res.result === true) {
        ElMessage.success('注销成功')
        userInfoStore.clearUserInfo()
        closeTelegramWebApp()
        window.location.href = '/login'
      } else {
        ElMessage.error(res.error?.message ?? '注销失败，请联系管理员')
      }
    } catch {
      ElMessage.error(NETWORK_ERROR)
    }
  }

  return {
    userInfo,
    emailOptIn,
    showOptInPrompt,
    balanceYuan,
    pointsYuan,
    rebateYuan,
    lowBalance,
    primarySub,
    backupSub,
    antiHijackSub,
    refresh,
    toggleEmailOptIn,
    changeEmailPrompt,
    changePasswordPrompt,
    bindTelegramPrompt,
    cancelAccount,
  }
}

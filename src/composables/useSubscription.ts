import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { changeSubKey, changeUuid, changeWireguardPriKey } from '@/utils/user'
import { base64Encode } from '@/utils/utils'
import { importClients, type ImportClient } from '@/utils/importClients'
import { useUserInfoStore } from '@/stores/userInfoStore'

export interface SubLink {
  id: string
  label: string
  /** 适用说明 */
  hint: string
  value: string
}

export interface ImportLink {
  id: string
  name: string
  icon?: string
  href: string
}

/**
 * 订阅页通用逻辑：各客户端订阅链接、一键导入链接、密钥重置（带确认）。
 */
export function useSubscription() {
  const userInfoStore = useUserInfoStore()
  const userInfo = computed(() => userInfoStore.getUserInfo())
  const primarySub = computed(() => userInfo.value?.sub_address[0] ?? '')
  const backupSub = computed(() => userInfo.value?.sub_address[1] ?? '')

  /** 按客户端区分的订阅地址 */
  const subLinks = computed<SubLink[]>(() => {
    const sub = primarySub.value
    if (!sub) return []
    return [
      { id: 'universal', label: '通用订阅', hint: '所有客户端均可用，按 UA 自动识别', value: sub },
      {
        id: 'anti-hijack',
        label: '防劫持订阅',
        hint: '节点地址解析为 IP，可规避 DNS 劫持',
        value: sub + '&addr=ip',
      },
      {
        id: 'v2rayn',
        label: 'v2rayN / v2rayNG',
        hint: '分享链接格式',
        value: sub + '&type=v2rayN',
      },
      {
        id: 'shadowrocket',
        label: 'Shadowrocket',
        hint: 'iOS / macOS 小火箭',
        value: sub + '&type=shadowrocket',
      },
      {
        id: 'clash',
        label: 'Clash / Clash Verge',
        hint: 'Clash 系列客户端',
        value: sub + '&type=clash_verge',
      },
      { id: 'singbox', label: 'sing-box', hint: 'sing-box 配置格式', value: sub + '&type=singbox' },
    ]
  })

  /** 一键导入链接（含 hiddify，走 sing-box 协议） */
  const importLinks = computed<ImportLink[]>(() => {
    const sub = primarySub.value
    if (!sub) return []
    const fromShared = importClients.map((client: ImportClient) => ({
      id: client.id,
      name: client.name,
      icon: client.icon,
      href: client.buildHref(sub, base64Encode),
    }))
    const hiddify: ImportLink = {
      id: 'hiddify',
      name: 'Hiddify',
      href: encodeURI(
        'sing-box://import-remote-profile?url=' + encodeURI(sub + '&type=hidiffy') + '#布吉岛',
      ),
    }
    return [...fromShared, hiddify]
  })

  async function confirmThen(title: string, message: string, action: () => Promise<any>) {
    try {
      await ElMessageBox.confirm(message, title, {
        confirmButtonText: '确定重置',
        cancelButtonText: '取消',
        type: 'warning',
      })
    } catch {
      return
    }
    try {
      const res = await action()
      if (res?.error) {
        ElMessage.error(
          typeof res.error === 'string' ? res.error : (res.error?.message ?? '操作失败'),
        )
      } else {
        ElMessage.success('重置成功')
        await userInfoStore.updateUserInfo()
      }
    } catch {
      ElMessage.error('网络连接失败，请检查网络后重试')
    }
  }

  const resetSubKey = () =>
    confirmThen(
      '更换订阅地址',
      '订阅地址将被更换，所有使用旧订阅地址的客户端都需要重新填写。确定继续吗？',
      changeSubKey,
    )

  const resetUuid = () =>
    confirmThen(
      '重置代理密码',
      '订阅地址不变，但所有客户端都需要更新一次订阅才能继续使用。确定继续吗？',
      changeUuid,
    )

  const resetWireguardKey = () =>
    confirmThen(
      '重置 WireGuard 密钥',
      'WireGuard 专属私钥将被重置，需要在客户端更新配置文件的私钥，或重新复制配置。确定继续吗？',
      changeWireguardPriKey,
    )

  return {
    userInfo,
    primarySub,
    backupSub,
    subLinks,
    importLinks,
    resetSubKey,
    resetUuid,
    resetWireguardKey,
    refresh: () => userInfoStore.updateUserInfo(),
  }
}

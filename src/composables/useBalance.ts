import { computed, onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  createInviteLink,
  getInviteLink,
  getInvitedCount,
  getUnmeasuredTraffic,
  getUserTrafficHistory,
  pointsToBalance,
  rebateToBalance,
} from '@/utils/user'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { sumUsage, type TrafficRecord } from '@/utils/trafficHistory'

export interface InviteLink {
  invite_link: string
  rebate_ratio: string | number
}

/**
 * 财务页通用逻辑：余额/积分/返利、未计入流量、流量历史、邀请链接。
 */
export function useBalance() {
  const userInfoStore = useUserInfoStore()
  const userInfo = computed(() => userInfoStore.getUserInfo())

  const unmeasured = ref(0)
  const inviteLinks = ref<InviteLink[] | null>(null)
  const invitedCount = ref(0)
  const trafficHistory = ref<TrafficRecord[]>([])
  const loadingHistory = ref(false)

  const balanceYuan = computed(() => ((userInfo.value?.balance ?? 0) / 100).toFixed(2))
  const pointsYuan = computed(() => ((userInfo.value?.points ?? 0) / 100).toFixed(2))
  const rebateYuan = computed(() => ((userInfo.value?.rebate ?? 0) / 100).toFixed(2))
  const unmeasuredMiB = computed(() => (unmeasured.value / 100 / 1024 / 1024).toFixed(3))
  const canConvertPoints = computed(() => (userInfo.value?.points ?? 0) >= 100)
  const canConvertRebate = computed(() => (userInfo.value?.rebate ?? 0) > 0)
  const hasInvitePermission = computed(() => (inviteLinks.value?.length ?? 0) > 0)

  /** 最近 7 天 / 30 天消费（元） */
  const usage7d = computed(() => sumUsage(trafficHistory.value, Date.now() - 7 * 86400_000))
  const usage30d = computed(() => sumUsage(trafficHistory.value, Date.now() - 30 * 86400_000))

  async function refresh() {
    await userInfoStore.updateUserInfo()
  }

  async function loadUnmeasured() {
    try {
      const res = await getUnmeasuredTraffic()
      unmeasured.value = res.result ?? 0
    } catch {
      /* 非关键数据，忽略 */
    }
  }

  async function loadInvite() {
    try {
      const res = await getInviteLink()
      inviteLinks.value = (res.result ?? []) as InviteLink[]
      if (inviteLinks.value.length > 0) {
        const count = await getInvitedCount()
        invitedCount.value = count.result ?? 0
      }
    } catch {
      inviteLinks.value = []
    }
  }

  async function loadHistory() {
    loadingHistory.value = true
    try {
      const res = await getUserTrafficHistory()
      trafficHistory.value = (res.result ?? [])
        .slice()
        .sort((a, b) => a.update_time - b.update_time)
    } catch {
      ElMessage.error('流量记录加载失败')
    } finally {
      loadingHistory.value = false
    }
  }

  async function applyInvite() {
    try {
      const res = await createInviteLink()
      if (res.error) {
        ElMessage.error(res.error.message ?? '申请失败')
        return
      }
      inviteLinks.value = (res.result ?? []) as InviteLink[]
      ElMessage.success('推广链接已生成')
    } catch {
      ElMessage.error('网络连接失败，请检查网络后重试')
    }
  }

  async function convert(kind: 'points' | 'rebate') {
    const isPoints = kind === 'points'
    try {
      await ElMessageBox.confirm(
        isPoints
          ? '积分将按 100:1 兑换为余额，确定继续吗？'
          : '返利将按 1:1 兑换为余额，确定继续吗？',
        isPoints ? '兑换积分' : '兑换返利',
        { confirmButtonText: '兑换', cancelButtonText: '取消', type: 'info' },
      )
    } catch {
      return
    }
    try {
      const res = await (isPoints ? pointsToBalance() : rebateToBalance())
      if (res.error) {
        ElMessage.error(res.error.message ?? '兑换失败')
      } else {
        ElMessage.success('兑换成功')
        await refresh()
      }
    } catch {
      ElMessage.error('网络连接失败，请检查网络后重试')
    }
  }

  function withdraw() {
    ElMessage.info('提现功能暂未开放，敬请期待')
  }

  onMounted(() => {
    refresh()
    loadUnmeasured()
    loadInvite()
    loadHistory()
  })

  return {
    userInfo,
    balanceYuan,
    pointsYuan,
    rebateYuan,
    unmeasuredMiB,
    canConvertPoints,
    canConvertRebate,
    inviteLinks,
    invitedCount,
    hasInvitePermission,
    trafficHistory,
    loadingHistory,
    usage7d,
    usage30d,
    refresh,
    loadHistory,
    applyInvite,
    convertPoints: () => convert('points'),
    convertRebate: () => convert('rebate'),
    withdraw,
  }
}

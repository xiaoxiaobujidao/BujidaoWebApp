import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addCredit, getGift, getPaymentMethod } from '@/utils/user'
import { is_ios } from '@/utils/utils'

export interface PaymentGroup {
  name: string
  path: string
  method: { kind: string; img: string }[]
}

export const MIN_AMOUNT = 20
export const MAX_AMOUNT = 1000
export const QUICK_AMOUNTS = [20, 50, 100, 200, 500]

/**
 * 充值流程：输入金额 → 选择支付方式 → 跳转支付。
 */
export function useAddCredit() {
  const step = ref<0 | 1 | 2>(0)
  const amount = ref<number>(MIN_AMOUNT)
  const groups = ref<PaymentGroup[]>([])
  const gift = ref<number[][]>([])
  const paying = ref(false)

  const amountError = computed(() => {
    const n = amount.value
    if (typeof n !== 'number' || Number.isNaN(n)) return '请输入充值金额'
    if (!Number.isInteger(n)) return '仅支持整数金额'
    if (n < MIN_AMOUNT) return `最低充值 ${MIN_AMOUNT} 元`
    if (n > MAX_AMOUNT) return `单次最多充值 ${MAX_AMOUNT} 元`
    return ''
  })
  const canProceed = computed(() => !amountError.value)

  /** 根据当前金额估算赠送（取满足条件的最高档） */
  const bonus = computed(() => {
    const n = amount.value
    if (!Number.isFinite(n)) return 0
    let best = 0
    for (const [threshold = 0, give = 0] of gift.value) {
      if (n >= threshold && give > best) best = give
    }
    return best
  })

  onMounted(async () => {
    try {
      const [methods, gifts] = await Promise.all([getPaymentMethod(), getGift()])
      groups.value = methods.result ?? []
      gift.value = gifts.result ?? []
    } catch {
      ElMessage.error('支付方式加载失败，请稍后重试')
    }
  })

  function next() {
    if (canProceed.value) step.value = 1
  }

  function back() {
    step.value = 0
  }

  async function pay(path: string, kind: string) {
    if (paying.value) return
    paying.value = true
    try {
      const res = await addCredit(path, kind, amount.value * 100)
      if (res.error) {
        ElMessage.error(res.error.message ?? '支付创建失败')
        return
      }
      const link: string | undefined = res.result?.pay_link
      if (link) {
        if (is_ios()) {
          ElMessage.success('正在跳转支付页面')
          window.location.href = link
        } else {
          const win = window.open(link)
          if (!win) {
            ElMessage.info('弹出窗口被拦截，正在本页打开')
            window.location.href = link
          }
        }
      }
      step.value = 2
    } catch {
      ElMessage.error('网络连接失败，请检查网络后重试')
    } finally {
      paying.value = false
    }
  }

  return {
    step,
    amount,
    groups,
    gift,
    bonus,
    paying,
    amountError,
    canProceed,
    quickAmounts: QUICK_AMOUNTS,
    next,
    back,
    pay,
  }
}

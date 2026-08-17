<script setup lang="ts">
import { computed, ref } from 'vue'
import { addCredit, getPaymentMethod, getGift } from '@/utils/user'
import { ElMessage } from 'element-plus'
import { is_ios } from '@/utils/utils'
import BjButton from '@bujidao/components/ui/BjButton.vue'

const paymentMethod = ref<
  { name: string; path: string; method: { kind: string; img: string }[] }[] | undefined
>()
const step = ref(0)
const num = ref(20)
const gift = ref<number[][]>()

const amountError = computed(() => {
  const n = num.value
  if (typeof n !== 'number' || Number.isNaN(n)) return '请输入充值金额'
  if (!Number.isInteger(n)) return '仅支持整数金额'
  if (n < 20) return '最低充值 20 元'
  return ''
})
const canProceed = computed(() => !amountError.value)

getPaymentMethod().then((res) => {
  paymentMethod.value = res.result
})

getGift().then((res) => {
  if (res.result?.length) {
    gift.value = res.result
  }
})

function pay(path: string, method: string) {
  addCredit(path, method, num.value * 100).then((res) => {
    if (res.error) {
      ElMessage.error(res.error.message ?? '支付失败')
      return
    }
    if (res.result?.pay_link) {
      if (is_ios()) {
        ElMessage.success('正在跳转支付页面')
        window.location.href = res.result.pay_link
      } else {
        const newPage = window.open(res.result.pay_link)
        if (!newPage) {
          ElMessage.info('弹出窗口失败，正在本页打开')
          window.location.href = res.result.pay_link
        }
      }
    }
    step.value = 2
  })
}
</script>

<template>
  <div class="credit">
    <div v-if="step === 0" class="credit__step">
      <div v-if="gift?.length" class="credit__gift">
        <p class="credit__gift-title">🏝️ 充值活动</p>
        <p v-for="(item, i) in gift" :key="i" class="credit__gift-item">
          每满 <strong>{{ item[0] }}</strong> 赠 <strong>{{ item[1] }}</strong> 元
        </p>
        <p class="credit__gift-note">取不重复赠送计算之最高，如冲2送1，冲3送2，则冲5会送3</p>
      </div>
      <p class="credit__hint">最低充值 20 元，仅支持整数</p>
      <label class="credit__field">
        <span>金额（元）</span>
        <div class="credit__input-row">
          <input v-model.number="num" type="number" min="20" max="1000" step="1" />
          <p v-if="amountError" class="credit__error">{{ amountError }}</p>
        </div>
      </label>
      <BjButton :disabled="!canProceed" @click="step = 1">下一步</BjButton>
    </div>

    <div v-else-if="step === 1" class="credit__step">
      <p class="credit__amount">¥{{ num }}</p>
      <p class="credit__hint">选择支付方式</p>
      <div v-for="group in paymentMethod" :key="group.path" class="credit__group">
        <p class="credit__group-name">{{ group.name }}</p>
        <div class="credit__methods">
          <button
            v-for="(m, i) in group.method"
            :key="i"
            type="button"
            class="credit__method"
            @click="pay(group.path, m.kind)"
          >
            <img :src="m.img" :alt="m.kind" />
          </button>
        </div>
      </div>
      <BjButton variant="ghost" @click="step = 0">返回</BjButton>
    </div>

    <div v-else class="credit__step credit__step--done">
      <div class="credit__done-icon">✓</div>
      <p class="credit__done">请在支付页面完成付款</p>
      <BjButton variant="ghost" @click="step = 0">重新充值</BjButton>
    </div>
  </div>
</template>

<style scoped>
.credit {
  padding: 0.25rem 0.5rem;
}

.credit__step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: stretch;
}

.credit__gift {
  padding: 1rem 1.1rem;
  background: linear-gradient(135deg, rgba(61, 165, 232, 0.14) 0%, rgba(249, 232, 200, 0.35) 100%);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
}

.credit__gift-title {
  font-weight: 700;
  color: var(--color-ocean-deep);
  margin-bottom: 0.45rem;
}

.credit__gift-item {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
}

.credit__gift-item strong {
  color: var(--color-ocean-deep);
}

.credit__gift-note {
  margin-top: 0.45rem;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  opacity: 0.88;
}

.credit__amount {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  text-align: center;
  color: var(--color-ocean-deep);
}

.credit__hint {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  text-align: center;
}

.credit__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.credit__input-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.credit__field input {
  flex: 1 1 140px;
  min-width: 0;
  padding: 0.75rem 0.95rem;
  font-size: 1.05rem;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.62);
  color: var(--color-text-primary);
  outline: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.credit__error {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-coral);
  white-space: nowrap;
}

.dark .credit__field input {
  background: rgba(255, 255, 255, 0.06);
}

.credit__field input:focus {
  border-color: var(--color-ocean);
  box-shadow: 0 0 0 3px rgba(61, 165, 232, 0.18);
}

.credit__group-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.55rem;
}

.credit__methods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 0.5rem;
}

.credit__method {
  padding: 0.45rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    border-color 0.18s ease;
}

.dark .credit__method {
  background: rgba(255, 255, 255, 0.06);
}

.credit__method:hover {
  transform: translateY(-3px);
  border-color: var(--color-ocean);
  box-shadow: var(--shadow-card);
}

.credit__method img {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.credit__step--done {
  align-items: center;
  padding: 1rem 0 0.5rem;
}

.credit__done-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, var(--color-ocean) 0%, var(--color-ocean-deep) 100%);
  box-shadow: 0 8px 24px var(--color-ocean-glow);
}

.credit__done {
  text-align: center;
  padding: 0.5rem 0 0.75rem;
  color: var(--color-text-primary);
  font-size: 1rem;
}
</style>

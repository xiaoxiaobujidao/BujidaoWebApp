<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { addCredit, getPaymentMethod, getGift } from '@/utils/user'
import { is_ios } from '@/utils/utils'
import VrButton from '@violet-rose/components/ui/VrButton.vue'

const paymentMethod = ref<
  { name: string; path: string; method: { kind: string; img: string }[] }[] | undefined
>()
const step = ref(0)
const num = ref(20)
const gift = ref<number[][]>()

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
        <p class="credit__gift-title">充值活动</p>
        <p v-for="(item, i) in gift" :key="i" class="credit__gift-item">
          每满 <strong>{{ item[0] }}</strong> 赠 <strong>{{ item[1] }}</strong> 元
        </p>
      </div>
      <p class="credit__hint">最低充值 20 元，仅支持整数</p>
      <label class="credit__field">
        <span>金额（元）</span>
        <input v-model.number="num" type="number" min="20" max="1000" step="1" />
      </label>
      <VrButton @click="step = 1">下一步</VrButton>
    </div>

    <div v-else-if="step === 1" class="credit__step">
      <p class="credit__hint">选择支付方式 · ¥{{ num }}</p>
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
      <VrButton variant="ghost" @click="step = 0">返回</VrButton>
    </div>

    <div v-else class="credit__step">
      <p class="credit__done">请在支付页面完成付款</p>
      <VrButton variant="ghost" @click="step = 0">重新充值</VrButton>
    </div>
  </div>
</template>

<style scoped>
.credit__step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.credit__gift {
  padding: 0.85rem 1rem;
  background: rgba(171, 71, 188, 0.1);
  border-radius: var(--radius-md);
}

.credit__gift-title {
  font-weight: 600;
  color: var(--color-accent-deep);
  margin-bottom: 0.35rem;
}

.credit__gift-item {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
}

.credit__hint {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
}

.credit__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.credit__field input {
  padding: 0.65rem 0.85rem;
  font-size: 1rem;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.5);
  outline: none;
}

.credit__field input:focus {
  border-color: var(--color-accent);
}

.credit__group-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.credit__methods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 0.75rem;
}

.credit__method {
  padding: 0.35rem;
  background: #fff;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
}

.credit__method img {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.credit__done {
  text-align: center;
  padding: 1.5rem;
  color: var(--color-text-primary);
}
</style>

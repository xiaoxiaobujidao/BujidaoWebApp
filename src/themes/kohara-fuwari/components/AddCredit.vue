<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useAddCredit, MAX_AMOUNT, MIN_AMOUNT } from '@/composables/useAddCredit'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'

const {
  step,
  amount,
  groups,
  gift,
  bonus,
  paying,
  amountError,
  canProceed,
  quickAmounts,
  next,
  back,
  pay,
} = useAddCredit()
</script>

<template>
  <div class="credit">
    <!-- 第一步：金额 -->
    <div v-if="step === 0" class="credit__step">
      <div v-if="gift.length" class="credit__gift">
        <div class="credit__gift-head">
          <LucideIcon name="gift" />
          <strong>岛岛有充值活动啦</strong>
        </div>
        <ul class="credit__gift-list">
          <li v-for="(item, i) in gift" :key="i">
            充值每满 <b>{{ item[0] }}</b> 元，赠 <b>{{ item[1] }}</b> 元余额
          </li>
        </ul>
        <p class="credit__gift-note">取不重复赠送之最高档：如充 2 送 1、充 3 送 2，则充 5 送 3</p>
      </div>

      <div class="credit__quick">
        <button
          v-for="q in quickAmounts"
          :key="q"
          type="button"
          class="credit__chip"
          :class="{ 'is-active': amount === q }"
          @click="amount = q"
        >
          ¥{{ q }}
        </button>
      </div>

      <label class="credit__field">
        <span class="credit__label">充值金额（元）</span>
        <div class="credit__input-wrap" :class="{ 'is-error': amountError }">
          <span class="credit__currency">¥</span>
          <input
            v-model.number="amount"
            type="number"
            inputmode="numeric"
            :min="MIN_AMOUNT"
            :max="MAX_AMOUNT"
            step="1"
            class="credit__input"
          />
        </div>
        <span class="credit__hint" :class="{ 'is-error': amountError }">
          {{ amountError || `最低 ${MIN_AMOUNT} 元，仅支持整数` }}
          <template v-if="!amountError && bonus > 0"> · 本次预计赠送 {{ bonus }} 元</template>
        </span>
      </label>

      <FwButton
        variant="primary"
        size="lg"
        block
        :disabled="!canProceed"
        icon="arrow-right"
        @click="next"
      >
        下一步：选择支付方式
      </FwButton>
    </div>

    <!-- 第二步：支付方式 -->
    <div v-else-if="step === 1" class="credit__step">
      <div class="credit__amount">
        <span class="credit__amount-label">应付金额</span>
        <span class="credit__amount-value">¥{{ amount }}</span>
        <span v-if="bonus > 0" class="credit__amount-bonus">到账 {{ amount + bonus }} 元</span>
      </div>

      <div v-if="!groups.length" class="credit__loading">
        <LucideIcon name="loader" class="spin" /> 正在加载支付方式…
      </div>

      <div v-for="group in groups" :key="group.path" class="credit__group">
        <p class="credit__group-name">{{ group.name }}</p>
        <div class="credit__methods">
          <button
            v-for="(m, i) in group.method"
            :key="i"
            type="button"
            class="credit__method"
            :disabled="paying"
            :title="m.kind"
            @click="pay(group.path, m.kind)"
          >
            <img :src="m.img" :alt="m.kind" />
          </button>
        </div>
      </div>

      <FwButton variant="plain" icon="arrow-left" @click="back">返回修改金额</FwButton>
    </div>

    <!-- 第三步：已跳转 -->
    <div v-else class="credit__step credit__step--done">
      <span class="credit__done-icon"><LucideIcon name="check" /></span>
      <p class="credit__done-title">已打开支付页面</p>
      <p class="credit__done-text">
        请在新页面完成付款，到账后余额会自动更新。如未弹出，请检查浏览器拦截设置。
      </p>
      <FwButton variant="regular" @click="back">再充一笔</FwButton>
    </div>
  </div>
</template>

<style scoped>
.credit__step {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.credit__gift {
  padding: 0.9rem 1rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--primary-soft), var(--warning-soft));
  border: 1px solid var(--line-divider);
}

.credit__gift-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-strong);
  margin-bottom: 0.4rem;
}

.credit__gift-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.88rem;
  color: var(--text-2);
}

.credit__gift-list b {
  color: var(--primary-strong);
}

.credit__gift-note {
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-3);
}

.credit__quick {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.credit__chip {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: var(--btn-plain-bg-hover);
  color: var(--text-2);
  font-weight: 700;
  font-size: 0.88rem;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.credit__chip:hover {
  color: var(--primary);
}

.credit__chip.is-active {
  background: var(--primary);
  color: #fff;
}

.credit__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.credit__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-2);
}

.credit__input-wrap {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-color);
  background: var(--card-bg);
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.credit__input-wrap:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px oklch(0.7 0.14 var(--hue) / 0.2);
}

.credit__input-wrap.is-error {
  border-color: var(--danger);
}

.credit__currency {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-3);
}

.credit__input {
  flex: 1;
  min-width: 0;
  height: 3.25rem;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text-1);
  font-size: 1.6rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  -moz-appearance: textfield;
  appearance: textfield;
}

.credit__input::-webkit-outer-spin-button,
.credit__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.credit__hint {
  font-size: 0.78rem;
  color: var(--text-3);
}

.credit__hint.is-error {
  color: var(--danger);
  font-weight: 600;
}

.credit__amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--btn-plain-bg-hover);
}

.credit__amount-label {
  font-size: 0.8rem;
  color: var(--text-3);
}

.credit__amount-value {
  font-size: 2.2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--primary-strong);
  font-variant-numeric: tabular-nums;
}

.credit__amount-bonus {
  font-size: 0.8rem;
  color: var(--success);
  font-weight: 600;
}

.credit__loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-3);
  font-size: 0.9rem;
}

.credit__group-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-2);
  margin-bottom: 0.5rem;
}

.credit__methods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.credit__method {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.25rem;
  height: 4.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--line-divider);
  background: var(--card-bg);
  transition:
    transform var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.credit__method:hover:not(:disabled) {
  transform: translateY(-3px);
  border-color: var(--primary);
  box-shadow: var(--shadow-card-hover);
}

.credit__method img {
  width: 2.6rem;
  height: 2.6rem;
  object-fit: contain;
}

.credit__step--done {
  align-items: center;
  text-align: center;
  padding: 0.5rem 0;
}

.credit__done-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: var(--success-soft);
  color: var(--success);
  font-size: 1.6rem;
}

.credit__done-title {
  font-weight: 700;
  font-size: 1.05rem;
}

.credit__done-text {
  font-size: 0.85rem;
  color: var(--text-3);
  max-width: 24rem;
}
</style>

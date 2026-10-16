<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useAddCredit, MAX_AMOUNT, MIN_AMOUNT } from '@/composables/useAddCredit'
import ClButton from '@claude/components/ui/ClButton.vue'

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
    <div v-if="step === 0" class="credit__step">
      <div v-if="gift.length" class="credit__gift">
        <div class="credit__gift-head">
          <LucideIcon name="gift" />
          <strong>岛岛有充值活动</strong>
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
        <span class="credit__label">充值金额</span>
        <div class="credit__input-wrap" :class="{ 'is-error': amountError }">
          <span class="credit__currency cl-serif">¥</span>
          <input
            v-model.number="amount"
            type="number"
            inputmode="numeric"
            :min="MIN_AMOUNT"
            :max="MAX_AMOUNT"
            step="1"
            class="credit__input cl-serif"
          />
          <span class="credit__unit">元</span>
        </div>
        <span class="credit__hint" :class="{ 'is-error': amountError }">
          {{ amountError || `最低 ${MIN_AMOUNT} 元，仅支持整数` }}
          <template v-if="!amountError && bonus > 0"> · 本次预计赠送 {{ bonus }} 元</template>
        </span>
      </label>

      <ClButton
        variant="primary"
        size="lg"
        block
        :disabled="!canProceed"
        icon="arrow-right"
        @click="next"
      >
        选择支付方式
      </ClButton>
    </div>

    <div v-else-if="step === 1" class="credit__step">
      <div class="credit__amount">
        <span class="credit__amount-label">应付金额</span>
        <span class="credit__amount-value cl-serif">¥{{ amount }}</span>
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

      <ClButton variant="ghost" icon="arrow-left" @click="back">返回修改金额</ClButton>
    </div>

    <div v-else class="credit__step credit__step--done">
      <span class="credit__done-icon"><LucideIcon name="check" /></span>
      <p class="credit__done-title cl-serif">已打开支付页面</p>
      <p class="credit__done-text">
        请在新页面完成付款，到账后余额会自动更新。如未弹出，请检查浏览器拦截设置。
      </p>
      <ClButton variant="secondary" @click="back">再充一笔</ClButton>
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
  border-radius: var(--cl-radius-md);
  background: var(--cl-accent-soft);
  border: 1px solid var(--cl-accent-soft-strong);
}

.credit__gift-head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--cl-accent-ink);
  margin-bottom: 0.4rem;
}

.credit__gift-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.88rem;
  color: var(--cl-text-2);
}

.credit__gift-list b {
  color: var(--cl-accent-ink);
}

.credit__gift-note {
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: var(--cl-text-3);
}

.credit__quick {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.credit__chip {
  padding: 0.4rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--cl-border-strong);
  background: var(--cl-surface);
  color: var(--cl-text-2);
  font-weight: 600;
  font-size: 0.88rem;
  transition:
    background-color var(--cl-fast) var(--cl-ease),
    color var(--cl-fast) var(--cl-ease),
    border-color var(--cl-fast) var(--cl-ease);
}

.credit__chip:hover {
  border-color: var(--cl-accent);
  color: var(--cl-accent-ink);
}

.credit__chip.is-active {
  background: var(--cl-accent);
  border-color: var(--cl-accent);
  color: var(--cl-on-accent);
}

.credit__field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.credit__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cl-text-2);
}

.credit__input-wrap {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  padding: 0 1rem;
  border-radius: var(--cl-radius-md);
  border: 1px solid var(--cl-border-strong);
  background: var(--cl-surface);
  transition:
    border-color var(--cl-fast) var(--cl-ease),
    box-shadow var(--cl-fast) var(--cl-ease);
}

.credit__input-wrap:focus-within {
  border-color: var(--cl-accent);
  box-shadow: 0 0 0 3px var(--cl-accent-soft);
}

.credit__input-wrap.is-error {
  border-color: var(--cl-danger);
}

.credit__currency {
  font-size: 1.4rem;
  color: var(--cl-text-3);
}

.credit__input {
  flex: 1;
  min-width: 0;
  height: 3.4rem;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--cl-text);
  font-size: 2rem;
  font-variant-numeric: tabular-nums;
  -moz-appearance: textfield;
  appearance: textfield;
}

.credit__input::-webkit-outer-spin-button,
.credit__input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.credit__unit {
  color: var(--cl-text-3);
  font-size: 0.9rem;
}

.credit__hint {
  font-size: 0.78rem;
  color: var(--cl-text-3);
}

.credit__hint.is-error {
  color: var(--cl-danger-ink);
  font-weight: 600;
}

.credit__amount {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 1.1rem;
  border-radius: var(--cl-radius-md);
  background: var(--cl-surface-2);
  border: 1px solid var(--cl-border);
}

.credit__amount-label {
  font-size: 0.8rem;
  color: var(--cl-text-3);
}

.credit__amount-value {
  font-size: 2.4rem;
  color: var(--cl-text);
  font-variant-numeric: tabular-nums;
}

.credit__amount-bonus {
  font-size: 0.8rem;
  color: var(--cl-success-ink);
  font-weight: 600;
}

.credit__loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--cl-text-3);
  font-size: 0.9rem;
}

.credit__group-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cl-text-2);
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
  border-radius: var(--cl-radius-md);
  border: 1px solid var(--cl-border-strong);
  background: var(--cl-surface);
  transition:
    transform var(--cl-fast) var(--cl-ease),
    border-color var(--cl-fast) var(--cl-ease),
    box-shadow var(--cl-fast) var(--cl-ease);
}

.credit__method:hover:not(:disabled) {
  transform: translateY(-2px);
  border-color: var(--cl-accent);
  box-shadow: var(--cl-shadow-md);
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
  background: var(--cl-success-soft);
  color: var(--cl-success-ink);
  font-size: 1.6rem;
}

.credit__done-title {
  font-size: 1.2rem;
}

.credit__done-text {
  font-size: 0.85rem;
  color: var(--cl-text-3);
  max-width: 24rem;
}
</style>

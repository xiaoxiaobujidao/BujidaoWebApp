<script setup lang="ts" generic="T extends string | number">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'

defineProps<{
  options: { value: T; label: string; icon?: LucideName }[]
  /** 填满容器宽度 */
  block?: boolean
  size?: 'sm' | 'md'
}>()

const model = defineModel<T>({ required: true })
</script>

<template>
  <div
    class="fw-seg"
    :class="[{ 'fw-seg--block': block }, `fw-seg--${size ?? 'md'}`]"
    role="tablist"
  >
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      role="tab"
      class="fw-seg__item"
      :class="{ 'is-active': model === opt.value }"
      :aria-selected="model === opt.value"
      @click="model = opt.value"
    >
      <LucideIcon v-if="opt.icon" :name="opt.icon" class="fw-seg__icon" />
      <span>{{ opt.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.fw-seg {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: var(--radius-md);
  background: var(--btn-plain-bg-hover);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}

.fw-seg::-webkit-scrollbar {
  display: none;
}

.fw-seg--block {
  display: flex;
}

.fw-seg--block .fw-seg__item {
  flex: 1;
}

.fw-seg__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 2.25rem;
  padding: 0 0.9rem;
  border-radius: calc(var(--radius-md) - 0.25rem);
  color: var(--text-2);
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.fw-seg--sm .fw-seg__item {
  min-height: 1.9rem;
  padding: 0 0.7rem;
  font-size: 0.8rem;
}

.fw-seg__item:hover {
  color: var(--primary);
}

.fw-seg__item.is-active {
  background: var(--card-bg);
  color: var(--primary);
  box-shadow: 0 2px 8px -2px rgba(0, 0, 0, 0.12);
}

.fw-seg__icon {
  font-size: 1.05em;
}
</style>

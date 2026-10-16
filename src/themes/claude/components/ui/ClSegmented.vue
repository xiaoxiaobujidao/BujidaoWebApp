<script setup lang="ts" generic="T extends string | number">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'

defineProps<{
  options: { value: T; label: string; icon?: LucideName }[]
  block?: boolean
  size?: 'sm' | 'md'
}>()

const model = defineModel<T>({ required: true })
</script>

<template>
  <div
    class="cl-seg"
    :class="[{ 'cl-seg--block': block }, `cl-seg--${size ?? 'md'}`]"
    role="tablist"
  >
    <button
      v-for="opt in options"
      :key="String(opt.value)"
      type="button"
      role="tab"
      class="cl-seg__item"
      :class="{ 'is-active': model === opt.value }"
      :aria-selected="model === opt.value"
      @click="model = opt.value"
    >
      <LucideIcon v-if="opt.icon" :name="opt.icon" class="cl-seg__icon" />
      <span>{{ opt.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.cl-seg {
  display: inline-flex;
  gap: 0.2rem;
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--cl-surface-3);
  max-width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
}

.cl-seg::-webkit-scrollbar {
  display: none;
}

.cl-seg--block {
  display: flex;
}

.cl-seg--block .cl-seg__item {
  flex: 1;
}

.cl-seg__item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 2.2rem;
  padding: 0 0.95rem;
  border-radius: 999px;
  color: var(--cl-text-2);
  font-size: 0.88rem;
  font-weight: 600;
  white-space: nowrap;
  transition:
    background-color var(--cl-fast) var(--cl-ease),
    color var(--cl-fast) var(--cl-ease),
    box-shadow var(--cl-fast) var(--cl-ease);
}

.cl-seg--sm .cl-seg__item {
  min-height: 1.85rem;
  padding: 0 0.75rem;
  font-size: 0.8rem;
}

.cl-seg__item:hover {
  color: var(--cl-text);
}

.cl-seg__item.is-active {
  background: var(--cl-surface);
  color: var(--cl-text);
  box-shadow: var(--cl-shadow-sm);
}

.cl-seg__icon {
  font-size: 1.05em;
}
</style>

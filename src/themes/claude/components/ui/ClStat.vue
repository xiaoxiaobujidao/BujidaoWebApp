<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'

withDefaults(
  defineProps<{
    label: string
    value: string | number
    unit?: string
    hint?: string
    icon?: LucideName
    tone?: 'accent' | 'neutral' | 'success' | 'warning' | 'danger'
  }>(),
  { tone: 'neutral' },
)
</script>

<template>
  <div class="cl-stat" :class="`cl-stat--${tone}`">
    <div class="cl-stat__top">
      <span class="cl-stat__label">{{ label }}</span>
      <span v-if="icon" class="cl-stat__icon"><LucideIcon :name="icon" /></span>
    </div>
    <div class="cl-stat__value">
      <span class="cl-stat__number cl-serif">{{ value }}</span>
      <span v-if="unit" class="cl-stat__unit">{{ unit }}</span>
    </div>
    <div v-if="hint || $slots.default" class="cl-stat__hint">
      <slot>{{ hint }}</slot>
    </div>
  </div>
</template>

<style scoped>
.cl-stat {
  --stat-color: var(--cl-text);
  --stat-icon-bg: var(--cl-surface-3);
  --stat-icon: var(--cl-text-2);
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.1rem 1.2rem;
  border-radius: var(--cl-radius-lg);
  background: var(--cl-surface);
  border: 1px solid var(--cl-border);
  box-shadow: var(--cl-shadow-sm);
  min-width: 0;
}

.cl-stat--accent {
  --stat-color: var(--cl-accent-ink);
  --stat-icon-bg: var(--cl-accent-soft);
  --stat-icon: var(--cl-accent-ink);
  background: linear-gradient(135deg, var(--cl-accent-soft), transparent 60%), var(--cl-surface);
}

.cl-stat--success {
  --stat-color: var(--cl-success-ink);
  --stat-icon-bg: var(--cl-success-soft);
  --stat-icon: var(--cl-success-ink);
}

.cl-stat--warning {
  --stat-color: var(--cl-warning-ink);
  --stat-icon-bg: var(--cl-warning-soft);
  --stat-icon: var(--cl-warning-ink);
}

.cl-stat--danger {
  --stat-color: var(--cl-danger-ink);
  --stat-icon-bg: var(--cl-danger-soft);
  --stat-icon: var(--cl-danger-ink);
}

.cl-stat__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.cl-stat__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--cl-text-2);
}

.cl-stat__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 0.6rem;
  background: var(--stat-icon-bg);
  color: var(--stat-icon);
  font-size: 1rem;
}

.cl-stat__value {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  color: var(--stat-color);
}

.cl-stat__number {
  font-size: 1.85rem;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  word-break: break-all;
}

.cl-stat__unit {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cl-text-2);
}

.cl-stat__hint {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.2rem;
  font-size: 0.78rem;
  color: var(--cl-text-3);
}
</style>

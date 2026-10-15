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
    tone?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger'
  }>(),
  { tone: 'neutral' },
)
</script>

<template>
  <div class="fw-stat" :class="`fw-stat--${tone}`">
    <div class="fw-stat__top">
      <span class="fw-stat__label">{{ label }}</span>
      <span v-if="icon" class="fw-stat__icon"><LucideIcon :name="icon" /></span>
    </div>
    <div class="fw-stat__value">
      <span class="fw-stat__number">{{ value }}</span>
      <span v-if="unit" class="fw-stat__unit">{{ unit }}</span>
    </div>
    <div v-if="hint || $slots.default" class="fw-stat__hint">
      <slot>{{ hint }}</slot>
    </div>
  </div>
</template>

<style scoped>
.fw-stat {
  --stat-color: var(--text-1);
  --stat-soft: var(--btn-plain-bg-hover);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.1rem;
  border-radius: var(--radius-md);
  background: var(--stat-soft);
  min-width: 0;
}

.fw-stat--primary {
  --stat-color: var(--primary-strong);
  --stat-soft: var(--primary-soft);
}

.fw-stat--success {
  --stat-color: var(--success);
  --stat-soft: var(--success-soft);
}

.fw-stat--warning {
  --stat-color: oklch(0.55 0.15 70);
  --stat-soft: var(--warning-soft);
}

:root.dark .fw-stat--warning {
  --stat-color: var(--warning);
}

.fw-stat--danger {
  --stat-color: var(--danger);
  --stat-soft: var(--danger-soft);
}

.fw-stat__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.fw-stat__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-2);
}

.fw-stat__icon {
  display: inline-flex;
  color: var(--stat-color);
  opacity: 0.8;
  font-size: 1.1rem;
}

.fw-stat__value {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  color: var(--stat-color);
}

.fw-stat__number {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  word-break: break-all;
}

.fw-stat__unit {
  font-size: 0.85rem;
  font-weight: 600;
  opacity: 0.8;
}

.fw-stat__hint {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.78rem;
  color: var(--text-3);
}
</style>

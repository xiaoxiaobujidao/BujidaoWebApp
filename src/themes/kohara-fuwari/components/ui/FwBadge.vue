<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger'
    /** 带圆点 */
    dot?: boolean
  }>(),
  { tone: 'neutral', dot: false },
)
</script>

<template>
  <span class="fw-badge" :class="`fw-badge--${tone}`">
    <i v-if="dot" class="fw-badge__dot" />
    <slot />
  </span>
</template>

<style scoped>
.fw-badge {
  --badge-color: var(--text-2);
  --badge-bg: var(--btn-plain-bg-hover);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--badge-bg);
  color: var(--badge-color);
  font-size: 0.75rem;
  font-weight: 600;
  line-height: 1.6;
  white-space: nowrap;
}

.fw-badge--primary {
  --badge-color: var(--primary-strong);
  --badge-bg: var(--primary-soft);
}

.fw-badge--success {
  --badge-color: var(--success);
  --badge-bg: var(--success-soft);
}

.fw-badge--warning {
  --badge-color: oklch(0.5 0.14 70);
  --badge-bg: var(--warning-soft);
}

:root.dark .fw-badge--warning {
  --badge-color: var(--warning);
}

.fw-badge--danger {
  --badge-color: var(--danger);
  --badge-bg: var(--danger-soft);
}

.fw-badge__dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: currentColor;
}
</style>

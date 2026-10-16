<script setup lang="ts">
withDefaults(
  defineProps<{
    tone?: 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info'
    dot?: boolean
  }>(),
  { tone: 'neutral', dot: false },
)
</script>

<template>
  <span class="cl-badge" :class="`cl-badge--${tone}`">
    <i v-if="dot" class="cl-badge__dot" />
    <slot />
  </span>
</template>

<style scoped>
.cl-badge {
  --badge-color: var(--cl-text-2);
  --badge-bg: var(--cl-surface-3);
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.12rem 0.6rem;
  border-radius: 999px;
  background: var(--badge-bg);
  color: var(--badge-color);
  font-size: 0.74rem;
  font-weight: 600;
  line-height: 1.7;
  white-space: nowrap;
}

.cl-badge--accent {
  --badge-color: var(--cl-accent-ink);
  --badge-bg: var(--cl-accent-soft);
}

.cl-badge--success {
  --badge-color: var(--cl-success-ink);
  --badge-bg: var(--cl-success-soft);
}

.cl-badge--warning {
  --badge-color: var(--cl-warning-ink);
  --badge-bg: var(--cl-warning-soft);
}

.cl-badge--danger {
  --badge-color: var(--cl-danger-ink);
  --badge-bg: var(--cl-danger-soft);
}

.cl-badge--info {
  --badge-color: #3f6f9b;
  --badge-bg: var(--cl-info-soft);
}

:root.dark .cl-badge--info {
  --badge-color: #9cc3e6;
}

.cl-badge__dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: currentColor;
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'

const props = withDefaults(
  defineProps<{
    variant?: 'regular' | 'plain' | 'primary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    icon?: LucideName
    /** 仅图标的方形按钮 */
    iconOnly?: boolean
    loading?: boolean
    disabled?: boolean
    block?: boolean
    href?: string
    to?: string
    type?: 'button' | 'submit'
  }>(),
  { variant: 'regular', size: 'md', type: 'button' },
)

const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'button'))
const classes = computed(() => [
  'fw-btn',
  `fw-btn--${props.variant}`,
  `fw-btn--${props.size}`,
  { 'fw-btn--block': props.block, 'fw-btn--icon': props.iconOnly, 'is-loading': props.loading },
])
const attrs = computed(() =>
  tag.value === 'button'
    ? { type: props.type, disabled: props.disabled || props.loading }
    : tag.value === 'a'
      ? { href: props.href, target: '_blank', rel: 'noopener' }
      : { to: props.to },
)
</script>

<template>
  <component :is="tag" v-bind="attrs" :class="classes" :aria-busy="loading || undefined">
    <LucideIcon v-if="loading" name="loader" class="spin fw-btn__icon" />
    <LucideIcon v-else-if="icon" :name="icon" class="fw-btn__icon" />
    <span v-if="!iconOnly && $slots.default" class="fw-btn__label"><slot /></span>
  </component>
</template>

<style scoped>
.fw-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  user-select: none;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard),
    opacity var(--duration-fast) var(--ease-standard);
}

.fw-btn:active:not(:disabled) {
  transform: scale(0.96);
}

.fw-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.fw-btn--sm {
  min-height: 2rem;
  padding: 0 0.75rem;
  font-size: 0.82rem;
}

.fw-btn--md {
  min-height: 2.5rem;
  padding: 0 1rem;
  font-size: 0.9rem;
}

.fw-btn--lg {
  min-height: 2.9rem;
  padding: 0 1.35rem;
  font-size: 0.98rem;
}

.fw-btn--icon.fw-btn--sm {
  width: 2rem;
  padding: 0;
}

.fw-btn--icon.fw-btn--md {
  width: 2.5rem;
  padding: 0;
}

.fw-btn--icon.fw-btn--lg {
  width: 2.9rem;
  padding: 0;
}

.fw-btn--block {
  display: flex;
  width: 100%;
}

.fw-btn__icon {
  font-size: 1.1em;
}

/* 淡色底 */
.fw-btn--regular {
  background: var(--btn-regular-bg);
  color: var(--btn-content);
}

.fw-btn--regular:hover:not(:disabled) {
  background: var(--btn-regular-bg-hover);
}

.fw-btn--regular:active:not(:disabled) {
  background: var(--btn-regular-bg-active);
}

/* 无底 */
.fw-btn--plain,
.fw-btn--ghost {
  background: transparent;
  color: var(--text-2);
}

.fw-btn--ghost {
  border: 1px solid var(--line-color);
}

.fw-btn--plain:hover:not(:disabled),
.fw-btn--ghost:hover:not(:disabled) {
  background: var(--btn-plain-bg-hover);
  color: var(--primary);
}

.fw-btn--ghost:hover:not(:disabled) {
  border-color: var(--primary);
}

/* 主色实底 */
.fw-btn--primary {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 6px 16px -8px oklch(0.6 0.14 var(--hue) / 0.7);
}

.fw-btn--primary:hover:not(:disabled) {
  background: oklch(0.65 0.15 var(--hue));
  box-shadow: 0 10px 22px -10px oklch(0.6 0.14 var(--hue) / 0.8);
}

:root.dark .fw-btn--primary {
  color: oklch(0.15 0.02 var(--hue));
}

/* 危险 */
.fw-btn--danger {
  background: var(--danger-soft);
  color: var(--danger);
}

.fw-btn--danger:hover:not(:disabled) {
  background: var(--danger);
  color: #fff;
}
</style>

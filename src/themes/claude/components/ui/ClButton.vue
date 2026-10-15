<script setup lang="ts">
import { computed } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft'
    size?: 'sm' | 'md' | 'lg'
    icon?: LucideName
    iconOnly?: boolean
    loading?: boolean
    disabled?: boolean
    block?: boolean
    href?: string
    to?: string
    type?: 'button' | 'submit'
    /** 圆角：pill（默认）或 md */
    shape?: 'pill' | 'md'
  }>(),
  { variant: 'secondary', size: 'md', type: 'button', shape: 'pill' },
)

const tag = computed(() => (props.to ? 'router-link' : props.href ? 'a' : 'button'))
const attrs = computed(() =>
  tag.value === 'button'
    ? { type: props.type, disabled: props.disabled || props.loading }
    : tag.value === 'a'
      ? { href: props.href, target: '_blank', rel: 'noopener' }
      : { to: props.to },
)
</script>

<template>
  <component
    :is="tag"
    v-bind="attrs"
    class="cl-btn"
    :class="[
      `cl-btn--${variant}`,
      `cl-btn--${size}`,
      `cl-btn--shape-${shape}`,
      { 'cl-btn--block': block, 'cl-btn--icon': iconOnly, 'is-loading': loading },
    ]"
    :aria-busy="loading || undefined"
  >
    <LucideIcon v-if="loading" name="loader" class="spin cl-btn__icon" />
    <LucideIcon v-else-if="icon" :name="icon" class="cl-btn__icon" />
    <span v-if="!iconOnly && $slots.default" class="cl-btn__label"><slot /></span>
  </component>
</template>

<style scoped>
.cl-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  font-weight: 600;
  white-space: nowrap;
  text-decoration: none;
  user-select: none;
  border: 1px solid transparent;
  transition:
    background-color var(--cl-fast) var(--cl-ease),
    color var(--cl-fast) var(--cl-ease),
    border-color var(--cl-fast) var(--cl-ease),
    box-shadow var(--cl-fast) var(--cl-ease),
    transform var(--cl-fast) var(--cl-ease),
    opacity var(--cl-fast) var(--cl-ease);
}

.cl-btn--shape-pill {
  border-radius: 999px;
}

.cl-btn--shape-md {
  border-radius: var(--cl-radius-sm);
}

.cl-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.cl-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cl-btn--sm {
  min-height: 2rem;
  padding: 0 0.8rem;
  font-size: 0.82rem;
}

.cl-btn--md {
  min-height: 2.5rem;
  padding: 0 1.05rem;
  font-size: 0.9rem;
}

.cl-btn--lg {
  min-height: 2.95rem;
  padding: 0 1.4rem;
  font-size: 0.98rem;
}

.cl-btn--icon.cl-btn--sm {
  width: 2rem;
  padding: 0;
}

.cl-btn--icon.cl-btn--md {
  width: 2.5rem;
  padding: 0;
}

.cl-btn--icon.cl-btn--lg {
  width: 2.95rem;
  padding: 0;
}

.cl-btn--block {
  display: flex;
  width: 100%;
}

.cl-btn__icon {
  font-size: 1.1em;
}

/* 陶土色实底 */
.cl-btn--primary {
  background: var(--cl-accent);
  color: var(--cl-on-accent);
  box-shadow: 0 1px 2px rgba(20, 20, 19, 0.12);
}

.cl-btn--primary:hover:not(:disabled) {
  background: var(--cl-accent-hover);
}

/* 描边 */
.cl-btn--secondary {
  background: var(--cl-surface);
  color: var(--cl-text);
  border-color: var(--cl-border-strong);
}

.cl-btn--secondary:hover:not(:disabled) {
  background: var(--cl-surface-2);
  border-color: var(--cl-text-3);
}

/* 淡色底 */
.cl-btn--soft {
  background: var(--cl-accent-soft);
  color: var(--cl-accent-ink);
}

.cl-btn--soft:hover:not(:disabled) {
  background: var(--cl-accent-soft-strong);
}

/* 无底 */
.cl-btn--ghost {
  background: transparent;
  color: var(--cl-text-2);
}

.cl-btn--ghost:hover:not(:disabled) {
  background: var(--cl-surface-3);
  color: var(--cl-text);
}

/* 危险 */
.cl-btn--danger {
  background: var(--cl-danger-soft);
  color: var(--cl-danger-ink);
}

.cl-btn--danger:hover:not(:disabled) {
  background: var(--cl-danger);
  color: #fff;
}
</style>

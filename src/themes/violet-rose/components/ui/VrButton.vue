<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'danger' | 'text'
    size?: 'sm' | 'md'
    disabled?: boolean
    type?: 'button' | 'submit'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    class="vr-btn"
    :class="[`vr-btn--${variant}`, `vr-btn--${size}`]"
    :type="type"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.vr-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border-radius: 999px;
  font-weight: 500;
  white-space: nowrap;
  transition:
    transform 0.2s,
    opacity 0.2s,
    box-shadow 0.2s;
}

.vr-btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.vr-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.vr-btn--md {
  padding: 0.6rem 1.1rem;
  font-size: 0.9rem;
}

.vr-btn--sm {
  padding: 0.4rem 0.85rem;
  font-size: 0.82rem;
}

.vr-btn--primary {
  color: #fff;
  background: linear-gradient(135deg, var(--color-accent-deep), var(--color-accent-light));
  box-shadow: var(--shadow-soft);
}

.vr-btn--ghost {
  color: var(--color-accent-deep);
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid var(--color-surface-border);
}

.vr-btn--danger {
  color: #fff;
  background: linear-gradient(135deg, #c62828, #ef5350);
}

.vr-btn--text {
  padding-inline: 0.5rem;
  color: var(--color-accent-deep);
  background: transparent;
}
</style>

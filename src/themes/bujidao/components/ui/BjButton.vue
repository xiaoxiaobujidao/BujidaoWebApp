<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    loading?: boolean
    block?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    block: false,
    type: 'button',
  },
)
</script>

<template>
  <button
    class="bj-btn"
    :class="[
      `bj-btn--${variant}`,
      `bj-btn--${size}`,
      { 'bj-btn--block': block, 'bj-btn--loading': loading },
    ]"
    :type="type"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="bj-btn__spinner" aria-hidden="true" />
    <span class="bj-btn__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.bj-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin: 0;
  border: 1px solid transparent;
  border-radius: 999px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transition:
    transform 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease,
    box-shadow 0.18s ease,
    opacity 0.18s ease;
}

:where(.bj-btn + .bj-btn):not(.bj-btn--block) {
  margin-inline-start: 0.5rem;
}

.bj-btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.bj-btn:not(:disabled):active {
  transform: translateY(0);
}

.bj-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.bj-btn--block {
  width: 100%;
}

.bj-btn--sm {
  padding: 0.35rem 0.85rem;
  font-size: 0.8rem;
}

.bj-btn--md {
  padding: 0.55rem 1.15rem;
  font-size: 0.9rem;
}

.bj-btn--lg {
  padding: 0.75rem 1.4rem;
  font-size: 1rem;
}

.bj-btn--primary {
  color: #fff;
  background: var(--color-ocean);
  border-color: var(--color-ocean);
  box-shadow: 0 4px 14px var(--color-ocean-glow);
}

.bj-btn--primary:not(:disabled):hover {
  background: var(--color-ocean-deep);
  border-color: var(--color-ocean-deep);
}

.bj-btn--ghost {
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.55);
  border-color: var(--color-surface-border);
}

.dark .bj-btn--ghost {
  background: rgba(255, 255, 255, 0.06);
}

.bj-btn--ghost:not(:disabled):hover {
  border-color: var(--color-ocean);
  box-shadow: var(--shadow-card);
}

.bj-btn--danger {
  color: #fff;
  background: linear-gradient(135deg, #e07050, var(--color-coral));
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(255, 154, 118, 0.35);
}

.bj-btn--danger:not(:disabled):hover {
  filter: brightness(1.05);
}

.bj-btn__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35em;
}

.bj-btn__spinner {
  width: 1em;
  height: 1em;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: bj-btn-spin 0.7s linear infinite;
}

@keyframes bj-btn-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>

<script setup lang="ts">
defineProps<{
  label?: string
  description?: string
  disabled?: boolean
}>()

const model = defineModel<boolean>({ required: true })
const emit = defineEmits<{ change: [value: boolean] }>()

function toggle() {
  model.value = !model.value
  emit('change', model.value)
}
</script>

<template>
  <label class="fw-switch" :class="{ 'is-on': model, 'is-disabled': disabled }">
    <button
      type="button"
      role="switch"
      class="fw-switch__track"
      :aria-checked="model"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="fw-switch__thumb" />
    </button>
    <span v-if="label || description" class="fw-switch__text">
      <span v-if="label" class="fw-switch__label">{{ label }}</span>
      <span v-if="description" class="fw-switch__desc">{{ description }}</span>
    </span>
  </label>
</template>

<style scoped>
.fw-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
}

.fw-switch.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fw-switch__track {
  position: relative;
  width: 2.6rem;
  height: 1.5rem;
  border-radius: 999px;
  background: oklch(0.82 0.01 var(--hue));
  transition: background-color var(--duration-fast) var(--ease-standard);
  flex-shrink: 0;
}

:root.dark .fw-switch__track {
  background: oklch(0.4 0.02 var(--hue));
}

.is-on .fw-switch__track {
  background: var(--primary);
}

.fw-switch__thumb {
  position: absolute;
  top: 0.2rem;
  left: 0.2rem;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  transition: transform var(--duration-fast) var(--ease-standard);
}

.is-on .fw-switch__thumb {
  transform: translateX(1.1rem);
}

.fw-switch__text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.fw-switch__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-1);
}

.fw-switch__desc {
  font-size: 0.78rem;
  color: var(--text-3);
}
</style>

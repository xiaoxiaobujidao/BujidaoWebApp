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
  <label class="cl-switch" :class="{ 'is-on': model, 'is-disabled': disabled }">
    <button
      type="button"
      role="switch"
      class="cl-switch__track"
      :aria-checked="model"
      :disabled="disabled"
      @click="toggle"
    >
      <span class="cl-switch__thumb" />
    </button>
    <span v-if="label || description" class="cl-switch__text">
      <span v-if="label" class="cl-switch__label">{{ label }}</span>
      <span v-if="description" class="cl-switch__desc">{{ description }}</span>
    </span>
  </label>
</template>

<style scoped>
.cl-switch {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
}

.cl-switch.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cl-switch__track {
  position: relative;
  width: 2.6rem;
  height: 1.5rem;
  border-radius: 999px;
  background: var(--cl-cloud-light);
  transition: background-color var(--cl-fast) var(--cl-ease);
  flex-shrink: 0;
}

:root.dark .cl-switch__track {
  background: var(--cl-surface-3);
}

.is-on .cl-switch__track {
  background: var(--cl-accent);
}

.cl-switch__thumb {
  position: absolute;
  top: 0.2rem;
  left: 0.2rem;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(20, 20, 19, 0.3);
  transition: transform var(--cl-fast) var(--cl-ease);
}

.is-on .cl-switch__thumb {
  transform: translateX(1.1rem);
}

.cl-switch__text {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.cl-switch__label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--cl-text);
}

.cl-switch__desc {
  font-size: 0.78rem;
  color: var(--cl-text-3);
}
</style>

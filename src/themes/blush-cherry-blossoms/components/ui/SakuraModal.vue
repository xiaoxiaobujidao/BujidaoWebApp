<script setup lang="ts">
defineProps<{
  title?: string
  modelValue: boolean
  wide?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal" :class="{ 'modal--wide': wide }" role="dialog" aria-modal="true">
          <header class="modal__header">
            <h3 v-if="title" class="modal__title">{{ title }}</h3>
            <button class="modal__close" type="button" aria-label="关闭" @click="close">×</button>
          </header>
          <div class="modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(244, 143, 177, 0.3);
  backdrop-filter: blur(4px);
}

.modal {
  width: 100%;
  max-width: 420px;
  max-height: 90dvh;
  overflow: auto;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.modal--wide {
  max-width: 640px;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-surface-border);
}

.modal__title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.modal__close {
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
}

.modal__close:hover {
  background: rgba(244, 143, 177, 0.15);
}

.modal__body {
  padding: 1.25rem;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 0 1.25rem 1.25rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal,
.modal-leave-active .modal {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: translateY(12px) scale(0.98);
}
</style>

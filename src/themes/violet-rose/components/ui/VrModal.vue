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
        <div
          class="modal"
          :class="{ 'modal--wide': wide }"
          data-theme="rose"
          role="dialog"
          aria-modal="true"
        >
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
  background: rgba(45, 10, 80, 0.58);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.modal {
  --color-text-primary: #1f0d38;
  --color-text-secondary: #4a2870;
  --color-accent: #9c27b0;
  --color-accent-deep: #6a1b9a;
  --color-accent-light: #ce93d8;
  --color-surface-border: rgba(106, 27, 162, 0.28);
  --shadow-soft: 0 4px 16px rgba(123, 31, 162, 0.18);
  width: 100%;
  max-width: 420px;
  max-height: 90dvh;
  overflow: auto;
  background: #ffffff;
  color: #1f0d38;
  border: 1px solid rgba(171, 71, 188, 0.35);
  border-radius: var(--radius-lg);
  box-shadow: 0 12px 40px rgba(74, 20, 140, 0.28);
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
  border-bottom: 1px solid rgba(171, 71, 188, 0.25);
  background: #fff;
}

.modal__title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #1f0d38;
}

.modal__close {
  width: 32px;
  height: 32px;
  font-size: 1.5rem;
  line-height: 1;
  color: #4a2870;
  border-radius: var(--radius-md);
}

.modal__close:hover {
  background: rgba(171, 71, 188, 0.12);
}

.modal__body {
  padding: 1.25rem;
  color: #1f0d38;
}

.modal__body :deep(p),
.modal__body :deep(span),
.modal__body :deep(label),
.modal__body :deep(li),
.modal__body :deep(dt),
.modal__body :deep(dd),
.modal__body :deep(pre),
.modal__body :deep(strong) {
  color: inherit;
}

.modal__body :deep(.credit__hint),
.modal__body :deep(.credit__field),
.modal__body :deep(.credit__gift-item),
.modal__body :deep(.form__field),
.modal__body :deep(.opt-in-text),
.modal__body :deep(.connect__qr-hint) {
  color: #4a2870;
}

.modal__body :deep(.credit__gift-title),
.modal__body :deep(.credit__group-name),
.modal__body :deep(.credit__done) {
  color: #1f0d38;
}

.modal__body :deep(input),
.modal__body :deep(textarea),
.modal__body :deep(select) {
  color: #1f0d38;
  background: #fafafa;
  border: 1px solid rgba(106, 27, 162, 0.28);
}

.modal__body :deep(input::placeholder),
.modal__body :deep(textarea::placeholder) {
  color: #8a6aa8;
}

.modal__body :deep(pre) {
  background: #f5f0fa;
}

.modal__body :deep(.traffic__tab) {
  color: #4a2870;
  background: #f5f0fa;
}

.modal__body :deep(.traffic__tab--active) {
  color: #fff;
  background: #9c27b0;
}

.modal__body :deep(.rich) {
  color: #1f0d38;
  line-height: 1.7;
}

.modal__body :deep(.rich a) {
  color: #6a1b9a;
}

.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 0 1.25rem 1.25rem;
  color: #1f0d38;
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

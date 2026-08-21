<script setup lang="ts">
import { watch, onUnmounted, useId } from 'vue'

const titleId = useId()

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    wide?: boolean
    closeOnOverlay?: boolean
    closeOnEsc?: boolean
  }>(),
  {
    title: '',
    wide: false,
    closeOnOverlay: true,
    closeOnEsc: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

function onOverlayClick() {
  if (props.closeOnOverlay) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.closeOnEsc) close()
}

function lockPage() {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)
}

function unlockPage() {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) lockPage()
    else unlockPage()
  },
)

onUnmounted(unlockPage)
</script>

<template>
  <Teleport to="body">
    <Transition name="bj-modal">
      <div
        v-if="modelValue"
        class="bj-modal-overlay"
        role="presentation"
        @click.self="onOverlayClick"
      >
        <div
          class="bj-modal"
          :class="{ 'bj-modal--wide': wide }"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
        >
          <div class="bj-modal__wave" aria-hidden="true" />
          <header class="bj-modal__header">
            <h3 v-if="title" :id="titleId" class="bj-modal__title">{{ title }}</h3>
            <span v-else class="bj-modal__title-spacer" />
            <button class="bj-modal__close" type="button" aria-label="关闭" @click="close">
              ×
            </button>
          </header>
          <div class="bj-modal__body">
            <slot />
          </div>
          <footer v-if="$slots.footer" class="bj-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.bj-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.1rem;
  background: rgba(19, 66, 100, 0.36);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.dark .bj-modal-overlay {
  background: rgba(4, 12, 22, 0.62);
}

.bj-modal {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 440px;
  max-height: min(86dvh, 720px);
  overflow: hidden;
  color: var(--color-text-primary);
  background: var(--color-surface-solid);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft), var(--shadow-glow);
}

.bj-modal--wide {
  max-width: 620px;
}

.bj-modal__wave {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  pointer-events: none;
  background:
    radial-gradient(ellipse 80% 90% at 88% -10%, rgba(255, 236, 179, 0.45), transparent 58%),
    linear-gradient(180deg, rgba(61, 165, 232, 0.16) 0%, transparent 100%);
}

.bj-modal__header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.85rem;
  padding: 1.05rem 1.2rem 0.85rem;
  border-bottom: 1px solid var(--color-surface-border);
}

.bj-modal__title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--color-ocean-deep);
}

.dark .bj-modal__title {
  color: var(--color-ocean-light);
}

.bj-modal__title-spacer {
  flex: 1;
}

.bj-modal__close {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
  appearance: none;
  border: none;
  border-radius: 50%;
  font-family: inherit;
  font-size: 1.45rem;
  line-height: 1;
  color: var(--color-text-secondary);
  background: transparent;
  cursor: pointer;
  transition:
    background-color 0.18s ease,
    color 0.18s ease;
}

.bj-modal__close:hover,
.bj-modal__close:focus-visible {
  color: var(--color-ocean-deep);
  background: rgba(61, 165, 232, 0.14);
}

.bj-modal__close:focus-visible {
  outline: 2px solid var(--color-ocean);
  outline-offset: 2px;
}

.dark .bj-modal__close:hover,
.dark .bj-modal__close:focus-visible {
  color: var(--color-ocean-light);
}

.bj-modal__body {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 1.15rem 1.25rem 1.05rem;
  -webkit-overflow-scrolling: touch;
}

.bj-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.65rem;
  padding: 0.85rem 1.25rem 1.2rem;
  border-top: 1px solid rgba(61, 165, 232, 0.1);
}

.bj-modal-enter-active,
.bj-modal-leave-active {
  transition: opacity 0.22s ease;
}

.bj-modal-enter-active .bj-modal,
.bj-modal-leave-active .bj-modal {
  transition: transform 0.22s ease;
}

.bj-modal-enter-from,
.bj-modal-leave-to {
  opacity: 0;
}

.bj-modal-enter-from .bj-modal,
.bj-modal-leave-to .bj-modal {
  transform: translateY(14px) scale(0.97);
}

@media (max-width: 767px) {
  .bj-modal-overlay {
    padding: 0.75rem;
  }

  .bj-modal {
    max-height: min(88dvh, 780px);
  }
}
</style>

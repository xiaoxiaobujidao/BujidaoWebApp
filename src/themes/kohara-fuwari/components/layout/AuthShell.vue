<script setup lang="ts">
import { computed } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useColorMode } from '@/composables/useColorMode'
import TelegramImage from '@kohara-fuwari/components/icons/TelegramImage.vue'
import { useHue } from '@kohara-fuwari/composables/useHue'
import { TELEGRAM_GROUP } from './nav'

withDefaults(defineProps<{ wide?: boolean }>(), { wide: false })

const { mode, isDark, cycle } = useColorMode()
useHue()

const modeIcon = computed(() =>
  mode.value === 'system' ? 'sun-moon' : isDark.value ? 'moon' : 'sun',
)
</script>

<template>
  <div class="auth">
    <div class="auth__blob auth__blob--a" aria-hidden="true" />
    <div class="auth__blob auth__blob--b" aria-hidden="true" />

    <div class="auth__tools">
      <button
        type="button"
        class="auth__tool card-base"
        aria-label="切换明暗模式"
        @click="cycle($event)"
      >
        <LucideIcon :name="modeIcon" />
      </button>
    </div>

    <div class="auth__center" :class="{ 'auth__center--wide': wide }">
      <slot />
    </div>

    <a
      :href="TELEGRAM_GROUP"
      target="_blank"
      rel="noopener"
      class="auth__help card-base"
      aria-label="加入 Telegram 群组寻求帮助"
      title="遇到问题？加入 Telegram 群组"
    >
      <TelegramImage class="auth__help-icon" />
    </a>
  </div>
</template>

<style scoped>
.auth {
  position: relative;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
  isolation: isolate;
}

.auth__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  z-index: -1;
  pointer-events: none;
}

.auth__blob--a {
  width: 60vw;
  height: 60vw;
  max-width: 48rem;
  max-height: 48rem;
  left: -20vw;
  top: -20vw;
  background: oklch(0.85 0.1 var(--hue));
}

.auth__blob--b {
  width: 50vw;
  height: 50vw;
  max-width: 40rem;
  max-height: 40rem;
  right: -15vw;
  bottom: -15vw;
  background: oklch(0.85 0.1 calc(var(--hue) + 60));
}

:root.dark .auth__blob {
  opacity: 0.35;
}

:root.dark .auth__blob--a {
  background: oklch(0.45 0.12 var(--hue));
}

:root.dark .auth__blob--b {
  background: oklch(0.4 0.12 calc(var(--hue) + 60));
}

.auth__tools {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 5;
}

.auth__tool,
.auth__help {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 999px;
  color: var(--text-2);
  font-size: 1.2rem;
  box-shadow: var(--shadow-float);
  border: 1px solid var(--line-divider);
  transition:
    transform var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.auth__tool:hover,
.auth__help:hover {
  color: var(--primary);
  transform: translateY(-2px);
}

.auth__center {
  width: 100%;
  max-width: 28rem;
}

.auth__center--wide {
  max-width: 62rem;
}

.auth__help {
  position: fixed;
  left: 1rem;
  bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  z-index: 5;
}

.auth__help-icon {
  width: 1.4rem;
  height: 1.4rem;
}

@media (max-width: 767px) {
  .auth {
    align-items: flex-start;
    padding: 4.5rem 0.75rem 5rem;
  }
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useColorMode } from '@/composables/useColorMode'
import { TELEGRAM_GROUP } from './nav'

const { mode, isDark, cycle } = useColorMode()
const modeIcon = computed(() =>
  mode.value === 'system' ? 'sun-moon' : isDark.value ? 'moon' : 'sun',
)
</script>

<template>
  <div class="auth">
    <div class="auth__glow" aria-hidden="true" />

    <button type="button" class="auth__mode" aria-label="切换明暗模式" @click="cycle($event)">
      <LucideIcon :name="modeIcon" />
    </button>

    <div class="auth__center">
      <slot />
    </div>

    <p class="auth__foot">
      遇到问题？到
      <a :href="TELEGRAM_GROUP" target="_blank" rel="noopener" class="cl-link">Telegram 群组</a>
      找岛民们聊聊
    </p>
  </div>
</template>

<style scoped>
.auth {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem 1rem;
  overflow: hidden;
  isolation: isolate;
}

.auth__glow {
  position: absolute;
  top: -30vh;
  left: 50%;
  width: 90vw;
  max-width: 60rem;
  aspect-ratio: 1.3;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(217, 119, 87, 0.22), transparent 60%);
  pointer-events: none;
  z-index: -1;
}

:root.dark .auth__glow {
  background: radial-gradient(ellipse at center, rgba(217, 119, 87, 0.16), transparent 60%);
}

.auth__mode {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: 1px solid var(--cl-border);
  background: var(--cl-surface);
  color: var(--cl-text-2);
  font-size: 1.15rem;
  z-index: 5;
}

.auth__mode:hover {
  color: var(--cl-accent-ink);
  border-color: var(--cl-accent);
}

.auth__center {
  width: 100%;
  max-width: 26rem;
}

.auth__foot {
  font-size: 0.8rem;
  color: var(--cl-text-3);
  text-align: center;
}
</style>

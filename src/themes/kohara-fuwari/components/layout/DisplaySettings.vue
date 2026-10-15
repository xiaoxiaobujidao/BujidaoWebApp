<script setup lang="ts">
import { computed } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useColorMode, type ColorMode } from '@/composables/useColorMode'
import { useThemeStore } from '@/stores/themeStore'
import { useHue } from '@kohara-fuwari/composables/useHue'

const { mode, setMode } = useColorMode()
const { hue, isDefault, reset } = useHue()
const themeStore = useThemeStore()

const modeOptions: { value: ColorMode; label: string; icon: 'sun' | 'moon' | 'sun-moon' }[] = [
  { value: 'light', label: '浅色', icon: 'sun' },
  { value: 'dark', label: '深色', icon: 'moon' },
  { value: 'system', label: '跟随系统', icon: 'sun-moon' },
]

const themes = computed(() => themeStore.availableThemes)
const current = computed(() => themeStore.currentTheme)

function switchSiteTheme(name: string) {
  if (name !== current.value) themeStore.switchTheme(name)
}
</script>

<template>
  <div class="ds">
    <section class="ds__section">
      <div class="ds__head">
        <h3 class="widget-title ds__title">外观</h3>
      </div>
      <div class="ds__modes">
        <button
          v-for="opt in modeOptions"
          :key="opt.value"
          type="button"
          class="btn-plain scale-animation ds__mode"
          :class="{ 'current-theme-btn': mode === opt.value }"
          @click="setMode(opt.value, { event: $event })"
        >
          <LucideIcon :name="opt.icon" />
          <span>{{ opt.label }}</span>
        </button>
      </div>
    </section>

    <section class="ds__section">
      <div class="ds__head">
        <h3 class="widget-title ds__title">
          主题色
          <button
            type="button"
            class="btn-regular ds__reset"
            :class="{ 'is-hidden': isDefault }"
            aria-label="恢复默认主题色"
            title="恢复默认"
            @click="reset"
          >
            <LucideIcon name="rotate-ccw" />
          </button>
        </h3>
        <span class="ds__hue-value">{{ hue }}</span>
      </div>
      <div class="ds__slider-wrap">
        <input
          v-model.number="hue"
          type="range"
          min="0"
          max="360"
          step="5"
          class="ds__slider"
          aria-label="主题色相"
        />
      </div>
    </section>

    <section v-if="themes.length > 1" class="ds__section">
      <div class="ds__head">
        <h3 class="widget-title ds__title">站点主题</h3>
        <span class="ds__hint">切换后会刷新页面</span>
      </div>
      <div class="ds__themes">
        <button
          v-for="name in themes"
          :key="name"
          type="button"
          class="btn-plain ds__theme"
          :class="{ 'current-theme-btn': name === current }"
          @click="switchSiteTheme(name)"
        >
          <span class="ds__theme-name">{{ name }}</span>
          <LucideIcon v-if="name === current" name="check" />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ds {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.ds__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.ds__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.ds__reset {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 0.4rem;
  font-size: 0.8rem;
  transition:
    opacity var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.ds__reset.is-hidden {
  opacity: 0;
  pointer-events: none;
}

.ds__hue-value {
  min-width: 2.5rem;
  height: 1.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.4rem;
  background: var(--btn-regular-bg);
  color: var(--btn-content);
  font-weight: 700;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

.ds__hint {
  font-size: 0.75rem;
  color: var(--text-3);
}

.ds__modes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.35rem;
}

.ds__mode {
  flex-direction: column;
  gap: 0.3rem;
  padding: 0.6rem 0.25rem;
  font-size: 0.78rem;
  font-weight: 600;
}

.ds__mode :deep(.lucide) {
  font-size: 1.25rem;
}

.ds__slider-wrap {
  height: 1.5rem;
  padding: 0 0.25rem;
  border-radius: 0.4rem;
  background: var(--color-selection-bar);
  user-select: none;
}

.ds__slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 1.5rem;
  background: transparent;
  margin: 0;
  cursor: pointer;
}

.ds__slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0.5rem;
  height: 1rem;
  border-radius: 0.125rem;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
}

.ds__slider::-moz-range-thumb {
  width: 0.5rem;
  height: 1rem;
  border: 0;
  border-radius: 0.125rem;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.15);
}

.ds__themes {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.ds__theme {
  justify-content: space-between;
  width: 100%;
  min-height: 2.25rem;
  padding: 0 0.75rem;
  font-weight: 600;
  font-size: 0.88rem;
}

.ds__theme-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>

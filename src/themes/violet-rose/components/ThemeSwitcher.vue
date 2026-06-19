<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const showMenu = ref(false)

const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const position = ref({ x: 0, y: 0 })
const hasMoved = ref(false)
const justDragged = ref(false)
const switcherRef = ref<HTMLElement | null>(null)
const DRAG_THRESHOLD = 5

onMounted(async () => {
  if (themeStore.availableThemes.length === 0) {
    themeStore.scanAvailableThemes()
  }
  await nextTick()
  setDefaultPosition()
  window.addEventListener('resize', handleResize)
})

const currentTheme = computed(() => themeStore.currentTheme)

const otherThemes = computed(() => {
  return themeStore.availableThemes.filter((theme) => theme !== currentTheme.value)
})

const hasMultipleThemes = computed(() => {
  return themeStore.availableThemes.length > 1
})

async function switchToTheme(themeName: string, event?: MouseEvent) {
  if (justDragged.value) {
    event?.preventDefault()
    event?.stopPropagation()
    return
  }

  if (themeName !== currentTheme.value) {
    await themeStore.switchTheme(themeName)
    showMenu.value = false
  }
}

function setDefaultPosition() {
  if (!switcherRef.value) {
    position.value = {
      x: window.innerWidth - 200,
      y: window.innerHeight - 200,
    }
    return
  }

  const rect = switcherRef.value.getBoundingClientRect()
  const rightOffset = window.innerWidth * 0.02
  const bottomOffset = window.innerHeight * 0.08

  position.value = {
    x: window.innerWidth - rect.width - rightOffset,
    y: window.innerHeight - rect.height - bottomOffset,
  }
}

function getEventCoordinates(event: MouseEvent | TouchEvent): { x: number; y: number } {
  if ('touches' in event && event.touches.length > 0 && event.touches[0]) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    }
  } else if ('clientX' in event) {
    return {
      x: event.clientX,
      y: event.clientY,
    }
  }
  return { x: 0, y: 0 }
}

function handleStart(event: MouseEvent | TouchEvent) {
  const target = event.target as HTMLElement
  if (target.closest('.theme-menu')) {
    return
  }

  isDragging.value = true
  hasMoved.value = false
  const coords = getEventCoordinates(event)
  dragStart.value = {
    x: coords.x - position.value.x,
    y: coords.y - position.value.y,
  }

  event.preventDefault()
}

function handleMove(event: MouseEvent | TouchEvent) {
  if (!isDragging.value) return

  const coords = getEventCoordinates(event)
  const deltaX = coords.x - dragStart.value.x - position.value.x
  const deltaY = coords.y - dragStart.value.y - position.value.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  if (distance > DRAG_THRESHOLD) {
    hasMoved.value = true
  }

  const newX = coords.x - dragStart.value.x
  const newY = coords.y - dragStart.value.y

  const rect = switcherRef.value?.getBoundingClientRect()
  const width = rect?.width || 200
  const height = rect?.height || 100
  const halfWidth = width / 2
  const halfHeight = height / 2

  const centerX = newX + halfWidth
  const centerY = newY + halfHeight

  const finalCenterX = Math.max(0, Math.min(centerX, window.innerWidth))
  const finalCenterY = Math.max(0, Math.min(centerY, window.innerHeight))

  position.value = {
    x: finalCenterX - halfWidth,
    y: finalCenterY - halfHeight,
  }

  event.preventDefault()
}

function handleResize() {
  if (!switcherRef.value) return

  const rect = switcherRef.value.getBoundingClientRect()
  const halfWidth = rect.width / 2
  const halfHeight = rect.height / 2

  const centerX = position.value.x + halfWidth
  const centerY = position.value.y + halfHeight

  const finalCenterX = Math.max(0, Math.min(centerX, window.innerWidth))
  const finalCenterY = Math.max(0, Math.min(centerY, window.innerHeight))

  position.value = {
    x: finalCenterX - halfWidth,
    y: finalCenterY - halfHeight,
  }
}

function handleEnd(event: MouseEvent | TouchEvent) {
  if (!isDragging.value) return

  isDragging.value = false
  justDragged.value = hasMoved.value

  if (hasMoved.value) {
    setTimeout(() => {
      justDragged.value = false
    }, 0)
  } else if (hasMultipleThemes.value) {
    showMenu.value = !showMenu.value
  }

  hasMoved.value = false
  event.preventDefault()
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-switcher')) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  document.addEventListener('touchmove', handleMove, { passive: false })
  document.addEventListener('touchend', handleEnd, { passive: false })
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('mousemove', handleMove)
  document.removeEventListener('mouseup', handleEnd)
  document.removeEventListener('touchmove', handleMove)
  document.removeEventListener('touchend', handleEnd)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    ref="switcherRef"
    class="theme-switcher"
    :class="{ dragging: isDragging }"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
      right: 'auto',
      bottom: 'auto',
    }"
    @mousedown="handleStart"
    @touchstart="handleStart"
  >
    <div class="theme-button" :class="{ disabled: !hasMultipleThemes }">
      <span class="theme-emoji" aria-hidden="true">🥀</span>
      <svg viewBox="0 0 24 24" class="theme-icon" aria-hidden="true">
        <path
          d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5 11 5.67 11 6.5 10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5 16 5.67 16 6.5 15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9 19 9.67 19 10.5 18.33 12 17.5 12z"
        />
      </svg>
      <span class="theme-label">{{ currentTheme }}</span>
    </div>

    <div v-if="showMenu && otherThemes.length > 0" class="theme-menu">
      <div
        v-for="theme in otherThemes"
        :key="theme"
        class="theme-menu-item"
        @click="switchToTheme(theme, $event)"
        @mousedown.stop
        @touchstart.stop
      >
        {{ theme }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-switcher {
  position: fixed;
  z-index: 99;
  user-select: none;
  touch-action: none;
}

.theme-switcher.dragging {
  cursor: grabbing;
}

.theme-switcher.dragging .theme-button {
  cursor: grabbing;
}

.theme-button {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.65rem 1rem;
  background: var(--color-surface, rgba(255, 255, 255, 0.68));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-surface-border, rgba(171, 71, 188, 0.4));
  border-radius: 999px;
  cursor: grab;
  box-shadow: var(--shadow-soft, 0 8px 32px rgba(123, 31, 162, 0.22));
  transition: transform 0.2s, box-shadow 0.2s;
}

.theme-button:active {
  cursor: grabbing;
}

.theme-button:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 36px rgba(123, 31, 162, 0.32);
}

.theme-switcher.dragging .theme-button:hover {
  transform: none;
}

.theme-button.disabled {
  cursor: default;
  opacity: 0.6;
}

.theme-emoji {
  font-size: 1rem;
  line-height: 1;
}

.theme-icon {
  width: 18px;
  height: 18px;
  fill: var(--color-accent-deep, #7b1fa2);
}

.theme-label {
  display: none;
  font-size: 0.85rem;
  color: var(--color-text-secondary, #6a1b9a);
  font-weight: 500;
}

.theme-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background: var(--color-surface, rgba(255, 255, 255, 0.68));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-surface-border, rgba(171, 71, 188, 0.4));
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft, 0 8px 32px rgba(123, 31, 162, 0.22));
  min-width: 132px;
  overflow: hidden;
}

.theme-menu-item {
  padding: 0.7rem 1rem;
  cursor: pointer;
  color: var(--color-text-primary, #4a148c);
  transition: background-color 0.2s;
  white-space: nowrap;
  font-size: 0.85rem;
}

.theme-menu-item:hover {
  background: rgba(171, 71, 188, 0.18);
}

@media (min-width: 577px) {
  .theme-label {
    display: inline;
  }
}

@media (max-width: 576px) {
  .theme-button {
    width: 44px;
    height: 44px;
    padding: 0;
    justify-content: center;
  }

  .theme-label {
    display: none;
  }

  .theme-menu {
    right: -8px;
  }
}
</style>

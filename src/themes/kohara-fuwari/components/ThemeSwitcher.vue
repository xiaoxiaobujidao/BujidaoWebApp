<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useScreenStore } from '@kohara-fuwari/stores/screenStore'
const screenStore = useScreenStore()
const width = computed(() => screenStore.width)
import { useThemeStore } from '@/stores/themeStore'

const themeStore = useThemeStore()
const showMenu = ref(false)

// 拖拽相关状态
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const position = ref({ x: 0, y: 0 })
const hasMoved = ref(false)
const justDragged = ref(false) // 标记是否刚刚进行了拖拽
const switcherRef = ref<HTMLElement | null>(null)
const DRAG_THRESHOLD = 5 // 拖拽阈值，超过此距离才认为是拖拽

// 确保主题列表已扫描
onMounted(async () => {
  if (themeStore.availableThemes.length === 0) {
    themeStore.scanAvailableThemes()
  }
  // 等待 DOM 渲染后设置默认位置
  await nextTick()
  setDefaultPosition()
  // 监听窗口大小变化，调整位置
  window.addEventListener('resize', handleResize)
})

// 当前主题名称
const currentTheme = computed(() => themeStore.currentTheme)

// 可用主题列表（排除当前主题）
const otherThemes = computed(() => {
  return themeStore.availableThemes.filter((theme) => theme !== currentTheme.value)
})

// 是否有多个主题
const hasMultipleThemes = computed(() => {
  return themeStore.availableThemes.length > 1
})

// 切换主题
async function switchToTheme(themeName: string, event?: MouseEvent) {
  // 如果刚刚进行了拖拽，不处理点击
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

// 设置默认位置（右下角）
function setDefaultPosition() {
  if (!switcherRef.value) {
    // 如果元素还未渲染，使用估算值
    position.value = {
      x: window.innerWidth - 200,
      y: window.innerHeight - 200,
    }
    return
  }

  const rect = switcherRef.value.getBoundingClientRect()
  const rightOffset = window.innerWidth * 0.02 // 2vh 转换为像素的近似值
  const bottomOffset = window.innerHeight * 0.08 // 8vh 转换为像素的近似值

  position.value = {
    x: window.innerWidth - rect.width - rightOffset,
    y: window.innerHeight - rect.height - bottomOffset,
  }
}

// 获取事件坐标（支持鼠标和触摸）
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

// 处理鼠标/触摸按下
function handleStart(event: MouseEvent | TouchEvent) {
  // 如果点击的是菜单项，不处理拖拽
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

// 处理鼠标/触摸移动
function handleMove(event: MouseEvent | TouchEvent) {
  if (!isDragging.value) return

  const coords = getEventCoordinates(event)
  const deltaX = coords.x - dragStart.value.x - position.value.x
  const deltaY = coords.y - dragStart.value.y - position.value.y
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  // 如果移动距离超过阈值，标记为已移动
  if (distance > DRAG_THRESHOLD) {
    hasMoved.value = true
  }

  // 更新位置
  const newX = coords.x - dragStart.value.x
  const newY = coords.y - dragStart.value.y

  // 限制中心点在视口内（允许中心点到达屏幕边缘）
  const rect = switcherRef.value?.getBoundingClientRect()
  const width = rect?.width || 200
  const height = rect?.height || 100
  const halfWidth = width / 2
  const halfHeight = height / 2

  // 计算中心点位置
  const centerX = newX + halfWidth
  const centerY = newY + halfHeight

  // 允许中心点到达屏幕边缘（0 到 window.innerWidth/Height）
  const finalCenterX = Math.max(0, Math.min(centerX, window.innerWidth))
  const finalCenterY = Math.max(0, Math.min(centerY, window.innerHeight))

  position.value = {
    x: finalCenterX - halfWidth,
    y: finalCenterY - halfHeight,
  }

  event.preventDefault()
}

// 处理窗口大小变化
function handleResize() {
  if (!switcherRef.value) return

  const rect = switcherRef.value.getBoundingClientRect()
  const halfWidth = rect.width / 2
  const halfHeight = rect.height / 2

  // 计算当前中心点位置
  const centerX = position.value.x + halfWidth
  const centerY = position.value.y + halfHeight

  // 允许中心点到达屏幕边缘
  const finalCenterX = Math.max(0, Math.min(centerX, window.innerWidth))
  const finalCenterY = Math.max(0, Math.min(centerY, window.innerHeight))

  position.value = {
    x: finalCenterX - halfWidth,
    y: finalCenterY - halfHeight,
  }
}

// 处理鼠标/触摸释放
function handleEnd(event: MouseEvent | TouchEvent) {
  if (!isDragging.value) return

  isDragging.value = false
  justDragged.value = hasMoved.value

  // 如果移动了，在下一个事件循环中重置标志，避免影响菜单项点击
  if (hasMoved.value) {
    setTimeout(() => {
      justDragged.value = false
    }, 0)
  } else {
    // 如果没有移动，认为是点击，切换菜单（如果允许）
    if (hasMultipleThemes.value) {
      showMenu.value = !showMenu.value
    }
  }

  hasMoved.value = false
  event.preventDefault()
}

// 点击外部关闭菜单
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.theme-switcher')) {
    showMenu.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  // 鼠标事件
  document.addEventListener('mousemove', handleMove)
  document.addEventListener('mouseup', handleEnd)
  // 触摸事件
  document.addEventListener('touchmove', handleMove, { passive: false })
  document.addEventListener('touchend', handleEnd, { passive: false })
})

// 清理事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  // 鼠标事件
  document.removeEventListener('mousemove', handleMove)
  document.removeEventListener('mouseup', handleEnd)
  // 触摸事件
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
      <svg viewBox="0 0 24 24" class="theme-icon">
        <path
          d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5 11 5.67 11 6.5 10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5 16 5.67 16 6.5 15.33 8 14.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S18.67 5 19.5 5 21 5.67 21 6.5 20.33 8 19.5 8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S13.67 12 14.5 12s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3.5-4c.83 0 1.5.67 1.5 1.5S18.33 18 17.5 18 16 17.33 16 16.5 16.67 15 17.5 15z"
        />
      </svg>
      <span class="theme-label" v-if="width > 576">{{ currentTheme }}</span>
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
  /* 防止触摸时的默认行为 */
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
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-radius: 24px;
  cursor: grab;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.theme-button:active {
  cursor: grabbing;
}

.theme-button:hover:not(.disabled) {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.theme-switcher.dragging .theme-button:hover {
  transform: none;
}

.theme-button.disabled {
  cursor: default;
  opacity: 0.6;
}

.theme-icon {
  width: 20px;
  height: 20px;
  fill: var(--el-text-color-regular, #606266);
}

.theme-label {
  font-size: 14px;
  color: var(--el-text-color-regular, #606266);
  font-weight: 500;
}

.theme-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
  background-color: var(--el-bg-color, #fff);
  border: 1px solid var(--el-border-color, #dcdfe6);
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  overflow: hidden;
}

.theme-menu-item {
  padding: 12px 16px;
  cursor: pointer;
  color: var(--el-text-color-regular, #606266);
  transition: background-color 0.2s;
}

.theme-menu-item:hover {
  background-color: var(--el-fill-color-light, #f5f7fa);
}

.theme-menu-item:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.theme-menu-item:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.dark .theme-button,
.dark .theme-menu {
  background-color: var(--el-bg-color, #2e303d);
  border-color: var(--el-border-color, #4c4d4f);
}

.dark .theme-menu-item:hover {
  background-color: var(--el-fill-color-light, #3a3c4a);
}
</style>
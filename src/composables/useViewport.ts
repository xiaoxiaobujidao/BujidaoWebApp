import { computed, onMounted, onUnmounted, ref } from 'vue'

const width = ref(typeof window !== 'undefined' ? window.innerWidth : 1280)
const height = ref(typeof window !== 'undefined' ? window.innerHeight : 800)
let listeners = 0
let timer: ReturnType<typeof setTimeout> | undefined

function update() {
  width.value = window.innerWidth
  height.value = window.innerHeight
}

function onResize() {
  clearTimeout(timer)
  timer = setTimeout(update, 120)
}

/**
 * 响应式视口尺寸（模块级共享，按需挂载 resize 监听）。
 * 断点与各主题 CSS 保持一致：< 768 手机，< 1024 平板。
 */
export function useViewport() {
  onMounted(() => {
    if (listeners++ === 0) {
      update()
      window.addEventListener('resize', onResize, { passive: true })
    }
  })
  onUnmounted(() => {
    if (--listeners === 0) {
      window.removeEventListener('resize', onResize)
    }
  })

  return {
    width,
    height,
    isPhone: computed(() => width.value < 768),
    isTablet: computed(() => width.value >= 768 && width.value < 1024),
    isDesktop: computed(() => width.value >= 1024),
  }
}

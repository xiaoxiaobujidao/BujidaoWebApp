import { computed, ref } from 'vue'

export type ColorMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'app-theme-mode'
const MODES: ColorMode[] = ['light', 'dark', 'system']

// 模块级单例：导航栏、设置面板、登录页共用同一份状态
const mode = ref<ColorMode>('system')
const isDark = ref(false)
let initialized = false

const media =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null

function resolveDark(value: ColorMode) {
  return value === 'system' ? !!media?.matches : value === 'dark'
}

function applyToDocument(value: ColorMode) {
  const dark = resolveDark(value)
  isDark.value = dark
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
}

function readStored(): ColorMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored && (MODES as string[]).includes(stored) ? (stored as ColorMode) : 'system'
  } catch {
    return 'system'
  }
}

interface SetModeOptions {
  /** 触发切换的鼠标事件，用于从点击位置扩散的 View Transition 动画 */
  event?: MouseEvent | null
  /** 是否使用 View Transition 动画（默认开启，受用户“减弱动态效果”设置限制） */
  animate?: boolean
}

function init() {
  if (initialized) return
  initialized = true
  mode.value = readStored()
  applyToDocument(mode.value)
  media?.addEventListener('change', () => {
    if (mode.value === 'system') applyToDocument('system')
  })
}

async function setMode(next: ColorMode, options: SetModeOptions = {}) {
  init()
  if (next === mode.value) return
  mode.value = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // 隐私模式下 localStorage 可能不可用，忽略
  }

  const nextDark = resolveDark(next)
  if (nextDark === isDark.value) {
    applyToDocument(next)
    return
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => { finished: Promise<void> }
  }
  const animate = options.animate !== false && !reduceMotion && !!doc.startViewTransition

  if (!animate) {
    const root = document.documentElement
    root.classList.add('is-theme-transitioning')
    applyToDocument(next)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => root.classList.remove('is-theme-transitioning')),
    )
    return
  }

  const root = document.documentElement
  const x = options.event?.clientX ?? window.innerWidth
  const y = options.event?.clientY ?? 0
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  root.style.setProperty('--vt-x', `${x}px`)
  root.style.setProperty('--vt-y', `${y}px`)
  root.style.setProperty('--vt-r', `${radius}px`)
  root.classList.add('use-view-transition')
  try {
    await doc.startViewTransition!(() => applyToDocument(next)).finished
  } finally {
    root.classList.remove('use-view-transition')
  }
}

function toggle(event?: MouseEvent | null) {
  return setMode(isDark.value ? 'light' : 'dark', { event })
}

function cycle(event?: MouseEvent | null) {
  const index = MODES.indexOf(mode.value)
  const next = MODES[(index + 1) % MODES.length] ?? 'system'
  return setMode(next, { event })
}

/**
 * 浅色 / 深色 / 跟随系统 三态颜色模式。
 * 在 html 上切换 `dark` class（Element Plus 暗色变量亦依赖此 class），并持久化到 localStorage。
 */
export function useColorMode() {
  init()
  return {
    mode,
    isDark,
    modes: MODES,
    label: computed(() =>
      mode.value === 'light' ? '浅色' : mode.value === 'dark' ? '深色' : '跟随系统',
    ),
    setMode,
    toggle,
    cycle,
  }
}

import { computed, ref, watch } from 'vue'

const HUE_KEY = 'fuwari-hue'
export const DEFAULT_HUE = 220

const hue = ref<number>(DEFAULT_HUE)
let initialized = false

function readStored(): number {
  try {
    const raw = localStorage.getItem(HUE_KEY)
    if (raw === null || raw === '') return DEFAULT_HUE
    const stored = Number(raw)
    return Number.isFinite(stored) && stored >= 0 && stored <= 360 ? stored : DEFAULT_HUE
  } catch {
    return DEFAULT_HUE
  }
}

function apply(value: number) {
  document.documentElement.style.setProperty('--hue', String(value))
}

/**
 * 主题色相（0-360），所有颜色由此派生；持久化到 localStorage。
 */
export function useHue() {
  if (!initialized) {
    initialized = true
    hue.value = readStored()
    apply(hue.value)
    watch(hue, (value) => {
      apply(value)
      try {
        localStorage.setItem(HUE_KEY, String(value))
      } catch {
        /* ignore */
      }
    })
  }

  return {
    hue,
    defaultHue: DEFAULT_HUE,
    isDefault: computed(() => hue.value === DEFAULT_HUE),
    reset: () => {
      hue.value = DEFAULT_HUE
    },
  }
}

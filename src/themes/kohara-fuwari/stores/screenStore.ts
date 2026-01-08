import { defineStore } from 'pinia'
import { ref, type Ref, computed, watch } from 'vue'

interface ScreenStore {
  width: Ref<number>
  height: Ref<number>
  updateSize: () => void
  getDeviceType: () => 'phone' | 'tablet' | 'desktop'
}

export const useScreenStore = defineStore('screen', (): ScreenStore => {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  const deviceType = computed(() => {
    if (width.value < 768) {
      return 'phone'
    }
    if (width.value < 1024) {
      return 'tablet'
    }
    return 'desktop'
  })
  watch(deviceType, (newVal) => {
    window.location.reload()
  })

  function updateSize() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }
  function getDeviceType() {
    return deviceType.value
  }

  return {
    width,
    height,
    updateSize,
    getDeviceType,
  }
})
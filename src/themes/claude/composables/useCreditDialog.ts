import { ref } from 'vue'

// 充值弹窗由 AppShell 统一承载
const visible = ref(false)

export function useCreditDialog() {
  return {
    visible,
    open: () => {
      visible.value = true
    },
    close: () => {
      visible.value = false
    },
  }
}

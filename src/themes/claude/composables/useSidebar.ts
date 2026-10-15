import { ref, watch } from 'vue'

const COLLAPSED_KEY = 'claude-sidebar-collapsed'

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

// 桌面端侧栏折叠状态（持久化）与移动端抽屉开关（会话内）
const collapsed = ref(readCollapsed())
const drawerOpen = ref(false)

watch(collapsed, (value) => {
  try {
    localStorage.setItem(COLLAPSED_KEY, value ? '1' : '0')
  } catch {
    /* ignore */
  }
})

export function useSidebar() {
  return {
    collapsed,
    drawerOpen,
    toggleCollapsed: () => {
      collapsed.value = !collapsed.value
    },
    openDrawer: () => {
      drawerOpen.value = true
    },
    closeDrawer: () => {
      drawerOpen.value = false
    },
  }
}

import { computed, ref } from 'vue'
import { useAnnouncementStore } from '@/stores/announcementStore'

/** 会话内只弹出一次置顶公告 */
const PIN_SHOWN_KEY = 'gift_shown'

export function usePinAnnouncement() {
  const announcementStore = useAnnouncementStore()
  const visible = ref(false)

  const pinnedHtml = computed(() => {
    const pinned = (announcementStore.getAnnouncement() ?? [])
      .filter((item) => item.pin)
      .sort((a, b) => b.edit_time - a.edit_time)
    return pinned[0]?.announcement ?? ''
  })

  async function tryShowOnce() {
    if (sessionStorage.getItem(PIN_SHOWN_KEY)) return
    await announcementStore.updateAnnouncement()
    if (!pinnedHtml.value) return
    sessionStorage.setItem(PIN_SHOWN_KEY, 'true')
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  return {
    visible,
    pinnedHtml,
    tryShowOnce,
    close,
  }
}

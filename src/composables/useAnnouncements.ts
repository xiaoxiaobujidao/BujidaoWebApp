import { computed, onMounted, ref } from 'vue'
import { useAnnouncementStore, type Announcement } from '@/stores/announcementStore'
import { formatMicroTime } from '@/utils/format'

/**
 * 公告页通用逻辑：置顶 / 普通公告排序与时间格式化。
 */
export function useAnnouncements() {
  const store = useAnnouncementStore()
  const loading = ref(false)

  const all = computed<Announcement[]>(() => store.getAnnouncement() ?? [])
  const pinned = computed(() =>
    all.value.filter((item) => item.pin).sort((a, b) => b.edit_time - a.edit_time),
  )
  const others = computed(() =>
    all.value.filter((item) => !item.pin).sort((a, b) => b.create_time - a.create_time),
  )
  const isEmpty = computed(() => !loading.value && all.value.length === 0)

  async function refresh() {
    loading.value = true
    try {
      await store.updateAnnouncement()
    } finally {
      loading.value = false
    }
  }

  function createdAt(item: Announcement) {
    return formatMicroTime(item.create_time)
  }

  function editedAt(item: Announcement) {
    return formatMicroTime(item.edit_time)
  }

  /** 公告是否在创建后被修改过（相差超过一分钟才算） */
  function wasEdited(item: Announcement) {
    return item.edit_time - item.create_time > 60_000_000
  }

  onMounted(refresh)

  return { all, pinned, others, loading, isEmpty, refresh, createdAt, editedAt, wasEdited }
}

<script setup lang="ts">
import UserMainView from './UserMainView.vue'
import { computed, onMounted } from 'vue'
import { useAnnouncementStore } from '@/stores/announcementStore'

// 使用公告 store
const announcementStore = useAnnouncementStore()

// 初始化公告数据
onMounted(async () => {
  await announcementStore.updateAnnouncement()
})

// 获取公告列表
const announcement_list = computed(() => {
  return announcementStore.getAnnouncement() || []
})

// 置顶公告列表
const pin_announcement_list = computed(() => {
  return announcement_list.value
    .filter((item) => item.pin)
    .sort((a, b) => b.edit_time - a.edit_time)
})

// 非置顶公告列表
const unpin_announcement_list = computed(() => {
  return announcement_list.value
    .filter((item) => !item.pin)
    .sort((a, b) => b.create_time - a.create_time)
})
</script>

<template>
  <UserMainView>
    <div class="announcement-main">
      <section v-if="pin_announcement_list.length" class="announcement-section">
        <h3>置顶公告</h3>
        <article
          v-for="item in pin_announcement_list"
          :key="item.create_time"
          class="panel announcement"
        >
          <div class="announcement__body" v-html="item.announcement"></div>
          <footer class="announcement__meta">
            <span>创建 {{ new Date(item.create_time / 1000).toLocaleString() }}</span>
            <span>更新 {{ new Date(item.edit_time / 1000).toLocaleString() }}</span>
          </footer>
        </article>
      </section>

      <section class="announcement-section">
        <h3>公告</h3>
        <article
          v-for="item in unpin_announcement_list"
          :key="item.create_time"
          class="panel announcement"
        >
          <div class="announcement__body" v-html="item.announcement"></div>
          <footer class="announcement__meta">
            <span>创建 {{ new Date(item.create_time / 1000).toLocaleString() }}</span>
            <span>更新 {{ new Date(item.edit_time / 1000).toLocaleString() }}</span>
          </footer>
        </article>
      </section>
    </div>
  </UserMainView>
</template>

<style scoped lang="scss">
.announcement-main {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.announcement-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.announcement {
  padding: 1.35rem 1.4rem;
}

.announcement__body :deep(*) {
  line-height: 1.85;
}

.announcement__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.25rem;
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(61, 165, 232, 0.1);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

h3 {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-ocean-deep);
  letter-spacing: 0.04em;
}
</style>

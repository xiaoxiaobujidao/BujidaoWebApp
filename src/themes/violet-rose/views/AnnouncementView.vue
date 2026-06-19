<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAnnouncementStore } from '@/stores/announcementStore'
import DashboardLayout from '@violet-rose/components/layout/DashboardLayout.vue'
import PanelCard from '@violet-rose/components/ui/PanelCard.vue'

const announcementStore = useAnnouncementStore()

onMounted(() => {
  announcementStore.updateAnnouncement()
})

const pinned = computed(() =>
  (announcementStore.getAnnouncement() ?? [])
    .filter((item) => item.pin)
    .sort((a, b) => b.edit_time - a.edit_time),
)

const regular = computed(() =>
  (announcementStore.getAnnouncement() ?? [])
    .filter((item) => !item.pin)
    .sort((a, b) => b.create_time - a.create_time),
)

function formatTime(ts: number) {
  return new Date(ts / 1000).toLocaleString()
}
</script>

<template>
  <DashboardLayout>
    <div class="announce-page">
      <section v-if="pinned.length" class="announce-section">
        <h2 class="section-label">置顶</h2>
        <PanelCard
          v-for="item in pinned"
          :key="'pin-' + item.id"
          class="announce-card announce-card--pin"
        >
          <div class="announce-body" v-html="item.announcement" />
          <footer class="announce-meta">
            <span>创建 {{ formatTime(item.create_time) }}</span>
            <span>更新 {{ formatTime(item.edit_time) }}</span>
          </footer>
        </PanelCard>
      </section>

      <section class="announce-section">
        <h2 class="section-label">全部公告</h2>
        <PanelCard v-for="item in regular" :key="item.id" class="announce-card">
          <div class="announce-body" v-html="item.announcement" />
          <footer class="announce-meta">
            <span>创建 {{ formatTime(item.create_time) }}</span>
            <span>更新 {{ formatTime(item.edit_time) }}</span>
          </footer>
        </PanelCard>
        <p v-if="!pinned.length && !regular.length" class="empty">暂无公告</p>
      </section>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.announce-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  margin-bottom: 0.75rem;
}

.announce-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.announce-card--pin {
  border-color: var(--color-accent);
}

.announce-body :deep(*) {
  line-height: 1.75;
  color: var(--color-text-primary);
}

.announce-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-surface-border);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.empty {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}
</style>

<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useAnnouncements } from '@/composables/useAnnouncements'
import AppShell from '@kohara-fuwari/components/layout/AppShell.vue'
import FwCard from '@kohara-fuwari/components/ui/FwCard.vue'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'
import FwBadge from '@kohara-fuwari/components/ui/FwBadge.vue'
import FwEmpty from '@kohara-fuwari/components/ui/FwEmpty.vue'

const { pinned, others, loading, isEmpty, refresh, createdAt, editedAt, wasEdited } =
  useAnnouncements()
</script>

<template>
  <AppShell>
    <template #actions>
      <FwButton variant="plain" icon="refresh" :loading="loading" @click="refresh">刷新</FwButton>
    </template>

    <FwCard v-if="isEmpty">
      <FwEmpty
        icon="megaphone"
        title="暂时没有公告"
        description="岛上风平浪静，有消息会第一时间在这里发布。"
      />
    </FwCard>

    <FwCard v-else-if="loading && !pinned.length && !others.length">
      <FwEmpty loading />
    </FwCard>

    <template v-else>
      <article v-for="item in pinned" :key="'pin-' + item.id" class="post card-base post--pinned">
        <header class="post__head">
          <FwBadge tone="primary"><LucideIcon name="pin" /> 置顶</FwBadge>
          <time class="post__time" :datetime="String(item.create_time)">{{ createdAt(item) }}</time>
        </header>
        <div class="rich" v-html="item.announcement" />
        <footer v-if="wasEdited(item)" class="post__foot">
          <LucideIcon name="clock" /> 更新于 {{ editedAt(item) }}
        </footer>
      </article>

      <h2 v-if="pinned.length && others.length" class="section-title widget-title">往期公告</h2>

      <article v-for="item in others" :key="item.id" class="post card-base">
        <header class="post__head">
          <time class="post__time" :datetime="String(item.create_time)">
            <LucideIcon name="clock" /> {{ createdAt(item) }}
          </time>
        </header>
        <div class="rich" v-html="item.announcement" />
        <footer v-if="wasEdited(item)" class="post__foot">更新于 {{ editedAt(item) }}</footer>
      </article>
    </template>
  </AppShell>
</template>

<style scoped>
.post {
  padding: 1.25rem 1.5rem 1.35rem;
}

.post--pinned {
  border: 1px solid oklch(0.7 0.14 var(--hue) / 0.35);
  background:
    linear-gradient(135deg, oklch(0.7 0.14 var(--hue) / 0.08), transparent 45%), var(--card-bg);
}

.post__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.post__time {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--text-3);
  font-variant-numeric: tabular-nums;
}

.post__foot {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.9rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--line-divider);
  font-size: 0.75rem;
  color: var(--text-3);
}

.section-title {
  margin: 0.5rem 0 -0.25rem 0.25rem;
  font-size: 1rem;
}

@media (max-width: 767px) {
  .post {
    padding: 1rem;
  }
}
</style>

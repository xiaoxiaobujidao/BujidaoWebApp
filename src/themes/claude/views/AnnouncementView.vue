<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useAnnouncements } from '@/composables/useAnnouncements'
import AppShell from '@claude/components/layout/AppShell.vue'
import ClCard from '@claude/components/ui/ClCard.vue'
import ClButton from '@claude/components/ui/ClButton.vue'
import ClBadge from '@claude/components/ui/ClBadge.vue'
import ClEmpty from '@claude/components/ui/ClEmpty.vue'

const { pinned, others, loading, isEmpty, refresh, createdAt, editedAt, wasEdited } =
  useAnnouncements()
</script>

<template>
  <AppShell>
    <template #actions>
      <ClButton variant="ghost" icon="refresh" :loading="loading" @click="refresh">刷新</ClButton>
    </template>

    <ClCard v-if="isEmpty">
      <ClEmpty
        icon="megaphone"
        title="暂时没有公告"
        description="岛上风平浪静，有消息会第一时间在这里发布。"
      />
    </ClCard>

    <ClCard v-else-if="loading && !pinned.length && !others.length">
      <ClEmpty loading />
    </ClCard>

    <template v-else>
      <article v-for="item in pinned" :key="'pin-' + item.id" class="post post--pinned">
        <header class="post__head">
          <ClBadge tone="accent"><LucideIcon name="pin" /> 置顶</ClBadge>
          <time class="post__time">{{ createdAt(item) }}</time>
        </header>
        <div class="rich" v-html="item.announcement" />
        <footer v-if="wasEdited(item)" class="post__foot">
          <LucideIcon name="clock" /> 更新于 {{ editedAt(item) }}
        </footer>
      </article>

      <h2 v-if="pinned.length && others.length" class="section-title cl-serif">往期公告</h2>

      <article v-for="item in others" :key="item.id" class="post">
        <header class="post__head">
          <time class="post__time"><LucideIcon name="clock" /> {{ createdAt(item) }}</time>
        </header>
        <div class="rich" v-html="item.announcement" />
        <footer v-if="wasEdited(item)" class="post__foot">更新于 {{ editedAt(item) }}</footer>
      </article>
    </template>
  </AppShell>
</template>

<style scoped>
.post {
  padding: 1.35rem 1.5rem;
  background: var(--cl-surface);
  border: 1px solid var(--cl-border);
  border-radius: var(--cl-radius-lg);
  box-shadow: var(--cl-shadow-sm);
}

.post--pinned {
  border-color: var(--cl-accent-soft-strong);
  background: linear-gradient(135deg, var(--cl-accent-soft), transparent 40%), var(--cl-surface);
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
  color: var(--cl-text-3);
  font-variant-numeric: tabular-nums;
}

.post__foot {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.9rem;
  padding-top: 0.75rem;
  border-top: 1px dashed var(--cl-border-strong);
  font-size: 0.75rem;
  color: var(--cl-text-3);
}

.section-title {
  margin: 0.5rem 0 -0.5rem 0.25rem;
  font-size: 1.1rem;
  color: var(--cl-text-2);
}

@media (max-width: 767px) {
  .post {
    padding: 1rem;
  }
}
</style>

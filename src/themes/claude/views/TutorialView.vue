<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'
import { tutorialPlatforms } from '@/utils/tutorialContent'
import AppShell from '@claude/components/layout/AppShell.vue'
import ClCard from '@claude/components/ui/ClCard.vue'
import ClSegmented from '@claude/components/ui/ClSegmented.vue'
import TutorialClientGuide from '@claude/components/tutorial/TutorialClientGuide.vue'

const route = useRoute()
const router = useRouter()

const platformIcons: Record<string, LucideName> = {
  android: 'smartphone',
  ios: 'tablet',
  macos: 'laptop',
  windows: 'monitor',
  config: 'sliders',
}

const platformOptions = tutorialPlatforms.map((p) => ({
  value: p.id,
  label: p.name,
  icon: platformIcons[p.icon],
}))

const initialPlatform = tutorialPlatforms.some((p) => p.id === route.query.platform)
  ? String(route.query.platform)
  : (tutorialPlatforms[0]?.id ?? 'android')
const platformId = ref(initialPlatform)
const platform = computed(
  () => tutorialPlatforms.find((p) => p.id === platformId.value) ?? tutorialPlatforms[0]!,
)
const clientId = ref(platform.value.clients[0]?.id ?? '')
const client = computed(
  () => platform.value.clients.find((c) => c.id === clientId.value) ?? platform.value.clients[0],
)

watch(platformId, (id) => {
  clientId.value = platform.value.clients[0]?.id ?? ''
  router.replace({ query: { ...route.query, platform: id } })
})
</script>

<template>
  <AppShell>
    <ClCard title="选择你的设备" subtitle="先选平台，再选客户端">
      <div class="pick">
        <ClSegmented v-model="platformId" :options="platformOptions" block />
        <div v-if="platform.clients.length > 1" class="clients">
          <button
            v-for="c in platform.clients"
            :key="c.id"
            type="button"
            class="client"
            :class="{ 'is-active': c.id === clientId }"
            @click="clientId = c.id"
          >
            {{ c.name }}
          </button>
        </div>
      </div>
    </ClCard>

    <ClCard
      v-if="client"
      :title="client.name"
      :subtitle="`${platform.name} · ${client.steps.length} 个步骤`"
    >
      <TutorialClientGuide :key="client.id" :client="client" />
    </ClCard>

    <ClCard>
      <div class="help">
        <LucideIcon name="message-circle" />
        <span>
          教程没解决问题？欢迎到
          <a href="https://t.me/bujidaoChat" target="_blank" rel="noopener" class="cl-link"
            >Telegram 群组</a
          >
          提问，岛民们都很热心。
        </span>
      </div>
    </ClCard>
  </AppShell>
</template>

<style scoped>
.pick {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.clients {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.client {
  padding: 0.45rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--cl-border-strong);
  background: var(--cl-surface);
  color: var(--cl-text-2);
  font-weight: 600;
  font-size: 0.88rem;
  transition:
    border-color var(--cl-fast) var(--cl-ease),
    color var(--cl-fast) var(--cl-ease),
    background-color var(--cl-fast) var(--cl-ease);
}

.client:hover {
  color: var(--cl-accent-ink);
  border-color: var(--cl-accent);
}

.client.is-active {
  background: var(--cl-text);
  border-color: var(--cl-text);
  color: var(--cl-bg);
}

.help {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--cl-text-2);
  font-size: 0.9rem;
}

.help :deep(.lucide) {
  color: var(--cl-accent);
  font-size: 1.25rem;
  flex-shrink: 0;
}
</style>

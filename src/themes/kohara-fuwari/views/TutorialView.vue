<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'
import { tutorialPlatforms } from '@/utils/tutorialContent'
import AppShell from '@kohara-fuwari/components/layout/AppShell.vue'
import FwCard from '@kohara-fuwari/components/ui/FwCard.vue'
import FwSegmented from '@kohara-fuwari/components/ui/FwSegmented.vue'
import TutorialClientGuide from '@kohara-fuwari/components/tutorial/TutorialClientGuide.vue'

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
    <FwCard title="选择你的设备" subtitle="先选平台，再选客户端" icon="book">
      <div class="pick">
        <FwSegmented v-model="platformId" :options="platformOptions" block />
        <div v-if="platform.clients.length > 1" class="clients">
          <button
            v-for="c in platform.clients"
            :key="c.id"
            type="button"
            class="client"
            :class="{ 'is-active': c.id === clientId }"
            @click="clientId = c.id"
          >
            <span class="client__dot" />
            {{ c.name }}
          </button>
        </div>
      </div>
    </FwCard>

    <FwCard
      v-if="client"
      :title="client.name"
      :subtitle="`${platform.name} · ${client.steps.length} 个步骤`"
      icon="file-text"
    >
      <TutorialClientGuide :key="client.id" :client="client" />
    </FwCard>

    <FwCard>
      <div class="help">
        <LucideIcon name="message-circle" />
        <span>
          教程没解决问题？欢迎到
          <a href="https://t.me/bujidaoChat" target="_blank" rel="noopener" class="text-primary"
            >Telegram 群组</a
          >
          提问，岛民们都很热心。
        </span>
      </div>
    </FwCard>
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
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  border: 1px solid var(--line-color);
  color: var(--text-2);
  font-weight: 600;
  font-size: 0.88rem;
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.client:hover {
  color: var(--primary);
  border-color: var(--primary);
}

.client.is-active {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary-strong);
}

.client__dot {
  width: 0.45rem;
  height: 0.45rem;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
}

.help {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--text-2);
  font-size: 0.9rem;
}

.help :deep(.lucide) {
  color: var(--primary);
  font-size: 1.25rem;
  flex-shrink: 0;
}
</style>

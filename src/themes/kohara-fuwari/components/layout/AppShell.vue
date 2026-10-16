<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'
import { useUserInfoStore } from '@/stores/userInfoStore'
import NavBar from './NavBar.vue'
import SideProfile from './SideProfile.vue'
import SideNav from './SideNav.vue'
import BottomTabBar from './BottomTabBar.vue'
import { findNav } from './nav'
import FwDialog from '@kohara-fuwari/components/ui/FwDialog.vue'
import AddCredit from '@kohara-fuwari/components/AddCredit.vue'
import AnnouncementModal from '@kohara-fuwari/components/AnnouncementModal.vue'
import { useCreditDialog } from '@kohara-fuwari/composables/useCreditDialog'

const props = defineProps<{
  title?: string
  subtitle?: string
  icon?: LucideName
}>()

const route = useRoute()
const userInfoStore = useUserInfoStore()
const { visible: creditVisible } = useCreditDialog()

const nav = computed(() => findNav(route.path === '/t' ? '/tutorial' : route.path))
const title = computed(() => props.title ?? nav.value?.label ?? '布吉岛')
const subtitle = computed(() => props.subtitle ?? nav.value?.description ?? '')
const icon = computed(() => props.icon ?? nav.value?.icon ?? 'island')

onMounted(() => {
  if (!userInfoStore.getUserInfo()) userInfoStore.updateUserInfo()
})
</script>

<template>
  <div class="shell">
    <NavBar />

    <div class="shell__grid">
      <aside class="shell__side">
        <SideProfile class="onload-animation" />
        <SideNav class="onload-animation" />
      </aside>

      <main class="shell__main">
        <header class="page-head card-base onload-animation">
          <span class="page-head__icon"><LucideIcon :name="icon" /></span>
          <div class="page-head__text">
            <h1 class="page-head__title">{{ title }}</h1>
            <p v-if="subtitle" class="page-head__subtitle">{{ subtitle }}</p>
          </div>
          <div v-if="$slots.actions" class="page-head__actions">
            <slot name="actions" />
          </div>
        </header>

        <div class="shell__content">
          <slot />
        </div>

        <footer class="shell__footer onload-animation">
          <span>© {{ new Date().getFullYear() }} 布吉岛 · 百慕大里的小小布吉岛～</span>
          <span class="shell__footer-sep">·</span>
          <span>kohara-fuwari 主题</span>
        </footer>
      </main>
    </div>

    <BottomTabBar />

    <FwDialog v-model="creditVisible" title="充值" size="md">
      <AddCredit />
    </FwDialog>
    <AnnouncementModal />
  </div>
</template>

<style scoped>
.shell {
  min-height: 100dvh;
  padding-bottom: 5.5rem;
}

.shell__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: var(--page-width);
  margin: 1rem auto 0;
  padding: 0 0.75rem;
}

.shell__side {
  display: none;
  flex-direction: column;
  gap: 1rem;
  align-self: start;
  position: sticky;
  top: calc(var(--navbar-height) + 1rem);
}

.shell__main {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.shell__content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.shell__content > :deep(*) {
  animation: fade-in-up 0.35s var(--ease-standard) both;
}

.shell__content > :deep(*:nth-child(2)) {
  animation-delay: 60ms;
}

.shell__content > :deep(*:nth-child(3)) {
  animation-delay: 120ms;
}

.shell__content > :deep(*:nth-child(4)) {
  animation-delay: 180ms;
}

.shell__content > :deep(*:nth-child(n + 5)) {
  animation-delay: 240ms;
}

/* 页头 */
.page-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  overflow: hidden;
}

.page-head::after {
  content: '';
  position: absolute;
  right: -3rem;
  top: -3rem;
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  background: radial-gradient(circle, oklch(0.8 0.1 var(--hue) / 0.35), transparent 70%);
  pointer-events: none;
}

.page-head__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-md);
  background: var(--primary-soft);
  color: var(--primary-strong);
  font-size: 1.4rem;
  flex-shrink: 0;
}

.page-head__text {
  min-width: 0;
  flex: 1;
}

.page-head__title {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  line-height: 1.25;
}

.page-head__subtitle {
  margin-top: 0.15rem;
  color: var(--text-3);
  font-size: 0.88rem;
}

.page-head__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.shell__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  padding: 1rem 0 0.5rem;
  color: var(--text-3);
  font-size: 0.78rem;
  text-align: center;
}

.shell__footer-sep {
  opacity: 0.6;
}

@media (min-width: 768px) {
  .shell {
    padding-bottom: 2rem;
  }

  .shell__grid {
    padding: 0 1rem;
    margin-top: 1rem;
  }
}

@media (min-width: 1024px) {
  .shell__grid {
    grid-template-columns: 17.5rem minmax(0, 1fr);
  }

  .shell__side {
    display: flex;
  }
}

@media (max-width: 767px) {
  .page-head {
    padding: 0.9rem 1rem;
    gap: 0.65rem;
  }

  .page-head__icon {
    width: 2.4rem;
    height: 2.4rem;
    font-size: 1.15rem;
  }

  .page-head__title {
    font-size: 1.2rem;
  }

  .page-head__subtitle {
    font-size: 0.78rem;
  }

  .page-head__actions :deep(.fw-btn--md) {
    min-height: 2.25rem;
    padding: 0 0.75rem;
    font-size: 0.82rem;
  }
}
</style>

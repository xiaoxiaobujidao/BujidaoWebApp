<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'
import { useColorMode } from '@/composables/useColorMode'
import { useUserInfoStore } from '@/stores/userInfoStore'
import SideBar from './SideBar.vue'
import BottomTabBar from './BottomTabBar.vue'
import { findNav } from './nav'
import ClDialog from '@claude/components/ui/ClDialog.vue'
import AddCredit from '@claude/components/AddCredit.vue'
import AnnouncementModal from '@claude/components/AnnouncementModal.vue'
import { useSidebar } from '@claude/composables/useSidebar'
import { useCreditDialog } from '@claude/composables/useCreditDialog'

const props = defineProps<{
  title?: string
  subtitle?: string
  icon?: LucideName
}>()

const route = useRoute()
const userInfoStore = useUserInfoStore()
const { collapsed, drawerOpen, openDrawer, closeDrawer } = useSidebar()
const { visible: creditVisible } = useCreditDialog()
const { mode, isDark, cycle } = useColorMode()

const nav = computed(() => findNav(route.path === '/t' ? '/tutorial' : route.path))
const title = computed(() => props.title ?? nav.value?.label ?? '布吉岛')
const subtitle = computed(() => props.subtitle ?? nav.value?.description ?? '')
const modeIcon = computed(() =>
  mode.value === 'system' ? 'sun-moon' : isDark.value ? 'moon' : 'sun',
)

watch(
  () => route.path,
  () => closeDrawer(),
)

onMounted(() => {
  if (!userInfoStore.getUserInfo()) userInfoStore.updateUserInfo()
})
</script>

<template>
  <div class="app" :class="{ 'is-collapsed': collapsed }">
    <div class="app__sidebar">
      <SideBar />
    </div>

    <!-- 移动端抽屉 -->
    <Transition name="drawer">
      <div v-if="drawerOpen" class="drawer" @click.self="closeDrawer">
        <div class="drawer__panel">
          <SideBar mode="drawer" />
        </div>
      </div>
    </Transition>

    <div class="app__main">
      <header class="topbar">
        <button type="button" class="topbar__menu" aria-label="打开菜单" @click="openDrawer">
          <LucideIcon name="menu" />
        </button>
        <div class="topbar__title">
          <h1 class="topbar__heading cl-serif">{{ title }}</h1>
          <p v-if="subtitle" class="topbar__subtitle">{{ subtitle }}</p>
        </div>
        <div class="topbar__actions">
          <slot name="actions" />
          <button
            type="button"
            class="topbar__mode"
            aria-label="切换明暗模式"
            :title="mode === 'system' ? '跟随系统' : isDark ? '深色模式' : '浅色模式'"
            @click="cycle($event)"
          >
            <LucideIcon :name="modeIcon" />
          </button>
        </div>
      </header>

      <main class="app__content">
        <slot />
      </main>

      <footer class="app__footer">
        <span>© {{ new Date().getFullYear() }} 布吉岛</span>
        <span class="app__footer-dot">·</span>
        <span>claude 主题</span>
      </footer>
    </div>

    <BottomTabBar />

    <ClDialog v-model="creditVisible" title="充值" size="md">
      <AddCredit />
    </ClDialog>
    <AnnouncementModal />
  </div>
</template>

<style scoped>
.app {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  min-height: 100dvh;
}

.app__sidebar {
  display: none;
  position: sticky;
  top: 0;
  height: 100dvh;
}

.app__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100dvh;
}

/* 顶栏 */
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-height: var(--cl-topbar-height);
  padding: 0.6rem 1rem;
  background: color-mix(in srgb, var(--cl-bg) 85%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--cl-border);
}

.topbar__menu {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--cl-radius-sm);
  color: var(--cl-text-2);
  font-size: 1.25rem;
  flex-shrink: 0;
}

.topbar__menu:hover {
  background: var(--cl-surface-3);
}

.topbar__title {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.topbar__heading {
  font-size: 1.3rem;
  color: var(--cl-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar__subtitle {
  font-size: 0.78rem;
  color: var(--cl-text-3);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.topbar__mode {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  color: var(--cl-text-2);
  font-size: 1.15rem;
  border: 1px solid var(--cl-border);
  background: var(--cl-surface);
  transition:
    color var(--cl-fast) var(--cl-ease),
    border-color var(--cl-fast) var(--cl-ease);
}

.topbar__mode:hover {
  color: var(--cl-accent-ink);
  border-color: var(--cl-accent);
}

/* 内容 */
.app__content {
  flex: 1;
  width: 100%;
  max-width: var(--cl-content-width);
  margin: 0 auto;
  padding: 1.25rem 1rem 6rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.app__content > :deep(*) {
  animation: cl-rise 0.4s var(--cl-ease) both;
}

.app__content > :deep(*:nth-child(2)) {
  animation-delay: 50ms;
}

.app__content > :deep(*:nth-child(3)) {
  animation-delay: 100ms;
}

.app__content > :deep(*:nth-child(n + 4)) {
  animation-delay: 150ms;
}

.app__footer {
  display: flex;
  justify-content: center;
  gap: 0.4rem;
  padding: 0 1rem 6rem;
  font-size: 0.75rem;
  color: var(--cl-text-3);
}

.app__footer-dot {
  opacity: 0.6;
}

/* 抽屉 */
.drawer {
  position: fixed;
  inset: 0;
  z-index: 60;
  background: var(--cl-overlay);
  backdrop-filter: blur(2px);
}

.drawer__panel {
  width: min(var(--cl-sidebar-width), 85vw);
  height: 100%;
  background: var(--cl-sidebar-bg);
  box-shadow: var(--cl-shadow-lg);
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--cl-medium) var(--cl-ease);
}

.drawer-enter-active .drawer__panel,
.drawer-leave-active .drawer__panel {
  transition: transform var(--cl-medium) var(--cl-ease);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from .drawer__panel,
.drawer-leave-to .drawer__panel {
  transform: translateX(-100%);
}

@media (min-width: 768px) {
  .app__content {
    padding: 1.75rem 2rem 3rem;
  }

  .app__footer {
    padding-bottom: 1.5rem;
  }

  .topbar {
    padding: 0.75rem 2rem;
  }

  .topbar__heading {
    font-size: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .app {
    grid-template-columns: var(--cl-sidebar-width) minmax(0, 1fr);
    transition: grid-template-columns var(--cl-medium) var(--cl-ease);
  }

  .app.is-collapsed {
    grid-template-columns: var(--cl-sidebar-rail) minmax(0, 1fr);
  }

  .app__sidebar {
    display: block;
  }

  .topbar__menu,
  .drawer {
    display: none;
  }
}
</style>

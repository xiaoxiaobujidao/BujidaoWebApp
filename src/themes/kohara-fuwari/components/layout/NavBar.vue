<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useColorMode } from '@/composables/useColorMode'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { initialOf } from '@/utils/format'
import DisplaySettings from './DisplaySettings.vue'
import { accountNav, mainNav } from './nav'

type Panel = 'settings' | 'menu' | 'user' | null

const route = useRoute()
const { mode, isDark, cycle } = useColorMode()
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.getUserInfo())

const openPanel = ref<Panel>(null)
const root = ref<HTMLElement | null>(null)

const displayName = computed(() => {
  const info = userInfo.value
  if (!info) return '岛民'
  if (info.email) return info.email.split('@')[0] ?? info.email
  if (info.telegram_id) return `TG ${info.telegram_id}`
  return `岛民 #${info.user_id}`
})
const avatarInitial = computed(() => initialOf(displayName.value))

const modeIcon = computed(() =>
  mode.value === 'system' ? 'sun-moon' : isDark.value ? 'moon' : 'sun',
)

function toggle(panel: Exclude<Panel, null>) {
  openPanel.value = openPanel.value === panel ? null : panel
}

function close() {
  openPanel.value = null
}

function onDocumentClick(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) close()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onKeydown)
})

const isActive = (path: string) =>
  route.path === path || (path === '/tutorial' && route.path === '/t')
</script>

<template>
  <div id="navbar" ref="root" class="navbar onload-animation">
    <div class="navbar__inner card-base">
      <router-link to="/user" class="btn-plain scale-animation navbar__brand" aria-label="回到概览">
        <LucideIcon name="island" class="navbar__brand-icon" />
        <span>布吉岛</span>
      </router-link>

      <nav class="navbar__links" aria-label="主导航">
        <router-link
          v-for="item in mainNav"
          :key="item.path"
          :to="item.path"
          class="btn-plain scale-animation navbar__link"
          :class="{ active: isActive(item.path) }"
          :aria-current="isActive(item.path) ? 'page' : undefined"
        >
          {{ item.label }}
        </router-link>
      </nav>

      <div class="navbar__tools">
        <button
          type="button"
          class="btn-plain scale-animation navbar__tool"
          :class="{ active: openPanel === 'settings' }"
          aria-label="显示设置"
          title="显示设置"
          @click="toggle('settings')"
        >
          <LucideIcon name="palette" />
        </button>

        <button
          type="button"
          class="btn-plain scale-animation navbar__tool"
          aria-label="切换明暗模式"
          :title="mode === 'system' ? '跟随系统' : isDark ? '深色模式' : '浅色模式'"
          @click="cycle($event)"
        >
          <LucideIcon :name="modeIcon" />
        </button>

        <button
          type="button"
          class="btn-plain scale-animation navbar__tool navbar__user"
          :class="{ active: openPanel === 'user' }"
          aria-label="账户菜单"
          @click="toggle('user')"
        >
          <span class="navbar__avatar">{{ avatarInitial }}</span>
        </button>

        <button
          type="button"
          class="btn-plain scale-animation navbar__tool navbar__menu-btn"
          :class="{ active: openPanel === 'menu' }"
          aria-label="菜单"
          @click="toggle('menu')"
        >
          <LucideIcon :name="openPanel === 'menu' ? 'x' : 'menu'" />
        </button>
      </div>

      <!-- 显示设置面板 -->
      <div
        class="float-panel navbar__panel navbar__panel--settings"
        :class="{ 'float-panel-closed': openPanel !== 'settings' }"
      >
        <DisplaySettings />
      </div>

      <!-- 账户面板 -->
      <div
        class="float-panel navbar__panel navbar__panel--user"
        :class="{ 'float-panel-closed': openPanel !== 'user' }"
      >
        <div class="navbar__user-head">
          <span class="navbar__avatar navbar__avatar--lg">{{ avatarInitial }}</span>
          <div class="navbar__user-meta">
            <strong>{{ displayName }}</strong>
            <span v-if="userInfo" class="text-3"
              >余额 ¥{{ (userInfo.balance / 100).toFixed(2) }}</span
            >
          </div>
        </div>
        <div class="navbar__divider" />
        <router-link
          v-for="item in accountNav"
          :key="item.path"
          :to="item.path"
          class="btn-plain scale-animation navbar__panel-item"
          :class="{ 'current-theme-btn': isActive(item.path) }"
          @click="close"
        >
          <LucideIcon :name="item.icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </div>

      <!-- 手机端菜单 -->
      <div
        class="float-panel navbar__panel navbar__panel--menu"
        :class="{ 'float-panel-closed': openPanel !== 'menu' }"
      >
        <router-link
          v-for="item in [...mainNav, ...accountNav]"
          :key="item.path"
          :to="item.path"
          class="btn-plain scale-animation navbar__panel-item"
          :class="{ 'current-theme-btn': isActive(item.path) }"
          @click="close"
        >
          <LucideIcon :name="item.icon" />
          <span>{{ item.label }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  width: 100%;
  max-width: var(--page-width);
  margin: 0 auto;
}

.navbar__inner {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--navbar-height);
  padding: 0 1rem;
  border-radius: 0 0 var(--radius-large) var(--radius-large);
  box-shadow: 0 8px 24px -16px rgba(0, 0, 0, 0.25);
}

.navbar__brand {
  height: 3.25rem;
  padding: 0 1.25rem;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--primary);
}

.navbar__brand:hover {
  color: var(--primary);
}

/* 品牌链接不参与“当前页”高亮 */
.navbar__brand[aria-current='page'] {
  background: transparent;
}

.navbar__brand-icon {
  font-size: 1.6rem;
}

.navbar__links {
  display: none;
  align-items: center;
  gap: 0.15rem;
}

.navbar__link {
  height: 2.75rem;
  padding: 0 1.25rem;
  font-weight: 700;
  font-size: 0.95rem;
}

.navbar__tools {
  display: flex;
  align-items: center;
  gap: 0.15rem;
}

.navbar__tool {
  width: 2.75rem;
  height: 2.75rem;
  font-size: 1.2rem;
}

.navbar__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 0.6rem;
  background: linear-gradient(135deg, var(--primary), oklch(0.78 0.12 calc(var(--hue) + 50)));
  color: #fff;
  font-size: 0.85rem;
  font-weight: 800;
  box-shadow: 0 4px 10px -4px oklch(0.6 0.14 var(--hue) / 0.8);
}

.navbar__avatar--lg {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.8rem;
  font-size: 1.15rem;
}

.navbar__menu-btn {
  display: inline-flex;
}

/* 面板 */
.navbar__panel {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 1rem;
  padding: 0.5rem;
  z-index: 60;
}

.navbar__panel--settings {
  width: min(20rem, calc(100vw - 2rem));
  padding: 1rem;
}

.navbar__panel--user,
.navbar__panel--menu {
  width: 14rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.navbar__panel-item {
  justify-content: flex-start;
  width: 100%;
  min-height: 2.5rem;
  padding: 0 0.85rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.navbar__panel-item :deep(.lucide) {
  font-size: 1.1rem;
  color: var(--text-3);
  transition: color var(--duration-fast) var(--ease-standard);
}

.navbar__panel-item:hover :deep(.lucide),
.navbar__panel-item.current-theme-btn :deep(.lucide) {
  color: var(--primary);
}

.navbar__user-head {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.6rem;
}

.navbar__user-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-size: 0.85rem;
  line-height: 1.3;
}

.navbar__user-meta strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navbar__divider {
  height: 1px;
  margin: 0.3rem 0.5rem;
  background: var(--line-divider);
}

@media (min-width: 768px) {
  .navbar {
    padding: 0 1rem;
  }

  .navbar__links {
    display: flex;
  }

  .navbar__menu-btn {
    display: none;
  }

  .navbar__panel--menu {
    display: none;
  }
}

@media (max-width: 767px) {
  .navbar__inner {
    height: 3.75rem;
    padding: 0 0.5rem;
  }

  .navbar__brand {
    padding: 0 0.75rem;
  }

  .navbar__panel {
    right: 0.5rem;
  }
}
</style>

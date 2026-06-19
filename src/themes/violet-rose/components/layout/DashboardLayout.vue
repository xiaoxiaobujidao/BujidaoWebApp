<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfoStore'
import ThemeBackground from '@violet-rose/components/theme/ThemeBackground.vue'
import DashboardNav from '@violet-rose/components/layout/DashboardNav.vue'

const route = useRoute()
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.getUserInfo())

const pageTitle = computed(() => (route.meta.title as string) ?? '控制台')
</script>

<template>
  <div class="dash" data-theme="rose">
    <ThemeBackground theme="rose" />
    <div class="dash__shell">
      <aside class="dash__sidebar">
        <router-link to="/user" class="dash__brand">
          <span aria-hidden="true">🥀</span>
          <span>布吉岛</span>
        </router-link>
        <DashboardNav layout="sidebar" />
        <div v-if="userInfo" class="dash__profile">
          <p class="dash__balance">余额 ¥{{ (userInfo.balance / 100).toFixed(2) }}</p>
          <p class="dash__email">{{ userInfo.email ?? '未绑定邮箱' }}</p>
        </div>
      </aside>

      <div class="dash__main">
        <header class="dash__topbar">
          <h1 class="dash__title">{{ pageTitle }}</h1>
          <router-link to="/signout" class="dash__signout">退出</router-link>
        </header>
        <main class="dash__content">
          <slot />
        </main>
      </div>
    </div>

    <nav class="dash__bottom">
      <DashboardNav layout="bottom" />
    </nav>
  </div>
</template>

<style scoped>
.dash {
  position: relative;
  min-height: 100dvh;
}

.dash__shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 220px 1fr;
  min-height: 100dvh;
  max-width: 1200px;
  margin: 0 auto;
}

.dash__sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem 1rem;
  background: var(--header-bg);
  border-right: 1px solid var(--color-surface-border);
  backdrop-filter: blur(12px);
}

.dash__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  text-decoration: none;
}

.dash__profile {
  margin-top: auto;
  padding: 0.85rem;
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
}

.dash__balance {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dash__email {
  margin-top: 0.25rem;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  word-break: break-all;
}

.dash__main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dash__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-surface-border);
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
}

.dash__title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dash__signout {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  text-decoration: none;
}

.dash__signout:hover {
  color: var(--color-accent-deep);
}

.dash__content {
  flex: 1;
  padding: 1.25rem 1.5rem 5rem;
}

.dash__bottom {
  display: none;
}

@media (max-width: 767px) {
  .dash__shell {
    grid-template-columns: 1fr;
  }

  .dash__sidebar {
    display: none;
  }

  .dash__content {
    padding: 1rem 1rem 5.5rem;
  }

  .dash__bottom {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding-bottom: var(--safe-area-bottom);
    background: var(--nav-mobile-bg);
    border-top: 1px solid var(--nav-mobile-border);
    backdrop-filter: blur(16px);
  }
}
</style>

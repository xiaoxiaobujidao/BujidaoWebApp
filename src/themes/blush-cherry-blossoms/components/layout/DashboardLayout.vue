<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfoStore'
import SakuraBackground from '@blush-cherry-blossoms/components/sakura/SakuraBackground.vue'
import DashboardNav from '@blush-cherry-blossoms/components/layout/DashboardNav.vue'

const route = useRoute()
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.getUserInfo())
const pageTitle = computed(() => (route.meta.title as string) ?? '控制台')
</script>

<template>
  <div class="dash">
    <SakuraBackground />
    <div class="dash__shell">
      <header class="dash__header">
        <router-link to="/user" class="dash__brand">
          <span aria-hidden="true">🌸</span>
          <span>布吉岛</span>
        </router-link>
        <div v-if="userInfo" class="dash__chip">
          <span class="dash__balance">¥{{ (userInfo.balance / 100).toFixed(2) }}</span>
          <span class="dash__email">{{ userInfo.email ?? '未绑定邮箱' }}</span>
        </div>
        <router-link to="/signout" class="dash__signout">退出</router-link>
      </header>

      <div class="dash__ribbon">
        <DashboardNav layout="ribbon" />
      </div>

      <main class="dash__content">
        <h1 class="dash__title">{{ pageTitle }}</h1>
        <slot />
      </main>
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
  max-width: 960px;
  margin: 0 auto;
  min-height: 100dvh;
  padding: 0 1rem 5.5rem;
}

.dash__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: calc(0.85rem + var(--safe-area-top)) 0 0.75rem;
  border-bottom: 1px solid var(--color-surface-border);
}

.dash__brand {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text-primary);
  text-decoration: none;
  letter-spacing: 0.04em;
}

.dash__chip {
  flex: 1;
  min-width: 0;
  text-align: right;
}

.dash__balance {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-sakura-deep);
}

.dash__email {
  display: block;
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dash__signout {
  flex-shrink: 0;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  border: 1px solid var(--color-surface-border);
  background: rgba(255, 255, 255, 0.4);
}

.dash__signout:hover {
  color: var(--color-sakura-deep);
  text-decoration: none;
}

.dash__ribbon {
  padding: 0.75rem 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.dash__ribbon::-webkit-scrollbar {
  display: none;
}

.dash__title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 1.15rem;
}

.dash__content {
  padding-bottom: 1.5rem;
}

.dash__bottom {
  display: none;
}

@media (max-width: 767px) {
  .dash__ribbon {
    display: none;
  }

  .dash__bottom {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding-bottom: var(--safe-area-bottom);
    background: rgba(255, 255, 255, 0.88);
    border-top: 1px solid var(--color-surface-border);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
}

@media (min-width: 768px) {
  .dash__shell {
    padding-bottom: 2rem;
  }
}
</style>

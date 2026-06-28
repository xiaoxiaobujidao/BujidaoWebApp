<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserInfoStore } from '@/stores/userInfoStore'
import IslandBackground from '@bujidao/components/island/IslandBackground.vue'
import DashboardNav from '@bujidao/components/layout/DashboardNav.vue'
import ThemeDark from '@bujidao/components/icons/ThemeDark.vue'
import TelegramMark from '@bujidao/components/icons/TelegramMark.vue'
import GithubMark from '@bujidao/components/icons/GithubMark.vue'

const route = useRoute()
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.getUserInfo())

const pageTitles: Record<string, string> = {
  '/user': '概览',
  '/sub': '订阅',
  '/balance': '财务',
  '/announcement': '公告',
  '/node_list': '节点',
  '/tutorial': '教程',
  '/t': '教程',
  '/cc': '个性化',
}

const pageTitle = computed(() => pageTitles[route.path] ?? '控制台')
</script>

<template>
  <div class="dash">
    <IslandBackground />
    <div class="dash__shell">
      <header class="dash__header">
        <router-link to="/user" class="dash__brand">
          <span class="dash__logo" aria-hidden="true">🏝️</span>
          <span class="dash__brand-text">
            <span class="dash__name">布吉岛</span>
            <span class="dash__tagline">百慕大里的小小岛屿</span>
          </span>
        </router-link>

        <div v-if="userInfo" class="dash__chip">
          <span class="dash__balance">¥{{ (userInfo.balance / 100).toFixed(2) }}</span>
          <span class="dash__email">{{ userInfo.email ?? '未绑定邮箱' }}</span>
        </div>

        <div class="dash__actions">
          <a
            href="https://t.me/bujidaoChat"
            target="_blank"
            rel="noopener noreferrer"
            class="dash__icon-btn"
            aria-label="Telegram"
          >
            <TelegramMark />
          </a>
          <a
            href="https://github.com/xiaoxiaobujidao"
            target="_blank"
            rel="noopener noreferrer"
            class="dash__icon-btn"
            aria-label="GitHub"
          >
            <GithubMark />
          </a>
          <div class="dash__icon-btn">
            <ThemeDark />
          </div>
          <router-link to="/signout" class="dash__signout">退出</router-link>
        </div>
      </header>

      <div class="dash__ribbon">
        <DashboardNav layout="ribbon" />
      </div>

      <main class="dash__main">
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
  max-width: var(--content-max-width);
  margin: 0 auto;
  min-height: 100dvh;
  padding: 0 1rem calc(5.5rem + var(--safe-area-bottom));
}

.dash__header {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: calc(0.9rem + var(--safe-area-top)) 0 0.85rem;
  border-bottom: 1px solid var(--color-surface-border);
}

.dash__brand {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  color: var(--color-text-primary);
  text-decoration: none;
  min-width: 0;
}

.dash__brand:hover {
  text-decoration: none;
}

.dash__logo {
  font-size: 1.5rem;
  line-height: 1;
  filter: drop-shadow(0 2px 8px rgba(61, 165, 232, 0.25));
}

.dash__brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dash__name {
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  line-height: 1.2;
}

.dash__tagline {
  font-size: 0.68rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dash__chip {
  flex: 1;
  min-width: 0;
  text-align: right;
}

.dash__balance {
  display: block;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-ocean-deep);
  letter-spacing: -0.02em;
}

.dark .dash__balance {
  color: var(--color-ocean-light);
}

.dash__email {
  display: block;
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dash__actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
}

.dash__icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--color-text-secondary);
  transition: background-color 0.2s ease;
}

.dash__icon-btn:hover {
  background: rgba(61, 165, 232, 0.12);
}

.dash__icon-btn :deep(svg) {
  width: 22px;
  height: 22px;
}

.dash__signout {
  margin-left: 0.15rem;
  padding: 0.38rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--color-surface-border);
  background: rgba(255, 255, 255, 0.45);
  color: var(--color-text-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.dash__signout:hover {
  color: var(--color-ocean-deep);
  border-color: rgba(61, 165, 232, 0.35);
  text-decoration: none;
}

.dark .dash__signout {
  background: rgba(255, 255, 255, 0.06);
}

.dash__ribbon {
  padding: 0.85rem 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.dash__ribbon::-webkit-scrollbar {
  display: none;
}

.dash__title {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  color: var(--color-text-primary);
  margin-bottom: 1.1rem;
}

.dash__main {
  padding-bottom: 1.5rem;
}

.dash__bottom {
  display: none;
}

@media (max-width: 767px) {
  .dash__shell {
    padding-bottom: calc(4.75rem + var(--safe-area-bottom));
  }

  .dash__tagline {
    display: none;
  }

  .dash__chip {
    display: none;
  }

  .dash__signout {
    display: none;
  }

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
    background: rgba(255, 255, 255, 0.82);
    border-top: 1px solid var(--color-surface-border);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .dark .dash__bottom {
    background: rgba(14, 28, 44, 0.88);
  }
}

@media (min-width: 768px) {
  .dash__shell {
    padding-bottom: 2rem;
  }
}
</style>

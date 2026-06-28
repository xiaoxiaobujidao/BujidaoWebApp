<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TelegramImage from '@bujidao/components/icons/TelegramImage.vue'
import UserFilled from '@bujidao/components/icons/UserFilled.vue'
import SubscribeItem from '@bujidao/components/icons/SubscribeItem.vue'
import ListItem from '@bujidao/components/icons/ListItem.vue'
import DarkTheme from '@bujidao/components/DarkTheme.vue'
import IslandBackground from '@bujidao/components/island/IslandBackground.vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const menu = [
  { name: '我的', icon: UserFilled, path: '/user' },
  { name: '订阅', icon: SubscribeItem, path: '/sub' },
  { name: '公告', icon: ListItem, path: '/announcement' },
]

const activePath = computed(() => router.currentRoute.value.path)

function go_telegram() {
  ElMessage.info('正在前往群组')
  location.href = 'https://t.me/bujidaoChat'
}

function logout() {
  router.push({ path: '/signout' })
}

function go_to(path: string) {
  router.push({ path })
}
</script>

<template>
  <div class="phone-shell">
    <IslandBackground />
    <header class="phone-header">
      <button type="button" class="phone-header__btn" @click="go_telegram()">
        <TelegramImage />
      </button>
      <div class="phone-header__brand">
        <span class="phone-header__logo">🏝️</span>
        <h1>布吉岛</h1>
      </div>
      <button type="button" class="phone-header__logout" @click="logout()">登出</button>
    </header>

    <main class="phone-main">
      <slot />
    </main>

    <nav class="phone-nav" :style="{ gridTemplateColumns: `repeat(${menu.length}, 1fr)` }">
      <button
        v-for="item in menu"
        :key="item.name"
        type="button"
        class="phone-nav__item"
        :class="{ 'phone-nav__item--active': activePath.includes(item.path) }"
        @click="go_to(item.path)"
      >
        <span class="phone-nav__icon">
          <component :is="item.icon" />
        </span>
        <span class="phone-nav__label">{{ item.name }}</span>
      </button>
    </nav>

    <DarkTheme class="phone-theme" />
  </div>
</template>

<style lang="scss" scoped>
.phone-shell {
  position: relative;
  min-height: 100dvh;
}

.phone-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 20;
  height: calc(56px + var(--safe-area-top));
  padding: var(--safe-area-top) 14px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.78);
  border-bottom: 1px solid var(--color-surface-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.dark .phone-header {
  background: rgba(14, 28, 44, 0.82);
}

.phone-header__brand {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.phone-header__logo {
  font-size: 1.1rem;
}

.phone-header h1 {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--color-text-primary);
}

.phone-header__btn,
.phone-header__logout {
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
}

.phone-header__btn :deep(svg) {
  width: 26px;
  height: 26px;
}

.phone-header__logout {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--color-surface-border);
  background: rgba(255, 255, 255, 0.45);
  font-size: 0.75rem;
  font-weight: 600;
}

.dark .phone-header__logout {
  background: rgba(255, 255, 255, 0.06);
}

.phone-main {
  position: relative;
  z-index: 1;
  min-height: 100dvh;
  padding: calc(68px + var(--safe-area-top)) 12px calc(72px + var(--safe-area-bottom));
}

.phone-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 20;
  display: grid;
  padding: 6px 8px calc(6px + var(--safe-area-bottom));
  background: rgba(255, 255, 255, 0.84);
  border-top: 1px solid var(--color-surface-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.dark .phone-nav {
  background: rgba(14, 28, 44, 0.88);
}

.phone-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
  padding: 0.35rem 0.2rem;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
}

.phone-nav__item--active {
  color: var(--color-ocean-deep);
}

.dark .phone-nav__item--active {
  color: var(--color-ocean-light);
}

.phone-nav__icon :deep(svg) {
  width: 20px;
  height: 20px;
}

.phone-nav__item--active .phone-nav__icon :deep(svg) {
  filter: drop-shadow(0 2px 6px rgba(61, 165, 232, 0.35));
}

.phone-nav__label {
  font-size: 0.68rem;
  font-weight: 600;
}

.phone-theme {
  display: none;
}
</style>

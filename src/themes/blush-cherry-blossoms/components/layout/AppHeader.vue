<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserInfoStore } from '@/stores/userInfoStore'

const menuOpen = ref(false)
const userInfoStore = useUserInfoStore()
const isLoggedIn = computed(() => !!userInfoStore.getToken())

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <router-link to="/" class="header__brand" @click="closeMenu">
        <span class="header__logo" aria-hidden="true">🌸</span>
        <span class="header__title">布吉岛</span>
      </router-link>

      <button
        class="header__toggle"
        :aria-expanded="menuOpen"
        aria-label="打开菜单"
        @click="toggleMenu"
      >
        <span class="header__toggle-bar" />
        <span class="header__toggle-bar" />
        <span class="header__toggle-bar" />
      </button>

      <nav class="header__nav" :class="{ 'header__nav--open': menuOpen }">
        <router-link to="/" class="header__link" @click="closeMenu">首页</router-link>
        <template v-if="isLoggedIn">
          <router-link to="/user" class="header__link" @click="closeMenu">账户</router-link>
          <router-link to="/sub" class="header__link" @click="closeMenu">订阅</router-link>
          <router-link to="/node_list" class="header__link" @click="closeMenu">节点</router-link>
          <router-link to="/balance" class="header__link" @click="closeMenu">资产</router-link>
          <router-link to="/announcement" class="header__link" @click="closeMenu">公告</router-link>
          <router-link to="/signout" class="header__link header__link--muted" @click="closeMenu">退出</router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="header__link" @click="closeMenu">登录</router-link>
          <router-link to="/register" class="header__link" @click="closeMenu">注册</router-link>
        </template>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  padding-top: var(--safe-area-top);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-surface-border);
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--content-max-width);
  height: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: 600;
}

.header__brand:hover {
  text-decoration: none;
}

.header__logo {
  font-size: 1.25rem;
}

.header__title {
  font-size: 1.1rem;
  letter-spacing: 0.05em;
}

.header__toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: var(--radius-md);
}

.header__toggle-bar {
  display: block;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 1px;
  transition: transform 0.2s;
}

.header__nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.header__link {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s;
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--color-sakura-deep);
  text-decoration: none;
}

.header__link--muted {
  opacity: 0.75;
}

@media (max-width: 767px) {
  .header__toggle {
    display: flex;
  }

  .header__nav {
    position: fixed;
    top: calc(var(--header-height) + var(--safe-area-top));
    left: 0;
    right: 0;
    flex-direction: column;
    gap: 0;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--color-surface-border);
    transform: translateY(-110%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .header__nav--open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .header__link {
    width: 100%;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid rgba(255, 183, 197, 0.2);
  }
}
</style>

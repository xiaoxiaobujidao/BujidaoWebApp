<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ThemeMeta } from '@violet-rose/themes/types'
import { useUserInfoStore } from '@/stores/userInfoStore'

defineProps<{
  meta: ThemeMeta
}>()

const userInfoStore = useUserInfoStore()
const isLoggedIn = computed(() => !!userInfoStore.getToken())

const menuOpen = ref(false)

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
        <span class="header__logo" aria-hidden="true">{{ meta.logo }}</span>
        <span class="header__title">{{ meta.name }}</span>
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
        <router-link v-if="isLoggedIn" to="/user" class="header__link" @click="closeMenu"
          >控制台</router-link
        >
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
  background: var(--header-bg);
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
  font-size: 0.95rem;
  text-decoration: none;
  transition: color 0.2s;
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--color-accent-deep);
  text-decoration: none;
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
    background: var(--nav-mobile-bg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--color-surface-border);
    transform: translateY(-110%);
    opacity: 0;
    pointer-events: none;
    transition:
      transform 0.3s ease,
      opacity 0.3s ease;
  }

  .header__nav--open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }

  .header__link {
    width: 100%;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid var(--nav-mobile-border);
  }
}
</style>

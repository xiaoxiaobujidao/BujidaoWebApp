<script setup lang="ts">
import type { Component } from 'vue'
import { useRoute } from 'vue-router'
import NavAnnouncementIcon from '../icons/nav/NavAnnouncementIcon.vue'
import NavBalanceIcon from '../icons/nav/NavBalanceIcon.vue'
import NavConfigIcon from '../icons/nav/NavConfigIcon.vue'
import NavNodeIcon from '../icons/nav/NavNodeIcon.vue'
import NavSubIcon from '../icons/nav/NavSubIcon.vue'
import NavUserIcon from '../icons/nav/NavUserIcon.vue'

defineProps<{
  layout: 'sidebar' | 'bottom'
}>()

const route = useRoute()

const navItems: { to: string; label: string; icon: Component }[] = [
  { to: '/user', label: '账户', icon: NavUserIcon },
  { to: '/sub', label: '订阅', icon: NavSubIcon },
  { to: '/node_list', label: '节点', icon: NavNodeIcon },
  { to: '/balance', label: '资产', icon: NavBalanceIcon },
  { to: '/announcement', label: '公告', icon: NavAnnouncementIcon },
  { to: '/cc', label: '配置', icon: NavConfigIcon },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav :class="['nav', `nav--${layout}`]">
    <router-link
      v-for="item in navItems"
      :key="item.to"
      :to="item.to"
      class="nav__item"
      :class="{ 'nav__item--active': isActive(item.to) }"
    >
      <component :is="item.icon" class="nav__icon" />
      <span class="nav__label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.nav--sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav--bottom {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0;
}

.nav__item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.75rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition:
    background 0.2s,
    color 0.2s;
}

.nav--bottom .nav__item {
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.5rem 0.25rem;
  font-size: 0.68rem;
  text-align: center;
}

.nav__item:hover,
.nav__item--active {
  color: var(--color-accent-deep);
  background: rgba(171, 71, 188, 0.12);
  text-decoration: none;
}

.nav__icon {
  flex-shrink: 0;
  font-size: 1.1rem;
  line-height: 1;
}

.nav--bottom .nav__icon {
  font-size: 1.15rem;
}

.nav__label {
  font-size: 0.88rem;
  font-weight: 500;
}
</style>

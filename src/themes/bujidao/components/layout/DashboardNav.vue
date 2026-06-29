<script setup lang="ts">
import { useRoute } from 'vue-router'

defineProps<{
  layout: 'ribbon' | 'bottom'
}>()

const route = useRoute()

const navItems = [
  { to: '/user', label: '概览', icon: '◉' },
  { to: '/sub', label: '订阅', icon: '◎' },
  { to: '/balance', label: '财务', icon: '◈' },
  { to: '/node_list', label: '节点', icon: '◍' },
  { to: '/announcement', label: '公告', icon: '◌' },
  { to: '/tutorial', label: '教程', icon: '◫' },
  { to: '/cc', label: '配置', icon: '◆' },
]

const bottomItems = navItems.slice(0, 5)

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav :class="['nav', `nav--${layout}`]">
    <router-link
      v-for="item in layout === 'bottom' ? bottomItems : navItems"
      :key="item.to"
      :to="item.to"
      class="nav__item"
      :class="{ 'nav__item--active': isActive(item.to) }"
    >
      <span class="nav__icon" aria-hidden="true">{{ item.icon }}</span>
      <span class="nav__label">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<style scoped>
.nav--ribbon {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.nav--bottom {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.nav__item {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.55rem 0.95rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: 999px;
  transition:
    background 0.22s ease,
    color 0.22s ease,
    box-shadow 0.22s ease,
    transform 0.22s ease;
}

.nav--bottom .nav__item {
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.55rem 0.25rem;
  border-radius: 0;
  font-size: 0.68rem;
  text-align: center;
}

.nav__item:hover {
  color: var(--color-ocean-deep);
  background: rgba(61, 165, 232, 0.12);
  text-decoration: none;
}

.nav__item--active {
  color: var(--color-ocean-deep);
  background: rgba(61, 165, 232, 0.18);
  box-shadow: inset 0 0 0 1px var(--color-surface-border);
}

.dark .nav__item--active {
  color: var(--color-ocean-light);
}

.nav__icon {
  font-size: 0.82rem;
  line-height: 1;
  opacity: 0.85;
}

.nav--bottom .nav__icon {
  font-size: 1rem;
}

.nav__label {
  font-size: 0.84rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
</style>

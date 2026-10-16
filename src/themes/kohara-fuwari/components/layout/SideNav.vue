<script setup lang="ts">
import { useRoute } from 'vue-router'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { accountNav, mainNav } from './nav'

const route = useRoute()
const isActive = (path: string) =>
  route.path === path || (path === '/tutorial' && route.path === '/t')
</script>

<template>
  <div class="sidenav card-base">
    <h3 class="widget-title sidenav__title">导航</h3>
    <nav class="sidenav__list" aria-label="侧栏导航">
      <router-link
        v-for="item in mainNav"
        :key="item.path"
        :to="item.path"
        class="btn-plain sidenav__item"
        :class="{ 'current-theme-btn': isActive(item.path) }"
      >
        <LucideIcon :name="item.icon" class="sidenav__icon" />
        <span class="sidenav__label">{{ item.label }}</span>
        <span class="sidenav__desc">{{ item.description }}</span>
      </router-link>
    </nav>
    <div class="sidenav__divider" />
    <nav class="sidenav__list" aria-label="账户导航">
      <router-link
        v-for="item in accountNav"
        :key="item.path"
        :to="item.path"
        class="btn-plain sidenav__item sidenav__item--compact"
        :class="{ 'current-theme-btn': isActive(item.path) }"
      >
        <LucideIcon :name="item.icon" class="sidenav__icon" />
        <span class="sidenav__label">{{ item.label }}</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.sidenav {
  padding: 1rem 0.75rem 0.75rem;
}

.sidenav__title {
  margin: 0 0 0.6rem 0.5rem;
}

.sidenav__list {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.sidenav__item {
  display: grid;
  grid-template-columns: 1.5rem 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.6rem;
  row-gap: 0.1rem;
  align-items: center;
  justify-items: start;
  text-align: left;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border-radius: var(--radius-md);
}

.sidenav__item--compact {
  grid-template-rows: auto;
  padding: 0.5rem 0.75rem;
}

.sidenav__icon {
  grid-row: 1 / span 2;
  font-size: 1.15rem;
  color: var(--text-3);
  transition: color var(--duration-fast) var(--ease-standard);
}

.sidenav__item--compact .sidenav__icon {
  grid-row: 1;
}

.sidenav__item:hover .sidenav__icon,
.sidenav__item.current-theme-btn .sidenav__icon {
  color: var(--primary);
}

.sidenav__label {
  font-weight: 700;
  font-size: 0.92rem;
  line-height: 1.3;
}

.sidenav__desc {
  font-size: 0.74rem;
  color: var(--text-3);
  line-height: 1.3;
}

.sidenav__divider {
  height: 1px;
  margin: 0.6rem 0.5rem;
  background: var(--line-divider);
}
</style>

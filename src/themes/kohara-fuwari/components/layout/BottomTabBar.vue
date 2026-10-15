<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { accountNav, bottomNav, mainNav } from './nav'

const route = useRoute()
const moreOpen = ref(false)
const root = ref<HTMLElement | null>(null)

const moreItems = [...mainNav.filter((item) => !bottomNav.includes(item)), ...accountNav]

const isActive = (path: string) =>
  route.path === path || (path === '/tutorial' && route.path === '/t')
const moreActive = () => moreItems.some((item) => isActive(item.path))

function onDocumentClick(event: MouseEvent) {
  if (!root.value?.contains(event.target as Node)) moreOpen.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <nav ref="root" class="tabbar" aria-label="底部导航">
    <div class="float-panel tabbar__more" :class="{ 'float-panel-closed': !moreOpen }">
      <router-link
        v-for="item in moreItems"
        :key="item.path"
        :to="item.path"
        class="btn-plain tabbar__more-item"
        :class="{ 'current-theme-btn': isActive(item.path) }"
        @click="moreOpen = false"
      >
        <LucideIcon :name="item.icon" />
        <span>{{ item.label }}</span>
      </router-link>
    </div>

    <div class="tabbar__bar card-base">
      <router-link
        v-for="item in bottomNav"
        :key="item.path"
        :to="item.path"
        class="tabbar__item"
        :class="{ 'is-active': isActive(item.path) }"
      >
        <LucideIcon :name="item.icon" class="tabbar__icon" />
        <span class="tabbar__label">{{ item.label }}</span>
      </router-link>
      <button
        type="button"
        class="tabbar__item"
        :class="{ 'is-active': moreOpen || moreActive() }"
        aria-label="更多"
        @click.stop="moreOpen = !moreOpen"
      >
        <LucideIcon :name="moreOpen ? 'x' : 'layout-grid'" class="tabbar__icon" />
        <span class="tabbar__label">更多</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  padding: 0 0.75rem calc(0.6rem + env(safe-area-inset-bottom, 0px));
  pointer-events: none;
}

.tabbar__bar {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0.35rem;
  box-shadow: var(--shadow-float);
  border: 1px solid var(--line-divider);
  pointer-events: auto;
}

.tabbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  padding: 0.45rem 0.25rem 0.35rem;
  border-radius: var(--radius-md);
  color: var(--text-3);
  font-size: 0.68rem;
  font-weight: 600;
  transition:
    color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.tabbar__item.is-active {
  color: var(--primary);
  background: var(--btn-plain-bg-hover);
}

.tabbar__icon {
  font-size: 1.3rem;
}

.tabbar__more {
  position: absolute;
  right: 0.75rem;
  bottom: calc(100% + 0.25rem);
  width: 12rem;
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  pointer-events: auto;
}

.tabbar__more.float-panel-closed {
  transform: translateY(0.5rem);
}

.tabbar__more-item {
  justify-content: flex-start;
  width: 100%;
  min-height: 2.5rem;
  padding: 0 0.85rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.tabbar__more-item :deep(.lucide) {
  font-size: 1.1rem;
  color: var(--text-3);
}

.tabbar__more-item.current-theme-btn :deep(.lucide) {
  color: var(--primary);
}

@media (min-width: 768px) {
  .tabbar {
    display: none;
  }
}
</style>

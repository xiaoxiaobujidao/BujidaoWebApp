<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { bottomNav, mainNav } from './nav'

const route = useRoute()
const moreOpen = ref(false)
const root = ref<HTMLElement | null>(null)

const moreItems = mainNav.filter((item) => !bottomNav.includes(item))

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
    <Transition name="tab-pop">
      <div v-if="moreOpen" class="tabbar__more">
        <router-link
          v-for="item in moreItems"
          :key="item.path"
          :to="item.path"
          class="tabbar__more-item"
          :class="{ 'is-active': isActive(item.path) }"
          @click="moreOpen = false"
        >
          <LucideIcon :name="item.icon" />
          <span>{{ item.label }}</span>
        </router-link>
        <router-link
          to="/signout"
          class="tabbar__more-item tabbar__more-item--danger"
          @click="moreOpen = false"
        >
          <LucideIcon name="logout" />
          <span>登出</span>
        </router-link>
      </div>
    </Transition>

    <div class="tabbar__bar">
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
        <LucideIcon :name="moreOpen ? 'x' : 'more-horizontal'" class="tabbar__icon" />
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
  pointer-events: none;
}

.tabbar__bar {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding: 0.3rem 0.5rem calc(0.3rem + env(safe-area-inset-bottom, 0px));
  background: var(--cl-surface);
  border-top: 1px solid var(--cl-border);
  pointer-events: auto;
}

.tabbar__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  padding: 0.45rem 0.25rem 0.3rem;
  border-radius: var(--cl-radius-md);
  color: var(--cl-text-3);
  font-size: 0.68rem;
  font-weight: 600;
  transition: color var(--cl-fast) var(--cl-ease);
}

.tabbar__item.is-active {
  color: var(--cl-accent-ink);
}

.tabbar__icon {
  font-size: 1.3rem;
}

.tabbar__more {
  position: absolute;
  right: 0.75rem;
  bottom: calc(100% + 0.5rem);
  width: 12rem;
  padding: 0.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  border-radius: var(--cl-radius-md);
  background: var(--cl-surface);
  border: 1px solid var(--cl-border);
  box-shadow: var(--cl-shadow-lg);
  pointer-events: auto;
}

.tabbar__more-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 2.5rem;
  padding: 0 0.85rem;
  border-radius: var(--cl-radius-sm);
  color: var(--cl-text-2);
  font-weight: 600;
  font-size: 0.9rem;
}

.tabbar__more-item:hover,
.tabbar__more-item.is-active {
  background: var(--cl-surface-2);
  color: var(--cl-text);
}

.tabbar__more-item--danger {
  color: var(--cl-danger-ink);
}

.tab-pop-enter-active,
.tab-pop-leave-active {
  transition:
    opacity var(--cl-fast) var(--cl-ease),
    transform var(--cl-fast) var(--cl-ease);
}

.tab-pop-enter-from,
.tab-pop-leave-to {
  opacity: 0;
  transform: translateY(0.4rem);
}

@media (min-width: 768px) {
  .tabbar {
    display: none;
  }
}
</style>

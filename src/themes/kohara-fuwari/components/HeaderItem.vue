<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isDark = ref(false)
const showMobileMenu = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('app-theme', isDark.value ? 'dark' : 'light')
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  const panel = document.getElementById('nav-menu-panel')
  const switchBtn = document.getElementById('nav-menu-switch')
  if (
    showMobileMenu.value &&
    panel &&
    switchBtn &&
    !panel.contains(target) &&
    !switchBtn.contains(target)
  ) {
    showMobileMenu.value = false
  }
}

onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.classList.toggle('dark', isDark.value)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const menu = [
  { path: '/user', name: '概览' },
  { path: '/sub', name: '订阅' },
  { path: '/balance', name: '财务' },
  { path: '/announcement', name: '公告' },
  { path: '/node_list', name: '节点' },
  { path: '/tutorial', name: '教程' },
  { path: '/cc', name: '个性化' },
  { path: '/signout', name: '登出' },
]

const activePath = computed(() => {
  return route.path
})
</script>

<template>
  <div
    class="card-base mx-auto flex h-[4.5rem] !max-w-full lg:!max-w-[80%] items-center justify-between !overflow-visible px-4 md:px-6 onload-animation z-50"
  >
    <a href="/" class="btn-plain scale-animation h-12 rounded-full px-4 md:px-6 font-bold">
      <h1
        class="text-base flex flex-row items-center text-[var(--primary)] whitespace-nowrap"
        style="font-family: '幼圆', 'YouYuan', sans-serif; margin: 0"
      >
        <span class="icon-[tabler--smart-home] mr-2 text-[1.5rem]"></span> 布吉岛
      </h1>
    </a>

    <div class="hidden lg:flex space-x-1 overflow-x-auto flex-1 justify-center py-2 no-scrollbar">
      <div v-for="item in menu" :key="item.path" class="relative">
        <a
          :href="item.path"
          class="btn-plain scale-animation h-12 rounded-full px-4 xl:px-6 py-2 font-bold text-base whitespace-nowrap"
          :class="activePath === item.path ? 'active' : ''"
        >
          <div class="flex items-center">
            {{ item.name }}
          </div>
        </a>
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <button
        aria-label="Light/Dark Mode"
        class="btn-plain scale-animation relative h-10 w-10 rounded-full bg-opacity-20"
        id="scheme-switch"
        @click="toggleDark"
      >
        <img
          v-if="isDark"
          :src="'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 width=%2724%27 height=%2724%27%3E%3Cpath fill=%27%23fff%27 d=%27M12 17V7Q9.925 7 8.463 8.463T7 12t1.463 3.538T12 17m0 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8%27/%3E%3C/svg%3E'"
          alt="Light Mode"
          class="h-6 w-6"
        />
        <img
          v-else
          :src="'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 width=%2724%27 height=%2724%27%3E%3Cpath fill=%27%23000%27 d=%27M12 17V7Q9.925 7 8.463 8.463T7 12t1.463 3.538T12 17m0 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8%27/%3E%3C/svg%3E'"
          alt="Dark Mode"
          class="h-6 w-6"
        />
      </button>

      <button
        aria-label="Menu"
        name="Nav Menu"
        class="btn-plain scale-animation rounded-lg w-11 h-11 active:scale-90 lg:!hidden"
        id="nav-menu-switch"
        @click.stop="toggleMobileMenu"
      >
        <svg v-if="!showMobileMenu" width="1em" height="1em" class="text-[1.25rem]" viewBox="0 0 24 24">
          <path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"/>
        </svg>
        <svg v-else width="1em" height="1em" class="text-[1.25rem]" viewBox="0 0 24 24">
          <path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/>
        </svg>
      </button>
    </div>

    <Teleport to="body">
      <Transition name="mobile-menu-fade">
        <div
          v-if="showMobileMenu"
          id="nav-menu-panel"
          class="mobile-menu-panel lg:!hidden"
          @click.stop
        >
          <div class="card-base float-panel mx-4 mt-2 p-2 max-h-[80vh] overflow-y-auto rounded-2xl">
            <a
              v-for="item in menu"
              :key="item.path"
              :href="item.path"
              class="btn-plain scale-animation flex w-full h-11 rounded-lg px-5 font-bold text-base mb-0.5"
              :class="activePath === item.path ? 'active' : ''"
              @click="closeMobileMenu"
            >
              <div class="flex items-center">
                {{ item.name }}
              </div>
            </a>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.mobile-menu-panel {
  position: fixed;
  inset: 0;
  top: 0;
  z-index: 40;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.mobile-menu-panel .card-base {
  position: fixed;
  top: 5rem;
  left: 0;
  right: 0;
  max-width: none;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
}

.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: opacity 0.25s ease;
}

.mobile-menu-fade-enter-active .card-base,
.mobile-menu-fade-leave-active .card-base {
  transition: transform 0.25s cubic-bezier(0.2, 0.6, 0.2, 1);
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
}

.mobile-menu-fade-enter-from .card-base,
.mobile-menu-fade-leave-to .card-base {
  transform: translateY(-16px);
}
</style>

<style>
/* --------------------------
   动画效果样式
   -------------------------- */

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.onload-animation {
  opacity: 0;
  animation: 0.3s fade-in-up;
  animation-fill-mode: forwards;
}

/* --------------------------
   导航栏容器样式
   -------------------------- */

.card-base {
  background: var(--card-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--card-border);
  border-radius: 0 0 30px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  position: sticky;
  top: 0;
  max-width: 80%;
  padding: 0 2em;
}

/* --------------------------
   滚动条样式
   -------------------------- */

.no-scrollbar {
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* --------------------------
   按钮基础样式
   -------------------------- */

.btn-plain {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.2, 0.6, 0.2, 1);
  color: #333;
  padding: 3.14px 1em 3.14px 1em;
  margin: 0.618em;
  text-decoration: none;
}

/* --------------------------
   交互效果样式
   -------------------------- */

.scale-animation {
  transition: transform 0.18s;
}

.scale-animation:active {
  transform: scale(0.95);
}

.btn-plain:hover {
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid #cccccc83 !important;
  margin: 0.314em;
  transition: margin 0.5s 0.2s;
}

.btn-plain.active,
.btn-plain[aria-current='page'] {
  background: rgba(76, 141, 246, 0.15);
  color: var(--primary);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) inset;
}

/* --------------------------
   图标样式
   -------------------------- */

.icon {
  font-size: 1.25rem;
  margin-right: 0.4rem;
  opacity: 0.9;
}
</style>
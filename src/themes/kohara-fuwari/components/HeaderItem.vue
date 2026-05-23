<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

type ThemeMode = 'light' | 'dark' | 'system'

const themeMode = ref<ThemeMode>('system')
const isDark = ref(false)
const showMobileMenu = ref(false)
const showThemePanel = ref(false)

const supportsViewTransition = typeof document !== 'undefined' && 'startViewTransition' in document

function applyTheme(mode: ThemeMode) {
  const isDarkResolved = mode === 'system'
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : mode === 'dark'
  isDark.value = isDarkResolved
  document.documentElement.classList.toggle('dark', isDarkResolved)
  localStorage.setItem('app-theme-mode', mode)
}

async function switchTheme(mode: ThemeMode) {
  if (mode === themeMode.value) {
    showThemePanel.value = false
    return
  }
  themeMode.value = mode
  showThemePanel.value = false

  if (supportsViewTransition) {
    document.documentElement.classList.add('use-view-transition')
    await (document as any).startViewTransition(() => {
      applyTheme(mode)
    }).finished
    document.documentElement.classList.remove('use-view-transition')
  } else {
    document.documentElement.classList.add('is-theme-transitioning')
    applyTheme(mode)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('is-theme-transitioning')
      })
    })
  }
}

function toggleThemePanel() {
  showThemePanel.value = !showThemePanel.value
}

function closeThemePanel() {
  showThemePanel.value = false
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

  const themeBtn = document.getElementById('scheme-switch')
  const themePanel = document.getElementById('theme-mode-panel')
  if (
    showThemePanel.value &&
    themePanel &&
    themeBtn &&
    !themePanel.contains(target) &&
    !themeBtn.contains(target)
  ) {
    showThemePanel.value = false
  }
}

const systemMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
function onSystemThemeChange() {
  if (themeMode.value === 'system') {
    applyTheme('system')
  }
}

onMounted(() => {
  const savedMode = localStorage.getItem('app-theme-mode') as ThemeMode | null
  if (savedMode && (savedMode === 'light' || savedMode === 'dark' || savedMode === 'system')) {
    themeMode.value = savedMode
  }
  applyTheme(themeMode.value)
  systemMediaQuery.addEventListener('change', onSystemThemeChange)
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  systemMediaQuery.removeEventListener('change', onSystemThemeChange)
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
      <div class="relative">
        <button
          aria-label="Light/Dark Mode"
          class="btn-plain scale-animation relative h-10 w-10 rounded-full bg-opacity-20"
          id="scheme-switch"
          @click.stop="toggleThemePanel"
        >
          <svg v-if="isDark" width="1em" height="1em" class="text-[1.25rem]" viewBox="0 0 24 24">
            <path fill="currentColor" d="M6.05 4.14l-.39-.39a.993.993 0 0 0-1.4 0l-.01.01a.984.984 0 0 0 0 1.4l.39.39c.39.39 1.01.39 1.4 0l.01-.01a.984.984 0 0 0 0-1.4zM3.01 10.5H1.99c-.55 0-.99.44-.99.99v.01c0 .55.44.99.99.99H3c.56.01 1-.43 1-.98v-.01c0-.56-.44-1-.99-1zm9-9.95H12c-.56 0-1 .44-1 .99v.96c0 .55.44.99.99.99H12c.56.01 1-.43 1-.98v-.97c0-.55-.44-.99-.99-.99zm7.74 3.21c-.39-.39-1.02-.39-1.41-.01l-.39.39a.984.984 0 0 0 0 1.4l.01.01c.39.39 1.02.39 1.4 0l.39-.39a.984.984 0 0 0 0-1.4zm-1.81 15.1l.39.39a.996.996 0 1 0 1.41-1.41l-.39-.39a.993.993 0 0 0-1.4 0c-.4.4-.4 1.02-.01 1.41zM20 11.49v.01c0 .55.44.99.99.99H22c.55 0 .99-.44.99-.99v-.01c0-.55-.44-.99-.99-.99h-1.01c-.55 0-.99.44-.99.99zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm-.01 16.95H12c.55 0 .99-.44.99-.99v-.96c0-.55-.44-.99-.99-.99h-.01c-.55 0-.99.44-.99.99v.96c0 .55.44.99.99.99zm-7.74-3.21c.39.39 1.02.39 1.41 0l.39-.39a.993.993 0 0 0 0-1.4l-.01-.01a.996.996 0 0 0-1.41 0l-.39.39c-.38.4-.38 1.02.01 1.41z"/>
          </svg>
          <svg v-else width="1em" height="1em" class="text-[1.25rem]" viewBox="0 0 24 24">
            <path fill="currentColor" d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"/>
          </svg>
        </button>
        <Transition name="theme-panel-fade">
          <div
            v-if="showThemePanel"
            id="theme-mode-panel"
            class="absolute right-0 top-12 w-36 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-lg backdrop-blur-xl overflow-hidden z-50"
            @click.stop
          >
            <button
              class="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
              :class="themeMode === 'light' ? 'text-[var(--primary)]' : ''"
              @click="switchTheme('light')"
            >
              <svg width="1em" height="1em" class="text-[1.1rem]" viewBox="0 0 24 24"><path fill="currentColor" d="M6.05 4.14l-.39-.39a.993.993 0 0 0-1.4 0l-.01.01a.984.984 0 0 0 0 1.4l.39.39c.39.39 1.01.39 1.4 0l.01-.01a.984.984 0 0 0 0-1.4zM3.01 10.5H1.99c-.55 0-.99.44-.99.99v.01c0 .55.44.99.99.99H3c.56.01 1-.43 1-.98v-.01c0-.56-.44-1-.99-1zm9-9.95H12c-.56 0-1 .44-1 .99v.96c0 .55.44.99.99.99H12c.56.01 1-.43 1-.98v-.97c0-.55-.44-.99-.99-.99zm7.74 3.21c-.39-.39-1.02-.39-1.41-.01l-.39.39a.984.984 0 0 0 0 1.4l.01.01c.39.39 1.02.39 1.4 0l.39-.39a.984.984 0 0 0 0-1.4zm-1.81 15.1l.39.39a.996.996 0 1 0 1.41-1.41l-.39-.39a.993.993 0 0 0-1.4 0c-.4.4-.4 1.02-.01 1.41zM20 11.49v.01c0 .55.44.99.99.99H22c.55 0 .99-.44.99-.99v-.01c0-.55-.44-.99-.99-.99h-1.01c-.55 0-.99.44-.99.99zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm-.01 16.95H12c.55 0 .99-.44.99-.99v-.96c0-.55-.44-.99-.99-.99h-.01c-.55 0-.99.44-.99.99v.96c0 .55.44.99.99.99zm-7.74-3.21c.39.39 1.02.39 1.41 0l.39-.39a.993.993 0 0 0 0-1.4l-.01-.01a.996.996 0 0 0-1.41 0l-.39.39c-.38.4-.38 1.02.01 1.41z"/></svg>
              浅色
            </button>
            <button
              class="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
              :class="themeMode === 'dark' ? 'text-[var(--primary)]' : ''"
              @click="switchTheme('dark')"
            >
              <svg width="1em" height="1em" class="text-[1.1rem]" viewBox="0 0 24 24"><path fill="currentColor" d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"/></svg>
              暗黑
            </button>
            <button
              class="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
              :class="themeMode === 'system' ? 'text-[var(--primary)]' : ''"
              @click="switchTheme('system')"
            >
              <svg width="1em" height="1em" class="text-[1.1rem]" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 2c1.82 0 3.53.5 5 1.35C14.01 6.83 12 9.89 12 14c0 1.93.52 3.73 1.42 5.27c-.47.1-.94.23-1.42.23c-4.41 0-8-3.59-8-8s3.59-8 8-8m0 16c-.53 0-1.05-.05-1.56-.15C12.15 19.25 13 16.75 13 14c0-3.33-1.6-6.26-4.08-8.12C9.55 5.31 10.73 5 12 5c3.86 0 7 3.14 7 7s-3.14 7-7 7"/></svg>
              跟随系统
            </button>
          </div>
        </Transition>
      </div>

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

.theme-panel-fade-enter-active,
.theme-panel-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.theme-panel-fade-enter-from,
.theme-panel-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
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

.onload-animation:nth-child(1) { animation-delay: 0ms; }
.onload-animation:nth-child(2) { animation-delay: 60ms; }
.onload-animation:nth-child(3) { animation-delay: 120ms; }
.onload-animation:nth-child(4) { animation-delay: 180ms; }
.onload-animation:nth-child(5) { animation-delay: 240ms; }
.onload-animation:nth-child(6) { animation-delay: 300ms; }
.onload-animation:nth-child(7) { animation-delay: 350ms; }
.onload-animation:nth-child(8) { animation-delay: 400ms; }

/* --------------------------
   View Transitions API 主题切换动画
   -------------------------- */

.use-view-transition::view-transition-old(root) {
  animation: none;
  z-index: 1;
}

.use-view-transition::view-transition-new(root) {
  animation: theme-circle-expand 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

@keyframes theme-circle-expand {
  0% {
    clip-path: circle(0% at 100% 0);
  }
  100% {
    clip-path: circle(150% at 100% 0);
  }
}

/* 非 View Transitions 降级方案 */
.is-theme-transitioning *,
.is-theme-transitioning *::before,
.is-theme-transitioning *::after {
  transition: none !important;
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
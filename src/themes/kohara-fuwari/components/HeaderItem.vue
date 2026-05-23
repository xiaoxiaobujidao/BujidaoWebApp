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

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenu() {
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
    id="navbar"
    class="z-50"
    style="--navbar-glass-blur: 20px"
    data-transparent-mode="semi"
    data-enable-blur="true"
  >
    <div
      class="card-base !overflow-visible h-[4.5rem] mx-auto flex items-center justify-between px-4 md:px-6 max-w-[var(--page-width)] onload-animation"
    >
      <a href="/" class="btn-plain scale-animation rounded-lg h-[3.25rem] px-5 font-bold active:scale-95">
        <h1
          class="text-base flex flex-row items-center text-[var(--primary)] whitespace-nowrap"
          style="font-family: '幼圆', 'YouYuan', sans-serif; margin: 0"
        >
          <span class="icon-[tabler--smart-home] mr-2 text-[1.5rem]"></span> 布吉岛
        </h1>
      </a>

      <div class="hidden lg:flex items-center space-x-1 overflow-x-auto flex-1 justify-center py-2 no-scrollbar">
        <a
          v-for="item in menu"
          :key="item.path"
          :href="item.path"
          class="btn-plain scale-animation rounded-lg h-11 font-bold px-5 active:scale-95"
          :class="activePath === item.path ? 'active' : ''"
        >
          <div class="flex items-center">
            {{ item.name }}
          </div>
        </a>
      </div>

      <div class="flex items-center">
        <div class="relative z-50">
          <button
            aria-label="Light/Dark Mode"
            aria-haspopup="menu"
            class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
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
          <div
            id="theme-mode-panel"
            class="absolute transition-all float-panel top-11 -right-2 pt-5 z-50"
            :class="{ 'float-panel-closed': !showThemePanel }"
            role="menu"
            aria-labelledby="scheme-switch"
          >
            <div class="card-base float-panel p-2 !shadow-xl !border !border-black/5 dark:!border-white/10" style="min-width: 9rem;">
              <button
                class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 text-black/75 dark:text-white/75 hover:text-[var(--primary)] hover:bg-[var(--btn-plain-bg-hover)]"
                :class="themeMode === 'light' ? 'text-[var(--primary)] bg-[var(--btn-plain-bg-hover)]' : ''"
                role="menuitem"
                @click="switchTheme('light')"
              >
                <svg width="1em" height="1em" class="text-[1.25rem]" viewBox="0 0 24 24"><path fill="currentColor" d="M6.05 4.14l-.39-.39a.993.993 0 0 0-1.4 0l-.01.01a.984.984 0 0 0 0 1.4l.39.39c.39.39 1.01.39 1.4 0l.01-.01a.984.984 0 0 0 0-1.4zM3.01 10.5H1.99c-.55 0-.99.44-.99.99v.01c0 .55.44.99.99.99H3c.56.01 1-.43 1-.98v-.01c0-.56-.44-1-.99-1zm9-9.95H12c-.56 0-1 .44-1 .99v.96c0 .55.44.99.99.99H12c.56.01 1-.43 1-.98v-.97c0-.55-.44-.99-.99-.99zm7.74 3.21c-.39-.39-1.02-.39-1.41-.01l-.39.39a.984.984 0 0 0 0 1.4l.01.01c.39.39 1.02.39 1.4 0l.39-.39a.984.984 0 0 0 0-1.4zm-1.81 15.1l.39.39a.996.996 0 1 0 1.41-1.41l-.39-.39a.993.993 0 0 0-1.4 0c-.4.4-.4 1.02-.01 1.41zM20 11.49v.01c0 .55.44.99.99.99H22c.55 0 .99-.44.99-.99v-.01c0-.55-.44-.99-.99-.99h-1.01c-.55 0-.99.44-.99.99zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6zm-.01 16.95H12c.55 0 .99-.44.99-.99v-.96c0-.55-.44-.99-.99-.99h-.01c-.55 0-.99.44-.99.99v.96c0 .55.44.99.99.99zm-7.74-3.21c.39.39 1.02.39 1.41 0l.39-.39a.993.993 0 0 0 0-1.4l-.01-.01a.996.996 0 0 0-1.41 0l-.39.39c-.38.4-.38 1.02.01 1.41z"/></svg>
                浅色
              </button>
              <button
                class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 text-black/75 dark:text-white/75 hover:text-[var(--primary)] hover:bg-[var(--btn-plain-bg-hover)]"
                :class="themeMode === 'dark' ? 'text-[var(--primary)] bg-[var(--btn-plain-bg-hover)]' : ''"
                role="menuitem"
                @click="switchTheme('dark')"
              >
                <svg width="1em" height="1em" class="text-[1.25rem]" viewBox="0 0 24 24"><path fill="currentColor" d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"/></svg>
                暗黑
              </button>
              <button
                class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 text-black/75 dark:text-white/75 hover:text-[var(--primary)] hover:bg-[var(--btn-plain-bg-hover)]"
                :class="themeMode === 'system' ? 'text-[var(--primary)] bg-[var(--btn-plain-bg-hover)]' : ''"
                role="menuitem"
                @click="switchTheme('system')"
              >
                <svg width="1em" height="1em" class="text-[1.25rem]" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 2c1.82 0 3.53.5 5 1.35C14.01 6.83 12 9.89 12 14c0 1.93.52 3.73 1.42 5.27c-.47.1-.94.23-1.42.23c-4.41 0-8-3.59-8-8s3.59-8 8-8m0 16c-.53 0-1.05-.05-1.56-.15C12.15 19.25 13 16.75 13 14c0-3.33-1.6-6.26-4.08-8.12C9.55 5.31 10.73 5 12 5c3.86 0 7 3.14 7 7s-3.14 7-7 7"/></svg>
                跟随系统
              </button>
            </div>
          </div>
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
    </div>

    <div
      id="nav-menu-panel"
      class="float-panel fixed right-4 px-2 py-2 max-h-[80vh] overflow-y-auto transition-all lg:!hidden"
      :class="{ 'float-panel-closed': !showMobileMenu }"
    >
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
</template>

<style>
#navbar {
  position: sticky;
  top: 0;
  z-index: 50;
}

#navbar > div {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 0 0 var(--radius-large) var(--radius-large);
  transition: all var(--duration-medium) var(--ease-standard);
  box-shadow: var(--shadow-navbar);
}

:root.dark #navbar > div {
  box-shadow: var(--shadow-navbar-dark);
}
</style>
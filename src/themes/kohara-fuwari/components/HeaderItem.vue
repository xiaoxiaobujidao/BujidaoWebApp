<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

type ThemeMode = 'light' | 'dark' | 'system'

const themeMode = ref<ThemeMode>('system')
const isDark = ref(false)
const showMobileMenu = ref(false)
const showAccountDropdown = ref(false)

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
  if (mode === themeMode.value) return
  themeMode.value = mode

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

function toggleTheme() {
  const nextMode = themeMode.value === 'dark' ? 'light' : 'dark'
  switchTheme(nextMode)
}

function toggleMobileMenu() {
  showMobileMenu.value = !showMobileMenu.value
}

function closeMobileMenu() {
  showMobileMenu.value = false
}

function toggleAccountDropdown() {
  showAccountDropdown.value = !showAccountDropdown.value
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

  const accountBtn = document.getElementById('account-dropdown-btn')
  const accountPanel = document.getElementById('account-dropdown-panel')
  if (
    showAccountDropdown.value &&
    accountPanel &&
    accountBtn &&
    !accountPanel.contains(target) &&
    !accountBtn.contains(target)
  ) {
    showAccountDropdown.value = false
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
  { path: '/user', name: '主页', icon: 'house' },
  { path: '/sub', name: '订阅' },
  { path: '/balance', name: '财务' },
  { path: '/node_list', name: '节点' },
  { path: '/tutorial', name: '教程' },
  { path: '/announcement', name: '公告' },
]

const accountMenu = [
  { path: '/cc', name: '个性化' },
  { path: '/signout', name: '登出' },
]

const activePath = computed(() => route.path)
</script>

<template>
  <div id="navbar">
    <nav class="nav">
      <a href="/" class="logo">布吉岛</a>

      <div class="nav-center">
        <router-link
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: activePath === item.path }"
        >
          <svg
            v-if="item.icon === 'house'"
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            class="nav-item-icon"
          >
            <path
              fill="currentColor"
              d="M4 21V9l8-6l8 6v12h-6v-7h-4v7zm2-2h2v-7h8v7h2v-9.476l-6-4.5l-6 4.5z"
            />
          </svg>
          {{ item.name }}
        </router-link>

        <div class="nav-item dropdown" id="account-dropdown-btn" @click.stop="toggleAccountDropdown">
          账号
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            class="dropdown-chevron"
            :class="{ rotated: showAccountDropdown }"
          >
            <path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z" />
          </svg>

          <div
            v-show="showAccountDropdown"
            id="account-dropdown-panel"
            class="account-dropdown-panel"
            @click.stop
          >
            <router-link
              v-for="sub in accountMenu"
              :key="sub.path"
              :to="sub.path"
              class="account-dropdown-item"
              :class="{ active: activePath === sub.path }"
              @click="showAccountDropdown = false"
            >
              {{ sub.name }}
            </router-link>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <button class="icon-btn" aria-label="切换主题" @click="toggleTheme">
          <svg
            v-show="!isDark"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 18a6 6 0 1 1 0-12a6 6 0 0 1 0 12m0-2a4 4 0 1 0 0-8a4 4 0 0 0 0 8M11 1h2v3h-2zm0 19h2v3h-2zM3.515 4.929l1.414-1.414L7.05 5.636L5.636 7.05zM16.95 18.364l1.414-1.414l2.121 2.121l-1.414 1.414zm2.121-14.85l1.414 1.415l-2.121 2.121l-1.414-1.414zM5.636 16.95l1.414 1.414l-2.121 2.121l-1.414-1.414zM23 11v2h-3v-2zM4 11v2H1v-2z"
            />
          </svg>
          <svg
            v-show="isDark"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M11.01 3.05C6.51 3.54 3 7.36 3 12a9 9 0 0 0 9 9c4.63 0 8.45-3.5 8.95-8c.09-.79-.78-1.42-1.54-.95A5.403 5.403 0 0 1 11.1 7.5c0-1.06.31-2.06.84-2.89c.45-.67-.04-1.63-.93-1.56z"
            />
          </svg>
        </button>

        <button
          aria-label="Menu"
          class="icon-btn mobile-menu-btn"
          id="nav-menu-switch"
          @click.stop="toggleMobileMenu"
        >
          <svg
            v-show="!showMobileMenu"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z" />
          </svg>
          <svg
            v-show="showMobileMenu"
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path fill="currentColor" d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z" />
          </svg>
        </button>
      </div>
    </nav>

    <div
      id="nav-menu-panel"
      class="mobile-panel"
      :class="{ closed: !showMobileMenu }"
    >
      <router-link
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="mobile-panel-item"
        :class="{ active: activePath === item.path }"
        @click="closeMobileMenu"
      >
        {{ item.name }}
      </router-link>
      <div class="mobile-panel-divider" />
      <router-link
        v-for="sub in accountMenu"
        :key="sub.path"
        :to="sub.path"
        class="mobile-panel-item"
        :class="{ active: activePath === sub.path }"
        @click="closeMobileMenu"
      >
        {{ sub.name }}
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  width: 95%;
  max-width: 1400px;
  height: 72px;
  margin: 0 auto;

  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);

  border-radius: 0 0 18px 18px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 36px;

  transition: background-color var(--duration-medium, 300ms) var(--ease-standard, ease),
              border-color var(--duration-medium, 300ms) var(--ease-standard, ease),
              box-shadow var(--duration-medium, 300ms) var(--ease-standard, ease);
}

.logo {
  font-size: 24px;
  font-weight: 600;
  color: #111;
  letter-spacing: 2px;
  text-decoration: none;
  flex-shrink: 0;
  transition: color var(--duration-fast, 150ms) var(--ease-standard, ease);
}

.nav-center {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #222;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.25s;
  white-space: nowrap;

  &:hover {
    opacity: 0.65;
  }

  &.active {
    color: var(--primary, oklch(0.7 0.14 220));
    opacity: 1;
  }
}

.nav-item-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.dropdown {
  user-select: none;
}

.dropdown-chevron {
  font-size: 12px;
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &.rotated {
    transform: rotate(180deg);
  }
}

.account-dropdown-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--card-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 6px;
  min-width: 130px;
  z-index: 100;
}

.account-dropdown-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: #222;
  font-size: 15px;
  font-weight: 500;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: var(--btn-plain-bg-hover, oklch(0.95 0.025 220));
    color: var(--primary, oklch(0.7 0.14 220));
  }

  &.active {
    color: var(--primary, oklch(0.7 0.14 220));
    background: rgba(76, 141, 246, 0.1);
  }
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.icon-btn {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.25s;
  color: #222;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
}

.mobile-menu-btn {
  display: none;
}

.mobile-panel {
  display: none;
  position: fixed;
  right: 16px;
  top: 88px;
  background: var(--card-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(0, 0, 0, 0.06);
  padding: 6px;
  min-width: 160px;
  z-index: 100;
  transition: opacity 0.2s ease, transform 0.2s ease;

  &.closed {
    opacity: 0;
    transform: translateY(-4px);
    pointer-events: none;
  }
}

.mobile-panel-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: #222;
  font-size: 15px;
  font-weight: 600;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    background: var(--btn-plain-bg-hover, oklch(0.95 0.025 220));
    color: var(--primary, oklch(0.7 0.14 220));
  }

  &.active {
    color: var(--primary, oklch(0.7 0.14 220));
  }
}

.mobile-panel-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 4px 8px;
}

/* 暗色模式 */
:global(.dark) .nav {
  background: rgba(30, 30, 36, 0.78);
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
}

:global(.dark) .logo {
  color: #eee;
}

:global(.dark) .nav-item {
  color: #ddd;
}

:global(.dark) .icon-btn {
  color: #ddd;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

:global(.dark) .account-dropdown-panel,
:global(.dark) .mobile-panel {
  background: var(--card-bg, oklch(0.23 0.015 220));
  border-color: rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

:global(.dark) .account-dropdown-item,
:global(.dark) .mobile-panel-item {
  color: #ddd;
}

:global(.dark) .mobile-panel-divider {
  background: rgba(255, 255, 255, 0.08);
}

/* 响应式 */
@media (max-width: 1000px) {
  .nav {
    padding: 0 24px;
  }

  .nav-center {
    gap: 22px;
  }

  .nav-item {
    font-size: 14px;
  }
}

@media (max-width: 700px) {
  .nav-center {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-panel {
    display: block;
  }

  .nav {
    border-radius: 0 0 12px 12px;
    height: 62px;
    padding: 0 20px;
  }

  .logo {
    font-size: 20px;
  }
}
</style>
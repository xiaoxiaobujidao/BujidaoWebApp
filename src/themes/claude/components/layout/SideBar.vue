<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useColorMode, type ColorMode } from '@/composables/useColorMode'
import { useThemeStore } from '@/stores/themeStore'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { initialOf } from '@/utils/format'
import ClMark from '@claude/components/ui/ClMark.vue'
import ClButton from '@claude/components/ui/ClButton.vue'
import { useSidebar } from '@claude/composables/useSidebar'
import { useCreditDialog } from '@claude/composables/useCreditDialog'
import { SITE_URL, TELEGRAM_GROUP, mainNav } from './nav'

const props = withDefaults(defineProps<{ mode?: 'desktop' | 'drawer' }>(), { mode: 'desktop' })

const route = useRoute()
const { collapsed: storedCollapsed, toggleCollapsed, closeDrawer } = useSidebar()
const collapsed = computed(() => props.mode === 'desktop' && storedCollapsed.value)
const { open: openCredit } = useCreditDialog()
const { mode: colorMode, setMode } = useColorMode()
const themeStore = useThemeStore()
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.getUserInfo())

const displayName = computed(() => {
  const info = userInfo.value
  if (!info) return '岛民'
  if (info.email) return info.email.split('@')[0] ?? info.email
  if (info.telegram_id) return `TG ${info.telegram_id}`
  return `岛民 #${info.user_id}`
})
const balance = computed(() => ((userInfo.value?.balance ?? 0) / 100).toFixed(2))

const menuOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)

const modeOptions: { value: ColorMode; label: string; icon: 'sun' | 'moon' | 'sun-moon' }[] = [
  { value: 'light', label: '浅色', icon: 'sun' },
  { value: 'dark', label: '深色', icon: 'moon' },
  { value: 'system', label: '系统', icon: 'sun-moon' },
]

const isActive = (path: string) =>
  route.path === path || (path === '/tutorial' && route.path === '/t')

function onNavigate() {
  menuOpen.value = false
  if (props.mode === 'drawer') closeDrawer()
}

function onDocumentClick(event: MouseEvent) {
  if (!menuRoot.value?.contains(event.target as Node)) menuOpen.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onUnmounted(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <aside class="sb" :class="{ 'is-collapsed': collapsed, 'sb--drawer': mode === 'drawer' }">
    <div class="sb__top">
      <router-link to="/user" class="sb__brand" aria-label="布吉岛" @click="onNavigate">
        <ClMark class="sb__mark" />
        <span class="sb__wordmark cl-serif">布吉岛</span>
      </router-link>
      <button
        v-if="mode === 'desktop'"
        type="button"
        class="sb__collapse"
        :aria-label="collapsed ? '展开侧栏' : '收起侧栏'"
        :title="collapsed ? '展开侧栏' : '收起侧栏'"
        @click="toggleCollapsed"
      >
        <LucideIcon name="panel-left" />
      </button>
      <button v-else type="button" class="sb__collapse" aria-label="关闭菜单" @click="closeDrawer">
        <LucideIcon name="x" />
      </button>
    </div>

    <div class="sb__cta">
      <ClButton
        variant="primary"
        icon="wallet"
        :icon-only="collapsed"
        :block="!collapsed"
        :title="collapsed ? '充值' : undefined"
        @click="openCredit"
      >
        充值
      </ClButton>
    </div>

    <nav class="sb__nav" aria-label="主导航">
      <router-link
        v-for="item in mainNav"
        :key="item.path"
        :to="item.path"
        class="sb__item"
        :class="{ 'is-active': isActive(item.path) }"
        :title="collapsed ? item.label : undefined"
        :aria-current="isActive(item.path) ? 'page' : undefined"
        @click="onNavigate"
      >
        <LucideIcon :name="item.icon" class="sb__item-icon" />
        <span class="sb__item-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sb__spacer" />

    <div class="sb__links">
      <a
        :href="TELEGRAM_GROUP"
        target="_blank"
        rel="noopener"
        class="sb__link"
        title="Telegram 群组"
      >
        <LucideIcon name="message-circle" />
        <span class="sb__item-label">Telegram 群组</span>
      </a>
      <a :href="SITE_URL" target="_blank" rel="noopener" class="sb__link" title="官网">
        <LucideIcon name="globe" />
        <span class="sb__item-label">官网</span>
      </a>
    </div>

    <div ref="menuRoot" class="sb__user-wrap">
      <Transition name="sb-pop">
        <div v-if="menuOpen" class="sb__menu" :class="{ 'sb__menu--rail': collapsed }">
          <div class="sb__menu-section">
            <p class="sb__menu-title">外观</p>
            <div class="sb__modes">
              <button
                v-for="opt in modeOptions"
                :key="opt.value"
                type="button"
                class="sb__mode"
                :class="{ 'is-active': colorMode === opt.value }"
                @click="setMode(opt.value, { event: $event })"
              >
                <LucideIcon :name="opt.icon" />
                <span>{{ opt.label }}</span>
              </button>
            </div>
          </div>
          <div v-if="themeStore.availableThemes.length > 1" class="sb__menu-section">
            <p class="sb__menu-title">站点主题</p>
            <button
              v-for="name in themeStore.availableThemes"
              :key="name"
              type="button"
              class="sb__menu-item"
              :class="{ 'is-active': name === themeStore.currentTheme }"
              @click="name !== themeStore.currentTheme && themeStore.switchTheme(name)"
            >
              <span class="sb__menu-item-label">{{ name }}</span>
              <LucideIcon v-if="name === themeStore.currentTheme" name="check" />
            </button>
          </div>
          <div class="sb__menu-section">
            <router-link
              to="/signout"
              class="sb__menu-item sb__menu-item--danger"
              @click="onNavigate"
            >
              <LucideIcon name="logout" />
              <span class="sb__menu-item-label">登出</span>
            </router-link>
          </div>
        </div>
      </Transition>

      <button
        type="button"
        class="sb__user"
        :class="{ 'is-open': menuOpen }"
        :title="collapsed ? displayName : undefined"
        aria-haspopup="menu"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <span class="sb__avatar">{{ initialOf(displayName) }}</span>
        <span class="sb__user-meta">
          <span class="sb__user-name">{{ displayName }}</span>
          <span class="sb__user-balance">余额 ¥{{ balance }}</span>
        </span>
        <LucideIcon name="chevrons-up-down" class="sb__user-caret" />
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sb {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: var(--cl-sidebar-width);
  height: 100dvh;
  padding: 1rem 0.75rem;
  background: var(--cl-sidebar-bg);
  border-right: 1px solid var(--cl-border);
  transition:
    width var(--cl-medium) var(--cl-ease),
    background-color var(--cl-medium) var(--cl-ease);
  overflow: hidden;
}

.sb.is-collapsed {
  width: var(--cl-sidebar-rail);
  padding-left: 0.6rem;
  padding-right: 0.6rem;
  align-items: center;
}

.sb--drawer {
  height: 100%;
  border-right: 0;
}

.sb__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.15rem 0.25rem 0.35rem;
}

.is-collapsed .sb__top {
  flex-direction: column;
  gap: 0.6rem;
  padding: 0;
}

.sb__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  color: var(--cl-text);
}

.sb__mark {
  font-size: 1.55rem;
  color: var(--cl-accent);
  flex-shrink: 0;
}

.sb__wordmark {
  font-size: 1.25rem;
  white-space: nowrap;
}

.is-collapsed .sb__wordmark {
  display: none;
}

.is-collapsed .sb__brand {
  justify-content: center;
  width: 2.75rem;
  height: 2.5rem;
}

.sb__collapse {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--cl-radius-sm);
  color: var(--cl-text-3);
  transition:
    background-color var(--cl-fast) var(--cl-ease),
    color var(--cl-fast) var(--cl-ease);
}

.sb__collapse:hover {
  background: var(--cl-surface-3);
  color: var(--cl-text);
}

.sb__cta {
  padding: 0 0.25rem;
}

.is-collapsed .sb__cta {
  padding: 0;
}

.sb__nav {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin-top: 0.25rem;
}

.is-collapsed .sb__nav {
  width: 100%;
  align-items: center;
}

.sb__item,
.sb__link {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  min-height: 2.5rem;
  padding: 0 0.8rem;
  border-radius: var(--cl-radius-sm);
  color: var(--cl-text-2);
  font-weight: 500;
  font-size: 0.92rem;
  white-space: nowrap;
  transition:
    background-color var(--cl-fast) var(--cl-ease),
    color var(--cl-fast) var(--cl-ease);
}

.is-collapsed .sb__item,
.is-collapsed .sb__link {
  width: 2.75rem;
  justify-content: center;
  padding: 0;
}

.sb__item:hover,
.sb__link:hover {
  background: var(--cl-surface-3);
  color: var(--cl-text);
}

.sb__item.is-active {
  background: var(--cl-surface);
  color: var(--cl-text);
  font-weight: 600;
  box-shadow: var(--cl-shadow-sm);
}

.sb__item.is-active .sb__item-icon {
  color: var(--cl-accent);
}

.sb__item-icon {
  font-size: 1.15rem;
  flex-shrink: 0;
}

.is-collapsed .sb__item-label {
  display: none;
}

.sb__spacer {
  flex: 1;
}

.sb__links {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.sb__link {
  min-height: 2.2rem;
  font-size: 0.85rem;
  color: var(--cl-text-3);
}

.sb__link :deep(.lucide) {
  font-size: 1.05rem;
}

.sb__user-wrap {
  position: relative;
}

.is-collapsed .sb__user-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.sb__user {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.45rem 0.55rem;
  border-radius: var(--cl-radius-md);
  text-align: left;
  transition: background-color var(--cl-fast) var(--cl-ease);
}

.sb__user:hover,
.sb__user.is-open {
  background: var(--cl-surface-3);
}

.is-collapsed .sb__user {
  width: auto;
  padding: 0.35rem;
}

.sb__avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  background: var(--cl-accent);
  color: var(--cl-on-accent);
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.sb__user-meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
  line-height: 1.25;
}

.is-collapsed .sb__user-meta,
.is-collapsed .sb__user-caret {
  display: none;
}

.sb__user-name {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--cl-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sb__user-balance {
  font-size: 0.75rem;
  color: var(--cl-text-3);
  font-variant-numeric: tabular-nums;
}

.sb__user-caret {
  color: var(--cl-text-3);
  flex-shrink: 0;
}

/* 用户菜单 */
.sb__menu {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 0.5rem);
  padding: 0.5rem;
  border-radius: var(--cl-radius-md);
  background: var(--cl-surface);
  border: 1px solid var(--cl-border);
  box-shadow: var(--cl-shadow-lg);
  z-index: 20;
}

.sb__menu--rail {
  left: 0;
  right: auto;
  width: 15rem;
}

.sb__menu-section + .sb__menu-section {
  margin-top: 0.4rem;
  padding-top: 0.4rem;
  border-top: 1px solid var(--cl-border);
}

.sb__menu-title {
  padding: 0.2rem 0.6rem 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--cl-text-3);
}

.sb__modes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
  padding: 0 0.2rem;
}

.sb__mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.25rem;
  border-radius: var(--cl-radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--cl-text-2);
  transition:
    background-color var(--cl-fast) var(--cl-ease),
    color var(--cl-fast) var(--cl-ease);
}

.sb__mode :deep(.lucide) {
  font-size: 1.15rem;
}

.sb__mode:hover {
  background: var(--cl-surface-2);
}

.sb__mode.is-active {
  background: var(--cl-accent-soft);
  color: var(--cl-accent-ink);
}

.sb__menu-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  min-height: 2.25rem;
  padding: 0 0.6rem;
  border-radius: var(--cl-radius-sm);
  color: var(--cl-text-2);
  font-size: 0.88rem;
  font-weight: 500;
  text-align: left;
  transition:
    background-color var(--cl-fast) var(--cl-ease),
    color var(--cl-fast) var(--cl-ease);
}

.sb__menu-item:hover {
  background: var(--cl-surface-2);
  color: var(--cl-text);
}

.sb__menu-item.is-active {
  color: var(--cl-accent-ink);
  font-weight: 600;
}

.sb__menu-item--danger:hover {
  background: var(--cl-danger-soft);
  color: var(--cl-danger-ink);
}

.sb__menu-item-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sb-pop-enter-active,
.sb-pop-leave-active {
  transition:
    opacity var(--cl-fast) var(--cl-ease),
    transform var(--cl-fast) var(--cl-ease);
}

.sb-pop-enter-from,
.sb-pop-leave-to {
  opacity: 0;
  transform: translateY(0.35rem);
}
</style>

<script setup lang="ts">
import type { ThemeId } from '@violet-rose/themes/types'
import { getTheme } from '@violet-rose/themes/config'
import ThemeBackground from '@violet-rose/components/theme/ThemeBackground.vue'
import AppHeader from '@violet-rose/components/layout/AppHeader.vue'
import AppFooter from '@violet-rose/components/layout/AppFooter.vue'

const props = defineProps<{
  theme: ThemeId
}>()

const themeMeta = getTheme(props.theme)
</script>

<template>
  <div class="layout" :data-theme="theme">
    <ThemeBackground :theme="theme" />
    <AppHeader :meta="themeMeta" />
    <main class="layout__main">
      <slot />
    </main>
    <AppFooter :footer-text="themeMeta.footer" />
  </div>
</template>

<style scoped>
.layout {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.layout__main {
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 1.5rem 1rem 2rem;
}

@media (min-width: 768px) {
  .layout__main {
    padding: 2rem 1.5rem 3rem;
  }
}
</style>

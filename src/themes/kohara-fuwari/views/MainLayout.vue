<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useColorMode } from '@/composables/useColorMode'
import { useHue } from '@kohara-fuwari/composables/useHue'
import '@kohara-fuwari/assets/style/main.scss'

// 尽早应用明暗模式与色相，避免首屏闪烁
useColorMode()
useHue()
</script>

<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.18s var(--ease-standard);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

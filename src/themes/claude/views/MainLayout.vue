<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useColorMode } from '@/composables/useColorMode'
import '@claude/assets/style/main.scss'

// 尽早应用明暗模式，避免首屏闪烁
useColorMode()
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
  transition: opacity 0.16s var(--cl-ease);
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

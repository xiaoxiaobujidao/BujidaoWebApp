<template>
  <RouterView />
  <ScreenSize />
  <ThemeSwitcher />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import ScreenSize from '@bujidao/components/ScreenSize.vue'
import ThemeSwitcher from '@bujidao/components/ThemeSwitcher.vue'
import '@bujidao/assets/styles/global.css'
</script>

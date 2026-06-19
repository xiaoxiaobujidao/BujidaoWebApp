<template>
  <RouterView />
  <ThemeSwitcher />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ThemeSwitcher from '@blush-cherry-blossoms/components/ThemeSwitcher.vue'
</script>

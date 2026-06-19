<template>
  <RouterView />
  <ThemeSwitcher />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ThemeSwitcher from '@violet-rose/components/ThemeSwitcher.vue'
</script>

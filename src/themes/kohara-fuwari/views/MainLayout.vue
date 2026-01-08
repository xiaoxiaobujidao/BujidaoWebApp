<template>
  <RouterView />
  <ScreenSize />
  <ThemeSwitcher />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import ScreenSize from '@kohara-fuwari/components/ScreenSize.vue'
import ThemeSwitcher from '@kohara-fuwari/components/ThemeSwitcher.vue'
</script>
<style lang="scss">
.dark {
  .box {
    background-color: #2e303d !important;
  }

  .box.phone {
    padding: 8px;
  }
}
</style>
<template>
  <RouterView />
  <ScreenSize />
  <ThemeSwitcher />
</template>
<script setup lang="ts">
import { RouterView } from 'vue-router'
import ScreenSize from '@test/components/ScreenSize.vue'
import ThemeSwitcher from '@test/components/ThemeSwitcher.vue'
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

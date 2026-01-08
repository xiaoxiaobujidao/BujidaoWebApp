<script setup lang="ts">
// import DarkTheme from '@kohara-fuwari/components/DarkTheme.vue'
import HeaderItem from '@kohara-fuwari/components/HeaderItem.vue'
</script>

<template>
  <HeaderItem />
  <div class="main">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: calc(100vh - 60px);

  .content {
    position: relative;
    top: 60px;
    padding: 20px;
  }
}
</style>

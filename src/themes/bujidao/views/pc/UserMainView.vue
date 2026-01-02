<script setup lang="ts">
// import DarkTheme from '@bujidao/components/DarkTheme.vue'
import HeaderItem from '@bujidao/components/HeaderItem.vue'
import UserMenu from '@bujidao/components/UserMenu.vue'
</script>

<template>
  <HeaderItem />
  <div class="main">
    <div class="menu">
      <UserMenu />
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main {
  height: calc(100vh - 60px);

  .menu {
    position: fixed;
    left: 0;
    top: 60px;
    height: 100%;
    width: 150px;
    overflow: auto;
  }

  .content {
    position: relative;
    top: 60px;
    margin-left: 150px;
    padding: 20px;
  }
}
</style>

<script setup lang="ts">
import ThemeDark from './icons/ThemeDark.vue'
import TelegramMark from './icons/TelegramMark.vue'
import GithubMark from './icons/GithubMark.vue'
</script>

<template>
  <div class="header box">
    <div></div>
    <h1>百慕大里的小小布吉岛～</h1>
    <div class="icons">
      <div>
        <TelegramMark />
      </div>
      <div>
        <GithubMark />
      </div>
      <div>
        <ThemeDark />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.dark {
  .header {
    border: 1px solid #333;
  }
}

.header {
  height: 60px !important;
  width: 100%;
  position: fixed;
  z-index: 999;
  border: 1px solid #eee;
  background-color: rgba(250, 250, 250, 0.9);
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;

  // box-shadow: 0px 1px 10px -6px var(--el-text-color-primary);
  .icons {
    margin-right: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    > div {
      margin-right: 16px;
      cursor: pointer;
    }

    :deep(svg) {
      width: 38px;
      height: 38px;
    }
  }

  h1 {
    text-align: center;
    line-height: 60px;
  }
}
</style>

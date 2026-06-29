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
.header {
  height: var(--header-height) !important;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  align-items: center;
  border-bottom: 1px solid var(--color-surface-border);
  background: var(--color-surface);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: var(--shadow-soft);

  .icons {
    margin-right: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;

    > div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background: rgba(84, 169, 235, 0.12);
      }
    }

    :deep(svg) {
      width: 28px;
      height: 28px;
    }
  }

  h1 {
    text-align: center;
    line-height: 1.2;
    font-size: clamp(0.95rem, 2.5vw, 1.15rem);
    font-weight: 600;
    letter-spacing: 0.02em;
    color: var(--color-text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 8px;
  }
}

:global(.dark) .header {
  border-bottom-color: var(--color-surface-border);
}
</style>

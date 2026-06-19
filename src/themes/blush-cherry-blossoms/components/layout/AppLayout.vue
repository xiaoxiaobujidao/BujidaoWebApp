<script setup lang="ts">
import SakuraBackground from '@blush-cherry-blossoms/components/sakura/SakuraBackground.vue'
import AppHeader from '@blush-cherry-blossoms/components/layout/AppHeader.vue'
import AppFooter from '@blush-cherry-blossoms/components/layout/AppFooter.vue'
</script>

<template>
  <div class="layout">
    <SakuraBackground />
    <AppHeader />
    <main class="layout__main">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.layout {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

.layout__main {
  position: relative;
  z-index: 1;
  flex: 1;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 1.5rem 1rem 2rem;
}

@media (min-width: 768px) {
  .layout__main {
    padding: 2rem 1.5rem 3rem;
  }
}
</style>

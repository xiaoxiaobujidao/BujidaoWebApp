<script setup lang="ts">
defineProps<{
  footerText: string
}>()
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <p class="footer__text">© {{ new Date().getFullYear() }} {{ footerText }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  position: relative;
  z-index: 1;
  padding-bottom: var(--safe-area-bottom);
  background: var(--footer-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-top: 1px solid var(--color-surface-border);
}

.footer__inner {
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 1rem;
  text-align: center;
}

.footer__text {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}
</style>

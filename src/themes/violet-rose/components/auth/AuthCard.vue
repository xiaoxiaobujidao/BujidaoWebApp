<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <section class="auth">
    <div class="auth__card">
      <span class="auth__logo" aria-hidden="true">🥀</span>
      <h1 class="auth__title">{{ title }}</h1>
      <p v-if="subtitle" class="auth__subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.auth {
  display: flex;
  justify-content: center;
  padding: 1rem 0 2rem;
}

.auth__card {
  width: 100%;
  max-width: 400px;
  padding: 2rem 1.75rem;
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-soft);
}

.auth__logo {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.auth__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.35rem;
}

.auth__subtitle {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
</style>

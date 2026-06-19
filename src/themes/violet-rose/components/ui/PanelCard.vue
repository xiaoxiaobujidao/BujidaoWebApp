<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <section class="panel">
    <header v-if="title || $slots.header" class="panel__header">
      <slot name="header">
        <div>
          <h2 v-if="title" class="panel__title">{{ title }}</h2>
          <p v-if="subtitle" class="panel__subtitle">{{ subtitle }}</p>
        </div>
      </slot>
      <slot name="actions" />
    </header>
    <div class="panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.panel__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 0;
}

.panel__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.panel__subtitle {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.panel__body {
  padding: 1.25rem 1.5rem 1.5rem;
}
</style>

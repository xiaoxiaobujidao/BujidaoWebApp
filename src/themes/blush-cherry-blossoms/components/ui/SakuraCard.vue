<script setup lang="ts">
defineProps<{
  title?: string
  subtitle?: string
  accent?: boolean
}>()
</script>

<template>
  <section class="sakura-card" :class="{ 'sakura-card--accent': accent }">
    <header v-if="title || $slots.header" class="sakura-card__header">
      <slot name="header">
        <div class="sakura-card__titles">
          <span v-if="accent" class="sakura-card__petal" aria-hidden="true">🌸</span>
          <div>
            <h2 v-if="title" class="sakura-card__title">{{ title }}</h2>
            <p v-if="subtitle" class="sakura-card__subtitle">{{ subtitle }}</p>
          </div>
        </div>
      </slot>
      <slot name="actions" />
    </header>
    <div class="sakura-card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.sakura-card {
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-soft);
  overflow: hidden;
}

.sakura-card--accent {
  border-color: var(--color-sakura-deep);
}

.sakura-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.15rem 1.35rem 0;
}

.sakura-card__titles {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.sakura-card__petal {
  font-size: 1.1rem;
  line-height: 1.4;
}

.sakura-card__title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.sakura-card__subtitle {
  margin-top: 0.2rem;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
}

.sakura-card__body {
  padding: 1.15rem 1.35rem 1.35rem;
}
</style>

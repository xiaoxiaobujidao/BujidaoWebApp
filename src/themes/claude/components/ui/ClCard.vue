<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    icon?: LucideName
    flush?: boolean
    /** 去掉边框与背景，仅作分组 */
    plain?: boolean
  }>(),
  { flush: false, plain: false },
)
</script>

<template>
  <section class="cl-card" :class="{ 'cl-card--plain': plain }">
    <header v-if="title || $slots.actions" class="cl-card__head">
      <div class="cl-card__heading">
        <h2 v-if="title" class="cl-card__title cl-serif">
          <LucideIcon v-if="icon" :name="icon" class="cl-card__icon" />
          {{ title }}
        </h2>
        <p v-if="subtitle" class="cl-card__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="cl-card__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="cl-card__body" :class="{ 'cl-card__body--flush': flush }">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="cl-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.cl-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--cl-surface);
  border: 1px solid var(--cl-border);
  border-radius: var(--cl-radius-lg);
  box-shadow: var(--cl-shadow-sm);
  transition:
    background-color var(--cl-medium) var(--cl-ease),
    border-color var(--cl-medium) var(--cl-ease);
}

.cl-card--plain {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}

.cl-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.35rem 1.5rem 0;
}

.cl-card--plain .cl-card__head {
  padding-left: 0;
  padding-right: 0;
}

.cl-card__heading {
  min-width: 0;
}

.cl-card__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  line-height: 1.3;
  color: var(--cl-text);
}

.cl-card__icon {
  color: var(--cl-accent);
  font-size: 1.05rem;
}

.cl-card__subtitle {
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: var(--cl-text-3);
}

.cl-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.cl-card__body {
  padding: 1.25rem 1.5rem 1.5rem;
  min-width: 0;
}

.cl-card--plain .cl-card__body {
  padding-left: 0;
  padding-right: 0;
}

.cl-card__body--flush {
  padding: 1rem 0 0;
}

.cl-card__footer {
  padding: 0 1.5rem 1.25rem;
  color: var(--cl-text-3);
  font-size: 0.85rem;
}

@media (max-width: 767px) {
  .cl-card__head {
    padding: 1.1rem 1rem 0;
  }

  .cl-card__body {
    padding: 1rem;
  }

  .cl-card__body--flush {
    padding: 0.75rem 0 0;
  }

  .cl-card__footer {
    padding: 0 1rem 1rem;
  }
}
</style>

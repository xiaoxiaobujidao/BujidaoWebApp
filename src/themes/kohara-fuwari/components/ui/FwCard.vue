<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'

withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    icon?: LucideName
    /** 取消内边距（放表格等需要贴边的内容） */
    flush?: boolean
    /** 悬停抬起效果 */
    hoverable?: boolean
  }>(),
  { flush: false, hoverable: false },
)
</script>

<template>
  <section class="fw-card card-base" :class="{ 'fw-card--hoverable': hoverable }">
    <header v-if="title || $slots.actions" class="fw-card__head">
      <div class="fw-card__heading">
        <h2 v-if="title" class="widget-title fw-card__title">
          <LucideIcon v-if="icon" :name="icon" class="fw-card__icon" />
          {{ title }}
        </h2>
        <p v-if="subtitle" class="fw-card__subtitle">{{ subtitle }}</p>
      </div>
      <div v-if="$slots.actions" class="fw-card__actions">
        <slot name="actions" />
      </div>
    </header>
    <div class="fw-card__body" :class="{ 'fw-card__body--flush': flush }">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="fw-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped>
.fw-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.fw-card--hoverable:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.fw-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem 0;
}

.fw-card__heading {
  min-width: 0;
}

.fw-card__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fw-card__icon {
  color: var(--primary);
  font-size: 1.1rem;
}

.fw-card__subtitle {
  margin-top: 0.3rem;
  padding-left: 1rem;
  font-size: 0.85rem;
  color: var(--text-3);
}

.fw-card__actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.fw-card__body {
  padding: 1.25rem 1.5rem 1.5rem;
  min-width: 0;
}

.fw-card__body--flush {
  padding: 1rem 0 0;
}

.fw-card__footer {
  padding: 0 1.5rem 1.25rem;
  color: var(--text-3);
  font-size: 0.85rem;
}

@media (max-width: 767px) {
  .fw-card__head {
    padding: 1rem 1rem 0;
  }

  .fw-card__body {
    padding: 1rem;
  }

  .fw-card__body--flush {
    padding: 0.75rem 0 0;
  }

  .fw-card__footer {
    padding: 0 1rem 1rem;
  }
}
</style>

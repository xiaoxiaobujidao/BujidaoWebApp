<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'
import ClMark from '@claude/components/ui/ClMark.vue'

withDefaults(
  defineProps<{
    icon?: LucideName
    title: string
    description?: string
    tone?: 'accent' | 'success' | 'danger'
    loading?: boolean
  }>(),
  { tone: 'accent', loading: false },
)
</script>

<template>
  <div class="status cl-rise" :class="`status--${tone}`">
    <span class="status__icon">
      <LucideIcon v-if="loading" name="loader" class="spin" />
      <LucideIcon v-else-if="icon" :name="icon" />
      <ClMark v-else />
    </span>
    <h1 class="status__title cl-serif">{{ title }}</h1>
    <p v-if="description" class="status__desc">{{ description }}</p>
    <div v-if="$slots.default" class="status__actions"><slot /></div>
  </div>
</template>

<style scoped>
.status {
  --tone: var(--cl-accent);
  --tone-soft: var(--cl-accent-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 2.5rem 2rem;
  text-align: center;
  background: var(--cl-surface);
  border: 1px solid var(--cl-border);
  border-radius: var(--cl-radius-lg);
  box-shadow: var(--cl-shadow-md);
}

.status--success {
  --tone: var(--cl-success-ink);
  --tone-soft: var(--cl-success-soft);
}

.status--danger {
  --tone: var(--cl-danger-ink);
  --tone-soft: var(--cl-danger-soft);
}

.status__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background: var(--tone-soft);
  color: var(--tone);
  font-size: 1.9rem;
  margin-bottom: 0.4rem;
}

.status__title {
  font-size: 1.5rem;
}

.status__desc {
  color: var(--cl-text-3);
  font-size: 0.9rem;
  line-height: 1.6;
  max-width: 22rem;
}

.status__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-top: 0.75rem;
}
</style>

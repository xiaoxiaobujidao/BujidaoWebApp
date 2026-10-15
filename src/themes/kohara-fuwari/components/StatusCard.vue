<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'

withDefaults(
  defineProps<{
    icon?: LucideName
    title: string
    description?: string
    tone?: 'primary' | 'success' | 'danger'
    loading?: boolean
  }>(),
  { icon: 'island', tone: 'primary', loading: false },
)
</script>

<template>
  <div class="status card-base onload-animation" :class="`status--${tone}`">
    <span class="status__icon">
      <LucideIcon v-if="loading" name="loader" class="spin" />
      <LucideIcon v-else :name="icon" />
    </span>
    <h1 class="status__title">{{ title }}</h1>
    <p v-if="description" class="status__desc">{{ description }}</p>
    <div v-if="$slots.default" class="status__actions"><slot /></div>
  </div>
</template>

<style scoped>
.status {
  --tone: var(--primary);
  --tone-soft: var(--primary-soft);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 2.5rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-float);
  border: 1px solid var(--line-divider);
}

.status--success {
  --tone: var(--success);
  --tone-soft: var(--success-soft);
}

.status--danger {
  --tone: var(--danger);
  --tone-soft: var(--danger-soft);
}

.status__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 1.25rem;
  background: var(--tone-soft);
  color: var(--tone);
  font-size: 1.9rem;
  margin-bottom: 0.4rem;
}

.status__title {
  font-size: 1.35rem;
  font-weight: 800;
}

.status__desc {
  color: var(--text-3);
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

<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'
import ClMark from './ClMark.vue'

withDefaults(
  defineProps<{
    icon?: LucideName
    title?: string
    description?: string
    loading?: boolean
  }>(),
  { title: '这里空空如也', loading: false },
)
</script>

<template>
  <div class="cl-empty" role="status">
    <span class="cl-empty__icon">
      <LucideIcon v-if="loading" name="loader" class="spin" />
      <LucideIcon v-else-if="icon" :name="icon" />
      <ClMark v-else />
    </span>
    <p class="cl-empty__title cl-serif">{{ loading ? '加载中…' : title }}</p>
    <p v-if="description && !loading" class="cl-empty__desc">{{ description }}</p>
    <div v-if="$slots.default && !loading" class="cl-empty__actions"><slot /></div>
  </div>
</template>

<style scoped>
.cl-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--cl-text-3);
}

.cl-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 1rem;
  background: var(--cl-accent-soft);
  color: var(--cl-accent);
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.cl-empty__title {
  font-size: 1.05rem;
  color: var(--cl-text);
}

.cl-empty__desc {
  font-size: 0.85rem;
  max-width: 28rem;
  line-height: 1.6;
}

.cl-empty__actions {
  margin-top: 0.6rem;
}
</style>

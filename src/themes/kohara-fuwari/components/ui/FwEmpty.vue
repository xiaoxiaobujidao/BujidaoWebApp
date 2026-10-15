<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import type { LucideName } from '@/components/icons/lucide'

withDefaults(
  defineProps<{
    icon?: LucideName
    title?: string
    description?: string
    /** 加载中（显示转圈） */
    loading?: boolean
  }>(),
  { icon: 'island', title: '这里空空如也', loading: false },
)
</script>

<template>
  <div class="fw-empty" role="status">
    <span class="fw-empty__icon">
      <LucideIcon v-if="loading" name="loader" class="spin" />
      <LucideIcon v-else :name="icon" />
    </span>
    <p class="fw-empty__title">{{ loading ? '加载中…' : title }}</p>
    <p v-if="description && !loading" class="fw-empty__desc">{{ description }}</p>
    <div v-if="$slots.default && !loading" class="fw-empty__actions"><slot /></div>
  </div>
</template>

<style scoped>
.fw-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2.5rem 1rem;
  text-align: center;
  color: var(--text-3);
}

.fw-empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: var(--radius-md);
  background: var(--btn-plain-bg-hover);
  color: var(--primary);
  font-size: 1.5rem;
}

.fw-empty__title {
  font-weight: 600;
  color: var(--text-2);
}

.fw-empty__desc {
  font-size: 0.85rem;
  max-width: 28rem;
}

.fw-empty__actions {
  margin-top: 0.5rem;
}
</style>

<script setup lang="ts">
import { touchCopy } from '@/utils/copy'

defineProps<{
  label: string
  value: string
}>()
</script>

<template>
  <button class="copy-field" type="button" @click="touchCopy(value)">
    <span class="copy-field__label">{{ label }}</span>
    <span class="copy-field__value">{{ value }}</span>
    <span class="copy-field__hint">点击复制</span>
  </button>
</template>

<style scoped>
.copy-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
  padding: 0.85rem 1rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  transition: border-color 0.2s, background 0.2s;
}

.copy-field:hover {
  background: rgba(255, 255, 255, 0.55);
  border-color: var(--color-sakura-deep);
}

.copy-field__label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.copy-field__value {
  font-size: 0.85rem;
  color: var(--color-text-primary);
  word-break: break-all;
  line-height: 1.45;
}

.copy-field__hint {
  font-size: 0.75rem;
  color: var(--color-sakura-deep);
}
</style>

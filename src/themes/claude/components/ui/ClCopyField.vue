<script setup lang="ts">
import { ref } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { touchCopy } from '@/utils/copy'

const props = withDefaults(
  defineProps<{
    label?: string
    value: string
    hint?: string
    compact?: boolean
  }>(),
  { compact: false },
)

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function copy() {
  if (!props.value) return
  touchCopy(props.value)
  copied.value = true
  clearTimeout(timer)
  timer = setTimeout(() => {
    copied.value = false
  }, 1400)
}
</script>

<template>
  <div
    class="cl-copy"
    :class="{ 'cl-copy--compact': compact, 'is-copied': copied }"
    role="button"
    tabindex="0"
    :title="'点击复制' + (label ?? '')"
    @click="copy"
    @keydown.enter.prevent="copy"
    @keydown.space.prevent="copy"
  >
    <div v-if="!compact && (label || hint)" class="cl-copy__meta">
      <span v-if="label" class="cl-copy__label">{{ label }}</span>
      <span v-if="hint" class="cl-copy__hint">{{ hint }}</span>
    </div>
    <div class="cl-copy__row">
      <code class="cl-copy__value">{{ value }}</code>
      <span class="cl-copy__btn" aria-hidden="true">
        <LucideIcon :name="copied ? 'check' : 'copy'" />
        <span class="cl-copy__btn-text">{{ copied ? '已复制' : '复制' }}</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.cl-copy {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.75rem 0.9rem;
  border-radius: var(--cl-radius-md);
  border: 1px solid var(--cl-border);
  background: var(--cl-surface-2);
  cursor: pointer;
  transition:
    border-color var(--cl-fast) var(--cl-ease),
    background-color var(--cl-fast) var(--cl-ease);
}

.cl-copy:hover {
  border-color: var(--cl-accent);
}

.cl-copy.is-copied {
  border-color: var(--cl-success);
  background: var(--cl-success-soft);
}

.cl-copy__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}

.cl-copy__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cl-text);
}

.cl-copy__hint {
  font-size: 0.75rem;
  color: var(--cl-text-3);
  text-align: right;
}

.cl-copy__row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.cl-copy__value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--cl-text-2);
  font-family: var(--cl-font-mono);
  font-size: 0.8rem;
}

.cl-copy__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  height: 1.9rem;
  padding: 0 0.6rem;
  border-radius: 999px;
  background: var(--cl-surface);
  border: 1px solid var(--cl-border);
  color: var(--cl-text-2);
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
  transition:
    color var(--cl-fast) var(--cl-ease),
    border-color var(--cl-fast) var(--cl-ease);
}

.cl-copy:hover .cl-copy__btn {
  color: var(--cl-accent-ink);
  border-color: var(--cl-accent);
}

.is-copied .cl-copy__btn {
  color: var(--cl-success-ink);
  border-color: var(--cl-success);
}

.cl-copy--compact .cl-copy__btn-text {
  display: none;
}

.cl-copy--compact .cl-copy__btn {
  width: 1.9rem;
  padding: 0;
  justify-content: center;
}

@media (max-width: 479px) {
  .cl-copy__btn-text {
    display: none;
  }

  .cl-copy__btn {
    width: 1.9rem;
    padding: 0;
    justify-content: center;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { touchCopy } from '@/utils/copy'

const props = withDefaults(
  defineProps<{
    label?: string
    value: string
    hint?: string
    /** 等宽字体展示 */
    mono?: boolean
    /** 紧凑模式（无标签） */
    compact?: boolean
  }>(),
  { mono: true, compact: false },
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
    class="fw-copy"
    :class="{ 'fw-copy--compact': compact, 'is-copied': copied }"
    role="button"
    tabindex="0"
    :title="'点击复制' + (label ? label : '')"
    @click="copy"
    @keydown.enter.prevent="copy"
    @keydown.space.prevent="copy"
  >
    <div v-if="!compact && (label || hint)" class="fw-copy__meta">
      <span v-if="label" class="fw-copy__label">{{ label }}</span>
      <span v-if="hint" class="fw-copy__hint">{{ hint }}</span>
    </div>
    <div class="fw-copy__row">
      <span class="fw-copy__value" :class="{ mono }">{{ value }}</span>
      <span class="fw-copy__btn" aria-hidden="true">
        <LucideIcon :name="copied ? 'check' : 'copy'" />
      </span>
    </div>
  </div>
</template>

<style scoped>
.fw-copy {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.7rem 0.9rem;
  border-radius: var(--radius-md);
  background: var(--btn-plain-bg-hover);
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.fw-copy:hover {
  border-color: var(--primary);
}

.fw-copy.is-copied {
  border-color: var(--success);
  background: var(--success-soft);
}

.fw-copy__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
}

.fw-copy__label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-1);
}

.fw-copy__hint {
  font-size: 0.75rem;
  color: var(--text-3);
  text-align: right;
}

.fw-copy__row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
}

.fw-copy__value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-2);
  font-size: 0.85rem;
}

.fw-copy__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: var(--radius-sm);
  background: var(--card-bg);
  color: var(--btn-content);
  flex-shrink: 0;
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.is-copied .fw-copy__btn {
  color: var(--success);
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { lucidePaths, type LucideName } from './lucide'

const props = withDefaults(
  defineProps<{
    name: LucideName
    /** 尺寸，默认跟随字号（1em） */
    size?: number | string
    strokeWidth?: number
  }>(),
  { size: '1em', strokeWidth: 2 },
)

const sizeValue = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))
const inner = computed(() => lucidePaths[props.name] ?? '')
</script>

<template>
  <svg
    class="lucide"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="strokeWidth"
    stroke-linecap="round"
    stroke-linejoin="round"
    :width="sizeValue"
    :height="sizeValue"
    aria-hidden="true"
    focusable="false"
    v-html="inner"
  />
</template>

<style scoped>
.lucide {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: -0.125em;
}
</style>

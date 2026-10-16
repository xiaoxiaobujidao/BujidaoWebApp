<script setup lang="ts">
/**
 * 主题标志：八芒星火花（原创绘制，非任何商标）。
 */
withDefaults(defineProps<{ size?: number | string }>(), { size: '1em' })

// 8 条射线，长短交替，带一点手绘的不规则
const rays = [
  { angle: 0, len: 10 },
  { angle: 45, len: 7.2 },
  { angle: 90, len: 9.4 },
  { angle: 135, len: 7.6 },
  { angle: 180, len: 10 },
  { angle: 225, len: 7 },
  { angle: 270, len: 9.6 },
  { angle: 315, len: 7.4 },
]
</script>

<template>
  <svg
    class="cl-mark"
    viewBox="0 0 24 24"
    :width="typeof size === 'number' ? `${size}px` : size"
    :height="typeof size === 'number' ? `${size}px` : size"
    aria-hidden="true"
    focusable="false"
  >
    <g fill="currentColor">
      <path
        v-for="ray in rays"
        :key="ray.angle"
        :transform="`rotate(${ray.angle} 12 12)`"
        :d="`M12 12 L10.6 ${12 - ray.len * 0.35} Q12 ${12 - ray.len - 1.2} 13.4 ${12 - ray.len * 0.35} Z`"
      />
      <circle cx="12" cy="12" r="2.1" />
    </g>
  </svg>
</template>

<style scoped>
.cl-mark {
  display: inline-block;
  flex-shrink: 0;
  vertical-align: -0.125em;
}
</style>

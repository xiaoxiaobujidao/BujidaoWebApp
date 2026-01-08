<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useScreenStore } from '@kohara-fuwari/stores/screenStore'

const screenStore = useScreenStore()
// 防抖函数
function debounce(func: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return function (...args: any[]) {
    clearTimeout(timer)
    timer = setTimeout(() => func(...args), delay)
  }
}

// 防抖更新屏幕尺寸的回调
const updateSizeDebounced = debounce(() => {
  console.log('updateSizeDebounced')
  screenStore.updateSize()
}, 300) // 300ms 防抖延迟

// 提供屏幕尺寸给父组件或其他组件
onMounted(() => {
  // 初始化时立即更新，不使用防抖
  screenStore.updateSize()
  // 监听窗口尺寸变化时使用防抖
  window.addEventListener('resize', updateSizeDebounced)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateSizeDebounced)
})
</script>
<template></template>
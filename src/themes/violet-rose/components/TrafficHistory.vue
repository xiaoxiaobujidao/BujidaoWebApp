<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { getUserTrafficHistory } from '@/utils/user'
import * as echarts from 'echarts'

type ViewMode = 'detail' | 'hourly' | 'daily'

const trafficHistory = ref<{ usage: number; balance: number; update_time: number }[]>()
const viewMode = ref<ViewMode>('detail')
const chartEl = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

getUserTrafficHistory()
  .then((res) => {
    trafficHistory.value = res.result.sort((a, b) => a.update_time - b.update_time)
  })
  .catch((err) => {
    ElMessage.error(String(err))
  })

function aggregate(
  granularity: 'hour' | 'day',
): { time: string; usage: number; balance: number; update_time: number }[] {
  if (!trafficHistory.value) return []
  const map = new Map<string, { usage: number; balance: number; update_time: number }>()
  for (const item of trafficHistory.value) {
    const date = new Date(item.update_time / 1000)
    const key =
      granularity === 'day'
        ? date.toLocaleDateString()
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`
    if (!map.has(key)) {
      map.set(key, { usage: 0, balance: 0, update_time: item.update_time })
    }
    const entry = map.get(key)!
    entry.usage += item.usage
    entry.balance = item.balance
    entry.update_time = item.update_time
  }
  return Array.from(map.entries())
    .map(([time, data]) => ({
      time,
      usage: data.usage / 100,
      balance: data.balance / 100,
      update_time: data.update_time,
    }))
    .sort((a, b) => a.update_time - b.update_time)
}

const chartData = computed(() => {
  if (viewMode.value === 'hourly') return aggregate('hour')
  if (viewMode.value === 'daily') return aggregate('day')
  return (
    trafficHistory.value?.map((item) => ({
      time: new Date(item.update_time / 1000).toLocaleDateString(),
      usage: item.usage / 100,
      balance: item.balance / 100,
      update_time: item.update_time,
    })) ?? []
  )
})

function renderChart() {
  if (!chart) return
  chart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['余额', '使用量'] },
    xAxis: { type: 'category', data: chartData.value.map((d) => d.time) },
    yAxis: [
      { name: '余额', type: 'value', axisLabel: { formatter: '{value} 元' } },
      { name: '使用量', type: 'value', axisLabel: { formatter: '{value} 元' } },
    ],
    series: [
      { name: '余额', type: 'line', data: chartData.value.map((d) => d.balance) },
      { name: '使用量', type: 'line', smooth: true, yAxisIndex: 1, data: chartData.value.map((d) => d.usage) },
    ],
  })
  chart.resize()
}

onMounted(() => {
  nextTick(() => {
    if (!chartEl.value) return
    chart = echarts.init(chartEl.value, undefined, { renderer: 'svg' })
    watch([chartData, viewMode], renderChart, { immediate: true })
    window.addEventListener('resize', () => chart?.resize())
  })
})

onUnmounted(() => {
  chart?.dispose()
  chart = null
})
</script>

<template>
  <div class="traffic">
    <div class="traffic__tabs">
      <button
        v-for="mode in (['detail', 'hourly', 'daily'] as const)"
        :key="mode"
        type="button"
        class="traffic__tab"
        :class="{ 'traffic__tab--active': viewMode === mode }"
        @click="viewMode = mode"
      >
        {{ mode === 'detail' ? '详细' : mode === 'hourly' ? '每小时' : '每日' }}
      </button>
    </div>
    <div ref="chartEl" class="traffic__chart" />
  </div>
</template>

<style scoped>
.traffic__tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.traffic__tab {
  padding: 0.4rem 0.85rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid var(--color-surface-border);
  border-radius: 999px;
}

.traffic__tab--active {
  color: #fff;
  background: var(--color-accent);
  border-color: transparent;
}

.traffic__chart {
  width: 100%;
  height: 55vh;
  min-height: 280px;
}
</style>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import * as echarts from 'echarts'
import { useColorMode } from '@/composables/useColorMode'
import { useViewport } from '@/composables/useViewport'
import { aggregateTraffic, type TrafficRecord, type TrafficViewMode } from '@/utils/trafficHistory'
import { useHue } from '@kohara-fuwari/composables/useHue'

const props = defineProps<{
  history: TrafficRecord[]
  mode: TrafficViewMode
}>()

const { isDark } = useColorMode()
const { hue } = useHue()
const { width } = useViewport()

const el = ref<HTMLDivElement | null>(null)
const chart = shallowRef<echarts.ECharts | null>(null)

const series = computed(() => aggregateTraffic(props.history, props.mode))

/** 从页面样式中读取主题颜色，保证与色相滑块同步 */
function cssColor(variable: string, fallback: string) {
  const probe = document.createElement('span')
  probe.style.color = `var(${variable})`
  probe.style.display = 'none'
  document.body.appendChild(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  return value && value !== 'rgba(0, 0, 0, 0)' ? value : fallback
}

function buildOption(): echarts.EChartsOption {
  const h = hue.value
  const primary = cssColor('--primary', `oklch(0.7 0.14 ${h})`)
  const text2 = cssColor('--text-2', '#666')
  const text3 = cssColor('--text-3', '#999')
  const line = cssColor('--line-divider', 'rgba(0,0,0,0.08)')
  const usageColor = `oklch(${isDark.value ? 0.78 : 0.7} 0.14 ${(h + 50) % 360})`
  const panelBg = cssColor('--float-panel-bg', '#fff')
  const many = series.value.labels.length > 48

  return {
    backgroundColor: 'transparent',
    animationDuration: 500,
    color: [primary, usageColor],
    textStyle: { color: text2, fontFamily: 'inherit' },
    tooltip: {
      trigger: 'axis',
      backgroundColor: panelBg,
      borderColor: line,
      borderWidth: 1,
      padding: [8, 12],
      textStyle: { color: text2, fontSize: 12 },
      extraCssText: 'border-radius:10px;box-shadow:0 10px 30px -12px rgba(0,0,0,.35);',
      axisPointer: { type: 'cross', label: { backgroundColor: primary } },
      valueFormatter: (value) => `${Number(value ?? 0).toFixed(2)} 元`,
    },
    legend: {
      top: 0,
      left: 'center',
      icon: 'roundRect',
      itemWidth: 14,
      itemHeight: 8,
      itemGap: 18,
      textStyle: { color: text2 },
    },
    grid: { left: 8, right: 8, top: 48, bottom: many ? 56 : 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: series.value.labels,
      boundaryGap: true,
      axisLine: { lineStyle: { color: line } },
      axisTick: { show: false },
      axisLabel: { color: text3, hideOverlap: true, fontSize: 11 },
    },
    yAxis: [
      {
        type: 'value',
        name: '余额',
        nameTextStyle: { color: text3, fontSize: 11, align: 'left' },
        splitLine: { lineStyle: { color: line } },
        axisLabel: { color: text3, fontSize: 11, formatter: '{value}' },
      },
      {
        type: 'value',
        name: '用量',
        nameTextStyle: { color: text3, fontSize: 11, align: 'right' },
        splitLine: { show: false },
        axisLabel: { color: text3, fontSize: 11, formatter: '{value}' },
      },
    ],
    dataZoom: many
      ? [
          { type: 'inside', start: 70, end: 100 },
          {
            type: 'slider',
            height: 22,
            bottom: 6,
            start: 70,
            end: 100,
            borderColor: 'transparent',
            backgroundColor: 'transparent',
            fillerColor: `oklch(0.7 0.14 ${h} / 0.18)`,
            handleStyle: { color: primary, borderColor: primary },
            moveHandleStyle: { color: primary },
            dataBackground: { lineStyle: { color: line }, areaStyle: { color: line } },
            selectedDataBackground: {
              lineStyle: { color: primary },
              areaStyle: { color: `oklch(0.7 0.14 ${h} / 0.25)` },
            },
            textStyle: { color: text3, fontSize: 10 },
          },
        ]
      : undefined,
    series: [
      {
        name: '余额',
        type: 'line',
        data: series.value.balance,
        smooth: 0.3,
        showSymbol: false,
        lineStyle: { width: 2.5 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: `oklch(0.7 0.14 ${h} / 0.35)` },
            { offset: 1, color: `oklch(0.7 0.14 ${h} / 0)` },
          ]),
        },
        emphasis: { focus: 'series' },
      },
      {
        name: '用量',
        type: 'bar',
        yAxisIndex: 1,
        data: series.value.usage,
        barMaxWidth: 18,
        itemStyle: { borderRadius: [4, 4, 0, 0], opacity: 0.85 },
        emphasis: { focus: 'series' },
      },
    ],
  }
}

function render() {
  if (!el.value) return
  if (!chart.value) {
    chart.value = echarts.init(el.value, undefined, { renderer: 'svg' })
  }
  chart.value.setOption(buildOption(), true)
}

onMounted(() => {
  requestAnimationFrame(render)
})

watch([series, isDark, hue], () => requestAnimationFrame(render))
watch(width, () => chart.value?.resize())

onUnmounted(() => {
  chart.value?.dispose()
  chart.value = null
})
</script>

<template>
  <div class="traffic-chart">
    <div ref="el" class="traffic-chart__canvas" />
    <p v-if="!history.length" class="traffic-chart__empty">暂无流量记录</p>
  </div>
</template>

<style scoped>
.traffic-chart {
  position: relative;
  width: 100%;
}

.traffic-chart__canvas {
  width: 100%;
  height: clamp(220px, 40vh, 360px);
}

.traffic-chart__empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-3);
  font-size: 0.9rem;
  pointer-events: none;
}
</style>

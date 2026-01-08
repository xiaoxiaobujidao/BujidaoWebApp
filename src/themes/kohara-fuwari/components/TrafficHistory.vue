<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { getUserTrafficHistory } from '@/utils/user'
import { watch, onMounted, onUnmounted, ref, computed, nextTick } from 'vue'
import { useDark } from '@vueuse/core'
const isDark = useDark()
// 当前宽度
import { useScreenStore } from '@test/stores/screenStore'
const screenStore = useScreenStore()
const width = computed(() => screenStore.width)
//
const traffic_history = ref()
getUserTrafficHistory()
  .then((res: any) => {
    traffic_history.value = res.result.sort((a: any, b: any) => a.update_time - b.update_time)
  })
  .catch((err: any) => {
    ElMessage.error(err)
  })
const viewMode = ref<'detail' | 'hourly' | 'daily'>('detail')

const daily_traffic = computed(() => {
  if (!traffic_history.value) {
    return []
  }

  // 使用 Map 存储每日数据，键为日期字符串，值为 { usage, balance }
  const dailyMap = new Map<string, { usage: number; balance: number }>()

  // 一次性遍历所有数据，同时计算每日用量和余额
  const sortedHistory = [...traffic_history.value].sort(
    (a: any, b: any) => a.update_time - b.update_time,
  )

  for (const item of sortedHistory) {
    const dateStr = new Date(item.update_time / 1000).toLocaleDateString().split(' ')[0] || ''

    if (!dailyMap.has(dateStr)) {
      dailyMap.set(dateStr, { usage: 0, balance: 0 })
    }

    const dailyData = dailyMap.get(dateStr)!
    dailyData.usage += item.usage
    // 余额取该日期最后一条记录的余额
    dailyData.balance = item.balance
  }

  // 转换为数组并排序
  return Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, data]) => ({
      time,
      usage: data.usage / 100,
      balance: data.balance / 100,
    }))
})

const hourly_traffic = computed(() => {
  if (!traffic_history.value) {
    return []
  }

  // 使用 Map 存储每小时数据，键为日期时间字符串（YYYY-MM-DD HH:00），值为 { usage, balance }
  const hourlyMap = new Map<string, { usage: number; balance: number }>()

  // 一次性遍历所有数据，同时计算每小时用量和余额
  const sortedHistory = [...traffic_history.value].sort(
    (a: any, b: any) => a.update_time - b.update_time,
  )

  for (const item of sortedHistory) {
    const date = new Date(item.update_time / 1000)
    const hourStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`

    if (!hourlyMap.has(hourStr)) {
      hourlyMap.set(hourStr, { usage: 0, balance: 0 })
    }

    const hourlyData = hourlyMap.get(hourStr)!
    hourlyData.usage += item.usage
    // 余额取该小时最后一条记录的余额
    hourlyData.balance = item.balance
  }

  // 转换为数组并排序
  return Array.from(hourlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, data]) => ({
      time,
      usage: data.usage / 100,
      balance: data.balance / 100,
    }))
})

const time = computed(() => {
  if (viewMode.value === 'hourly') {
    return hourly_traffic.value.map((item: any) => item.time)
  } else if (viewMode.value === 'daily') {
    return daily_traffic.value.map((item: any) => item.time)
  } else {
    return traffic_history.value
      ? traffic_history.value.map((item: any) =>
          new Date(item.update_time / 1000).toLocaleDateString(),
        )
      : []
  }
})

const usage = computed(() => {
  if (viewMode.value === 'hourly') {
    return hourly_traffic.value.map((item: any) => item.usage)
  } else if (viewMode.value === 'daily') {
    return daily_traffic.value.map((item: any) => item.usage)
  } else {
    return traffic_history.value ? traffic_history.value.map((item: any) => item.usage / 100) : []
  }
})

const balance = computed(() => {
  if (viewMode.value === 'hourly') {
    return hourly_traffic.value.map((item: any) => item.balance)
  } else if (viewMode.value === 'daily') {
    return daily_traffic.value.map((item: any) => item.balance)
  } else {
    return traffic_history.value ? traffic_history.value.map((item: any) => item.balance / 100) : []
  }
})

// 图表
import * as echarts from 'echarts'
const chart = ref()
// const chart_controller = ref()
let myChart: echarts.ECharts

onMounted(() => {
  // Wait for DOM to be fully rendered before initializing chart
  nextTick(() => {
    if (!chart.value) return

    // Ensure the container has dimensions before initializing
    if (chart.value.clientWidth === 0 || chart.value.clientHeight === 0) {
      // Use a small delay to ensure CSS has been applied
      setTimeout(() => {
        initializeChart()
      }, 100)
    } else {
      initializeChart()
    }
  })
})

const initializeChart = () => {
  if (!chart.value) return

  if (isDark.value) {
    myChart = echarts.init(chart.value, 'dark', { renderer: 'svg' })
  } else {
    myChart = echarts.init(chart.value, 'null', { renderer: 'svg' })
  }

  watch(
    [traffic_history, usage, viewMode],
    () => {
      if (!myChart) return

      let option = {
        backgroundColor: '',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
          },
        },
        xAxis: {
          type: 'category',
          data: time.value,
          axisLabel: {
            hideOverlap: true,
          },
        },
        yAxis: [
          {
            name: '余额',
            type: 'value',
            // type: 'log',
            axisLabel: {
              formatter: '{value} 元',
              hideOverlap: true,
            },
            axisPointer: {
              snap: true,
            },
          },
          {
            name: '使用量',
            type: 'value',
            // type: 'log',
            axisLabel: {
              formatter: '{value} 元',
              hideOverlap: true,
            },
            axisPointer: {
              snap: true,
            },
          },
        ],
        series: [
          {
            name: '余额',
            data: balance.value,
            type: 'line',
            label: {
              // Removed 'normal' hierarchy - direct configuration since ECharts 4.0
              position: 'top',
              formatter: '{c}',
            },
          },
          {
            name: '使用量',
            data: usage.value,
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            label: {
              // Removed 'normal' hierarchy - direct configuration since ECharts 4.0
              position: 'top',
              formatter: '{c}',
            },
          },
        ],
      }
      myChart.setOption(option)
      myChart.resize()
    },
    { immediate: true },
  )

  watch(width, () => {
    if (myChart) {
      console.log('resize')
      myChart.resize()
    }
  })
}

onUnmounted(() => {
  if (myChart) {
    myChart.dispose()
    myChart = null as any
  }
})
</script>
<template>
  <el-radio-group v-model="viewMode">
    <el-radio-button value="detail">详细</el-radio-button>
    <el-radio-button value="hourly">每小时</el-radio-button>
    <el-radio-button value="daily">每日</el-radio-button>
  </el-radio-group>
  <div id="charts" ref="chart"></div>
</template>
<style scoped>
#charts {
  /* width: 100%; */
  height: 70vh;
  /* min-height: 400px; */
}
</style>

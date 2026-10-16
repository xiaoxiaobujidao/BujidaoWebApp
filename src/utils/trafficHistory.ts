export interface TrafficRecord {
  /** 本条记录的用量（单位：分） */
  usage: number
  /** 记录时的余额（单位：分） */
  balance: number
  /** 微秒时间戳 */
  update_time: number
}

export type TrafficViewMode = 'detail' | 'hourly' | 'daily'

export interface TrafficSeries {
  labels: string[]
  /** 单位：元 */
  usage: number[]
  /** 单位：元 */
  balance: number[]
}

const pad = (n: number) => String(n).padStart(2, '0')

function dayKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function hourKey(date: Date) {
  return `${dayKey(date)} ${pad(date.getHours())}:00`
}

function detailKey(date: Date) {
  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * 将流量历史按视图模式聚合为图表序列。
 * - detail：逐条展示
 * - hourly / daily：同一时段内用量求和，余额取该时段最后一条
 */
export function aggregateTraffic(
  history: TrafficRecord[] | undefined | null,
  mode: TrafficViewMode,
): TrafficSeries {
  if (!history?.length) return { labels: [], usage: [], balance: [] }

  const sorted = [...history].sort((a, b) => a.update_time - b.update_time)

  if (mode === 'detail') {
    return {
      labels: sorted.map((item) => detailKey(new Date(item.update_time / 1000))),
      usage: sorted.map((item) => item.usage / 100),
      balance: sorted.map((item) => item.balance / 100),
    }
  }

  const keyOf = mode === 'hourly' ? hourKey : dayKey
  const buckets = new Map<string, { usage: number; balance: number }>()
  for (const item of sorted) {
    const key = keyOf(new Date(item.update_time / 1000))
    const bucket = buckets.get(key) ?? { usage: 0, balance: 0 }
    bucket.usage += item.usage
    bucket.balance = item.balance
    buckets.set(key, bucket)
  }

  const entries = Array.from(buckets.entries())
  return {
    labels: entries.map(([key]) => key),
    usage: entries.map(([, v]) => Number((v.usage / 100).toFixed(2))),
    balance: entries.map(([, v]) => v.balance / 100),
  }
}

/** 时间段内用量合计（单位：元） */
export function sumUsage(history: TrafficRecord[] | undefined | null, sinceMs?: number): number {
  if (!history?.length) return 0
  const since = sinceMs ?? 0
  return (
    history
      .filter((item) => item.update_time / 1000 >= since)
      .reduce((total, item) => total + item.usage, 0) / 100
  )
}

/** 分 → 元，保留两位小数 */
export function fenToYuan(fen: number | null | undefined, digits = 2): string {
  return ((fen ?? 0) / 100).toFixed(digits)
}

/** 后端“未计入流量”字段：分 × 字节 → MiB */
export function unmeasuredToMiB(value: number | null | undefined): string {
  return ((value ?? 0) / 100 / 1024 / 1024).toFixed(3)
}

/** 微秒时间戳 → 本地可读时间 */
export function formatMicroTime(micro: number, withTime = true): string {
  const date = new Date(micro / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const day = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  return withTime ? `${day} ${pad(date.getHours())}:${pad(date.getMinutes())}` : day
}

/** 邮箱脱敏：ab***@example.com */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return ''
  const [name = '', domain = ''] = email.split('@')
  if (name.length <= 2) return `${name[0] ?? ''}***@${domain}`
  return `${name.slice(0, 2)}***@${domain}`
}

/** 取用户显示名首字（头像占位用） */
export function initialOf(text: string | null | undefined, fallback = '岛'): string {
  const trimmed = (text ?? '').trim()
  if (!trimmed) return fallback
  return Array.from(trimmed)[0]?.toUpperCase() ?? fallback
}

/** 超长字符串中段省略 */
export function middleEllipsis(text: string, head = 18, tail = 12): string {
  if (text.length <= head + tail + 1) return text
  return `${text.slice(0, head)}…${text.slice(-tail)}`
}

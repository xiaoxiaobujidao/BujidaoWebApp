import { ElMessage } from 'element-plus'

interface VersionInfo {
  date: number
  data: string // SHA1 哈希值
}

const CHECK_INTERVAL = 1000 * 60 * 20 // 20分钟
const VERSION_KEY = 'version'

/**
 * 计算文本的 SHA1 哈希值
 */
async function sha1(text: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest('SHA-1', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * 获取页面内容并计算 SHA1 哈希值
 */
async function fetchAndHash(): Promise<string> {
  const response = await fetch('/', { method: 'HEAD' })
  const etag = response.headers.get('ETag') || response.headers.get('Last-Modified') || ''
  return await sha1(etag)
}

/**
 * 保存当前版本信息
 */
async function saveVersion(hash: string | null = null) {
  try {
    const date = new Date().getTime()
    const versionHash = hash || (await fetchAndHash())
    const versionInfo: VersionInfo = { date, data: versionHash }
    localStorage.setItem(VERSION_KEY, JSON.stringify(versionInfo))
  } catch (error) {
    console.error('Save version error:', error)
  }
}

/**
 * 刷新并检查版本
 */
async function refreshVersion() {
  try {
    const newHash = await fetchAndHash()

    const versionStr = localStorage.getItem(VERSION_KEY)
    if (versionStr) {
      const oldVersionInfo: VersionInfo = JSON.parse(versionStr)
      if (newHash !== oldVersionInfo.data) {
        await saveVersion(newHash)
        ElMessage.success('版本有更新，正在刷新页面')
        setTimeout(() => {
          window.location.replace(window.location.href)
        }, 1000)
        return
      }
    }
  } catch (error) {
    console.error('Version refresh error:', error)
  }
}

/**
 * 检查版本是否有更新
 */
export function checkVersion() {
  try {
    const versionStr = localStorage.getItem(VERSION_KEY)
    if (!versionStr) {
      saveVersion()
      return
    }

    const versionInfo: VersionInfo = JSON.parse(versionStr)
    const now = new Date().getTime()

    // 如果距离上次检查超过20分钟，则检查版本
    if (now - versionInfo.date > CHECK_INTERVAL) {
      refreshVersion()
    }
  } catch (e) {
    console.error('Version check error:', e)
    saveVersion()
  }
}

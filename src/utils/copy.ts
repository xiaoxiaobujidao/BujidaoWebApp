import { ElMessage } from 'element-plus'

function copyWithExecCommand(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', 'true')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '0'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)

  try {
    textarea.focus()
    textarea.select()
    textarea.setSelectionRange(0, text.length)
    return document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }
}

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // 非 HTTPS、权限受限或旧版浏览器不支持时，回退到 execCommand
    }
  }
  // 如果 clipboard.writeText 不支持，则使用 execCommand 复制
  return copyWithExecCommand(text)
}

const copy = async (msg: string) => {
  try {
    const ok = await copyText(msg)
    if (!ok) {
      throw new Error('copy failed')
    }
    ElMessage({
      message: '复制成功',
      type: 'success',
    })
  } catch (e) {
    ElMessage({
      message: '复制失败，请手动复制' + (import.meta.env.DEV ? String(e) : ''),
      type: 'error',
    })
  }
}

function touchCopy(v: string) {
  copy(v)
}

export { touchCopy }

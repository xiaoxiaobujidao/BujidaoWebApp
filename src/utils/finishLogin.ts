import { ElMessage } from 'element-plus'
import router from '@/router'
import { useUserInfoStore } from '@/stores/userInfoStore'

/**
 * 登录完成后的统一处理：保存 token、拉取用户信息、同步主题、跳转页面。
 * @returns 若触发了主题切换，页面会 reload，不会继续跳转
 */
export async function finishLogin(loginToken?: string, redirectTo = '/user'): Promise<void> {
  const themeSwitched = await useUserInfoStore().completeLogin(loginToken)
  if (themeSwitched) return
  ElMessage.success('登录成功')
  await router.push({ path: redirectTo })
}

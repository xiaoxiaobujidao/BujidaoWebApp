<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { loginWithGoogle } from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'
import AuthShell from '@claude/components/layout/AuthShell.vue'
import StatusCard from '@claude/components/StatusCard.vue'
import ClButton from '@claude/components/ui/ClButton.vue'

const router = useRouter()
const failed = ref(false)
const message = ref('')

/** 从 OAuth 回调 URL 的 hash 中解析出 access_token */
function getAccessTokenFromHash(): string | undefined {
  const hash = router.currentRoute.value.hash
  if (!hash) return undefined
  return new URLSearchParams(hash.slice(1)).get('access_token') ?? undefined
}

onMounted(async () => {
  const token = getAccessTokenFromHash()
  if (!token) {
    failed.value = true
    message.value = '没有拿到 Google 授权信息，请重新登录'
    return
  }
  try {
    const res = await loginWithGoogle(token, localStorage.getItem('inviter'))
    if (res.result) {
      await finishLogin(res.result.login_token)
    } else {
      failed.value = true
      message.value = res.error?.message ?? '登录失败'
      ElMessage.error(message.value)
    }
  } catch {
    failed.value = true
    message.value = '网络错误，请检查网络后重试'
    ElMessage.error(message.value)
  }
})
</script>

<template>
  <AuthShell>
    <StatusCard
      v-if="!failed"
      title="正在验证 Google 账号"
      description="马上就好，请稍候…"
      loading
    />
    <StatusCard v-else icon="alert-triangle" tone="danger" title="登录失败" :description="message">
      <ClButton variant="primary" to="/login" icon="arrow-left">返回登录</ClButton>
    </StatusCard>
  </AuthShell>
</template>

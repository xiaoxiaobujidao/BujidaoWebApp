<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loginWithGoogle } from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'
import AppLayout from '@violet-rose/components/layout/AppLayout.vue'
const inviter = ref<string | null>(null)

function getAccessTokenFromHash(): string | undefined {
  const hash = location.hash
  if (!hash) return undefined
  const params = new URLSearchParams(hash.slice(1))
  return params.get('access_token') ?? undefined
}

const token = getAccessTokenFromHash()
inviter.value = localStorage.getItem('inviter')

if (token) {
  loginWithGoogle(token, inviter.value)
    .then((res) => {
      if (res.result) {
        finishLogin(res.result.login_token)
      } else {
        ElMessage.error(res.error?.message ?? '验证失败')
      }
    })
    .catch(() => {
      ElMessage.error('网络错误，请检查网络后重试')
    })
} else {
  ElMessage.error('未获取到授权信息')
}
</script>

<template>
  <AppLayout theme="rose">
    <p class="oauth-loading">正在验证 Google 账号…</p>
  </AppLayout>
</template>

<style scoped>
.oauth-loading {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}
</style>

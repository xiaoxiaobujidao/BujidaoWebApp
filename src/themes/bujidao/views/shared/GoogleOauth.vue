<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { loginWithGoogle } from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'
import { ElMessage } from 'element-plus'

const inviter = ref<string | null>(null)
const g_token = ref<string | undefined>()

/** 从 OAuth 回调 URL 的 hash 中解析出 access_token */
function getAccessTokenFromHash(): string | undefined {
  const hash = router.currentRoute.value.hash
  if (!hash) return undefined
  const query = hash.slice(1) // 去掉开头的 #
  const params = new URLSearchParams(query)
  return params.get('access_token') ?? undefined
}

const init = () => {
  g_token.value = getAccessTokenFromHash()
  inviter.value = localStorage.getItem('inviter')
  loginWithGoogle(g_token.value, inviter.value)
    .then((res_data) => {
      if (res_data.result) {
        finishLogin(res_data.result.login_token)
      } else {
        ElMessage.error(res_data.error?.message)
      }
    })
    .catch(() => {
      ElMessage.error('网络错误，请检查网络后重试，如有疑问请联系管理员')
    })
}
init()
</script>
<template>
  <div>正在验证...</div>
</template>

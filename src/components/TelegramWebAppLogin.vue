<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getTelegramInitData } from '@/utils/telegram'
import { loginWithTelegramWebApp } from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'
import { useUserInfoStore } from '@/stores/userInfoStore'

function getInviter(): string | null {
  const params = new URLSearchParams(window.location.search)
  const urlCode = params.get('code')
  if (urlCode) {
    localStorage.setItem('inviter', urlCode)
    return urlCode
  }
  return localStorage.getItem('inviter')
}

onMounted(() => {
  if (useUserInfoStore().getToken()) {
    return
  }

  const initData = getTelegramInitData()
  if (!initData) {
    return
  }

  loginWithTelegramWebApp(initData, getInviter())
    .then((res) => {
      if (res.result) {
        finishLogin(res.result.login_token)
      } else {
        ElMessage.error(res.error?.message ?? '登录失败')
      }
    })
    .catch(() => {
      ElMessage.error('网络错误，请检查网络后重试')
    })
})
</script>

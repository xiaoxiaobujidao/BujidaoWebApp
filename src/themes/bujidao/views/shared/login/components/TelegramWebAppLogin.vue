<template>
  <div></div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { getTelegramInitData } from '@/utils/telegram'
import { loginWithTelegramWebApp } from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'
import { ElMessage } from 'element-plus'

onMounted(() => {
  const initData = getTelegramInitData()
  if (initData) {
    loginWithTelegramWebApp(initData).then((res_data: any) => {
      if (res_data.result) {
        finishLogin(res_data.result.login_token)
      } else {
        ElMessage.error(res_data.error?.message)
      }
    })
  }
})
</script>

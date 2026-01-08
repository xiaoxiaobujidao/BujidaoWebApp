<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { loginWithGoogle } from '@/utils/user'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfoStore'
const userInfoStore = useUserInfoStore()
const inviter = ref()
// 跳转
function go_to_user() {
  ElMessage.success('登录成功，跳转到用户中心')
  router.push({
    path: '/user',
    query: {},
  })
}
const g_token = ref()
const init = () => {
  g_token.value = router.currentRoute.value.hash
    ? router.currentRoute.value.hash.split('#')[1]?.split('&')[0]?.split('=')[1]
    : undefined
  inviter.value = localStorage.getItem('inviter')
  loginWithGoogle(g_token.value, inviter.value)
    .then((res_data) => {
      if (res_data.result) {
        userInfoStore.setToken(res_data.result.login_token)
        go_to_user()
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

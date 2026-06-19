<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { emailOptOut } from '@/utils/user'
import AppLayout from '@violet-rose/components/layout/AppLayout.vue'
import AuthCard from '@violet-rose/components/auth/AuthCard.vue'

const router = useRouter()
const verified = ref(false)
const errMessage = ref('')

const key = router.currentRoute.value.query.key
if (key) {
  emailOptOut(String(key)).then((res) => {
    if (res.result) {
      verified.value = true
    }
    if (res.error) {
      errMessage.value = res.error.message ?? String(res.error)
      ElMessage.error(errMessage.value)
    }
  })
} else {
  errMessage.value = '缺少验证参数'
}
</script>

<template>
  <AppLayout theme="rose">
    <AuthCard
      :title="verified ? '退订成功' : errMessage ? '退订失败' : '正在验证…'"
      :subtitle="verified ? '您已成功取消邮件订阅' : errMessage || '请稍候'"
    />
  </AppLayout>
</template>

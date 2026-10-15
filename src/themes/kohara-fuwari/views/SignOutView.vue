<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { closeTelegramWebApp } from '@/utils/telegram'
import AuthShell from '@kohara-fuwari/components/layout/AuthShell.vue'
import StatusCard from '@kohara-fuwari/components/StatusCard.vue'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'

const router = useRouter()

onMounted(() => {
  useUserInfoStore().clearUserInfo()
  ElMessage.success('已退出登录')
  setTimeout(closeTelegramWebApp, 233)
  setTimeout(() => router.replace({ path: '/login' }), 1200)
})
</script>

<template>
  <AuthShell>
    <StatusCard
      icon="logout"
      tone="success"
      title="已退出登录"
      description="感谢使用，期待你再次回岛～"
    >
      <FwButton variant="primary" to="/login" icon="log-in">重新登录</FwButton>
    </StatusCard>
  </AuthShell>
</template>

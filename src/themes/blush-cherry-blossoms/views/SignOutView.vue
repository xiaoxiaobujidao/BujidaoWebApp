<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useRouter } from 'vue-router'
import { closeTelegramWebApp } from '@/utils/telegram'
import AppLayout from '@blush-cherry-blossoms/components/layout/AppLayout.vue'
import AuthCard from '@blush-cherry-blossoms/components/auth/AuthCard.vue'

const router = useRouter()
const userInfoStore = useUserInfoStore()
userInfoStore.clearUserInfo()
ElMessage.success('已退出登录')

setTimeout(() => closeTelegramWebApp(), 233)
setTimeout(() => router.push('/login'), 800)
</script>

<template>
  <AppLayout>
    <AuthCard title="退出登录" subtitle="正在跳转…" />
  </AppLayout>
</template>

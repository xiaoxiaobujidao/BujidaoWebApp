<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { emailOptOut } from '@/utils/user'
import AuthShell from '@claude/components/layout/AuthShell.vue'
import StatusCard from '@claude/components/StatusCard.vue'
import ClButton from '@claude/components/ui/ClButton.vue'

const router = useRouter()
const state = ref<'loading' | 'done' | 'error'>('loading')
const message = ref('')

onMounted(async () => {
  const key = router.currentRoute.value.query.key
  if (!key) {
    state.value = 'error'
    message.value = '退订链接不完整，请使用邮件中的原始链接'
    return
  }
  try {
    const res = await emailOptOut(String(key))
    if (res.result) {
      state.value = 'done'
    } else {
      state.value = 'error'
      message.value = String(res.error?.message ?? res.error ?? '退订失败')
    }
  } catch {
    state.value = 'error'
    message.value = '网络错误，请稍后重试'
  }
})
</script>

<template>
  <AuthShell>
    <StatusCard v-if="state === 'loading'" title="正在处理退订" description="请稍候…" loading />
    <StatusCard
      v-else-if="state === 'done'"
      icon="check"
      tone="success"
      title="已取消订阅"
      description="以后不会再向该邮箱发送营销邮件。重要的账户通知仍会正常发送。"
    >
      <ClButton variant="primary" to="/user">回到岛上</ClButton>
    </StatusCard>
    <StatusCard v-else icon="alert-triangle" tone="danger" title="退订失败" :description="message">
      <ClButton variant="secondary" to="/user">回到岛上</ClButton>
    </StatusCard>
  </AuthShell>
</template>

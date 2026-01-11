<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { loginWithEmail } from '@/utils/user'

const props = defineProps<{
  modelValue: boolean
  inviter?: string
}>()

const emit = defineEmits(['update:modelValue'])

const email = ref('')
const loading = ref(false)
const email_ref = ref()

const handleLogin = () => {
  if (!email.value) {
    ElMessage.warning('请输入邮箱地址')
    return
  }

  const emailPattern =
    /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
  if (!emailPattern.test(email.value)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }

  loading.value = true
  loginWithEmail(email.value, props.inviter || null)
    .then((res: any) => {
      if (res.result) {
        ElMessage.success('登陆邮件发送成功，请使用邮件中的登陆链接登陆')
        emit('update:modelValue', false)
      } else {
        ElMessage.error(res.error?.message || '邮件发送失败，如邮箱正确，请联系管理员')
      }
    })
    .catch((e: any) => {
      console.error(e)
      ElMessage.error('网络连接失败，请检查网络后重试，如有疑问请联系管理员')
    })
    .finally(() => {
      loading.value = false
    })
}

const focus_email = () => {
  email_ref.value?.focus()
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="邮件登陆或注册"
    width="420"
    destroy-on-close
    align-center
    @opened="focus_email"
  >
    <div class="login-box">
      <div>
        <el-input
          v-model="email"
          @keyup.enter="handleLogin"
          placeholder="您的邮箱地址"
          type="email"
          autocomplete
          autofocus
          ref="email_ref"
          :prefix-icon="User"
        />
      </div>
      <div class="login-button">
        <el-button type="primary" :loading="loading" @click="handleLogin">发送登录邮件</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style lang="scss" scoped>
.login-box {
  padding: 12px;
  background-color: var(--el-bg-color);
  border-radius: var(--el-border-radius-base);

  .el-input {
    margin-bottom: 20px;
  }
}

.login-button {
  width: 100%;
  display: flex;
  justify-content: center;

  .el-button {
    width: 100%;
  }
}
</style>

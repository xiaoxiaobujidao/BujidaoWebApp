<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { loginWithEmailPasswd } from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue', 'success'])

const email = ref('')
const passwd = ref('')
const loading = ref(false)
const email_ref = ref()

const handleLogin = () => {
  if (!email.value || !passwd.value) {
    ElMessage.warning('请输入邮箱和密码')
    return
  }

  loading.value = true
  loginWithEmailPasswd(email.value, passwd.value)
    .then((res: any) => {
      if (res.result) {
        emit('success')
        emit('update:modelValue', false)
        finishLogin(res.result.login_token)
      } else {
        ElMessage.error(res.error?.message || '登录失败')
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
    title="账号密码登陆"
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
        <el-input
          v-model="passwd"
          @keyup.enter="handleLogin"
          type="password"
          placeholder="您的密码"
          show-password
          autocomplete
          :prefix-icon="Lock"
        />
      </div>
      <div class="login-button">
        <el-button type="primary" :loading="loading" @click="handleLogin">登录</el-button>
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
    margin-bottom: 10px;
  }
}

.login-button {
  margin-top: 10px;
  width: 100%;
  display: flex;
  justify-content: center;

  .el-button {
    width: 100%;
  }
}
</style>

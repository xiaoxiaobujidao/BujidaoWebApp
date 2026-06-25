<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loginWithEmail } from '@/utils/user'
import AppLayout from '@violet-rose/components/layout/AppLayout.vue'
import AuthCard from '@violet-rose/components/auth/AuthCard.vue'
import { useAuth } from '@violet-rose/composables/useAuth'

const email = ref('')
const inviteCode = ref('')
const emailSent = ref(false)
const {
  inviter,
  inviterLocked,
  loading,
  initAuth,
  isValidEmail,
  googleAuth,
  telegramAuth,
  setupTelegramCallback,
} = useAuth()

onMounted(() => {
  initAuth()
  setupTelegramCallback()
  if (inviter.value) {
    inviteCode.value = inviter.value
  }
})

function handleRegister() {
  if (!email.value) {
    ElMessage.warning('请输入邮箱地址')
    return
  }
  if (!isValidEmail(email.value)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }

  const code = inviteCode.value.trim() || inviter.value || null
  loading.value = true
  loginWithEmail(email.value, code)
    .then((res) => {
      if (res.result) {
        emailSent.value = true
        ElMessage.success('注册邮件已发送，请查收邮箱并点击链接完成注册')
      } else {
        ElMessage.error(res.error?.message ?? '邮件发送失败，请稍后重试')
      }
    })
    .catch(() => {
      ElMessage.error('网络连接失败，请检查网络后重试')
    })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <AppLayout theme="rose">
    <AuthCard title="注册" subtitle="登岛注册，开启你的连通之旅">
      <div v-if="emailSent" class="auth-success">
        <p>
          注册邮件已发送至 <strong>{{ email }}</strong>
        </p>
        <p>请打开邮箱，点击邮件中的链接完成注册。</p>
      </div>

      <form v-else class="auth-form" @submit.prevent="handleRegister">
        <label class="auth-form__field">
          <span class="auth-form__label">邮箱</span>
          <input
            v-model="email"
            class="auth-form__input"
            type="email"
            placeholder="your@email.com"
            autocomplete="email"
          />
        </label>
        <label class="auth-form__field">
          <span class="auth-form__label">{{ inviterLocked ? '邀请码' : '邀请码（选填）' }}</span>
          <input
            v-model="inviteCode"
            class="auth-form__input"
            :class="{ 'auth-form__input--readonly': inviterLocked }"
            type="text"
            :readonly="inviterLocked"
            :placeholder="inviterLocked ? undefined : '如有邀请码请填写'"
            autocomplete="off"
          />
        </label>
        <button class="auth-form__btn auth-form__btn--primary" type="submit" :disabled="loading">
          {{ loading ? '发送中…' : '发送注册邮件' }}
        </button>
      </form>

      <template v-if="!emailSent">
        <div class="auth-divider"><span>或</span></div>

        <div class="auth-oauth">
          <button class="auth-form__btn auth-form__btn--ghost" type="button" @click="googleAuth">
            使用 Google 注册
          </button>
          <button class="auth-form__btn auth-form__btn--ghost" type="button" @click="telegramAuth">
            使用 Telegram 注册
          </button>
        </div>
      </template>

      <p class="auth-footer">
        已有账号？
        <router-link to="/login">立即登录</router-link>
      </p>
    </AuthCard>
  </AppLayout>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: left;
}

.auth-form__field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.auth-form__label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.auth-form__input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  font-size: 0.95rem;
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.auth-form__input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(171, 71, 188, 0.15);
}

.auth-form__input--readonly {
  cursor: default;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.35);
}

.auth-form__input--readonly:focus {
  border-color: var(--color-surface-border);
  box-shadow: none;
}

.auth-form__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 500;
  transition:
    transform 0.2s,
    opacity 0.2s;
}

.auth-form__btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.auth-form__btn:not(:disabled):hover {
  transform: translateY(-1px);
}

.auth-form__btn--primary {
  margin-top: 0.25rem;
  color: #fff;
  background: linear-gradient(135deg, var(--color-accent-deep), var(--color-accent-light));
  box-shadow: var(--shadow-soft);
}

.auth-form__btn--ghost {
  color: var(--color-accent-deep);
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid var(--color-surface-border);
  backdrop-filter: blur(8px);
}

.auth-success {
  padding: 1rem;
  text-align: left;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
}

.auth-success strong {
  color: var(--color-text-primary);
}

.auth-divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.25rem 0;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-surface-border);
}

.auth-oauth {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.auth-footer {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.auth-footer a {
  font-weight: 500;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>

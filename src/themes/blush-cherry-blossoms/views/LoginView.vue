<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { loginWithEmailPasswd } from '@/utils/user'
import { finishLogin } from '@/utils/finishLogin'
import AppLayout from '@blush-cherry-blossoms/components/layout/AppLayout.vue'
import AuthCard from '@blush-cherry-blossoms/components/auth/AuthCard.vue'
import { useAuth } from '@blush-cherry-blossoms/composables/useAuth'

const email = ref('')
const password = ref('')
const { loading, initAuth, isValidEmail, googleAuth, telegramAuth, setupTelegramCallback } =
  useAuth()

onMounted(() => {
  initAuth()
  setupTelegramCallback()
})

function handleLogin() {
  if (!email.value || !password.value) {
    ElMessage.warning('请输入邮箱和密码')
    return
  }
  if (!isValidEmail(email.value)) {
    ElMessage.warning('请输入有效的邮箱地址')
    return
  }

  loading.value = true
  loginWithEmailPasswd(email.value, password.value)
    .then((res) => {
      if (res.result) {
        finishLogin(res.result.login_token, '/')
      } else {
        ElMessage.error(res.error?.message ?? '登录失败，请检查账号密码')
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
  <AppLayout>
    <AuthCard title="登录" subtitle="欢迎回到布吉岛">
      <form class="auth-form" @submit.prevent="handleLogin">
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
          <span class="auth-form__label">密码</span>
          <input
            v-model="password"
            class="auth-form__input"
            type="password"
            placeholder="请输入密码"
            autocomplete="current-password"
          />
        </label>
        <button class="auth-form__btn auth-form__btn--primary" type="submit" :disabled="loading">
          {{ loading ? '登录中…' : '登录' }}
        </button>
      </form>

      <div class="auth-divider"><span>或</span></div>

      <div class="auth-oauth">
        <button class="auth-form__btn auth-form__btn--ghost" type="button" @click="googleAuth">
          使用 Google 登录
        </button>
        <button class="auth-form__btn auth-form__btn--ghost" type="button" @click="telegramAuth">
          使用 Telegram 登录
        </button>
      </div>

      <p class="auth-footer">
        还没有账号？
        <router-link to="/register">立即注册</router-link>
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
  border-color: var(--color-sakura-deep);
  box-shadow: 0 0 0 3px rgba(244, 143, 177, 0.15);
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
  background: linear-gradient(135deg, var(--color-sakura-deep), var(--color-sakura-pink));
  box-shadow: var(--shadow-soft);
}

.auth-form__btn--ghost {
  color: var(--color-sakura-deep);
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid var(--color-surface-border);
  backdrop-filter: blur(8px);
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

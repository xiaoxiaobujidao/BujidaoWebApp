<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useAuth } from '@/composables/useAuth'
import AuthShell from '@claude/components/layout/AuthShell.vue'
import ClButton from '@claude/components/ui/ClButton.vue'
import ClMark from '@claude/components/ui/ClMark.vue'
import GoogleOauth from '@claude/components/icons/GoogleOauth.vue'
import TelegramImage from '@claude/components/icons/TelegramImage.vue'

const {
  email,
  password,
  inviter,
  loading,
  mailSent,
  initAuth,
  sendMagicLink,
  loginWithPassword,
  googleAuth,
  telegramAuth,
  setupTelegramCallback,
} = useAuth()

const usePassword = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)

function submit() {
  if (usePassword.value) loginWithPassword()
  else sendMagicLink()
}

onMounted(() => {
  setupTelegramCallback()
  initAuth()
  setTimeout(() => emailInput.value?.focus(), 300)
})
</script>

<template>
  <AuthShell>
    <div class="login cl-rise">
      <div class="login__brand">
        <ClMark class="login__mark" />
        <h1 class="login__title cl-serif">欢迎来到布吉岛</h1>
        <p class="login__subtitle">
          百慕大里的小小布吉岛～ 首次登录会自动创建账号
          <span v-if="inviter" class="login__invite">· 邀请码 {{ inviter }}</span>
        </p>
      </div>

      <form class="login__form" @submit.prevent="submit">
        <label class="field">
          <span class="field__label">邮箱地址</span>
          <input
            ref="emailInput"
            v-model="email"
            class="cl-input field__input"
            type="email"
            inputmode="email"
            autocomplete="email"
            placeholder="you@example.com"
            required
          />
        </label>

        <Transition name="field">
          <label v-if="usePassword" class="field">
            <span class="field__label">密码</span>
            <input
              v-model="password"
              class="cl-input field__input"
              type="password"
              autocomplete="current-password"
              placeholder="你的密码"
              required
            />
          </label>
        </Transition>

        <ClButton type="submit" variant="primary" size="lg" block shape="md" :loading="loading">
          {{ usePassword ? '登录' : mailSent ? '重新发送登录链接' : '发送登录链接' }}
        </ClButton>

        <p class="login__hint">
          <template v-if="usePassword"
            >没有设置过密码？先用邮件链接登录，再到「概览」里设置。</template
          >
          <template v-else-if="mailSent">
            <LucideIcon name="check" class="login__hint-icon" />
            登录邮件已发送，请在邮箱中点击链接完成登录（注意检查垃圾邮件）。
          </template>
          <template v-else>我们会向该邮箱发送一个安全的一次性登录链接，无需密码。</template>
        </p>

        <button type="button" class="login__switch" @click="usePassword = !usePassword">
          {{ usePassword ? '改用邮件链接登录' : '改用账号密码登录' }}
        </button>
      </form>

      <div class="login__divider"><span>或</span></div>

      <div class="login__third">
        <button type="button" class="third" @click="googleAuth">
          <GoogleOauth class="third__icon" />
          <span>使用 Google 继续</span>
        </button>
        <button type="button" class="third" @click="telegramAuth">
          <TelegramImage class="third__icon" />
          <span>使用 Telegram 继续</span>
        </button>
      </div>

      <p class="login__terms">登录即表示你同意合理使用服务。</p>
    </div>
  </AuthShell>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.25rem 2rem;
  background: var(--cl-surface);
  border: 1px solid var(--cl-border);
  border-radius: 1.5rem;
  box-shadow: var(--cl-shadow-lg);
}

.login__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.6rem;
}

.login__mark {
  font-size: 2.75rem;
  color: var(--cl-accent);
}

.login__title {
  font-size: 1.75rem;
  color: var(--cl-text);
}

.login__subtitle {
  font-size: 0.88rem;
  color: var(--cl-text-2);
  line-height: 1.6;
}

.login__invite {
  color: var(--cl-accent-ink);
  font-weight: 600;
}

.login__form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.field__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--cl-text-2);
}

.field__input {
  min-height: 3rem;
}

.field-enter-active,
.field-leave-active {
  transition:
    opacity var(--cl-medium) var(--cl-ease),
    transform var(--cl-medium) var(--cl-ease);
}

.field-enter-from,
.field-leave-to {
  opacity: 0;
  transform: translateY(-0.3rem);
}

.login__hint {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: 0.8rem;
  color: var(--cl-text-3);
  line-height: 1.5;
}

.login__hint-icon {
  color: var(--cl-success-ink);
  margin-top: 0.15rem;
}

.login__switch {
  align-self: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--cl-accent-ink);
  padding: 0.25rem 0.5rem;
  border-radius: var(--cl-radius-sm);
}

.login__switch:hover {
  background: var(--cl-accent-soft);
}

.login__divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--cl-text-3);
  font-size: 0.8rem;
}

.login__divider::before,
.login__divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--cl-border);
}

.login__third {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.third {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  min-height: 2.9rem;
  border-radius: var(--cl-radius-sm);
  border: 1px solid var(--cl-border-strong);
  background: var(--cl-surface);
  color: var(--cl-text);
  font-weight: 600;
  font-size: 0.92rem;
  transition:
    border-color var(--cl-fast) var(--cl-ease),
    background-color var(--cl-fast) var(--cl-ease),
    transform var(--cl-fast) var(--cl-ease);
}

.third:hover {
  border-color: var(--cl-text-3);
  background: var(--cl-surface-2);
}

.third:active {
  transform: scale(0.98);
}

.third__icon {
  width: 1.2rem;
  height: 1.2rem;
}

.login__terms {
  text-align: center;
  font-size: 0.75rem;
  color: var(--cl-text-3);
}

@media (max-width: 479px) {
  .login {
    padding: 1.75rem 1.25rem;
    border-radius: 1.25rem;
  }

  .login__title {
    font-size: 1.5rem;
  }
}
</style>

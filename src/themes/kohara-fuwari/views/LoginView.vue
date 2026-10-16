<script setup lang="ts">
import { onMounted, ref } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useAuth } from '@/composables/useAuth'
import AuthShell from '@kohara-fuwari/components/layout/AuthShell.vue'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'
import FwSegmented from '@kohara-fuwari/components/ui/FwSegmented.vue'
import GoogleOauth from '@kohara-fuwari/components/icons/GoogleOauth.vue'
import TelegramImage from '@kohara-fuwari/components/icons/TelegramImage.vue'

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

type Tab = 'magic' | 'password'
const tab = ref<Tab>('magic')
const tabOptions: { value: Tab; label: string; icon: 'mail' | 'key' }[] = [
  { value: 'magic', label: '邮件链接', icon: 'mail' },
  { value: 'password', label: '账号密码', icon: 'key' },
]

const emailInput = ref<HTMLInputElement | null>(null)

const features = [
  { icon: 'shield-check' as const, title: '按量计费', desc: '不设套餐，用多少扣多少' },
  { icon: 'zap' as const, title: '多协议节点', desc: 'VLESS / Hysteria2 / WireGuard 任选' },
  { icon: 'globe' as const, title: '多端订阅', desc: '一条链接，所有客户端通用' },
]

function submit() {
  if (tab.value === 'magic') sendMagicLink()
  else loginWithPassword()
}

onMounted(() => {
  setupTelegramCallback()
  initAuth()
  setTimeout(() => emailInput.value?.focus(), 300)
})
</script>

<template>
  <AuthShell wide>
    <div class="login card-base onload-animation">
      <!-- 品牌面板 -->
      <aside class="brand">
        <div class="brand__glow" aria-hidden="true" />
        <div class="brand__top">
          <span class="brand__logo"><LucideIcon name="island" /></span>
          <span class="brand__name">布吉岛</span>
        </div>
        <div class="brand__body">
          <h1 class="brand__title">欢迎回岛</h1>
          <p class="brand__tagline">百慕大里的小小布吉岛～<br />布吉岛什么都布吉岛。</p>
          <ul class="brand__features">
            <li v-for="f in features" :key="f.title">
              <span class="brand__feature-icon"><LucideIcon :name="f.icon" /></span>
              <div>
                <strong>{{ f.title }}</strong>
                <span>{{ f.desc }}</span>
              </div>
            </li>
          </ul>
        </div>
        <p class="brand__foot">© {{ new Date().getFullYear() }} 布吉岛</p>
      </aside>

      <!-- 登录表单 -->
      <section class="form">
        <header class="form__head">
          <h2 class="form__title">登录 / 注册</h2>
          <p class="form__subtitle">
            首次登录会自动创建账号
            <span v-if="inviter" class="form__invite">· 邀请码 {{ inviter }}</span>
          </p>
        </header>

        <FwSegmented v-model="tab" :options="tabOptions" block />

        <form class="form__body" @submit.prevent="submit">
          <label class="field">
            <span class="field__label">邮箱地址</span>
            <div class="field__control">
              <LucideIcon name="mail" class="field__icon" />
              <input
                ref="emailInput"
                v-model="email"
                class="fw-input field__input"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label v-if="tab === 'password'" class="field">
            <span class="field__label">密码</span>
            <div class="field__control">
              <LucideIcon name="lock" class="field__icon" />
              <input
                v-model="password"
                class="fw-input field__input"
                type="password"
                autocomplete="current-password"
                placeholder="你的密码"
                required
              />
            </div>
          </label>

          <p v-if="tab === 'magic'" class="field__hint">
            <template v-if="mailSent">
              <LucideIcon name="check" class="text-primary" />
              登录邮件已发送，请在邮箱中点击链接完成登录（注意检查垃圾邮件）。
            </template>
            <template v-else>我们会向该邮箱发送一个安全的一次性登录链接，无需密码。</template>
          </p>
          <p v-else class="field__hint">没有设置过密码？先用邮件链接登录，再到「概览」里设置。</p>

          <FwButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="loading"
            :icon="tab === 'magic' ? 'send' : 'log-in'"
          >
            {{ tab === 'magic' ? (mailSent ? '重新发送' : '发送登录链接') : '登录' }}
          </FwButton>
        </form>

        <div class="divider"><span>或使用第三方账号</span></div>

        <div class="third">
          <button type="button" class="third__btn" @click="googleAuth">
            <GoogleOauth class="third__icon" />
            <span>Google</span>
          </button>
          <button type="button" class="third__btn" @click="telegramAuth">
            <TelegramImage class="third__icon" />
            <span>Telegram</span>
          </button>
        </div>

        <p class="form__foot">
          登录即表示你同意合理使用服务。遇到问题可到
          <a href="https://t.me/bujidaoChat" target="_blank" rel="noopener">Telegram 群组</a>
          求助。
        </p>
      </section>
    </div>
  </AuthShell>
</template>

<style scoped>
.login {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
  overflow: hidden;
  box-shadow: var(--shadow-float);
  border: 1px solid var(--line-divider);
}

/* 品牌面板 */
.brand {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  padding: 2.25rem;
  color: #fff;
  background:
    radial-gradient(
      circle at 100% 0%,
      oklch(0.8 0.12 calc(var(--hue) + 60) / 0.7),
      transparent 45%
    ),
    linear-gradient(160deg, oklch(0.62 0.16 var(--hue)), oklch(0.45 0.14 calc(var(--hue) - 20)));
  overflow: hidden;
}

.brand__glow {
  position: absolute;
  left: -20%;
  bottom: -30%;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.28), transparent 65%);
  pointer-events: none;
}

.brand__top {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 800;
  font-size: 1.15rem;
  letter-spacing: 0.05em;
}

.brand__logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.18);
  font-size: 1.4rem;
  backdrop-filter: blur(6px);
}

.brand__title {
  font-size: 2.4rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.brand__tagline {
  margin-top: 0.6rem;
  font-size: 0.95rem;
  line-height: 1.7;
  opacity: 0.9;
}

.brand__features {
  list-style: none;
  margin: 1.75rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.brand__features li {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.brand__features div {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.brand__features strong {
  font-size: 0.95rem;
}

.brand__features span {
  font-size: 0.8rem;
  opacity: 0.85;
}

.brand__feature-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.65rem;
  background: rgba(255, 255, 255, 0.16);
  font-size: 1.1rem;
  flex-shrink: 0;
}

.brand__foot {
  font-size: 0.75rem;
  opacity: 0.7;
}

/* 表单 */
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 2.25rem;
}

.form__title {
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.01em;
}

.form__subtitle {
  margin-top: 0.25rem;
  color: var(--text-3);
  font-size: 0.88rem;
}

.form__invite {
  color: var(--primary);
  font-weight: 600;
}

.form__body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field__label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-2);
}

.field__control {
  position: relative;
}

.field__icon {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-3);
  pointer-events: none;
}

.field__input {
  padding-left: 2.6rem;
  min-height: 3rem;
}

.field__hint {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: var(--text-3);
  line-height: 1.5;
}

.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-3);
  font-size: 0.78rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line-divider);
}

.third {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;
}

.third__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  min-height: 2.9rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-color);
  background: var(--card-bg);
  font-weight: 600;
  color: var(--text-1);
  transition:
    border-color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);
}

.third__btn:hover {
  border-color: var(--primary);
  background: var(--btn-plain-bg-hover);
}

.third__btn:active {
  transform: scale(0.97);
}

.third__icon {
  width: 1.25rem;
  height: 1.25rem;
}

.form__foot {
  margin-top: auto;
  font-size: 0.75rem;
  color: var(--text-3);
  line-height: 1.6;
}

.form__foot a {
  color: var(--primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

@media (max-width: 767px) {
  .login {
    grid-template-columns: minmax(0, 1fr);
  }

  .brand {
    padding: 1.5rem;
    gap: 1.25rem;
  }

  .brand__title {
    font-size: 1.8rem;
  }

  .brand__features {
    display: none;
  }

  .brand__foot {
    display: none;
  }

  .form {
    padding: 1.5rem 1.25rem 1.5rem;
  }
}
</style>

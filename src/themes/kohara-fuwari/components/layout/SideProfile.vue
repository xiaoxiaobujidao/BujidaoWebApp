<script setup lang="ts">
import { computed } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { initialOf, maskEmail } from '@/utils/format'
import TelegramImage from '@kohara-fuwari/components/icons/TelegramImage.vue'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'
import { useCreditDialog } from '@kohara-fuwari/composables/useCreditDialog'
import { SITE_URL, TELEGRAM_GROUP } from './nav'

const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.getUserInfo())
const { open: openCredit } = useCreditDialog()

const displayName = computed(() => {
  const info = userInfo.value
  if (!info) return '岛民'
  if (info.email) return info.email.split('@')[0] ?? info.email
  if (info.telegram_id) return `TG ${info.telegram_id}`
  return `岛民 #${info.user_id}`
})

const bio = computed(() => {
  const info = userInfo.value
  if (!info) return '布吉岛什么都布吉岛'
  if (info.email) return maskEmail(info.email)
  return '布吉岛什么都布吉岛'
})

const balance = computed(() => ((userInfo.value?.balance ?? 0) / 100).toFixed(2))
const lowBalance = computed(() => (userInfo.value?.balance ?? 0) < 1000)
</script>

<template>
  <div class="profile card-base">
    <div class="profile__avatar" aria-hidden="true">
      <span class="profile__initial">{{ initialOf(displayName) }}</span>
      <LucideIcon name="island" class="profile__island" />
    </div>
    <div class="profile__name">{{ displayName }}</div>
    <div class="profile__bar" />
    <div class="profile__bio">{{ bio }}</div>

    <div class="profile__balance">
      <div class="profile__balance-text">
        <span class="profile__balance-label">余额</span>
        <span class="profile__balance-value">¥{{ balance }}</span>
      </div>
      <FwButton
        size="sm"
        :variant="lowBalance ? 'primary' : 'regular'"
        icon="wallet"
        @click="openCredit"
      >
        充值
      </FwButton>
    </div>

    <div class="profile__links">
      <a
        :href="TELEGRAM_GROUP"
        target="_blank"
        rel="noopener"
        class="btn-regular profile__link"
        aria-label="Telegram 群组"
        title="Telegram 群组"
      >
        <TelegramImage class="profile__tg" />
      </a>
      <a
        :href="SITE_URL"
        target="_blank"
        rel="noopener"
        class="btn-regular profile__link"
        aria-label="布吉岛官网"
        title="布吉岛官网"
      >
        <LucideIcon name="globe" />
      </a>
      <router-link to="/signout" class="btn-regular profile__link" aria-label="登出" title="登出">
        <LucideIcon name="logout" />
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.profile {
  padding: 0.75rem 0.75rem 1rem;
  text-align: center;
}

.profile__avatar {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  aspect-ratio: 1;
  width: 100%;
  margin-bottom: 0.75rem;
  border-radius: 0.75rem;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 20% 20%,
      oklch(0.9 0.08 calc(var(--hue) + 40) / 0.9),
      transparent 55%
    ),
    radial-gradient(
      circle at 80% 80%,
      oklch(0.75 0.14 calc(var(--hue) - 30) / 0.9),
      transparent 55%
    ),
    linear-gradient(145deg, oklch(0.82 0.1 var(--hue)), oklch(0.6 0.15 var(--hue)));
  color: #fff;
}

.profile__initial {
  font-size: 4.5rem;
  font-weight: 800;
  letter-spacing: -0.05em;
  text-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
}

.profile__island {
  position: absolute;
  right: 0.75rem;
  bottom: 0.5rem;
  font-size: 2.25rem;
  opacity: 0.35;
}

.profile__name {
  font-weight: 700;
  font-size: 1.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.5rem;
}

.profile__bar {
  width: 1.25rem;
  height: 0.25rem;
  margin: 0.35rem auto 0.5rem;
  border-radius: 999px;
  background: var(--primary);
}

.profile__bio {
  color: var(--text-3);
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 0.5rem;
}

.profile__balance {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0.9rem 0.25rem 0.75rem;
  padding: 0.65rem 0.8rem;
  border-radius: var(--radius-md);
  background: var(--btn-plain-bg-hover);
  text-align: left;
}

.profile__balance-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.profile__balance-label {
  font-size: 0.72rem;
  color: var(--text-3);
}

.profile__balance-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--primary-strong);
  font-variant-numeric: tabular-nums;
}

.profile__links {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.profile__link {
  width: 2.5rem;
  height: 2.5rem;
  font-size: 1.25rem;
}

.profile__tg {
  width: 1.3rem;
  height: 1.3rem;
}
</style>

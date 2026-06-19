<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  cancel,
  updateEmailOptIn,
  changeEmail,
  changePasswd,
  bindTelegram,
} from '@/utils/user'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useAnnouncementStore } from '@/stores/announcementStore'
import { closeTelegramWebApp } from '@/utils/telegram'
import DashboardLayout from '@violet-rose/components/layout/DashboardLayout.vue'
import PanelCard from '@violet-rose/components/ui/PanelCard.vue'
import VrButton from '@violet-rose/components/ui/VrButton.vue'
import VrModal from '@violet-rose/components/ui/VrModal.vue'
import CopyField from '@violet-rose/components/ui/CopyField.vue'
import AddCredit from '@violet-rose/components/AddCredit.vue'

const userInfoStore = useUserInfoStore()
const announcementStore = useAnnouncementStore()
const userInfo = computed(() => userInfoStore.getUserInfo())

const showCredit = ref(false)
const showPinAnnouncement = ref(false)
const showEmailOptInPrompt = ref(false)
const emailOptIn = ref(false)

const pinAnnouncement = computed(() => {
  const pinned = (announcementStore.getAnnouncement() ?? [])
    .filter((item) => item.pin)
    .sort((a, b) => b.edit_time - a.edit_time)
  return pinned[0]?.announcement ?? ''
})

onMounted(async () => {
  await userInfoStore.updateUserInfo()
  if (!sessionStorage.getItem('gift_shown')) {
    await announcementStore.updateAnnouncement()
    if (pinAnnouncement.value) {
      sessionStorage.setItem('gift_shown', 'true')
      showPinAnnouncement.value = true
    }
  }
})

watch(
  userInfo,
  (info) => {
    if (!info) return
    emailOptIn.value = info.email_opt_in > 0
    if (info.email && info.email_opt_in === 0) {
      showEmailOptInPrompt.value = true
    }
  },
  { immediate: true },
)

function openPrompt(label: string, type: string): Promise<string | null> {
  return new Promise((resolve) => {
    promptLabel.value = label
    promptType.value = type
    promptValue.value = ''
    promptVisible.value = true
    promptResolve = resolve
  })
}

const promptVisible = ref(false)
const promptLabel = ref('')
const promptType = ref('text')
const promptValue = ref('')
let promptResolve: ((v: string | null) => void) | null = null

function confirmPrompt() {
  promptResolve?.(promptValue.value)
  promptVisible.value = false
  promptResolve = null
}

function cancelPrompt() {
  promptResolve?.(null)
  promptVisible.value = false
  promptResolve = null
}

async function handleChangeEmail() {
  const email = await openPrompt('请输入邮箱地址', 'email')
  if (!email) return
  const res = await changeEmail(email)
  if (res.result) {
    ElMessage.success('邮件更改成功')
    userInfoStore.updateUserInfo()
  } else {
    ElMessage.error('邮件更改失败')
  }
}

async function handleChangePass() {
  const pass = await openPrompt('请输入新密码', 'password')
  if (!pass) return
  const res = await changePasswd(pass)
  if (res.result) {
    ElMessage.success('密码更改成功')
  } else {
    ElMessage.error('密码更改失败')
  }
}

async function handleBindTelegram() {
  const id = await openPrompt('请输入 Telegram ID', 'number')
  if (!id) return
  const res = await bindTelegram(Number(id))
  if (!res.error) {
    ElMessage.success('绑定成功')
    userInfoStore.updateUserInfo()
  } else {
    ElMessage.error(res.error?.message ?? '绑定失败')
  }
}

function toggleEmailOptIn() {
  updateEmailOptIn(emailOptIn.value).then((res) => {
    if (!res.error) {
      ElMessage.success('订阅状态已更新')
      userInfoStore.updateUserInfo()
    } else {
      ElMessage.error('更新失败')
    }
  })
}

function confirmCancel() {
  if (!confirm('确认注销账户？此操作不可撤销。')) return
  cancel().then((res) => {
    if (res.result) {
      ElMessage.success('注销成功')
      closeTelegramWebApp()
    } else {
      ElMessage.error('注销失败')
    }
  })
}
</script>

<template>
  <DashboardLayout>
    <div v-if="userInfo" class="user-grid">
      <PanelCard title="账户概览" subtitle="管理你的个人信息与余额">
        <div class="stat-row">
          <div class="stat">
            <span class="stat__label">余额</span>
            <span class="stat__value">¥{{ (userInfo.balance / 100).toFixed(2) }}</span>
          </div>
          <VrButton size="sm" @click="showCredit = true">充值</VrButton>
        </div>

        <dl class="info-list">
          <div class="info-list__row">
            <dt>邮箱</dt>
            <dd>
              {{ userInfo.email ?? '未设置' }}
              <VrButton variant="text" size="sm" @click="handleChangeEmail">
                {{ userInfo.email ? '更换' : '绑定' }}
              </VrButton>
            </dd>
          </div>
          <div v-if="userInfo.email" class="info-list__row">
            <dt>营销邮件</dt>
            <dd>
              <label class="switch">
                <input v-model="emailOptIn" type="checkbox" @change="toggleEmailOptIn" />
                <span>{{ emailOptIn ? '已订阅' : '未订阅' }}</span>
              </label>
            </dd>
          </div>
          <div class="info-list__row">
            <dt>Telegram</dt>
            <dd>
              {{ userInfo.telegram_id ?? '未绑定' }}
              <VrButton variant="text" size="sm" @click="handleBindTelegram">绑定</VrButton>
            </dd>
          </div>
        </dl>

        <div class="actions">
          <VrButton variant="ghost" size="sm" @click="handleChangePass">更改密码</VrButton>
          <VrButton variant="danger" size="sm" @click="confirmCancel">注销账户</VrButton>
        </div>
      </PanelCard>

      <PanelCard title="订阅地址" subtitle="点击复制，通用订阅链接">
        <div class="sub-list">
          <CopyField
            v-for="(addr, i) in userInfo.sub_address"
            :key="i"
            :label="i === 0 ? '通用订阅' : `备用订阅 ${i}`"
            :value="addr"
          />
        </div>
      </PanelCard>
    </div>

    <VrModal v-model="showCredit" title="充值" wide>
      <AddCredit />
    </VrModal>

    <VrModal v-model="showPinAnnouncement" title="公告">
      <div class="rich" v-html="pinAnnouncement" />
    </VrModal>

    <VrModal v-model="showEmailOptInPrompt" title="邮件订阅">
      <p class="opt-in-text">建议开启邮件订阅，以便接收优惠与重要通知。退订链接会随邮件发送。</p>
      <label class="switch switch--block">
        <input v-model="emailOptIn" type="checkbox" @change="toggleEmailOptIn" />
        <span>订阅营销邮件</span>
      </label>
    </VrModal>

    <VrModal v-model="promptVisible" :title="promptLabel">
      <input v-model="promptValue" class="prompt-input" :type="promptType" />
      <template #footer>
        <VrButton variant="ghost" @click="cancelPrompt">取消</VrButton>
        <VrButton @click="confirmPrompt">确认</VrButton>
      </template>
    </VrModal>
  </DashboardLayout>
</template>

<style scoped>
.user-grid {
  display: grid;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .user-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.stat__label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.stat__value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-accent-deep);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.info-list__row {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.info-list__row dt {
  color: var(--color-text-secondary);
}

.info-list__row dd {
  color: var(--color-text-primary);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-surface-border);
}

.sub-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.switch {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.switch--block {
  margin-top: 1rem;
}

.opt-in-text {
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.prompt-input {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.5);
  outline: none;
}

.prompt-input:focus {
  border-color: var(--color-accent);
}

.rich :deep(*) {
  line-height: 1.7;
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { cancel, updateEmailOptIn, changeEmail, changePasswd, bindTelegram } from '@/utils/user'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useAnnouncementStore } from '@/stores/announcementStore'
import { closeTelegramWebApp } from '@/utils/telegram'
import DashboardLayout from '@blush-cherry-blossoms/components/layout/DashboardLayout.vue'
import SakuraCard from '@blush-cherry-blossoms/components/ui/SakuraCard.vue'
import SakuraBtn from '@blush-cherry-blossoms/components/ui/SakuraBtn.vue'
import SakuraModal from '@blush-cherry-blossoms/components/ui/SakuraModal.vue'
import CopyField from '@blush-cherry-blossoms/components/ui/CopyField.vue'
import AddCredit from '@blush-cherry-blossoms/components/AddCredit.vue'

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

const promptVisible = ref(false)
const promptLabel = ref('')
const promptType = ref('text')
const promptValue = ref('')
let promptResolve: ((v: string | null) => void) | null = null

function openPrompt(label: string, type: string): Promise<string | null> {
  return new Promise((resolve) => {
    promptLabel.value = label
    promptType.value = type
    promptValue.value = ''
    promptVisible.value = true
    promptResolve = resolve
  })
}

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

const cancelStep1Visible = ref(false)
const cancelStep2Visible = ref(false)
const cancelLoading = ref(false)

function confirmCancel() {
  cancelStep1Visible.value = true
}

function closeCancelDialogs() {
  cancelStep1Visible.value = false
  cancelStep2Visible.value = false
}

function proceedCancelStep1() {
  cancelStep1Visible.value = false
  cancelStep2Visible.value = true
}

async function executeCancel() {
  cancelLoading.value = true
  try {
    const res = await cancel()
    if (res.result) {
      ElMessage.success('注销成功')
      closeCancelDialogs()
      closeTelegramWebApp()
    } else {
      ElMessage.error('注销失败')
    }
  } finally {
    cancelLoading.value = false
  }
}
</script>

<template>
  <DashboardLayout>
    <div v-if="userInfo" class="user-page">
      <SakuraCard title="账户概览" subtitle="管理个人信息与余额" accent>
        <div class="stat-row">
          <div class="stat">
            <span class="stat__label">余额</span>
            <span class="stat__value">¥{{ (userInfo.balance / 100).toFixed(2) }}</span>
          </div>
          <SakuraBtn size="sm" @click="showCredit = true">充值</SakuraBtn>
        </div>

        <dl class="info-list">
          <div class="info-list__row">
            <dt>邮箱</dt>
            <dd>
              {{ userInfo.email ?? '未设置' }}
              <SakuraBtn variant="text" size="sm" @click="handleChangeEmail">
                {{ userInfo.email ? '更换' : '绑定' }}
              </SakuraBtn>
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
              <SakuraBtn variant="text" size="sm" @click="handleBindTelegram">绑定</SakuraBtn>
            </dd>
          </div>
          <div class="info-list__row">
            <dt>积分</dt>
            <dd>{{ (userInfo.points / 100).toFixed(2) }}</dd>
          </div>
          <div class="info-list__row">
            <dt>返利</dt>
            <dd>¥{{ (userInfo.rebate / 100).toFixed(2) }}</dd>
          </div>
        </dl>

        <div class="actions">
          <SakuraBtn variant="ghost" size="sm" @click="handleChangePass">更改密码</SakuraBtn>
          <SakuraBtn variant="danger" size="sm" @click="confirmCancel">注销账户</SakuraBtn>
        </div>
      </SakuraCard>

      <SakuraCard title="订阅地址" subtitle="点击复制通用订阅链接">
        <div class="sub-list">
          <CopyField
            v-for="(addr, i) in userInfo.sub_address"
            :key="i"
            :label="i === 0 ? '通用订阅' : `备用订阅 ${i}`"
            :value="addr"
          />
        </div>
      </SakuraCard>
    </div>

    <SakuraModal v-model="showCredit" title="充值" wide>
      <AddCredit />
    </SakuraModal>

    <SakuraModal v-model="showPinAnnouncement" title="公告">
      <div class="rich" v-html="pinAnnouncement" />
    </SakuraModal>

    <SakuraModal v-model="showEmailOptInPrompt" title="邮件订阅">
      <p class="opt-in-text">建议开启邮件订阅，以便接收优惠与重要通知。退订链接会随邮件发送。</p>
      <label class="switch switch--block">
        <input v-model="emailOptIn" type="checkbox" @change="toggleEmailOptIn" />
        <span>订阅营销邮件</span>
      </label>
    </SakuraModal>

    <SakuraModal v-model="promptVisible" :title="promptLabel">
      <input v-model="promptValue" class="prompt-input" :type="promptType" />
      <template #footer>
        <SakuraBtn variant="ghost" @click="cancelPrompt">取消</SakuraBtn>
        <SakuraBtn @click="confirmPrompt">确认</SakuraBtn>
      </template>
    </SakuraModal>

    <SakuraModal v-model="cancelStep1Visible" title="确认注销账户">
      <div class="cancel-dialog">
        <p class="cancel-dialog__lead">
          您即将<strong>注销账号</strong>，此操作与<strong>退出登录</strong>完全不同，请仔细区分：
        </p>
        <ul class="cancel-compare">
          <li class="cancel-compare__item cancel-compare__item--safe">
            <span class="cancel-compare__tag">退出登录</span>
            <span>暂时离开，账号与数据保留，可随时重新登录</span>
          </li>
          <li class="cancel-compare__item cancel-compare__item--danger">
            <span class="cancel-compare__tag">注销账号</span>
            <span>永久删除账号及全部数据，无法恢复</span>
          </li>
        </ul>
        <p class="cancel-dialog__note">如需暂时离开，请使用页面上的「退出」按钮，而非注销账户。</p>
      </div>
      <template #footer>
        <SakuraBtn variant="ghost" @click="closeCancelDialogs">取消</SakuraBtn>
        <SakuraBtn variant="danger" @click="proceedCancelStep1">继续注销</SakuraBtn>
      </template>
    </SakuraModal>

    <SakuraModal v-model="cancelStep2Visible" title="最后确认">
      <div class="cancel-dialog">
        <div class="cancel-dialog__alert">
          <p class="cancel-dialog__alert-title">此操作不可撤销</p>
          <p class="cancel-dialog__alert-text">
            注销后，您的账户余额、订阅地址、使用记录等所有数据将被永久删除，且无法恢复。
          </p>
        </div>
        <p class="cancel-dialog__confirm">确定要注销账号吗？</p>
      </div>
      <template #footer>
        <SakuraBtn variant="ghost" :disabled="cancelLoading" @click="closeCancelDialogs"
          >取消</SakuraBtn
        >
        <SakuraBtn variant="danger" :disabled="cancelLoading" @click="executeCancel">
          {{ cancelLoading ? '注销中…' : '确认注销' }}
        </SakuraBtn>
      </template>
    </SakuraModal>
  </DashboardLayout>
</template>

<style scoped>
.user-page {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.15rem;
}

.stat__label {
  display: block;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.stat__value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-sakura-deep);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-list__row {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 0.5rem;
  font-size: 0.88rem;
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
  margin-top: 1.15rem;
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
  border-color: var(--color-sakura-deep);
}

.rich :deep(*) {
  line-height: 1.7;
}

.cancel-dialog {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cancel-dialog__lead {
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--color-text-primary);
}

.cancel-dialog__lead strong {
  color: var(--color-sakura-deep);
}

.cancel-compare {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.cancel-compare__item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.75rem 0.9rem;
  font-size: 0.85rem;
  line-height: 1.55;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
}

.cancel-compare__item--safe {
  color: var(--color-text-secondary);
  background: rgba(255, 183, 197, 0.15);
  border-color: rgba(255, 183, 197, 0.45);
}

.cancel-compare__item--danger {
  color: #8b1a1a;
  background: rgba(198, 40, 40, 0.08);
  border-color: rgba(198, 40, 40, 0.25);
}

.cancel-compare__tag {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.cancel-compare__item--safe .cancel-compare__tag {
  color: var(--color-sakura-deep);
}

.cancel-compare__item--danger .cancel-compare__tag {
  color: #c62828;
}

.cancel-dialog__note {
  margin: 0;
  padding: 0.7rem 0.85rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
  background: rgba(255, 183, 197, 0.1);
  border-left: 3px solid var(--color-sakura-deep);
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}

.cancel-dialog__alert {
  padding: 0.9rem 1rem;
  background: rgba(198, 40, 40, 0.08);
  border: 1px solid rgba(198, 40, 40, 0.28);
  border-radius: var(--radius-md);
}

.cancel-dialog__alert-title {
  margin: 0 0 0.4rem;
  font-size: 0.92rem;
  font-weight: 600;
  color: #c62828;
}

.cancel-dialog__alert-text {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: #6d1f1f;
}

.cancel-dialog__confirm {
  margin: 0;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--color-text-primary);
  text-align: center;
}
</style>

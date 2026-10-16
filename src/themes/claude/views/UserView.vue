<script setup lang="ts">
import { onMounted } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useAccount } from '@/composables/useAccount'
import AppShell from '@claude/components/layout/AppShell.vue'
import ClCard from '@claude/components/ui/ClCard.vue'
import ClButton from '@claude/components/ui/ClButton.vue'
import ClStat from '@claude/components/ui/ClStat.vue'
import ClCopyField from '@claude/components/ui/ClCopyField.vue'
import ClSwitch from '@claude/components/ui/ClSwitch.vue'
import ClDialog from '@claude/components/ui/ClDialog.vue'
import ClEmpty from '@claude/components/ui/ClEmpty.vue'
import { useCreditDialog } from '@claude/composables/useCreditDialog'

const {
  userInfo,
  emailOptIn,
  showOptInPrompt,
  balanceYuan,
  pointsYuan,
  rebateYuan,
  lowBalance,
  primarySub,
  backupSub,
  antiHijackSub,
  refresh,
  toggleEmailOptIn,
  changeEmailPrompt,
  changePasswordPrompt,
  bindTelegramPrompt,
  cancelAccount,
} = useAccount()

const { open: openCredit } = useCreditDialog()

const greeting = () => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 12) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

onMounted(() => {
  refresh()
})
</script>

<template>
  <AppShell>
    <template #actions>
      <ClButton variant="primary" icon="wallet" @click="openCredit">充值</ClButton>
    </template>

    <template v-if="userInfo">
      <section class="hero">
        <h2 class="hero__title cl-serif">
          {{ greeting() }}，{{ userInfo.email ? userInfo.email.split('@')[0] : '岛民' }}
        </h2>
        <p class="hero__text">
          <template v-if="lowBalance">余额有点紧张了，充值后可以继续畅游。</template>
          <template v-else>一切正常，按量计费，用多少扣多少。</template>
        </p>
      </section>

      <section class="stats">
        <ClStat label="账户余额" :value="balanceYuan" unit="元" icon="wallet" tone="accent">
          <ClButton size="sm" variant="soft" @click="openCredit">充值</ClButton>
        </ClStat>
        <ClStat label="积分" :value="pointsYuan" icon="sparkles">
          <router-link to="/balance" class="cl-link">100 : 1 兑换余额</router-link>
        </ClStat>
        <ClStat label="返利" :value="rebateYuan" unit="元" icon="percent">
          <router-link to="/balance" class="cl-link">1 : 1 兑换余额</router-link>
        </ClStat>
      </section>

      <div class="grid-2">
        <ClCard title="账户" subtitle="登录方式与联系方式">
          <ul class="info">
            <li class="info__row">
              <span class="info__icon"><LucideIcon name="mail" /></span>
              <div class="info__main">
                <span class="info__label">邮箱</span>
                <span class="info__value">{{ userInfo.email || '未绑定' }}</span>
              </div>
              <ClButton size="sm" @click="changeEmailPrompt">{{
                userInfo.email ? '更换' : '绑定'
              }}</ClButton>
            </li>
            <li v-if="userInfo.email" class="info__row">
              <span class="info__icon"><LucideIcon name="bell" /></span>
              <div class="info__main">
                <span class="info__label">营销邮件</span>
                <span class="info__value info__value--muted"
                  >仅在有新公告或优惠时发送，域名变更也会由此通知</span
                >
              </div>
              <ClSwitch v-model="emailOptIn" @change="toggleEmailOptIn()" />
            </li>
            <li class="info__row">
              <span class="info__icon"><LucideIcon name="send" /></span>
              <div class="info__main">
                <span class="info__label">Telegram</span>
                <span class="info__value">{{ userInfo.telegram_id || '未绑定' }}</span>
              </div>
              <ClButton size="sm" @click="bindTelegramPrompt">{{
                userInfo.telegram_id ? '更换' : '绑定'
              }}</ClButton>
            </li>
            <li class="info__row">
              <span class="info__icon"><LucideIcon name="lock" /></span>
              <div class="info__main">
                <span class="info__label">密码</span>
                <span class="info__value info__value--muted">用于邮箱 + 密码登录</span>
              </div>
              <ClButton size="sm" @click="changePasswordPrompt">更改</ClButton>
            </li>
          </ul>
          <template #footer>
            <div class="danger">
              <div class="danger__text">
                <strong>注销账号</strong>
                <span>永久删除账号与全部数据，不可恢复</span>
              </div>
              <ClButton variant="danger" size="sm" icon="alert-triangle" @click="cancelAccount"
                >消灭我</ClButton
              >
            </div>
          </template>
        </ClCard>

        <ClCard title="订阅地址" subtitle="点击即可复制">
          <template #actions>
            <ClButton size="sm" variant="ghost" to="/sub" icon="arrow-right">更多格式</ClButton>
          </template>
          <div class="subs">
            <ClCopyField label="通用" hint="所有客户端均可用" :value="primarySub" />
            <ClCopyField
              label="防劫持"
              hint="节点解析为 IP，规避 DNS 劫持"
              :value="antiHijackSub"
            />
            <ClCopyField
              v-if="backupSub"
              label="备用"
              hint="主地址不可用时使用"
              :value="backupSub"
            />
          </div>
          <template #footer>
            还不会配置？看看
            <router-link to="/tutorial" class="cl-link">客户端教程</router-link>
            ，或直接
            <router-link to="/sub" class="cl-link">一键导入</router-link>
            。
          </template>
        </ClCard>
      </div>
    </template>

    <ClCard v-else>
      <ClEmpty loading />
    </ClCard>

    <ClDialog v-model="showOptInPrompt" title="订阅岛上资讯" size="sm">
      <div class="optin">
        <p>
          你还没有设置是否接收邮件资讯。建议开启，以免失联——将来可能的<b>域名变更</b>也会由此通知。
        </p>
        <p class="cl-faint">只在有新公告或优惠时发送，不会频繁打扰；每封邮件都附带退订链接。</p>
        <ClSwitch
          v-model="emailOptIn"
          label="订阅营销邮件"
          description="如此求生欲满满了，订阅一下叭～"
          @change="toggleEmailOptIn()"
        />
      </div>
      <template #footer>
        <ClButton variant="ghost" @click="showOptInPrompt = false">稍后再说</ClButton>
        <ClButton variant="primary" @click="toggleEmailOptIn(true)">开启订阅</ClButton>
      </template>
    </ClDialog>
  </AppShell>
</template>

<style scoped>
.hero {
  padding: 0.25rem 0.25rem 0;
}

.hero__title {
  font-size: 1.9rem;
  line-height: 1.25;
  color: var(--cl-text);
}

.hero__text {
  margin-top: 0.3rem;
  color: var(--cl-text-2);
  font-size: 0.95rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-items: start;
}

.info {
  list-style: none;
  margin: 0;
  padding: 0;
}

.info__row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--cl-border);
}

.info__row:first-child {
  padding-top: 0;
}

.info__row:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.info__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.65rem;
  background: var(--cl-surface-2);
  border: 1px solid var(--cl-border);
  color: var(--cl-text-2);
  flex-shrink: 0;
}

.info__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}

.info__label {
  font-size: 0.76rem;
  color: var(--cl-text-3);
}

.info__value {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info__value--muted {
  font-weight: 400;
  color: var(--cl-text-2);
  font-size: 0.82rem;
  white-space: normal;
}

.danger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: var(--cl-radius-md);
  background: var(--cl-danger-soft);
  color: var(--cl-danger-ink);
}

.danger__text {
  display: flex;
  flex-direction: column;
  font-size: 0.78rem;
  line-height: 1.4;
}

.danger__text strong {
  font-size: 0.9rem;
}

.subs {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.optin {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  font-size: 0.92rem;
  line-height: 1.7;
}

.optin b {
  color: var(--cl-danger-ink);
}

@media (max-width: 1023px) {
  .grid-2 {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .hero__title {
    font-size: 1.5rem;
  }

  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stats > :first-child {
    grid-column: 1 / -1;
  }
}
</style>

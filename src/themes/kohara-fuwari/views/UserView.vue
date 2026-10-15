<script setup lang="ts">
import { onMounted } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useAccount } from '@/composables/useAccount'
import AppShell from '@kohara-fuwari/components/layout/AppShell.vue'
import FwCard from '@kohara-fuwari/components/ui/FwCard.vue'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'
import FwStat from '@kohara-fuwari/components/ui/FwStat.vue'
import FwCopyField from '@kohara-fuwari/components/ui/FwCopyField.vue'
import FwSwitch from '@kohara-fuwari/components/ui/FwSwitch.vue'
import FwDialog from '@kohara-fuwari/components/ui/FwDialog.vue'
import FwEmpty from '@kohara-fuwari/components/ui/FwEmpty.vue'
import { useCreditDialog } from '@kohara-fuwari/composables/useCreditDialog'

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

onMounted(() => {
  refresh()
})
</script>

<template>
  <AppShell>
    <template #actions>
      <FwButton variant="primary" icon="wallet" @click="openCredit">充值</FwButton>
    </template>

    <template v-if="userInfo">
      <!-- 关键数字 -->
      <section class="stats">
        <FwStat label="账户余额" :value="balanceYuan" unit="元" icon="wallet" tone="primary">
          <span v-if="lowBalance">余额偏低，充钱可以变强哟～</span>
          <span v-else>按量计费，用多少扣多少</span>
        </FwStat>
        <FwStat label="积分" :value="pointsYuan" icon="sparkles">
          <router-link to="/balance" class="stats__link">100 : 1 兑换余额 →</router-link>
        </FwStat>
        <FwStat label="返利" :value="rebateYuan" unit="元" icon="percent">
          <router-link to="/balance" class="stats__link">推广返利 1 : 1 兑换 →</router-link>
        </FwStat>
      </section>

      <div class="grid-2">
        <!-- 账户信息 -->
        <FwCard title="账户" subtitle="登录方式与联系方式" icon="user">
          <ul class="info">
            <li class="info__row">
              <span class="info__icon"><LucideIcon name="mail" /></span>
              <div class="info__main">
                <span class="info__label">邮箱</span>
                <span class="info__value">{{ userInfo.email || '未绑定' }}</span>
              </div>
              <FwButton size="sm" @click="changeEmailPrompt">
                {{ userInfo.email ? '更换' : '绑定' }}
              </FwButton>
            </li>
            <li v-if="userInfo.email" class="info__row">
              <span class="info__icon"><LucideIcon name="bell" /></span>
              <div class="info__main">
                <span class="info__label">营销邮件</span>
                <span class="info__value info__value--muted">
                  仅在有新公告或优惠时发送，域名变更也会由此通知
                </span>
              </div>
              <FwSwitch v-model="emailOptIn" @change="toggleEmailOptIn()" />
            </li>
            <li class="info__row">
              <span class="info__icon"><LucideIcon name="send" /></span>
              <div class="info__main">
                <span class="info__label">Telegram</span>
                <span class="info__value">{{ userInfo.telegram_id || '未绑定' }}</span>
              </div>
              <FwButton size="sm" @click="bindTelegramPrompt">
                {{ userInfo.telegram_id ? '更换' : '绑定' }}
              </FwButton>
            </li>
            <li class="info__row">
              <span class="info__icon"><LucideIcon name="lock" /></span>
              <div class="info__main">
                <span class="info__label">密码</span>
                <span class="info__value info__value--muted">用于邮箱 + 密码登录</span>
              </div>
              <FwButton size="sm" @click="changePasswordPrompt">更改</FwButton>
            </li>
          </ul>

          <template #footer>
            <div class="danger-zone">
              <div>
                <strong>注销账号</strong>
                <span>永久删除账号与全部数据，不可恢复</span>
              </div>
              <FwButton variant="danger" size="sm" icon="alert-triangle" @click="cancelAccount">
                消灭我
              </FwButton>
            </div>
          </template>
        </FwCard>

        <!-- 订阅地址 -->
        <FwCard title="订阅地址" subtitle="点击即可复制" icon="rss">
          <template #actions>
            <FwButton size="sm" variant="plain" to="/sub" icon="arrow-right">更多格式</FwButton>
          </template>
          <div class="subs">
            <FwCopyField label="通用" hint="所有客户端均可用，按 UA 自动识别" :value="primarySub" />
            <FwCopyField
              label="防劫持"
              hint="节点解析为 IP，规避 DNS 劫持"
              :value="antiHijackSub"
            />
            <FwCopyField
              v-if="backupSub"
              label="备用"
              hint="主地址不可用时使用"
              :value="backupSub"
            />
          </div>
          <template #footer>
            <span>
              还不会配置？看看
              <router-link to="/tutorial" class="text-primary">客户端教程</router-link>
              ，或直接
              <router-link to="/sub" class="text-primary">一键导入</router-link>
              。
            </span>
          </template>
        </FwCard>
      </div>
    </template>

    <FwCard v-else>
      <FwEmpty loading />
    </FwCard>

    <!-- 营销邮件订阅提示 -->
    <FwDialog v-model="showOptInPrompt" title="订阅岛上资讯" size="sm">
      <div class="optin">
        <p>
          你还没有设置是否接收邮件资讯。强烈建议开启，以免失联——将来可能的<b>域名变更</b>也会由此通知。
        </p>
        <p class="text-3">只在有新公告或优惠时发送，不会频繁打扰；每封邮件都附带退订链接。</p>
        <FwSwitch
          v-model="emailOptIn"
          label="订阅营销邮件"
          description="如此求生欲满满了，订阅一下叭，呜呜～"
          @change="toggleEmailOptIn()"
        />
      </div>
      <template #footer>
        <FwButton variant="plain" @click="showOptInPrompt = false">稍后再说</FwButton>
        <FwButton variant="primary" @click="toggleEmailOptIn(true)">开启订阅</FwButton>
      </template>
    </FwDialog>
  </AppShell>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
}

.stats__link {
  color: var(--primary);
  font-weight: 600;
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
  display: flex;
  flex-direction: column;
}

.info__row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--line-divider);
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
  border-radius: var(--radius-sm);
  background: var(--btn-plain-bg-hover);
  color: var(--primary);
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
  font-size: 0.78rem;
  color: var(--text-3);
}

.info__value {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info__value--muted {
  font-weight: 400;
  color: var(--text-2);
  font-size: 0.82rem;
  white-space: normal;
}

.danger-zone {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.9rem;
  border-radius: var(--radius-md);
  background: var(--danger-soft);
  color: var(--danger);
}

.danger-zone div {
  display: flex;
  flex-direction: column;
  font-size: 0.78rem;
  line-height: 1.4;
}

.danger-zone strong {
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
  color: var(--danger);
}

@media (max-width: 1023px) {
  .grid-2 {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 767px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stats > :first-child {
    grid-column: 1 / -1;
  }
}
</style>

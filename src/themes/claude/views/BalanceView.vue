<script setup lang="ts">
import { ref } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useBalance } from '@/composables/useBalance'
import type { TrafficViewMode } from '@/utils/trafficHistory'
import AppShell from '@claude/components/layout/AppShell.vue'
import ClCard from '@claude/components/ui/ClCard.vue'
import ClButton from '@claude/components/ui/ClButton.vue'
import ClStat from '@claude/components/ui/ClStat.vue'
import ClCopyField from '@claude/components/ui/ClCopyField.vue'
import ClSegmented from '@claude/components/ui/ClSegmented.vue'
import ClEmpty from '@claude/components/ui/ClEmpty.vue'
import TrafficChart from '@claude/components/TrafficChart.vue'
import { useCreditDialog } from '@claude/composables/useCreditDialog'

const {
  userInfo,
  balanceYuan,
  pointsYuan,
  rebateYuan,
  unmeasuredMiB,
  canConvertPoints,
  canConvertRebate,
  inviteLinks,
  invitedCount,
  hasInvitePermission,
  trafficHistory,
  loadingHistory,
  usage7d,
  usage30d,
  applyInvite,
  convertPoints,
  convertRebate,
  withdraw,
} = useBalance()

const { open: openCredit } = useCreditDialog()

const viewMode = ref<TrafficViewMode>('daily')
const viewOptions: { value: TrafficViewMode; label: string }[] = [
  { value: 'detail', label: '明细' },
  { value: 'hourly', label: '每小时' },
  { value: 'daily', label: '每日' },
]
</script>

<template>
  <AppShell>
    <template #actions>
      <ClButton variant="primary" icon="wallet" @click="openCredit">充值</ClButton>
    </template>

    <template v-if="userInfo">
      <section class="stats">
        <ClStat label="账户余额" :value="balanceYuan" unit="元" icon="wallet" tone="accent">
          <ClButton size="sm" variant="soft" @click="openCredit">去充值</ClButton>
        </ClStat>
        <ClStat label="积分" :value="pointsYuan" icon="sparkles">
          <ClButton size="sm" variant="ghost" :disabled="!canConvertPoints" @click="convertPoints"
            >100 : 1 兑换</ClButton
          >
        </ClStat>
        <ClStat label="返利" :value="rebateYuan" unit="元" icon="percent">
          <ClButton size="sm" variant="ghost" :disabled="!canConvertRebate" @click="convertRebate"
            >1 : 1 兑换</ClButton
          >
          <ClButton size="sm" variant="ghost" @click="withdraw">提现</ClButton>
        </ClStat>
        <ClStat
          label="未计入流量"
          :value="unmeasuredMiB"
          unit="MiB"
          icon="activity"
          hint="尚未结算的用量，稍后会从余额扣除"
        />
      </section>

      <ClCard title="用量趋势" subtitle="余额变化与每段时间的消费">
        <template #actions>
          <ClSegmented v-model="viewMode" :options="viewOptions" size="sm" />
        </template>
        <div class="summary">
          <div class="summary__item">
            <span>近 7 天消费</span>
            <strong class="cl-serif">¥{{ usage7d.toFixed(2) }}</strong>
          </div>
          <div class="summary__item">
            <span>近 30 天消费</span>
            <strong class="cl-serif">¥{{ usage30d.toFixed(2) }}</strong>
          </div>
          <div class="summary__item">
            <span>记录条数</span>
            <strong class="cl-serif">{{ trafficHistory.length }}</strong>
          </div>
        </div>
        <ClEmpty v-if="loadingHistory && !trafficHistory.length" loading />
        <TrafficChart v-else :history="trafficHistory" :mode="viewMode" />
      </ClCard>

      <ClCard title="推广返利" subtitle="邀请朋友上岛，按比例获得返利">
        <template v-if="hasInvitePermission">
          <div class="invite">
            <div v-for="item in inviteLinks" :key="item.invite_link" class="invite__row">
              <ClCopyField label="邀请链接" :value="item.invite_link" hint="点击复制后分享给朋友" />
              <div class="invite__meta">
                <span class="invite__pill"
                  ><LucideIcon name="percent" /> 返利比例
                  {{ (Number(item.rebate_ratio) / 10).toFixed(1) }}%</span
                >
                <span class="invite__pill"
                  ><LucideIcon name="users" /> 已邀请 {{ invitedCount }} 人</span
                >
              </div>
            </div>
          </div>
        </template>
        <ClEmpty
          v-else-if="inviteLinks"
          icon="users"
          title="你还没有推广权限"
          description="申请后即可获得专属邀请链接，朋友通过链接注册并充值，你将按比例获得返利。"
        >
          <ClButton variant="primary" icon="sparkles" @click="applyInvite">申请推广权限</ClButton>
        </ClEmpty>
        <ClEmpty v-else loading />
      </ClCard>
    </template>

    <ClCard v-else>
      <ClEmpty loading />
    </ClCard>
  </AppShell>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.summary__item {
  display: flex;
  flex-direction: column;
  padding: 0.65rem 0.85rem;
  border-radius: var(--cl-radius-sm);
  background: var(--cl-surface-2);
  border: 1px solid var(--cl-border);
  font-size: 0.78rem;
  color: var(--cl-text-3);
}

.summary__item strong {
  font-size: 1.2rem;
  color: var(--cl-text);
  font-variant-numeric: tabular-nums;
}

.invite {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.invite__row {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.invite__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.invite__pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.75rem;
  border-radius: 999px;
  background: var(--cl-accent-soft);
  color: var(--cl-accent-ink);
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 1279px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .summary {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 479px) {
  .stats > :first-child {
    grid-column: 1 / -1;
  }
}
</style>

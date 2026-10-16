<script setup lang="ts">
import { ref } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useBalance } from '@/composables/useBalance'
import type { TrafficViewMode } from '@/utils/trafficHistory'
import AppShell from '@kohara-fuwari/components/layout/AppShell.vue'
import FwCard from '@kohara-fuwari/components/ui/FwCard.vue'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'
import FwStat from '@kohara-fuwari/components/ui/FwStat.vue'
import FwCopyField from '@kohara-fuwari/components/ui/FwCopyField.vue'
import FwSegmented from '@kohara-fuwari/components/ui/FwSegmented.vue'
import FwEmpty from '@kohara-fuwari/components/ui/FwEmpty.vue'
import TrafficChart from '@kohara-fuwari/components/TrafficChart.vue'
import { useCreditDialog } from '@kohara-fuwari/composables/useCreditDialog'

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
      <FwButton variant="primary" icon="wallet" @click="openCredit">充值</FwButton>
    </template>

    <template v-if="userInfo">
      <section class="stats">
        <FwStat label="账户余额" :value="balanceYuan" unit="元" icon="wallet" tone="primary">
          <FwButton size="sm" variant="regular" @click="openCredit">去充值</FwButton>
        </FwStat>
        <FwStat label="积分" :value="pointsYuan" icon="sparkles">
          <FwButton size="sm" variant="plain" :disabled="!canConvertPoints" @click="convertPoints">
            100 : 1 兑换
          </FwButton>
        </FwStat>
        <FwStat label="返利" :value="rebateYuan" unit="元" icon="percent">
          <FwButton size="sm" variant="plain" :disabled="!canConvertRebate" @click="convertRebate">
            1 : 1 兑换
          </FwButton>
          <FwButton size="sm" variant="plain" @click="withdraw">提现</FwButton>
        </FwStat>
        <FwStat
          label="未计入流量"
          :value="unmeasuredMiB"
          unit="MiB"
          icon="activity"
          hint="尚未结算的用量，稍后会从余额扣除"
        />
      </section>

      <FwCard title="用量趋势" subtitle="余额变化与每段时间的消费" icon="trending-up">
        <template #actions>
          <FwSegmented v-model="viewMode" :options="viewOptions" size="sm" />
        </template>
        <div class="usage-summary">
          <div class="usage-summary__item">
            <span>近 7 天消费</span>
            <strong>¥{{ usage7d.toFixed(2) }}</strong>
          </div>
          <div class="usage-summary__item">
            <span>近 30 天消费</span>
            <strong>¥{{ usage30d.toFixed(2) }}</strong>
          </div>
          <div class="usage-summary__item">
            <span>记录条数</span>
            <strong>{{ trafficHistory.length }}</strong>
          </div>
        </div>
        <FwEmpty v-if="loadingHistory && !trafficHistory.length" loading />
        <TrafficChart v-else :history="trafficHistory" :mode="viewMode" />
      </FwCard>

      <FwCard title="推广返利" subtitle="邀请朋友上岛，按比例获得返利" icon="users">
        <template v-if="hasInvitePermission">
          <div class="invite">
            <div v-for="item in inviteLinks" :key="item.invite_link" class="invite__row">
              <FwCopyField label="邀请链接" :value="item.invite_link" hint="点击复制后分享给朋友" />
              <div class="invite__meta">
                <span class="invite__pill">
                  <LucideIcon name="percent" />
                  返利比例 {{ (Number(item.rebate_ratio) / 10).toFixed(1) }}%
                </span>
                <span class="invite__pill">
                  <LucideIcon name="users" />
                  已邀请 {{ invitedCount }} 人
                </span>
              </div>
            </div>
          </div>
        </template>
        <FwEmpty
          v-else-if="inviteLinks"
          icon="users"
          title="你还没有推广权限"
          description="申请后即可获得专属邀请链接，朋友通过链接注册并充值，你将按比例获得返利。"
        >
          <FwButton variant="primary" icon="sparkles" @click="applyInvite">申请推广权限</FwButton>
        </FwEmpty>
        <FwEmpty v-else loading />
      </FwCard>
    </template>

    <FwCard v-else>
      <FwEmpty loading />
    </FwCard>
  </AppShell>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}

.usage-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.usage-summary__item {
  display: flex;
  flex-direction: column;
  padding: 0.6rem 0.8rem;
  border-radius: var(--radius-sm);
  background: var(--btn-plain-bg-hover);
  font-size: 0.78rem;
  color: var(--text-3);
}

.usage-summary__item strong {
  font-size: 1.05rem;
  color: var(--text-1);
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
  background: var(--primary-soft);
  color: var(--primary-strong);
  font-size: 0.8rem;
  font-weight: 600;
}

@media (max-width: 1279px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 767px) {
  .usage-summary {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 479px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stats > :first-child {
    grid-column: 1 / -1;
  }
}
</style>

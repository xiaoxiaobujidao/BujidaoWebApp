<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import {
  getInviteLink,
  createInviteLink,
  pointsToBalance,
  rebateToBalance,
  getInvitedCount,
} from '@/utils/user'
import { useUserInfoStore } from '@/stores/userInfoStore'
import DashboardLayout from '@violet-rose/components/layout/DashboardLayout.vue'
import PanelCard from '@violet-rose/components/ui/PanelCard.vue'
import VrButton from '@violet-rose/components/ui/VrButton.vue'
import VrModal from '@violet-rose/components/ui/VrModal.vue'
import CopyField from '@violet-rose/components/ui/CopyField.vue'
import AddCredit from '@violet-rose/components/AddCredit.vue'
import TrafficHistory from '@violet-rose/components/TrafficHistory.vue'

const userInfoStore = useUserInfoStore()
const userInfo = computed(() => userInfoStore.getUserInfo())

const invitedCount = ref(0)
const inviteLinks = ref<{ invite_link: string; rebate_ratio: string }[]>()
const showCredit = ref(false)
const showTraffic = ref(false)

onMounted(() => {
  userInfoStore.updateUserInfo()
  getInviteLink().then((res) => {
    inviteLinks.value = res.result
    if (inviteLinks.value?.length) {
      getInvitedCount().then((r) => {
        invitedCount.value = r.result
      })
    }
  })
})

function convert(fn: () => Promise<{ error?: { message?: string } }>) {
  fn().then((res) => {
    if (!res.error) {
      ElMessage.success('兑换成功')
      userInfoStore.updateUserInfo()
    } else {
      ElMessage.error(res.error?.message ?? '兑换失败')
    }
  })
}

function applyInvite() {
  createInviteLink().then((res) => {
    inviteLinks.value = res.result
    ElMessage.success('申请成功')
  })
}
</script>

<template>
  <DashboardLayout>
    <div v-if="userInfo" class="balance-page">
      <div class="asset-cards">
        <PanelCard title="余额">
          <p class="asset-value">¥{{ (userInfo.balance / 100).toFixed(2) }}</p>
          <div class="asset-actions">
            <VrButton size="sm" @click="showCredit = true">充值</VrButton>
            <VrButton variant="ghost" size="sm" @click="showTraffic = true">流量记录</VrButton>
          </div>
        </PanelCard>

        <PanelCard title="积分">
          <p class="asset-value">{{ (userInfo.points / 100).toFixed(2) }}</p>
          <VrButton variant="ghost" size="sm" @click="convert(pointsToBalance)">
            100:1 兑换余额
          </VrButton>
        </PanelCard>

        <PanelCard title="返利">
          <p class="asset-value">¥{{ (userInfo.rebate / 100).toFixed(2) }}</p>
          <VrButton variant="ghost" size="sm" @click="convert(rebateToBalance)">
            1:1 兑换余额
          </VrButton>
        </PanelCard>
      </div>

      <PanelCard title="邀请推广" subtitle="分享链接获取返利">
        <template v-if="inviteLinks?.length">
          <div v-for="(item, i) in inviteLinks" :key="i" class="invite-block">
            <CopyField label="邀请链接" :value="item.invite_link" />
            <p class="rebate-ratio">返利比例：{{ (Number(item.rebate_ratio) / 10).toFixed(1) }}%</p>
          </div>
          <p v-if="invitedCount > 0" class="invite-count">已邀请 {{ invitedCount }} 人</p>
        </template>
        <template v-else>
          <p class="no-invite">暂无推广权限</p>
          <VrButton @click="applyInvite">申请推广</VrButton>
        </template>
      </PanelCard>
    </div>

    <VrModal v-model="showCredit" title="充值" wide>
      <AddCredit />
    </VrModal>

    <VrModal v-model="showTraffic" title="流量记录" wide>
      <TrafficHistory />
    </VrModal>
  </DashboardLayout>
</template>

<style scoped>
.balance-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.asset-cards {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .asset-cards {
    grid-template-columns: repeat(3, 1fr);
  }
}

.asset-value {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-accent-deep);
  margin-bottom: 0.75rem;
}

.asset-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.invite-block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.rebate-ratio,
.invite-count {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.no-invite {
  margin-bottom: 0.75rem;
  color: var(--color-text-secondary);
}
</style>

<script setup lang="ts">
// Vue
import { onMounted, ref, computed } from 'vue'

// Element Plus
import { ElMessage } from 'element-plus'

// Components
import UserMainView from './UserMainView.vue'
import AddCredit from '@bujidao/components/AddCredit.vue'
import TrafficHistory from '@bujidao/components/TrafficHistory.vue'

// Stores
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useScreenStore } from '@bujidao/stores/screenStore'

// Utils
import {
  getInviteLink,
  createInviteLink,
  pointsToBalance,
  rebateToBalance,
  getInvitedCount,
} from '@/utils/user'
import { touchCopy } from '@/utils/copy'

// Stores initialization
const userInfoStore = useUserInfoStore()
const screenStore = useScreenStore()

// Computed
const user_info = computed(() => userInfoStore.getUserInfo())
const width = computed(() => screenStore.width)

// State
const invited_count = ref(0)
const invite_links = ref()
const show_add_credit = ref(false)
const show_traffic_history = ref(false)
const um_traffic = ref()

// Functions
function showCredit() {
  show_add_credit.value = !show_add_credit.value
}

function showTrafficHistory() {
  show_traffic_history.value = true
}

function create_invite_link() {
  createInviteLink()
    .then((res: any) => {
      invite_links.value = res.result
    })
    .catch((err: any) => {
      ElMessage.error(err)
    })
}

function todo() {
  ElMessage.info('功能暂未开放，敬请期待')
}

// 余额兑换通用处理函数
function handleBalanceConversion(conversionFn: () => Promise<any>) {
  conversionFn().then((res: any) => {
    if (!res.error) {
      ElMessage.success('兑换成功')
      init()
    } else {
      ElMessage.error(res.error.message)
    }
  })
}

function points_to_balance() {
  handleBalanceConversion(pointsToBalance)
}

function rebate_to_balance() {
  handleBalanceConversion(rebateToBalance)
}

// 初始化用户数据
function init() {
  // Update user info on mount
  userInfoStore.updateUserInfo()
}

// Lifecycle
onMounted(() => {
  init()

  // 获取邀请链接
  getInviteLink().then((res: any) => {
    invite_links.value = res.result
    if (invite_links.value.length > 0) {
      getInvitedCount().then((res: any) => {
        invited_count.value = res.result
      })
    }
  })
})
</script>

<template>
  <UserMainView>
    <div v-if="user_info" class="panel-grid">
      <section class="panel">
        <div class="panel__title">资产</div>
        <div class="panel__body">
          <div class="info-row">
            <span class="info-row__label">余额</span>
            <span class="info-row__value stat-value">¥{{ (user_info.balance / 100).toFixed(2) }}</span>
            <div class="info-row__actions">
              <el-button type="primary" size="small" round @click="showCredit()">充值</el-button>
              <el-button size="small" round @click="showTrafficHistory()">流量记录</el-button>
            </div>
          </div>
          <div class="info-row">
            <span class="info-row__label">积分</span>
            <span class="info-row__value">{{ (user_info.points / 100).toFixed(2) }}</span>
            <div class="info-row__actions">
              <el-button type="primary" size="small" round @click="points_to_balance()">
                <el-tooltip content="将100:1兑换为余额" placement="right">兑换为余额</el-tooltip>
              </el-button>
            </div>
          </div>
          <div class="info-row">
            <span class="info-row__label">返利</span>
            <span class="info-row__value">¥{{ (user_info.rebate / 100).toFixed(2) }}</span>
            <div class="info-row__actions">
              <el-button type="primary" size="small" round @click="rebate_to_balance()">
                <el-tooltip content="将1:1兑换为余额" placement="right">兑换为余额</el-tooltip>
              </el-button>
              <el-button size="small" round @click="todo()">提现</el-button>
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel__title">推广</div>
        <div class="panel__body">
          <template v-if="invite_links && invite_links.length > 0">
            <div v-for="item in invite_links" :key="item.invite_link">
              <div class="info-row hand" @click="touchCopy(item.invite_link)">
                <span class="info-row__label">邀请链接</span>
                <span class="info-row__value info-row__value--mono">{{ item.invite_link }}</span>
              </div>
              <div class="info-row">
                <span class="info-row__label">返利比例</span>
                <span class="info-row__value">{{ (item.rebate_ratio / 10).toFixed(1) + '%' }}</span>
              </div>
            </div>
            <div v-if="invited_count > 0" class="info-row">
              <span class="info-row__label">总邀请</span>
              <span class="info-row__value">{{ invited_count }} 人</span>
            </div>
          </template>
          <div v-else class="info-row">
            <span class="info-row__label">权限</span>
            <span class="info-row__value">您还没有推广权限</span>
            <div class="info-row__actions">
              <el-button type="primary" size="small" round @click="create_invite_link">点击申请</el-button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <el-dialog v-model="show_add_credit" center :width="width < 800 ? '90%' : '480px'">
      <AddCredit v-if="show_add_credit" />
    </el-dialog>

    <el-dialog
      v-model="show_traffic_history"
      center
      :width="width < 800 ? '95%' : '90%'"
      style="height: 80vh"
      destroy-on-close
      align-center
      class="th"
    >
      <TrafficHistory />
    </el-dialog>
  </UserMainView>
</template>

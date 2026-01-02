<script setup lang="ts">
// Vue
import { onMounted, ref, computed } from 'vue'

// Element Plus
import { ElMessage } from 'element-plus'

// Components
import UserMainView from './UserMainView.vue'
import AddCredit from '@test/components/AddCredit.vue'
import TrafficHistory from '@test/components/TrafficHistory.vue'

// Stores
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useScreenStore } from '@test/stores/screenStore'

// Utils
import {
  getInviteLink,
  createInviteLink,
  getUnmeasuredTraffic,
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

  // 获取未计入流量
  getUnmeasuredTraffic().then((res: any) => {
    um_traffic.value = res.result
  })

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
    <div class="box">
      <div class="user-main" v-if="user_info">
        <p>
          余额：{{ user_info.balance / 100 }}
          <el-button type="primary" @click="showCredit()" round>充值</el-button>
        </p>

        <p>
          未计入流量：{{
            um_traffic ? (um_traffic / 100 / 1024 / 1024).toFixed(3) : (0).toFixed(3)
          }}
          MiB
          <el-button type="primary" size="small" @click="showTrafficHistory()" round>
            流量记录
          </el-button>
        </p>

        <p>
          积分：{{ user_info.points / 100 }}
          <el-button type="primary" size="small" @click="points_to_balance()" round>
            <el-tooltip content="将100:1兑换为余额" placement="right"> 兑换为余额 </el-tooltip>
          </el-button>
        </p>
        <p>
          返利：{{ user_info.rebate / 100 }}
          <el-button type="primary" size="small" @click="rebate_to_balance()" round>
            <el-tooltip content="将1:1兑换为余额" placement="right"> 兑换为余额 </el-tooltip>
          </el-button>
          <el-button type="primary" size="small" @click="todo()" round> 提现 </el-button>
        </p>
        <div>
          <div style="display: contents" v-for="item in invite_links" :key="item">
            <p class="hand" @click="touchCopy(item.invite_link)">
              邀请链接：
              {{ item.invite_link }}
              <br />
            </p>
            <p>返利比例：{{ (item.rebate_ratio / 10).toFixed(1) + '%' }}</p>
          </div>
          <p v-if="invited_count > 0">总邀请人数：{{ invited_count }}</p>
          <p v-if="invite_links && invite_links.length == 0">您还没有推广权限</p>
          <p v-if="invite_links && invite_links.length == 0">
            <el-button @click="create_invite_link">点击申请</el-button>
          </p>
        </div>
        <el-dialog v-model="show_add_credit" center :width="width < 800 ? '80%' : '50%'">
          <AddCredit v-if="show_add_credit" />
        </el-dialog>

        <el-dialog
          v-model="show_traffic_history"
          center
          :width="width < 800 ? '200%' : '90%'"
          style="height: 80vh"
          destroy-on-close
          align-center
          class="th"
        >
          <TrafficHistory />
        </el-dialog>
      </div>
    </div>
  </UserMainView>
</template>

<style lang="scss" scoped>
.box {
  min-height: calc(100vh - 100px);
  border-radius: 15px;
}

.user-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 32px;
}
</style>

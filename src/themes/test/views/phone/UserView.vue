<script setup lang="ts">
import MainView from './MainView.vue'
import { onMounted, onUnmounted, computed, ref, h, watch } from 'vue'
import { cancel, updateEmailOptIn } from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import AddCredit from '@test/components/AddCredit.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { changeEmail, changePasswd, bindTelegram, getInvitedCount } from '@/utils/user'
import { WarningFilled } from '@element-plus/icons-vue'
import { useAnnouncementStore } from '@/stores/announcementStore'

// 当前宽度
import { useScreenStore } from '@test/stores/screenStore'
const screenStore = useScreenStore()
const width = computed(() => screenStore.width)
//
const invited_count = ref(0)
//
const email_opt_in = ref(false)
const email_opt_in_not_set = ref(false)
const change_email_opt_in = function () {
  updateEmailOptIn(email_opt_in.value)
    .then((res: any) => {
      if (!res.error) {
        ElMessage.success('订阅状态更改成功')
        init()
      } else {
        ElMessage.error('订阅状态更改失败，如有疑问，请联系管理员')
      }
    })
    .catch((e: any) => {
      console.log(e)
      ElMessage.error('网络连接失败，请检查网络后重试，如有疑问请联系管理员')
    })
}
//
const show_add_credit = ref(false)
function showCredit() {
  show_add_credit.value = !show_add_credit.value
}
const show_announcement_pin = ref(false)
import { useUserInfoStore } from '@/stores/userInfoStore'
const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const user_info = computed(() => userInfoStore.getUserInfo())
// 使用公告 store
const announcementStore = useAnnouncementStore()
const announcement_list = computed(() => announcementStore.getAnnouncement() || [])
const announcement_pin = computed(() => {
  const pinned = announcement_list.value
    .filter((item: any) => item.pin)
    .sort((a: any, b: any) => b.edit_time - a.edit_time)
  return pinned.length > 0 && pinned[0] ? pinned[0].announcement : ''
})
function cancelAccount() {
  cancel().then((res: any) => {
    if (res.result == true) {
      ElMessage.success('注销成功')
      location.href = '/signout'
    } else {
      ElMessage.error('注销失败，请联系管理员')
    }
  })
}
function bind_telegram() {
  ElMessageBox.prompt(
    h('div', null, [
      h('p', null, '请输入您的 TelegramID'),
      h('p', null, [
        '可联系 ',
        h('a', { href: 'https://bujidao_bot.t.me', target: '_blank' }, '@test_Bot'),
        ' 获取',
      ]),
    ]),
    '',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputType: 'number',
      autofocus: true,
    },
  )
    .then(({ value }) => {
      bindTelegram((value as any as number) * 1)
        .then((res: any) => {
          if (!res.error) {
            ElMessage.success('绑定成功')
            init()
          } else {
            ElMessage.error(res.error.message)
          }
        })
        .catch((e: any) => {
          console.log(e)
          ElMessage.error('网络连接失败，请检查网络后重试，如有疑问请联系管理员')
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}

function change_email() {
  ElMessageBox.prompt('请输入您的邮箱地址', '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputPattern:
      /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
    inputErrorMessage: 'Invalid Email',
    inputType: 'email',
  })
    .then(({ value }) => {
      changeEmail(value)
        .then((res: any) => {
          if (res.result) {
            ElMessage.success('邮件更改成功')
            init()
          } else {
            ElMessage.error('邮件更改失败，如有疑问，请联系管理员')
          }
        })
        .catch((e: any) => {
          console.log(e)
          ElMessage.error('网络连接失败，请检查网络后重试，如有疑问请联系管理员')
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}
function change_pass() {
  ElMessageBox.prompt('请输入您的新密码', '', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputType: 'password',
    autofocus: true,
  })
    .then(({ value }) => {
      changePasswd(value)
        .then((res: any) => {
          if (res.result) {
            ElMessage.success('密码更改成功')
          } else {
            ElMessage.error('密码更改失败，如有疑问，请联系管理员')
          }
        })
        .catch((e: any) => {
          console.log(e)
          ElMessage.error('网络连接失败，请检查网络后重试，如有疑问请联系管理员')
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}

// 来自财务
// 创建邀请链接
import { getInviteLink, createInviteLink } from '@/utils/user'
import { getUnmeasuredTraffic, pointsToBalance, rebateToBalance } from '@/utils/user'
import TrafficHistory from '@test/components/TrafficHistory.vue'
const invite_links = ref()
function create_invite_link() {
  createInviteLink()
    .then((res: any) => {
      invite_links.value = res.result
    })
    .catch((err: any) => {
      ElMessage.error(err)
    })
}

const um_traffic = ref()
getUnmeasuredTraffic().then((res: any) => {
  um_traffic.value = res.result
})
function todo() {
  ElMessage.info('功能暂未开放，敬请期待')
}
// 余额兑换
function points_to_balance() {
  pointsToBalance().then((res: any) => {
    if (!res.error) {
      ElMessage.success('兑换成功')
      init()
    } else {
      ElMessage.error(res.error.message)
    }
  })
}
function rebate_to_balance() {
  rebateToBalance().then((res: any) => {
    if (!res.error) {
      ElMessage.success('兑换成功')
      init()
    } else {
      ElMessage.error(res.error.message)
    }
  })
}
//
// 流量记录
const show_traffic_history = ref(false)
function showTrafficHistory() {
  // ElMessage.info('功能暂未开放，敬请期待')
  show_traffic_history.value = true
}

const init = async () => {
  // 充值奖励
  if (sessionStorage.getItem('gift_shown') == undefined) {
    await announcementStore.updateAnnouncement()
    const pinned = announcement_list.value
      .filter((item: any) => item.pin)
      .sort((a: any, b: any) => b.edit_time - a.edit_time)
    if (pinned.length > 0) {
      sessionStorage.setItem('gift_shown', 'true')
      show_announcement_pin.value = true
    }
  }
  getInviteLink().then((res: any) => {
    invite_links.value = res.result
    if (invite_links.value.length > 0) {
      getInvitedCount().then((res: any) => {
        invited_count.value = res.result
      })
    }
  })
}
init()
watch(
  user_info,
  () => {
    if (!user_info.value) return
    email_opt_in.value = user_info.value?.email_opt_in > 0
    if (user_info.value.email && user_info.value.email_opt_in == 0) {
      email_opt_in_not_set.value = true
    }
  },
  { immediate: true },
)
</script>
<template>
  <MainView>
    <div class="user-main" v-if="user_info">
      <div class="main-box">
        <h2>信息</h2>
        <div>
          <p>
            <b> 邮件地址： </b>{{ user_info.email ? user_info.email : '未设置' }}
            <el-button v-if="user_info.email" type="primary" @click="change_email()" round
              >更换</el-button
            >
            <el-button v-else type="primary" @click="change_email()" round>绑定</el-button>
          </p>
          <p v-if="user_info.email">
            <b>订阅营销邮件</b
            ><el-switch
              v-model="email_opt_in"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="change_email_opt_in"
            ></el-switch>
          </p>
          <p>
            <b> Telegram： </b>{{ user_info.telegram_id ? user_info.telegram_id : '未设置' }}
            <el-button v-if="user_info.telegram_id" type="primary" @click="bind_telegram()" round
              >更换</el-button
            >
            <el-button v-else type="primary" @click="bind_telegram()" round>绑定</el-button>
          </p>
          <span class="no-wrap">
            <el-button type="primary" @click="change_pass()" round>更改密码</el-button>
            <el-popconfirm
              cancel-button-text="取消"
              confirm-button-text="是的！"
              :icon="WarningFilled"
              icon-color="#ff0000"
              title="确认要被消灭么？彻彻底底，完完全全清除一切存在于岛的痕迹？"
              @cancel="console.log('')"
              @confirm="cancelAccount"
            >
              <template #reference>
                <el-button type="primary" round>消灭我🔥</el-button>
              </template>
            </el-popconfirm>
          </span>
        </div>
      </div>
      <div class="main-box">
        <h2>财务</h2>
        <div>
          <p>
            <b> 余额： </b> {{ user_info.balance / 100 }}
            <el-button type="primary" @click="showCredit()" round>充值</el-button>
          </p>
          <p>
            <b> 剩余可用：</b>
            至多
            <b>
              <span :style="{ color: 'aquamarine' }">
                {{ user_info.balance + 1000 }}
              </span>
              G
            </b>
          </p>
          <p v-if="user_info.balance < 1000" style="color: burlywood">充钱可以变强哟～</p>
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
          <div>
            <p style="line-height: 2.5">
              返利：{{ user_info.rebate / 100 }}
              <el-button type="primary" size="small" @click="rebate_to_balance()" round>
                <el-tooltip content="将1:1兑换为余额" placement="right"> 兑换为余额 </el-tooltip>
              </el-button>
              <el-button type="primary" size="small" @click="todo()" round> 提现 </el-button>
            </p>
            <div style="display: contents" v-for="item in invite_links" :key="item">
              <p class="hand" style="line-height: 2.5" @click="touchCopy(item.invite_link)">
                邀请链接：
                <br />
                {{ item.invite_link }}
                <br />
              </p>
              <p style="line-height: 2.5">
                返利比例：{{ (item.rebate_ratio / 10).toFixed(1) + '%' }}
              </p>
            </div>
            <p v-if="invited_count > 0">总邀请人数：{{ invited_count }}</p>
            <p v-if="invite_links && invite_links.length == 0">您还没有推广权限</p>
            <p v-if="invite_links && invite_links.length == 0">
              <el-button @click="create_invite_link">点击申请</el-button>
            </p>
          </div>
        </div>
      </div>
      <div class="footer"></div>
    </div>
    <el-dialog v-model="show_add_credit" center :width="width < 800 ? '80%' : '50%'">
      <AddCredit v-if="show_add_credit" />
    </el-dialog>
    <el-dialog v-model="show_announcement_pin" center :width="width < 800 ? '80%' : '50%'">
      <div v-html="announcement_pin"></div>
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
    <el-dialog v-model="email_opt_in_not_set" center :width="width < 800 ? '80%' : '50%'">
      <div>
        <p>还未设置是否订阅邮件，建议订阅或关注频道以获得最新优惠资讯</p>
        <p>
          强烈建议开启，以避免失联，将来有可能的<span style="color: tomato">域名变更</span
          >也会由此发送
        </p>
        <p>
          订阅邮件只会在有新公告或优惠时发送，<span style="color: chocolate">不会频繁打扰</span>
        </p>
        <p>退订链接会随资讯邮件一并发送，点击即可退订</p>
        <p>如此求生欲满满了，订阅一下叭，呜呜～</p>
        <p>
          <b>订阅营销邮件</b
          ><el-switch
            v-model="email_opt_in"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="change_email_opt_in"
          ></el-switch>
        </p>
      </div>
    </el-dialog>
  </MainView>
</template>
<style lang="scss" scoped>
.user-main {
  position: relative;
  top: 60px;
  display: flex;
  flex-direction: row;
  gap: 24px;
  padding: 16px;
  flex-wrap: wrap;
  overflow-y: scroll;

  h2 {
    margin-bottom: 10px;
  }

  .main-box {
    flex: 1 1 auto;
    align-items: stretch;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  > div > div {
    border-radius: 5px;
    padding: 16px;
    border: 1px solid var(--el-border-color);
    flex: 1 0 auto;
    overflow-x: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

p {
  word-break: keep-all;
}

.footer {
  display: block;
  min-height: 60px;
  width: 100%;
}

.no-wrap {
  white-space: nowrap;
}
</style>

<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, h, watch } from 'vue'
import { getGift, cancel, updateEmailOptIn } from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import AddCredit from '@kohara-fuwari/components/AddCredit.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { changeEmail, changePasswd, bindTelegram } from '@/utils/user'
import { WarningFilled } from '@element-plus/icons-vue'
import { useUserInfoStore } from '@/stores/userInfoStore'
import UserMainView from './UserMainView.vue'
import { useScreenStore } from '@kohara-fuwari/stores/screenStore'
import { useAnnouncementStore } from '@/stores/announcementStore'
import { closeTelegramWebApp } from '@/utils/telegram'

const userInfoStore = useUserInfoStore()
const user_info = computed(() => userInfoStore.getUserInfo())
// 当前宽度
const screenStore = useScreenStore()
const width = computed(() => screenStore.width)
//
const email_opt_in = ref(false)
const email_opt_in_not_set = ref(false)
const change_email_opt_in = function () {
  console.log('email_opt_in', email_opt_in.value)
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
// 使用公告 store
const announcementStore = useAnnouncementStore()
const announcement_list = computed(() => announcementStore.getAnnouncement() || [])
const announcement_pin = computed(() => {
  const pinned = announcement_list.value
    .filter((item: any) => item.pin)
    .sort((a: any, b: any) => b.edit_time - a.edit_time)
  return pinned[0] ? pinned[0].announcement : ''
})
function cancelAccount() {
  cancel().then((res: any) => {
    if (res.result == true) {
      ElMessage.success('注销成功')
      // 关闭当前窗口
      closeTelegramWebApp()
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
        h('a', { href: 'https://bujidao_bot.t.me', target: '_blank' }, '@Bujidao_Bot'),
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
watch(
  user_info,
  () => {
    console.log('user_info', user_info.value)
    if (!user_info.value) return
    email_opt_in.value = user_info.value?.email_opt_in > 0
    if (user_info.value.email && user_info.value.email_opt_in == 0) {
      email_opt_in_not_set.value = true
    }
  },
  { immediate: true },
)
const init = async function () {
  await userInfoStore.updateUserInfo()
  if (!user_info.value) return
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
init()
</script>

<template>
  <UserMainView>
    <div class="box loading-box" v-if="!user_info">
      <div class="loading-spinner">
        <span class="icon-[tabler--loader-2] animate-spin text-[2rem] text-[var(--primary)]"></span>
      </div>
    </div>
    <div class="box" v-else>
      <div class="user-main">
        <div>
          <h2>余额</h2>
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
          </div>
        </div>
        <div>
          <h2>账户</h2>
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
        <div>
          <h2>订阅</h2>
          <div>
            <p
              v-for="(item, index) in user_info.sub_address"
              :key="index"
              @click="touchCopy(item)"
              class="hand"
            >
              <el-tooltip content="所有客户端均可用，使用UA进行判断" placement="top">
                <b> {{ index == 0 ? '通用' : '备用' }}订阅： </b>
              </el-tooltip>
              <el-tooltip content="点击复制" placement="top">
                <span class="no-wrap">
                  {{ item }}
                </span>
              </el-tooltip>
            </p>
          </div>
        </div>
      </div>
    </div>
    <el-dialog v-model="show_add_credit" center :width="width < 800 ? '80%' : '50%'">
      <AddCredit v-if="show_add_credit" />
    </el-dialog>
    <el-dialog v-model="show_announcement_pin" center :width="width < 800 ? '80%' : '50%'">
      <div v-html="announcement_pin"></div>
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
  </UserMainView>
</template>

<style scoped>
.box {
  min-height: calc(100vh - 100px);
  border-radius: 15px;
}

.loading-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-main {
  display: flex;
  flex-direction: row;
  padding: 32px;
  flex-wrap: wrap;
  border-radius: 15px;
  gap: 32px;
}

.user-main > div {
  flex: 1 1 auto;
  align-items: stretch;
  display: flex;
  flex-direction: column;
  overflow: auto;
  min-width: 400px;
}

.user-main > div > div {
  border-radius: 15px;
  padding: 32px;
  border: 1px solid var(--el-border-color);
  flex: 1 0 auto;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h2 {
  margin-bottom: 10px;
}

.no-wrap {
  white-space: nowrap;
}
</style>

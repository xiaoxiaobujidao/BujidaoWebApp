<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref, h, watch } from 'vue'
import { getGift, cancel, updateEmailOptIn } from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import AddCredit from '@bujidao/components/AddCredit.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { changeEmail, changePasswd, bindTelegram } from '@/utils/user'
import { useUserInfoStore } from '@/stores/userInfoStore'
import UserMainView from './UserMainView.vue'
import { useScreenStore } from '@bujidao/stores/screenStore'
import { closeTelegramWebApp } from '@/utils/telegram'
import BjButton from '@bujidao/components/ui/BjButton.vue'
import AnnouncementModal from '@bujidao/components/AnnouncementModal.vue'

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
function confirmCancelAccount() {
  ElMessageBox.confirm('确认要被消灭么？彻彻底底，完完全全清除一切存在于岛的痕迹？', '确认销户', {
    confirmButtonText: '是的！',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      cancelAccount()
    })
    .catch(() => {})
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
  if (!user_info.value) return
  userInfoStore.updateUserInfo()
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
    <div v-if="user_info" class="panel-grid panel-grid--2">
      <section class="panel">
        <div class="panel__title">账户</div>
        <div class="panel__body">
          <div class="info-row">
            <span class="info-row__label">余额</span>
            <span class="info-row__value stat-value">¥{{ (user_info.balance / 100).toFixed(2) }}</span>
            <div class="info-row__actions">
              <BjButton size="sm" @click="showCredit()">充值</BjButton>
            </div>
            <p v-if="user_info.balance < 1000" class="info-row__hint">充钱可以变强哟～</p>
          </div>
          <div class="info-row">
            <span class="info-row__label">邮件地址</span>
            <span class="info-row__value">{{ user_info.email ? user_info.email : '未设置' }}</span>
            <div class="info-row__actions">
              <BjButton v-if="user_info.email" size="sm" @click="change_email()">
                更换
              </BjButton>
              <BjButton v-else size="sm" @click="change_email()">绑定</BjButton>
            </div>
          </div>
          <div v-if="user_info.email" class="info-row">
            <span class="info-row__label">营销邮件</span>
            <span class="info-row__value">订阅状态</span>
            <div class="info-row__actions">
              <el-switch
                v-model="email_opt_in"
                active-color="#3da5e8"
                inactive-color="#c9954a"
                @change="change_email_opt_in"
              />
            </div>
          </div>
          <div class="info-row">
            <span class="info-row__label">Telegram</span>
            <span class="info-row__value">{{ user_info.telegram_id ? user_info.telegram_id : '未设置' }}</span>
            <div class="info-row__actions">
              <BjButton v-if="user_info.telegram_id" size="sm" @click="bind_telegram()">
                更换
              </BjButton>
              <BjButton v-else size="sm" @click="bind_telegram()">绑定</BjButton>
            </div>
          </div>
          <div class="info-row">
            <span class="info-row__label">安全</span>
            <div class="info-row__actions">
              <BjButton size="sm" @click="change_pass()">更改密码</BjButton>
              <BjButton variant="ghost" size="sm" @click="confirmCancelAccount">消灭我 🔥</BjButton>
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel__title">订阅</div>
        <div class="panel__body">
          <div
            v-for="(item, index) in user_info.sub_address"
            :key="index"
            class="info-row hand"
            @click="touchCopy(item)"
          >
            <span class="info-row__label">
              <el-tooltip content="所有客户端均可用，使用UA进行判断" placement="top">
                {{ index == 0 ? '通用' : '备用' }}
              </el-tooltip>
            </span>
            <el-tooltip content="点击复制" placement="top">
              <span class="info-row__value info-row__value--mono">{{ item }}</span>
            </el-tooltip>
          </div>
        </div>
      </section>
    </div>
    <AnnouncementModal />
    <el-dialog v-model="show_add_credit" center :width="width < 800 ? '80%' : '50%'">
      <AddCredit v-if="show_add_credit" />
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

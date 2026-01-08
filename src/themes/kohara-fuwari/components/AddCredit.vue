<script setup lang="ts">
import { ref } from 'vue'
import { addCredit, getPaymentMethod, getGift } from '@/utils/user'
import { ElMessage } from 'element-plus'
import { is_ios } from '@/utils/utils'
//
// 获取支付方式
const payment_method = ref()
getPaymentMethod().then((res: any) => {
  payment_method.value = res.result
})
//
// 支付步骤
// 0 输入支付金额 1 选择支付方式 2 支付已跳转
const step = ref(0)
// const pay_link = ref()
// const qr_code = ref()
const num = ref(10)
function add_credit(path: string, method: string) {
  addCredit(path, method, num.value * 100).then((res: any) => {
    if (res.error) {
      ElMessage.error(res.error.message)
      return
    }
    if (res.result.pay_link) {
      // iOS
      if (is_ios()) {
        ElMessage.success('正在跳转支付页面')
        window.location.href = res.result.pay_link
      } else {
        let new_page = window.open(res.result.pay_link)
        if (new_page == null || typeof new_page == 'undefined') {
          ElMessage.info('弹出窗口失败，正在尝试本页面打开')
          window.location.href = res.result.pay_link
        }
      }
    }
    step.value = 2
  })
}
const gift = ref()
getGift().then((res: any) => {
  if (res.result != null) {
    if (res.result.length > 0) {
      gift.value = res.result
    }
  }
})
</script>
<template>
  <div v-if="step == 0" class="payment">
    <div v-show="gift" class="gift-container">
      <p>
        <strong> 岛岛有充值活动啦： </strong>
      </p>
      <p v-for="item in gift" :key="item.index" class="gift">
        充值每满<span>
          {{ item[0] }}
        </span>
        赠<span>
          {{ item[1] }}
        </span>
        元余额
      </p>
      <p>取不重复赠送计算之最高，如冲2送1，冲3送2，则冲5会送3</p>
    </div>
    <div>
      <p>请输入充值金额，最低充值金额10元，仅支持整数</p>
      <el-input-number v-model="num" :min="10" :max="1000" controls-position="right" size="large" />
      <el-button type="primary" @click="step = 1" round>下一步</el-button>
    </div>
  </div>
  <div v-if="step == 1" class="payment">
    <p>请选择支付方式</p>
    <div class="payment-method">
      <div v-for="item in payment_method" :key="item.index" style="display: contents">
        <div style="text-align: center">
          <span>{{ item.name }}</span>
        </div>
        <div class="pay-icon">
          <img
            class="payment-svg"
            v-for="(method, i) in item.method"
            :key="i"
            :src="method.img"
            alt=""
            @click="add_credit(item.path, method.kind)"
          />
        </div>
      </div>
    </div>
  </div>
  <div v-if="step == 2" class="payment">
    <p>请在支付页面进行支付</p>
  </div>
</template>
<style lang="scss" scoped>
.payment {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  .gift-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

.payment-svg {
  margin: 5px;
  width: 40px;
  height: 40px;
}

.payment-method {
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-content: center;
  align-items: center;
  font-size: 19px;

  .pay-icon {
    display: flex;
    flex-direction: row;
    align-items: left;
    justify-content: left;
    overflow-x: auto;
  }
}

.gift > span {
  color: var(--el-color-primary);
}
</style>

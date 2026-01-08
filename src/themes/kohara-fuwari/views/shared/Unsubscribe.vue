<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { emailOptOut } from '@/utils/user'
import { ElMessage } from 'element-plus'
const verified = ref(false)
const key = ref()
const err_message = ref()
const init = () => {
  key.value = router.currentRoute.value.query.key ? router.currentRoute.value.query.key : undefined
  emailOptOut(key.value).then((res) => {
    if (res.result) {
      verified.value = true
    }
    if (res.error) {
      err_message.value = res.error
      ElMessage.error(res.error)
    }
  })
}
init()
</script>
<template>
  <div>
    <h2 v-show="!verified && !err_message">正在验证...</h2>
    <h2 v-show="verified">取消订阅成功</h2>
    <h2 v-show="err_message">错误信息：{{ err_message }}</h2>
  </div>
</template>
<style lang="scss" scoped>
h2 {
  text-align: center;
  margin-top: 300px;
  font-size: 20px;
  color: #333;
}
</style>

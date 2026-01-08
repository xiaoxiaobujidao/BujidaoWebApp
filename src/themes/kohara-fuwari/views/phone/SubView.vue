<script setup lang="ts">
import { ref, computed } from 'vue'
import { changeUuid, changeSubKey, changeWireguardPriKey } from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfoStore'
import MainView from './MainView.vue'

const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const user_info = computed(() => userInfoStore.getUserInfo())
const init = function () {
  userInfoStore.updateUserInfo()
}
init()
const btoa = (str: string) => {
  return window.btoa(str)
}
function change_uuid() {
  changeUuid().then((res: any) => {
    if (res.error) {
      ElMessage.error(res.error)
    } else {
      ElMessage.success('更换成功')
      init()
    }
  })
}
function change_sub_key() {
  changeSubKey().then((res: any) => {
    if (res.error) {
      ElMessage.error(res.error)
    } else {
      ElMessage.success('更换成功')
      init()
    }
  })
}
function change_wireguard_pri_key() {
  changeWireguardPriKey().then((res: any) => {
    if (res.error) {
      ElMessage.error(res.error)
    } else {
      ElMessage.success('更换成功')
      init()
    }
  })
}
</script>

<template>
  <MainView>
    <div class="user-main" v-if="user_info">
      <div>
        <h2>操作</h2>
        <div class="box">
          <p>
            <el-tooltip
              content="订阅地址会被更换，重置后，所有使用订阅地址的地方都要进行替换"
              placement="right"
            >
              <el-button type="primary" @click="change_sub_key()" round>更换订阅地址</el-button>
            </el-tooltip>
          </p>
          <p>
            <el-tooltip
              content="订阅地址不会更换，重置后，所有使用订阅地址的客户端都需要更新订阅才能使用"
              placement="right"
            >
              <el-button type="primary" @click="change_uuid()" round>重置代理密码</el-button>
            </el-tooltip>
          </p>
          <p>
            <el-tooltip
              content="Wireguard专属密钥，重置后，需要更改配置文件的私钥，或者重新复制配置文件"
              placement="right"
            >
              <el-button type="primary" @click="change_wireguard_pri_key()" round
                >重置Wireguard密码</el-button
              >
            </el-tooltip>
          </p>
          <!-- <p v-for="(item, index ) in user_info.result?.sub_address" :key="item.index" @click="touchCopy(item)"
                    class="hand">
                    <el-tooltip content="所有客户端均可用，使用UA进行判断" placement="top">
                        {{ index == 0 ? "通用" : "备用" }}订阅：
                    </el-tooltip>
                    <el-tooltip content="点击复制" placement="top">
                        <span class="no-wrap">
                            {{ item }}
                        </span>
                    </el-tooltip>
                </p> -->
        </div>
      </div>
      <div>
        <h2>一键导入</h2>
        <div class="box">
          <p>
            <a
              :href="
                encodeURI(
                  'shadowrocket://add/sub://' +
                    btoa(user_info.sub_address[0] + '&type=shadowrocket') +
                    '?remark=布吉岛',
                )
              "
              target="_blank"
            >
              <el-button type="primary" round> 导入Shadowrocket </el-button>
            </a>
          </p>
          <p>
            <a
              :href="
                encodeURI(
                  'sing-box://import-remote-profile?url=' +
                    encodeURI(user_info.sub_address[0] + '&type=singbox') +
                    '#布吉岛',
                )
              "
              target="_blank"
            >
              <el-button type="primary" round> 导入sing-box </el-button>
            </a>
          </p>
          <p>
            <a
              :href="
                encodeURI(
                  'sing-box://import-remote-profile?url=' +
                    encodeURI(user_info.sub_address[0] + '&type=hidiffy') +
                    '#布吉岛',
                )
              "
              target="_blank"
            >
              <el-button type="primary" round> 导入hidiffy </el-button>
            </a>
          </p>
          <p>
            <a
              :href="
                encodeURI(
                  'clash://install-config?url=' +
                    encodeURI(user_info.sub_address[0] as string) +
                    '&name=布吉岛',
                )
              "
              target="_blank"
            >
              <el-button type="primary" round> 一键导入Clash </el-button>
            </a>
          </p>
        </div>
      </div>
      <div>
        <h2>订阅(推荐)</h2>
        <div class="box">
          <p @click="touchCopy(user_info.sub_address[0] as string)" class="hand">
            <el-button type="primary" round> 通用订阅 </el-button>
          </p>
          <p @click="touchCopy(user_info.sub_address[1] as string)" class="hand">
            <el-button type="primary" round> 备用订阅 </el-button>
          </p>
        </div>
      </div>
    </div>
  </MainView>
</template>

<style lang="scss" scoped>
.user-main {
  position: relative;
  top: 60px;
  display: flex;
  flex-direction: column;
  padding: 0 32px;
  gap: 16px;
  padding-bottom: 64px;
}

.box {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 5px;
  overflow: hidden;
  // width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-wrap {
  white-space: nowrap;
}
</style>

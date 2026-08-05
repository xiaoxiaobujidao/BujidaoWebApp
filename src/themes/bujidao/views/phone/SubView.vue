<script setup lang="ts">
import { ref, computed } from 'vue'
import { changeUuid, changeSubKey, changeWireguardPriKey } from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import { base64Encode } from '@/utils/utils'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfoStore'
import MainView from './MainView.vue'

const userInfoStore = useUserInfoStore()
const user_info = computed(() => userInfoStore.getUserInfo())
const btoa = base64Encode
const init = function () {
  userInfoStore.updateUserInfo()
}
init()
function change_uuid() {
  ElMessageBox.confirm(
    '订阅地址不会更换，重置后所有使用订阅地址的客户端都需要更新订阅才能使用。确定继续吗？',
    '确认重置代理密码',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      return changeUuid()
    })
    .then((res: any) => {
      if (res.error) {
        ElMessage.error(res.error)
      } else {
        ElMessage.success('更换成功')
        init()
      }
    })
    .catch(() => {})
}
function change_sub_key() {
  ElMessageBox.confirm(
    '订阅地址会被更换，重置后所有使用订阅地址的地方都要进行替换。确定继续吗？',
    '确认更换订阅地址',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      return changeSubKey()
    })
    .then((res: any) => {
      if (res.error) {
        ElMessage.error(res.error)
      } else {
        ElMessage.success('更换成功')
        init()
      }
    })
    .catch(() => {})
}
function change_wireguard_pri_key() {
  ElMessageBox.confirm(
    'Wireguard 专属密钥将被重置，需在客户端更新配置文件的私钥，或重新复制配置文件。确定继续吗？',
    '确认重置 Wireguard 密钥',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    },
  )
    .then(() => {
      return changeWireguardPriKey()
    })
    .then((res: any) => {
      if (res.error) {
        ElMessage.error(res.error)
      } else {
        ElMessage.success('更换成功')
        init()
      }
    })
    .catch(() => {})
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
                  'v2rayn://install-config?url=' +
                    encodeURIComponent(user_info.sub_address[0] + '&type=v2rayN') +
                    '&name=' +
                    encodeURIComponent('布吉岛'),
                )
              "
              target="_blank"
            >
              <el-button type="primary" round> 导入v2rayN </el-button>
            </a>
          </p>
          <p>
            <a
              :href="
                encodeURI(
                  'v2rayng://install-sub/?url=' +
                    encodeURIComponent(user_info.sub_address[0] + '&type=v2rayN') +
                    '#布吉岛',
                )
              "
              target="_blank"
            >
              <el-button type="primary" round> 导入v2rayNG </el-button>
            </a>
          </p>
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
          <!-- 订阅链接纯文本 -->
          <p>订阅链接：</p>
          <p class="no-wrap">
            {{ user_info.sub_address[0] }}
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
  overflow-x: auto;
  // width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.no-wrap {
  white-space: nowrap;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { changeUuid, changeSubKey, changeWireguardPriKey } from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfoStore'
import UserMainView from './UserMainView.vue'

const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const user_info = computed(() => userInfoStore.getUserInfo())

const btoa = (str: string) => {
  return window.btoa(str)
}
function change_uuid() {
  changeUuid().then((res: any) => {
    if (res.error) {
      ElMessage.error(res.error)
    } else {
      ElMessage.success('更换成功')
      userInfoStore.updateUserInfo()
    }
  })
}
function change_sub_key() {
  changeSubKey().then((res: any) => {
    if (res.error) {
      ElMessage.error(res.error)
    } else {
      ElMessage.success('更换成功')
      userInfoStore.updateUserInfo()
    }
  })
}
function change_wireguard_pri_key() {
  changeWireguardPriKey().then((res: any) => {
    if (res.error) {
      ElMessage.error(res.error)
    } else {
      ElMessage.success('更换成功')
      userInfoStore.updateUserInfo()
    }
  })
}
</script>

<template>
  <UserMainView>
    <div class="box">
      <div class="user-main" v-if="user_info">
        <div class="left">
          <h3>推荐使用订阅链接</h3>
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
          <p @click="touchCopy(user_info.sub_address[0] + '&type=v2rayN')" class="hand">
            V2rayN(G)订阅：
            <el-tooltip content="点击复制" placement="top">
              <span class="no-wrap">
                {{ user_info.sub_address[0] + '&type=v2rayN' }}
              </span>
            </el-tooltip>
          </p>
          <p @click="touchCopy(user_info.sub_address[0] + '&type=shadowrocket')" class="hand">
            ShadowRocket订阅：
            <el-tooltip content="点击复制" placement="top">
              <span class="no-wrap">
                {{ user_info.sub_address[0] + '&type=shadowrocket' }}
              </span>
            </el-tooltip>
          </p>
          <p @click="touchCopy(user_info.sub_address[0] + '&type=clash_verge')" class="hand">
            Clash订阅：
            <el-tooltip content="点击复制" placement="top">
              <span class="no-wrap">
                {{ user_info.sub_address[0] + '&type=clash_verge' }}
              </span>
            </el-tooltip>
            <!-- <el-button size="small" type="info">客户端下载</el-button> -->
          </p>
        </div>
        <div class="right">
          <h3>一键导入</h3>
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
              <el-button type="primary" round> 一键导入Shadowrocket </el-button>
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
              <el-button type="primary" round> 一键导入sing-box </el-button>
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
              <el-button type="primary" round> 一键导入hidiffy </el-button>
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
  flex-direction: row;
  flex-wrap: wrap;
  /* height: calc(100vh - 130px); */
  overflow-x: auto;
  /* overscroll-behavior: contain; */
  /* justify-content: space-between; */
  padding: 32px;

  .left {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .right {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.footer {
  /* margin-top: 6vh; */
  height: 6vh;
  width: 100vw;
}

.no-wrap {
  white-space: nowrap;
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { touchCopy } from '@/utils/copy'
const go_to_app_store = () => {
  window.open('https://apps.apple.com/us/app/shadowrocket/id932747118')
}
const go_to_rules = () => {
  window.open('https://github.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever')
}
import { useUserInfoStore } from '@/stores/userInfoStore'
const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const sub_address = computed(() => userInfoStore.getUserInfo()?.sub_address[0])
const subCopy = () => {
  touchCopy(sub_address.value as string)
}
</script>

<template>
  <ol>
    <li>
      <p>
        从<span @click="go_to_app_store">AppStore</span
        >安装软件（没有非国区账号的，岛岛付费后私聊岛岛
      </p>
      <img src="@test/assets/img/tutorial/ios/shadowrocket/app.webp" />
    </li>
    <li>
      <p><span @click="subCopy()">点我复制订阅</span></p>
    </li>
    <li>
      <p>添加订阅</p>
      <div class="flex-row-wrap">
        <div>
          <p>3.1、点击右上角加号</p>
          <img src="@test/assets/img/tutorial/ios/shadowrocket/add-sub-1.webp" />
        </div>
        <div>
          <p>3.2、点击选择类型</p>
          <img src="@test/assets/img/tutorial/ios/shadowrocket/add-sub-2.webp" />
        </div>
        <div>
          <p>3.3、选择类型为Subscribe（订阅类型）</p>
          <img src="@test/assets/img/tutorial/ios/shadowrocket/add-sub-3.webp" />
        </div>
        <div>
          <p>3.4、粘贴上面复制下来的订阅链接</p>
          <img src="@test/assets/img/tutorial/ios/shadowrocket/add-sub-4.webp" />
        </div>
      </div>
    </li>
    <li>
      <p>选择节点，并点击连接</p>
      <img src="@test/assets/img/tutorial/ios/shadowrocket/connect.webp" />
      <div class="flex-row-wrap">
        <div></div>
      </div>
    </li>
    <li>
      <p>选择合适的规则（强烈建议）（可选）</p>
      <div class="flex-row-wrap">
        <div>
          <p>
            5.1、打开<span @click="go_to_rules"> Github链接 </span>
            ，复制你想添加的规则，如：
            <span
              @click="
                touchCopy(
                  'https://johnshall.github.io/Shadowrocket-ADBlock-Rules-Forever/sr_top500_whitelist_ad.conf',
                )
              "
            >
              白名单加广告
            </span>
          </p>
          <img src="@test/assets/img/tutorial/ios/shadowrocket/rules-git.webp" />
        </div>
        <div>
          <p>5.2、打开软件<b>配置页面</b>，点击右上角加号，粘贴进URL</p>
          <img src="@test/assets/img/tutorial/ios/shadowrocket/add-rule.webp" />
        </div>
        <div>
          <p>5.3、选择并使用配置</p>
          <img src="@test/assets/img/tutorial/ios/shadowrocket/use-rule.webp" />
        </div>
        <div>
          <p>5.4、返回首页，进入路由配置</p>
          <img src="@test/assets/img/tutorial/ios/shadowrocket/choose-profile-1.webp" />
        </div>
        <div>
          <p>5.5、全局路由改为配置</p>
          <img src="@test/assets/img/tutorial/ios/shadowrocket/choose-profile-2.webp" />
        </div>
        <div></div>
      </div>
    </li>
  </ol>
</template>
<style scoped>
span {
  color: var(--el-color-primary);
  cursor: pointer;
}

img {
  max-height: 48vh;
}

.flex-row-wrap {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.flex-row-wrap div {
  padding: 2vh;
}
</style>

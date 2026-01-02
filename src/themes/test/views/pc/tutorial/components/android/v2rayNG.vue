<script setup lang="ts">
import { computed } from 'vue'
import { touchCopy } from '@/utils/copy'
import { useUserInfoStore } from '@/stores/userInfoStore'
const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const sub_address = computed(() => userInfoStore.getUserInfo()?.sub_address[0])
const go_to_v2rayng_git = () => {
  window.open('https://github.com/2dust/v2rayNG/releases/latest')
}
const go_to_files = (path: string) => {
  window.open('https://files.bujidao.org/d' + path)
}

const subCopy = () => {
  touchCopy(sub_address.value as string)
}
</script>
<template>
  <ol>
    <li>
      <p>安装软件</p>
      <p>
        在<span @click="go_to_files('/v2rayNG/')">岛岛</span>或者<span @click="go_to_v2rayng_git"
          >Github</span
        >官网下载
      </p>
    </li>
    <li>
      <p><span @click="subCopy()">点我复制订阅</span></p>
    </li>
    <li>
      <p>软件内导入订阅</p>
      <div class="flex-row-wrap">
        <div>
          <p>3.1、打开软件，点击左上角菜单</p>
          <img src="@test/assets/img/tutorial/andriod/v2rayng/left-menu.webp" />
        </div>
        <div>
          <p>3.2、点击订阅分组设置</p>
          <img src="@test/assets/img/tutorial/andriod/v2rayng/sub.webp" />
        </div>
        <div>
          <p>3.3、点击右上角加号</p>
          <img src="@test/assets/img/tutorial/andriod/v2rayng/add_sub_button.webp" />
        </div>
        <div>
          <p>3.4、将复制来的订阅地址粘贴进url</p>
          <img src="@test/assets/img/tutorial/andriod/v2rayng/paste.webp" />
        </div>
        <div>
          <p>3.5、点击右上角✅保存</p>
          <img src="@test/assets/img/tutorial/andriod/v2rayng/save_sub.webp" />
        </div>
      </div>
    </li>
    <li>
      <p>更改为分应用代理（推荐、可选）</p>
      <div class="flex-row-wrap">
        <div>
          <p>4.1、点击左上角菜单，进入设置</p>
          <img src="@test/assets/img/tutorial/andriod/v2rayng/app_proxy.webp" />
        </div>
        <div>
          <p>4.2、进入分应用代理，选择你所需要代理的应用，如Telegram、YouTube、浏览器等</p>
          <img src="@test/assets/img/tutorial/andriod/v2rayng/youtube.webp" />
        </div>
      </div>
    </li>
    <li>
      <p>更新订阅</p>
      <div class="flex-row-wrap">
        <div>
          <p>5.1、在软件主页点击右上角三个点</p>
          <img src="@test/assets/img/tutorial/andriod/v2rayng/right-menu.webp" />
        </div>
        <div>
          <p>5.2、点击更新订阅</p>
          <img src="@test/assets/img/tutorial/andriod/v2rayng/update_sub.webp" />
        </div>
      </div>
    </li>
    <li>
      <p>在软件主页，点击右下角图标进行连接</p>
      <img src="@test/assets/img/tutorial/andriod/v2rayng/connect.webp" />
    </li>
  </ol>
  <p>由于精力有限，只提供每个平台最基本的软件的配置过程，更多软件及进阶配置需要大家自行摸索啦</p>
</template>
<style scoped>
span {
  color: var(--el-color-primary);
  cursor: pointer;
}

img {
  max-height: 50vh;
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

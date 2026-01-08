<script setup lang="ts">
import { computed } from 'vue'
import { touchCopy } from '@/utils/copy'
import { useUserInfoStore } from '@/stores/userInfoStore'
const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const sub_address = computed(() => userInfoStore.getUserInfo()?.sub_address[0])
const go_to_git = () => {
  window.open('https://github.com/2dust/v2rayN/releases/latest')
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
      <div class="flex-row-wrap">
        <div>
          <p>
            1.1、在<span @click="go_to_files('/v2rayN')">岛岛</span>或者<span @click="go_to_git"
              >Github</span
            >官网下载后解压
          </p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/v2rayN/v2rayn.webp" />
        </div>
        <div>
          <p>1.2、解压或者安装后，打开软件，桌面状态栏会看到小图标，双击它，就能看到软件界面了</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/v2rayN/icon.webp" />
        </div>
      </div>
    </li>
    <li>
      <p><span @click="subCopy()">点我复制订阅</span></p>
    </li>
    <li>
      <p>添加订阅</p>
      <div class="flex-row-wrap">
        <div>
          <p>3.1、点击如图所示的加号</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/v2rayN/add-sub.webp" />
        </div>
        <div>
          <p>3.2、按图输入订阅地址及备注，点击确定</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/v2rayN/add-sub-2.webp" />
        </div>
        <div>
          <p>3.3、更新订阅</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/v2rayN/add-sub-3.webp" />
        </div>
      </div>
    </li>
    <li>
      <p>选择服务器及模式</p>
      <div class="flex-row-wrap">
        <div>
          <p>4.1、右键打开菜单选择，或者点击节点后按下回车键</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/v2rayN/choose.webp" />
        </div>
        <div>
          <p>4.2、这里可以选择路由模式</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/v2rayN/route.webp" />
        </div>
        <div>
          <p>4.3、Tun模式和系统代理（Tun模式需要右键管理员运行</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/v2rayN/tun.webp" />
        </div>
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

<script setup lang="ts">
import { computed } from 'vue'
import { touchCopy } from '@/utils/copy'
import { useUserInfoStore } from '@/stores/userInfoStore'
const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const sub_address = computed(() => userInfoStore.getUserInfo()?.sub_address[0])
const go_to_git = () => {
  window.open('https://github.com/clash-verge-rev/clash-verge-rev/releases/latest')
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
        在<span @click="go_to_files('/clash-verge-rev')">岛岛</span>或者<span @click="go_to_git"
          >Github</span
        >官网下载
      </p>
    </li>
    <li>
      <p><span @click="subCopy()">点我复制订阅</span></p>
    </li>
    <li>
      <p>添加订阅</p>
      <div class="flex-row-wrap">
        <div>
          <p>3.1、打开软件后，点击订阅</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/ClashVerge/add-sub-1.webp" />
        </div>
        <div>
          <p>3.2、将上面复制下来的URL，粘贴进，并点击导入</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/ClashVerge/add-sub-2.webp" />
        </div>
        <div>
          <p>3.3、切换为岛岛的配置文件</p>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/ClashVerge/select-bujidao.webp" />
        </div>
      </div>
    </li>
    <li>
      <p>切换规则、全局</p>
      <div class="flex-row-wrap">
        <div>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/ClashVerge/rule.webp" />
        </div>
      </div>
    </li>
    <li>
      <p>开启代理或Tun（<b>记得查看感叹号的内容</b></p>
      <div class="flex-row-wrap">
        <div>
          <img src="@kohara-fuwari/assets/img/tutorial/windows/ClashVerge/proxy-tun.webp" />
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
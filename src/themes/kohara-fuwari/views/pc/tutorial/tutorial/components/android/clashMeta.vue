<script setup lang="ts">
import { computed } from 'vue'
import { touchCopy } from '@/utils/copy'
import { useUserInfoStore } from '@/stores/userInfoStore'
const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const sub_address = computed(() => userInfoStore.getUserInfo()?.sub_address[0])
const go_to_git = () => {
  window.open('https://github.com/MetaCubeX/ClashMetaForAndroid/releases')
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
        在<span @click="go_to_files('/ClashMetaForAndroid/')">岛岛</span>或者<span
          @click="go_to_git"
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
          <p>3.1、打开软件，点击配置文件</p>
          <img src="@test/assets/img/tutorial/andriod/clash/Profile.webp" />
        </div>
        <div>
          <p>3.2、点击右上角加号添加</p>
          <img src="@test/assets/img/tutorial/andriod/clash/AddSub.webp" />
        </div>
        <div>
          <p>3.3、选择从URL导入</p>
          <img src="@test/assets/img/tutorial/andriod/clash/UseUrl.webp" />
        </div>
        <div>
          <p>3.4、填写相关内容并点击右上角保存</p>
          <img src="@test/assets/img/tutorial/andriod/clash/SaveProfile.webp" />
        </div>
        <div>
          <p>3.5、选择刚添加好的配置</p>
          <img src="@test/assets/img/tutorial/andriod/clash/ChooseProfile.webp" />
        </div>
      </div>
    </li>
    <li>
      <p>连接</p>
      <div class="flex-row-wrap">
        <div>
          <p>4.1、点击进行连接</p>
          <img src="@test/assets/img/tutorial/andriod/clash/Start.webp" />
        </div>
        <div>
          <p>4.2、查看分流规则</p>
          <img src="@test/assets/img/tutorial/andriod/clash/RuleMode.webp" />
        </div>
        <div>
          <p>4.3、选择节点</p>
          <img src="@test/assets/img/tutorial/andriod/clash/ProxyChoose.webp" />
        </div>
      </div>
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

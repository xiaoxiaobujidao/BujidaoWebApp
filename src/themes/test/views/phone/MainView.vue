<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import TelegramImage from '@test/components/icons/TelegramImage.vue'
import UserFilled from '@test/components/icons/UserFilled.vue'
import SubscribeItem from '@test/components/icons/SubscribeItem.vue'
import ListItem from '@test/components/icons/ListItem.vue'
import DarkTheme from '@test/components/DarkTheme.vue'
import { ElMessage } from 'element-plus'
const menu = [
  {
    name: '我的',
    icon: UserFilled,
    path: '/user',
  },
  {
    name: '订阅中心',
    icon: SubscribeItem,
    path: '/sub',
  },
  {
    name: '公告',
    icon: ListItem,
    path: '/announcement',
  },
]
const activePath = computed(() => router.currentRoute.value.path)
const go_telegram = () => {
  ElMessage.info('正在前往群组')
  location.href = 'https://t.me/bujidaoChat'
}
const logout = () => {
  router.push({ path: '/signout' })
}
const go_to = (path: string) => {
  router.push({ path: path })
}
const bujidao = () => {
  location.href = 'https://bujidao.org'
}
</script>
<template>
  <div class="header">
    <div class="telegram" @click="go_telegram()">
      <TelegramImage />
    </div>
    <div>
      <h1 @click="bujidao()">布吉岛</h1>
    </div>
    <div class="logout" @click="logout()">
      <span> 登出 </span>
    </div>
  </div>
  <slot></slot>
  <div class="menu" :style="{ 'grid-template-columns': 'repeat(' + menu.length + ',1fr)' }">
    <div v-for="item in menu" :key="item.name" @click="go_to(item.path)">
      <div class="icon" :class="activePath.includes(item.path) ? 'active' : ''">
        <component :is="item.icon" />
      </div>
      <div class="name">
        {{ item.name }}
      </div>
    </div>
  </div>
  <DarkTheme class="none" />
</template>
<style lang="scss" scoped>
.dark {
  .header {
    background-image: linear-gradient(1deg, #1c1b22f0, #1c1b22fe);
    box-shadow: none;
  }

  .menu {
    background-image: linear-gradient(179deg, #1c1b22f0, #1c1b22fe);
    box-shadow: none;
  }
}

.header {
  position: fixed;
  top: 0px;
  width: 100vw;
  height: 54px;
  padding: 4px 14px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  color: var(--el-text-color-placeholder);

  h1 {
    font-size: 20px;
  }

  background-color: rgba(250, 250, 250, 0.9);
  z-index: 1;
  box-shadow: 0px 1px 10px -6px var(--el-text-color-primary);

  align-items: center;
  justify-items: center;

  .telegram {
    svg {
      height: 28px !important;
      width: 28px !important;
      fill: var(--el-text-color-placeholder);
    }
  }

  .logout {
    color: var(--el-text-color-placeholder);
    padding: 2px 10px;
    border: 1px var(--el-text-color-placeholder);
    border-style: solid;
    border-radius: 8%;
    display: inline;
    right: 0;
  }
}

.active svg {
  // background-color: #88888888;
  border: 1px solid #88888888;
  border-radius: 18%;
  height: 22px !important;
  width: 22px !important;
}

.menu {
  position: fixed;
  bottom: 0px;
  width: 100vw;
  padding: 5px;
  display: grid;
  background-color: rgba(256, 256, 256, 0.93);
  z-index: 1;
  grid-template-rows: 1fr;
  color: var(--el-text-color-regular);
  box-shadow: 0px 0px 10px -7px var(--el-text-color-regular);

  > div {
    display: flex;
    flex-direction: column;
    align-content: center;
    text-align: center;
    line-height: 15px;
    font-size: 11px;
  }

  .icon {
    display: block;

    svg {
      height: 20px;
      width: 20px;
    }
  }
}

.none {
  display: none;
}
</style>

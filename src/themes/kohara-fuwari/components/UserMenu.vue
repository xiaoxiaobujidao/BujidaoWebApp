<script setup lang="ts">
import { computed } from 'vue'

const menu = [
  { path: '/user', name: '概览' },
  { path: '/sub', name: '订阅' },
  { path: '/balance', name: '财务' },
  { path: '/announcement', name: '公告' },
  { path: '/node_list', name: '节点' },
  { path: '/tutorial', name: '教程' },
  { path: '/cc', name: '个性化' },
  { path: '/signout', name: '登出' },
]
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()
// 菜单&路径
const activePath = computed(() => {
  return route.path
})
const handleSelect = (key: string, keyPath: string[]) => {}
</script>
<template>
  <div class="menu box">
    <div></div>
    <div class="top-menu">
      <el-menu
        :default-active="activePath"
        class="el-menu-demo"
        mode="vertical"
        @select="handleSelect"
        menu-trigger="click"
      >
        <el-menu-item
          v-for="item in menu"
          :key="item.path"
          :index="item.path"
          @click="router.push({ path: item.path })"
        >
          <span>
            {{ item.name }}
          </span>
        </el-menu-item>
      </el-menu>
    </div>
    <div></div>
  </div>
</template>

<style scoped lang="scss">
.menu {
  width: 150px;
  position: relative;
}

.top-menu :deep(> .el-menu) {
  height: 100vh;
  background-color: transparent;

  span {
    font-size: 16px;
  }
}
</style>

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
  width: var(--sidebar-width);
  position: relative;
  border-right: 1px solid var(--color-surface-border);
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

:global(.dark) .menu {
  background: rgba(15, 25, 35, 0.45);
}

.top-menu :deep(> .el-menu) {
  height: calc(100vh - var(--header-height));
  background-color: transparent;
  border-right: none;
  padding: 12px 8px;

  .el-menu-item {
    margin-bottom: 4px;
    border-radius: var(--radius-md);
    height: 44px;
    line-height: 44px;
    transition:
      background-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      background: rgba(84, 169, 235, 0.1);
    }

    &.is-active {
      background: rgba(84, 169, 235, 0.16);
      color: var(--color-ocean-deep);
      font-weight: 600;
    }
  }

  span {
    font-size: 15px;
  }
}

:global(.dark) .top-menu :deep(> .el-menu .el-menu-item.is-active) {
  color: var(--color-ocean-light);
}
</style>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 暗黑模式切换
const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('app-theme', isDark.value ? 'dark' : 'light')
}

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.classList.toggle('dark', isDark.value)
})

// 侧边栏导航项
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

// 当前激活路径
const activePath = computed(() => {
  return route.path
})
</script>

<template>
  <div class="card-base mx-auto flex h-[4.5rem] max-w-[80%] items-center justify-between !overflow-visible rounded-lg px-6 onload-animation z-50">
    <a href="/" class="btn-plain scale-animation h-12 rounded-full px-6 font-bold">
      <h1 class="text-base flex flex-row items-center text-[var(--primary)]" style="font-family: '幼圆', 'YouYuan', sans-serif; margin: 0;">
        <span class="icon-[tabler--smart-home] mr-2 text-[1.5rem]"></span> 布吉岛
      </h1>
    </a>
    <div class="flex space-x-4 overflow-x-auto flex-1 justify-center py-2 no-scrollbar">
      <!-- 侧边栏导航项 -->
      <div v-for="item in menu" :key="item.path" class="relative">
        <a 
          :href="item.path"
          class="btn-plain scale-animation h-12 rounded-full px-6 py-2 font-bold text-base"
          :class="activePath === item.path ? 'active' : ''"
        >
          <div class="flex items-center">
            {{ item.name }}
          </div>
        </a>
      </div>
    </div>
    <div class="flex space-x-4">

      
      <button 
        aria-label="Light/Dark Mode" 
        class="btn-plain scale-animation relative h-10 w-10 rounded-full bg-opacity-20" 
        id="scheme-switch"
        @click="toggleDark"
      >
        <img v-if="isDark" :src="'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 width=%2724%27 height=%2724%27%3E%3Cpath fill=%27%23fff%27 d=%27M12 17V7Q9.925 7 8.463 8.463T7 12t1.463 3.538T12 17m0 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8%27/%3E%3C/svg%3E'" alt="Light Mode" class="h-6 w-6" />
        <img v-else :src="'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 width=%2724%27 height=%2724%27%3E%3Cpath fill=%27%23000%27 d=%27M12 17V7Q9.925 7 8.463 8.463T7 12t1.463 3.538T12 17m0 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8%27/%3E%3C/svg%3E'" alt="Dark Mode" class="h-6 w-6" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>

<style>
/* 淡入动画 */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.onload-animation {
  opacity: 0;
  animation: .3s fade-in-up;
  animation-fill-mode: forwards;
}

/* 外层导航卡片 */
.card-base{
  background: var(--card-bg);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--card-border);
  border-radius: 0 0 30px 30px;
  box-shadow: 0 10px 40px rgba(0,0,0,.12);
  position: sticky;
  top: 0;
  max-width: 80%; /* 设置导航宽度为屏幕的80% */
  padding: 0 5em 0 2em;
}

/* 移除a标签默认下划线 */
.btn-plain{
  text-decoration: none;
}

/* 确保所有导航链接都没有下划线 */
.card-base a{
  text-decoration: none;
}

/* 中间导航项容器（可横向滚动） */
.no-scrollbar{
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar{
  display: none;
}

/* 普通按钮 */
.btn-plain{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all .25s cubic-bezier(.2, .6, .2, 1);
  color: #333;
  padding: 3.14px 1em 3.14px 1em;
  margin: 0.618em;
}

/* 点击缩放动画 */
.scale-animation{
  transition: transform .18s;
}
.scale-animation:active{
  transform: scale(.95);
}

/* Hover 效果 */
.btn-plain:hover{
  background: rgba(255, 255, 255, 0.68);
  border: 1px solid #cccccc83 !important;
  margin: 0.314em;
  transition: margin .5s .2s;
}

/* 激活项 */
.btn-plain.active,
.btn-plain[aria-current="page"]{
  background: rgba(76, 141, 246, 0.15);
  color: var(--primary);
  box-shadow: 0 6px 20px rgba(0,0,0,.08) inset;
}

/* 图标 */
.icon{
  font-size: 1.25rem;
  margin-right: .4rem;
  opacity: .9;
}
</style>

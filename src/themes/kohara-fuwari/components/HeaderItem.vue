<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 暗黑模式状态管理
const isDark = ref(false)

/**
 * 切换暗黑模式
 * 1. 反转isDark状态
 * 2. 更新HTML根元素的dark类名
 * 3. 将主题偏好保存到localStorage持久化存储
 */
const toggleDark = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('app-theme', isDark.value ? 'dark' : 'light')
}

/**
 * 组件挂载时初始化主题
 * 1. 优先从localStorage读取保存的主题偏好
 * 2. 若没有保存的主题，则根据系统偏好设置主题
 * 3. 更新HTML根元素的dark类名以应用主题
 */
onMounted(() => {
  const savedTheme = localStorage.getItem('app-theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
  } else {
    isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  document.documentElement.classList.toggle('dark', isDark.value)
})

/**
 * 导航菜单配置
 * 包含应用的主要导航项列表
 */
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

/**
 * 当前激活的路由路径
 * 通过Vue Router的route.path计算属性获取当前页面的路由路径
 */
const activePath = computed(() => {
  return route.path
})
</script>

<template>
  <!-- 顶部导航栏主容器 -->
  <!-- card-base: 卡片基础样式, onload-animation: 加载动画, z-50: 层级最高 -->
  <div
    class="card-base mx-auto flex h-[4.5rem] max-w-[80%] items-center justify-between !overflow-visible rounded-lg px-6 onload-animation z-50"
  >
    <!-- 网站Logo链接 -->
    <a href="/" class="btn-plain scale-animation h-12 rounded-full px-6 font-bold">
      <h1
        class="text-base flex flex-row items-center text-[var(--primary)]"
        style="font-family: '幼圆', 'YouYuan', sans-serif; margin: 0"
      >
        <span class="icon-[tabler--smart-home] mr-2 text-[1.5rem]"></span> 布吉岛
      </h1>
    </a>

    <!-- 导航菜单容器 -->
    <!-- flex: 弹性布局, overflow-x-auto: 横向滚动, no-scrollbar: 隐藏滚动条 -->
    <div class="flex space-x-4 overflow-x-auto flex-1 justify-center py-2 no-scrollbar">
      <!-- 导航菜单项循环渲染 -->
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

    <!-- 右侧功能按钮容器 -->
    <div class="flex space-x-4">
      <!-- 暗黑模式切换按钮 -->
      <button
        aria-label="Light/Dark Mode"
        class="btn-plain scale-animation relative h-10 w-10 rounded-full bg-opacity-20"
        id="scheme-switch"
        @click="toggleDark"
      >
        <!-- 暗黑模式下显示的太阳图标 -->
        <img
          v-if="isDark"
          :src="'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 width=%2724%27 height=%2724%27%3E%3Cpath fill=%27%23fff%27 d=%27M12 17V7Q9.925 7 8.463 8.463T7 12t1.463 3.538T12 17m0 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8%27/%3E%3C/svg%3E'"
          alt="Light Mode"
          class="h-6 w-6"
        />
        <!-- 浅色模式下显示的月亮图标 -->
        <img
          v-else
          :src="'data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 width=%2724%27 height=%2724%27%3E%3Cpath fill=%27%23000%27 d=%27M12 17V7Q9.925 7 8.463 8.463T7 12t1.463 3.538T12 17m0 5q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8%27/%3E%3C/svg%3E'"
          alt="Dark Mode"
          class="h-6 w-6"
        />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>

<style>
/* --------------------------
   动画效果样式
   -------------------------- */

/**
 * 淡入上移动画
 * 用于页面加载时的元素入场效果
 */
@keyframes fade-in-up {
  from {
    opacity: 0; /* 初始透明度为0，完全透明 */
    transform: translateY(20px); /* 初始位置向下偏移20px */
  }
  to {
    opacity: 1; /* 结束透明度为1，完全不透明 */
    transform: translateY(0); /* 结束位置回到原位置 */
  }
}

/**
 * 加载动画类
 * 应用fade-in-up动画，持续0.3秒
 */
.onload-animation {
  opacity: 0;
  animation: 0.3s fade-in-up;
  animation-fill-mode: forwards; /* 保持动画结束时的状态 */
}

/* --------------------------
   导航栏容器样式
   -------------------------- */

/**
 * 导航卡片基础样式
 * 实现毛玻璃效果的导航栏容器
 */
.card-base {
  background: var(--card-bg); /* 使用CSS变量定义背景色 */
  backdrop-filter: blur(14px); /* 毛玻璃效果，模糊度14px */
  -webkit-backdrop-filter: blur(14px); /* Safari浏览器兼容 */
  border: 1px solid var(--card-border); /* 使用CSS变量定义边框色 */
  border-radius: 0 0 30px 30px; /* 底部圆角30px */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12); /* 阴影效果 */
  position: sticky; /* 粘性定位，顶部固定 */
  top: 0; /* 固定在顶部 */
  max-width: 80%; /* 设置导航宽度为屏幕的80% */
  padding: 0 5em 0 2em; /* 内边距：上0，右5em，下0，左2em */
}

/* --------------------------
   滚动条样式
   -------------------------- */

/**
 * 隐藏滚动条
 * Firefox浏览器
 */
.no-scrollbar {
  scrollbar-width: none;
}

/**
 * 隐藏滚动条
 * WebKit内核浏览器 (Chrome, Safari等)
 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* --------------------------
   按钮基础样式
   -------------------------- */

/**
 * 基础按钮样式
 */
.btn-plain {
  display: inline-flex; /* 内联弹性布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  background: transparent; /* 透明背景 */
  border-radius: 12px; /* 圆角12px */
  cursor: pointer; /* 鼠标指针为手型 */
  transition: all 0.25s cubic-bezier(0.2, 0.6, 0.2, 1); /* 过渡效果，自定义缓动函数 */
  color: #333; /* 文字颜色 */
  padding: 3.14px 1em 3.14px 1em; /* 内边距 */
  margin: 0.618em; /* 外边距，黄金比例 */
  text-decoration: none; /* 移除下划线 */
}

/* --------------------------
   交互效果样式
   -------------------------- */

/**
 * 点击缩放动画
 */
.scale-animation {
  transition: transform 0.18s; /* 变换过渡效果 */
}

/**
 * 点击时的缩放效果
 */
.scale-animation:active {
  transform: scale(0.95); /* 缩小到95% */
}

/**
 * 鼠标悬停效果
 */
.btn-plain:hover {
  background: rgba(255, 255, 255, 0.68); /* 半透明白色背景 */
  border: 1px solid #cccccc83 !important; /* 半透明边框，!important确保优先级 */
  margin: 0.314em; /* 外边距变化 */
  transition: margin 0.5s 0.2s; /* 外边距过渡，延迟0.2秒 */
}

/**
 * 激活状态样式
 */
.btn-plain.active,
.btn-plain[aria-current='page'] {
  background: rgba(76, 141, 246, 0.15); /* 主色调半透明背景 */
  color: var(--primary); /* 使用CSS变量定义主色调文字 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08) inset; /* 内阴影效果 */
}

/* --------------------------
   图标样式
   -------------------------- */

/**
 * 图标基础样式
 */
.icon {
  font-size: 1.25rem; /* 图标大小 */
  margin-right: 0.4rem; /* 右侧外边距 */
  opacity: 0.9; /* 透明度90% */
}
</style>

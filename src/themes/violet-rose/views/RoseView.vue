<script setup lang="ts">
import { computed } from 'vue'
import { useUserInfoStore } from '@/stores/userInfoStore'
import AppLayout from '@violet-rose/components/layout/AppLayout.vue'

const userInfoStore = useUserInfoStore()
const isLoggedIn = computed(() => !!userInfoStore.getToken())

const features = [
  { icon: '🌐', title: '全球节点', desc: '多地区高速线路，稳定可靠，随取随用' },
  { icon: '⚡', title: '一键订阅', desc: '主流客户端即拿即用，无需繁琐配置' },
  { icon: '🛡️', title: '账户管理', desc: '余额、积分与邀请返利，一站式掌控' },
]
</script>

<template>
  <AppLayout theme="rose">
    <section class="hero">
      <h1 class="hero__title">欢迎来到布吉岛</h1>
      <p class="hero__subtitle">紫玫瑰花瓣轻舞，在这座小岛上，连通从此从容</p>
      <div class="hero__actions">
        <router-link v-if="isLoggedIn" to="/user" class="hero__btn hero__btn--primary">进入控制台</router-link>
        <template v-else>
          <router-link to="/login" class="hero__btn hero__btn--primary">登录</router-link>
          <router-link to="/register" class="hero__btn hero__btn--ghost">注册</router-link>
        </template>
        <a href="#intro" class="hero__btn hero__btn--ghost">了解更多</a>
      </div>
    </section>

    <section id="intro" class="section">
      <div class="section__card">
        <p>
          布吉岛是一个注重体验的网络服务平台。我们以紫玫瑰之夜为视觉灵感，
          为你提供节点订阅、账户管理与资产服务，让每一次连接都像花瓣一样轻盈顺畅。
        </p>
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">特色</h2>
      <div class="features">
        <article v-for="item in features" :key="item.title" class="features__item">
          <span class="features__icon" aria-hidden="true">{{ item.icon }}</span>
          <h3 class="features__name">{{ item.title }}</h3>
          <p class="features__desc">{{ item.desc }}</p>
        </article>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 2rem 0 3rem;
}

.hero__title {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.hero__subtitle {
  font-size: clamp(0.95rem, 2.5vw, 1.15rem);
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.hero__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  transition:
    transform 0.2s,
    box-shadow 0.2s,
    background 0.2s;
}

.hero__btn:hover {
  text-decoration: none;
  transform: translateY(-2px);
}

.hero__btn--primary {
  background: linear-gradient(135deg, var(--color-accent-deep), var(--color-accent-light));
  color: #fff;
  box-shadow: var(--shadow-soft);
}

.hero__btn--ghost {
  background: var(--color-surface);
  color: var(--color-accent-deep);
  border: 1px solid var(--color-surface-border);
  backdrop-filter: blur(8px);
}

.section {
  margin-bottom: 2.5rem;
}

.section__title {
  font-size: 1.35rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

.section__card {
  padding: 1.25rem 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--shadow-soft);
  line-height: 1.8;
  color: var(--color-text-secondary);
}

.features {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 600px) {
  .features {
    grid-template-columns: repeat(3, 1fr);
  }
}

.features__item {
  padding: 1.25rem;
  text-align: center;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: transform 0.2s;
}

.features__item:hover {
  transform: translateY(-4px);
}

.features__icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.features__name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
  color: var(--color-text-primary);
}

.features__desc {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
</style>

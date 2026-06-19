<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useUserInfoStore } from '@/stores/userInfoStore'
import { useAnnouncementStore } from '@/stores/announcementStore'
import AppLayout from '@blush-cherry-blossoms/components/layout/AppLayout.vue'

const userInfoStore = useUserInfoStore()
const announcementStore = useAnnouncementStore()

const isLoggedIn = computed(() => !!userInfoStore.getToken())
const userInfo = computed(() => userInfoStore.getUserInfo())

const pinnedAnnouncements = computed(() =>
  (announcementStore.getAnnouncement() ?? [])
    .filter((item) => item.pin && item.show)
    .sort((a, b) => b.edit_time - a.edit_time),
)

const quickLinks = [
  { to: '/user', icon: '👤', title: '账户', desc: '管理个人信息与余额' },
  { to: '/sub', icon: '🔗', title: '订阅', desc: '获取客户端订阅链接' },
  { to: '/node_list', icon: '🌐', title: '节点', desc: '查看可用节点列表' },
  { to: '/balance', icon: '💰', title: '资产', desc: '充值、积分与邀请' },
  { to: '/announcement', icon: '📢', title: '公告', desc: '查看最新通知' },
  { to: '/cc', icon: '⚙️', title: '配置', desc: '自定义客户端配置' },
]

onMounted(() => {
  announcementStore.updateAnnouncement()
  if (isLoggedIn.value) {
    userInfoStore.updateUserInfo()
  }
})
</script>

<template>
  <AppLayout>
    <section class="hero">
      <h1 class="hero__title">欢迎来到布吉岛</h1>
      <p class="hero__subtitle">樱花纷飞，在这座小岛上，连通从此从容</p>
      <div class="hero__actions">
        <template v-if="isLoggedIn">
          <router-link to="/user" class="hero__btn hero__btn--primary">进入控制台</router-link>
          <span v-if="userInfo" class="hero__balance">
            余额 ¥{{ (userInfo.balance / 100).toFixed(2) }}
          </span>
        </template>
        <template v-else>
          <router-link to="/login" class="hero__btn hero__btn--primary">登录</router-link>
          <router-link to="/register" class="hero__btn hero__btn--ghost">注册</router-link>
        </template>
      </div>
    </section>

    <section v-if="pinnedAnnouncements.length" class="section">
      <h2 class="section__title">📢 公告</h2>
      <div
        v-for="item in pinnedAnnouncements"
        :key="item.id"
        class="section__card section__card--pin"
      >
        <div class="announce-body" v-html="item.announcement" />
      </div>
      <router-link v-if="isLoggedIn" to="/announcement" class="section__more">查看全部公告 →</router-link>
    </section>

    <section v-if="isLoggedIn" class="section">
      <h2 class="section__title">快捷入口</h2>
      <div class="quick-grid">
        <router-link
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="quick-card"
        >
          <span class="quick-card__icon" aria-hidden="true">{{ link.icon }}</span>
          <h3 class="quick-card__title">{{ link.title }}</h3>
          <p class="quick-card__desc">{{ link.desc }}</p>
        </router-link>
      </div>
    </section>

    <section v-else id="about" class="section">
      <h2 class="section__title">关于</h2>
      <div class="section__card">
        <p>
          布吉岛是一个注重体验的网络服务平台。我们以春日樱花为视觉灵感，
          登录后可管理账户、订阅、节点与资产，在飘落的花瓣间享受流畅的使用体验。
        </p>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
.hero {
  text-align: center;
  padding: 2rem 0 2.5rem;
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
  align-items: center;
}

.hero__balance {
  font-size: 0.9rem;
  color: var(--color-sakura-deep);
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: 999px;
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
  transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
}

.hero__btn:hover {
  text-decoration: none;
  transform: translateY(-2px);
}

.hero__btn--primary {
  background: linear-gradient(135deg, var(--color-sakura-deep), var(--color-sakura-pink));
  color: #fff;
  box-shadow: var(--shadow-soft);
}

.hero__btn--ghost {
  background: var(--color-surface);
  color: var(--color-sakura-deep);
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

.section__card--pin {
  border-color: var(--color-sakura-deep);
  margin-bottom: 0.75rem;
}

.section__more {
  display: inline-block;
  margin-top: 0.5rem;
  font-size: 0.88rem;
  text-decoration: none;
}

.announce-body :deep(*) {
  line-height: 1.75;
  color: var(--color-text-primary);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 600px) {
  .quick-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.15rem 0.75rem;
  text-decoration: none;
  color: inherit;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-lg);
  backdrop-filter: blur(10px);
  transition: transform 0.2s, border-color 0.2s;
}

.quick-card:hover {
  transform: translateY(-3px);
  border-color: var(--color-sakura-deep);
  text-decoration: none;
}

.quick-card__icon {
  font-size: 1.75rem;
  margin-bottom: 0.4rem;
}

.quick-card__title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.quick-card__desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}
</style>

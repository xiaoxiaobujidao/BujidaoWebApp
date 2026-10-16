<script setup lang="ts">
import { onMounted } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useSubscription } from '@/composables/useSubscription'
import AppShell from '@kohara-fuwari/components/layout/AppShell.vue'
import FwCard from '@kohara-fuwari/components/ui/FwCard.vue'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'
import FwCopyField from '@kohara-fuwari/components/ui/FwCopyField.vue'
import FwEmpty from '@kohara-fuwari/components/ui/FwEmpty.vue'

const {
  userInfo,
  subLinks,
  importLinks,
  backupSub,
  resetSubKey,
  resetUuid,
  resetWireguardKey,
  refresh,
} = useSubscription()

const resets = [
  {
    title: '更换订阅地址',
    desc: '订阅地址会改变，所有填写过旧地址的地方都需要替换',
    icon: 'link' as const,
    action: resetSubKey,
  },
  {
    title: '重置代理密码',
    desc: '订阅地址不变，但所有客户端需要更新一次订阅',
    icon: 'key' as const,
    action: resetUuid,
  },
  {
    title: '重置 WireGuard 密钥',
    desc: '需要在客户端更新配置文件的私钥，或重新复制配置',
    icon: 'shield' as const,
    action: resetWireguardKey,
  },
]

onMounted(() => {
  refresh()
})
</script>

<template>
  <AppShell>
    <template v-if="userInfo">
      <FwCard title="一键导入" subtitle="在已安装的客户端中直接添加订阅" icon="zap">
        <div class="imports">
          <a
            v-for="client in importLinks"
            :key="client.id"
            :href="client.href"
            class="import-card"
            target="_blank"
            rel="noopener"
          >
            <span class="import-card__icon">
              <img v-if="client.icon" :src="client.icon" :alt="client.name" />
              <LucideIcon v-else name="globe" />
            </span>
            <span class="import-card__name">{{ client.name }}</span>
            <span class="import-card__cta">导入 <LucideIcon name="arrow-right" /></span>
          </a>
        </div>
        <template #footer>
          点击后由系统唤起对应客户端；若没有反应，请先安装客户端，或改用下方链接手动添加。
        </template>
      </FwCard>

      <FwCard title="订阅链接" subtitle="按客户端选择对应格式，点击复制" icon="rss">
        <div class="links">
          <FwCopyField
            v-for="link in subLinks"
            :key="link.id"
            :label="link.label"
            :hint="link.hint"
            :value="link.value"
          />
          <FwCopyField
            v-if="backupSub"
            label="备用地址"
            hint="主地址无法访问时使用"
            :value="backupSub"
          />
        </div>
      </FwCard>

      <FwCard
        title="密钥管理"
        subtitle="泄露或异常时可随时重置，操作前请看清说明"
        icon="shield-check"
      >
        <ul class="resets">
          <li v-for="item in resets" :key="item.title" class="reset">
            <span class="reset__icon"><LucideIcon :name="item.icon" /></span>
            <div class="reset__text">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </div>
            <FwButton variant="ghost" size="sm" icon="refresh" @click="item.action">重置</FwButton>
          </li>
        </ul>
      </FwCard>
    </template>

    <FwCard v-else>
      <FwEmpty loading />
    </FwCard>
  </AppShell>
</template>

<style scoped>
.imports {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9.5rem, 1fr));
  gap: 0.75rem;
}

.import-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.1rem 0.75rem 0.9rem;
  border-radius: var(--radius-md);
  background: var(--btn-plain-bg-hover);
  border: 1px solid transparent;
  text-align: center;
  transition:
    transform var(--duration-fast) var(--ease-standard),
    border-color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.import-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary);
  box-shadow: var(--shadow-card-hover);
}

.import-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: var(--radius-md);
  background: var(--card-bg);
  color: var(--primary);
  font-size: 1.5rem;
  overflow: hidden;
}

.import-card__icon img {
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
}

.import-card__name {
  font-weight: 700;
  font-size: 0.92rem;
}

.import-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.78rem;
  color: var(--primary);
  font-weight: 600;
}

.links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.resets {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.reset {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--line-divider);
}

.reset:first-child {
  padding-top: 0;
}

.reset:last-child {
  border-bottom: 0;
  padding-bottom: 0;
}

.reset__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: var(--radius-sm);
  background: var(--warning-soft);
  color: oklch(0.55 0.15 70);
  flex-shrink: 0;
  font-size: 1.1rem;
}

:root.dark .reset__icon {
  color: var(--warning);
}

.reset__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.4;
}

.reset__text strong {
  font-size: 0.95rem;
}

.reset__text span {
  font-size: 0.8rem;
  color: var(--text-3);
}

@media (max-width: 767px) {
  .links {
    grid-template-columns: minmax(0, 1fr);
  }

  .imports {
    grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  }
}
</style>

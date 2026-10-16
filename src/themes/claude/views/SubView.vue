<script setup lang="ts">
import { onMounted } from 'vue'
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useSubscription } from '@/composables/useSubscription'
import AppShell from '@claude/components/layout/AppShell.vue'
import ClCard from '@claude/components/ui/ClCard.vue'
import ClButton from '@claude/components/ui/ClButton.vue'
import ClCopyField from '@claude/components/ui/ClCopyField.vue'
import ClEmpty from '@claude/components/ui/ClEmpty.vue'

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
      <ClCard title="一键导入" subtitle="在已安装的客户端中直接添加订阅">
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
      </ClCard>

      <ClCard title="订阅链接" subtitle="按客户端选择对应格式，点击复制">
        <div class="links">
          <ClCopyField
            v-for="link in subLinks"
            :key="link.id"
            :label="link.label"
            :hint="link.hint"
            :value="link.value"
          />
          <ClCopyField
            v-if="backupSub"
            label="备用地址"
            hint="主地址无法访问时使用"
            :value="backupSub"
          />
        </div>
      </ClCard>

      <ClCard title="密钥管理" subtitle="泄露或异常时可随时重置，操作前请看清说明">
        <ul class="resets">
          <li v-for="item in resets" :key="item.title" class="reset">
            <span class="reset__icon"><LucideIcon :name="item.icon" /></span>
            <div class="reset__text">
              <strong>{{ item.title }}</strong>
              <span>{{ item.desc }}</span>
            </div>
            <ClButton variant="secondary" size="sm" icon="refresh" @click="item.action"
              >重置</ClButton
            >
          </li>
        </ul>
      </ClCard>
    </template>

    <ClCard v-else>
      <ClEmpty loading />
    </ClCard>
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
  border-radius: var(--cl-radius-md);
  background: var(--cl-surface-2);
  border: 1px solid var(--cl-border);
  text-align: center;
  transition:
    transform var(--cl-fast) var(--cl-ease),
    border-color var(--cl-fast) var(--cl-ease),
    box-shadow var(--cl-fast) var(--cl-ease);
}

.import-card:hover {
  transform: translateY(-2px);
  border-color: var(--cl-accent);
  box-shadow: var(--cl-shadow-md);
}

.import-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 1rem;
  background: var(--cl-surface);
  border: 1px solid var(--cl-border);
  color: var(--cl-accent);
  font-size: 1.5rem;
  overflow: hidden;
}

.import-card__icon img {
  width: 2.4rem;
  height: 2.4rem;
  object-fit: contain;
}

.import-card__name {
  font-weight: 600;
  font-size: 0.92rem;
}

.import-card__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.78rem;
  color: var(--cl-accent-ink);
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
}

.reset {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--cl-border);
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
  border-radius: 0.7rem;
  background: var(--cl-warning-soft);
  color: var(--cl-warning-ink);
  flex-shrink: 0;
  font-size: 1.1rem;
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
  color: var(--cl-text-3);
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

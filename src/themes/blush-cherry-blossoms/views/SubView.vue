<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import { changeUuid, changeSubKey, changeWireguardPriKey } from '@/utils/user'
import { base64Encode } from '@/utils/utils'
import { useUserInfoStore } from '@/stores/userInfoStore'
import DashboardLayout from '@blush-cherry-blossoms/components/layout/DashboardLayout.vue'
import SakuraCard from '@blush-cherry-blossoms/components/ui/SakuraCard.vue'
import SakuraBtn from '@blush-cherry-blossoms/components/ui/SakuraBtn.vue'
import CopyField from '@blush-cherry-blossoms/components/ui/CopyField.vue'
import { importClients } from '@/utils/importClients'

const userInfoStore = useUserInfoStore()
userInfoStore.updateUserInfo()
const userInfo = computed(() => userInfoStore.getUserInfo())
const primarySub = computed(() => userInfo.value?.sub_address[0] ?? '')
const btoa = base64Encode

const subTypes = [
  { label: 'V2rayN', suffix: '&type=v2rayN' },
  { label: 'ShadowRocket', suffix: '&type=shadowrocket' },
  { label: 'Clash Verge', suffix: '&type=clash_verge' },
]

function confirmAction(message: string, action: () => Promise<unknown>) {
  if (!confirm(message)) return
  action().then((res: any) => {
    if (res?.error) {
      ElMessage.error(typeof res.error === 'string' ? res.error : res.error?.message ?? '操作失败')
    } else {
      ElMessage.success('操作成功')
      userInfoStore.updateUserInfo()
    }
  })
}

function resetUuid() {
  confirmAction('订阅地址不会更换，重置后所有客户端需更新订阅。确定继续？', changeUuid)
}

function resetSubKey() {
  confirmAction('订阅地址会被更换，所有使用处需替换。确定继续？', changeSubKey)
}

function resetWgKey() {
  confirmAction('Wireguard 密钥将被重置，需更新客户端配置。确定继续？', changeWireguardPriKey)
}
</script>

<template>
  <DashboardLayout>
    <div v-if="userInfo && primarySub" class="sub-page">
      <SakuraCard title="订阅链接" subtitle="按客户端类型复制对应链接" accent>
        <div class="sub-links">
          <CopyField
            v-for="item in subTypes"
            :key="item.suffix"
            :label="item.label"
            :value="primarySub + item.suffix"
          />
        </div>
      </SakuraCard>

      <SakuraCard title="密钥管理" subtitle="重置操作请谨慎">
        <div class="reset-actions">
          <SakuraBtn variant="ghost" @click="resetSubKey">更换订阅地址</SakuraBtn>
          <SakuraBtn variant="ghost" @click="resetUuid">重置代理密码</SakuraBtn>
          <SakuraBtn variant="ghost" @click="resetWgKey">重置 Wireguard 密钥</SakuraBtn>
        </div>
      </SakuraCard>

      <SakuraCard title="一键导入" subtitle="在支持的客户端中快速添加">
        <div class="import-grid">
          <a
            v-for="client in importClients"
            :key="client.id"
            class="import-card"
            :href="client.buildHref(primarySub, btoa)"
            target="_blank"
          >
            <img class="import-card__icon" :src="client.icon" :alt="client.name" />
            <span>{{ client.name }}</span>
          </a>
        </div>
      </SakuraCard>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.sub-page {
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.sub-links {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.reset-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.import-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 0.75rem;
}

.import-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.15rem 0.65rem;
  text-decoration: none;
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.35);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  transition: transform 0.2s, border-color 0.2s;
}

.import-card:hover {
  transform: translateY(-2px);
  border-color: var(--color-sakura-deep);
  text-decoration: none;
}

.import-card__icon {
  width: 48px;
  height: 48px;
  object-fit: contain;
}
</style>

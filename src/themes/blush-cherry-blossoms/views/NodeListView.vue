<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getNodeList } from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { buildNodeConnect, type NodeItem } from '@blush-cherry-blossoms/composables/useNodeConnect'
import DashboardLayout from '@blush-cherry-blossoms/components/layout/DashboardLayout.vue'
import SakuraCard from '@blush-cherry-blossoms/components/ui/SakuraCard.vue'
import SakuraBtn from '@blush-cherry-blossoms/components/ui/SakuraBtn.vue'
import SakuraModal from '@blush-cherry-blossoms/components/ui/SakuraModal.vue'

const nodes = ref<NodeItem[]>([])
const search = ref('')
const sortKey = ref<'name' | 'node_type' | 'price' | 'level'>('level')
const sortAsc = ref(false)

const modalVisible = ref(false)
const activeNode = ref<NodeItem | null>(null)
const connectText = ref('')
const connectQr = ref('')

getNodeList().then((res) => {
  nodes.value = res.result ?? []
})

const filteredNodes = computed(() => {
  let list = [...nodes.value]
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (n) =>
        n.name.toLowerCase().includes(q) ||
        n.node_type.toLowerCase().includes(q),
    )
  }
  list.sort((a, b) => {
    const av = a[sortKey.value] ?? ''
    const bv = b[sortKey.value] ?? ''
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortAsc.value ? cmp : -cmp
  })
  return list
})

function toggleSort(key: typeof sortKey.value) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function viewNode(node: NodeItem) {
  const result = buildNodeConnect(node)
  if (!result) {
    ElMessage.warning('暂不支持此节点类型')
    return
  }
  activeNode.value = node
  connectText.value = result.text
  connectQr.value = result.qr
  modalVisible.value = true
}

const typeLabels: Record<string, string> = {
  wireguard: 'WireGuard',
  vless: 'VLESS',
  vmess: 'VMess',
  trojan: 'Trojan',
  hy2: 'Hysteria2',
}

const sortLabels: Record<typeof sortKey.value, string> = {
  name: '名称',
  node_type: '类型',
  price: '价格',
  level: '最低余额',
}

function formatMinBalance(level: number) {
  return (level / 100).toFixed(2)
}
</script>

<template>
  <DashboardLayout>
    <SakuraCard title="节点列表" subtitle="账户余额须达到节点的最低可用余额方可使用" accent>
      <p class="hint">
        每个节点设有最低可用余额门槛。若您的账户余额低于该金额，将无法连接并使用该节点。
      </p>

      <div class="toolbar">
        <input v-model="search" class="search" type="search" placeholder="搜索节点名称或类型…" />
      </div>

      <div class="sort-bar">
        <span class="sort-bar__label">排序：</span>
        <button
          v-for="key in (['name', 'node_type', 'price', 'level'] as const)"
          :key="key"
          type="button"
          class="sort-btn"
          :class="{ 'sort-btn--active': sortKey === key }"
          @click="toggleSort(key)"
        >
          {{ sortLabels[key] }}
          {{ sortKey === key ? (sortAsc ? '↑' : '↓') : '' }}
        </button>
      </div>

      <div class="node-list">
        <article
          v-for="node in filteredNodes"
          :key="node.node_id"
          class="node-item"
        >
          <div class="node-item__head">
            <h3 class="node-item__name">{{ node.name }}</h3>
            <span class="node-item__type">{{ typeLabels[node.node_type] ?? node.node_type }}</span>
          </div>
          <div class="node-item__meta">
            <span v-if="node.price != null" class="node-item__price">
              {{ (node.price / 100).toFixed(2) }} 元/G
            </span>
            <span v-if="node.level != null" class="node-item__balance">
              最低 ¥ {{ formatMinBalance(node.level) }}
            </span>
          </div>
          <SakuraBtn size="sm" variant="ghost" @click="viewNode(node)">查看连接</SakuraBtn>
        </article>
        <p v-if="!filteredNodes.length" class="empty">暂无节点</p>
      </div>
    </SakuraCard>

    <SakuraModal v-model="modalVisible" :title="activeNode?.name ?? '节点连接'" wide>
      <div class="connect">
        <div class="connect__qr">
          <vue-qr :text="connectQr" :size="180" />
        </div>
        <pre class="connect__text">{{ connectText }}</pre>
      </div>
      <template #footer>
        <SakuraBtn @click="touchCopy(connectText)">复制连接</SakuraBtn>
      </template>
    </SakuraModal>
  </DashboardLayout>
</template>

<style scoped>
.hint {
  margin: 0 0 1rem;
  padding: 0.75rem 0.95rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
  background: rgba(255, 183, 197, 0.12);
  border: 1px solid rgba(255, 183, 197, 0.35);
  border-radius: var(--radius-md);
}

.toolbar {
  margin-bottom: 1rem;
}

.search {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--color-surface-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.45);
  outline: none;
  font-size: 0.9rem;
}

.search:focus {
  border-color: var(--color-sakura-deep);
}

.node-list {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.node-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.65rem;
  padding: 0.9rem 1rem;
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
}

.node-item__head {
  flex: 1;
  min-width: 140px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.node-item__name {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.node-item__type {
  font-size: 0.7rem;
  padding: 0.1rem 0.45rem;
  color: var(--color-sakura-deep);
  background: rgba(255, 183, 197, 0.25);
  border-radius: 999px;
}

.node-item__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.node-item__price {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-sakura-deep);
}

.node-item__balance {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.empty {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-secondary);
}

.sort-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1rem;
  padding-bottom: 0.85rem;
  border-bottom: 1px solid var(--color-surface-border);
}

.sort-bar__label {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.sort-btn {
  padding: 0.3rem 0.65rem;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid var(--color-surface-border);
  border-radius: 999px;
}

.sort-btn--active {
  color: var(--color-sakura-deep);
  border-color: var(--color-sakura-deep);
}

.connect {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.connect__qr {
  padding: 0.75rem;
  background: #fff;
  border-radius: var(--radius-md);
}

.connect__text {
  width: 100%;
  padding: 0.85rem;
  max-height: 30vh;
  overflow: auto;
  font-size: 0.78rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
}
</style>

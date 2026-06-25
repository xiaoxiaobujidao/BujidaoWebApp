<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getNodeList } from '@/utils/user'
import { touchCopy } from '@/utils/copy'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { buildNodeConnect, type NodeItem } from '@violet-rose/composables/useNodeConnect'
import DashboardLayout from '@violet-rose/components/layout/DashboardLayout.vue'
import PanelCard from '@violet-rose/components/ui/PanelCard.vue'
import VrButton from '@violet-rose/components/ui/VrButton.vue'
import VrModal from '@violet-rose/components/ui/VrModal.vue'

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
      (n) => n.name.toLowerCase().includes(q) || n.node_type.toLowerCase().includes(q),
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

function formatMinBalance(level: number) {
  return (level / 100).toFixed(2)
}
</script>

<template>
  <DashboardLayout>
    <PanelCard title="节点列表" subtitle="账户余额须达到节点的最低可用余额方可使用">
      <p class="hint">
        每个节点设有最低可用余额门槛。若您的账户余额低于该金额，将无法连接并使用该节点。
      </p>

      <div class="toolbar">
        <input v-model="search" class="search" type="search" placeholder="搜索节点名称或类型…" />
      </div>

      <div class="table-wrap">
        <table class="node-table">
          <thead>
            <tr>
              <th @click="toggleSort('name')">
                名称 {{ sortKey === 'name' ? (sortAsc ? '↑' : '↓') : '' }}
              </th>
              <th @click="toggleSort('node_type')">
                类型 {{ sortKey === 'node_type' ? (sortAsc ? '↑' : '↓') : '' }}
              </th>
              <th @click="toggleSort('price')">
                价格 {{ sortKey === 'price' ? (sortAsc ? '↑' : '↓') : '' }}
              </th>
              <th @click="toggleSort('level')">
                最低余额 {{ sortKey === 'level' ? (sortAsc ? '↑' : '↓') : '' }}
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="node in filteredNodes" :key="node.node_id">
              <td class="node-table__name">{{ node.name }}</td>
              <td>
                <span class="type-badge">{{ typeLabels[node.node_type] ?? node.node_type }}</span>
              </td>
              <td class="node-table__price">
                {{ node.price != null ? `${(node.price / 100).toFixed(2)} 元/G` : '—' }}
              </td>
              <td>
                {{ node.level != null ? `¥ ${formatMinBalance(node.level)}` : '—' }}
              </td>
              <td class="node-table__action">
                <VrButton size="sm" @click="viewNode(node)">查看</VrButton>
              </td>
            </tr>
            <tr v-if="!filteredNodes.length">
              <td colspan="5" class="node-table__empty">暂无节点</td>
            </tr>
          </tbody>
        </table>
      </div>
    </PanelCard>

    <VrModal v-model="modalVisible" :title="activeNode?.name ?? '节点信息'" wide>
      <div class="connect">
        <pre class="connect__text">{{ connectText }}</pre>
        <div class="connect__actions">
          <VrButton size="sm" @click="touchCopy(connectText)">复制链接</VrButton>
        </div>
        <div class="connect__qr">
          <a :href="connectQr" target="_blank" rel="noopener">
            <vue-qr
              :key="connectQr"
              :text="connectQr"
              :size="240"
              :margin="12"
              :correct-level="1"
              :auto-color="true"
            />
          </a>
          <p class="connect__qr-hint">点击二维码可打开链接</p>
        </div>
      </div>
    </VrModal>
  </DashboardLayout>
</template>

<style scoped>
.hint {
  margin: 0 0 1rem;
  padding: 0.75rem 0.95rem;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
  background: rgba(171, 71, 188, 0.08);
  border: 1px solid rgba(171, 71, 188, 0.2);
  border-radius: var(--radius-md);
}

.toolbar {
  margin-bottom: 1rem;
}

.search {
  width: 100%;
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.45);
  outline: none;
}

.search:focus {
  border-color: var(--color-accent);
}

.table-wrap {
  overflow-x: auto;
}

.node-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.node-table th,
.node-table td {
  padding: 0.75rem 0.65rem;
  text-align: left;
  border-bottom: 1px solid var(--color-surface-border);
}

.node-table th {
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
}

.node-table__name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.node-table__price {
  font-weight: 500;
  color: var(--color-accent-deep);
}

.node-table__action {
  text-align: right;
}

.node-table__empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem !important;
}

.type-badge {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  font-size: 0.78rem;
  color: var(--color-accent-deep);
  background: rgba(171, 71, 188, 0.12);
  border-radius: 999px;
}

.connect__text {
  padding: 0.85rem;
  font-size: 0.78rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  max-height: 200px;
  overflow: auto;
}

.connect__actions {
  margin: 0.75rem 0;
}

.connect__qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.connect__qr-hint {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}
</style>

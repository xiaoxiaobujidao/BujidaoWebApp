<script setup lang="ts">
import LucideIcon from '@/components/icons/LucideIcon.vue'
import { useNodeList, type NodeSortKey } from '@/composables/useNodeList'
import { nodeTypeLabel } from '@/utils/nodeConnect'
import { fenToYuan } from '@/utils/format'
import AppShell from '@kohara-fuwari/components/layout/AppShell.vue'
import FwCard from '@kohara-fuwari/components/ui/FwCard.vue'
import FwButton from '@kohara-fuwari/components/ui/FwButton.vue'
import FwBadge from '@kohara-fuwari/components/ui/FwBadge.vue'
import FwEmpty from '@kohara-fuwari/components/ui/FwEmpty.vue'
import NodeConnectDialog from '@kohara-fuwari/components/NodeConnectDialog.vue'

const {
  filtered,
  nodes,
  loading,
  search,
  sortKey,
  sortDesc,
  activeNode,
  connect,
  dialogVisible,
  isUnlocked,
  toggleSort,
  showConnect,
  reload,
} = useNodeList()

const columns: { key: NodeSortKey; label: string; align?: 'right' }[] = [
  { key: 'name', label: '节点' },
  { key: 'node_type', label: '类型' },
  { key: 'price', label: '价格', align: 'right' },
  { key: 'level', label: '最低余额', align: 'right' },
]
</script>

<template>
  <AppShell>
    <template #actions>
      <FwButton variant="plain" icon="refresh" :loading="loading" @click="reload">刷新</FwButton>
    </template>

    <FwCard flush title="节点列表" subtitle="点击表头可排序" icon="server">
      <template #actions>
        <label class="search">
          <LucideIcon name="search" />
          <input
            v-model="search"
            class="search__input"
            type="search"
            placeholder="搜索节点名称 / 类型"
          />
        </label>
      </template>

      <div class="hint">
        <LucideIcon name="info" />
        <span>
          每个节点设有最低可用余额门槛：余额低于该金额时无法连接该节点。共
          <b>{{ nodes.length }}</b> 个节点。
        </span>
      </div>

      <FwEmpty v-if="loading && !nodes.length" loading />
      <FwEmpty
        v-else-if="!filtered.length"
        icon="server"
        title="没有匹配的节点"
        :description="search ? '换个关键词试试' : '暂时没有可用节点'"
      />

      <template v-else>
        <!-- 桌面：表格 -->
        <div class="table-wrap">
          <table class="table">
            <thead>
              <tr>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  :class="[{ 'is-right': col.align === 'right', 'is-sorted': sortKey === col.key }]"
                >
                  <button type="button" class="table__sort" @click="toggleSort(col.key)">
                    {{ col.label }}
                    <LucideIcon
                      :name="
                        sortKey === col.key
                          ? sortDesc
                            ? 'arrow-down'
                            : 'arrow-up'
                          : 'chevrons-up-down'
                      "
                    />
                  </button>
                </th>
                <th class="is-right">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="node in filtered"
                :key="node.node_id"
                :class="{ 'is-locked': !isUnlocked(node) }"
              >
                <td>
                  <div class="node-name">
                    <span class="node-dot" :class="{ 'is-on': isUnlocked(node) }" />
                    <span class="node-name__text">{{ node.name }}</span>
                  </div>
                </td>
                <td>
                  <FwBadge>{{ nodeTypeLabel(node.node_type) }}</FwBadge>
                </td>
                <td class="is-right mono">{{ fenToYuan(node.price) }} 元/G</td>
                <td class="is-right">
                  <span class="mono">¥{{ fenToYuan(node.level) }}</span>
                  <FwBadge v-if="!isUnlocked(node)" tone="warning" class="lock-badge"
                    >余额不足</FwBadge
                  >
                </td>
                <td class="is-right">
                  <FwButton size="sm" icon="qr-code" @click="showConnect(node)">查看</FwButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 手机：卡片 -->
        <ul class="cards">
          <li
            v-for="node in filtered"
            :key="node.node_id"
            class="node-card"
            :class="{ 'is-locked': !isUnlocked(node) }"
          >
            <div class="node-card__head">
              <div class="node-name">
                <span class="node-dot" :class="{ 'is-on': isUnlocked(node) }" />
                <span class="node-name__text">{{ node.name }}</span>
              </div>
              <FwBadge>{{ nodeTypeLabel(node.node_type) }}</FwBadge>
            </div>
            <dl class="node-card__meta">
              <div>
                <dt>价格</dt>
                <dd class="mono">{{ fenToYuan(node.price) }} 元/G</dd>
              </div>
              <div>
                <dt>最低余额</dt>
                <dd class="mono">¥{{ fenToYuan(node.level) }}</dd>
              </div>
            </dl>
            <div class="node-card__foot">
              <FwBadge v-if="!isUnlocked(node)" tone="warning">余额不足，暂不可用</FwBadge>
              <FwBadge v-else tone="success" dot>可用</FwBadge>
              <FwButton size="sm" icon="qr-code" @click="showConnect(node)">查看连接</FwButton>
            </div>
          </li>
        </ul>
      </template>
    </FwCard>

    <NodeConnectDialog v-model="dialogVisible" :node="activeNode" :connect="connect" />
  </AppShell>
</template>

<style scoped>
.search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 14rem;
  padding: 0 0.85rem;
  height: 2.5rem;
  border-radius: 999px;
  background: var(--btn-plain-bg-hover);
  color: var(--text-3);
  transition: box-shadow var(--duration-fast) var(--ease-standard);
}

.search:focus-within {
  box-shadow: 0 0 0 2px var(--primary);
  color: var(--primary);
}

.search__input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text-1);
  font: inherit;
  font-size: 0.9rem;
}

.hint {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin: 0 1.5rem 0.75rem;
  padding: 0.65rem 0.85rem;
  border-radius: var(--radius-md);
  background: var(--primary-soft);
  color: var(--primary-strong);
  font-size: 0.85rem;
  line-height: 1.5;
}

.hint :deep(.lucide) {
  margin-top: 0.2rem;
  flex-shrink: 0;
}

.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.table th,
.table td {
  padding: 0.75rem 1rem;
  text-align: left;
  border-top: 1px solid var(--line-divider);
  vertical-align: middle;
  white-space: nowrap;
}

.table th {
  border-top: 0;
  font-size: 0.78rem;
  color: var(--text-3);
  font-weight: 600;
  background: var(--btn-card-bg-hover);
}

.table th:first-child,
.table td:first-child {
  padding-left: 1.5rem;
}

.table th:last-child,
.table td:last-child {
  padding-right: 1.5rem;
}

.table tbody tr {
  transition: background-color var(--duration-fast) var(--ease-standard);
}

.table tbody tr:hover {
  background: var(--btn-plain-bg-hover);
}

.table tbody tr:last-child td {
  border-bottom: 0;
}

.is-right {
  text-align: right !important;
}

.table__sort {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: inherit;
  font: inherit;
  font-weight: 600;
}

.table__sort:hover,
.is-sorted .table__sort {
  color: var(--primary);
}

.node-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.node-name__text {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 28rem;
}

.node-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: var(--text-3);
  flex-shrink: 0;
  opacity: 0.6;
}

.node-dot.is-on {
  background: var(--success);
  opacity: 1;
  box-shadow: 0 0 0 3px var(--success-soft);
}

.is-locked .node-name__text {
  color: var(--text-3);
}

.lock-badge {
  margin-left: 0.4rem;
}

/* 手机卡片 */
.cards {
  display: none;
  list-style: none;
  margin: 0;
  padding: 0 1rem 1rem;
  flex-direction: column;
  gap: 0.6rem;
}

.node-card {
  padding: 0.85rem 0.95rem;
  border-radius: var(--radius-md);
  background: var(--btn-plain-bg-hover);
  border: 1px solid var(--line-divider);
}

.node-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.node-card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin: 0.6rem 0;
}

.node-card__meta dt {
  font-size: 0.72rem;
  color: var(--text-3);
}

.node-card__meta dd {
  font-weight: 600;
}

.node-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

@media (max-width: 767px) {
  .table-wrap {
    display: none;
  }

  .cards {
    display: flex;
  }

  .hint {
    margin: 0 1rem 0.75rem;
  }

  .search {
    min-width: 0;
    width: 100%;
  }
}
</style>

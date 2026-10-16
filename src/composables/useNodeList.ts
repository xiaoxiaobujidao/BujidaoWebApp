import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getNodeList } from '@/utils/user'
import { buildNodeConnect, type NodeConnectInfo, type NodeItem } from '@/utils/nodeConnect'
import { useUserInfoStore } from '@/stores/userInfoStore'

export type NodeSortKey = 'name' | 'node_type' | 'price' | 'level'

/**
 * 节点页通用逻辑：拉取列表、搜索 / 排序、生成连接信息。
 */
export function useNodeList() {
  const userInfoStore = useUserInfoStore()
  const nodes = ref<NodeItem[]>([])
  const loading = ref(true)
  const search = ref('')
  const sortKey = ref<NodeSortKey>('level')
  const sortDesc = ref(true)

  const activeNode = ref<NodeItem | null>(null)
  const connect = ref<NodeConnectInfo | null>(null)
  const dialogVisible = ref(false)

  const balance = computed(() => userInfoStore.getUserInfo()?.balance ?? 0)

  const filtered = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    const list = keyword
      ? nodes.value.filter(
          (n) =>
            n.name.toLowerCase().includes(keyword) || n.node_type.toLowerCase().includes(keyword),
        )
      : nodes.value.slice()
    const key = sortKey.value
    const dir = sortDesc.value ? -1 : 1
    return list.sort((a, b) => {
      const av = a[key] ?? ''
      const bv = b[key] ?? ''
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * dir
      return String(av).localeCompare(String(bv), 'zh-Hans-CN') * dir
    })
  })

  /** 当前余额是否达到该节点的最低余额门槛 */
  function isUnlocked(node: NodeItem) {
    return balance.value >= (node.level ?? 0)
  }

  function toggleSort(key: NodeSortKey) {
    if (sortKey.value === key) {
      sortDesc.value = !sortDesc.value
    } else {
      sortKey.value = key
      sortDesc.value = key === 'level' || key === 'price'
    }
  }

  function showConnect(node: NodeItem) {
    const info = buildNodeConnect(node)
    if (!info) {
      ElMessage.warning('暂不支持该节点类型的分享链接')
      return
    }
    activeNode.value = node
    connect.value = info
    dialogVisible.value = true
  }

  async function load() {
    loading.value = true
    try {
      const res = await getNodeList()
      nodes.value = (res.result ?? []) as NodeItem[]
    } catch {
      ElMessage.error('节点列表加载失败，请稍后重试')
    } finally {
      loading.value = false
    }
  }

  onMounted(load)

  return {
    nodes,
    filtered,
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
    reload: load,
  }
}

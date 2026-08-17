<script setup lang="ts">
import { computed, ref } from 'vue'
import { getNodeList } from '@/utils/user'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { touchCopy } from '@/utils/copy'
import { utf8_to_b64 } from '@/utils/utils'
import UserMainView from './UserMainView.vue'
import BjButton from '@bujidao/components/ui/BjButton.vue'

type SortKey = 'name' | 'node_type' | 'price' | 'level'

const node_list = ref<any[]>([])
const sortKey = ref<SortKey>('level')
const sortAsc = ref(false)

getNodeList().then((res: any) => {
  node_list.value = res.result ?? []
})

const sortedNodes = computed(() => {
  const list = [...node_list.value]
  list.sort((a, b) => {
    const av = a[sortKey.value] ?? ''
    const bv = b[sortKey.value] ?? ''
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortAsc.value ? cmp : -cmp
  })
  return list
})

function toggleSort(key: SortKey) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

function sortMark(key: SortKey) {
  if (sortKey.value !== key) return ''
  return sortAsc.value ? ' ↑' : ' ↓'
}

const connect_info_visible = ref(false)
const node_name = ref('')
const node_text = ref('')
const node_qr_code = ref('')

function show_connect_info(node: any) {
  node_name.value = node.name
  if (node.node_type == 'wireguard') {
    node_text.value =
      '[Interface]\nPrivateKey = ' +
      node.private_key +
      '\nAddress = ' +
      node.address +
      '\nDNS = ' +
      node.dns +
      '\nMTU = ' +
      node.mtu +
      '\n\n[Peer]\nPublicKey = ' +
      node.public_key +
      '\nAllowedIPs = ' +
      node.allowed_ips +
      '\nEndpoint = ' +
      node.endpoint +
      '\n'
    node_qr_code.value = node_text.value
    connect_info_visible.value = true
  }
  let sni = node.host ? node.host : node.server_name
  if (node.node_type == 'vless') {
    let uid = node.uuid
    let server_name = node.server_name
    let port = node.outport as string
    let network = node.transport_protocol
    let flow = node.vless_flow
    if (node.enable_xtls) {
      if (node.enable_reality) {
        node_text.value =
          'vless://' +
          uid +
          '@' +
          server_name +
          ':' +
          port +
          '/?' +
          'type=' +
          network +
          '&encryption=none' +
          '&headerType=none' +
          '&security=' +
          'reality' +
          '&flow=' +
          flow +
          '&pbk=' +
          node.reality_pub_key +
          '&sni=' +
          node.server_names[0] +
          '&fp=randomized' +
          '&packetEncoding=xudp#' +
          encodeURI(node.name)
        node_qr_code.value = node_text.value
        connect_info_visible.value = true
      } else {
        node_text.value =
          'vless://' +
          uid +
          '@' +
          server_name +
          ':' +
          port +
          '/?' +
          'type=' +
          network +
          '&encryption=none' +
          '&headerType=none' +
          '&security=' +
          'tls' +
          '&flow=' +
          flow +
          '&sni=' +
          sni +
          '&fp=randomized' +
          '&packetEncoding=xudp#' +
          encodeURI(node.name)
        node_qr_code.value = node_text.value
        connect_info_visible.value = true
      }
    } else {
      node_text.value =
        'vless://' +
        uid +
        '@' +
        server_name +
        ':' +
        port +
        '/?' +
        'type=' +
        network +
        +'&encryption=none' +
        '&headerType=none' +
        '&security=' +
        'tls' +
        '&flow=' +
        flow +
        '&sni=' +
        sni +
        '&fp=randomized' +
        '&packetEncoding=xudp#' +
        encodeURI(node.name)
      node_qr_code.value = node_text.value
      connect_info_visible.value = true
    }
  }
  if (node.node_type == 'vmess') {
    let v = utf8_to_b64(
      JSON.stringify({
        v: '2',
        ps: node.name,
        add: node.server_name,
        port: node.outport as string,
        id: node.uuid,
        aid: '0',
        net: 'ws',
        type: 'none',
        host: node.host as string,
        path: node.path,
        tls: node.enable_tls ? 'tls' : '',
        sni: node.enable_tls ? node.host : '',
      }),
    )
    node_text.value = 'vmess://' + v
    node_qr_code.value = node_text.value
    connect_info_visible.value = true
  }
  if (node.node_type == 'trojan') {
    node_name.value = node.name
    let name = node.name
    let uid = node.uuid
    let server_name = node.server_name
    let port = node.outport
    let sni = node.host ? node.host : node.server_name
    let v =
      uid + '@' + server_name + ':' + port + '?sni=' + sni + '?insecure=0' + '#' + encodeURI(name)
    node_text.value = 'trojan://' + v
    node_qr_code.value = node_text.value
    connect_info_visible.value = true
  }
  if (node.node_type == 'hy2') {
    node_name.value = node.name
    let name = node.name
    let uid = node.uuid
    let server_name = node.server_name
    let port = node.outport
    let v = uid + '@' + server_name + ':' + port + '#' + encodeURI(name)
    node_text.value = 'hysteria2://' + v
    node_qr_code.value = node_text.value
    connect_info_visible.value = true
  }
}
</script>

<template>
  <UserMainView>
    <div class="node-list">
      <p class="hint">
        每个节点设有最低可用余额门槛。若您的账户余额低于该金额，将无法连接并使用该节点。
      </p>
      <div class="bj-table-wrap">
        <table class="bj-table">
          <thead>
            <tr>
              <th class="is-sortable" @click="toggleSort('name')">节点名称{{ sortMark('name') }}</th>
              <th class="is-sortable" @click="toggleSort('node_type')">
                节点类型{{ sortMark('node_type') }}
              </th>
              <th class="is-sortable" @click="toggleSort('price')">价格{{ sortMark('price') }}</th>
              <th class="is-sortable" @click="toggleSort('level')">最低余额{{ sortMark('level') }}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="node in sortedNodes" :key="node.node_id">
              <td class="bj-table__name">{{ node.name }}</td>
              <td>
                <span class="bj-table__badge">{{ node.node_type }}</span>
              </td>
              <td>{{ (node.price / 100).toFixed(2) }} 元/G</td>
              <td>¥ {{ (node.level / 100).toFixed(2) }}</td>
              <td class="bj-table__actions">
                <BjButton size="sm" @click="show_connect_info(node)">查看</BjButton>
              </td>
            </tr>
            <tr v-if="!sortedNodes.length">
              <td colspan="5" class="bj-table__empty">暂无节点</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="footer"></div>
    </div>

    <el-dialog v-model="connect_info_visible" :title="node_name" width="500" center>
      <el-tooltip content="点我复制" placement="top">
        <p @click="touchCopy(node_text)">
          点击文本即可复制，点击二维码即可打开链接
          <br />
          <span>
            {{ node_text }}
          </span>
        </p>
      </el-tooltip>
      <template #footer>
        <div class="dialog-footer">
          <el-tooltip content="点我导入" placement="top">
            <a :href="node_qr_code" target="_blank">
              <div class="qr">
                <vue-qr
                  :key="node_qr_code"
                  :text="node_qr_code"
                  :size="2400"
                  :margin="50"
                  :correctLevel="1"
                  :auto-color="true"
                  id="qrcode"
                ></vue-qr>
              </div>
            </a>
          </el-tooltip>
        </div>
      </template>
    </el-dialog>
  </UserMainView>
</template>

<style lang="scss" scoped>
.qr > img {
  width: 80%;
  height: 80%;
}

.node-list {
  min-height: calc(100vh - 120px);
}

.hint {
  margin: 0 0 1rem;
  padding: 0.75rem 0.95rem;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--color-text-secondary);
  background: rgba(61, 165, 232, 0.08);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-sm);
}

.footer {
  margin-top: 6vh;
}

.bj-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card), var(--shadow-glow);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.bj-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.bj-table th,
.bj-table td {
  padding: 0.8rem 0.85rem;
  text-align: left;
  border-bottom: 1px solid rgba(61, 165, 232, 0.1);
  vertical-align: middle;
}

.bj-table tbody tr:last-child td {
  border-bottom: none;
}

.bj-table tbody tr:nth-child(even) {
  background: rgba(61, 165, 232, 0.04);
}

:global(.dark) .bj-table tbody tr:nth-child(even) {
  background: rgba(255, 255, 255, 0.03);
}

.bj-table th {
  font-weight: 600;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  background: rgba(61, 165, 232, 0.06);
}

:global(.dark) .bj-table th {
  background: rgba(255, 255, 255, 0.04);
}

.bj-table th.is-sortable {
  cursor: pointer;
  user-select: none;
}

.bj-table th.is-sortable:hover {
  color: var(--color-ocean-deep);
}

.bj-table__name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.bj-table__actions {
  white-space: nowrap;
  text-align: right;
}

.bj-table__empty {
  text-align: center;
  color: var(--color-text-secondary);
  padding: 2rem 0.85rem !important;
}

.bj-table__badge {
  display: inline-block;
  padding: 0.15rem 0.55rem;
  font-size: 0.78rem;
  color: var(--color-ocean-deep);
  background: rgba(61, 165, 232, 0.12);
  border-radius: 999px;
  white-space: nowrap;
}

:global(.dark) .bj-table__badge {
  color: var(--color-ocean-light);
}
</style>

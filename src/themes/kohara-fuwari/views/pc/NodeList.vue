<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getNodeList } from '@/utils/user'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { touchCopy } from '@/utils/copy'
import { utf8_to_b64 } from '@/utils/utils'
import UserMainView from './UserMainView.vue'

let node_list = ref()
const init = () => {
  getNodeList().then((res: any) => {
    node_list.value = res.result
  })
}
init()

const connect_info_visible = ref(false)
const node_name = ref('')
const node_text = ref('')
const node_qr_code = ref('')
function show_connect_info(node_id: string) {
  let i = node_list.value.findIndex((e: any) => e.node_id == node_id)
  let node = node_list.value[i]
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
      <!-- <h2>用户可使用节点等级小于自身余额的节点</h2> -->
      <el-table
        :data="node_list"
        height="100%"
        stripe
        table-layout="auto"
        :default-sort="{ prop: 'level', order: 'descending' }"
      >
        <el-table-column prop="name" label="节点名称" sortable show-overflow-tooltip />
        <el-table-column prop="node_type" label="节点类型" sortable />
        <el-table-column prop="level" label="节点等级" sortable>
          <template #default="scope">
            {{ scope.row.level / 100 }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" size="small" @click="show_connect_info(scope.row.node_id)">
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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

.box {
  padding: 15px;
}

.node-list {
  height: calc(100vh - 120px);

  :deep(.el-table--fit) {
    border-radius: 15px;
  }
}

.footer {
  margin-top: 6vh;
}
</style>

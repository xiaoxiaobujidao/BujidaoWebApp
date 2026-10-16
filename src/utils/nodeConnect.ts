import { utf8_to_b64 } from './utils'

/** 节点列表接口返回的单个节点（字段随节点类型不同而可选） */
export interface NodeItem {
  node_id: string
  node_type: string
  name: string
  level?: number
  price?: number
  // wireguard
  private_key?: string
  address?: string
  dns?: string
  mtu?: number
  public_key?: string
  allowed_ips?: string
  endpoint?: string
  // vless / vmess / trojan / hy2
  server_name?: string
  outport?: string
  enable_tls?: boolean
  host?: string
  path?: string
  uuid?: string
  transport_protocol?: string
  vless_flow?: string
  enable_xtls?: boolean
  enable_reality?: boolean
  reality_pub_key?: string
  server_names?: string[]
}

export interface NodeConnectInfo {
  /** 可直接复制的连接文本（分享链接或 WireGuard 配置） */
  text: string
  /** 二维码内容，通常与 text 相同 */
  qr: string
  /** 是否为多行配置文件（WireGuard），用于决定展示样式 */
  multiline: boolean
}

function buildVless(node: NodeItem): string {
  const base =
    `vless://${node.uuid}@${node.server_name}:${node.outport}/?type=${node.transport_protocol}` +
    '&encryption=none&headerType=none'
  const tail = `&flow=${node.vless_flow}&fp=randomized&packetEncoding=xudp#${encodeURI(node.name)}`
  const sni = node.host ? node.host : node.server_name

  if (node.enable_xtls && node.enable_reality) {
    return (
      base +
      `&security=reality&pbk=${node.reality_pub_key}&sni=${node.server_names?.[0] ?? sni}` +
      tail
    )
  }
  return base + `&security=tls&sni=${sni}` + tail
}

/**
 * 根据节点信息生成客户端可识别的连接文本；不支持的类型返回 null。
 */
export function buildNodeConnect(node: NodeItem): NodeConnectInfo | null {
  switch (node.node_type) {
    case 'wireguard': {
      const text =
        `[Interface]\nPrivateKey = ${node.private_key}\nAddress = ${node.address}\n` +
        `DNS = ${node.dns}\nMTU = ${node.mtu}\n\n[Peer]\nPublicKey = ${node.public_key}\n` +
        `AllowedIPs = ${node.allowed_ips}\nEndpoint = ${node.endpoint}\n`
      return { text, qr: text, multiline: true }
    }
    case 'vless': {
      const text = buildVless(node)
      return { text, qr: text, multiline: false }
    }
    case 'vmess': {
      const payload = utf8_to_b64(
        JSON.stringify({
          v: '2',
          ps: node.name,
          add: node.server_name,
          port: node.outport,
          id: node.uuid,
          aid: '0',
          net: 'ws',
          type: 'none',
          host: node.host,
          path: node.path,
          tls: node.enable_tls ? 'tls' : '',
          sni: node.enable_tls ? node.host : '',
        }),
      )
      const text = 'vmess://' + payload
      return { text, qr: text, multiline: false }
    }
    case 'trojan': {
      const sni = node.host ? node.host : node.server_name
      const text =
        `trojan://${node.uuid}@${node.server_name}:${node.outport}?sni=${sni}&insecure=0#` +
        encodeURI(node.name)
      return { text, qr: text, multiline: false }
    }
    case 'hy2': {
      const text =
        `hysteria2://${node.uuid}@${node.server_name}:${node.outport}#` + encodeURI(node.name)
      return { text, qr: text, multiline: false }
    }
    default:
      return null
  }
}

/** 节点类型的展示名称 */
export function nodeTypeLabel(type: string): string {
  const map: Record<string, string> = {
    vless: 'VLESS',
    vmess: 'VMess',
    trojan: 'Trojan',
    hy2: 'Hysteria2',
    wireguard: 'WireGuard',
    ss: 'Shadowsocks',
  }
  return map[type] ?? type
}

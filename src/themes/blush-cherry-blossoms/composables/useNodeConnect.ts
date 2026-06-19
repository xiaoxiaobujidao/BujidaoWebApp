import { utf8_to_b64 } from '@/utils/utils'

export interface NodeItem {
  node_id: string
  node_type: string
  name: string
  private_key?: string
  address?: string
  dns?: string
  mtu?: number
  public_key?: string
  allowed_ips?: string
  endpoint?: string
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
  level?: number
}

export function buildNodeConnect(node: NodeItem): { text: string; qr: string } | null {
  if (node.node_type === 'wireguard') {
    const text =
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
    return { text, qr: text }
  }

  const sni = node.host ? node.host : node.server_name

  if (node.node_type === 'vless') {
    const uid = node.uuid
    const serverName = node.server_name
    const port = node.outport as string
    const network = node.transport_protocol
    const flow = node.vless_flow
    let text: string

    if (node.enable_xtls) {
      if (node.enable_reality) {
        text =
          'vless://' +
          uid +
          '@' +
          serverName +
          ':' +
          port +
          '/?type=' +
          network +
          '&encryption=none&headerType=none&security=reality&flow=' +
          flow +
          '&pbk=' +
          node.reality_pub_key +
          '&sni=' +
          node.server_names?.[0] +
          '&fp=randomized&packetEncoding=xudp#' +
          encodeURI(node.name)
      } else {
        text =
          'vless://' +
          uid +
          '@' +
          serverName +
          ':' +
          port +
          '/?type=' +
          network +
          '&encryption=none&headerType=none&security=tls&flow=' +
          flow +
          '&sni=' +
          sni +
          '&fp=randomized&packetEncoding=xudp#' +
          encodeURI(node.name)
      }
    } else {
      text =
        'vless://' +
        uid +
        '@' +
        serverName +
        ':' +
        port +
        '/?type=' +
        network +
        '&encryption=none&headerType=none&security=tls&flow=' +
        flow +
        '&sni=' +
        sni +
        '&fp=randomized&packetEncoding=xudp#' +
        encodeURI(node.name)
    }
    return { text, qr: text }
  }

  if (node.node_type === 'vmess') {
    const v = utf8_to_b64(
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
    const text = 'vmess://' + v
    return { text, qr: text }
  }

  if (node.node_type === 'trojan') {
    const v =
      node.uuid +
      '@' +
      node.server_name +
      ':' +
      node.outport +
      '?sni=' +
      sni +
      '?insecure=0#' +
      encodeURI(node.name)
    const text = 'trojan://' + v
    return { text, qr: text }
  }

  if (node.node_type === 'hy2') {
    const v = node.uuid + '@' + node.server_name + ':' + node.outport + '#' + encodeURI(node.name)
    const text = 'hysteria2://' + v
    return { text, qr: text }
  }

  return null
}

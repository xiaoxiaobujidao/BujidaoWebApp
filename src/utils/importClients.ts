import shadowrocketIcon from '@/assets/icons/clients/shadowrocket.png'
import singboxIcon from '@/assets/icons/clients/sing-box.svg'
import clashIcon from '@/assets/icons/clients/clash.png'
import v2rayngIcon from '@/assets/icons/clients/v2rayng.png'

const REMARK = '布吉岛'

/** 当前仅 Clash YAML 配置支持一键导入 */
export function isClashConfigType(type: string) {
  return type === 'clash_yaml' || type.startsWith('clash')
}

/**
 * 自定义配置导入 Clash Verge。
 * 订阅地址附带 type=clash_verge，导入名称使用配置名称。
 * url 整体编码，避免 &cc=、&type= 被客户端拆出订阅地址。
 */
export function buildClashVergeConfigImportHref(sub: string, configName: string) {
  const profile = `${sub}&cc=${encodeURIComponent(configName)}&type=clash_verge`
  return `clash://install-config?url=${encodeURIComponent(profile)}&name=${encodeURIComponent(configName)}`
}

export type ImportClient = {
  id: string
  name: string
  icon: string
  buildHref: (sub: string, btoa: (value: string) => string) => string
}

export const importClients: ImportClient[] = [
  {
    id: 'v2rayng',
    name: 'v2rayNG',
    icon: v2rayngIcon,
    // 官方 1.8.28+：v2rayng://install-sub/?url=urlencode(url)#NAME
    buildHref: (sub) =>
      encodeURI(
        'v2rayng://install-sub/?url=' + encodeURIComponent(sub + '&type=v2rayN') + '#' + REMARK,
      ),
  },
  {
    id: 'shadowrocket',
    name: 'Shadowrocket',
    icon: shadowrocketIcon,
    buildHref: (sub, btoa) =>
      encodeURI(
        'shadowrocket://add/sub://' + btoa(sub + '&type=shadowrocket') + '?remark=' + REMARK,
      ),
  },
  {
    id: 'sing-box',
    name: 'sing-box',
    icon: singboxIcon,
    buildHref: (sub) =>
      encodeURI(
        'sing-box://import-remote-profile?url=' + encodeURI(sub + '&type=singbox') + '#' + REMARK,
      ),
  },
  {
    id: 'clash',
    name: 'Clash',
    icon: clashIcon,
    buildHref: (sub) =>
      encodeURI('clash://install-config?url=' + encodeURI(sub) + '&name=' + REMARK),
  },
]

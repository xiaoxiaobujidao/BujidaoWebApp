import shadowrocketIcon from '@/assets/icons/clients/shadowrocket.png'
import singboxIcon from '@/assets/icons/clients/sing-box.svg'
import clashIcon from '@/assets/icons/clients/clash.png'

const REMARK = '布吉岛'

export type ImportClient = {
  id: string
  name: string
  icon: string
  buildHref: (sub: string, btoa: (value: string) => string) => string
}

export const importClients: ImportClient[] = [
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

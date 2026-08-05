import shadowrocketIcon from '@/assets/icons/clients/shadowrocket.png'
import singboxIcon from '@/assets/icons/clients/sing-box.svg'
import clashIcon from '@/assets/icons/clients/clash.png'
import v2raynIcon from '@/assets/icons/clients/v2rayn.png'
import v2rayngIcon from '@/assets/icons/clients/v2rayng.png'

const REMARK = '布吉岛'

export type ImportClient = {
  id: string
  name: string
  icon: string
  buildHref: (sub: string, btoa: (value: string) => string) => string
}

export const importClients: ImportClient[] = [
  {
    id: 'v2rayn',
    name: 'v2rayN',
    icon: v2raynIcon,
    // 社区常用 scheme；订阅内容走 type=v2rayN
    buildHref: (sub) =>
      encodeURI(
        'v2rayn://install-config?url=' +
          encodeURIComponent(sub + '&type=v2rayN') +
          '&name=' +
          encodeURIComponent(REMARK),
      ),
  },
  {
    id: 'v2rayng',
    name: 'v2rayNG',
    icon: v2rayngIcon,
    // 官方 1.8.28+：v2rayng://install-sub/?url=urlencode(url)#NAME
    buildHref: (sub) =>
      encodeURI(
        'v2rayng://install-sub/?url=' +
          encodeURIComponent(sub + '&type=v2rayN') +
          '#' +
          REMARK,
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

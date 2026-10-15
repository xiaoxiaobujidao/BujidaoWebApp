/**
 * 客户端教程内容（纯数据），各主题用自己的组件渲染。
 * 图片放在 src/assets/img/tutorial 下，这里通过相对 key 引用。
 */

const imageModules = import.meta.glob<string>('../assets/img/tutorial/**/*.webp', {
  eager: true,
  import: 'default',
})

/** 通过 'windows/v2rayN/v2rayn.webp' 这样的 key 获取打包后的图片地址 */
export function tutorialImage(key: string): string {
  const url = imageModules[`../assets/img/tutorial/${key}`]
  if (!url && import.meta.env.DEV) {
    console.warn(`[tutorial] image not found: ${key}`)
  }
  return url ?? ''
}

export interface TutorialLink {
  label: string
  href: string
}

export interface TutorialCopy {
  label: string
  value: string
}

export interface TutorialStepItem {
  /** 子步骤说明，可为空（仅图片） */
  text?: string
  /** 图片 key，相对 src/assets/img/tutorial */
  img?: string
  links?: TutorialLink[]
  copy?: TutorialCopy
}

export interface TutorialStep {
  title: string
  /**
   * install：渲染下载入口；copy-sub：渲染“复制订阅”按钮；默认普通步骤
   */
  kind?: 'install' | 'copy-sub'
  /** 安装步骤的下载入口 */
  downloads?: TutorialLink[]
  note?: string
  items?: TutorialStepItem[]
}

export interface TutorialClient {
  id: string
  name: string
  steps: TutorialStep[]
  footnote?: string
}

export interface TutorialPlatform {
  id: string
  name: string
  /** 供主题选择图标用的平台标识 */
  icon: 'android' | 'ios' | 'macos' | 'windows' | 'config'
  clients: TutorialClient[]
}

const FILES = 'https://files.bujidao.org/d'
const FOOTNOTE =
  '由于精力有限，只提供每个平台最基本软件的配置过程，更多软件及进阶配置需要大家自行摸索啦～'

const v2rayNG: TutorialClient = {
  id: 'v2rayng',
  name: 'v2rayNG',
  footnote: FOOTNOTE,
  steps: [
    {
      title: '安装软件',
      kind: 'install',
      downloads: [
        { label: '岛岛网盘', href: `${FILES}/v2rayNG/` },
        { label: 'GitHub Releases', href: 'https://github.com/2dust/v2rayNG/releases/latest' },
      ],
    },
    { title: '复制订阅地址', kind: 'copy-sub' },
    {
      title: '软件内导入订阅',
      items: [
        { text: '打开软件，点击左上角菜单', img: 'andriod/v2rayng/left-menu.webp' },
        { text: '点击「订阅分组设置」', img: 'andriod/v2rayng/sub.webp' },
        { text: '点击右上角加号', img: 'andriod/v2rayng/add_sub_button.webp' },
        { text: '将复制来的订阅地址粘贴进 URL', img: 'andriod/v2rayng/paste.webp' },
        { text: '点击右上角 ✓ 保存', img: 'andriod/v2rayng/save_sub.webp' },
      ],
    },
    {
      title: '改为分应用代理（推荐、可选）',
      items: [
        { text: '点击左上角菜单，进入设置', img: 'andriod/v2rayng/app_proxy.webp' },
        {
          text: '进入分应用代理，勾选需要代理的应用，如 Telegram、YouTube、浏览器等',
          img: 'andriod/v2rayng/youtube.webp',
        },
      ],
    },
    {
      title: '更新订阅',
      items: [
        { text: '在软件主页点击右上角三个点', img: 'andriod/v2rayng/right-menu.webp' },
        { text: '点击「更新订阅」', img: 'andriod/v2rayng/update_sub.webp' },
      ],
    },
    {
      title: '连接',
      items: [{ text: '在软件主页点击右下角图标进行连接', img: 'andriod/v2rayng/connect.webp' }],
    },
  ],
}

const clashMeta: TutorialClient = {
  id: 'clash-meta',
  name: 'Clash Meta for Android',
  footnote: FOOTNOTE,
  steps: [
    {
      title: '安装软件',
      kind: 'install',
      downloads: [
        { label: '岛岛网盘', href: `${FILES}/ClashMetaForAndroid/` },
        {
          label: 'GitHub Releases',
          href: 'https://github.com/MetaCubeX/ClashMetaForAndroid/releases',
        },
      ],
    },
    { title: '复制订阅地址', kind: 'copy-sub' },
    {
      title: '软件内导入订阅',
      items: [
        { text: '打开软件，点击「配置」', img: 'andriod/clash/Profile.webp' },
        { text: '点击右上角加号添加', img: 'andriod/clash/AddSub.webp' },
        { text: '选择「从 URL 导入」', img: 'andriod/clash/UseUrl.webp' },
        { text: '填写名称与订阅地址，点击右上角保存', img: 'andriod/clash/SaveProfile.webp' },
        { text: '选择刚添加好的配置', img: 'andriod/clash/ChooseProfile.webp' },
      ],
    },
    {
      title: '连接',
      items: [
        { text: '点击进行连接', img: 'andriod/clash/Start.webp' },
        { text: '查看分流规则', img: 'andriod/clash/RuleMode.webp' },
        { text: '选择节点', img: 'andriod/clash/ProxyChoose.webp' },
      ],
    },
  ],
}

const shadowrocket: TutorialClient = {
  id: 'shadowrocket',
  name: 'Shadowrocket',
  steps: [
    {
      title: '安装软件',
      kind: 'install',
      note: '需要非国区 Apple ID；没有的话，付费后可私聊岛岛协助',
      downloads: [
        { label: 'App Store', href: 'https://apps.apple.com/us/app/shadowrocket/id932747118' },
      ],
      items: [{ img: 'ios/shadowrocket/app.webp' }],
    },
    { title: '复制订阅地址', kind: 'copy-sub' },
    {
      title: '添加订阅',
      items: [
        { text: '点击右上角加号', img: 'ios/shadowrocket/add-sub-1.webp' },
        { text: '点击「类型」', img: 'ios/shadowrocket/add-sub-2.webp' },
        { text: '选择 Subscribe（订阅类型）', img: 'ios/shadowrocket/add-sub-3.webp' },
        { text: '粘贴刚才复制的订阅链接', img: 'ios/shadowrocket/add-sub-4.webp' },
      ],
    },
    {
      title: '选择节点并连接',
      items: [{ img: 'ios/shadowrocket/connect.webp' }],
    },
    {
      title: '选择合适的分流规则（强烈建议、可选）',
      items: [
        {
          text: '打开规则仓库，复制想添加的规则链接，例如「白名单 + 去广告」',
          img: 'ios/shadowrocket/rules-git.webp',
          links: [
            {
              label: '规则仓库',
              href: 'https://github.com/Johnshall/Shadowrocket-ADBlock-Rules-Forever',
            },
          ],
          copy: {
            label: '复制「白名单 + 去广告」规则',
            value:
              'https://johnshall.github.io/Shadowrocket-ADBlock-Rules-Forever/sr_top500_whitelist_ad.conf',
          },
        },
        {
          text: '打开软件「配置」页，点击右上角加号，粘贴 URL',
          img: 'ios/shadowrocket/add-rule.webp',
        },
        { text: '选择并使用该配置', img: 'ios/shadowrocket/use-rule.webp' },
        { text: '返回首页，进入「路由」', img: 'ios/shadowrocket/choose-profile-1.webp' },
        { text: '把全局路由改为「配置」', img: 'ios/shadowrocket/choose-profile-2.webp' },
      ],
    },
  ],
}

const clashVerge: TutorialClient = {
  id: 'clash-verge',
  name: 'Clash Verge Rev',
  steps: [
    {
      title: '安装软件',
      kind: 'install',
      downloads: [
        { label: '岛岛网盘', href: `${FILES}/clash-verge-rev` },
        {
          label: 'GitHub Releases',
          href: 'https://github.com/clash-verge-rev/clash-verge-rev/releases/latest',
        },
      ],
    },
    { title: '复制订阅地址', kind: 'copy-sub' },
    {
      title: '添加订阅',
      items: [
        { text: '打开软件后，点击「订阅」', img: 'windows/ClashVerge/add-sub-1.webp' },
        { text: '把复制的 URL 粘贴进去并点击「导入」', img: 'windows/ClashVerge/add-sub-2.webp' },
        { text: '切换为岛岛的配置文件', img: 'windows/ClashVerge/select-bujidao.webp' },
      ],
    },
    {
      title: '切换规则 / 全局',
      items: [{ img: 'windows/ClashVerge/rule.webp' }],
    },
    {
      title: '开启系统代理或 TUN',
      note: '记得查看感叹号里的提示内容',
      items: [{ img: 'windows/ClashVerge/proxy-tun.webp' }],
    },
  ],
}

const v2rayN: TutorialClient = {
  id: 'v2rayn',
  name: 'v2rayN',
  steps: [
    {
      title: '安装软件',
      kind: 'install',
      downloads: [
        { label: '岛岛网盘', href: `${FILES}/v2rayN` },
        { label: 'GitHub Releases', href: 'https://github.com/2dust/v2rayN/releases/latest' },
      ],
      items: [
        { text: '下载后解压', img: 'windows/v2rayN/v2rayn.webp' },
        {
          text: '打开软件后，任务栏托盘会出现小图标，双击即可看到软件界面',
          img: 'windows/v2rayN/icon.webp',
        },
      ],
    },
    { title: '复制订阅地址', kind: 'copy-sub' },
    {
      title: '添加订阅',
      items: [
        { text: '点击如图所示的加号', img: 'windows/v2rayN/add-sub.webp' },
        { text: '按图输入订阅地址及备注，点击确定', img: 'windows/v2rayN/add-sub-2.webp' },
        { text: '更新订阅', img: 'windows/v2rayN/add-sub-3.webp' },
      ],
    },
    {
      title: '选择服务器及模式',
      items: [
        { text: '右键打开菜单选择，或点击节点后按回车', img: 'windows/v2rayN/choose.webp' },
        { text: '这里可以选择路由模式', img: 'windows/v2rayN/route.webp' },
        {
          text: 'TUN 模式与系统代理（TUN 模式需要右键以管理员身份运行）',
          img: 'windows/v2rayN/tun.webp',
        },
      ],
    },
  ],
}

const clashConfig: TutorialClient = {
  id: 'clash-config',
  name: 'Clash 自定义配置',
  steps: [
    {
      title: '公共配置文件',
      kind: 'install',
      note: '岛岛维护的 Clash 规则仓库，可直接拿来做个性化配置的模板',
      downloads: [
        { label: 'Clash 公共配置文件', href: 'https://github.com/xiaoxiaobujidao/ClashRule' },
      ],
    },
  ],
}

export const tutorialPlatforms: TutorialPlatform[] = [
  { id: 'android', name: '安卓', icon: 'android', clients: [v2rayNG, clashMeta] },
  { id: 'ios', name: 'iOS', icon: 'ios', clients: [shadowrocket] },
  { id: 'macos', name: 'macOS', icon: 'macos', clients: [shadowrocket, clashVerge] },
  { id: 'windows', name: 'Windows', icon: 'windows', clients: [clashVerge, v2rayN] },
  { id: 'config', name: '个性化', icon: 'config', clients: [clashConfig] },
]

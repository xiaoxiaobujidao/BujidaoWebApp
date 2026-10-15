import type { LucideName } from '@/components/icons/lucide'

export interface NavItem {
  path: string
  label: string
  icon: LucideName
  /** 页面副标题 */
  description: string
}

/** 主导航（导航栏 / 侧栏 / 手机底栏共用） */
export const mainNav: NavItem[] = [
  { path: '/user', label: '概览', icon: 'home', description: '账户状态与订阅地址一览' },
  { path: '/sub', label: '订阅', icon: 'rss', description: '各客户端订阅链接与一键导入' },
  { path: '/node_list', label: '节点', icon: 'server', description: '可用节点与连接信息' },
  { path: '/balance', label: '财务', icon: 'wallet', description: '余额、用量趋势与推广返利' },
  { path: '/tutorial', label: '教程', icon: 'book', description: '各平台客户端配置指南' },
  { path: '/announcement', label: '公告', icon: 'megaphone', description: '岛上的最新消息' },
]

/** 账户相关导航 */
export const accountNav: NavItem[] = [
  { path: '/cc', label: '个性化配置', icon: 'sliders', description: '自定义 Clash 配置文件' },
  { path: '/signout', label: '登出', icon: 'logout', description: '退出当前账号' },
]

/** 手机底栏展示的主项 */
export const bottomNav = mainNav.slice(0, 4)

export const TELEGRAM_GROUP = 'https://t.me/bujidaoChat'
export const SITE_URL = 'https://bujidao.org'

export function findNav(path: string): NavItem | undefined {
  return [...mainNav, ...accountNav].find((item) => item.path === path)
}

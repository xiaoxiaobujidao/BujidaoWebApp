import { jsonRpc } from './json_rpc'
interface jsonRpcResponse {
  jsonrpc: string
  result?: any
  error?: { code?: number; message?: string; data?: any }
  id: number
}

interface loginWithTelegramResponse extends jsonRpcResponse {
  result?: { login_token: string }
}
function checkLoginKey(login_key: string): Promise<jsonRpcResponse> {
  return jsonRpc('check_login_key', {
    login_key,
  })
}
function loginWithTelegram(
  telegram_authorization: any,
  inviter: string | null = null,
): Promise<loginWithTelegramResponse> {
  const params: Record<string, any> = { telegram_authorization }
  if (inviter) {
    params.inviter = inviter
  }
  return jsonRpc('login_with_telegram', params)
}
function loginWithGoogle(
  google_oauth_token: any,
  inviter: string | null = null,
): Promise<loginWithTelegramResponse> {
  const params: Record<string, any> = { google_oauth_token }
  if (inviter) {
    params.inviter = inviter
  }
  return jsonRpc('login_with_google', params)
}

interface loginWithEmailResponse extends jsonRpcResponse {
  result?: { status: boolean }
}
function loginWithEmail(
  email: string,
  inviter: string | null = null,
): Promise<loginWithEmailResponse> {
  return jsonRpc('login_with_email', {
    email,
    inviter,
  })
}
function loginWithEmailPasswd(email: string, password: string): Promise<loginWithTelegramResponse> {
  return jsonRpc('login_with_passwd', {
    email,
    password,
  })
}

import type { UserInfo } from '@/stores/userInfoStore'
interface getUserInfoResponse extends jsonRpcResponse {
  result?: UserInfo
}

function getUserInfo(): Promise<getUserInfoResponse> {
  return jsonRpc('get_user_info')
}

interface paymentMethod {
  kind: string
  img: string
}
interface getPaymentMethodResponse extends jsonRpcResponse {
  result?: {
    name: string
    path: string
    method: paymentMethod[]
  }[]
}
function getPaymentMethod(): Promise<getPaymentMethodResponse> {
  return jsonRpc('get_payment_method')
}
function addCredit(path: string, method: string, amount: number) {
  return jsonRpc('add_credit', {
    path,
    method,
    amount,
  })
}

interface getInviteLinkResponse extends jsonRpcResponse {
  result?: {
    invite_link: string
    rebate_ratio: string
  }[]
}

function getInviteLink(): Promise<getInviteLinkResponse> {
  return jsonRpc('get_invite_link')
}

function createInviteLink(): Promise<getInviteLinkResponse> {
  return jsonRpc('create_invite_link')
}
interface getGiftResponse extends jsonRpcResponse {
  result?: number[][]
}
function getGift(): Promise<getGiftResponse> {
  return jsonRpc('get_gift')
}
interface getUnmeasuredTrafficResponse extends jsonRpcResponse {
  result?: number
}
function getUnmeasuredTraffic(): Promise<getUnmeasuredTrafficResponse> {
  return jsonRpc('get_unmeasured_traffic')
}

interface changePasswdResponse extends jsonRpcResponse {
  result?: boolean
}
function changePasswd(pass: string): Promise<changePasswdResponse> {
  return jsonRpc('change_passwd', { pass })
}
interface changeEmailResponse extends jsonRpcResponse {
  result?: boolean
}
function changeEmail(email: string): Promise<changeEmailResponse> {
  return jsonRpc('change_email', { email })
}
interface changeThemeResponse extends jsonRpcResponse {
  result?: boolean
}
function changeTheme(theme: string): Promise<changeThemeResponse> {
  return jsonRpc('change_theme', { theme })
}

interface getNodeListResponse extends jsonRpcResponse {
  result?: {
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
  }[]
}
function getNodeList(): Promise<getNodeListResponse> {
  return jsonRpc('get_node_list')
}
interface customizedConfiguration {
  type: string
  name: string
  value: string
  allow_share: boolean
}
interface getCustomizedConfigurationResponse extends jsonRpcResponse {
  result?: customizedConfiguration[]
}
function getCustomizedConfiguration(): Promise<getCustomizedConfigurationResponse> {
  return jsonRpc('get_customized_configuration')
}
interface uploadCustomizedConfigurationResponse extends jsonRpcResponse {
  result?: customizedConfiguration
}
function uploadCustomizedConfiguration(
  cc: customizedConfiguration,
): Promise<uploadCustomizedConfigurationResponse> {
  return jsonRpc('upload_customized_configuration', {
    type: cc.type,
    name: cc.name,
    value: cc.value,
    allow_share: cc.allow_share,
  })
}
interface deleteCustomizedConfigurationResponse extends jsonRpcResponse {
  result?: boolean
}
function deleteCustomizedConfiguration(
  type: string,
  name: string,
): Promise<deleteCustomizedConfigurationResponse> {
  return jsonRpc('delete_customized_configuration', {
    type: type,
    name: name,
  })
}
interface Announcement {
  id: number
  announcement: string
  show: boolean
  pin: boolean
  create_time: number
  edit_time: number
}
interface getAnnouncementResponse extends jsonRpcResponse {
  result: Announcement[]
}
function getAnnouncement(): Promise<getAnnouncementResponse> {
  return jsonRpc('get_announcement')
}
function rebateToBalance(): Promise<jsonRpcResponse> {
  return jsonRpc('rebate_to_balance')
}
function pointsToBalance(): Promise<jsonRpcResponse> {
  return jsonRpc('points_to_balance')
}
function changeUuid(): Promise<jsonRpcResponse> {
  return jsonRpc('change_uuid')
}
function changeSubKey(): Promise<jsonRpcResponse> {
  return jsonRpc('change_sub_key')
}
function changeWireguardPriKey(): Promise<jsonRpcResponse> {
  return jsonRpc('change_wireguard_pri_key')
}

function cancel(): Promise<jsonRpcResponse> {
  return jsonRpc('cancel')
}
interface getUserTrafficHistoryResponse extends jsonRpcResponse {
  result: {
    usage: number
    balance: number
    update_time: number
  }[]
}
function getUserTrafficHistory(): Promise<getUserTrafficHistoryResponse> {
  return jsonRpc('get_user_traffic_history')
}
function bindTelegram(telegram_id: number): Promise<jsonRpcResponse> {
  return jsonRpc('bind_telegram', { telegram_id })
}
function updateEmailOptIn(email_opt_in: boolean): Promise<jsonRpcResponse> {
  return jsonRpc('update_email_opt_in', {
    email_opt_in,
  })
}
interface getInvitedCountRes extends jsonRpcResponse {
  result: number
}
function getInvitedCount(): Promise<getInvitedCountRes> {
  return jsonRpc('get_invited_count')
}
interface emailOptOutRes extends jsonRpcResponse {
  result: boolean
}
function emailOptOut(key: string): Promise<emailOptOutRes> {
  return jsonRpc('email_opt_out', {
    key,
  })
}

export {
  checkLoginKey,
  getInviteLink,
  createInviteLink,
  addCredit,
  getPaymentMethod,
  loginWithEmail,
  loginWithTelegram,
  loginWithGoogle,
  loginWithEmailPasswd,
  getUserInfo,
  getGift,
  getUnmeasuredTraffic,
  changeEmail,
  changeTheme,
  changePasswd,
  getNodeList,
  getCustomizedConfiguration,
  uploadCustomizedConfiguration,
  deleteCustomizedConfiguration,
  getAnnouncement,
  rebateToBalance,
  pointsToBalance,
  changeUuid,
  changeSubKey,
  changeWireguardPriKey,
  getUserTrafficHistory,
  cancel,
  bindTelegram,
  updateEmailOptIn,
  getInvitedCount,
  emailOptOut,
}

declare const window: any
function getTelegramInitData() {
  const initData = window.Telegram?.WebApp?.initData
  return initData
}
/** 在 Telegram 小程序内关闭窗口；普通浏览器中为空操作 */
function closeTelegramWebApp() {
  window.Telegram?.WebApp?.close?.()
}
/** 是否运行在 Telegram 小程序环境中 */
function isTelegramWebApp(): boolean {
  return !!window.Telegram?.WebApp?.initData
}
export { getTelegramInitData, closeTelegramWebApp, isTelegramWebApp }

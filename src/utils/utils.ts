// 不确定对不对，已经用不到了，没有vmess节点了
function utf8_to_b64(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16)),
    ),
  )
}
function is_ios(): boolean {
  return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
}

function base64Encode(str: string): string {
  return window.btoa(str)
}

export { utf8_to_b64, is_ios, base64Encode }

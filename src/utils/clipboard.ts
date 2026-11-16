/** 复制文本到剪贴板，返回是否成功（无权限或旧浏览器时返回 false）。 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

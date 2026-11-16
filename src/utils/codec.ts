// 编解码工具函数，全部支持 UTF-8（含中文）。

function bytesToBinary(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return binary;
}

export function base64Encode(input: string): string {
  return btoa(bytesToBinary(new TextEncoder().encode(input)));
}

export function base64Decode(input: string): string {
  const binary = atob(input.trim());
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  // fatal: true 让非法 UTF-8 序列直接抛错，而不是静默产出乱码
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input.trim());
}

const HTML_ENTITIES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function htmlEncode(input: string): string {
  return input.replace(/[&<>"']/g, (ch) => HTML_ENTITIES[ch]);
}

export function htmlDecode(input: string): string {
  const el = document.createElement('textarea');
  el.innerHTML = input;
  return el.value;
}

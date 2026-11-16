// 基于 Web Crypto API 的加解密工具，无第三方依赖。
// 口令 -> PBKDF2(SHA-256, 10 万次迭代) 派生 AES-GCM 256 位密钥。

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 100_000;

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function deriveKey(password: string, salt: Uint8Array<ArrayBuffer>): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/** 加密结果格式：base64( salt[16] | iv[12] | 密文+GCM tag ) */
export async function aesEncrypt(plainText: string, password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoder.encode(plainText)
  );
  const out = new Uint8Array(SALT_LENGTH + IV_LENGTH + cipherBuffer.byteLength);
  out.set(salt, 0);
  out.set(iv, SALT_LENGTH);
  out.set(new Uint8Array(cipherBuffer), SALT_LENGTH + IV_LENGTH);
  return bytesToBase64(out);
}

export async function aesDecrypt(payload: string, password: string): Promise<string> {
  const bytes = base64ToBytes(payload.trim());
  if (bytes.length < SALT_LENGTH + IV_LENGTH + 1) {
    throw new Error('密文格式不正确（应为加密工具输出的 base64 字符串）');
  }
  const salt = bytes.slice(0, SALT_LENGTH);
  const iv = bytes.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const data = bytes.slice(SALT_LENGTH + IV_LENGTH);
  const key = await deriveKey(password, salt);
  const plainBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
  return decoder.decode(plainBuffer);
}

export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512';

export const HASH_ALGORITHMS: HashAlgorithm[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

export async function digestText(input: string, algorithm: HashAlgorithm): Promise<string> {
  const buffer = await crypto.subtle.digest(algorithm, encoder.encode(input));
  return bufferToHex(buffer);
}

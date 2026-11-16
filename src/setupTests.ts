// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// react-router v7 relies on TextEncoder/TextDecoder, which jsdom does not
// provide. Polyfill them from Node before any router code is imported.
import { TextDecoder, TextEncoder } from 'node:util';

if (typeof globalThis.TextEncoder === 'undefined') {
  Object.assign(globalThis, { TextEncoder });
}
if (typeof globalThis.TextDecoder === 'undefined') {
  Object.assign(globalThis, { TextDecoder });
}

// jsdom 不提供完整的 Web Crypto（缺少 subtle），用 Node 的 webcrypto 补齐，
// 供加解密工具的单元测试使用。
import { webcrypto } from 'node:crypto';

if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
    writable: true,
  });
} else if (!globalThis.crypto.subtle) {
  // jsdom 自带 crypto（仅 getRandomValues），把 subtle 挂到现有对象上
  Object.defineProperty(globalThis.crypto, 'subtle', {
    value: (webcrypto as unknown as Crypto).subtle,
    configurable: true,
    writable: true,
  });
}

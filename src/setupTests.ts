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

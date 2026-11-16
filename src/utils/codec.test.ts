import {
  base64Decode,
  base64Encode,
  htmlDecode,
  htmlEncode,
  urlDecode,
  urlEncode,
} from './codec';

describe('base64', () => {
  test('ASCII 往返', () => {
    expect(base64Decode(base64Encode('hello world'))).toBe('hello world');
  });

  test('中文等 UTF-8 内容往返', () => {
    const text = '你好，世界 🎉';
    expect(base64Encode(text)).toBe('5L2g5aW977yM5LiW55WMIPCfjok=');
    expect(base64Decode(base64Encode(text))).toBe(text);
  });

  test('解码非法输入时抛错', () => {
    expect(() => base64Decode('%%%not-base64%%%')).toThrow();
  });
});

describe('url', () => {
  test('往返', () => {
    const text = 'a=b&c=中文';
    const encoded = urlEncode(text);
    expect(encoded).toBe('a%3Db%26c%3D%E4%B8%AD%E6%96%87');
    expect(urlDecode(encoded)).toBe(text);
  });
});

describe('html entities', () => {
  test('编码常见特殊字符', () => {
    expect(htmlEncode(`<a href="x">&'hi'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&amp;&#39;hi&#39;&lt;/a&gt;'
    );
  });

  test('解码往返', () => {
    const text = '<p>"引号" & 符号</p>';
    expect(htmlDecode(htmlEncode(text))).toBe(text);
  });
});

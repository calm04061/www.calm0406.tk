import {formatJson, minifyJson, validateJson} from './json';

test('formatJson 输出缩进格式', () => {
  expect(formatJson('{"a":1,"b":[2,3]}')).toBe('{\n  "a": 1,\n  "b": [\n    2,\n    3\n  ]\n}');
});

test('minifyJson 去除空白', () => {
  expect(minifyJson('{ "a": 1, "b": [2, 3] }')).toBe('{"a":1,"b":[2,3]}');
});

describe('validateJson', () => {
  test('合法 JSON', () => {
    expect(validateJson('{"a":1}')).toEqual({ok: true});
  });

  test('非法 JSON 返回错误信息', () => {
    const result = validateJson('{bad');
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toBeTruthy();
    }
  });
});

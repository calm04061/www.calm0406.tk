import {formatDate, parseTimestamp, timestampOf} from './time';

describe('parseTimestamp', () => {
  test('秒级时间戳', () => {
    const {date, unit, milliseconds} = parseTimestamp('0');
    expect(unit).toBe('s');
    expect(milliseconds).toBe(0);
    expect(date.getTime()).toBe(0);
  });

  test('毫秒级时间戳', () => {
    const {unit, milliseconds} = parseTimestamp('1700000000000');
    expect(unit).toBe('ms');
    expect(milliseconds).toBe(1700000000000);
  });

  test('拒绝非数字输入', () => {
    expect(() => parseTimestamp('2023-11-14')).toThrow('纯数字');
  });

  test('拒绝空输入', () => {
    expect(() => parseTimestamp('   ')).toThrow();
  });
});

describe('formatDate', () => {
  test('UTC 时区格式化 epoch', () => {
    expect(formatDate(new Date(0), 'UTC')).toBe('1970-01-01 00:00:00');
  });

  test('指定时区影响输出', () => {
    // 2023-11-14T16:13:20Z = 北京时间 2023-11-15 00:13:20
    const date = new Date(1699978400000);
    expect(formatDate(date, 'Asia/Shanghai')).toBe('2023-11-15 00:13:20');
    expect(formatDate(date, 'UTC')).toBe('2023-11-14 16:13:20');
  });
});

describe('timestampOf', () => {
  test('同时给出秒与毫秒', () => {
    expect(timestampOf(new Date(1699978400123))).toEqual({
      s: 1699978400,
      ms: 1699978400123,
    });
  });
});

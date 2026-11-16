// 时间转换工具函数。

export type TimestampUnit = 's' | 'ms';

export interface ParsedTimestamp {
  date: Date;
  unit: TimestampUnit;
  milliseconds: number;
}

/** 解析时间戳字符串，按量级自动识别秒 / 毫秒（1e11 为分界，约公元 5138 年的秒级值）。 */
export function parseTimestamp(raw: string): ParsedTimestamp {
  const text = raw.trim();
  if (!/^-?\d+$/.test(text)) {
    throw new Error('请输入纯数字时间戳');
  }
  const value = Number(text);
  const unit: TimestampUnit = Math.abs(value) < 1e11 ? 's' : 'ms';
  const milliseconds = unit === 's' ? value * 1000 : value;
  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    throw new Error('时间戳超出有效范围');
  }
  return { date, unit, milliseconds };
}

/** 格式化为 YYYY-MM-DD HH:mm:ss；不传 timeZone 时用浏览器本地时区。 */
export function formatDate(date: Date, timeZone?: string): string {
  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') parts[part.type] = part.value;
  }
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

export function timestampOf(date: Date): { s: number; ms: number } {
  const ms = date.getTime();
  return { s: Math.floor(ms / 1000), ms };
}

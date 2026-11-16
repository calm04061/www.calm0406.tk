// JSON 格式化与校验工具函数。

export interface JsonErrorInfo {
  message: string;
  line?: number;
  column?: number;
}

export type JsonValidation = { ok: true } | { ok: false; error: JsonErrorInfo };

export function formatJson(input: string, indent = 2): string {
  return JSON.stringify(JSON.parse(input), null, indent);
}

export function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

/** 校验 JSON；引擎错误信息带 position 时（旧版 V8 / JSC）换算出行列。 */
export function validateJson(input: string): JsonValidation {
  try {
    JSON.parse(input);
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const error: JsonErrorInfo = { message };
    const match = /position (\d+)/i.exec(message);
    if (match) {
      const position = Number(match[1]);
      const before = input.slice(0, position);
      error.line = before.split('\n').length;
      error.column = position - before.lastIndexOf('\n');
    }
    return { ok: false, error };
  }
}

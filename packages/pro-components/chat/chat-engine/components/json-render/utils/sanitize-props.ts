/**
 * A2UI / json-render 传入组件 props 前的黑名单过滤工具
 *
 * 使用场景：
 * 服务端下发的 element.props 经过 `{...restProps}` 展开到 DOM 元素时，可能
 * 携带如下危险字段：
 *   1. `dangerouslySetInnerHTML` / `innerHTML` 等：直接注入 HTML，可执行任意脚本（XSS）
 *   2. `ref` / `key`：React 保留字段，非预期透传可能引发运行时异常
 *   3. `href` / `src` 等 URL 属性中的 `javascript:` / `data:` / `vbscript:` 协议
 *   4. 字符串型的 `onXxx` 事件处理器（React 只接受函数，字符串无意义）
 *   5. `__proto__` / `prototype` / `constructor` 等原型相关字段（原型污染）
 *
 * 所有 key 判定均大小写不敏感（按 toLowerCase 归一化后匹配）。
 *
 * 为什么不用 DOMPurify：
 * - DOMPurify 用于清洗「HTML 字符串」，我们的场景是过滤「React props 对象」
 * - 引入 DOMPurify 会增加 ~20KB gzip 包体积，且用途不对口
 * - chat-engine 明确禁止使用 dangerouslySetInnerHTML 渲染 AI 内容（见 AGENTS.md）
 */

/** 禁止透传到 DOM 的 React 保留字段 / XSS 通道字段 */
const BLOCKED_KEYS = new Set<string>([
  'dangerouslysetinnerhtml',
  'innerhtml',
  'outerhtml',
  'textcontent',
  'srcdoc',
  'ref',
  'key',
]);

/** 原型相关字段，禁止参与结果对象构造，防止原型污染 */
const BLOCKED_OBJECT_KEYS = new Set<string>(['__proto__', 'prototype', 'constructor']);

/** 危险的 URL 协议 */
const DANGEROUS_URL_PROTOCOL = /^\s*(javascript|data|vbscript):/i;

/** 需要做协议白名单校验的 URL 类属性 */
const URL_PROPS = new Set<string>(['href', 'src', 'action', 'formaction', 'poster', 'xlinkhref']);

/** 事件处理器字段命名规则：onXxx */
const EVENT_HANDLER_RE = /^on[a-z]/i;

/**
 * 过滤服务端下发的 props，避免 XSS 通道
 *
 * 处理规则：
 * 1. 命中 BLOCKED_KEYS / BLOCKED_OBJECT_KEYS 的字段直接丢弃
 * 2. URL 类属性中若使用危险协议（javascript: / data: / vbscript:），丢弃该字段
 * 3. `onXxx` 事件处理器若不是函数类型（例如字符串），丢弃该字段
 *
 * @param props 服务端下发的 props 对象
 * @returns 过滤后的安全 props 对象
 *
 * @example
 * ```tsx
 * const safeProps = sanitizeProps(element.props);
 * return <span {...safeProps}>{text}</span>;
 * ```
 */
export function sanitizeProps<T extends Record<string, unknown>>(props: T): Partial<T> {
  if (!props || typeof props !== 'object') {
    return {} as Partial<T>;
  }

  // 使用 null 原型对象承接结果，避免原型链污染影响遍历
  const result: Record<string, unknown> = Object.create(null);

  for (const key of Object.keys(props)) {
    const value = props[key];
    const normalizedKey = key.toLowerCase();

    if (BLOCKED_KEYS.has(normalizedKey) || BLOCKED_OBJECT_KEYS.has(normalizedKey)) continue;

    if (URL_PROPS.has(normalizedKey) && typeof value === 'string' && DANGEROUS_URL_PROTOCOL.test(value)) {
      continue;
    }

    if (EVENT_HANDLER_RE.test(key) && typeof value !== 'function') {
      continue;
    }

    result[key] = value;
  }

  // 转回普通对象原型，方便下游 `{...safeProps}` 展开使用
  return { ...result } as Partial<T>;
}

export default sanitizeProps;

/**
 * 处理 `R | (...args) => R` 类似类型
 * （ts <= 3.2 时无法依赖 typeof x === "function" 自动推导）
 */
export default function isCallable<P extends unknown[], R = React.ReactNode>(
  target: R | ((...args: P) => R),
): target is (...args: P) => R {
  return typeof target === 'function';
}

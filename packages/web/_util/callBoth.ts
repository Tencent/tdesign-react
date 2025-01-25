// eslint-disable-next-line space-before-function-paren
export default function callBoth<T extends (...args: any[]) => any>(...fns: T[]): T {
  return ((...args: any[]) => {
    let lastResult: any;

    // eslint-disable-next-line no-restricted-syntax
    for (const fn of fns) {
      if (typeof fn === 'function') {
        lastResult = fn(...args);
      }
    }
    return lastResult;
  }) as T;
}

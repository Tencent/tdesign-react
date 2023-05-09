import { useMemo } from 'react';

// defaultProps 将于 18.3.0 废弃，故需实现 hook 在组件内部兼容
// https://github.com/facebook/react/pull/16210
export default function useDefaultProps<T>(originalProps: T, defaultProps: Record<string, any>): T {
  return useMemo(() => {
    // eslint-disable-next-line
    const props = Object.assign({}, originalProps);
    Object.keys(defaultProps).forEach((key) => {
      if (!Reflect.has(props, key)) {
        props[key] = defaultProps[key];
      }
    });
    return props;
  }, [originalProps, defaultProps]);
}

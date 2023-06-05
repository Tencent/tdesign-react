import { useMemo } from 'react';

// defaultProps 将于 18.3.0 废弃，故需实现 hook 在组件内部兼容
// https://github.com/facebook/react/pull/16210
export default function useDefaultProps<T>(originalProps: T, defaultProps: Record<PropertyKey, any>): T {
  return useMemo<T>(() => {
    // eslint-disable-next-line
    const props = Object.assign({}, originalProps);
    Object.keys(defaultProps).forEach((key) => {
      // https://github.com/facebook/react/blob/main/packages/react/src/ReactElement.js#L328-L330
      if (props[key] === undefined) {
        props[key] = defaultProps[key];
      }
    });
    return props;
  }, [originalProps, defaultProps]);
}

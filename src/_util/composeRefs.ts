import { Ref } from 'react';

// 同时处理多个 ref
export default function composeRefs<T>(...refs: Ref<T>[]) {
  return (instance: T) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const ref of refs) {
      // 兼容 useImperativeHandle 屏蔽获取当前 dom 场景
      if (instance && (instance as any).currentElement && typeof ref === 'function') {
        ref((instance as any).currentElement);
      } else if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        (ref as any).current = instance;
      }
    }
  };
}

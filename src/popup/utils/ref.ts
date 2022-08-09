import { isMemo } from 'react-is';

// 合并 refs
export function composeRef<T>(...refs: React.Ref<T>[]): React.Ref<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(node);
      } else if (typeof ref === 'object' && ref && 'current' in ref) {
        if (node && 'currentElement' in node) {
          // eslint-disable-next-line
          (ref as any).current = node['currentElement'];
        } else {
          // eslint-disable-next-line
          (ref as any).current = node;
        }
      }
    });
  };
}

// 判断是否支持 ref 透传
export function supportRef(nodeOrComponent: any): boolean {
  const type = isMemo(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;

  // Function component node
  if (typeof type === 'function' && !type.prototype?.render) {
    return false;
  }

  // Class component
  if (typeof nodeOrComponent === 'function' && !nodeOrComponent.prototype?.render) {
    return false;
  }

  return true;
}

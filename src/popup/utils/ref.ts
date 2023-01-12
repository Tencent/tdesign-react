import { isMemo } from 'react-is';

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

// 获取 ref 中的 dom 元素
export function getRefDom(domRef: React.RefObject<any>) {
  if (domRef.current && typeof domRef.current === 'object' && 'currentElement' in domRef.current) {
    return domRef.current.currentElement;
  }
  return domRef.current;
}

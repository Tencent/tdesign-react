// Source from:
// https://github.com/react-component/util/blob/master/src/ref.ts

import { isValidElement } from 'react';
import { ForwardRef, isMemo } from 'react-is';
import isFragment from './isFragment';

// 判断是否支持 ref 透传
export const supportRef = (nodeOrComponent: any): boolean => {
  if (!nodeOrComponent) {
    return false;
  }

  // React 19 no need `forwardRef` anymore. So just pass if is a React element.
  // eslint-disable-next-line no-prototype-builtins
  if (isReactElement(nodeOrComponent) && (nodeOrComponent as any).props.propertyIsEnumerable('ref')) {
    return true;
  }

  const type = isMemo(nodeOrComponent) ? nodeOrComponent.type.type : nodeOrComponent.type;

  // Function component node
  if (typeof type === 'function' && !type.prototype?.render && type.$$typeof !== ForwardRef) {
    return false;
  }

  // Class component
  if (
    typeof nodeOrComponent === 'function' &&
    !nodeOrComponent.prototype?.render &&
    nodeOrComponent.$$typeof !== ForwardRef
  ) {
    return false;
  }
  return true;
};

// 获取 ref 中的 dom 元素
export function getRefDom(domRef: React.RefObject<any>) {
  if (domRef.current && typeof domRef.current === 'object' && 'currentElement' in domRef.current) {
    return domRef.current.currentElement;
  }
  return domRef.current;
}

interface RefAttributes<T> extends React.Attributes {
  ref: React.Ref<T>;
}

function isReactElement(node: React.ReactNode) {
  return isValidElement(node) && !isFragment(node);
}

export const supportNodeRef = <T = any>(node: React.ReactNode): node is React.ReactElement & RefAttributes<T> =>
  isReactElement(node) && supportRef(node);

/**
 * In React 19. `ref` is not a property from node.
 * But a property from `props.ref`.
 * To check if `props.ref` exist or fallback to `ref`.
 */
export const getNodeRef: <T = any>(node: React.ReactNode) => React.Ref<T> | null = (node) => {
  if (node && isReactElement(node)) {
    const ele = node as any;

    // Source from:
    // https://github.com/mui/material-ui/blob/master/packages/mui-utils/src/getReactNodeRef/getReactNodeRef.ts
    // eslint-disable-next-line no-prototype-builtins
    return ele.props.propertyIsEnumerable('ref') ? ele.props.ref : ele.ref;
  }
  return null;
};

export function composeRefs<T>(...refs: React.Ref<T>[]) {
  return (instance: T) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        (ref as any).current = instance;
      }
    }
  };
}


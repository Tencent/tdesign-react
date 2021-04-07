import React, { useEffect, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AttachNode } from '../_type/common';

export interface PortalProps {
  // 子元素
  children: ReactNode;

  // 自定义 container 的方法
  getContainer: AttachNode;
}

// 将 children 渲染到正常的 DOM 树外面
const Portal = (props: PortalProps) => {
  const { children, getContainer } = props;

  // 缓存 getContainer
  const ref = useRef(getContainer);
  useEffect(() => {
    ref.current = getContainer;
  }, [getContainer]);

  const [container] = React.useState(() => {
    const el = document.createElement('div');
    return el;
  });

  useEffect(() => {
    let parentElement = document.body;
    let el = null;

    // 处理 getContainer
    if (ref.current && typeof ref.current === 'function') {
      el = ref.current();
    } else if (ref.current && typeof ref.current === 'string') {
      el = document.querySelector(ref.current);
    }

    if (el instanceof HTMLElement) {
      parentElement = el;
    }

    parentElement.appendChild(container);
    return () => {
      parentElement.removeChild(container);
    };
  }, [container, ref]);

  return createPortal(children, container);
};

export default Portal;

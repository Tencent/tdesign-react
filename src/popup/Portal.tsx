import React, { useEffect, ReactNode, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { AttachNode } from '../common';

export interface PortalProps {
  // 子元素
  children: ReactNode;

  // 自定义 container 的方法
  attach: AttachNode;
}

// 将 children 渲染到正常的 DOM 树外面
const Portal = (props: PortalProps): React.ReactPortal => {
  const { children, attach } = props;

  const container = useMemo(() => {
    const el = document.createElement('div');
    return el;
  }, []);

  useEffect(() => {
    let parentElement = document.body;
    let el = null;

    // 处理 getContainer
    if (typeof attach === 'function') {
      el = attach();
    } else if (typeof attach === 'string') {
      el = document.querySelector(attach);
    }

    if (el instanceof HTMLElement) {
      parentElement = el;
    }

    parentElement.appendChild(container);
    return () => {
      parentElement.removeChild(container);
    };
  }, [container, attach]);

  return createPortal(children, container);
};

export default Portal;

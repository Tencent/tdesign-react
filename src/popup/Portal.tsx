import React, { FunctionComponent, useEffect, ReactNode, useRef } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  // 子元素
  children: ReactNode;

  // 前缀
  classPrefix: string;

  // 自定义 container 的方法
  getContainer: () => HTMLDivElement;
}

// 将 children 渲染到正常的 DOM 树外面
const Portal: FunctionComponent<PortalProps> = (props) => {
  const { children, classPrefix, getContainer } = props;

  // 缓存 getContainer
  const ref = useRef(getContainer);
  useEffect(() => {
    ref.current = getContainer;
  }, [getContainer]);

  const [container] = React.useState(() => {
    const el = document.createElement('div');
    el.classList.add(`${classPrefix}-popup-container`);
    return el;
  });

  useEffect(() => {
    let parentElement = document.body;

    // 处理 getContainer
    if (ref.current && typeof ref.current === 'function') {
      const el = ref.current();

      if (el instanceof HTMLElement) {
        parentElement = el;
      }
    }

    parentElement.appendChild(container);
    return () => {
      parentElement.removeChild(container);
    };
  }, [container, ref]);

  return createPortal(children, container);
};

export default Portal;

import { useRef, useEffect, MutableRefObject } from 'react';

type StyleVariables = Record<string, string>;

// 用于动态管理组件作用域样式
export const useDynamicStyle = (elementRef: MutableRefObject<HTMLElement | null>, cssVariables: StyleVariables) => {
  const styleId = useRef(`dynamic-styles-${Math.random().toString(36).slice(2, 11)}`);

  // 生成带作用域的CSS样式
  const generateScopedStyles = (vars: StyleVariables) => {
    const variables = Object.entries(vars)
      .map(([key, value]) => `${key}: ${value};`)
      .join('\n');

    return `
      .${styleId.current} {
        ${variables}
      }
    `;
  };

  useEffect(() => {
    if (!elementRef?.current) return;
    const styleElement = document.createElement('style');
    styleElement.innerHTML = generateScopedStyles(cssVariables);
    document.head.appendChild(styleElement);

    // 绑定样式类到目标元素
    const currentElement = elementRef.current;
    if (currentElement) {
      currentElement.classList.add(styleId.current);
    }

    return () => {
      document.head.removeChild(styleElement);
      if (currentElement) {
        currentElement.classList.remove(styleId.current);
      }
    };
  }, [cssVariables]);
};

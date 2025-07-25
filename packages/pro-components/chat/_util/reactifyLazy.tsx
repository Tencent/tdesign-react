import React, { forwardRef, useState, useEffect } from 'react';
import reactify from './reactify';

type AnyProps = Record<string, any>;

// 组件注册表
const componentRegistry = new Map<string, Promise<void>>();

/**
 * 注册Web组件
 * @param tagName 组件标签名
 * @param importPath 导入路径
 */
export function registerWebComponent(tagName: string, importPath: string): Promise<void> {
  if (!componentRegistry.has(tagName)) {
    componentRegistry.set(
      tagName,
      import(importPath)
        .then((module) => {
          if (module.default && typeof module.default === 'function') {
            module.default(); // 调用注册函数
          }
        })
        .catch((error) => {
          console.error(`Failed to load component ${tagName}:`, error);
          throw error;
        }),
    );
  }
  return componentRegistry.get(tagName)!;
}

/**
 * 将Web组件转换为React组件（带懒加载）
 * @param tagName 组件的自定义元素标签名
 * @param importPath 导入Web组件注册模块的路径
 * @param fallback 加载过程中显示的React节点
 */
export const reactifyLazy = <T extends AnyProps = AnyProps>(
  tagName: string,
  importPath: string,
  fallback?: React.ReactNode,
) => {
  // 使用reactify创建基础React组件
  const ReactComponent = reactify<T>(tagName);

  return forwardRef<HTMLElement, T>((props, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
      let isMounted = true;

      registerWebComponent(tagName, importPath)
        .then(() => {
          if (isMounted) setIsLoaded(true);
        })
        .catch((err) => {
          if (isMounted) setError(err);
        });

      return () => {
        isMounted = false;
      };
    }, [tagName, importPath]);

    // 错误处理
    if (error) {
      console.error(`Failed to load component ${tagName}`, error);
      return fallback;
    }

    // 加载状态
    if (!isLoaded) {
      return fallback;
    }

    // 渲染组件
    return <ReactComponent {...props} ref={ref} />;
  });
};

// import { reactifyLazy } from './_util/reactifyLazy';

// const TButton = reactifyLazy<{
//   size: 'small' | 'medium' | 'large',
//   variant: 'primary' | 'secondary' | 'outline'
// }>(
//   't-button',
//   'tdesign-web-components/esm/button',
//   <div className="flex items-center justify-center p-4">
//     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//     <span className="ml-3 text-gray-600">Loading button...</span>
//   </div>
// );

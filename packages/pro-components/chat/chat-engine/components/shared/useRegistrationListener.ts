import { useState, useEffect, useMemo } from 'react';

interface UseRegistrationListenerOptions<TProps> {
  /** 组件唯一标识 */
  componentKey: string;
  /** 监听的事件名称 */
  eventName: string;
  /** 事件 detail 中的键名 */
  eventDetailKey: string;
  /** 获取渲染函数的方法 */
  getRenderFunction: (key: string) => React.MemoExoticComponent<React.ComponentType<TProps>> | null;
}

interface UseRegistrationListenerResult<TProps> {
  /** 是否已注册 */
  isRegistered: boolean;
  /** 缓存的 Memo 组件 */
  MemoizedComponent: React.MemoExoticComponent<React.ComponentType<TProps>> | null;
}

/**
 * 动态注册监听 Hook
 * 统一处理 Activity 和 Toolcall 的动态注册逻辑
 */
export function useRegistrationListener<TProps>(
  options: UseRegistrationListenerOptions<TProps>,
): UseRegistrationListenerResult<TProps> {
  const { componentKey, eventName, eventDetailKey, getRenderFunction } = options;

  // 注册状态
  const [isRegistered, setIsRegistered] = useState(() => !!getRenderFunction(componentKey));

  // 监听组件注册事件，支持动态注册
  useEffect(() => {
    if (!isRegistered) {
      const handleRegistered = (event: CustomEvent) => {
        // 精确匹配
        if (event.detail?.[eventDetailKey] === componentKey) {
          setIsRegistered(true);
        }
      };

      window.addEventListener(eventName, handleRegistered as EventListener);

      return () => {
        window.removeEventListener(eventName, handleRegistered as EventListener);
      };
    }
  }, [componentKey, eventName, eventDetailKey, isRegistered]);

  // 使用 registry 的缓存渲染函数
  const MemoizedComponent = useMemo(
    () => getRenderFunction(componentKey),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [componentKey, isRegistered],
  );

  return { isRegistered, MemoizedComponent };
}

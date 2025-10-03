import React, { createContext, useContext, useEffect, useState } from 'react';
import { useInternalConfig } from './useConfig';

const Z_INDEX_MAP = {
  'back-top': 300,
  affix: 500,
  drawer: 1500,
  dialog: 2500,
  'image-viewer': 3000,
  loading: 3500,
  message: 5000,
  popup: 5500,
  tooltip: 5600,
  notification: 6000,
  guide: 999999,
};

interface ZIndexContextType {
  name: keyof typeof Z_INDEX_MAP;
  zIndex: number | undefined;
  setZIndex: (zIndex: number) => void;
  setIsMounted: (mounted: boolean) => void;
}

const ZIndexContext = createContext<ZIndexContextType>(undefined);

const ZIndexProvider = ({ children, name }) => {
  const { globalZIndex, setGlobalZIndex } = useInternalConfig();

  const parentContext = useContext(ZIndexContext);

  const [isMounted, setIsMounted] = useState(false);
  const [zIndex, setZIndex] = useState<number | undefined>();

  // @ts-ignore
  const hasCustomZIndex = React.isValidElement(children) && typeof children.props.zIndex === 'number';
  // @ts-ignore
  const customZIndex = hasCustomZIndex ? children.props.zIndex : undefined;

  const updateGlobalZIndex = (zIndex: number) => {
    if (!setGlobalZIndex) return;
    const newZIndex = Math.max(zIndex, globalZIndex);
    setGlobalZIndex(globalZIndex === 0 ? newZIndex : newZIndex + 1);
    if (newZIndex === Z_INDEX_MAP[name]) return; // 交给原始的 CSS 处理
    setZIndex(newZIndex);
  };

  useEffect(() => {
    if (!isMounted) return;

    // 如果有自定义 z-index，直接使用
    if (hasCustomZIndex) {
      updateGlobalZIndex(customZIndex);
      return;
    }

    // 没有父级 context，说明是顶层组件
    if (!parentContext) {
      updateGlobalZIndex(Z_INDEX_MAP[name]);
      return;
    }

    const parentZIndex = parentContext?.zIndex;
    if (!parentZIndex) {
      // 第一个子组件
      const parentPreset = Z_INDEX_MAP[parentContext.name];
      const preset = Z_INDEX_MAP[name];
      updateGlobalZIndex(preset > parentPreset ? preset : parentPreset);
    } else {
      updateGlobalZIndex(parentZIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, isMounted]);

  return <ZIndexContext.Provider value={{ name, zIndex, setZIndex, setIsMounted }}>{children}</ZIndexContext.Provider>;
};

export const withZIndexProvider = <T extends React.ComponentType<any>>(
  Component: T,
  name: keyof typeof Z_INDEX_MAP,
): T => {
  const WrappedComponent = React.forwardRef<React.ComponentRef<T>, React.ComponentProps<T>>((props, ref) => (
    <ZIndexProvider name={name}>
      {/* @ts-ignore */}
      <Component ref={ref} {...props} />
    </ZIndexProvider>
  ));

  WrappedComponent.displayName = Component.displayName;
  // 确保返回的组件类型与原组件一致
  return WrappedComponent as unknown as T;
};

const useZIndex = (name: keyof typeof Z_INDEX_MAP, mounted: boolean) => {
  const { autoZIndex, setGlobalZIndex } = useInternalConfig();
  const context = useContext(ZIndexContext);

  if (!context) throw new Error('useZIndex must be used within a ZIndexProvider');

  useEffect(() => {
    // 只处理 attach 为 body 的情况 (?)
    context?.setIsMounted(mounted);
  }, [context, mounted]);

  if (!mounted || !autoZIndex || !setGlobalZIndex) {
    return {
      displayZIndex: undefined,
      latestZIndex: Z_INDEX_MAP[name],
    };
  }

  return {
    displayZIndex: context.zIndex,
    latestZIndex: context.zIndex ?? Z_INDEX_MAP[name],
  };
};

export default useZIndex;

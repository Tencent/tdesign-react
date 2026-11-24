import React, { forwardRef, memo, useMemo, useRef, useCallback } from 'react';
import classNames from 'classnames';
import useDefault from '../_util/useDefault';
import type { StyledProps } from '../common';
import type { TdTabBarProps } from './type';
import { TabBarProvider } from './TabBarContext';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import { tabBarDefaultProps } from './defaultProps';
import useElementHeight from '../hooks/useElementHeight';

export interface TabBarProps extends TdTabBarProps, StyledProps {}

const TabBar = forwardRef<HTMLDivElement, TabBarProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, tabBarDefaultProps);
  const {
    className,
    style,
    bordered,
    fixed,
    onChange,
    value,
    defaultValue,
    safeAreaInsetBottom,
    shape,
    split,
    theme,
    zIndex,
    placeholder,
    children,
  } = props;

  const tabBarClass = usePrefixClass('tab-bar');
  const tabBarClasses = classNames(
    tabBarClass,
    className,
    {
      [`${tabBarClass}--bordered`]: bordered,
      [`${tabBarClass}--fixed`]: fixed,
      [`${tabBarClass}--safe`]: safeAreaInsetBottom,
    },
    `${tabBarClass}--${props.shape}`,
  );

  const styles = useMemo<React.CSSProperties>(
    () => ({
      zIndex,
      ...style,
    }),
    [style, zIndex],
  );

  const internalRef = useRef<HTMLDivElement>(null);
  const { height: tabBarHeight } = useElementHeight(internalRef, {
    immediate: fixed && placeholder,
  });

  // 创建合并的 ref callback，保持用户 ref 指向 role="tablist" 元素
  const mergedRef = useCallback(
    (element: HTMLDivElement | null) => {
      internalRef.current = element;

      const userRef = ref;
      if (typeof userRef === 'function') {
        userRef(element);
      } else if (userRef && 'current' in userRef) {
        userRef.current = element;
      }
    },
    [ref],
  );

  const [activeValue, setActiveValue] = useDefault(value, defaultValue, undefined);

  const defaultIndex = useRef(-1);

  const updateChild = useCallback(
    (currentValue: number | string | (number | string)[]) => {
      setActiveValue(currentValue);
      onChange?.({ value: currentValue as string | number });
    },
    [setActiveValue, onChange],
  );

  const itemCount = React.Children.count(parseTNode(children));

  const memoProviderValues = useMemo(
    () => ({
      defaultIndex,
      activeValue,
      updateChild,
      shape,
      split,
      theme,
      itemCount,
    }),
    [defaultIndex, activeValue, updateChild, shape, split, theme, itemCount],
  );

  const tabBarElement = (
    <div className={tabBarClasses} style={styles} ref={mergedRef} role="tablist">
      <TabBarProvider value={memoProviderValues}>{parseTNode(children)}</TabBarProvider>
    </div>
  );

  if (fixed && placeholder) {
    return (
      <div className={`${tabBarClass}__placeholder`} style={{ height: `${tabBarHeight}px` }}>
        {tabBarElement}
      </div>
    );
  }

  return tabBarElement;
});

export default memo(TabBar);

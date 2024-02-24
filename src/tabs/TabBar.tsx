import React, { useEffect, useState, CSSProperties, useRef } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';
import useMutationObserver from '../_util/useMutationObserver';

interface TabBarProps {
  tabPosition: string;
  activeId: string | number;
  containerRef: React.MutableRefObject<HTMLDivElement>;
}

const TabBar: React.FC<TabBarProps> = (props) => {
  const { tabPosition, activeId, containerRef } = props;
  const { classPrefix } = useConfig();
  const [barStyle, setBarStyle] = useState<CSSProperties>({});
  const tabsClassPrefix = `${classPrefix}-tabs`;
  const currentActiveIdRef = useRef(activeId);
  useEffect(() => {
    currentActiveIdRef.current = activeId;
  }, [activeId]);

  const computeStyle = React.useCallback(() => {
    const isHorizontal = ['bottom', 'top'].includes(tabPosition);
    const transformPosition = isHorizontal ? 'translateX' : 'translateY';
    const itemProp = isHorizontal ? 'width' : 'height';
    const barBorderProp = isHorizontal ? 'width' : 'height';

    let offset = 0;

    if (containerRef.current) {
      const itemsRef = containerRef.current?.querySelectorAll<HTMLElement>(`.${tabsClassPrefix}__nav-item`);
      if (itemsRef.length - 1 >= (currentActiveIdRef.current as number)) {
        itemsRef.forEach((item, itemIndex) => {
          if (itemIndex < (currentActiveIdRef.current as number)) {
            offset += Number(getComputedStyle(item)[itemProp].replace('px', ''));
          }
        });
        const computedItem = itemsRef[currentActiveIdRef.current];
        if (!computedItem) {
          setBarStyle({ transform: `${transformPosition}(${0}px)`, [barBorderProp]: 0 });
          return;
        }
        const itemPropValue = getComputedStyle(computedItem)[itemProp];
        setBarStyle({ transform: `${transformPosition}(${offset}px)`, [barBorderProp]: itemPropValue || 0 });
      }
    }
  }, [currentActiveIdRef, containerRef, tabPosition, tabsClassPrefix]);

  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => computeStyle());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabPosition, activeId, containerRef.current]);

  const handleMutationObserver = React.useCallback(
    (mutations: MutationRecord[]) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'characterData') {
          computeStyle();
        }
      });
    },
    [computeStyle],
  );

  useMutationObserver(containerRef.current, handleMutationObserver);

  return (
    <div
      className={classNames({
        [`${tabsClassPrefix}__bar`]: true,
        [`${classPrefix}-is-${tabPosition}`]: true,
      })}
      style={barStyle}
    ></div>
  );
};

TabBar.displayName = 'TabBar';

export default TabBar;

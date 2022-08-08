import React, { useEffect, useState, CSSProperties } from 'react';
import classNames from 'classnames';
import useConfig from '../hooks/useConfig';

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

  const computeStyle = () => {
    const isHorizontal = ['bottom', 'top'].includes(tabPosition);
    const transformPosition = isHorizontal ? 'translateX' : 'translateY';
    const itemProp = isHorizontal ? 'width' : 'height';
    const barBorderProp = isHorizontal ? 'width' : 'height';

    let offset = 0;

    if (containerRef.current) {
      const itemsRef = containerRef.current.querySelectorAll?.('.t-tabs__nav-item');

      if (itemsRef.length - 1 >= activeId) {
        itemsRef.forEach((item, itemIndex) => {
          if (itemIndex < activeId) {
            offset += Number(getComputedStyle(item)[itemProp].replace('px', ''));
          }
        });
        const computedItem = itemsRef[activeId];
        if (!computedItem) {
          setBarStyle({
            transform: `${transformPosition}(${0}px)`,
            [barBorderProp]: 0,
          });
          return;
        }
        const itemPropValue = getComputedStyle(computedItem)[itemProp];
        setBarStyle({
          transform: `${transformPosition}(${offset}px)`,
          [barBorderProp]: itemPropValue,
        });
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => computeStyle());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tabPosition, activeId, containerRef.current]);

  return (
    <div
      className={classNames({
        [`${tabsClassPrefix}__bar`]: true,
        [`t-is-${tabPosition}`]: true,
      })}
      style={barStyle}
    ></div>
  );
};

TabBar.displayName = 'TabBar';

export default TabBar;

import cx from 'classnames';
import React, { cloneElement, ReactNode, useMemo, useRef } from 'react';
import { StarFilledIcon } from 'tdesign-icons-react';
import { usePrefixClass } from '../hooks/useClass';
import { TdRateProps } from './type';

type Props = Required<Pick<TdRateProps, 'icon' | 'color'>> & {
  size: number;
  isCurrent: boolean;
  isSelected: boolean;
  isHalf: boolean;
  onClick?: (placement: 'left' | 'right', e: React.MouseEvent<HTMLDivElement>) => void;
};

export const RateIcon = (props: Props) => {
  const iconClass = usePrefixClass('rate__icon');

  const { size, icon, color, isCurrent, isSelected, isHalf, onClick } = props;

  const iconList: ReactNode[] = useMemo(() => {
    const arr: ReactNode[] = [];
    arr[0] = (typeof icon?.[0] === 'function' ? icon[0]() : icon?.[0]) || <StarFilledIcon />;
    arr[1] = (typeof icon?.[1] === 'function' ? icon[1]() : icon?.[1]) || <StarFilledIcon />;

    // 防止传入的 element 上有 key
    return arr.map((item) => {
      if (React.isValidElement(item)) {
        return cloneElement(item, { key: null });
      }
      return item;
    });
  }, [icon]);

  const style = useMemo(() => {
    const style: React.CSSProperties = {
      fontSize: `${size}px`,
    };

    const selectedColor = Array.isArray(color) ? color[0] : color;
    if (selectedColor) {
      style['--td-rate-selected-color'] = selectedColor;
    }

    const unSelectedColor = Array.isArray(color) ? color[1] : '';
    if (unSelectedColor) {
      style['--td-rate-unselected-color'] = unSelectedColor;
    }

    return style;
  }, [color, size]);

  const iconNode = <>{isSelected ? iconList[0] : iconList[1]}</>;

  const ref = useRef<HTMLDivElement | null>(null);
  return (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation(); // 阻止事件冒泡，防止触发 RateTips 的 clickoutside
        const dom = ref.current;
        if (!dom) {
          return;
        }
        const rect = dom.getBoundingClientRect();
        const isLeft = e.clientX < rect.x + rect.width / 2;
        onClick?.(isLeft ? 'left' : 'right', e);
      }}
      style={style}
      className={cx(iconClass, {
        [`${iconClass}--current`]: isCurrent,
        [`${iconClass}--selected`]: isSelected && !isHalf,
        [`${iconClass}--unselected`]: !isSelected || isHalf,
      })}
    >
      {isHalf && (
        <div
          className={cx(`${iconClass}-left`, {
            [`${iconClass}-left--selected`]: isSelected,
            [`${iconClass}-left--unselected`]: !isSelected,
          })}
        >
          {iconNode}
        </div>
      )}

      {iconNode}
    </div>
  );
};

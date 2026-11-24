import { useClickAway } from 'ahooks';
import cx from 'classnames';
import React, { ReactNode, useRef } from 'react';
import { usePrefixClass } from '../hooks/useClass';
import { TdRateProps } from './type';

type Props = {
  left: number;
  placement: TdRateProps['placement'];
  onClickOutside: () => void;
  data: {
    icon: ReactNode;
    text: ReactNode;
    actived?: boolean;
    onClick?: (index: number) => void;
  }[];
};

export const RateTips = (props: Props) => {
  const tipClass = usePrefixClass('rate__tips');

  const { left, data, placement, onClickOutside } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  useClickAway(onClickOutside, ref);
  return (
    <div
      ref={ref}
      className={cx(tipClass, {
        [`${tipClass}--${placement}`]: placement,
      })}
      style={{ left: `${left}px` }}
    >
      <div style={{ display: 'flex' }}>
        {data?.map((item, index) => (
          <div
            key={index}
            className={cx(`${tipClass}-item`, {
              [`${tipClass}-item--active`]: !!item.actived,
            })}
            onClick={() => item.onClick?.(index)}
          >
            {item.icon}
            <span className={`${tipClass}-text`}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

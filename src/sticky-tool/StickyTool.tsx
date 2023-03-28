import React, { useCallback, useMemo, MouseEvent } from 'react';
import classnames from 'classnames';
import useConfig from '../hooks/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import type { TdStickyToolProps, TdStickyItemProps } from './type';
import type { StyledProps, Styles } from '../common';
import StickyItem from './StickyItem';
import { stickyToolDefaultProps } from './defaultProps';

export interface StickyToolProps extends TdStickyToolProps, StyledProps {
  children?: React.ReactNode;
}

const StickyTool = forwardRefWithStatics(
  (props: StickyToolProps, ref: React.Ref<HTMLDivElement>) => {
    const { style, className, children, width, type, shape, placement, offset, popupProps, list, onClick, onHover } =
      props;
    const { classPrefix } = useConfig();

    const styles = useMemo(() => {
      const position: Array<string | number> = offset ? [80, 24] : ['80px', '24px'];
      offset?.forEach((item, index) => {
        position[index] = isNaN(Number(item))
          ? `calc( ${position[index]}px + ${item})`
          : `${(position[index] as number) + (item as number)}px`;
      });
      const styles: Styles = { ...style };
      placement.split('-').forEach((item, index) => {
        if (item !== 'center') {
          styles[item] = position[index];
        } else {
          styles.top = '50%';
          styles.transform = 'translate(0, -50%)';
        }
      });
      if (width) styles.width = typeof width === 'number' ? `${width}px` : width;
      return styles;
    }, [offset, placement, width, style]);

    const handleClick = useCallback(
      (context: { e: MouseEvent<HTMLDivElement>; item: TdStickyItemProps }) => {
        onClick?.(context);
      },
      [onClick],
    );
    const handleHover = useCallback(
      (context: { e: MouseEvent<HTMLDivElement>; item: TdStickyItemProps }) => {
        onHover?.(context);
      },
      [onHover],
    );

    const stickyItemList = useMemo(() => {
      if (list?.length) {
        return list.map((item, index: number) => {
          const itemProps = {
            ...item,
            type,
            shape,
            placement,
            basePopupProps: popupProps,
            baseWidth: styles.width,
            onClick: handleClick,
            onHover: handleHover,
          };
          return <StickyItem key={index} {...itemProps} />;
        });
      }

      const childrenList = React.Children.toArray(children);

      return childrenList.map((child: JSX.Element) => {
        const itemProps = {
          ...child.props,
          type,
          shape,
          placement,
          basePopupProps: popupProps,
          baseWidth: styles.width,
          onClick: handleClick,
          onHover: handleHover,
        };
        return React.cloneElement(child, { ...itemProps });
      });
    }, [list, children, type, shape, placement, popupProps, styles, handleClick, handleHover]);

    return (
      <div
        ref={ref}
        style={styles}
        className={classnames(`${classPrefix}-sticky-tool`, `${classPrefix}-sticky-tool--${shape}`, className)}
      >
        {stickyItemList}
      </div>
    );
  },
  { StickyItem },
);

StickyTool.displayName = 'StickyTool';
StickyTool.defaultProps = stickyToolDefaultProps;

export default StickyTool;

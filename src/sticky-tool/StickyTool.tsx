import React, { useCallback, useMemo } from 'react';
import classnames from 'classnames';
import useConfig from '../hooks/useConfig';
import forwardRefWithStatics from '../_util/forwardRefWithStatics';
import { TdStickyToolProps, TdStickyItemProps } from './type';
import { StyledProps, Styles } from '../common';
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
      const styles: Styles = {};
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
    }, [offset, placement, width]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>, item: TdStickyItemProps) => {
        onClick?.({ e, item });
      },
      [onClick],
    );
    const handleHover = useCallback(
      (e: React.MouseEvent<HTMLDivElement>, item: TdStickyItemProps) => {
        onHover?.({ e, item });
      },
      [onHover],
    );

    const stickyItemList = useMemo(() => {
      if (list) {
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
        style={style}
        className={classnames(
          `${classPrefix}-stickyTool`,
          `${classPrefix}-stickyTool--${shape}`,
          `${classPrefix}-stickyTool--${shape}--${type}`,
          `${classPrefix}-stickyTool--${placement}`,
          className,
        )}
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

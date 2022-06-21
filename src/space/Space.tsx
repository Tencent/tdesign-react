import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import { TdSpaceProps } from './type';
import { StyledProps } from '../common';
import { spaceDefaultProps } from './defaultProps';

export interface SpaceProps extends TdSpaceProps, StyledProps {
  children?: React.ReactElement;
}

const Space = forwardRef((props: SpaceProps, ref: React.Ref<HTMLDivElement>) => {
  const { className, style, align, direction, size, breakLine, separator, children } = props;
  const { classPrefix } = useConfig();

  const renderStyle = useMemo(() => {
    const sizeMap = { small: '8px', medium: '16px', large: '24px' };

    let renderGap = '';
    if (Array.isArray(size)) {
      renderGap = size
        .map((s) => {
          if (typeof s === 'number') return `${s}px`;
          if (typeof s === 'string') return sizeMap[s] || s;
          return s;
        })
        .join(' ');
    } else if (typeof size === 'string') {
      renderGap = sizeMap[size] || size;
    } else if (typeof size === 'number') {
      renderGap = `${size}px`;
    }

    return {
      gap: renderGap,
      ...(breakLine ? { 'flex-wrap': 'wrap' } : {}),
      ...style,
    };
  }, [style, size, breakLine]);

  function renderChildren() {
    const childCount = React.Children.count(children);
    return React.Children.map(children, (child, index) => {
      // filter last child
      const showSeparator = index + 1 !== childCount && separator;
      return (
        <>
          <div className={`${classPrefix}-space-item`}>{child}</div>
          {showSeparator && <div className={`${classPrefix}-space-item-separator`}>{separator}</div>}
        </>
      );
    });
  }

  return (
    <div
      ref={ref}
      style={renderStyle}
      className={classNames(`${classPrefix}-space`, className, {
        [`${classPrefix}-space-align-${align}`]: align,
        [`${classPrefix}-space-${direction}`]: direction,
      })}
    >
      {renderChildren()}
    </div>
  );
});

Space.displayName = 'Space';
Space.defaultProps = spaceDefaultProps;

export default Space;

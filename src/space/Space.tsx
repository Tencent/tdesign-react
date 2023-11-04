import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import { isFragment } from 'react-is';
import useConfig from '../hooks/useConfig';
import { TdSpaceProps } from './type';
import { StyledProps } from '../common';
import { spaceDefaultProps } from './defaultProps';
import { getFlexGapPolyFill } from '../_common/js/utils/helper';

export const SizeMap = { small: '8px', medium: '16px', large: '24px' };
const defaultNeedPolyfill = getFlexGapPolyFill();

export interface SpaceProps extends TdSpaceProps, StyledProps {
  children?: React.ReactNode;
  /** 强制使用 margin 间距代替 gap 属性间距（某些浏览器不支持 gap 属性） */
  forceFlexGapPolyfill?: boolean;
}

const toArray = (children: React.ReactNode): React.ReactElement[] => {
  let ret: React.ReactElement[] = [];

  React.Children.forEach(children, (child: any) => {
    if (child === undefined || child === null) {
      return;
    }

    if (Array.isArray(child)) {
      ret = ret.concat(toArray(child));
    } else if (isFragment(child) && child.props) {
      ret = ret.concat(toArray(child.props.children));
    } else {
      ret.push(child);
    }
  });

  return ret;
};

const Space = forwardRef((props: SpaceProps, ref: React.Ref<HTMLDivElement>) => {
  const { className, style, align, direction = 'horizontal', size, breakLine, separator } = props;
  const { classPrefix } = useConfig();

  const needPolyfill = props.forceFlexGapPolyfill || defaultNeedPolyfill;

  const renderStyle = useMemo(() => {
    let renderGap = '';
    if (Array.isArray(size)) {
      renderGap = size
        .map((s) => {
          if (typeof s === 'number') return `${s}px`;
          if (typeof s === 'string') return SizeMap[s] || s;
          return s;
        })
        .join(' ');
    } else if (typeof size === 'string') {
      renderGap = SizeMap[size] || size;
    } else if (typeof size === 'number') {
      renderGap = `${size}px`;
    }

    const fullStyle: { [key: string]: string | number } = { ...style };
    if (needPolyfill) {
      const [columnGap, rowGap] = renderGap.split(' ');
      fullStyle['--column-gap'] = columnGap;
      fullStyle['--row-gap'] = rowGap || columnGap;
    } else {
      fullStyle.gap = renderGap;
    }
    return fullStyle;
  }, [style, size, needPolyfill]) as React.CSSProperties;

  function renderChildren() {
    const children = toArray(props.children);
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
        [`${classPrefix}-space--break-line`]: breakLine,
        [`${classPrefix}-space--polyfill`]: needPolyfill,
      })}
    >
      {renderChildren()}
    </div>
  );
});

Space.displayName = 'Space';
Space.defaultProps = spaceDefaultProps;

export default Space;

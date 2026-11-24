import React, { useState, useMemo, useCallback, ReactNode, CSSProperties } from 'react';
import useConfig from '../hooks/useConfig';
import parseTNode from '../_util/parseTNode';

import type { TypographyEllipsis } from './type';

export interface EllipsisProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  ellipsis?: boolean | TypographyEllipsis;
  renderCopy?: () => ReactNode;
}

const Ellipsis: React.FC<EllipsisProps> = (props) => {
  const { className, style, children, ellipsis, renderCopy } = props;
  const { classPrefix } = useConfig();
  const prefixCls = `${classPrefix}-typography`;

  const [isExpand, setIsExpand] = useState(false);

  const ellipsisState = useMemo((): TypographyEllipsis => {
    const defaults: TypographyEllipsis = { row: 1, expandable: false, collapsible: true };
    if (typeof ellipsis === 'object') {
      return { ...defaults, ...ellipsis };
    }
    return defaults;
  }, [ellipsis]);

  const ellipsisStyles = useMemo((): CSSProperties => {
    if (!ellipsis) return {};

    const base: CSSProperties = {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'normal',
      display: '-webkit-box',
      WebkitLineClamp: ellipsisState.row,
      WebkitBoxOrient: 'vertical',
    };

    if (isExpand) {
      base.overflow = 'visible';
      base.whiteSpace = 'normal';
      base.display = 'initial';
    }

    return base;
  }, [ellipsis, ellipsisState.row, isExpand]);

  const handleExpand = useCallback(() => {
    setIsExpand(true);
    if (typeof ellipsis === 'object') {
      ellipsis.onExpand?.(true);
    }
  }, [ellipsis]);

  const handleCollapse = useCallback(() => {
    setIsExpand(false);
    if (typeof ellipsis === 'object') {
      ellipsis.onExpand?.(false);
    }
  }, [ellipsis]);

  const renderSuffix = useCallback(
    (expanded: boolean): ReactNode => {
      const { suffix } = ellipsisState;
      if (!suffix) return null;
      return parseTNode(suffix, { expanded });
    },
    [ellipsisState],
  );

  const renderEllipsisExpand = () => {
    const { suffix, expandable, collapsible } = ellipsisState;

    const symbolStyle: CSSProperties = {
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      flex: 'none',
      marginRight: renderCopy ? 8 : 0,
    };

    if (!isExpand && expandable) {
      return (
        <span className={`${prefixCls}-ellipsis-symbol`} onClick={handleExpand} style={symbolStyle}>
          {suffix ? renderSuffix(false) : '展开'}
        </span>
      );
    }

    if (expandable && isExpand && collapsible) {
      return (
        <span className={`${prefixCls}-ellipsis-symbol`} onClick={handleCollapse} style={symbolStyle}>
          {suffix ? renderSuffix(true) : '收起'}
        </span>
      );
    }

    return null;
  };

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        ...style,
      }}
    >
      <p style={ellipsis ? ellipsisStyles : {}}>{children}</p>
      {renderEllipsisExpand()}
      {renderCopy?.()}
    </div>
  );
};

Ellipsis.displayName = 'Ellipsis';

export default Ellipsis;

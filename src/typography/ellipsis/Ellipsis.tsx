import React, { ReactNode, useEffect, useRef, useState } from 'react';

import classNames from 'classnames';

import Truncate from './Truncate';
import useConfig from '../../hooks/useConfig';

export type TdEllipsis = {
  className?: string;
  children: ReactNode;
  lines: number;
  ellipsisClassName?: string;
  ellipsisPrefix?: ReactNode;
  onToggleExpand?: (isExpanded: boolean, e: React.MouseEvent) => void;
  width?: number;
  onTruncate?: (truncated: boolean) => void;
  component?: keyof HTMLElementTagNameMap;
  collapsible: boolean;
  expandable: boolean;
  more: ReactNode;
  less: ReactNode;
};

const Ellipsis = ({
  className,
  children,
  lines = 1,
  ellipsisClassName,
  ellipsisPrefix = '...',
  onToggleExpand,
  width = 0,
  onTruncate,
  component: Component = 'div',
  collapsible = false,
  expandable = false,
  more,
  less,
  ...rest
}: TdEllipsis & { children: React.ReactNode }) => {
  const { classPrefix } = useConfig();
  const symbolClassName = ellipsisClassName || `${classPrefix}-typography-ellipsis-symbol`;

  const isMountRef = useRef(false);
  useEffect(() => {
    isMountRef.current = true;
  }, []);

  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggleExpand = (e: React.MouseEvent) => {
    if (!expandable) return;

    if (isMountRef.current) {
      setIsExpanded(!isExpanded);
      onToggleExpand?.(!isExpanded, e);
    }
  };

  const truncateRef = useRef<Truncate>();
  const [isTruncated, setTruncated] = useState(false);
  const handleTruncate = (truncated) => {
    if (isMountRef.current && truncated !== isTruncated) {
      setTruncated(truncated);

      if (truncated && truncateRef.current) {
        truncateRef.current.onResize?.();
      }
      onTruncate?.(truncated);
    }
  };

  const componentProps = {
    className,
    ...rest,
  };

  return (
    // @ts-ignore
    <Component {...componentProps}>
      <Truncate
        width={width}
        lines={!isExpanded && lines}
        className={`${classPrefix}-typography-ellipsis`}
        ellipsis={
          <span className={`${classPrefix}-typography-ellipsis-symbol-wrapper`}>
            {ellipsisPrefix}
            <span className={symbolClassName} onClick={handleToggleExpand}>
              {more}
            </span>
          </span>
        }
        onTruncate={handleTruncate}
        ref={truncateRef}
        lineClassName={`${classPrefix}-typography-ellipsis-line`}
      >
        {children}
      </Truncate>
      {!isTruncated && collapsible && isExpanded && (
        <span className={classNames(symbolClassName, `${symbolClassName}--expanded`)} onClick={handleToggleExpand}>
          {less}
        </span>
      )}
    </Component>
  );
};

export default Ellipsis;

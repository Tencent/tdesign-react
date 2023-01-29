import React, { useRef, useState, MouseEvent } from 'react';
import classNames from 'classnames';

import { TNode } from '../common';
import { isNodeOverflow } from '../_util/dom';
import Tooltip, { TooltipProps } from '../tooltip';
import useDebounce from '../hooks/useDebounce';

export interface EllipsisProps {
  content?: string | TNode;
  children?: string | TNode;
  popupContent?: string | number | TNode;
  placement?: TooltipProps['placement'];
  attach?: () => HTMLElement;
  tooltipProps?: TooltipProps;
  zIndex?: number;
  overlayClassName?: string;
  classPrefix?: string;
}

/** 超出省略显示 */
export default function Ellipsis(props: EllipsisProps) {
  const { classPrefix } = props;
  const root = useRef<HTMLDivElement>();
  const [isOverflow, setIsOverflow] = useState(false);

  const ellipsisClasses = classNames([`${classPrefix}-table__ellipsis`, `${classPrefix}-text-ellipsis`]);

  const innerEllipsisClassName: TooltipProps['overlayClassName'] = [
    `${classPrefix}-table__ellipsis-content`,
    props.overlayClassName,
  ];

  // 当表格数据量大时，不希望默认渲染全量的 Popup，期望在用户 mouseenter 的时候再显示
  const onTriggerMouseenter = () => {
    if (!root.current) return;
    setIsOverflow(isNodeOverflow(root.current));
  };

  const onTriggerMouseleave = () => {
    setIsOverflow(isNodeOverflow(root.current));
  };

  // 使用 debounce 有两个原因：1. 避免 safari/firefox 等浏览器不显示省略浮层；2. 避免省略列快速滚动时，出现一堆的省略浮层
  const onMouseAround = useDebounce((e: MouseEvent<HTMLDivElement>) => {
    e.type === 'mouseleave' ? onTriggerMouseleave() : onTriggerMouseenter();
  }, 80);

  const cellNode = props.children || props.content;
  const ellipsisContent = (
    <div ref={root} className={ellipsisClasses} onMouseEnter={onMouseAround} onMouseLeave={onMouseAround}>
      {cellNode}
    </div>
  );
  let content = null;
  const { tooltipProps } = props;
  if (isOverflow) {
    const rProps = {
      content: props.popupContent || cellNode,
      destroyOnClose: true,
      zIndex: props.zIndex,
      attach: props.attach,
      placement: props.placement,
      overlayClassName: tooltipProps?.overlayClassName
        ? innerEllipsisClassName.concat(tooltipProps.overlayClassName)
        : innerEllipsisClassName,
      ...(props.tooltipProps || {}),
    };
    content = <Tooltip {...rProps}>{ellipsisContent}</Tooltip>;
  } else {
    content = ellipsisContent;
  }
  return content;
}

Ellipsis.displayName = 'Ellipsis';

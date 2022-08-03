import React, { useRef, useState, MouseEvent } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';

import { TNode } from '../common';
import { isNodeOverflow } from '../_util/dom';
import TPopup, { PopupProps } from '../popup';
import useConfig from '../hooks/useConfig';

export interface EllipsisProps {
  content?: string | TNode;
  children?: string | TNode;
  popupContent?: string | number | TNode;
  placement?: PopupProps['placement'];
  attach?: () => HTMLElement;
  popupProps?: PopupProps;
  zIndex?: number;
}

/** 超出省略显示 */
export default function Ellipsis(props: EllipsisProps) {
  const { classPrefix } = useConfig();
  const root = useRef<HTMLDivElement>();
  const [isOverflow, setIsOverflow] = useState(false);

  const ellipsisClasses = classNames([`${classPrefix}-table__ellipsis`, `${classPrefix}-text-ellipsis`]);

  // 当表格数据量大时，不希望默认渲染全量的 Popup，期望在用户 mouseenter 的时候再显示
  const onTriggerMouseenter = () => {
    if (!root.current) return;
    setIsOverflow(isNodeOverflow(root.current));
  };

  const onTriggerMouseleave = () => {
    setIsOverflow(isNodeOverflow(root.current));
  };

  // 使用 debounce 有两个原因：1. 避免 safari/firefox 等浏览器不显示省略浮层；2. 避免省略列快速滚动时，出现一堆的省略浮层
  const onMouseAround = debounce((e: MouseEvent<HTMLDivElement>) => {
    e.type === 'mouseleave' ? onTriggerMouseleave() : onTriggerMouseenter();
  }, 80);

  const cellNode = props.children || props.content;
  const ellipsisContent = (
    <div ref={root} className={ellipsisClasses} onMouseEnter={onMouseAround} onMouseLeave={onMouseAround}>
      {cellNode}
    </div>
  );
  let content = null;
  if (isOverflow) {
    const rProps = {
      content: props.popupContent || cellNode,
      destroyOnClose: true,
      zIndex: props.zIndex,
      attach: props.attach,
      placement: props.placement,
      ...(props.popupProps || {}),
    };
    content = <TPopup {...rProps}>{ellipsisContent}</TPopup>;
  } else {
    content = ellipsisContent;
  }
  return content;
}

Ellipsis.displayName = 'Ellipsis';

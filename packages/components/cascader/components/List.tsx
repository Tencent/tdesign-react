import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { TreeNode } from '../interface';
import useConfig from '../../hooks/useConfig';
import Item from './Item';
import parseTNode from '../../_util/parseTNode';
import { expendClickEffect, valueChangeEffect } from '../core/effect';
import { useListVirtualScroll } from '../../list/hooks/useListVirtualScroll';
import useEventCallback from '../../hooks/useEventCallback';
import { usePanelContext } from '../context';

interface PanelList {
  treeNodes: TreeNode[];
  isFilter: boolean;
  segment?: boolean;
  listKey?: string;
  level?: number;
}

const List = (props: PanelList) => {
  const { treeNodes, isFilter = false, segment = true, listKey: key, level = 0 } = props;
  const ctx = usePanelContext();
  const panelWrapperRef = useRef<HTMLDivElement>(null);
  const { classPrefix } = useConfig();
  const COMPONENT_NAME = `${classPrefix}-cascader`;

  const { virtualConfig, cursorStyle, listStyle, isVirtualScroll, onInnerVirtualScroll, scrollToElement } =
    useListVirtualScroll(ctx.scroll, panelWrapperRef, treeNodes);

  const onScrollIntoView = useEventCallback(() => {
    const checkedNodes = ctx.cascaderContext.treeStore.getCheckedNodes();
    let lastCheckedNodes = checkedNodes[checkedNodes.length - 1];
    let index = -1;
    if (lastCheckedNodes?.level === level) {
      index = treeNodes.findLastIndex((item) => item.value === lastCheckedNodes.value);
    } else {
      while (lastCheckedNodes) {
        if (lastCheckedNodes?.level === level) {
          // eslint-disable-next-line no-loop-func
          index = treeNodes.findIndex((item) => item.value === lastCheckedNodes.value);
          break;
        }
        lastCheckedNodes = lastCheckedNodes?.parent;
      }
    }

    if (index !== -1) {
      scrollToElement({
        index,
      });
    }
  });

  const handleExpand = (node: TreeNode, trigger: 'hover' | 'click') => {
    expendClickEffect(ctx.trigger, trigger, node, ctx.cascaderContext);
  };

  const renderItem = (node: TreeNode, index: number) => (
    <Item
      ref={(el) => {
        if (el) {
          virtualConfig.handleRowMounted({
            ref: el,
            data: node,
          });
        }
      }}
      key={index}
      node={node}
      optionChild={node.data.content || parseTNode(ctx.option, { item: node.data, index, context: { node } })}
      cascaderContext={ctx.cascaderContext}
      onClick={() => {
        handleExpand(node, 'click');
      }}
      onMouseEnter={() => {
        handleExpand(node, 'hover');
      }}
      onChange={() => {
        valueChangeEffect(node, ctx.cascaderContext);
      }}
    />
  );

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>): void => {
    if (isVirtualScroll) onInnerVirtualScroll(event as unknown as globalThis.WheelEvent);
  };

  useEffect(() => {
    if (ctx.scroll && ctx.cascaderContext.visible) {
      const timer = setTimeout(onScrollIntoView, 16);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [onScrollIntoView, ctx.scroll, ctx.cascaderContext.visible]);

  return (
    <div
      ref={panelWrapperRef}
      onScroll={handleScroll}
      className={classNames(`${COMPONENT_NAME}__menu`, 'narrow-scrollbar', {
        [`${COMPONENT_NAME}__menu--segment`]: segment,
        [`${COMPONENT_NAME}__menu--filter`]: isFilter,
      })}
      style={{
        position: isVirtualScroll ? 'relative' : undefined,
      }}
    >
      {isVirtualScroll ? (
        <>
          <div style={cursorStyle}></div>
          <ul key={key} style={listStyle}>
            {virtualConfig.visibleData.map((node, index) => renderItem(node, index))}
          </ul>
        </>
      ) : (
        <ul key={key}>{treeNodes.map((node: TreeNode, index: number) => renderItem(node, index))}</ul>
      )}
    </div>
  );
};

export default List;

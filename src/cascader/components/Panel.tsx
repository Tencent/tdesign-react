import React, { useMemo } from 'react';
import classNames from 'classnames';
import Item from './Item';

import useConfig from '../../hooks/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { getPanels } from '../core/helper';
import { expendClickEffect, valueChangeEffect } from '../core/effect';

import { TreeNode, CascaderContextType } from '../interface';
import { TdCascaderProps } from '../type';
import { StyledProps } from '../../common';

export interface CascaderPanelProps extends StyledProps, Pick<TdCascaderProps, 'trigger' | 'empty' | 'onChange'> {
  cascaderContext: CascaderContextType;
}

const Panel = (props: CascaderPanelProps) => {
  const { cascaderContext } = props;

  const panels = useMemo(() => getPanels(cascaderContext.treeNodes), [cascaderContext.treeNodes]);

  const handleExpand = (node: TreeNode, trigger: 'hover' | 'click') => {
    const { trigger: propsTrigger, cascaderContext } = props;
    expendClickEffect(propsTrigger, trigger, node, cascaderContext);
  };

  const { classPrefix } = useConfig();
  const [global] = useLocaleReceiver('cascader');
  const COMPONENT_NAME = `${classPrefix}-cascader`;

  const renderItem = (node: TreeNode, index) => (
    <Item
      key={index}
      node={node}
      cascaderContext={cascaderContext}
      onClick={() => {
        handleExpand(node, 'click');
      }}
      onMouseEnter={() => {
        handleExpand(node, 'hover');
      }}
      onChange={() => {
        valueChangeEffect(node, cascaderContext);
      }}
    />
  );

  const renderList = (treeNodes: TreeNode[], isFilter = false, segment = true, key = '1') => (
    <ul
      className={classNames(`${COMPONENT_NAME}__menu`, 'narrow-scrollbar', {
        [`${COMPONENT_NAME}__menu--segment`]: segment,
        [`${COMPONENT_NAME}__menu--filter`]: isFilter,
      })}
      key={key}
    >
      {treeNodes.map((node: TreeNode, index: number) => renderItem(node, index))}
    </ul>
  );

  const renderPanels = () => {
    const { inputVal, treeNodes } = props.cascaderContext;
    return inputVal
      ? renderList(treeNodes, true)
      : panels.map((treeNodes, index: number) =>
          renderList(treeNodes, false, index !== panels.length - 1, `${COMPONENT_NAME}__menu${index}`),
        );
  };

  return (
    <div
      className={classNames(
        `${COMPONENT_NAME}__panel`,
        { [`${COMPONENT_NAME}--normal`]: panels.length },
        props.className,
      )}
      style={props.style}
    >
      {panels?.length ? (
        renderPanels()
      ) : (
        <div className={`${COMPONENT_NAME}__panel--empty`}>{props.empty ?? global.empty}</div>
      )}
    </div>
  );
};

export default Panel;

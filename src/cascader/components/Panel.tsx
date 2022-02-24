import React, { useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../../_util/useConfig';

// common logic
import { getPanels, expendClickEffect, valueChangeEffect } from '../utils/panel';

// components
import Item from './Item';

// type
import { CascaderPanelProps, TreeNode, ContextType } from '../interface';

const Panel = (props: CascaderPanelProps) => {
  const {
    cascaderContext: { filterActive, treeNodes, inputWidth },
    cascaderContext,
    empty,
  } = props;

  const panels = useMemo(() => getPanels(treeNodes), [treeNodes]);

  const handleExpand = (ctx: ContextType, trigger: 'hover' | 'click') => {
    const { node } = ctx;
    const { trigger: propsTrigger, cascaderContext } = props;

    expendClickEffect(propsTrigger, trigger, node, cascaderContext);
  };

  const handleChange = (ctx: ContextType) => {
    const { node } = ctx;

    valueChangeEffect(node, cascaderContext);
  };

  const { classPrefix } = useConfig();
  const name = `${classPrefix}-cascader`;

  // innerComponents
  const renderEmpty = <div className={`${name}__panel--empty`}>{empty}</div>;

  const renderItem = (node: TreeNode, index) => (
    <Item
      key={index}
      node={node}
      cascaderContext={cascaderContext}
      onClick={(ctx: ContextType) => {
        handleExpand(ctx, 'click');
      }}
      onMouseEnter={(ctx: ContextType) => {
        handleExpand(ctx, 'hover');
      }}
      onChange={handleChange}
    />
  );

  const panelsContainer = panels.map((panel, index) => (
    <ul
      className={classNames(`${name}__menu`, 'narrow-scrollbar', {
        [`${name}__menu--segment`]: index !== panels.length - 1,
      })}
      key={index}
    >
      {panel.map((node: TreeNode, index) => renderItem(node, index))}
    </ul>
  ));

  const filterPanelsContainer = (
    <ul className={classNames(`${name}__menu`, 'narrow-scrollbar', `${name}__menu--segment`, `${name}__menu--filter`)}>
      {treeNodes.map((node: TreeNode, index: number) => renderItem(node, index))}
    </ul>
  );

  const renderPanels = filterActive ? filterPanelsContainer : panelsContainer;

  return (
    <div
      className={classNames(`${name}__panel`, { [`${name}--normal`]: panels.length })}
      style={{
        width: panels.length === 0 ? `${inputWidth}px` : null,
      }}
    >
      {panels && panels.length ? renderPanels : renderEmpty}
    </div>
  );
};

export default Panel;

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
    cascaderContext: { treeNodes, filterActive },
    cascaderContext,
    onChange,
    empty,
  } = props;

  const panels = useMemo(() => getPanels(treeNodes), [treeNodes]);

  const handleExpand = (ctx: ContextType, trigger: 'hover' | 'click') => {
    const { node } = ctx;
    const { trigger: propsTrigger, cascaderContext } = props;

    expendClickEffect(propsTrigger, trigger, node, cascaderContext, onChange, ctx);
  };

  const handleChange = (ctx: ContextType) => {
    const { node } = ctx;

    valueChangeEffect(node, cascaderContext, onChange, ctx);
  };

  const { classPrefix } = useConfig();
  const name = `${classPrefix}-cascader`;

  // innerComponents
  const renderEmpty = (
    <ul className={`${name}-menu`}>
      <li className={classNames([`${name}-item`, `${name}-item__is-empty`])}>{empty}</li>
    </ul>
  );

  const renderItem = (node: TreeNode) => (
    <Item
      key={node.value}
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
      key={index}
      className={classNames(`${name}-menu`, { [`${name}-menu__seperator`]: index !== panels.length - 1 })}
    >
      {panel.map((node: TreeNode) => renderItem(node))}
    </ul>
  ));

  const filterPanelsContainer = (
    <ul className={classNames(`${name}-menu`, `${name}-menu__seperator`)}>
      {treeNodes.map((node: TreeNode) => renderItem(node))}
    </ul>
  );

  const renderPanels = filterActive ? filterPanelsContainer : panelsContainer;

  return (
    <div className={classNames(`${name}-panel`, `${name}--normal`)}>
      {panels && panels.length ? renderPanels : renderEmpty}
    </div>
  );
};

export default Panel;

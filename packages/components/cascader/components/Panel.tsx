import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import parseTNode, { parseContentTNode } from '../../_util/parseTNode';
import useConfig from '../../hooks/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { expendClickEffect, valueChangeEffect } from '../core/effect';
import { FILTER_INACTIVE_LEVEL, filterOptions, getPanels, isFilterActive, isFilterLevelActive } from '../core/helper';
import Item from './Item';

import type { StyledProps } from '../../common';
import type { CascaderContextType, FilterState, FilterValue, TreeNode } from '../interface';
import type { TdCascaderProps } from '../type';

export interface CascaderPanelProps
  extends
    StyledProps,
    Pick<
      TdCascaderProps,
      'trigger' | 'empty' | 'onChange' | 'loading' | 'loadingText' | 'option' | 'columnHeader' | 'columnFooter'
    > {
  cascaderContext: CascaderContextType;
}

const Panel = (props: CascaderPanelProps) => {
  const { cascaderContext, columnFooter, columnHeader, option } = props;
  const [filterState, setFilterState] = useState<FilterState | null>(null);

  const panels = useMemo(() => getPanels(cascaderContext.treeNodes), [cascaderContext.treeNodes]);

  const hasActiveFilter = filterState && Object.values(filterState.filters).some(isFilterActive);

  const clearExpiredFilters = (filters: Record<number, FilterValue>, maxLevel: number) =>
    Object.fromEntries(Object.entries(filters).filter(([panelIndex]) => Number(panelIndex) <= maxLevel));

  const handleFilter = (panelIndex: number, filter: FilterValue) => {
    setFilterState((previousState) => {
      let filters = { ...previousState?.filters };
      if (isFilterActive(filter)) {
        filters[panelIndex] = filter;
      } else {
        delete filters[panelIndex];
      }

      let maxLevel = previousState?.maxLevel ?? FILTER_INACTIVE_LEVEL;
      if (isFilterActive(filter)) {
        const filteredNodes = filterOptions(panels[panelIndex] || [], filter, panelIndex);
        maxLevel = filteredNodes.length ? Math.max(panelIndex, maxLevel) : panelIndex;
      } else if (!Object.values(filters).some(isFilterActive)) {
        maxLevel = FILTER_INACTIVE_LEVEL;
      }

      if (maxLevel < (previousState?.maxLevel ?? FILTER_INACTIVE_LEVEL)) {
        filters = clearExpiredFilters(filters, maxLevel);
      }
      return { filters, maxLevel };
    });
  };

  const handleExpand = (node: TreeNode, trigger: 'hover' | 'click', level: number) => {
    const { trigger: propsTrigger, cascaderContext } = props;

    if (
      filterState &&
      isFilterLevelActive(filterState.maxLevel) &&
      propsTrigger === trigger &&
      Array.isArray(node.children) &&
      node.children.length
    ) {
      const childLevel = level + 1;
      if (childLevel > filterState.maxLevel) {
        setFilterState({
          filters: clearExpiredFilters(filterState.filters, childLevel),
          maxLevel: childLevel,
        });
      }
    }

    expendClickEffect(propsTrigger, trigger, node, cascaderContext);
  };

  const { classPrefix } = useConfig();
  const [global] = useLocaleReceiver('cascader');
  const COMPONENT_NAME = `${classPrefix}-cascader`;

  const renderItem = (node: TreeNode, index: number, panelIndex: number) => (
    <Item
      key={node.value}
      node={node}
      optionChild={node.data.content || parseTNode(option, { item: node.data, index, context: { node } })}
      cascaderContext={cascaderContext}
      onClick={() => {
        handleExpand(node, 'click', panelIndex);
      }}
      onMouseEnter={() => {
        handleExpand(node, 'hover', panelIndex);
      }}
      onChange={() => {
        valueChangeEffect(node, cascaderContext);
      }}
    />
  );

  const renderList = (treeNodes: TreeNode[], segment = true, panelIndex = 0) => {
    const filter = filterState?.filters[panelIndex];
    const displayNodes = hasActiveFilter && filter ? filterOptions(treeNodes, filter, panelIndex) : treeNodes;
    const columnParams = {
      panelIndex,
      options: treeNodes.map((node) => node.data),
      filteredOptions: displayNodes.map((node) => node.data),
      onFilter: (value: FilterValue) => handleFilter(panelIndex, value),
    };

    return (
      <ul
        className={classNames(`${COMPONENT_NAME}__menu`, 'narrow-scrollbar', {
          [`${COMPONENT_NAME}__menu--segment`]: segment,
        })}
        key={`${COMPONENT_NAME}__menu${panelIndex}`}
      >
        {parseContentTNode(columnHeader, columnParams)}
        {displayNodes.map((node: TreeNode, index: number) => renderItem(node, index, panelIndex))}
        {parseContentTNode(columnFooter, columnParams)}
      </ul>
    );
  };

  const renderFilteredList = (treeNodes: TreeNode[]) => {
    const columnParams = {
      panelIndex: 0,
      options: treeNodes.map((node) => node.data),
      filteredOptions: treeNodes.map((node) => node.data),
      onFilter: () => undefined,
    };
    return (
      <ul
        className={classNames(`${COMPONENT_NAME}__menu`, 'narrow-scrollbar', `${COMPONENT_NAME}__menu--filter`)}
        key={`${COMPONENT_NAME}__menu--filtered`}
      >
        {parseContentTNode(columnHeader, columnParams)}
        {treeNodes.map((node: TreeNode, index: number) => renderItem(node, index, 0))}
        {parseContentTNode(columnFooter, columnParams)}
      </ul>
    );
  };

  const renderPanels = () => {
    const { inputVal, treeNodes } = props.cascaderContext;
    if (inputVal) return renderFilteredList(treeNodes);

    return panels.map((treeNodes, index: number) => {
      if (hasActiveFilter && isFilterLevelActive(filterState.maxLevel) && index > filterState.maxLevel) return null;
      return renderList(treeNodes, index !== panels.length - 1, index);
    });
  };

  let content;
  if (props.loading) {
    content = <div className={`${COMPONENT_NAME}__panel--empty`}>{props.loadingText ?? global.loadingText}</div>;
  } else {
    content = panels?.length ? (
      renderPanels()
    ) : (
      <div className={`${COMPONENT_NAME}__panel--empty`}>{props.empty ?? global.empty}</div>
    );
  }
  return (
    <div
      className={classNames(
        `${COMPONENT_NAME}__panel`,
        { [`${COMPONENT_NAME}--normal`]: panels.length && !props.loading },
        props.className,
      )}
      style={props.style}
    >
      {content}
    </div>
  );
};

export default Panel;

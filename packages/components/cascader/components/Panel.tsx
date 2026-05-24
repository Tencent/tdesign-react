import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import noop from '../../_util/noop';
import parseTNode from '../../_util/parseTNode';
import useConfig from '../../hooks/useConfig';
import { useLocaleReceiver } from '../../locale/LocalReceiver';
import { expandClickEffect, valueChangeEffect } from '../core/effect';
import { FILTER_INACTIVE_LEVEL, filterOptions, getPanels, isFilterActive, isFilterLevelActive } from '../core/helper';
import Item from './Item';

import type { StyledProps } from '../../common';
import type { CascaderContextType, FilterState, FilterValue, TreeNode } from '../interface';
import type { TdCascaderProps } from '../type';

export interface CascaderPanelProps
  extends StyledProps,
    Pick<
      TdCascaderProps,
      'trigger' | 'empty' | 'onChange' | 'loading' | 'loadingText' | 'option' | 'columnHeader' | 'columnFooter'
    > {
  cascaderContext: CascaderContextType;
}

const Panel = (props: CascaderPanelProps) => {
  const { cascaderContext, option, columnHeader, columnFooter } = props;
  const { classPrefix } = useConfig();
  const [global] = useLocaleReceiver('cascader');
  const [filterState, setFilterState] = useState<FilterState | null>(null);
  const filterFnsRef = useRef<Map<number, (filter: FilterValue) => void> | null>(null);
  // console.log('filterState', filterState);
  if (!filterFnsRef.current) {
    filterFnsRef.current = new Map<number, (filter: FilterValue) => void>();
  }

  const COMPONENT_NAME = `${classPrefix}-cascader`;

  const panels = useMemo(() => getPanels(cascaderContext.treeNodes), [cascaderContext.treeNodes]);

  const hasActiveFilter = useMemo(() => filterState && hasAnyActiveFilter(filterState.filters), [filterState]);

  const getFilteredNodes = (nodes: TreeNode[], index: number): TreeNode[] => {
    const state = filterState;
    if (!state) return nodes;
    const filter = state.filters[index];
    if (!filter) return nodes;
    return filterOptions(nodes, filter, index);
  };

  function hasAnyActiveFilter(filters: Record<number, FilterValue>): boolean {
    return Object.values(filters).some((f) => isFilterActive(f));
  }

  const clearExpiredFilters = (filters: Record<number, FilterValue>, maxLevel: number): Record<number, FilterValue> =>
    Object.fromEntries(Object.entries(filters).filter(([panelIndex]) => Number(panelIndex) <= maxLevel));

  const calculateCascadeMaxLevel = (panelIndex: number, filteredNodes: TreeNode[], currentMaxLevel: number): number => {
    if (filteredNodes.length === 0) {
      return panelIndex;
    }
    return Math.max(panelIndex, currentMaxLevel);
  };

  const handleFilter = (index: number, filter: FilterValue) => {
    const prev = filterState;

    let filters: Record<number, FilterValue> = { ...prev?.filters };
    if (isFilterActive(filter)) {
      filters[index] = filter;
    } else {
      delete filters[index];
    }

    let maxLevel = prev?.maxLevel ?? FILTER_INACTIVE_LEVEL;

    if (isFilterActive(filter)) {
      const currentNodes = panels[index] || [];
      const filteredNodes = filterOptions(currentNodes, filter, index);
      maxLevel = calculateCascadeMaxLevel(index, filteredNodes, maxLevel);
    } else if (!hasAnyActiveFilter(filters)) {
      maxLevel = FILTER_INACTIVE_LEVEL;
    }

    if (maxLevel < (prev?.maxLevel ?? FILTER_INACTIVE_LEVEL)) {
      filters = clearExpiredFilters(filters, maxLevel);
    }
    // console.log('handleFilter', index, filters, maxLevel);
    setFilterState({ filters, maxLevel });
  };

  const shouldShowPanel = (index: number): boolean => {
    const state = filterState;
    if (!hasActiveFilter || !state || !isFilterLevelActive(state.maxLevel)) {
      return true;
    }
    return index <= state.maxLevel;
  };

  const handleExpand = (node: TreeNode, trigger: 'hover' | 'click', level: number) => {
    const state = filterState;

    const { children } = node;
    if (
      state &&
      isFilterLevelActive(state.maxLevel) &&
      props.trigger === trigger &&
      Array.isArray(children) &&
      children.length
    ) {
      const childLevel = level + 1;
      if (childLevel > state.maxLevel) {
        const cleanedFilters = clearExpiredFilters(state.filters, childLevel);
        setFilterState({ filters: cleanedFilters, maxLevel: childLevel });
      }
    }

    expandClickEffect(props.trigger, trigger, node, cascaderContext);
  };

  // 参照 vue-next 的写法
  const getOnFilterCallback = (index: number) => {
    let callback = filterFnsRef.current.get(index);
    if (!callback) {
      callback = (filter: FilterValue) => handleFilter(index, filter);
      filterFnsRef.current.set(index, callback);
    }
    return callback;
  };

  // 不使用map 存callback的写法
  // const getOnFilterCallback = (index: number) => (filter: FilterValue) => handleFilter(index, filter);

  const renderItem = (node: TreeNode, index: number) => (
    <Item
      key={node.value}
      node={node}
      optionChild={node.data.content || parseTNode(option, { item: node.data, index, context: { node } })}
      cascaderContext={cascaderContext}
      onClick={() => {
        handleExpand(node, 'click', index);
      }}
      onMouseEnter={() => {
        handleExpand(node, 'hover', index);
      }}
      onChange={() => {
        valueChangeEffect(node, cascaderContext);
      }}
    />
  );

  const renderList = (treeNodes: TreeNode[], segment = true, index = 0) => {
    const displayNodes = hasActiveFilter ? getFilteredNodes(treeNodes, index) : treeNodes;

    const columnParams = {
      panelIndex: index,
      options: treeNodes.map((node) => node.data),
      filteredOptions: displayNodes.map((node) => node.data),
      onFilter: getOnFilterCallback(index),
    };

    return (
      <ul
        className={classNames(`${COMPONENT_NAME}__menu`, 'narrow-scrollbar', {
          [`${COMPONENT_NAME}__menu--segment`]: segment,
        })}
        key={`${COMPONENT_NAME}__menu__${index}`}
      >
        {parseTNode(columnHeader, columnParams)}
        {displayNodes.map((node: TreeNode) => renderItem(node, index))}
        {parseTNode(columnFooter, columnParams)}
      </ul>
    );
  };

  const renderFilteredList = (treeNodes: TreeNode[]) => {
    const columnParams = {
      panelIndex: 0,
      options: treeNodes.map((node) => node.data),
      filteredOptions: treeNodes.map((node) => node.data),
      onFilter: noop,
    };

    return (
      <ul
        className={classNames([`${COMPONENT_NAME}__menu`, 'narrow-scrollbar', `${COMPONENT_NAME}__menu--filter`])}
        key={`${COMPONENT_NAME}__menu--filtered`}
      >
        {parseTNode(columnHeader, columnParams)}
        {treeNodes.map((node: TreeNode) => renderItem(node, 0))}
        {parseTNode(columnFooter, columnParams)}
      </ul>
    );
  };

  const renderPanels = () => {
    const { inputVal, treeNodes } = cascaderContext;
    if (inputVal) return renderFilteredList(treeNodes);

    const result = [];
    const len = panels.length;
    for (let i = 0; i < len; i++) {
      if (shouldShowPanel(i)) {
        result.push(renderList(panels[i], i !== len - 1, i));
      }
    }
    return result;
  };

  let content: React.ReactNode;

  if (props.loading) {
    content = <div className={`${COMPONENT_NAME}__panel--empty`}>{props.loadingText ?? global.loadingText}</div>;
  } else {
    content = panels?.length ? (
      renderPanels()
    ) : (
      <div className={`${COMPONENT_NAME}__panel--empty`}>{props.empty ?? global.empty}</div>
    );
  }

  useEffect(() => {
    if (!panels.length) return;
    const filterFns = filterFnsRef.current;
    const maxIndex = panels.length - 1;
    for (const [index] of filterFns) {
      if (index > maxIndex) {
        filterFns.delete(index);
      }
    }
  }, [panels]);

  useEffect(
    () => () => {
      filterFnsRef.current.clear();
    },
    [],
  );

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

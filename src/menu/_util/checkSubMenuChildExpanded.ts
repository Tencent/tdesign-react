import React from 'react';
import { MenuValue } from '../type';
import { MenuBlockType } from './type';

export default function checkSubMenuChildExpanded(
  children: React.ReactNode,
  expanded: MenuValue[],
  value: MenuValue,
  resultExpanded: MenuValue[] = [],
) {
  const childValues = React.Children.map(children, (child: React.ReactElement) => child.props.value);
  // 直接找到了目标节点
  const index = childValues.indexOf(value);
  // 找到对应的子节点
  const child = children[index];
  // 如果是 submenu 并且子节点存在
  if (index > -1 && child?.type?.displayName === MenuBlockType.SubMenu) {
    return [...resultExpanded, value];
  }
  // 否则寻找当前展开的节点是否是祖先节点
  const expandedIndex = childValues.indexOf(expanded[0]);
  const expandedChild = children[expandedIndex];
  if (expandedIndex > -1 && expandedChild?.type?.displayName === MenuBlockType.SubMenu) {
    return checkSubMenuChildExpanded(expandedChild.props.children, expanded.slice(1), value, [
      ...resultExpanded,
      expanded[0],
    ]);
  }

  return [value];
}

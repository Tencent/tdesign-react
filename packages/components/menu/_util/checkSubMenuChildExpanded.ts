import React from 'react';
import { checkIsSubMenu } from './checkMenuType';
import type { MenuValue } from '../type';

export default function checkSubMenuChildExpanded(
  children: React.ReactNode,
  expanded: MenuValue[],
  value: MenuValue,
  resultExpanded: MenuValue[] = [],
) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement[];

  // 直接在当前层级寻找目标节点
  for (const child of childrenArray) {
    const childValue = child.props?.value;

    if (childValue === value) {
      // 找到目标节点
      if (checkIsSubMenu(child)) {
        // 目标是 SubMenu，需要展开它
        return [...resultExpanded, value];
      }
      // 目标是 MenuItem，返回父级路径（不包含自己）
      return resultExpanded;
    }
  }

  // 在子菜单中递归查找
  for (const child of childrenArray) {
    const childValue = child.props?.value;
    if (checkIsSubMenu(child) && childValue) {
      const nestedResult = checkSubMenuChildExpanded(child.props.children, expanded, value, [
        ...resultExpanded,
        childValue,
      ]);

      // 如果在子树中找到了目标，返回完整路径
      if (nestedResult.length > 0) {
        return nestedResult;
      }
    }
  }

  // 在当前分支中没有找到目标
  return [];
}

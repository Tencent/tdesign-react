import { ReactNode, isValidElement } from 'react';
import type { MenuValue } from '../type';

interface MenuNode {
  parent?: MenuValue;
  children: MenuValue[];
}

export class MenuTree {
  // 菜单的层级关系映射
  private menuMap: Map<MenuValue, MenuNode> = new Map();

  // 当前展开的菜单集合
  private expandedSet: Set<MenuValue> = new Set();

  // 是否开启互斥展开
  private expandMutex: boolean;

  constructor(children: ReactNode, expandMutex = false) {
    this.buildTree(children);
    this.expandMutex = expandMutex;
  }

  /**
   * 构建菜单树结构
   */
  private buildTree(children: ReactNode) {
    this.menuMap.clear();
    this.traverseChildren(children);
  }

  private traverseChildren(node: ReactNode, parentValue?: MenuValue) {
    if (Array.isArray(node)) {
      node.forEach((child) => this.traverseChildren(child, parentValue));
      return;
    }

    if (!isValidElement(node)) return;

    const { value, children } = node.props;

    // 当前节点有 value，是一个有效的菜单项
    if (value !== undefined) {
      // 初始化节点信息
      if (!this.menuMap.has(value)) {
        this.menuMap.set(value, { parent: parentValue, children: [] });
      }

      // 建立父子关系
      if (parentValue !== undefined) {
        const parentNode = this.menuMap.get(parentValue);
        if (parentNode && !parentNode.children.includes(value)) {
          parentNode.children.push(value);
        }
      }

      // 递归处理子节点
      if (children) {
        this.traverseChildren(children, value);
      }
    } else if (children) {
      // 当前节点是其它包装组件，继续递归
      this.traverseChildren(children, parentValue);
    }
  }

  /**
   * 更新当前展开的菜单列表
   */
  setExpanded(expandedList: MenuValue[]) {
    this.expandedSet = new Set(expandedList);
  }

  /**
   * 获取当前展开的菜单列表
   */
  getExpanded() {
    return Array.from(this.expandedSet);
  }

  /**
   * 检查节点是否展开
   */
  isExpanded(value: MenuValue) {
    return this.expandedSet.has(value);
  }

  /**
   * 获取所有祖先节点
   */
  getAncestors(value: MenuValue) {
    const ancestors: MenuValue[] = [];
    let current = this.menuMap.get(value)?.parent;

    while (current !== undefined) {
      ancestors.unshift(current);
      current = this.menuMap.get(current)?.parent;
    }

    return ancestors;
  }

  /**
   * 获取所有子孙节点
   */
  getDescendants(value: MenuValue) {
    const descendants: MenuValue[] = [];
    if (!this.menuMap.get(value)) return descendants;

    // 深度优先遍历
    const dfs = (nodeValue: MenuValue) => {
      const node = this.menuMap.get(nodeValue);
      if (!node) return;

      node.children.forEach((child: MenuValue) => {
        descendants.push(child);
        dfs(child);
      });
    };

    dfs(value);
    return descendants;
  }

  /**
   * 获取所有同级节点
   */
  getSiblings(value: MenuValue) {
    const node = this.menuMap.get(value);
    if (!node) return [];

    const parentValue = node.parent;
    if (parentValue === undefined) {
      const rootNodes: MenuValue[] = [];
      for (const [nodeValue, info] of this.menuMap.entries()) {
        if (info.parent === undefined && nodeValue !== value) {
          rootNodes.push(nodeValue);
        }
      }
      return rootNodes;
    }

    const parent = this.menuMap.get(parentValue);
    return parent ? parent.children.filter((child: MenuValue) => child !== value) : [];
  }

  /**
   * 更新节点的展开状态
   */
  expandNode(value: MenuValue) {
    const isCurrExpanded = this.isExpanded(value);
    let nextExpanded: MenuValue[] = this.getExpanded();

    if (isCurrExpanded) {
      // 收起该菜单及其所有子菜单
      const descendants = this.getDescendants(value);
      const toClose = new Set([value, ...descendants]);

      nextExpanded = nextExpanded.filter((item) => !toClose.has(item));
    } else {
      const expandedSet = new Set(nextExpanded);

      // 处理互斥逻辑
      if (this.expandMutex) {
        const siblings = this.getSiblings(value);
        const siblingsToClose = new Set();

        // 收起同级的其他展开菜单及其子菜单
        siblings.forEach((sibling) => {
          if (expandedSet.has(sibling)) {
            siblingsToClose.add(sibling);
            const siblingDescendants = this.getDescendants(sibling);
            siblingDescendants.forEach((desc) => siblingsToClose.add(desc));
          }
        });

        nextExpanded = nextExpanded.filter((item) => !siblingsToClose.has(item));
      }

      // 确保父级菜单都是展开的
      const ancestors = this.getAncestors(value);
      ancestors.forEach((ancestor) => {
        if (!nextExpanded.includes(ancestor)) {
          nextExpanded.push(ancestor);
        }
      });

      // 展开当前的菜单
      if (!nextExpanded.includes(value)) {
        nextExpanded.push(value);
      }
    }

    this.setExpanded(nextExpanded);
  }
}

/**
 * A2UI ComponentTree
 * 将平铺的组件列表转换为嵌套的组件树
 * 参考 @a2ui/core ComponentTree 实现
 * 
 * 支持两种 children 模式 (A2UI v0.9 规范)：
 * 1. 直接引用: children: ["comp1", "comp2"]
 * 2. Template 模式: children: { componentId: "comp1", path: "/items" }
 */

import type { A2UIComponentBase, ChildrenProperty, ResolvedComponent } from '../types';
import type { DataStore } from './DataStore';
import type { PathResolver } from './PathResolver';

/**
 * 组件树构建器
 */
export class ComponentTree {
  /** 解析后的根组件 */
  readonly root: ResolvedComponent | null;

  constructor(
    private components: Map<string, A2UIComponentBase>,
    private dataStore: DataStore,
    private pathResolver: PathResolver
  ) {
    this.root = this.buildTree('root', '/');
  }

  /**
   * 递归构建组件树
   * @param componentId 组件 ID
   * @param dataContextPath 当前数据上下文路径
   */
  private buildTree(componentId: string, dataContextPath: string): ResolvedComponent | null {
    const component = this.components.get(componentId);
    if (!component) {
      return null;
    }

    // 创建解析后的组件（浅拷贝）
    const resolved: ResolvedComponent = {
      ...component,
      dataContextPath,
    };

    // 处理 children
    const children = (component as any).children as ChildrenProperty | undefined;
    if (children) {
      resolved.resolvedChildren = this.resolveChildren(children, dataContextPath);
    }

    // 处理 child (Card, Button 等单子组件)
    const child = (component as any).child as string | undefined;
    if (child && typeof child === 'string') {
      const resolvedChild = this.buildTree(child, dataContextPath);
      if (resolvedChild) {
        resolved.resolvedChildren = [resolvedChild];
      }
    }

    // 处理 tabItems
    const tabItems = (component as any).tabItems as Array<{ title: any; child: string }> | undefined;
    if (tabItems && Array.isArray(tabItems)) {
      resolved.resolvedChildren = tabItems
        .map((item) => this.buildTree(item.child, dataContextPath))
        .filter((c): c is ResolvedComponent => c !== null);
    }

    return resolved;
  }

  /**
   * 解析 children 属性
   */
  private resolveChildren(
    children: ChildrenProperty,
    dataContextPath: string
  ): ResolvedComponent[] {
    // 模式1: 直接引用数组
    if (Array.isArray(children)) {
      return children
        .map((id) => this.buildTree(id, dataContextPath))
        .filter((c): c is ResolvedComponent => c !== null);
    }

    // 模式2: Template 模式 (A2UI v0.9: componentId + path)
    if (children && typeof children === 'object' && 'componentId' in children) {
      return this.resolveTemplate(children.componentId, children.path, dataContextPath);
    }

    // 兼容旧格式 (template + dataPath)
    if (children && typeof children === 'object' && 'template' in children) {
      const legacyChildren = children as { template: string; dataPath: string };
      return this.resolveTemplate(legacyChildren.template, legacyChildren.dataPath, dataContextPath);
    }

    return [];
  }

  /**
   * 解析 Template 模式的 children
   * Template 会根据 dataPath 指向的数组长度，创建多个子组件实例
   */
  private resolveTemplate(
    templateId: string,
    dataPath: string,
    parentContextPath: string
  ): ResolvedComponent[] {
    // 解析数据路径
    const resolvedDataPath = this.pathResolver.resolve(dataPath, parentContextPath);
    const data = this.dataStore.get(resolvedDataPath);

    // 如果数据不是数组，返回空
    if (!Array.isArray(data)) {
      return [];
    }

    // 为数组中的每个元素创建一个组件实例
    return data.map((_, index) => {
      const itemContextPath = `${resolvedDataPath}/${index}`;
      return this.buildTree(templateId, itemContextPath);
    }).filter((c): c is ResolvedComponent => c !== null);
  }

  /**
   * 查找组件
   */
  findComponent(componentId: string): ResolvedComponent | null {
    return this.findInTree(this.root, componentId);
  }

  private findInTree(node: ResolvedComponent | null, targetId: string): ResolvedComponent | null {
    if (!node) return null;
    if (node.id === targetId) return node;

    if (node.resolvedChildren) {
      for (const child of node.resolvedChildren) {
        const found = this.findInTree(child, targetId);
        if (found) return found;
      }
    }

    return null;
  }

  /**
   * 遍历组件树
   */
  traverse(callback: (component: ResolvedComponent) => void): void {
    this.traverseNode(this.root, callback);
  }

  private traverseNode(
    node: ResolvedComponent | null,
    callback: (component: ResolvedComponent) => void
  ): void {
    if (!node) return;
    callback(node);
    
    if (node.resolvedChildren) {
      for (const child of node.resolvedChildren) {
        this.traverseNode(child, callback);
      }
    }
  }

  /**
   * 获取所有组件 ID
   */
  getAllIds(): string[] {
    const ids: string[] = [];
    this.traverse((component) => {
      ids.push(component.id);
    });
    return ids;
  }
}

export default ComponentTree;

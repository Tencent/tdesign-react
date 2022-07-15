import { TNode } from '../common';

/**
 * 渲染 任意 T | () => T 类型节点
 * 默认类型为TNode
 * @param tnode
 */
export default function renderTNode<T = TNode>(tnode: T, defaultNode?: T): T {
  if (typeof tnode === 'function') {
    return tnode();
  }

  return tnode || defaultNode;
}

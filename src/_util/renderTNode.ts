import { TNode } from '../common';

type RenderType<T> = T extends () => infer P ? P : T;

/**
 * 渲染 任意 T | () => T 类型节点
 * 默认类型为TNode
 * @param tnode
 */
export default function renderTNode<T = TNode>(tnode: T, defaultNode?: T): RenderType<T> {
  if (typeof tnode === 'function') {
    return tnode();
  }

  return tnode || (typeof defaultNode === 'function' ? defaultNode() : defaultNode);
}

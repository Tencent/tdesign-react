import React from 'react';
import { TNode } from '../common';

/**
 * 渲染 TNode 类型节点
 * @param tnode
 */
export default function renderTNode(tnode: TNode, defaultNode?: React.ReactNode): React.ReactNode {
  if (typeof tnode === 'function') {
    return tnode();
  }

  return tnode || defaultNode;
}

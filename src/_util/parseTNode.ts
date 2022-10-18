import React from 'react';
import { TNode } from '../common';

// 解析 TNode 数据结构
export default function parseTNode(
  renderNode: TNode | TNode<any> | undefined,
  renderParams?: any,
  defaultNode?: React.ReactNode,
): React.ReactNode {
  let node: React.ReactNode = null;

  if (typeof renderNode === 'function') {
    node = renderNode(renderParams);
  } else {
    node = renderNode ?? defaultNode;
  }

  return node as React.ReactNode;
}

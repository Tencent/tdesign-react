import React, { ReactElement, ReactNode } from 'react';
import isFunction from 'lodash/isFunction';
import { TNode } from '../common';
import log from '../_common/js/log';

// 解析 TNode 数据结构
export default function parseTNode(
  renderNode: TNode | TNode<any> | undefined,
  renderParams?: any,
  defaultNode?: ReactNode,
): ReactNode {
  let node: ReactNode = null;

  if (typeof renderNode === 'function') {
    node = renderNode(renderParams);
  } else if (renderNode === true) {
    node = defaultNode;
  } else {
    node = renderNode ?? defaultNode;
  }
  return node as ReactNode;
}

/**
 * 解析各种数据类型的 TNode
 * 函数类型：content={(props) => <Icon></Icon>}
 * 组件类型：content={<Button>click me</Button>} 这种方式可以避免函数重复渲染，对应的 props 已经注入
 * 字符类型
 */
export function parseContentTNode<T>(tnode: TNode<T>, props: T) {
  if (isFunction(tnode)) return tnode(props) as ReactNode;
  if (!tnode || ['string', 'number', 'boolean'].includes(typeof tnode)) return tnode as ReactNode;
  try {
    return React.cloneElement(tnode as ReactElement, { ...props });
  } catch (e) {
    log.warn('parseContentTNode', `${tnode} is not a valid ReactNode`);
    return null;
  }
}

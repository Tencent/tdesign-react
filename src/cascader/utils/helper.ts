import { TreeNode } from '../interface';

/**
 * 获取node节点的全路径
 * @param node
 * @returns
 */
export function getFullPathLabel(node: TreeNode) {
  return node
    .getPath()
    .map((node: TreeNode) => node.label)
    .join('/');
}

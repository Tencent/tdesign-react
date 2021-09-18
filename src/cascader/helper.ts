import { TreeNode } from './interface';

export function getFullPathLabel(node: TreeNode) {
  return node
    .getPath()
    .map((node: TreeNode) => node.label)
    .join('/');
}

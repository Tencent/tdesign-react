import { useMemo } from 'react';
import useConfig from '../_util/useConfig';

export function useTreeConfig() {
  const { classPrefix: prefix } = useConfig();

  return useMemo(() => {
    const tree = `${prefix}-tree`;

    const treeClassNames = {
      icon: `${prefix}-icon`,
      folderIcon: `${prefix}-folder-icon`,
      actived: `${prefix}-is-active`,
      disabled: `${prefix}-is-disabled`,
      treeIconRight: `${prefix}-icon-arrow-right`,
      treeIconDown: `${prefix}-icon-arrow-down`,
      tree,
      treeFx: `${tree}--fx`,
      treeBlockNode: `${tree}--block-node`,
      treeEmpty: `${tree}__empty`,
      treeList: `${tree}__list`,
      treeNode: `${tree}__item`,
      treeNodeOpen: `${tree}__item--open`,
      treeHoverable: `${tree}--hoverable`,
      treeCheckable: `${tree}--checkable`,
      treeLabel: `${tree}__label`,
      treeLabelStrictly: `${tree}__label--strictly`,
      treeIcon: `${tree}__icon`,
      treeIconDefault: `${tree}__icon--default`,
      treeSpace: `${tree}__space`,
      treeOperations: `${tree}__operations`,
      line: `${tree}__line`,
      lineIsLeaf: `${tree}__line--leaf`,
      lineIsFirst: `${tree}__line--first`,

      treeNodeShow: `${tree}__item--show`,
      treeClickable: `${tree}__item--clickable`,
      loading: `${prefix}-icon-loading ${prefix}-icon-loading-blue`,
      toggleEnter: `${tree}-toggle-enter-active`, // 节点展开动画
      toggleLeave: `${tree}-toggle-leave-active`, // 节点关闭动画
    };

    const transitionNames = {
      treeNode: `${prefix}-tree-toggle`,
    };

    const transitionClassNames = {
      enter: treeClassNames.toggleEnter,
      exit: treeClassNames.toggleLeave,
    };

    return {
      treeClassNames,
      transitionNames,
      transitionClassNames,
      transitionDuration: 300,
    };
  }, [prefix]);
}

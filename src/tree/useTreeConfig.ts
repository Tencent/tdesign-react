import { useMemo } from 'react';
import useConfig from '../hooks/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';

export function useTreeConfig() {
  const { classPrefix: prefix } = useConfig();
  const [locale, t] = useLocaleReceiver('tree');

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
      treeFx: `${tree}--transition`,
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
      treeNodeDraggable: `${tree}__item--draggable`,
      treeNodeDragging: `${tree}__item--dragging`,
      treeNodeDragTipTop: `${tree}__item--tip-top`,
      treeNodeDragTipBottom: `${tree}__item--tip-bottom`,
      treeNodeDragTipHighlight: `${tree}__item--tip-highlight`,
      line: `${tree}__line`,
      lineIsLeaf: `${tree}__line--leaf`,
      lineIsFirst: `${tree}__line--first`,

      treeNodeShow: `${tree}__item--show`,
      treeClickable: `${tree}__item--clickable`,
      loading: `${prefix}-icon-loading ${prefix}-icon-loading-blue`,
      toggleEnter: `${tree}__item--enter-active`, // 节点展开动画
      toggleLeave: `${tree}__item--leave-active`, // 节点关闭动画
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
      locale: (key) => t(locale[key]),
    };
  }, [locale, prefix, t]);
}

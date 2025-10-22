import { useCallback, useMemo, useRef, useState } from 'react';
import { getSizeDraggable, calcMoveSize } from '@tdesign/common-js/drawer/utils';

import type { TdDrawerProps } from '../type';
import type { Styles } from '../../common';

const useDrag = (
  placement: TdDrawerProps['placement'],
  sizeDraggable: TdDrawerProps['sizeDraggable'],
  onSizeDragEnd: TdDrawerProps['onSizeDragEnd'],
) => {
  const [dragSizeValue, changeDragSizeValue] = useState<string>(null);
  // 使用 ref 来存储当前拖拽的宽度值
  const dragSizeRef = useRef<number>(0);
  const [isSizeDragging, toggleSizeDragging] = useState(false);

  const handleMousemove = useCallback(
    (e: MouseEvent) => {
      // 如果 sizeDraggable 是 boolean 值的 false，则不进行后续的计算
      if (sizeDraggable === false) return;

      // 鼠标移动时计算draggedSizeValue的值
      const { x, y } = e;

      const maxHeight = document.documentElement.clientHeight;
      const maxWidth = document.documentElement.clientWidth;
      const offsetHeight = 8;
      const offsetWidth = 8;
      // x 轴方向使用最大宽度，y轴方向使用最大高度
      const max = placement === 'left' || placement === 'right' ? maxWidth : maxHeight;
      // x 轴方向使用默认最小宽度，y轴方向使用默认最小高度
      const min = placement === 'left' || placement === 'right' ? offsetWidth : offsetHeight;

      const { max: limitMax, min: limitMin } = getSizeDraggable(sizeDraggable, { max, min });

      const moveSize = calcMoveSize(placement, {
        x,
        y,
        maxWidth,
        maxHeight,
        max: limitMax,
        min: limitMin,
      });

      if (typeof moveSize === 'undefined') return;
      changeDragSizeValue(`${moveSize}px`);
      dragSizeRef.current = moveSize;
    },
    [placement, sizeDraggable],
  );

  const draggableLineStyles: Styles = useMemo(() => {
    // 设置拖拽control的样式
    const isHorizontal = ['right', 'left'].includes(placement);
    const oppositeMap = {
      left: 'right',
      right: 'left',
      top: 'bottom',
      bottom: 'top',
    };
    return {
      zIndex: 1,
      position: 'absolute',
      background: 'transparent',
      [oppositeMap[placement]]: 0,
      width: isHorizontal ? '16px' : '100%',
      height: isHorizontal ? '100%' : '16px',
      cursor: isHorizontal ? 'col-resize' : 'row-resize',
    };
  }, [placement]);

  const handleMouseup = useCallback(
    (e: MouseEvent) => {
      document.removeEventListener('mouseup', handleMouseup, true);
      document.removeEventListener('mousemove', handleMousemove, true);
      onSizeDragEnd?.({
        e,
        // 此处不要使用 dragSizeValue，useState 的更新是异步的，在鼠标拖拽的同步操作中取不到最新的值
        size: dragSizeRef.current,
      });
      toggleSizeDragging(false);
    },
    [handleMousemove, onSizeDragEnd],
  );

  const enableDrag = useCallback(() => {
    // mousedown 绑定 mousemove 和 mouseup 事件
    document.addEventListener('mouseup', handleMouseup, true);
    document.addEventListener('mousemove', handleMousemove, true);
    toggleSizeDragging(true);
  }, [handleMousemove, handleMouseup]);

  const draggingStyles: Styles = isSizeDragging ? { userSelect: 'none' } : {};

  return { dragSizeValue, enableDrag, draggableLineStyles, draggingStyles };
};

export default useDrag;

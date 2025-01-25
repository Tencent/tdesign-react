import { useMemo, useState } from 'react';
import { TdDrawerProps } from '../type';
import { Styles } from '../../common';
import { getSizeDraggable, calcMoveSize } from '../../_common/js/drawer/utils';

const useDrag = (
  placement: TdDrawerProps['placement'],
  sizeDraggable: TdDrawerProps['sizeDraggable'],
  onSizeDragEnd: TdDrawerProps['onSizeDragEnd'],
) => {
  const [dragSizeValue, changeDragSizeValue] = useState<string>(null);

  const handleMousemove = (e: MouseEvent) => {
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

    const { allowSizeDraggable, max: limitMax, min: limitMin } = getSizeDraggable(sizeDraggable, { max, min });

    if (!allowSizeDraggable) return;

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
  };
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
  const handleMouseup = (e: MouseEvent) => {
    document.removeEventListener('mouseup', handleMouseup, true);
    document.removeEventListener('mousemove', handleMousemove, true);
    onSizeDragEnd?.({
      e,
      size: parseInt(dragSizeValue, 10),
    });
  };

  const enableDrag = () => {
    // mousedown绑定mousemove和mouseup事件
    document.addEventListener('mouseup', handleMouseup, true);
    document.addEventListener('mousemove', handleMousemove, true);
  };

  return { dragSizeValue, enableDrag, draggableLineStyles };
};

export default useDrag;

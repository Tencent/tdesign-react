import { useMemo, useState } from 'react';
import { TdDrawerProps } from '../type';
import { Styles } from '../../common';

const useDrag = (placement: TdDrawerProps['placement'], sizeDraggable: TdDrawerProps['sizeDraggable']) => {
  const [dragSizeValue, changeDragSizeValue] = useState<string>(null);

  const handleMousemove = (e: MouseEvent) => {
    // 鼠标移动时计算draggedSizeValue的值
    const { x, y } = e;
    if (sizeDraggable) {
      if (placement === 'right') {
        changeDragSizeValue(`${document.documentElement.clientWidth - x + 8}px`);
      }
      if (placement === 'left') {
        changeDragSizeValue(`${x + 8}px`);
      }
      if (placement === 'top') {
        changeDragSizeValue(`${y + 8}px`);
      }
      if (placement === 'bottom') {
        changeDragSizeValue(`${document.documentElement.clientHeight - y + 8}px`);
      }
    }
  };
  const handleMouseup = () => {
    document.removeEventListener('mouseup', handleMouseup, true);
    document.removeEventListener('mousemove', handleMousemove, true);
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

  const enableDrag = () => {
    // mousedown绑定mousemove和mouseup事件
    document.addEventListener('mouseup', handleMouseup, true);
    document.addEventListener('mousemove', handleMousemove, true);
  };

  return { dragSizeValue, enableDrag, draggableLineStyles };
};

export default useDrag;

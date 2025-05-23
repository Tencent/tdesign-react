export default function useDialogDrag(props) {
  const { contentClickRef, dialogCardRef, canDraggable } = props;
  const validWindow = typeof window === 'object';

  const screenHeight = validWindow ? window.innerHeight || document.documentElement.clientHeight : undefined;
  const screenWidth = validWindow ? window.innerWidth || document.documentElement.clientWidth : undefined;

  let dialogOffset = { x: 0, y: 0 };
  // 拖拽代码实现部分
  const onDialogMove = (e: MouseEvent) => {
    const { style, offsetWidth, offsetHeight } = dialogCardRef.current;

    let diffX = e.clientX - dialogOffset.x;
    let diffY = e.clientY - dialogOffset.y;
    // 拖拽上左边界限制
    if (diffX < 0) diffX = 0;
    if (diffY < 0) diffY = 0;
    if (screenWidth - offsetWidth - diffX < 0) diffX = screenWidth - offsetWidth;
    if (screenHeight - offsetHeight - diffY < 0) diffY = screenHeight - offsetHeight;
    style.position = 'absolute';
    style.left = `${diffX}px`;
    style.top = `${diffY}px`;
  };

  const onDialogMoveEnd = () => {
    dialogCardRef.current.style.cursor = 'default';
    document.removeEventListener('mousemove', onDialogMove);
    document.removeEventListener('mouseup', onDialogMoveEnd);
  };

  const onDialogMoveStart = (e: React.MouseEvent<HTMLDivElement>) => {
    contentClickRef.current = true;
    // 阻止事件冒泡
    if (canDraggable && e.currentTarget === e.target) {
      const { offsetLeft, offsetTop, offsetHeight, offsetWidth } = dialogCardRef.current;
      // 如果弹出框超出屏幕范围 不能进行拖拽
      if (offsetWidth > screenWidth || offsetHeight > screenHeight) return;
      dialogCardRef.current.style.cursor = 'move';
      // 计算鼠标
      const diffX = e.clientX - offsetLeft;
      const diffY = e.clientY - offsetTop;
      dialogOffset = {
        x: diffX,
        y: diffY,
      };

      document.addEventListener('mousemove', onDialogMove);
      document.addEventListener('mouseup', onDialogMoveEnd);
    }
  };

  return {
    onDialogMoveStart,
    onDialogMove,
    onDialogMoveEnd,
  };
}

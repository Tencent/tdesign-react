import { MutableRefObject, useCallback, useEffect, useRef } from 'react';

const dialogStack: MutableRefObject<HTMLDivElement>[] = [];

const useDialogEsc = (visible: boolean, dialog: MutableRefObject<HTMLDivElement>) => {
  const addedToStackRef = useRef<boolean>(false);

  // 关闭动画完成后调用，聚焦顶层 dialog
  const focusTopDialog = useCallback(() => {
    const lastDialog = dialogStack[dialogStack.length - 1];
    if (lastDialog?.current) {
      lastDialog.current.focus();
    }
  }, []);

  // 每次渲染都执行，确保捕捉到的 current 不为 null
  useEffect(() => {
    if (visible && dialog?.current && !addedToStackRef.current) {
      dialogStack.push(dialog);
      addedToStackRef.current = true;
      dialog.current.focus();
    }
  });

  // 处理 visible 变化
  useEffect(() => {
    if (!visible && addedToStackRef.current) {
      const index = dialogStack.indexOf(dialog);
      if (index > -1) {
        dialogStack.splice(index, 1);
      }
      addedToStackRef.current = false;
    }

    return () => {
      // 清理无效的 dialog
      for (let i = dialogStack.length - 1; i >= 0; i--) {
        if (dialogStack[i].current === null) {
          dialogStack.splice(i, 1);
        }
      }
    };
  }, [visible, dialog]);

  return { focusTopDialog };
};

export default useDialogEsc;

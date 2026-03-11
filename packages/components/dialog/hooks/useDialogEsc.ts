import { type MutableRefObject, useCallback, useEffect, useRef } from 'react';

const dialogStack: MutableRefObject<HTMLDivElement>[] = [];

const useDialogEsc = (visible: boolean, dialog: MutableRefObject<HTMLDivElement>) => {
  const addedToStackRef = useRef<boolean>(false);

  const focusTopDialog = useCallback(() => {
    const lastDialog = dialogStack[dialogStack.length - 1];
    if (lastDialog?.current) {
      lastDialog.current.focus();
    }
  }, []);

  const activateDialog = useCallback(() => {
    if (dialog?.current && !addedToStackRef.current) {
      dialogStack.push(dialog);
      addedToStackRef.current = true;
      focusTopDialog();
    }
  }, [dialog, focusTopDialog]);

  useEffect(() => {
    if (!visible && addedToStackRef.current) {
      const index = dialogStack.indexOf(dialog);
      if (index > -1) {
        dialogStack.splice(index, 1);
      }
      addedToStackRef.current = false;
      focusTopDialog();
    }

    return () => {
      // 清理无效的 dialog
      for (let i = dialogStack.length - 1; i >= 0; i--) {
        if (dialogStack[i].current === null) {
          dialogStack.splice(i, 1);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return { activateDialog };
};

export default useDialogEsc;

import { useEffect, MutableRefObject } from 'react';

const dialogSet: Set<MutableRefObject<HTMLDivElement>> = new Set();

const useDialogEsc = (visible: boolean, dialog: MutableRefObject<HTMLDivElement>) => {
  useEffect(() => {
    if (visible) {
      // 将 dialog 添加至 Set 对象
      if (dialog?.current) {
        dialogSet.add(dialog);
        dialog?.current?.focus();
      }
    } else if (dialogSet.has(dialog)) {
      // 将 dialog 从 Set 对象删除
      dialogSet.delete(dialog);
      const dialogList = [...dialogSet];
      // 将 Set 对象中最后一个 dialog 设置为 focus
      dialogList[dialogList.length - 1]?.current?.focus();
    }
    return () => {
      // 从 Set 对象删除无效的 dialog
      dialogSet.forEach((item) => {
        if (item.current === null) {
          dialogSet.delete(item);
        }
      });
    };
  }, [visible, dialog]);
};

export default useDialogEsc;

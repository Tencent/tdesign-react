import type { PopupVisibleChangeContext } from '../popup';
import useConfig from './useConfig';

function useInnerPopupVisible(handler: (visible: boolean, ctx: PopupVisibleChangeContext) => void) {
  const { classPrefix } = useConfig();

  const isClearIconClick = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof Element)) return false;
    return !!(
      target?.closest?.(`.${classPrefix}-input__suffix-clear`) ||
      target?.closest?.(`.${classPrefix}-tag-input__suffix-clear`) ||
      target?.closest?.(`.${classPrefix}-range-input__suffix-clear`)
    );
  };

  return (visible: boolean, ctx: PopupVisibleChangeContext) => {
    // Fix: https://github.com/Tencent/tdesign-react/issues/2320
    // 点击 clear icon 是否触发 Popup 显隐切换的逻辑交给具体逻辑自己处理，避免重复触发
    if (isClearIconClick(ctx?.e?.target) && visible) return;
    // 执行原函数
    handler(visible, ctx);
  };
}

export default useInnerPopupVisible;

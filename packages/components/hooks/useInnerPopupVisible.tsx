import useConfig from './useConfig';
import type { PopupVisibleChangeContext } from '../popup';

function useInnerPopupVisible(handler: (visible: boolean, ctx: PopupVisibleChangeContext) => void) {
  const { classPrefix } = useConfig();

  // fix: https://github.com/Tencent/tdesign-react/issues/2320
  // 点击 clear icon 是否触发 Popup 显隐切换的逻辑交给具体逻辑自己处理，避免重复触发
  const clearSelectors = [
    `.${classPrefix}-input__suffix-clear`,
    `.${classPrefix}-tag-input__suffix-clear`,
    `.${classPrefix}-range-input__suffix-clear`,
  ];

  // fix: https://github.com/Tencent/tdesign-react/issues/4157
  const tagCloseSelector = `.${classPrefix}-tag__icon-close`;

  const isMatchSelector = (target: EventTarget | null, selectors: string | string[]): boolean => {
    if (!(target instanceof Element)) return false;
    const list = Array.isArray(selectors) ? selectors : [selectors];
    return list.some((selector) => target.closest(selector));
  };

  return (visible: boolean, ctx: PopupVisibleChangeContext) => {
    const target = ctx?.e?.target;

    if (visible && isMatchSelector(target, clearSelectors)) return;
    if (visible && isMatchSelector(target, tagCloseSelector)) return;

    // 执行原函数
    handler(visible, ctx);
  };
}

export default useInnerPopupVisible;

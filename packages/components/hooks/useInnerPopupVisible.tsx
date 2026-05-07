import { useCallback } from 'react';
import useConfig from './useConfig';

import type { PopupVisibleChangeContext } from '../popup';

function useInnerPopupVisible(handler: (visible: boolean, ctx: PopupVisibleChangeContext) => void) {
  const { classPrefix } = useConfig();

  const ignoreSelectors = [
    // fix: https://github.com/Tencent/tdesign-react/issues/2320
    // 点击 clear icon 是否触发 Popup 显隐切换的逻辑交给具体逻辑自己处理，避免重复触发
    `.${classPrefix}-input__suffix-clear`,
    `.${classPrefix}-tag-input__suffix-clear`,
    `.${classPrefix}-range-input__suffix-clear`,
    // fix: https://github.com/Tencent/tdesign-react/issues/4157
    `.${classPrefix}-tag__icon-close`,
  ];

  const shouldIgnore = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return ignoreSelectors.some((selector) => target.closest(selector));
  };

  return useCallback(
    (visible: boolean, ctx: PopupVisibleChangeContext) => {
      const target = ctx?.e?.target;
      if (visible && shouldIgnore(target)) return;
      // 执行原函数
      handler(visible, ctx);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handler],
  );
}

export default useInnerPopupVisible;

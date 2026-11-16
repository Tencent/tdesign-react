import { useEffect } from 'react';
import { bindRipple } from '@tdesign/common-js/utils/ripple';

import useAnimation from './useAnimation';
import useConfig from './useConfig';
import useLatest from './useLatest';

/**
 * 为节点挂上斜八角按压波纹动画。
 * 波纹颜色优先使用参数 `rippleColor`。
 * 未传入时依次读取节点的 `data-ripple` 和 CSS 变量 `--ripple-color`。
 */
export default function useRipple(el: HTMLElement, rippleColor?: string): void {
  const { classPrefix } = useConfig();
  const { keepRipple } = useAnimation();
  const optionsRef = useLatest({
    classPrefix,
    enable: keepRipple,
    rippleColor,
  });

  useEffect(() => {
    if (!el) return undefined;
    return bindRipple(el, () => optionsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [el]);
}

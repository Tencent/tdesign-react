import { useCallback } from 'react';

import { EAnimationType } from '../config-provider/ConfigContext';
import useConfig from './useConfig';

export default function useAnimation() {
  const { animation } = useConfig();
  const { expand, ripple, fade } = EAnimationType;

  const keepAnimation = useCallback(
    (type: EAnimationType) => animation && !animation.exclude?.includes(type) && animation.include?.includes(type),
    [animation],
  );

  return {
    keepExpand: keepAnimation(expand),
    keepRipple: keepAnimation(ripple),
    keepFade: keepAnimation(fade),
  };
}

import { useCallback } from 'react';
import useConfig from '../hooks/useConfig';
import { EAnimationType } from '../config-provider/ConfigContext';

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

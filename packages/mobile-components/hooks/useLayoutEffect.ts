import { useLayoutEffect, useEffect } from 'react';
import { canUseDOM } from '../_util/dom';

const useIsomorphicLayoutEffect = canUseDOM() ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;

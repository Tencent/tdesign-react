import { useLayoutEffect, useEffect } from 'react';
import { canUseDocument } from '../_util/dom';

const useIsomorphicLayoutEffect = canUseDocument ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;

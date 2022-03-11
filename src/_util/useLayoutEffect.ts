import { useLayoutEffect, useEffect } from 'react';
import { canUseDocument } from './dom';

const useIsomorphicLayoutEffect = canUseDocument ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;

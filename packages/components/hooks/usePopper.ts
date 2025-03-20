// https://github.com/floating-ui/react-popper/blob/master/src/usePopper.js
// React popper was archived by the owner on Dec 6, 2024.
// to maintain this hook in the repo since upgrading to support React 19.0
import { useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  createPopper as defaultCreatePopper,
  type Options as PopperOptions,
  type VirtualElement,
  type State as PopperState,
  type Instance as PopperInstance,
} from '@popperjs/core';

import isEqual from 'react-fast-compare';
import useIsomorphicLayoutEffect from './useLayoutEffect';
import type { Styles } from '../common';

type Options = Partial<
  PopperOptions & {
    createPopper: typeof defaultCreatePopper;
  }
>;

type Attributes = {
  [key: string]: { [key: string]: string };
};

type State = {
  styles: Record<string, Styles>;
  attributes: Attributes;
};

const EMPTY_MODIFIERS = [];

type UsePopperResult = {
  state?: PopperState;
  styles: Styles;
  attributes: Attributes;
  update: PopperInstance['update'];
  forceUpdate: PopperInstance['forceUpdate'];
};

const fromEntries = (entries: Array<[string, any]>): { [key: string]: any } =>
  entries.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

const usePopper = (
  referenceElement?: Element | VirtualElement,
  popperElement?: HTMLElement,
  options: Options = {},
): UsePopperResult => {
  const prevOptions = useRef<PopperOptions>(null);

  const optionsWithDefaults = {
    onFirstUpdate: options.onFirstUpdate,
    placement: options.placement || 'bottom',
    strategy: options.strategy || 'absolute',
    modifiers: options.modifiers || EMPTY_MODIFIERS,
  };

  const [state, setState] = useState<State>({
    styles: {
      popper: {
        position: optionsWithDefaults.strategy,
        left: '0',
        top: '0',
      },
      arrow: {
        position: 'absolute',
      },
    },
    attributes: {},
  });

  const updateStateModifier = useMemo(
    () => ({
      name: 'updateState',
      enabled: true,
      phase: 'write',
      fn: ({ state }) => {
        const elements = Object.keys(state.elements);

        flushSync(() => {
          setState({
            styles: fromEntries(elements.map((element) => [element, state.styles[element] || {}])),
            attributes: fromEntries(elements.map((element) => [element, state.attributes[element]])),
          });
        });
      },
      requires: ['computeStyles'],
    }),
    [],
  );

  const popperOptions = useMemo(() => {
    const newOptions = {
      onFirstUpdate: optionsWithDefaults.onFirstUpdate,
      placement: optionsWithDefaults.placement,
      strategy: optionsWithDefaults.strategy,
      modifiers: [...optionsWithDefaults.modifiers, updateStateModifier, { name: 'applyStyles', enabled: false }],
    };

    if (isEqual(prevOptions.current, newOptions)) {
      return prevOptions.current || newOptions;
    }
    prevOptions.current = newOptions;
    return newOptions;
  }, [
    optionsWithDefaults.onFirstUpdate,
    optionsWithDefaults.placement,
    optionsWithDefaults.strategy,
    optionsWithDefaults.modifiers,
    updateStateModifier,
  ]);

  const popperInstanceRef = useRef(null);

  useIsomorphicLayoutEffect(() => {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.setOptions(popperOptions);
    }
  }, [popperOptions]);

  useIsomorphicLayoutEffect(() => {
    if (referenceElement == null || popperElement == null) {
      return;
    }

    const createPopper = options.createPopper || defaultCreatePopper;
    const popperInstance = createPopper(referenceElement, popperElement, popperOptions);

    popperInstanceRef.current = popperInstance;

    return () => {
      popperInstance.destroy();
      popperInstanceRef.current = null;
    };
  }, [referenceElement, popperElement, options.createPopper]);

  return {
    state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
    styles: state.styles,
    attributes: state.attributes,
    update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
    forceUpdate: popperInstanceRef.current ? popperInstanceRef.current.forceUpdate : null,
  };
};

export default usePopper;

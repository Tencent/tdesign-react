// https://github.com/floating-ui/react-popper/blob/master/src/usePopper.js
// React popper was archived by the owner on Dec 6, 2024.
// to maintain this hook in the repo since upgrading to support React 19.0
import { useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import isEqual from 'react-fast-compare';
import {
  createPopper as defaultCreatePopper,
  type Instance,
  type Options as PopperOptions,
  type VirtualElement,
} from '@popperjs/core';

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

const fromEntries = (entries: Array<[string, any]>): { [key: string]: any } =>
  entries.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

export interface InnerInstance extends Instance {
  attributes: Attributes;
  styles: Record<string, Styles>;
}

const usePopper = (
  referenceElement?: Element | VirtualElement,
  popperElement?: HTMLElement,
  options: Options = {},
): InnerInstance => {
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

  const popperInstanceRef = useRef<Instance>(null);

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
    // 内部使用
    attributes: state.attributes,
    styles: state.styles,
    // 与官方 API 一致
    state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
    destroy: popperInstanceRef.current?.destroy,
    forceUpdate: popperInstanceRef.current?.forceUpdate,
    update: popperInstanceRef.current?.update,
    setOptions: popperInstanceRef.current?.setOptions,
  };
};

export default usePopper;

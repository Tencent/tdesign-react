import { isFunction, isString } from 'lodash-es';

import type { ScrollContainer, ScrollContainerElement } from '../common';

export function resolveContainer(getContainer: ScrollContainerElement | ScrollContainer): ScrollContainerElement {
  if (isString(getContainer)) {
    return getContainer ? (document.querySelector(getContainer) as HTMLElement) : window;
  }
  if (isFunction(getContainer)) {
    return getContainer();
  }
  return getContainer;
}

import { createPortal } from 'react-dom';

import { canUseDOM } from './dom';
import { resolveContainer } from './getContainer';

import type { ReactElement, ReactPortal } from 'react';

export type GetContainer = HTMLElement | (() => HTMLElement) | null;

export function renderToContainer(getContainer: GetContainer, node: ReactElement) {
  if (canUseDOM() && getContainer) {
    const container = resolveContainer(getContainer);
    return createPortal(node, container as Element) as ReactPortal;
  }
  return node;
}

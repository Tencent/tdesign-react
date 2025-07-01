// Implementation reference from: https://github.com/react-component/util/blob/master/src/React/render.ts
/* eslint-disable no-param-reassign */

import type * as React from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';

const MARK = '__td_react_root__';

// ========================== Render ==========================
type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root;
};

type LegacyCreateRoot = typeof createRoot;

let legacyCreateRoot: LegacyCreateRoot = createRoot;

export function render(node: React.ReactElement, container: ContainerType) {
  const root = container[MARK] || legacyCreateRoot(container);

  root.render(node);

  container[MARK] = root;
}

// ========================= Unmount ==========================
export async function unmount(container: ContainerType) {
  // Delay to unmount to avoid React 18 sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount();

    delete container[MARK];
  });
}

/**
 * @deprecated Set React render function for compatible usage.
 * This is internal usage only compatible with React 19.
 * And will be removed in next major version.
 */
export function unstableSetRender(render?: LegacyCreateRoot) {
  if (render) {
    legacyCreateRoot = render;
  }
}

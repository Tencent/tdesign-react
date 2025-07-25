// Implementation reference from: https://github.com/react-component/util/blob/master/src/React/render.ts
// @ts-ignore
import type * as React from 'react';
import * as ReactDOM from 'react-dom';
import type { Root } from 'react-dom/client';

// Let compiler not to search module usage
const fullClone = {
  ...ReactDOM,
} as typeof ReactDOM & {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: {
    usingClientEntryPoint?: boolean;
  };
  createRoot?: CreateRoot;
};

type CreateRoot = (container: ContainerType) => Root;

// @ts-ignore
const { version, render: reactRender, unmountComponentAtNode } = fullClone;

let legacyCreateRoot: CreateRoot;
try {
  const mainVersion = Number((version || '').split('.')[0]);
  if (mainVersion >= 18 && mainVersion < 19) {
    legacyCreateRoot = fullClone.createRoot;
  }
  if (process.env.NODE_ENV !== 'production' && mainVersion >= 19) {
    console.warn(
      'TDesign warning: Please import react-19-adapter in React 19, See link: https://github.com/Tencent/tdesign-react/blob/develop/packages/tdesign-react/site/docs/getting-started.md#如何在-react-19-中使用',
    );
  }
} catch (e) {
  // Do nothing;
}

function toggleWarning(skip: boolean) {
  const { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } = fullClone;

  if (
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED &&
    typeof __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED === 'object'
  ) {
    __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.usingClientEntryPoint = skip;
  }
}

const MARK = '__td_react_root__';

// ========================== Render ==========================
type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root;
};

function modernRender(node: React.ReactElement, container: ContainerType) {
  toggleWarning(true);
  const root = container[MARK] || legacyCreateRoot(container);
  toggleWarning(false);

  root.render(node);

  // eslint-disable-next-line
  container[MARK] = root;
}

function legacyRender(node: React.ReactElement, container: ContainerType) {
  reactRender(node, container);
}

export function render(node: React.ReactElement, container: ContainerType) {
  if (legacyCreateRoot) {
    modernRender(node, container);
    return;
  }

  legacyRender?.(node, container);
}

// ========================= Unmount ==========================
async function modernUnmount(container: ContainerType) {
  // Delay to unmount to avoid React 18 sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount();

    // eslint-disable-next-line
    delete container[MARK];
  });
}

function legacyUnmount(container: ContainerType) {
  unmountComponentAtNode(container);
}

export async function unmount(container: ContainerType) {
  if (legacyCreateRoot !== undefined) {
    // Delay to unmount to avoid React 18 sync warning
    return modernUnmount(container);
  }

  legacyUnmount(container);
}

/**
 * @deprecated Set React render function for compatible usage.
 * This is internal usage only compatible with React 19.
 * And will be removed in next major version.
 */
export function renderAdapter(render?: CreateRoot) {
  if (render) {
    legacyCreateRoot = render;
  }
}

import { ReactElement } from 'react';
import { render, unmount as unMount } from './react-render';

export function renderToBody(element: ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  function unmount() {
    const unmountResult = unMount(container);
    if (unmountResult && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
  render(element, container);
  return unmount;
}

export default renderToBody;

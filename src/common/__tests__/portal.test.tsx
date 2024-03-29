import React from 'react';
import { renderToString } from 'react-dom/server';
import { render } from '@test/utils';
import Portal from '../Portal';

describe('Portal', () => {
  test('Portal render', () => {
    const { unmount } = render(
      <Portal>
        <div id="portal">Hello World</div>
      </Portal>,
    );

    expect(document.querySelector('#portal')).not.toBeNull();
    expect(document.querySelector('#portal')).toBeInTheDocument();
    unmount();
    expect(document.querySelector('#portal')).toBeNull();
  });

  test('Portal ssr render', () => {
    const renderOnServer = () =>
      renderToString(
        <Portal>
          <div id="portal">Hello World</div>
        </Portal>,
      );

    // 目前test会出错，待后续添加lazy可support ssr
    expect(renderOnServer).toThrow();
  });
});

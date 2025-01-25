import React from 'react';
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
});

import React from 'react';
import { render } from '@test/utils';

import { CheckTag } from '..';

describe('CheckTag', () => {
  describe('props', () => {
    test('content and children', () => {
      const node = <span className="custom-node">TNode</span>;
      const contentWrapper = render(<CheckTag content={node} />);
      const childrenWrapper = render(<CheckTag>{node}</CheckTag>);

      expect(contentWrapper.container.querySelector('.custom-node')).toBeTruthy();
      expect(childrenWrapper.container.querySelector('.custom-node')).toBeTruthy();
    });
  });
});

import React from 'react';
import { render } from '@test/utils';

import { CheckTag } from '..';

describe('CheckTag', () => {
  describe('slots', () => {
    test('children', () => {
      const { container } = render(
        <CheckTag>
          <span className="custom-node">TNode</span>
        </CheckTag>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('content', () => {
      const { container } = render(<CheckTag content={<span className="custom-node">TNode</span>}></CheckTag>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });
  });
});

import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { BackTop } from '..';

import type { TdBackTopProps } from '../type';

describe('BackTop', () => {
  describe('props', () => {
    (['circle', 'square'] as TdBackTopProps['shape'][]).forEach((item) => {
      test(`shape[${item}]`, () => {
        const { container } = render(<BackTop shape={item}></BackTop>);
        expect(container.firstChild).toHaveClass(`t-back-top--${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    const sizeClassNameList = ['t-size-m', 't-size-s'];
    (['medium', 'small'] as TdBackTopProps['size'][]).forEach((item, index) => {
      test(`size[${item}]`, () => {
        const { container } = render(<BackTop size={item}>BackTop</BackTop>);
        expect(container.firstChild).toHaveClass(sizeClassNameList[index]);
        expect(container).toMatchSnapshot();
      });
    });

    (['light', 'primary', 'dark'] as TdBackTopProps['theme'][]).forEach((item) => {
      test(`theme[${item}]`, () => {
        const { container } = render(<BackTop theme={item}>Text</BackTop>);
        expect(container.firstChild).toHaveClass(`t-back-top--theme-${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    test('content, children and default', () => {
      const node = <span className="custom-node">TNode</span>;
      const contentWrapper = render(<BackTop content={node} />);
      const childrenWrapper = render(<BackTop>{node}</BackTop>);
      const defaultWrapper = render(<BackTop default={node} />);

      [contentWrapper, childrenWrapper, defaultWrapper].forEach(({ container }) => {
        expect(container.querySelector('.custom-node')).toBeTruthy();
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('events', () => {
    test('onClick', () => {
      const fn = vi.fn();
      const { container } = render(<BackTop onClick={fn}></BackTop>);
      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].e.stopPropagation).toBeTruthy();
      expect(fn.mock.calls[0][0].e.type).toBe('click');
    });
  });
});

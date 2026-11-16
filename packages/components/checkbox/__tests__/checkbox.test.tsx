import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import Checkbox from '../Checkbox';

describe('Checkbox', () => {
  describe('props', () => {
    test('defaultChecked', () => {
      const { container } = render(<Checkbox defaultChecked={true}></Checkbox>);
      expect(container.firstChild).toHaveClass('t-checkbox', 't-is-checked');
    });

    test('indeterminate', () => {
      const { container } = render(<Checkbox indeterminate={true}></Checkbox>);
      expect(container.firstChild).toHaveClass('t-is-indeterminate');
    });

    test('label', () => {
      const { queryByText } = render(<Checkbox label="选中项"></Checkbox>);
      expect(queryByText('选中项')).toBeInTheDocument();
    });

    test('checked and children', () => {
      const { container, queryByText } = render(<Checkbox checked={true}>选中项</Checkbox>);
      expect(container.firstChild).toHaveClass('t-checkbox', 't-is-checked');
      expect(queryByText('选中项')).toBeInTheDocument();
    });

    test('disabled', () => {
      const { container } = render(<Checkbox disabled={true}></Checkbox>);
      expect(container.firstChild).toHaveClass('t-is-disabled');
    });
  });

  describe('events', () => {
    test('onChange', () => {
      const fn = vi.fn();
      const { container } = render(<Checkbox disabled={true} onChange={fn}></Checkbox>);
      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalledTimes(0);
    });
  });
});

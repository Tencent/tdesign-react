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

  describe('keyboard', () => {
    test('Space toggles the unchecked checkbox', () => {
      const onChange = vi.fn();
      const { container } = render(<Checkbox onChange={onChange}>选项</Checkbox>);
      const label = container.querySelector('label');
      label.focus();

      fireEvent.keyDown(label, { key: ' ' });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(container.firstChild).toHaveClass('t-is-checked');

      fireEvent.keyDown(label, { key: ' ' });
      expect(onChange).toHaveBeenCalledTimes(2);
      expect(container.firstChild).not.toHaveClass('t-is-checked');
    });

    test('Space works for controlled checkbox', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Checkbox checked={false} onChange={onChange}>
          选项
        </Checkbox>,
      );
      const label = container.querySelector('label');
      label.focus();

      fireEvent.keyDown(label, { key: ' ' });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0]).toBe(true);
    });

    test('Space does not toggle a disabled checkbox', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Checkbox disabled onChange={onChange}>
          选项
        </Checkbox>,
      );
      const label = container.querySelector('label');

      fireEvent.keyDown(label, { key: ' ' });
      expect(onChange).toHaveBeenCalledTimes(0);
      expect(container.firstChild).not.toHaveClass('t-is-checked');
    });

    test('Enter does not toggle the checkbox', () => {
      const onChange = vi.fn();
      const { container } = render(<Checkbox onChange={onChange}>选项</Checkbox>);
      const label = container.querySelector('label');
      label.focus();

      fireEvent.keyDown(label, { key: 'Enter' });
      expect(onChange).toHaveBeenCalledTimes(0);
    });

    test('onKeyDown prop is still called', () => {
      const onKeyDown = vi.fn();
      const { container } = render(<Checkbox onKeyDown={onKeyDown}>选项</Checkbox>);
      const label = container.querySelector('label');

      fireEvent.keyDown(label, { key: 'a' });
      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });
});

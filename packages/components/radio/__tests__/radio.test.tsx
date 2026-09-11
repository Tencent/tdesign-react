import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { Radio } from '..';

describe('Radio', () => {
  describe('props', () => {
    test('allowUncheck', () => {
      const onChangeFn = vi.fn();
      const { container } = render(<Radio checked={true} allowUncheck={true} onChange={onChangeFn}></Radio>);
      fireEvent.click(container.firstChild);
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0]).toBe(false);
      expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
    });

    test('checked', () => {
      // checked default value is false
      const { container: container1 } = render(<Radio></Radio>);
      expect(container1.querySelector(`.${'t-is-checked'}`)).toBeFalsy();
      // checked = true
      const { container: container2 } = render(<Radio checked={true}></Radio>);
      expect(container2.firstChild).toHaveClass('t-is-checked');
      expect(container2).toMatchSnapshot();
      // checked = false
      const { container: container3 } = render(<Radio checked={false}></Radio>);
      expect(container3.querySelector(`.${'t-is-checked'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    test('checked is equal to true', () => {
      const { container } = render(<Radio checked={true}></Radio>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.checked).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('disabled', () => {
      // disabled default value is undefined
      const { container: container1 } = render(<Radio>Text</Radio>);
      expect(container1.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      // disabled = true
      const { container: container2 } = render(<Radio disabled={true}>Text</Radio>);
      expect(container2.firstChild).toHaveClass('t-is-disabled');
      expect(container2).toMatchSnapshot();
      // disabled = false
      const { container: container3 } = render(<Radio disabled={false}>Text</Radio>);
      expect(container3.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    test('disabled can not trigger change', () => {
      const onChangeFn = vi.fn();
      const { container } = render(
        <Radio disabled={true} onChange={onChangeFn}>
          Text
        </Radio>,
      );
      fireEvent.click(container.firstChild);
      expect(onChangeFn).not.toHaveBeenCalled();
    });

    test('name', () => {
      const wrapper = render(<Radio name="radio-gender-name"></Radio>);
      const container = wrapper.container.querySelector('input');
      expect(container.getAttribute('name')).toBe('radio-gender-name');
    });

    test(`value is equal to 'radio-value'`, () => {
      const { container } = render(<Radio value="radio-value"></Radio>);
      const domWrapper = container.querySelector('input');
      expect(domWrapper.value).toBe('radio-value');
    });

    test('defaultChecked', () => {
      const { container } = render(<Radio defaultChecked={true}></Radio>);
      expect(container.firstChild).toHaveClass('t-radio', 't-is-checked');
    });

    test('allowUncheck stays checked', () => {
      const { container } = render(<Radio allowUncheck={true} checked={true} />);
      fireEvent.click(container.firstChild);
      expect(container.firstChild).toHaveClass('t-radio', 't-is-checked');
    });
  });

  describe('events', () => {
    test('click', () => {
      const onClickFn = vi.fn();
      const { container } = render(<Radio onClick={onClickFn}></Radio>);
      fireEvent.click(container.firstChild);
      expect(onClickFn).toHaveBeenCalled();
      expect(onClickFn.mock.calls[0][0].e.stopPropagation).toBeTruthy();
    });

    test('onChange', () => {
      const fn = vi.fn();
      const { container } = render(<Radio disabled={true} onChange={fn} />);
      fireEvent.click(container.firstElementChild);
      expect(fn).toHaveBeenCalledTimes(0);
    });
  });

  describe('slots', () => {
    test('children', () => {
      const { container } = render(
        <Radio>
          <span className="custom-node">TNode</span>
        </Radio>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('label', () => {
      const { container } = render(<Radio label={<span className="custom-node">TNode</span>}></Radio>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-radio__label')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('label text', () => {
      const { queryByText } = render(<Radio label="选中项" />);
      expect(queryByText('选中项')).toBeInTheDocument();
    });
  });

  describe('scenarios', () => {
    test('checked & children', () => {
      const { container, queryByText } = render(<Radio checked={true}>单选框</Radio>);
      expect(container.firstChild).toHaveClass('t-radio', 't-is-checked');
      expect(queryByText('单选框')).toBeInTheDocument();
    });

    test('disable', () => {
      const fn = vi.fn();
      const { container } = render(<Radio disabled={true} onChange={fn}></Radio>);
      expect(container.firstChild).toHaveClass('t-is-disabled', 't-radio');
      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalledTimes(0);
    });
  });
});

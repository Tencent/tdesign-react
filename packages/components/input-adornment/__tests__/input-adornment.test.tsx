import React from 'react';
import { render, simulateInputChange, vi } from '@test/utils';

import Input from '../../input';
import InputAdornment from '../index';

import type { TNode } from '../../common';
import type { InputAdornmentProps } from '../InputAdornment';

function mountInputAdornment(props: InputAdornmentProps = {}) {
  return render(
    <InputAdornment {...props}>
      <Input placeholder="input-adornment-test" />
    </InputAdornment>,
  );
}

describe('InputAdornment', () => {
  describe('props', () => {
    test('append[string]', () => {
      const { container } = mountInputAdornment({ append: '.com' });
      const append = container.querySelector('.t-input-adornment__append');
      expect(append).toBeTruthy();
      expect(append?.querySelector('.t-input-adornment__text')).toHaveTextContent('.com');
    });

    test('append[TNode]', () => {
      const { container } = mountInputAdornment({
        append: <span className="custom-append">suffix</span>,
      });
      expect(container.querySelector('.t-input-adornment__append .custom-append')).toBeTruthy();
    });

    test('prepend[string]', () => {
      const { container } = mountInputAdornment({ prepend: 'http://' });
      const prepend = container.querySelector('.t-input-adornment__prepend');
      expect(prepend).toBeTruthy();
      expect(prepend?.querySelector('.t-input-adornment__text')).toHaveTextContent('http://');
      expect(container.querySelector('.t-input')).toBeTruthy();
    });

    test('prepend[number]', () => {
      const { container } = mountInputAdornment({ prepend: 8080 });
      expect(container.querySelector('.t-input-adornment__prepend .t-input-adornment__text')).toHaveTextContent('8080');
    });

    test('prepend[TNode]', () => {
      const { container } = mountInputAdornment({
        prepend: <span className="custom-prepend">prefix</span>,
      });
      const prepend = container.querySelector('.t-input-adornment__prepend');
      expect(prepend?.querySelector('.custom-prepend')).toBeTruthy();
      expect(prepend?.querySelector('.t-input-adornment__text')).toBeFalsy();
    });

    test('prepend[function]', () => {
      const fn = vi.fn(() => <b className="fn-prepend">fn</b>);
      const { container } = mountInputAdornment({
        prepend: fn as unknown as TNode,
      });
      expect(fn).toHaveBeenCalled();
      expect(container.querySelector('.t-input-adornment__prepend .fn-prepend')).toBeTruthy();
    });

    test('prepend and append', () => {
      const { container } = mountInputAdornment({
        prepend: 'http://',
        append: '.com',
      });
      expect(container.querySelector('.t-input-adornment__prepend')).toBeTruthy();
      expect(container.querySelector('.t-input-adornment__append')).toBeTruthy();
      expect(container.querySelectorAll('.t-input-adornment__text')).toHaveLength(2);
    });

    test('children', () => {
      const { container } = render(
        <InputAdornment prepend="http://">
          <Input />
          <Input />
        </InputAdornment>,
      );
      expect(container.querySelectorAll('.t-input')).toHaveLength(2);
    });
  });

  describe('events', () => {
    test('onChange merges with child onChange', () => {
      const adornmentOnChange = vi.fn();
      const inputOnChange = vi.fn();
      const { container } = render(
        <InputAdornment onChange={adornmentOnChange}>
          <Input onChange={inputOnChange} />
        </InputAdornment>,
      );
      simulateInputChange(container.querySelector('input'), 'hello');
      expect(adornmentOnChange).toHaveBeenCalledTimes(1);
      expect(inputOnChange).toHaveBeenCalledTimes(1);
      expect(adornmentOnChange.mock.calls[0][0]).toBe('hello');
      expect(inputOnChange.mock.calls[0][0]).toBe('hello');
    });
  });
});

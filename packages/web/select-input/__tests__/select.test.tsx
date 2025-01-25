import React from 'react';
import { render, act } from '@test/utils';
import SelectInput from '../index';

describe('SelectInput Test', () => {
  test('label display', async () => {
    const text = 'test-label';
    const { getByText } = await render(<SelectInput label={text} />);

    act(() => {
      expect(getByText(text)).toBeTruthy();
    });
  });

  test('prefixIcon display', async () => {
    const text = 'test-prefixIcon';
    const { getByText } = await render(<SelectInput prefixIcon={<span>{text}</span>} />);

    act(() => {
      expect(getByText(text)).toBeTruthy();
    });
  });
});

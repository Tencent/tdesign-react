import React from 'react';
import { fireEvent, render, vi, waitFor } from '@test/utils';

import { Select } from '../index';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Orange', value: 'orange' },
];

test('does not select an option after the open Select becomes disabled', async () => {
  const onChange = vi.fn();
  const props = { options, defaultValue: 'apple', onChange };
  const { getByText, getByRole, rerender } = render(<Select {...props} />);
  fireEvent.click(getByRole('textbox'));
  await waitFor(() => expect(getByText('Orange')).toBeVisible());

  rerender(<Select {...props} disabled />);
  fireEvent.click(getByText('Orange'));
  expect(onChange).not.toHaveBeenCalled();
  expect(getByRole('textbox')).toHaveValue('Apple');
});

test('does not select all options after the open Select becomes disabled', async () => {
  const onChange = vi.fn();
  const props = {
    options: [{ label: 'All', value: 'all', checkAll: true }, ...options],
    onChange,
  };
  const { container, getByText, rerender } = render(<Select {...props} multiple defaultValue={['apple']} />);
  fireEvent.click(container.querySelector('.t-input'));
  await waitFor(() => expect(getByText('All')).toBeVisible());

  rerender(<Select {...props} multiple defaultValue={['apple']} disabled />);
  fireEvent.click(getByText('All'));
  expect(onChange).not.toHaveBeenCalled();
  expect(container.querySelector('.t-select')).toHaveTextContent('Apple');
  expect(container.querySelector('.t-select')).not.toHaveTextContent('Orange');
});

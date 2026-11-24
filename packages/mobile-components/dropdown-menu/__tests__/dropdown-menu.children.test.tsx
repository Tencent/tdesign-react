import React from 'react';
import { it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { DropdownMenu, DropdownItem } from '../index';

const productOptions = [
  { value: 'all', label: '全部产品', disabled: false },
  { value: 'new', label: '最新产品', disabled: false },
];

it('filters out non-element children and still renders DropdownItem', () => {
  const { queryByText, getByText } = render(
    <DropdownMenu>
      <div>plain-child</div>
      <DropdownItem label="渲染该项" options={productOptions} />
    </DropdownMenu>,
  );

  expect(queryByText('plain-child')).toBeNull();
  expect(getByText('渲染该项')).toBeTruthy();
});

it('filters out element children whose displayName does not match DropdownItem', () => {
  const Fake = () => <div>fake-child</div>;
  Fake.displayName = 'FakeComponent';

  const { queryByText } = render(
    <DropdownMenu>
      <Fake />
    </DropdownMenu>,
  );

  expect(queryByText('fake-child')).toBeNull();
});

it('renders gracefully when no children provided', () => {
  const { container } = render(<DropdownMenu />);
  expect(container.querySelector('.t-dropdown-menu')).toBeTruthy();
});

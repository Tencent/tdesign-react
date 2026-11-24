import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { DropdownMenu, DropdownItem, DropdownOption } from '../index';

const productOptions: DropdownOption[] = [
  { value: 'all', label: '全部产品', disabled: false },
  { value: 'new', label: '最新产品', disabled: false },
  { value: 'hot', label: '最火产品', disabled: false },
  { value: 'disabled', label: '禁用选项', disabled: true },
];

describe('DropdownItem clickaway behavior', () => {
  it('closes when closeOnClickOverlay is true', () => {
    const { getByText } = render(
      <DropdownMenu closeOnClickOverlay>
        <DropdownItem label="外部关闭" options={productOptions} />
      </DropdownMenu>,
    );

    const title = getByText('外部关闭');
    const item = title.parentElement as HTMLElement;

    // open
    fireEvent.click(title);
    expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(true);

    // click outside -> should close
    act(() => {
      document.body.click();
    });

    expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(false);
  });

  it('does not close when closeOnClickOverlay is false', () => {
    const { getByText } = render(
      <DropdownMenu closeOnClickOverlay={false}>
        <DropdownItem label="不关闭" options={productOptions} />
      </DropdownMenu>,
    );

    const title = getByText('不关闭');
    const item = title.parentElement as HTMLElement;

    // open
    fireEvent.click(title);
    expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(true);

    // click outside -> should NOT close because closeOnClickOverlay is false
    act(() => {
      document.body.click();
    });

    expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(true);
  });

  it('also respects simple option set and toggles active state', () => {
    const { getByText } = render(
      <DropdownMenu>
        <DropdownItem label="simple" options={productOptions} />
      </DropdownMenu>,
    );
    const title = getByText('simple');
    const item = title.parentElement as HTMLElement;
    fireEvent.click(title);
    expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(true);
    fireEvent.click(title);
    expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(false);
  });
});

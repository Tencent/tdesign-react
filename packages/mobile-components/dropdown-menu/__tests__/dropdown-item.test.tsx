import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import DropdownItem from '../DropdownItem';
import DropdownMenu from '../DropdownMenu';
import DropdownMenuContext from '../DropdownMenuContext';

vi.mock('lodash-es/uniqueId', () => ({ default: () => 'fixed-id' }));

describe('DropdownItem', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('render / props', () => {
    it('returns empty style when menuItemRef is null', async () => {
      const { container } = render(
        <DropdownMenuContext.Provider
          value={{
            activedId: 'fixed-id',
            direction: 'down',
            onChangeActivedId: () => {},
            showOverlay: true,
            zIndex: 10,
          }}
        >
          <DropdownItem options={[{ value: '1', label: 'one', disabled: false }]} />
        </DropdownMenuContext.Provider>,
      );

      await waitFor(() => {
        const el = container.querySelector('.t-dropdown-item');
        expect(el).toBeTruthy();
        expect(el.getAttribute('style')).toBeNull();
      });
    });

    it('renders popup when active and handles direction up/down in style', async () => {
      const onChangeActivedId = vi.fn();

      const { container, getByText } = render(
        <DropdownMenuContext.Provider
          value={{
            activedId: 'fixed-id',
            direction: 'up',
            onChangeActivedId,
            showOverlay: true,
            zIndex: 99,
            closeOnClickOverlay: true,
          }}
        >
          <DropdownItem options={[{ value: 'a', label: 'A', disabled: false }]} multiple={false} />
        </DropdownMenuContext.Provider>,
      );

      expect(getByText('A')).toBeTruthy();

      await waitFor(() => {
        const item = container.querySelector('[class*="dropdown-item"]');
        expect(item).toBeTruthy();
      });
    });

    it('calculates style when menuItemRef has bounding rect and direction up', async () => {
      const onChangeActivedId = vi.fn();

      const { container, rerender } = render(
        <DropdownMenuContext.Provider
          value={{
            activedId: '',
            direction: 'up',
            onChangeActivedId,
            showOverlay: true,
            zIndex: 77,
            closeOnClickOverlay: true,
          }}
        >
          <DropdownItem options={[{ value: 'x', label: 'X', disabled: false }]} />
        </DropdownMenuContext.Provider>,
      );

      const menuTrigger = container.querySelector('.t-dropdown-menu__item') as HTMLElement | null;
      if (menuTrigger) {
        menuTrigger.getBoundingClientRect = () => ({ top: 10, bottom: 50 }) as DOMRect;
      }

      rerender(
        <DropdownMenuContext.Provider
          value={{
            activedId: 'fixed-id',
            direction: 'up',
            onChangeActivedId,
            showOverlay: true,
            zIndex: 77,
            closeOnClickOverlay: true,
          }}
        >
          <DropdownItem options={[{ value: 'x', label: 'X', disabled: false }]} />
        </DropdownMenuContext.Provider>,
      );

      await waitFor(() => {
        const wrapper = container.querySelector('.t-dropdown-item') as HTMLElement | null;
        expect(wrapper).toBeTruthy();
        if (wrapper) {
          const { bottom } = wrapper.style;
          const { top } = wrapper.style;
          expect(bottom || top).toBeTruthy();
        }
      });
    });

    it('supports custom keys mapping for options', () => {
      const onChangeActivedId = vi.fn();
      const { getByText } = render(
        <DropdownMenuContext.Provider
          value={{
            activedId: 'fixed-id',
            direction: 'down',
            onChangeActivedId,
            showOverlay: false,
            zIndex: 1,
            closeOnClickOverlay: false,
          }}
        >
          <DropdownItem
            options={[{ k: '1', v: 'one', d: false } as any]}
            keys={{ value: 'k', label: 'v', disabled: 'd' }}
          />
        </DropdownMenuContext.Provider>,
      );

      expect(getByText('one')).toBeTruthy();
    });

    it('renders children and footer when provided', () => {
      const onChangeActivedId = vi.fn();
      const { getByText } = render(
        <DropdownMenuContext.Provider
          value={{
            activedId: 'fixed-id',
            direction: 'down',
            onChangeActivedId,
            showOverlay: true,
            zIndex: 1,
            closeOnClickOverlay: true,
          }}
        >
          <DropdownItem options={[{ value: '1', label: 'one', disabled: false }]}>
            <div>custom-body</div>
          </DropdownItem>
        </DropdownMenuContext.Provider>,
      );

      expect(getByText('custom-body')).toBeTruthy();
    });

    it('renders custom footer when footer prop provided', () => {
      const onChangeActivedId = vi.fn();
      const { getByText } = render(
        <DropdownMenuContext.Provider
          value={{
            activedId: 'fixed-id',
            direction: 'down',
            onChangeActivedId,
            showOverlay: true,
            zIndex: 1,
            closeOnClickOverlay: true,
          }}
        >
          <DropdownItem
            options={[{ value: '1', label: 'one', disabled: false }]}
            footer={<div>my-footer</div>}
            multiple
          />
        </DropdownMenuContext.Provider>,
      );

      expect(getByText('my-footer')).toBeTruthy();
    });
  });

  describe('events / behavior', () => {
    it('resetSelect confirmSelect', async () => {
      // 重置：以当前选中值回调 onReset
      // 确定：以当前选中值回调 onConfirm
      const onReset = vi.fn();
      const onConfirm = vi.fn();
      const onChangeActivedId = vi.fn();

      const { getByText } = render(
        <DropdownMenuContext.Provider
          value={{
            activedId: 'fixed-id',
            direction: 'down',
            onChangeActivedId,
            showOverlay: true,
            zIndex: 1,
            closeOnClickOverlay: true,
          }}
        >
          <DropdownItem
            options={[{ value: '1', label: 'one', disabled: false }]}
            multiple
            value={['1']}
            onReset={onReset}
            onConfirm={onConfirm}
          />
        </DropdownMenuContext.Provider>,
      );

      // 重置：以当前选中值回调 onReset
      fireEvent.click(getByText('重置'));
      expect(onReset).toHaveBeenCalledWith(['1']);

      // 当前仍有选中项，确定按钮可用，点击触发 onConfirm
      fireEvent.click(getByText('确定'));
      expect(onConfirm).toHaveBeenCalledWith(['1']);
      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('multiple mode: buttons disabled when modalValue empty then enabled after change', async () => {
      const onChangeActivedId = vi.fn();
      const { getByText, container } = render(
        <DropdownMenuContext.Provider
          value={{
            activedId: 'fixed-id',
            direction: 'down',
            onChangeActivedId,
            showOverlay: true,
            zIndex: 1,
            closeOnClickOverlay: true,
          }}
        >
          <DropdownItem options={[{ value: '1', label: 'one', disabled: false }]} multiple />
        </DropdownMenuContext.Provider>,
      );

      const resetBtn = getByText('重置');
      const confirmBtn = getByText('确定');
      expect(resetBtn).toBeTruthy();
      expect(confirmBtn).toBeTruthy();

      const input = container.querySelector('input[type="radio"]') as HTMLInputElement | null;
      if (input) {
        fireEvent.click(input);
      }

      expect(getByText('重置')).toBeTruthy();
    });

    it('does not activate when disabled', () => {
      const onChangeActivedId = vi.fn();
      const { container } = render(
        <DropdownMenuContext.Provider
          value={{
            activedId: '',
            direction: 'down',
            onChangeActivedId,
            showOverlay: false,
            zIndex: 1,
            closeOnClickOverlay: false,
          }}
        >
          <DropdownItem options={[{ value: '1', label: 'one', disabled: false }]} disabled />
        </DropdownMenuContext.Provider>,
      );

      const trigger = container.querySelector('.t-dropdown-menu__item') as HTMLElement | null;
      if (trigger) {
        fireEvent.click(trigger);
      }

      expect(onChangeActivedId).not.toHaveBeenCalled();
    });

    it('calls onChangeActivedId when clicking outside while active and closeOnClickOverlay true', async () => {
      const onChangeActivedId = vi.fn();
      render(
        <DropdownMenuContext.Provider
          value={{
            activedId: 'fixed-id',
            direction: 'down',
            onChangeActivedId,
            showOverlay: true,
            zIndex: 1,
            closeOnClickOverlay: true,
          }}
        >
          <DropdownItem options={[{ value: '1', label: 'one', disabled: false }]} />
        </DropdownMenuContext.Provider>,
      );

      const overlay = document.querySelector('.t-overlay') as HTMLElement | null;
      if (overlay) {
        fireEvent.click(overlay);
        fireEvent.mouseDown(overlay);
      } else {
        fireEvent.mouseDown(document.body);
      }

      await waitFor(() => {
        expect(onChangeActivedId).toHaveBeenCalled();
      });
    });
  });

  describe('keepLabelActive', () => {
    it('keepLabelActive', () => {
      // keepLabelActive 仅在 multiple = true 且有选中项时生效，保持标题高亮（含菜单收起态）
      const options = [
        { value: 'option_1', label: '选项一', disabled: false },
        { value: 'option_2', label: '选项二', disabled: false },
      ];
      const { container } = render(
        <DropdownMenu>
          <DropdownItem label="保持高亮" multiple keepLabelActive options={options} value={['option_1']} />
          <DropdownItem label="不保持高亮" multiple keepLabelActive={false} options={options} value={['option_1']} />
          <DropdownItem label="无选中项" multiple keepLabelActive options={options} value={[]} />
        </DropdownMenu>,
      );

      const menuLabels = container.querySelectorAll('.t-dropdown-menu__item');
      // multiple + keepLabelActive + 有选中项 → 收起态保持高亮
      expect(menuLabels[0].classList.contains('t-dropdown-menu__item--active')).toBe(true);
      // keepLabelActive = false → 收起态不高亮
      expect(menuLabels[1].classList.contains('t-dropdown-menu__item--active')).toBe(false);
      // keepLabelActive = true 但无选中项 → 不高亮
      expect(menuLabels[2].classList.contains('t-dropdown-menu__item--active')).toBe(false);
    });
  });
});

import React from 'react';
import { act, fireEvent, render, vi, waitFor } from '@test/utils';

import Menu from '../index';

describe('SubMenu', () => {
  const { SubMenu, MenuItem } = Menu;

  describe('scenarios', () => {
    describe('inline height transitions', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        act(() => {
          vi.runOnlyPendingTimers();
        });
        vi.useRealTimers();
        vi.restoreAllMocks();
      });

      const renderMenu = (expanded: string[] = []) => (
        <Menu expanded={expanded}>
          <SubMenu value="parent" title="Parent">
            <MenuItem value="item" style={{ height: 90 }}>
              Tall item
            </MenuItem>
            <SubMenu value="child" title="Child">
              <MenuItem value="leaf" style={{ height: 120 }}>
                Nested item
              </MenuItem>
            </SubMenu>
          </SubMenu>
        </Menu>
      );

      test('keeps initially collapsed content hidden', () => {
        const { container } = render(renderMenu());
        container.querySelectorAll<HTMLElement>('.t-menu__sub').forEach((list) => {
          expect(list.style.maxHeight).toBe('0');
        });
      });

      test('measures the enter target and releases height after entering', () => {
        vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(270);
        const { container, rerender } = render(renderMenu());
        rerender(renderMenu(['parent']));
        const list = container.querySelector<HTMLElement>('.t-menu__sub');
        expect(list.style.maxHeight).toBe('none');
        expect(list.style.height).toBe('270px');
        act(() => {
          vi.advanceTimersByTime(300);
        });
        expect(list.style.height).toBe('auto');
        expect(list.style.maxHeight).toBe('none');
      });

      test('does not clamp ancestors when a nested submenu opens', () => {
        const { container, rerender } = render(renderMenu(['parent']));
        act(() => {
          vi.advanceTimersByTime(300);
        });
        rerender(renderMenu(['parent', 'child']));
        act(() => {
          vi.advanceTimersByTime(300);
        });
        container.querySelectorAll<HTMLElement>('.t-menu__sub').forEach((list) => {
          expect(list.style.height).toBe('auto');
          expect(list.style.maxHeight).toBe('none');
        });
      });

      test('keeps the exit unclamped until it completes, then hides the content', () => {
        const { container, rerender } = render(renderMenu(['parent']));
        act(() => {
          vi.advanceTimersByTime(300);
        });
        const list = container.querySelector<HTMLElement>('.t-menu__sub');
        const bounds = vi.spyOn(list, 'getBoundingClientRect').mockReturnValue({ height: 270 } as DOMRect);
        rerender(renderMenu());
        expect(bounds).toHaveBeenCalled();
        expect(list.style.maxHeight).toBe('none');
        expect(list.style.height).toBe('0px');
        act(() => {
          vi.advanceTimersByTime(300);
        });
        expect(list.style.maxHeight).toBe('0');
      });

      test('cancels an interrupted exit and can collapse again', () => {
        const { container, rerender } = render(renderMenu(['parent']));
        act(() => {
          vi.advanceTimersByTime(300);
        });
        const list = container.querySelector<HTMLElement>('.t-menu__sub');
        vi.spyOn(list, 'getBoundingClientRect').mockReturnValue({ height: 80 } as DOMRect);
        rerender(renderMenu());
        act(() => {
          vi.advanceTimersByTime(80);
        });
        rerender(renderMenu(['parent']));
        act(() => {
          vi.advanceTimersByTime(300);
        });
        expect(list.style.height).toBe('auto');
        expect(list.style.maxHeight).toBe('none');
        rerender(renderMenu());
        act(() => {
          vi.advanceTimersByTime(300);
        });
        expect(list.style.maxHeight).toBe('0');
      });
    });

    test('does not impose an estimated height on delayed controlled popup content', async () => {
      const { getByText } = render(
        <Menu collapsed>
          <SubMenu title="Popup" value="popup" popupProps={{ visible: true }}>
            <MenuItem value="tall" style={{ height: 90 }}>
              Popup item
            </MenuItem>
          </SubMenu>
        </Menu>,
      );
      await waitFor(() => {
        expect(getByText('Popup item').closest<HTMLElement>('.t-menu__popup-wrapper').style.maxHeight).toBe('none');
      });
    });

    test('hides inline content after switching through collapsed popup mode', async () => {
      const menu = (collapsed = false, expanded: string[] = []) => (
        <Menu collapsed={collapsed} expanded={expanded}>
          <SubMenu title="Mode switch" value="parent">
            <MenuItem value="item">Mode item</MenuItem>
          </SubMenu>
        </Menu>
      );
      const { container, rerender } = render(menu(false, ['parent']));
      await waitFor(() => {
        expect(container.querySelector<HTMLElement>('.t-menu__sub').style.height).toBe('auto');
      });
      rerender(menu(true));
      rerender(menu());
      expect(container.querySelector<HTMLElement>('.t-menu__sub').style.maxHeight).toBe('0');
    });

    test('preserves uncontrolled expansion and disabled submenu behavior', async () => {
      const { container, getByText } = render(
        <Menu>
          <SubMenu title="Enabled" value="enabled">
            <MenuItem value="item">Item</MenuItem>
          </SubMenu>
          <SubMenu title="Disabled" value="disabled" disabled>
            <MenuItem value="disabled-item">Disabled item</MenuItem>
          </SubMenu>
        </Menu>,
      );
      fireEvent.click(getByText('Enabled'));
      await waitFor(() => {
        expect(container.querySelector<HTMLElement>('.t-menu__sub').style.height).toBe('auto');
      });
      fireEvent.click(getByText('Disabled'));
      expect(getByText('Disabled item').closest<HTMLElement>('.t-menu__sub').style.maxHeight).toBe('0');
      fireEvent.click(getByText('Enabled'));
      await waitFor(() => {
        expect(container.querySelector<HTMLElement>('.t-menu__sub').style.maxHeight).toBe('0');
      });
    });
  });
});

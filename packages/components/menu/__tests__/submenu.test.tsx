import React from 'react';
import { act, render, vi, waitFor } from '@test/utils';

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

      test('shows initially expanded content without a height animation', () => {
        const scrollHeight = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(270);
        const { container } = render(renderMenu(['parent', 'child']));
        container.querySelectorAll<HTMLElement>('.t-menu__sub').forEach((list) => {
          expect(list.style.height).toBe('auto');
          expect(list.style.maxHeight).toBe('none');
        });
        expect(scrollHeight).not.toHaveBeenCalled();
      });

      test('measures the expanded height and hides it only after collapsing', () => {
        vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(270);
        const { container, rerender } = render(renderMenu());
        const list = container.querySelector<HTMLElement>('.t-menu__sub');

        expect(list.style.maxHeight).toBe('0');
        rerender(renderMenu(['parent']));
        expect(list.style.maxHeight).toBe('none');
        expect(list.style.height).toBe('270px');
        act(() => {
          vi.advanceTimersByTime(300);
        });
        expect(list.style.height).toBe('auto');

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
    });

    test('does not impose an estimated height on popup content', async () => {
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
  });
});

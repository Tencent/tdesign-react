import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent, act, within } from '@testing-library/react';
import { DropdownMenu, DropdownItem, DropdownOption } from '../index';

const productOptions: DropdownOption[] = [
  { value: 'all', label: '全部产品', disabled: false },
  { value: 'new', label: '最新产品', disabled: false },
  { value: 'hot', label: '最火产品', disabled: false },
  { value: 'disabled', label: '禁用选项', disabled: true },
];

describe('DropdownMenu', () => {
  describe('props', () => {
    it(':style', () => {
      const { container } = render(
        <DropdownMenu className="my-menu" style={{ color: 'rgb(255, 0, 0)' }}>
          <DropdownItem label="样式测试" options={productOptions} />
        </DropdownMenu>,
      );
      const root = container.querySelector('.my-menu') as HTMLElement;
      expect(Boolean(root)).toBe(true);
      expect(root.style.color === 'rgb(255, 0, 0)').toBe(true);
    });

    it(':direction and zIndex', () => {
      const { container, getByText } = render(
        <DropdownMenu direction="up" zIndex={9999}>
          <DropdownItem label="产品" options={productOptions} />
        </DropdownMenu>,
      );

      expect(container.querySelector('.t-dropdown-menu')).toBeTruthy();

      fireEvent.click(getByText('产品'));
      const dropdownItem = container.querySelector('.t-dropdown-item') as HTMLElement;
      expect(dropdownItem).toBeTruthy();
      if (dropdownItem) {
        expect(dropdownItem.style.zIndex).toBe('9999');
      }
    });

    it(':optionsColumns', () => {
      const { getByText } = render(
        <DropdownMenu>
          <DropdownItem label="双列" multiple optionsColumns={2} options={productOptions} />
        </DropdownMenu>,
      );
      fireEvent.click(getByText('双列'));
      expect(getByText('全部产品')).toBeTruthy();
    });

    it(':footer', () => {
      const { getByText } = render(
        <DropdownMenu>
          <DropdownItem label="自定义" options={productOptions} footer={<div>自定义footer</div>} />
        </DropdownMenu>,
      );
      fireEvent.click(getByText('自定义'));
      expect(getByText('自定义footer')).toBeTruthy();
    });

    it(':defaultValue', () => {
      const { getByText } = render(
        <DropdownMenu>
          <DropdownItem options={productOptions} defaultValue="new" />
        </DropdownMenu>,
      );
      expect(getByText('最新产品')).toBeTruthy();
    });

    it(':keys', () => {
      const customOptions = [
        { k: 'a', l: 'A 选项', d: false },
        { k: 'b', l: 'B 选项', d: false },
      ] as unknown as DropdownOption[];
      const { getByText } = render(
        <DropdownMenu>
          <DropdownItem options={customOptions} keys={{ value: 'k', label: 'l', disabled: 'd' }} defaultValue="b" />
        </DropdownMenu>,
      );
      expect(getByText('B 选项')).toBeTruthy();
    });
  });

  describe('event', () => {
    it(':click overlay closes', () => {
      const { getByText } = render(
        <DropdownMenu closeOnClickOverlay>
          <DropdownItem label="产品" options={productOptions} />
        </DropdownMenu>,
      );
      fireEvent.click(getByText('产品'));
      act(() => {
        document.body.click();
      });
      expect(getByText('产品')).toBeTruthy();
    });

    it(':change single select', () => {
      let value = 'all';
      const handleChange = vi.fn((v) => {
        value = v;
      });
      const { getByText } = render(
        <DropdownMenu>
          <DropdownItem label="产品" options={productOptions} value={value} onChange={handleChange} />
        </DropdownMenu>,
      );
      const title = getByText('产品');
      const item = title.parentElement as HTMLElement;

      fireEvent.click(title);
      // options are rendered in a dropdown panel (possibly a portal); scope the query to the currently opened panel
      const panels1 = document.querySelectorAll('.t-dropdown-item');
      const panel1 = panels1[panels1.length - 1] as HTMLElement;
      fireEvent.click(within(panel1).getByText('最新产品'));
      expect(handleChange).toHaveBeenCalledWith('new');
      expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(false);
    });

    it(':multiple confirm/reset', () => {
      let value = ['all'];
      const handleChange = vi.fn((v) => {
        value = v;
      });
      const handleConfirm = vi.fn();
      const handleReset = vi.fn();
      const { getByText } = render(
        <DropdownMenu>
          <DropdownItem
            label="多选"
            multiple
            options={productOptions}
            value={value}
            onChange={handleChange}
            onConfirm={handleConfirm}
            onReset={handleReset}
          />
        </DropdownMenu>,
      );
      fireEvent.click(getByText('多选'));
      const panels2 = document.querySelectorAll('.t-dropdown-item');
      const panel2 = panels2[panels2.length - 1] as HTMLElement;
      fireEvent.click(within(panel2).getByText('最新产品'));
      fireEvent.click(within(panel2).getByText('确定'));
      expect(handleConfirm).toHaveBeenCalled();

      // 确认会关闭面板，重新打开后再点击重置
      fireEvent.click(getByText('多选'));
      const panels3 = document.querySelectorAll('.t-dropdown-item');
      const panel3 = panels3[panels3.length - 1] as HTMLElement;
      fireEvent.click(within(panel3).getByText('重置'));
      expect(handleReset).toHaveBeenCalled();
    });

    it(':toggle active class', () => {
      const { getByText } = render(
        <DropdownMenu>
          <DropdownItem label="切换" options={productOptions} />
        </DropdownMenu>,
      );
      const title = getByText('切换');
      const item = title.parentElement as HTMLElement;

      // open
      fireEvent.click(title);
      expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(true);

      // close
      fireEvent.click(title);
      expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(false);
    });

    it(':click disabled option noop', () => {
      const handleChange = vi.fn();
      const { getByText } = render(
        <DropdownMenu>
          <DropdownItem label="含禁用项" options={productOptions} onChange={handleChange} />
        </DropdownMenu>,
      );
      fireEvent.click(getByText('含禁用项'));
      const panels4 = document.querySelectorAll('.t-dropdown-item');
      const panel4 = panels4[panels4.length - 1] as HTMLElement;
      fireEvent.click(within(panel4).getByText('禁用选项'));
      expect(handleChange).not.toHaveBeenCalled();
    });

    it(':collapseMenu ref', () => {
      type DropdownMenuRef = {
        collapseMenu: () => void;
      };

      const ref = React.createRef<DropdownMenuRef>();
      const { getByText } = render(
        <DropdownMenu ref={ref}>
          <DropdownItem label="toCollapse" options={productOptions} />
        </DropdownMenu>,
      );

      fireEvent.click(getByText('toCollapse'));
      const title = getByText('toCollapse');
      const item = title.parentElement as HTMLElement;
      expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(true);

      act(() => {
        ref.current?.collapseMenu();
      });

      expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(false);
    });

    it(':multiple reset/confirm fallback behaviors', () => {
      const { getByText, container } = render(
        <DropdownMenu>
          <DropdownItem label="noReset" multiple options={productOptions} value={['all']} />
        </DropdownMenu>,
      );

      fireEvent.click(getByText('noReset'));
      fireEvent.click(getByText('最新产品'));
      fireEvent.click(getByText('重置'));

      const checked = container.querySelector('.t-checkbox__title--checked');
      expect(checked).toBeTruthy();

      let value = ['all'];
      const handleChange = vi.fn((v) => {
        value = v;
      });
      const { getByText: getByText2 } = render(
        <DropdownMenu>
          <DropdownItem label="noConfirm" multiple options={productOptions} value={value} onChange={handleChange} />
        </DropdownMenu>,
      );

      fireEvent.click(getByText2('noConfirm'));
      const panels5 = document.querySelectorAll('.t-dropdown-item');
      const panel5 = panels5[panels5.length - 1] as HTMLElement;
      fireEvent.click(within(panel5).getByText('最新产品'));
      fireEvent.click(within(panel5).getByText('确定'));

      expect(handleChange).toHaveBeenCalled();
      expect(getByText2('noConfirm')).toBeTruthy();
    });

    it(':collapses and blocks selection when disabled while open', () => {
      const handleChange = vi.fn();
      const handleClose = vi.fn();

      const renderMenu = (disabled: boolean) => (
        <DropdownMenu>
          <DropdownItem
            label="动态禁用"
            options={productOptions}
            value="all"
            disabled={disabled}
            onChange={handleChange}
            onClose={handleClose}
          />
        </DropdownMenu>
      );

      // 通过 rerender 直接改变 disabled 属性，避免外部点击触发 clickAway 收起
      const { getByText, rerender } = render(renderMenu(false));
      const title = getByText('动态禁用');
      const item = title.parentElement as HTMLElement;

      // 打开菜单
      fireEvent.click(title);
      expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(true);

      // 展开状态下动态禁用：菜单应自动收起并触发 close
      act(() => {
        rerender(renderMenu(true));
      });
      expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(false);
      expect(handleClose).toHaveBeenCalled();

      // 禁用期间再次点击标题不应打开菜单
      fireEvent.click(title);
      expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(false);

      // 解除禁用后仍可再次打开
      act(() => {
        rerender(renderMenu(false));
      });
      fireEvent.click(title);
      expect(item.classList.contains('t-dropdown-menu__item--active')).toBe(true);
    });
  });

  describe('slots', () => {
    it(':default', () => {
      const { getByText } = render(
        <DropdownMenu>
          <DropdownItem label="custom" options={productOptions}>
            <div>MyCustomChild</div>
          </DropdownItem>
        </DropdownMenu>,
      );
      fireEvent.click(getByText('custom'));
      expect(getByText('MyCustomChild')).toBeTruthy();
    });
  });
});

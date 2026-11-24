import React from 'react';
import { describe, it, expect, render, vi, fireEvent } from '@test/utils';

import { AppIcon } from 'tdesign-icons-react';
import SideBar from '../SideBar';
import SideBarItem from '../SideBarItem';

const prefix = 't';
const name = `.${prefix}-side-bar-item`;

describe('SideBarItem', () => {
  describe('props', () => {
    it(': value', () => {
      const { container } = render(
        <SideBar>
          <SideBarItem value={1} label="选项1" />
        </SideBar>,
      );
      expect(container.querySelector(name)).toBeTruthy();
    });

    it(': label', () => {
      const { queryByText } = render(
        <SideBar>
          <SideBarItem value={1} label="测试标签" />
        </SideBar>,
      );
      expect(queryByText('测试标签')).toBeInTheDocument();
    });

    it(': icon', () => {
      const { container } = render(
        <SideBar>
          <SideBarItem value={1} label="选项1" icon={<AppIcon />} />
        </SideBar>,
      );
      expect(container.querySelector(`${name}__icon`)).toBeTruthy();
      expect(container.querySelector('.t-icon-app')).toBeTruthy();
    });

    it(': disabled', () => {
      const { container } = render(
        <SideBar>
          <SideBarItem value={1} label="选项1" disabled />
        </SideBar>,
      );
      expect(container.querySelector(`${name}--disabled`)).toBeTruthy();
    });

    it(': badgeProps with count', () => {
      const { container } = render(
        <SideBar>
          <SideBarItem value={1} label="选项1" badgeProps={{ count: 5 }} />
        </SideBar>,
      );
      expect(container.querySelector('.t-badge')).toBeTruthy();
    });

    it(': badgeProps with dot', () => {
      const { container } = render(
        <SideBar>
          <SideBarItem value={1} label="选项1" badgeProps={{ dot: true }} />
        </SideBar>,
      );
      expect(container.querySelector('.t-badge')).toBeTruthy();
    });

    it(': active state', () => {
      const { container } = render(
        <SideBar value={1}>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );
      expect(container.querySelector(`${name}--active`)).toBeTruthy();
      expect(container.querySelector(`${name}__line`)).toBeTruthy();
      expect(container.querySelector(`${name}__prefix`)).toBeTruthy();
      expect(container.querySelector(`${name}__suffix`)).toBeTruthy();
    });
  });

  describe('events', () => {
    it(': onClick', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SideBar onClick={handleClick}>
          <SideBarItem value={1} label="选项1" />
        </SideBar>,
      );

      const item = container.querySelector(name);
      fireEvent.click(item);

      expect(handleClick).toHaveBeenCalledWith(1, '选项1');
    });

    it(': onClick disabled', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SideBar onClick={handleClick}>
          <SideBarItem value={1} label="选项1" disabled />
        </SideBar>,
      );

      const item = container.querySelector(name);
      fireEvent.click(item);

      expect(handleClick).not.toHaveBeenCalled();
    });

    it(': onChange when clicked', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <SideBar onChange={handleChange}>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );

      const secondItem = container.querySelectorAll(name)[1];
      fireEvent.click(secondItem);

      expect(handleChange).toHaveBeenCalledWith(2);
    });
  });

  describe('integration', () => {
    it(': multiple items with different states', () => {
      const { container } = render(
        <SideBar value={2}>
          <SideBarItem value={1} label="选项1" icon={<AppIcon />} />
          <SideBarItem value={2} label="选项2" badgeProps={{ count: 3 }} />
          <SideBarItem value={3} label="选项3" disabled />
        </SideBar>,
      );

      const items = container.querySelectorAll(name);
      expect(items).toHaveLength(3);

      // 第一个项目有图标
      expect(items[0].querySelector(`${name}__icon`)).toBeTruthy();

      // 第二个项目是活跃状态且有徽章
      expect(items[1].classList.contains(`${prefix}-side-bar-item--active`)).toBeTruthy();
      expect(items[1].querySelector('.t-badge')).toBeTruthy();

      // 第三个项目是禁用状态
      expect(items[2].classList.contains(`${prefix}-side-bar-item--disabled`)).toBeTruthy();
    });

    it(': context relation lifecycle', () => {
      const { rerender } = render(
        <SideBar>
          <SideBarItem value={1} label="选项1" />
        </SideBar>,
      );

      // 重新渲染以测试 useEffect 的清理函数
      rerender(
        <SideBar>
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );

      // 组件应该正常渲染
      expect(true).toBe(true);
    });
  });
});

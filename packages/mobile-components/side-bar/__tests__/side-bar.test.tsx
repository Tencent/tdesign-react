import React from 'react';
import { describe, it, expect, render, vi, fireEvent } from '@test/utils';

import SideBar from '../SideBar';
import SideBarItem from '../SideBarItem';

const prefix = 't';
const name = `.${prefix}-side-bar`;

describe('SideBar', () => {
  describe('props', () => {
    it(': children', () => {
      const { container } = render(
        <SideBar>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );
      expect(container.querySelector(name)).toBeTruthy();
      expect(container.querySelectorAll('.t-side-bar-item')).toHaveLength(2);
    });

    it(': defaultValue', () => {
      const { container } = render(
        <SideBar defaultValue={1}>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );
      expect(container.querySelector('.t-side-bar-item--active')).toBeTruthy();
    });

    it(': value (controlled)', () => {
      const { container, rerender } = render(
        <SideBar value={1}>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );

      const activeItems = container.querySelectorAll('.t-side-bar-item--active');
      expect(activeItems).toHaveLength(1);

      // 更新 value
      rerender(
        <SideBar value={2}>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );

      const newActiveItems = container.querySelectorAll('.t-side-bar-item--active');
      expect(newActiveItems).toHaveLength(1);
    });
  });

  describe('events', () => {
    it(': onChange', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <SideBar onChange={handleChange}>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );

      const secondItem = container.querySelectorAll('.t-side-bar-item')[1];
      fireEvent.click(secondItem);

      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it(': onClick', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <SideBar onClick={handleClick}>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );

      const firstItem = container.querySelectorAll('.t-side-bar-item')[0];
      fireEvent.click(firstItem);

      expect(handleClick).toHaveBeenCalledWith(1, '选项1');
    });

    it(': onChange with controlled mode', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <SideBar value={1} onChange={handleChange}>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );

      const secondItem = container.querySelectorAll('.t-side-bar-item')[1];
      fireEvent.click(secondItem);

      expect(handleChange).toHaveBeenCalledWith(2);
    });

    it(': onChange with uncontrolled mode', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <SideBar defaultValue={1} onChange={handleChange}>
          <SideBarItem value={1} label="选项1" />
          <SideBarItem value={2} label="选项2" />
        </SideBar>,
      );

      const secondItem = container.querySelectorAll('.t-side-bar-item')[1];
      fireEvent.click(secondItem);

      expect(handleChange).toHaveBeenCalledWith(2);
    });
  });

  describe('edge cases', () => {
    it(': empty children', () => {
      const { container } = render(<SideBar />);
      expect(container.querySelector(name)).toBeTruthy();
      expect(container.querySelector(`${name}__padding`)).toBeTruthy();
    });

    it(': single child', () => {
      const { container } = render(
        <SideBar>
          <SideBarItem value={1} label="单个选项" />
        </SideBar>,
      );
      expect(container.querySelectorAll('.t-side-bar-item')).toHaveLength(1);
    });

    it(': string and number values', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <SideBar onChange={handleChange}>
          <SideBarItem value="string" label="字符串值" />
          <SideBarItem value={123} label="数字值" />
        </SideBar>,
      );

      const firstItem = container.querySelectorAll('.t-side-bar-item')[0];
      const secondItem = container.querySelectorAll('.t-side-bar-item')[1];

      fireEvent.click(firstItem);
      expect(handleChange).toHaveBeenCalledWith('string');

      fireEvent.click(secondItem);
      expect(handleChange).toHaveBeenCalledWith(123);
    });

    it(': without onChange callback', () => {
      const { container } = render(
        <SideBar>
          <SideBarItem value={1} label="选项1" />
        </SideBar>,
      );

      const item = container.querySelector('.t-side-bar-item');
      expect(() => fireEvent.click(item)).not.toThrow();
    });

    it(': without onClick callback', () => {
      const { container } = render(
        <SideBar>
          <SideBarItem value={1} label="选项1" />
        </SideBar>,
      );

      const item = container.querySelector('.t-side-bar-item');
      expect(() => fireEvent.click(item)).not.toThrow();
    });
  });
});

import React from 'react';
import { describe, it, expect, render, vi, fireEvent } from '@test/utils';
import { TabBar, TabBarItem } from '..';

const prefix = 't';
const prefixClass = `${prefix}-tab-bar`;
const list = [
  { value: 1, label: '首页' },
  { value: 2, label: '应用' },
  { value: 3, label: '聊天' },
  { value: 4, label: '我的' },
];

const renderTabBar = () =>
  list.map((item) => (
    <TabBarItem key={item.value} {...item}>
      {item.label}
    </TabBarItem>
  ));

describe('TabBar', () => {
  describe('props', () => {
    it(': className', () => {
      const { container } = render(<TabBar className="custom-class" />);
      expect(container.querySelector('.custom-class')).toBeTruthy();
    });

    it(': style', () => {
      const { container } = render(<TabBar style={{ color: '#0052d9' }} />);
      expect(container.querySelector(`.${prefixClass}`)).toBeTruthy();
      expect(container.querySelector(`.${prefixClass}`)).toHaveStyle({ color: '#0052d9' });
    });

    it(': bordered', async () => {
      const { container, rerender } = render(<TabBar bordered={true} />);
      expect(container.querySelector(`.${prefixClass}--bordered`)).toBeTruthy();
      rerender(<TabBar bordered={false} />);
      expect(container.querySelector(`.${prefixClass}--bordered`)).toBeFalsy();
    });

    it(': fixed', async () => {
      const { container, rerender } = render(<TabBar fixed={true} />);
      expect(container.querySelector(`.${prefixClass}--fixed`)).toBeTruthy();
      rerender(<TabBar fixed={false} />);
      expect(container.querySelector(`.${prefixClass}--fixed`)).toBeFalsy();
    });

    it(': safeAreaInsetBottom', async () => {
      const { container, rerender } = render(<TabBar fixed={true} />);
      expect(container.querySelector(`.${prefixClass}--safe`)).toBeTruthy();
      rerender(<TabBar safeAreaInsetBottom={false} />);
      expect(container.querySelector(`.${prefixClass}--safe`)).toBeFalsy();
    });

    it(': shape', () => {
      const testShape = (shape, target) => {
        const { container } = render(<TabBar shape={shape} />);
        expect(container.querySelector(target)).toBeTruthy();
      };
      testShape(undefined, `.${prefixClass}--normal`);
      testShape('normal', `.${prefixClass}--normal`);
      testShape('round', `.${prefixClass}--round`);
    });

    it(': split', () => {
      const { container } = render(<TabBar split={true}>{renderTabBar()}</TabBar>);
      const splits = container.querySelectorAll(`.${prefixClass}-item--split`);
      expect(splits[0]).toBeTruthy();
      expect(splits).toHaveLength(list.length);
    });

    it(': theme', () => {
      const testTheme = (theme, target) => {
        const { container } = render(<TabBar theme={theme}> {renderTabBar()} </TabBar>);
        expect(container.querySelector(target)).toBeTruthy();
      };
      testTheme(undefined, `.${prefixClass}-item__content--normal`);
      testTheme('normal', `.${prefixClass}-item__content--normal`);
      testTheme('tag', `.${prefixClass}-item__content--tag`);
    });

    it(': value', async () => {
      const { container, rerender } = render(<TabBar> {renderTabBar()} </TabBar>);
      expect(container.querySelectorAll(`.${prefixClass}-item`)).toHaveLength(list.length);

      rerender(<TabBar value={1}> {renderTabBar()} </TabBar>);
      const activeItem = container.querySelector(`.${prefixClass}-item__content--checked`);
      expect(activeItem).toBeTruthy();
      expect(activeItem).toHaveTextContent(list[0].label);
    });

    it(': defaultValue', async () => {
      const { container } = render(<TabBar defaultValue={1}> {renderTabBar()} </TabBar>);
      expect(container.querySelectorAll(`.${prefixClass}-item`)).toHaveLength(list.length);
      const activeItem = container.querySelector(`.${prefixClass}-item__content--checked`);
      expect(activeItem).toBeTruthy();
      expect(activeItem).toHaveTextContent(list[0].label);
    });
  });
});

describe('events', () => {
  it(': onChange', async () => {
    const onChange = vi.fn();
    const { container } = render(<TabBar onChange={onChange}> {renderTabBar()} </TabBar>);
    const tabBarItems = container.querySelectorAll(`.${prefixClass}-item__content`);

    expect(onChange).toHaveBeenCalledTimes(0);
    fireEvent.click(tabBarItems[1]);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ value: expect.any(Number) });
  });
});

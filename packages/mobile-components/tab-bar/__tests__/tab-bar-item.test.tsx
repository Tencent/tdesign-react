import React from 'react';
import { describe, it, expect, render, fireEvent, vi } from '@test/utils';
import { HomeIcon, AppIcon, ChatIcon, UserIcon } from 'tdesign-icons-react';
import { TabBar, TabBarItem } from '..';

const prefix = 't';
const prefixClass = `${prefix}-tab-bar-item`;
const list = [
  { value: 1, label: '首页', icon: <HomeIcon /> },
  { value: 2, label: '应用', icon: <AppIcon /> },
  { value: 3, label: '聊天', icon: <ChatIcon /> },
  {
    value: 4,
    label: '我的',
    icon: <UserIcon />,
    subTabBar: [
      {
        value: '4_1',
        label: '基本信息',
      },
      {
        value: '4_2',
        label: '个人主页',
      },
      {
        value: '4_3',
        label: '设置',
      },
    ],
  },
];

describe('TabBarItem', () => {
  describe('props', () => {
    it(': className', () => {
      const { container } = render(
        <TabBar>
          {list.map((item) => (
            <TabBarItem key={item.value} {...item} className="custom-class">
              {item.label}
            </TabBarItem>
          ))}
        </TabBar>,
      );

      expect(container.querySelectorAll('.custom-class')).toHaveLength(list.length);
    });

    it(': style', () => {
      const { container } = render(
        <TabBar>
          {list.map((item) => (
            <TabBarItem key={item.value} {...item} style={{ color: '#0052d9' }}>
              {item.label}
            </TabBarItem>
          ))}
        </TabBar>,
      );
      const tabBarItems = container.querySelectorAll(`.${prefixClass}`);
      expect(tabBarItems).toHaveLength(list.length);
      expect(tabBarItems[0]).toHaveStyle({ color: '#0052d9' });
    });

    it(': badgeProps', () => {
      const { container, rerender } = render(
        <TabBar>
          {list.map((item) => (
            <TabBarItem key={item.value} {...item} badgeProps={{ dot: true }}>
              {item.label}
            </TabBarItem>
          ))}
        </TabBar>,
      );
      expect(container.querySelectorAll(`.${prefix}-badge--dot`)).toHaveLength(list.length);

      rerender(
        <TabBar>
          {list.map((item) => (
            <TabBarItem key={item.value} {...item} badgeProps={{ count: 16 }}>
              {item.label}
            </TabBarItem>
          ))}
        </TabBar>,
      );
      expect(container.querySelectorAll(`.${prefix}-badge__content`)).toHaveLength(list.length);
    });

    it(': badgeProps', () => {
      const { container, rerender } = render(
        <TabBar>
          {list.map((item) => (
            <TabBarItem key={item.value} {...item} badgeProps={{ dot: true }}>
              {item.label}
            </TabBarItem>
          ))}
        </TabBar>,
      );
      expect(container.querySelectorAll(`.${prefix}-badge--dot`)).toHaveLength(list.length);

      rerender(
        <TabBar>
          {list.map((item) => (
            <TabBarItem key={item.value} {...item} badgeProps={{ count: 16 }}>
              {item.label}
            </TabBarItem>
          ))}
        </TabBar>,
      );
      expect(container.querySelectorAll(`.${prefix}-badge__content`)).toHaveLength(list.length);
    });

    it(': icon', () => {
      const { container } = render(
        <TabBar>
          {list.map((item) => (
            <TabBarItem key={item.value} {...item}>
              {item.label}
            </TabBarItem>
          ))}
        </TabBar>,
      );

      expect(container.querySelector(`.${prefixClass}__icon`)).toBeTruthy();
      expect(container.querySelectorAll(`.${prefixClass}__icon`)).toHaveLength(list.length);
    });

    // tabBarItem 无value属性时,通过一个递增的 defaultIndex 生成一个临时的当前组件唯一值
    it(': value', async () => {
      const { container } = render(
        <TabBar value={1}>
          {list.map((item) => (
            <TabBarItem key={item.value}>{item.label}</TabBarItem>
          ))}
        </TabBar>,
      );
      expect(container.querySelectorAll(`.${prefixClass}`)).toHaveLength(list.length);
      const activeItem = container.querySelector(`.${prefixClass}__content--checked`);
      expect(activeItem).toBeTruthy();
      expect(activeItem).toHaveTextContent(list[1].label);
    });

    it(': subTabBar', async () => {
      const onChange = vi.fn();
      const { container, getByText } = render(
        <TabBar onChange={onChange}>
          {list.map((item) => (
            <TabBarItem key={item.value} {...item}>
              {item.label}
            </TabBarItem>
          ))}
        </TabBar>,
      );

      const subTabBarItem = getByText('我的');
      fireEvent.click(subTabBarItem);
      expect(container.querySelector(`.${prefixClass}__spread`)).toBeTruthy();
      expect(onChange).toHaveBeenCalled();
      // expect(onChange).toHaveBeenCalledWith([4]);

      const subTabBarMenu = container.querySelectorAll(`.${prefixClass}__spread-item`);
      fireEvent.click(subTabBarMenu[0]);
      expect(onChange).toHaveBeenCalled();
      // expect(onChange).toHaveBeenCalledWith([4, '4_1']);
      // setTimeout(() => {
      // expect(container.querySelector(`.${prefixClass}__spread`)).toBeFalsy();
      // });
    });
  });

  describe('event', () => {
    it(': tabBar click', async () => {
      const { container, getByText } = render(
        <TabBar>
          {list.map((item) => (
            <TabBarItem key={item.value} {...item}>
              {item.label}
            </TabBarItem>
          ))}
        </TabBar>,
      );

      const subTabBarItem = getByText('我的');
      fireEvent.click(subTabBarItem);
      expect(container.querySelector(`.${prefixClass}__spread`)).toBeTruthy();
      fireEvent.click(subTabBarItem);
      expect(container.querySelector(`.${prefixClass}__spread`)).toBeTruthy();
    });
  });
});

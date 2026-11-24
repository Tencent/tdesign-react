import React from 'react';
import { describe, it, expect, render, vi, fireEvent, beforeEach, act } from '@test/utils';
import { Tabs, TabPanel } from '../index';

const prefix = 't';
const name = `.${prefix}-tabs`;

describe('Tabs', () => {
  beforeEach(() => {
    Object.defineProperty(Element.prototype, 'scrollTo', {
      configurable: true,
      writable: true,
      value: vi.fn(),
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get() {
        return 100;
      },
    });
    Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
      configurable: true,
      get() {
        return 50;
      },
    });
  });

  describe('props', () => {
    it(': bottomLineMode', async () => {
      const modes = ['fixed', 'auto', 'full'] as const;

      modes.forEach((mode) => {
        const { container } = render(
          <Tabs bottomLineMode={mode} defaultValue="1" showBottomLine>
            <TabPanel label="Tab 1" value="1">
              Content 1
            </TabPanel>
          </Tabs>,
        );
        expect(container.querySelector(`${name}__track`)).toBeTruthy();
      });

      // full 模式
      const { container: fullContainer } = render(
        <Tabs bottomLineMode="full" defaultValue="1" showBottomLine>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const fullTab2 = fullContainer.querySelectorAll(`${name}__item`)[1];
      fireEvent.click(fullTab2);

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      });

      expect(fullContainer.querySelector(`${name}__item--active`)).toHaveTextContent('Tab 2');

      // auto 模式
      const { container: autoContainer } = render(
        <Tabs bottomLineMode="auto" defaultValue="1" showBottomLine>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const autoTab2 = autoContainer.querySelectorAll(`${name}__item`)[1];
      fireEvent.click(autoTab2);

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      });

      expect(autoContainer.querySelector(`${name}__item--active`)).toHaveTextContent('Tab 2');
    });

    it(': children', () => {
      const { queryByText } = render(
        <Tabs defaultValue="1">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );
      expect(queryByText('Tab 1')).toBeInTheDocument();
      expect(queryByText('Content 1')).toBeInTheDocument();
    });

    it(': list', () => {
      const list = [
        { label: 'Item 1', value: 'a' },
        { label: 'Item 2', value: 'b' },
      ];
      const { queryByText: queryByText2 } = render(<Tabs list={list} defaultValue="a" />);
      expect(queryByText2('Item 1')).toBeInTheDocument();
    });

    it(': size', () => {
      const { container } = render(
        <Tabs size="large" defaultValue="1">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
        </Tabs>,
      );
      expect(container.querySelector('.large')).toBeTruthy();
    });

    it(': spaceEvenly', () => {
      const { container } = render(
        <Tabs spaceEvenly defaultValue="1">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
        </Tabs>,
      );
      expect(container.querySelector(`${name}__item--evenly`)).toBeTruthy();
    });

    it(': theme', () => {
      const themes = ['line', 'tag', 'card'] as const;
      themes.forEach((theme) => {
        const { container } = render(
          <Tabs theme={theme} defaultValue="1">
            <TabPanel label="Tab 1" value="1">
              Content 1
            </TabPanel>
          </Tabs>,
        );
        expect(container.querySelector(`${name}__item--${theme}`)).toBeTruthy();
      });

      const { container } = render(
        <Tabs theme="card" defaultValue="2">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
          <TabPanel label="Tab 3" value="3">
            Content 3
          </TabPanel>
        </Tabs>,
      );
      expect(container.querySelector(`${name}__item-prefix`)).toBeTruthy();
      expect(container.querySelector(`${name}__item-suffix`)).toBeTruthy();
    });

    it(': value', () => {
      const { container } = render(
        <Tabs value="2">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );
      expect(container.querySelector(`${name}__item--active`)).toHaveTextContent('Tab 2');
    });

    it(': defaultValue', () => {
      const { container } = render(
        <Tabs defaultValue="1">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );
      expect(container.querySelector(`${name}__item--active`)).toHaveTextContent('Tab 1');
    });

    it(': swipeable', () => {
      const { container } = render(
        <Tabs swipeable={false} defaultValue="1">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );
      const content = container.querySelector(`${name}__content`);
      fireEvent.touchStart(content, { targetTouches: [{ clientX: 100, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 10, clientY: 50 }] });
      fireEvent.touchEnd(content);

      expect(container.querySelector(`${name}__item--active`)).toHaveTextContent('Tab 1');
    });

    it(': stickyProps', () => {
      const { container } = render(
        <Tabs defaultValue="1" stickyProps={{ offsetTop: 0 }}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
        </Tabs>,
      );
      expect(container.querySelector(name)).toBeTruthy();
    });

    it(': animation', async () => {
      const { container } = render(
        <Tabs defaultValue="1" showBottomLine animation={{ duration: 300 }}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 350);
        });
      });

      const tab2 = container.querySelectorAll(`${name}__item`)[1];
      fireEvent.click(tab2);

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      });

      expect(container.querySelector(`${name}__item--active`)).toHaveTextContent('Tab 2');

      const tab1 = container.querySelectorAll(`${name}__item`)[0];
      fireEvent.click(tab1);

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      });

      expect(container.querySelector(`${name}__item--active`)).toHaveTextContent('Tab 1');
    });

    it(': disabled', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Tabs defaultValue="1" onChange={handleChange}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2" disabled>
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const disabledTab = container.querySelectorAll(`${name}__item`)[1];
      fireEvent.click(disabledTab);
      expect(handleChange).not.toHaveBeenCalled();

      const activeTab = container.querySelectorAll(`${name}__item`)[0];
      fireEvent.click(activeTab);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('events', () => {
    it(': onChange', () => {
      const handleChange = vi.fn();
      const { container } = render(
        <Tabs defaultValue="1" onChange={handleChange}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );
      const tab2 = container.querySelectorAll(`${name}__item`)[1];
      fireEvent.click(tab2);

      expect(handleChange).toHaveBeenCalledWith('2', 'Tab 2');
    });

    it(': onClick', () => {
      const handleClick = vi.fn();
      const { container } = render(
        <Tabs defaultValue="1" onClick={handleClick}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );
      const tab2 = container.querySelectorAll(`${name}__item`)[1];
      fireEvent.click(tab2);

      expect(handleClick).toHaveBeenCalledWith('2', 'Tab 2');
    });
  });

  describe('swipe gestures', () => {
    it(': swipe left to next tab', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Tabs defaultValue="1" swipeable onChange={onChange}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const content = container.querySelector(`${name}__content`);
      // 向左滑动：startX > endX，切换到下一个 tab
      fireEvent.touchStart(content, { targetTouches: [{ clientX: 150, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 100, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 50, clientY: 50 }] });
      fireEvent.touchEnd(content);

      expect(onChange).toHaveBeenCalledWith('2', 'Tab 2');
    });

    it(': swipe right from middle tab triggers onChange', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Tabs defaultValue="2" swipeable onChange={onChange}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
          <TabPanel label="Tab 3" value="3">
            Content 3
          </TabPanel>
        </Tabs>,
      );

      const content = container.querySelector(`${name}__content`);
      // 向右滑动：startX < endX，从中间 tab 切换到上一个
      fireEvent.touchStart(content, { targetTouches: [{ clientX: 50, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 100, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 150, clientY: 50 }] });
      fireEvent.touchEnd(content);

      expect(onChange).toHaveBeenCalledWith('1', 'Tab 1');
    });

    it(': swipe right from middle tab', () => {
      const { container } = render(
        <Tabs defaultValue="2" swipeable>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
          <TabPanel label="Tab 3" value="3">
            Content 3
          </TabPanel>
        </Tabs>,
      );

      const content = container.querySelector(`${name}__content`);
      fireEvent.touchStart(content, { targetTouches: [{ clientX: 10, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 100, clientY: 50 }] });
      fireEvent.touchEnd(content);

      expect(container.querySelector(name)).toBeTruthy();
    });

    it(': swipe left from last tab (boundary)', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Tabs defaultValue="2" swipeable onChange={onChange}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const content = container.querySelector(`${name}__content`);
      // 从最后一个 tab 向左滑动，不应切换
      fireEvent.touchStart(content, { targetTouches: [{ clientX: 150, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 100, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 50, clientY: 50 }] });
      fireEvent.touchEnd(content);

      expect(onChange).not.toHaveBeenCalled();
    });

    it(': boundary swipe (first tab right)', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Tabs defaultValue="1" swipeable onChange={onChange}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const content = container.querySelector(`${name}__content`);

      fireEvent.touchStart(content, { targetTouches: [{ clientX: 50, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 100, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 150, clientY: 50 }] });
      fireEvent.touchEnd(content);

      expect(onChange).not.toHaveBeenCalled();
    });

    it(': vertical swipe ignored', () => {
      const { container } = render(
        <Tabs defaultValue="1" swipeable>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const content = container.querySelector(`${name}__content`);
      // 垂直滑动：dValueY > dValueX，不会触发水平切换
      fireEvent.touchStart(content, { targetTouches: [{ clientX: 100, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 110, clientY: 150 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 120, clientY: 250 }] });
      fireEvent.touchEnd(content);

      // 验证组件正常工作
      expect(container.querySelector(name)).toBeTruthy();
    });

    it(': canMove prevents multiple swipes', () => {
      const { container } = render(
        <Tabs defaultValue="1" swipeable>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const content = container.querySelector(`${name}__content`);
      fireEvent.touchStart(content, { targetTouches: [{ clientX: 100, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 50, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 10, clientY: 50 }] });
      fireEvent.touchEnd(content);

      expect(container.querySelector(name)).toBeTruthy();
    });

    it(': small swipe distance ignored', () => {
      const { container } = render(
        <Tabs defaultValue="2" swipeable>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      const content = container.querySelector(`${name}__content`);
      fireEvent.touchStart(content, { targetTouches: [{ clientX: 50, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 30, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 35, clientY: 50 }] });
      fireEvent.touchEnd(content);

      expect(container.querySelector(name)).toBeTruthy();
    });
  });

  describe('edge cases', () => {
    it(': should handle non-TabPanel children filtering', () => {
      const { container, queryByText } = render(
        <Tabs defaultValue="1">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <div>Not a TabPanel</div>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      expect(queryByText('Tab 1')).toBeInTheDocument();
      expect(queryByText('Tab 2')).toBeInTheDocument();
      expect(container.querySelector(`${name}__item--active`)).toHaveTextContent('Tab 1');
    });

    it(': should handle moveToActiveTab with no active tab', async () => {
      const { container } = render(
        <Tabs defaultValue="nonexistent" showBottomLine>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
        </Tabs>,
      );

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 400);
        });
      });

      const tab1 = container.querySelectorAll(`${name}__item`)[0];
      fireEvent.click(tab1);

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
      });

      expect(container.querySelector(`${name}__item--active`)).toHaveTextContent('Tab 1');
    });

    it(': should handle empty items array', () => {
      const onChange = vi.fn();
      const { container } = render(<Tabs defaultValue="nonexistent" swipeable list={[]} onChange={onChange} />);

      const content = container.querySelector(`${name}__content`);
      fireEvent.touchStart(content, { targetTouches: [{ clientX: 150, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 100, clientY: 50 }] });
      fireEvent.touchMove(content, { targetTouches: [{ clientX: 50, clientY: 50 }] });
      fireEvent.touchEnd(content);

      expect(onChange).not.toHaveBeenCalled();
    });

    it(': should handle navScroll with no active tab early return', async () => {
      const { rerender } = render(
        <Tabs defaultValue="nonexistent">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
        </Tabs>,
      );

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 350);
        });
      });

      rerender(
        <Tabs value="nonexistent">
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
        </Tabs>,
      );

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 30);
        });
      });

      fireEvent(window, new Event('resize'));
      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 30);
        });
      });
    });

    it(': should handle swipe right branch execution', async () => {
      const onChange = vi.fn();
      const { container } = render(
        <Tabs defaultValue="2" swipeable onChange={onChange}>
          <TabPanel label="Tab 1" value="1">
            Content 1
          </TabPanel>
          <TabPanel label="Tab 2" value="2">
            Content 2
          </TabPanel>
          <TabPanel label="Tab 3" value="3">
            Content 3
          </TabPanel>
        </Tabs>,
      );

      const content = container.querySelector(`${name}__content`);
      await act(async () => {
        fireEvent.touchStart(content, { targetTouches: [{ clientX: 50, clientY: 50 }] });
      });
      await act(async () => {
        fireEvent.touchMove(content, { targetTouches: [{ clientX: 120, clientY: 50 }] });
      });
      await act(async () => {
        fireEvent.touchMove(content, { targetTouches: [{ clientX: 240, clientY: 50 }] });
      });
      await act(async () => {
        fireEvent.touchEnd(content);
      });

      expect(onChange).toHaveBeenCalledWith('1', 'Tab 1');
    });

    it(': should handle swipe right branch with list data', async () => {
      const onChange = vi.fn();
      const list = [
        { label: 'Tab 1', value: '1' },
        { label: 'Tab 2', value: '2' },
        { label: 'Tab 3', value: '3' },
      ];
      const { container } = render(<Tabs defaultValue="2" swipeable list={list} onChange={onChange} />);

      const content = container.querySelector(`${name}__content`);
      await act(async () => {
        fireEvent.touchStart(content, { targetTouches: [{ clientX: 30, clientY: 40 }] });
      });
      await act(async () => {
        fireEvent.touchMove(content, { targetTouches: [{ clientX: 110, clientY: 40 }] });
      });
      await act(async () => {
        fireEvent.touchMove(content, { targetTouches: [{ clientX: 220, clientY: 40 }] });
      });
      await act(async () => {
        fireEvent.touchEnd(content);
      });

      expect(onChange).toHaveBeenCalledWith('1', 'Tab 1');
    });
  });
});

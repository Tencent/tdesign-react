import React, { Fragment } from 'react';
import { vi } from 'vitest';
import { describe, expect, it, render, fireEvent, act } from '@test/utils';
import { Indexes, IndexesAnchor } from '../index';
import { IndexesContext } from '../IndexesContext';
import { CellGroup, Cell } from '../../cell';

const prefix = 't';
const name = `${prefix}-indexes`;
const anchorName = `${prefix}-indexes-anchor`;

// 测试数据
const children = new Array(5).fill('列表内容');
const list = [
  { index: 1, children },
  { index: 3, children },
  { index: 5, children },
  { index: 7, children },
  { index: 8, children },
  { index: 10, children },
  { index: '#', children },
];
const indexList = list.map((item) => item.index);

// 辅助函数：渲染测试组件
const createIndexes = (props = {}, childrenList = list) => (
  <Indexes indexList={indexList} {...props}>
    {childrenList.map((item, index) => (
      <Fragment key={index}>
        <IndexesAnchor index={item.index} />
        <CellGroup>
          {item.children.map((val, idx) => (
            <Cell key={idx}>{val}</Cell>
          ))}
        </CellGroup>
      </Fragment>
    ))}
  </Indexes>
);

const renderIndexes = (props = {}, childrenList = list) => render(createIndexes(props, childrenList));

describe('Indexes', () => {
  describe('props', () => {
    it(':indexList', () => {
      const { container } = renderIndexes();
      const $indexesSidebar = container.querySelectorAll(`.${name}__sidebar-item`);
      expect($indexesSidebar.length).toBe(indexList.length);
      const contentCells = container.querySelectorAll(`.${prefix}-cell`);
      const contentLength = list.reduce((count, item) => count + item.children.length, 0);
      expect(contentCells.length).toBe(contentLength);
    });

    it(':indexList is empty, should generate A-Z', () => {
      const { container } = render(
        <Indexes>
          {list.map((item, index) => (
            <Fragment key={index}>
              <IndexesAnchor index={item.index} />
              <CellGroup>
                {item.children.map((val, idx) => (
                  <Cell key={idx}>{val}</Cell>
                ))}
              </CellGroup>
            </Fragment>
          ))}
        </Indexes>,
      );
      const $indexesSidebar = container.querySelectorAll(`.${name}__sidebar-item`);
      expect($indexesSidebar.length).toBe(26);
    });

    it(':current', () => {
      const { container, rerender } = renderIndexes({ current: 3 });
      const getActiveItem = () => container.querySelector(`.${name}__sidebar-item--active`);

      expect(getActiveItem()).toHaveAttribute('data-index', '3');

      rerender(createIndexes({ current: 7 }));
      expect(getActiveItem()).toHaveAttribute('data-index', '7');
    });

    it(':defaultCurrent', async () => {
      const { container } = renderIndexes({ defaultCurrent: 5 });
      const $sideBarItems = container.querySelectorAll<HTMLElement>(`.${name}__sidebar-item`);

      expect(container.querySelector(`.${name}__sidebar-item--active`)).toHaveAttribute('data-index', '5');

      await act(async () => {
        fireEvent.click($sideBarItems[3]);
      });

      expect(container.querySelector(`.${name}__sidebar-item--active`)).toHaveAttribute('data-index', '7');
    });

    it(':sticky', async () => {
      const { container } = renderIndexes({ sticky: true });
      const $indexesContainer = container.firstChild as HTMLElement;
      Object.defineProperty($indexesContainer, 'scrollTop', {
        writable: true,
        value: 0,
      });
      $indexesContainer.scrollTo = vi.fn();

      await act(async () => {
        fireEvent.scroll($indexesContainer, { target: { scrollTop: 100 } });
      });

      const $indexesAnchors = container.querySelectorAll<HTMLElement>(`.${name}-anchor__wrapper`);
      expect($indexesAnchors.length).toBeGreaterThan(0);
    });

    it(':sticky is false', () => {
      const { container } = renderIndexes({ sticky: false });
      const $indexesAnchors = container.querySelectorAll<HTMLElement>(`.${name}-anchor__wrapper`);
      $indexesAnchors.forEach((anchor) => {
        expect(anchor.classList.contains(`${name}-anchor__wrapper--sticky`)).toBeFalsy();
      });
    });

    it(':stickyOffset', async () => {
      const stickyOffset = 50;
      const { container } = renderIndexes({ stickyOffset });
      const $indexesContainer = container.firstChild as HTMLElement;
      Object.defineProperty($indexesContainer, 'scrollTop', {
        writable: true,
        value: 0,
      });

      await act(async () => {
        fireEvent.scroll($indexesContainer, { target: { scrollTop: 100 } });
      });

      const $indexesAnchor = container.querySelector<HTMLElement>(`.${name}-anchor__wrapper`);
      if ($indexesAnchor) {
        expect($indexesAnchor.style.top).toBe(`${stickyOffset}px`);
      }
    });

    it(':showFullIndex true should display full index text', () => {
      const fullList = ['Apple', 'Banana', 'Cherry'];
      const { container } = render(<Indexes indexList={fullList} showFullIndex={true} />);
      const $items = container.querySelectorAll(`.${name}__sidebar-item`);
      expect($items[0].textContent).toBe('Apple');
      expect($items[1].textContent).toBe('Banana');
      expect($items[2].textContent).toBe('Cherry');
    });

    it(':showFullIndex false (default) should display first char only', () => {
      const fullList = ['Apple', 'Banana'];
      const { container } = render(<Indexes indexList={fullList} />);
      const $items = container.querySelectorAll(`.${name}__sidebar-item`);
      expect($items[0].textContent).toBe('A');
      expect($items[1].textContent).toBe('B');
    });

    it(':className', () => {
      const customClass = 'custom-indexes-class';
      const { container } = renderIndexes({ className: customClass });
      expect(container.firstChild).toHaveClass(customClass);
    });

    it(':style', () => {
      const customStyle = { height: '500px', backgroundColor: 'red' };
      const { container } = renderIndexes({ style: customStyle });
      const $indexes = container.firstChild as HTMLElement;
      expect($indexes.style.height).toBe('500px');
      expect($indexes.style.backgroundColor).toBe('red');
    });
  });

  describe('event', () => {
    it(':onSelect', async () => {
      const selectFn = vi.fn();
      const { container } = renderIndexes({ onSelect: selectFn });
      const $sideBarItem = container.querySelector<HTMLElement>(`.${name}__sidebar-item`);

      await act(async () => {
        fireEvent.click($sideBarItem);
      });

      expect(selectFn).toBeCalledWith(list[0].index);
    });

    it(':onChange', async () => {
      const changeFn = vi.fn();
      const selectFn = vi.fn();
      const { container } = renderIndexes({ onChange: changeFn, onSelect: selectFn });
      const $sideBarItems = container.querySelectorAll<HTMLElement>(`.${name}__sidebar-item`);

      await act(async () => {
        fireEvent.click($sideBarItems[1]);
      });

      expect(selectFn).toBeCalledWith(list[1].index);
      expect(changeFn).toBeCalledWith(list[1].index);
    });

    it(':onChange should be called on scroll', async () => {
      const changeFn = vi.fn();
      const { container } = renderIndexes({ onChange: changeFn });
      const $indexesContainer = container.firstChild as HTMLElement;
      Object.defineProperty($indexesContainer, 'scrollTop', {
        writable: true,
        value: 0,
      });

      await act(async () => {
        fireEvent.scroll($indexesContainer, { target: { scrollTop: 50 } });
      });

      // onChange 会在 activeSidebar 变化时触发
      expect(changeFn).toHaveBeenCalled();
    });
  });

  describe('behavior', () => {
    it('should show sidebar tips on click', async () => {
      const { container } = renderIndexes();
      const $sideBarItem = container.querySelector<HTMLElement>(`.${name}__sidebar-item`);

      await act(async () => {
        fireEvent.click($sideBarItem);
      });

      const $sidebarTip = container.querySelector(`.${name}__sidebar-tips`);
      expect($sidebarTip).toBeDefined();
      expect($sidebarTip.textContent).toBe(String(indexList[0]));
    });

    it('should hide sidebar tips after timeout', async () => {
      vi.useFakeTimers();
      const { container } = renderIndexes();
      const $sideBarItem = container.querySelector<HTMLElement>(`.${name}__sidebar-item`);

      await act(async () => {
        fireEvent.click($sideBarItem);
      });

      expect(container.querySelector(`.${name}__sidebar-tips`)).toBeDefined();

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      // Tips 应该在 1 秒后消失
      expect(container.querySelector(`.${name}__sidebar-tips`)).toBeNull();
      vi.useRealTimers();
    });

    it('should scroll to index on sidebar click', async () => {
      const { container } = renderIndexes();
      const $indexesContainer = container.firstChild as HTMLElement;
      const scrollToSpy = vi.fn();
      Object.defineProperty($indexesContainer, 'scrollTo', {
        writable: true,
        value: scrollToSpy,
      });

      const $sideBarItems = container.querySelectorAll<HTMLElement>(`.${name}__sidebar-item`);

      await act(async () => {
        fireEvent.click($sideBarItems[1]);
      });

      expect(scrollToSpy).toHaveBeenCalled();
    });

    it('should handle sidebar touchmove', async () => {
      const changeFn = vi.fn();
      const { container } = renderIndexes({ onChange: changeFn });
      const $sideBar = container.querySelector<HTMLElement>(`.${name}__sidebar`);

      // Mock elementFromPoint
      const $sideBarItems = $sideBar.querySelectorAll<HTMLElement>(`.${name}__sidebar-item`);
      document.elementFromPoint = vi.fn((clientX: number, clientY: number) => {
        const index = Math.floor(clientY / 20);
        return $sideBarItems[index] || null;
      });

      await act(async () => {
        fireEvent.touchStart($sideBar, { touches: [{ clientX: 20, clientY: 10 }] });
        fireEvent.touchMove($sideBar, { touches: [{ clientX: 20, clientY: 50 }] });
        fireEvent.touchEnd($sideBar, { touches: [{ clientX: 20, clientY: 50 }] });
      });

      const expectedIndex = indexList[Math.floor(50 / 20)];
      expect(changeFn).toBeCalledWith(expectedIndex);

      const $sidebarTip = container.querySelector(`.${name}__sidebar-tips`);
      expect($sidebarTip).toBeDefined();
      expect($sidebarTip.textContent).toBe(String(expectedIndex));
    });

    it('should handle touchmove with invalid target', async () => {
      const changeFn = vi.fn();
      const { container } = renderIndexes({ onChange: changeFn });
      const $sideBar = container.querySelector<HTMLElement>(`.${name}__sidebar`);

      // 等待组件初始化完成
      await act(async () => {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 0);
        });
      });

      // 清除初始化时的调用
      changeFn.mockClear();

      document.elementFromPoint = vi.fn(() => null);

      await act(async () => {
        fireEvent.touchMove($sideBar, { touches: [{ clientX: 20, clientY: 50 }] });
      });

      // touchmove 不应该触发新的 change
      expect(changeFn).not.toHaveBeenCalled();
    });

    it('should handle touchmove with non-sidebar-item target', async () => {
      const changeFn = vi.fn();
      const { container } = renderIndexes({ onChange: changeFn });
      const $sideBar = container.querySelector<HTMLElement>(`.${name}__sidebar`);

      await act(async () => {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 0);
        });
      });

      changeFn.mockClear();

      const mockElement = document.createElement('div');
      mockElement.className = 'other-class';
      document.elementFromPoint = vi.fn(() => mockElement);

      await act(async () => {
        fireEvent.touchMove($sideBar, { touches: [{ clientX: 20, clientY: 50 }] });
      });

      expect(changeFn).not.toHaveBeenCalled();
    });

    it('should handle touchmove when activeSidebar equals index', async () => {
      const changeFn = vi.fn();
      const { container } = renderIndexes({ onChange: changeFn });
      const $sideBar = container.querySelector<HTMLElement>(`.${name}__sidebar`);

      await act(async () => {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 0);
        });
      });

      const $sideBarItems = $sideBar.querySelectorAll<HTMLElement>(`.${name}__sidebar-item`);
      await act(async () => {
        fireEvent.click($sideBarItems[0]);
      });

      changeFn.mockClear();

      document.elementFromPoint = vi.fn(() => $sideBarItems[0]);

      await act(async () => {
        fireEvent.touchMove($sideBar, { touches: [{ clientX: 20, clientY: 10 }] });
      });

      expect(changeFn).not.toHaveBeenCalled();
    });

    it('should update active sidebar on scroll', async () => {
      const { container } = renderIndexes();
      const $indexesContainer = container.firstChild as HTMLElement;
      Object.defineProperty($indexesContainer, 'scrollTop', {
        writable: true,
        value: 0,
      });

      await act(async () => {
        fireEvent.scroll($indexesContainer, { target: { scrollTop: 100 } });
      });

      const $activeItems = container.querySelectorAll(`.${name}__sidebar-item--active`);
      expect($activeItems.length).toBeGreaterThan(0);
    });

    it('should handle empty children', () => {
      const { container } = render(<Indexes indexList={['A', 'B']} />);
      const $indexesSidebar = container.querySelectorAll(`.${name}__sidebar-item`);
      expect($indexesSidebar.length).toBe(2);
    });

    it('should not update highlight on scroll when no anchors are rendered', async () => {
      // 无 IndexesAnchor 子节点时，groupTop 为空，setAnchorOnScroll 立即返回
      const { container } = render(<Indexes indexList={['A', 'B', 'C']} />);
      const $indexesContainer = container.firstChild as HTMLElement;
      Object.defineProperty($indexesContainer, 'scrollTop', {
        writable: true,
        value: 0,
      });

      await act(async () => {
        fireEvent.scroll($indexesContainer, { target: { scrollTop: 100 } });
      });

      const $activeItems = container.querySelectorAll(`.${name}__sidebar-item--active`);
      expect($activeItems.length).toBe(0);
    });

    it('should apply translate3d transform when anchor is in betwixt range', async () => {
      const originalGBCR = HTMLDivElement.prototype.getBoundingClientRect;
      HTMLDivElement.prototype.getBoundingClientRect = function () {
        if (this.classList.contains(`${name}-anchor`)) {
          const dataIndex = (this as HTMLElement).dataset.index;
          const idx = indexList.findIndex((v) => String(v) === dataIndex);
          return {
            top: idx * 100,
            height: 50,
            left: 0,
            right: 0,
            bottom: idx * 100 + 50,
            width: 0,
            x: 0,
            y: idx * 100,
            toJSON: () => ({}),
          } as DOMRect;
        }
        return originalGBCR.call(this);
      };

      const { container } = renderIndexes({ sticky: true, stickyOffset: 0 });
      const $indexesContainer = container.firstChild as HTMLElement;

      Object.defineProperty($indexesContainer, 'scrollTop', {
        writable: true,
        value: 80,
        configurable: true,
      });

      await act(async () => {
        fireEvent.scroll($indexesContainer, { target: { scrollTop: 80 } });
      });

      const $wrappers = container.querySelectorAll<HTMLElement>(`.${name}-anchor__wrapper`);
      const hasNonZeroTransform = Array.from($wrappers).some(
        (w) => w.style.transform && /translate3d\(\s*0(?:px)?\s*,\s*(?!0px,|0,)/.test(w.style.transform),
      );
      expect(hasNonZeroTransform).toBeTruthy();

      HTMLDivElement.prototype.getBoundingClientRect = originalGBCR;
    });

    it('should not apply sticky class when scrollTop equals stickyTop', async () => {
      const { container } = renderIndexes({ sticky: true, stickyOffset: 100 });
      const $indexesContainer = container.firstChild as HTMLElement;

      Object.defineProperty($indexesContainer, 'scrollTop', {
        writable: true,
        value: 0,
        configurable: true,
      });

      await act(async () => {
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 50);
        });
        fireEvent.scroll($indexesContainer, { target: { scrollTop: 0 } });
      });

      const $wrappers = container.querySelectorAll<HTMLElement>(`.${name}-anchor__wrapper`);
      const hasSticky = Array.from($wrappers).some((w) => w.classList.contains(`${name}-anchor__wrapper--sticky`));
      expect(hasSticky).toBeFalsy();
    });

    it('should mark previous anchor as active when current anchor is sticky', async () => {
      const originalGBCR = HTMLDivElement.prototype.getBoundingClientRect;
      HTMLDivElement.prototype.getBoundingClientRect = function () {
        if (this.classList.contains(`${name}-anchor`)) {
          const dataIndex = (this as HTMLElement).dataset.index;
          const idx = indexList.findIndex((v) => String(v) === dataIndex);
          return {
            top: idx * 100,
            height: 50,
            left: 0,
            right: 0,
            bottom: idx * 100 + 50,
            width: 0,
            x: 0,
            y: idx * 100,
            toJSON: () => ({}),
          } as DOMRect;
        }
        return originalGBCR.call(this);
      };

      const { container } = renderIndexes({ sticky: true, stickyOffset: 0 });
      const $indexesContainer = container.firstChild as HTMLElement;

      Object.defineProperty($indexesContainer, 'scrollTop', {
        writable: true,
        value: 180,
        configurable: true,
      });

      await act(async () => {
        fireEvent.scroll($indexesContainer, { target: { scrollTop: 180 } });
      });

      const $wrappers = container.querySelectorAll<HTMLElement>(`.${name}-anchor__wrapper`);
      const activeCount = Array.from($wrappers).filter((w) =>
        w.classList.contains(`${name}-anchor__wrapper--active`),
      ).length;
      expect(activeCount).toBeGreaterThanOrEqual(2);

      HTMLDivElement.prototype.getBoundingClientRect = originalGBCR;
    });

    it('should ignore null element in IndexesContext.relation', () => {
      // 通过自定义子组件消费 IndexesContext，直接调用 relation(null, ...)，不应崩溃
      const ConsumerChild: React.FC = () => {
        const ctx = React.useContext(IndexesContext);
        React.useEffect(() => {
          ctx?.relation(null as unknown as HTMLElement, 'X');
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return null;
      };

      const { container } = render(
        <Indexes indexList={['A']}>
          <ConsumerChild />
          <IndexesAnchor index="A">
            <CellGroup>
              <Cell>Test</Cell>
            </CellGroup>
          </IndexesAnchor>
        </Indexes>,
      );
      expect(container).toBeTruthy();
    });
  });
});

describe('IndexesAnchor', () => {
  describe('props', () => {
    it(':index', () => {
      const { container } = render(
        <Indexes indexList={['A']}>
          <IndexesAnchor index="A">
            <CellGroup>
              <Cell>Test</Cell>
            </CellGroup>
          </IndexesAnchor>
        </Indexes>,
      );
      const $anchor = container.querySelector(`.${anchorName}`);
      expect($anchor).toBeTruthy();
      expect($anchor.getAttribute('data-index')).toBe('A');
    });

    it(':children', () => {
      const testId = 'anchor-children-test';
      const { container } = render(
        <Indexes indexList={['A']}>
          <IndexesAnchor index="A">
            <div data-testid={testId}>Custom Content</div>
          </IndexesAnchor>
        </Indexes>,
      );
      expect(container.querySelector(`[data-testid="${testId}"]`)).toBeTruthy();
    });

    it(':className', () => {
      const customClass = 'custom-anchor-class';
      const { container } = render(
        <Indexes indexList={['A']}>
          <IndexesAnchor index="A" className={customClass}>
            <CellGroup>
              <Cell>Test</Cell>
            </CellGroup>
          </IndexesAnchor>
        </Indexes>,
      );
      const $anchor = container.querySelector(`.${customClass}`);
      expect($anchor).toBeTruthy();
    });

    it(':style', () => {
      const customStyle = { padding: '10px', margin: '5px' };
      const { container } = render(
        <Indexes indexList={['A']}>
          <IndexesAnchor index="A" style={customStyle}>
            <CellGroup>
              <Cell>Test</Cell>
            </CellGroup>
          </IndexesAnchor>
        </Indexes>,
      );
      const $anchor = container.querySelector(`.${anchorName}`) as HTMLElement;
      expect($anchor.style.padding).toBe('10px');
      expect($anchor.style.margin).toBe('5px');
    });
  });

  describe('slot', () => {
    it(':default', () => {
      const { container } = render(
        <Indexes indexList={['A']}>
          <IndexesAnchor index="A">
            <CellGroup>
              <Cell>Test Content</Cell>
            </CellGroup>
          </IndexesAnchor>
        </Indexes>,
      );
      const $anchor = container.querySelector(`.${anchorName}`);
      expect($anchor).toBeTruthy();
      expect(container.querySelector(`.${prefix}-cell`)).toBeTruthy();
    });
  });
});

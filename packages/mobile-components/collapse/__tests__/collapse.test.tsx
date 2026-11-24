import React from 'react';
import { describe, expect, it, render, fireEvent, vi, beforeEach, afterEach, waitFor, act } from '@test/utils';
import { Collapse, CollapsePanel } from 'tdesign-mobile-react';

describe('Collapse', () => {
  describe('props', () => {
    it(':defaultValue', () => {
      const defaultValues: Array<string | number>[] = [['0'], ['1'], ['0', '1'], [0], [1], [0, 1]];

      function checkDefaultValue(defaultValue: Array<string | number>) {
        const { container } = render(
          <Collapse defaultValue={defaultValue}>
            <CollapsePanel value="0" header="面板1">
              内容1
            </CollapsePanel>
            <CollapsePanel value="1" header="面板2">
              内容2
            </CollapsePanel>
            <CollapsePanel value={0} header="面板3">
              内容3
            </CollapsePanel>
            <CollapsePanel value={1} header="面板4">
              内容4
            </CollapsePanel>
          </Collapse>,
        );

        const panels = container.querySelectorAll('.t-collapse-panel');

        if (defaultValue.includes('0')) {
          expect(panels[0]).toHaveClass('t-collapse-panel--expanded');
        } else {
          expect(panels[0]).not.toHaveClass('t-collapse-panel--expanded');
        }

        if (defaultValue.includes('1')) {
          expect(panels[1]).toHaveClass('t-collapse-panel--expanded');
        } else {
          expect(panels[1]).not.toHaveClass('t-collapse-panel--expanded');
        }

        if (defaultValue.includes(0)) {
          expect(panels[2]).toHaveClass('t-collapse-panel--expanded');
        } else {
          expect(panels[2]).not.toHaveClass('t-collapse-panel--expanded');
        }

        if (defaultValue.includes(1)) {
          expect(panels[3]).toHaveClass('t-collapse-panel--expanded');
        } else {
          expect(panels[3]).not.toHaveClass('t-collapse-panel--expanded');
        }
      }

      defaultValues.forEach(checkDefaultValue);
    });

    it(':value', () => {
      const values = [['0'], ['1'], ['0', '1'], [0], [1], [0, 1]];

      function checkValue(value: (string | number)[]) {
        const { container } = render(
          <Collapse value={value}>
            <CollapsePanel value="0" header="面板1">
              内容1
            </CollapsePanel>
            <CollapsePanel value="1" header="面板2">
              内容2
            </CollapsePanel>
            <CollapsePanel value={0} header="面板3">
              内容3
            </CollapsePanel>
            <CollapsePanel value={1} header="面板4">
              内容4
            </CollapsePanel>
          </Collapse>,
        );

        const panels = container.querySelectorAll('.t-collapse-panel');

        // 检查字符串类型的value
        expect(panels[0].classList.contains('t-collapse-panel--expanded')).toBe(value.includes('0'));
        expect(panels[1].classList.contains('t-collapse-panel--expanded')).toBe(value.includes('1'));

        // 检查数字类型的value
        expect(panels[2].classList.contains('t-collapse-panel--expanded')).toBe(value.includes(0));
        expect(panels[3].classList.contains('t-collapse-panel--expanded')).toBe(value.includes(1));
      }

      // 测试每个value情况
      values.forEach(checkValue);
    });

    it(':expandMutex', () => {
      const expandMutexValues = [true, false] as const;

      function checkExpandMutex(expandMutex: boolean) {
        const onChange = vi.fn();
        const { container } = render(
          <Collapse expandMutex={expandMutex} onChange={onChange}>
            <CollapsePanel value="0" header="面板1">
              内容1
            </CollapsePanel>
            <CollapsePanel value="1" header="面板2">
              内容2
            </CollapsePanel>
          </Collapse>,
        );

        const headers = container.querySelectorAll('.t-cell');

        // 点击第一个面板
        fireEvent.click(headers[0]);
        expect(onChange).toHaveBeenCalledWith(['0'], expect.any(Object));

        onChange.mockClear();

        // 点击第二个面板
        fireEvent.click(headers[1]);

        if (expandMutex) {
          // 在互斥模式下，只能展开一个面板
          expect(onChange).toHaveBeenCalledWith(['1'], expect.any(Object));
        } else {
          // 在非互斥模式下，可以展开多个面板
          expect(onChange).toHaveBeenCalledWith(['0', '1'], expect.any(Object));
        }
      }

      expandMutexValues.forEach(checkExpandMutex);
    });

    it(':disabled', () => {
      const disabledValues = [true, false] as const;

      function checkDisabled(disabled: (typeof disabledValues)[number]) {
        const onChange = vi.fn();
        const { container } = render(
          <Collapse disabled={disabled} onChange={onChange}>
            <CollapsePanel value="0" header="面板1">
              内容1
            </CollapsePanel>
            <CollapsePanel value="1" header="面板2">
              内容2
            </CollapsePanel>
          </Collapse>,
        );

        const headers = container.querySelectorAll('.t-cell');

        // 点击第一个面板
        fireEvent.click(headers[0]);

        if (disabled) {
          // 如果 disabled 为 true，不应该触发 onChange
          expect(onChange).not.toHaveBeenCalled();
        } else {
          // 如果 disabled 为 false，应该触发 onChange，展开第一个面板
          expect(onChange).toHaveBeenCalledWith(['0'], expect.any(Object));
        }

        onChange.mockClear();

        // 点击第二个面板
        fireEvent.click(headers[1]);

        if (disabled) {
          // 如果 disabled 为 true，不应该触发 onChange
          expect(onChange).not.toHaveBeenCalled();
        } else {
          // 如果 disabled 为 false，应该触发 onChange，展开第二个面板
          // 注意：在多选模式下，点击第二个面板会累积选择，所以期望的是 ['0', '1']
          expect(onChange).toHaveBeenCalledWith(['0', '1'], expect.any(Object));
        }
      }

      disabledValues.forEach(checkDisabled);
    });

    it(':theme', () => {
      const themes = ['default', 'card'] as const;

      function checkTheme(theme: (typeof themes)[number]) {
        const { container } = render(
          <Collapse theme={theme}>
            <CollapsePanel value="0" header="面板1">
              内容1
            </CollapsePanel>
          </Collapse>,
        );

        if (theme === 'default') {
          expect(container.querySelector('.t-collapse')).not.toHaveClass('t-collapse--card');
        } else {
          expect(container.querySelector('.t-collapse')).toHaveClass(`t-collapse--${theme}`);
        }
      }

      themes.forEach(checkTheme);
    });

    it(':defaultExpandAll', async () => {
      // 测试 expandMutex=false 时，所有面板都展开
      const { container } = render(
        <Collapse defaultExpandAll expandMutex={false}>
          <CollapsePanel value="0" header="面板1">
            内容1
          </CollapsePanel>
          <CollapsePanel value="1" header="面板2">
            内容2
          </CollapsePanel>
        </Collapse>,
      );

      // defaultExpandAll 通过 useEffect 触发，需要等待状态更新
      await waitFor(() => {
        const panels = container.querySelectorAll('.t-collapse-panel');
        expect(panels).toHaveLength(2);
        expect(panels[0]).toHaveClass('t-collapse-panel--expanded');
        expect(panels[1]).toHaveClass('t-collapse-panel--expanded');
      });
    });

    it(':defaultExpandAll with expandMutex', async () => {
      // 测试 expandMutex=true 时，只有第一个面板展开
      const { container } = render(
        <Collapse defaultExpandAll expandMutex={true}>
          <CollapsePanel value="0" header="面板1">
            内容1
          </CollapsePanel>
          <CollapsePanel value="1" header="面板2">
            内容2
          </CollapsePanel>
        </Collapse>,
      );

      // defaultExpandAll 通过 useEffect 触发，需要等待状态更新
      await waitFor(() => {
        const panels = container.querySelectorAll('.t-collapse-panel');
        expect(panels).toHaveLength(2);
        expect(panels[0]).toHaveClass('t-collapse-panel--expanded');
        expect(panels[1]).not.toHaveClass('t-collapse-panel--expanded');
      });
    });
  });

  describe('events', () => {
    it(':onChange in expandMutex mode', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Collapse expandMutex onChange={onChange}>
          <CollapsePanel value="0" header="面板1">
            内容1
          </CollapsePanel>
          <CollapsePanel value="1" header="面板2">
            内容2
          </CollapsePanel>
        </Collapse>,
      );

      const headers = container.querySelectorAll('.t-cell');

      // 点击第一个面板
      fireEvent.click(headers[0]);
      expect(onChange).toHaveBeenCalledWith(['0'], expect.any(Object));

      // 清除之前的调用记录
      onChange.mockClear();

      // 点击第二个面板，在互斥模式下应该只展开第二个
      fireEvent.click(headers[1]);
      expect(onChange).toHaveBeenCalledWith(['1'], expect.any(Object));
    });

    it(':onChange in multiple mode', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Collapse onChange={onChange}>
          <CollapsePanel value="0" header="面板1">
            内容1
          </CollapsePanel>
          <CollapsePanel value="1" header="面板2">
            内容2
          </CollapsePanel>
        </Collapse>,
      );

      const headers = container.querySelectorAll('.t-cell');

      // 点击第一个面板
      fireEvent.click(headers[0]);
      expect(onChange).toHaveBeenCalledWith(['0'], expect.any(Object));

      // 清除之前的调用记录
      onChange.mockClear();

      // 在多选模式下，点击第二个面板应该累积选择
      fireEvent.click(headers[1]);
      expect(onChange).toHaveBeenCalledWith(['0', '1'], expect.any(Object));
    });

    it(':should pass event object in onChange', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Collapse onChange={onChange}>
          <CollapsePanel value="0" header="面板1">
            内容1
          </CollapsePanel>
        </Collapse>,
      );

      const header = container.querySelector('.t-cell');
      fireEvent.click(header);

      expect(onChange).toHaveBeenCalledWith(
        ['0'],
        expect.objectContaining({
          e: expect.any(Object),
        }),
      );
    });
  });

  describe('edge cases', () => {
    it(':should handle empty children', () => {
      const { container } = render(<Collapse />);
      expect(container.querySelector('.t-collapse')).toBeInTheDocument();
    });

    it(':should handle single child', () => {
      const { container } = render(
        <Collapse>
          <CollapsePanel value="0" header="面板1">
            内容1
          </CollapsePanel>
        </Collapse>,
      );

      expect(container.querySelectorAll('.t-collapse-panel')).toHaveLength(1);
    });

    it(':should handle number value types', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Collapse onChange={onChange}>
          <CollapsePanel value={0} header="面板1">
            内容1
          </CollapsePanel>
        </Collapse>,
      );

      const header = container.querySelector('.t-cell');
      fireEvent.click(header);
      expect(onChange).toHaveBeenCalledWith([0], expect.any(Object));
    });

    it(':should handle string value types', () => {
      const onChange = vi.fn();
      const { container } = render(
        <Collapse onChange={onChange}>
          <CollapsePanel value="test-string" header="面板1">
            内容1
          </CollapsePanel>
        </Collapse>,
      );

      const header = container.querySelector('.t-cell');
      fireEvent.click(header);
      expect(onChange).toHaveBeenCalledWith(['test-string'], expect.any(Object));
    });

    it(':should handle non-array expandedValue gracefully', () => {
      const onChange = vi.fn();
      // 通过传入非数组的 value 来测试 Array.isArray(expandedValue) 为 false 的情况
      const { container } = render(
        <Collapse value={null as any} onChange={onChange}>
          <CollapsePanel value="1" header="标题一">
            这里是内容区域
          </CollapsePanel>
        </Collapse>,
      );
      const panel = container.querySelector('.t-collapse-panel__title');
      fireEvent.click(panel!);
      // 当 expandedValue 不是数组时，onPanelChange 不应该执行任何操作
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe(':debounce behavior', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it(':should debounce multiple panel expansions in defaultExpandAll mode', async () => {
      const onChange = vi.fn();
      const { getAllByText } = render(
        <Collapse defaultExpandAll={true} expandMutex={false} onChange={onChange}>
          <CollapsePanel header="面板1">内容1</CollapsePanel>
          <CollapsePanel header="面板2">内容2</CollapsePanel>
          <CollapsePanel header="面板3">内容3</CollapsePanel>
        </Collapse>,
      );

      const panels = getAllByText(/面板[123]/);

      // 初始状态，所有面板都应该展开
      expect(onChange).not.toHaveBeenCalled();

      // 快速连续点击多个面板
      fireEvent.click(panels[0]);
      fireEvent.click(panels[1]);
      fireEvent.click(panels[2]);

      // 立即检查，onChange应该已经被调用了（因为每次点击都会立即触发）
      expect(onChange).toHaveBeenCalled();

      // 重置mock，准备测试debounce行为
      onChange.mockClear();

      // 再次快速连续点击
      fireEvent.click(panels[0]);
      fireEvent.click(panels[1]);

      // 此时应该有一次debounced调用
      act(() => {
        vi.advanceTimersByTime(150);
      });

      // 验证最终状态
      expect(onChange).toHaveBeenCalled();
    });

    it(':should handle duplicate values correctly', async () => {
      const onChange = vi.fn();
      const { getAllByText } = render(
        <Collapse defaultExpandAll={true} expandMutex={false} onChange={onChange}>
          <CollapsePanel header="面板1">内容1</CollapsePanel>
          <CollapsePanel header="面板2">内容2</CollapsePanel>
        </Collapse>,
      );

      const panels = getAllByText(/面板[12]/);

      // 重置mock
      onChange.mockClear();

      // 重复点击同一个面板
      fireEvent.click(panels[0]);
      fireEvent.click(panels[0]);
      fireEvent.click(panels[0]);

      // 等待debounce
      act(() => {
        vi.advanceTimersByTime(150);
      });

      // 验证行为
      expect(onChange).toHaveBeenCalled();
    });
  });
});

describe('CollapsePanel', () => {
  describe('props', () => {
    it(':disabled', () => {
      const disabledValues = [true, false] as const;

      function checkDisabled(disabled: (typeof disabledValues)[number]) {
        const onChange = vi.fn();
        const { container } = render(
          <Collapse disabled={disabled} onChange={onChange}>
            <CollapsePanel value="0" header="面板1">
              内容1
            </CollapsePanel>
            <CollapsePanel value="1" header="面板2">
              内容2
            </CollapsePanel>
          </Collapse>,
        );

        const headers = container.querySelectorAll('.t-cell');

        // 点击第一个面板
        fireEvent.click(headers[0]);

        if (disabled) {
          // 如果 disabled 为 true，不应该触发 onChange
          expect(onChange).not.toHaveBeenCalled();
        } else {
          // 如果 disabled 为 false，应该触发 onChange，展开第一个面板
          expect(onChange).toHaveBeenCalledWith(['0'], expect.any(Object));
        }

        onChange.mockClear();

        // 点击第二个面板
        fireEvent.click(headers[1]);

        if (disabled) {
          // 如果 disabled 为 true，不应该触发 onChange
          expect(onChange).not.toHaveBeenCalled();
        } else {
          // 如果 disabled 为 false，应该触发 onChange，展开第二个面板
          // 注意：在多选模式下，点击第二个面板会累积选择，所以期望的是 ['0', '1']
          expect(onChange).toHaveBeenCalledWith(['0', '1'], expect.any(Object));
        }
      }

      disabledValues.forEach(checkDisabled);
    });

    it(':placement', () => {
      const placements = ['top', 'bottom'] as const;

      function checkPlacement(placement: (typeof placements)[number]) {
        const { container } = render(
          <Collapse>
            <CollapsePanel value="0" header="面板1" placement={placement}>
              内容1
            </CollapsePanel>
          </Collapse>,
        );
        expect(container.querySelector('.t-collapse-panel')).toHaveClass(`t-collapse-panel--${placement}`);
      }

      placements.forEach(checkPlacement);
    });

    it(':should render correct icon when placement is top and expanded', () => {
      const { container } = render(
        <Collapse defaultValue={['0']}>
          <CollapsePanel value="0" header="面板1" placement="top">
            内容1
          </CollapsePanel>
        </Collapse>,
      );

      // 检查面板是否激活
      const panel = container.querySelector('.t-collapse-panel');
      expect(panel).toHaveClass('t-collapse-panel--expanded');

      // 检查图标是否存在（当placement为top且激活时）
      const icon = container.querySelector('.t-collapse-panel__header-icon');
      expect(icon).toBeInTheDocument();
      expect(panel).toHaveClass('t-collapse-panel--expanded');
      expect(panel).toHaveClass('t-collapse-panel--top');
    });

    it(':should render correct icon when placement is bottom and expanded', () => {
      const { container } = render(
        <Collapse defaultValue={['0']}>
          <CollapsePanel value="0" header="面板1" placement="bottom">
            内容1
          </CollapsePanel>
        </Collapse>,
      );

      // 检查面板是否激活
      const panel = container.querySelector('.t-collapse-panel');
      expect(panel).toHaveClass('t-collapse-panel--expanded');

      // 检查图标是否存在（当placement为bottom且激活时）
      const icon = container.querySelector('.t-collapse-panel__header-icon');
      expect(icon).toBeInTheDocument();
      expect(panel).toHaveClass('t-collapse-panel--expanded');
      expect(panel).toHaveClass('t-collapse-panel--bottom');
    });

    it(': destroyOnCollapse', () => {
      const destroyOnCollapseOptions = [true, false] as const;

      function checkDestroyOnCollapse(destroyOnCollapse: (typeof destroyOnCollapseOptions)[number]) {
        const { container, rerender } = render(
          <Collapse value={['0']}>
            <CollapsePanel value="0" header="面板1" destroyOnCollapse={destroyOnCollapse}>
              <div className="test-content">内容1</div>
            </CollapsePanel>
          </Collapse>,
        );

        // 展开时内容存在
        expect(container.querySelector('.test-content')).toBeInTheDocument();

        // 折叠时内容处理
        rerender(
          <Collapse value={[]}>
            <CollapsePanel value="0" header="面板1" destroyOnCollapse={destroyOnCollapse}>
              <div className="test-content">内容1</div>
            </CollapsePanel>
          </Collapse>,
        );

        if (destroyOnCollapse) {
          expect(container.querySelector('.test-content')).not.toBeInTheDocument();
        } else {
          expect(container.querySelector('.test-content')).toBeInTheDocument();
        }
      }

      destroyOnCollapseOptions.forEach(checkDestroyOnCollapse);
    });

    it(':header', () => {
      const title = 'Tdesign';
      const { container } = render(
        <Collapse>
          <CollapsePanel value="0" header={title}>
            Tdesign React for Mobile
          </CollapsePanel>
        </Collapse>,
      );
      expect(container.querySelector('.t-cell__title-text').innerHTML.trim()).toBe(title);
    });

    it(':expandIcon', () => {
      const customIcon = <span className="custom-icon">Tdesign</span>;
      const { container } = render(
        <Collapse>
          <CollapsePanel value="0" header="Tdesign" expandIcon={customIcon}>
            Tdesign React for Mobile
          </CollapsePanel>
        </Collapse>,
      );
      expect(container.querySelector('.custom-icon')).toBeInTheDocument();
    });

    it(':headerRightContent', () => {
      const rightContent = <span className="right-content">Tdesign React for Mobile</span>;
      const { container } = render(
        <Collapse>
          <CollapsePanel value="0" header="Tdesign" headerRightContent={rightContent}>
            Tdesign React for Mobile
          </CollapsePanel>
        </Collapse>,
      );
      expect(container.querySelector('.right-content')).toBeInTheDocument();
    });

    it(':headerLeftIcon', () => {
      const leftIcon = <span className="left-icon">Tdesign</span>;
      const { container } = render(
        <Collapse>
          <CollapsePanel value="0" header="Tdesign" headerLeftIcon={leftIcon}>
            Tdesign React for Mobile
          </CollapsePanel>
        </Collapse>,
      );
      expect(container.querySelector('.left-icon')).toBeInTheDocument();
    });
  });

  describe('slot', () => {
    it(':content', () => {
      const title = 'Tdesign';
      const content = 'Tdesign React for Mobile';
      const { container } = render(
        <Collapse>
          <CollapsePanel value="0" header={title}>
            {content}
          </CollapsePanel>
        </Collapse>,
      );
      expect(container.querySelector('.t-cell__title-text').innerHTML.trim()).toBe(title);
      expect(container.querySelector('.t-collapse-panel__content').innerHTML.trim()).toBe(content);
    });

    it(':content prop', () => {
      const content = 'Tdesign React for Mobile';
      const { container } = render(
        <Collapse>
          <CollapsePanel value="1" header="Tdesign">
            {content}
          </CollapsePanel>
        </Collapse>,
      );
      const contentElement = container.querySelector('.t-collapse-panel__content');
      expect(contentElement).toBeInTheDocument();
      expect(contentElement.textContent.trim()).toBe(content);
    });
  });

  describe('interaction', () => {
    it(':should toggle expand/collapse state', () => {
      const { container } = render(
        <Collapse>
          <CollapsePanel value="0" header="面板1">
            内容1
          </CollapsePanel>
        </Collapse>,
      );

      const panel = container.querySelector('.t-collapse-panel');
      const header = container.querySelector('.t-cell');

      // 初始状态应该是折叠的
      expect(panel).not.toHaveClass('t-collapse-panel--expanded');

      // 点击展开
      fireEvent.click(header);
      expect(panel).toHaveClass('t-collapse-panel--expanded');

      // 再次点击折叠
      fireEvent.click(header);
      expect(panel).not.toHaveClass('t-collapse-panel--expanded');
    });
  });
});

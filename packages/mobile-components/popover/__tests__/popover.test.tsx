import { render, fireEvent, waitFor, describe, test, expect, vi } from '@test/utils';
import React from 'react';
import Popover from '../index';

describe('Popover', () => {
  describe('props', () => {
    // 测试字符串内容渲染
    test(':content string', async () => {
      const { container } = render(
        <Popover content="String content">
          <button>Trigger</button>
        </Popover>,
      );

      fireEvent.click(container.querySelector('button')!);

      await waitFor(() => {
        expect(container.querySelector('.t-popover__content')).toHaveTextContent('String content');
      });
    });

    // 测试JSX内容渲染
    test(':content JSX', async () => {
      const { container } = render(
        <Popover content={<div className="custom-content">JSX content</div>}>
          <button>Trigger</button>
        </Popover>,
      );

      fireEvent.click(container.querySelector('button')!);

      await waitFor(() => {
        expect(container.querySelector('.custom-content')).toHaveTextContent('JSX content');
      });
    });

    // 测试空内容
    test(':content null', async () => {
      const { container } = render(
        <Popover content={null}>
          <button>Trigger</button>
        </Popover>,
      );

      fireEvent.click(container.querySelector('button')!);

      await waitFor(() => {
        expect(container.querySelector('.t-popover__content')).toHaveTextContent('');
      });
    });

    // 测试四个方向
    /* eslint-disable no-await-in-loop */
    test(':placement', async () => {
      const placements = ['top', 'bottom', 'left', 'right'] as const;
      for (const placement of placements) {
        const { container, unmount } = render(
          <Popover content="Test" placement={placement} visible={true}>
            <button>Trigger</button>
          </Popover>,
        );

        await waitFor(() => {
          expect(container.querySelector('.t-popover')).toHaveAttribute('data-popper-placement', placement);
        });

        unmount();
      }
    });

    // 测试复杂的方向放置
    test(':placement complex', async () => {
      const complexPlacements = [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'left-top',
        'left-bottom',
        'right-top',
        'right-bottom',
      ] as const;

      for (const placement of complexPlacements) {
        const { container, unmount } = render(
          <Popover content="Test" placement={placement} visible={true}>
            <button>Trigger</button>
          </Popover>,
        );

        await waitFor(() => {
          expect(container.querySelector('.t-popover')).toHaveAttribute('data-popper-placement', placement);
        });

        unmount();
      }
    });

    // 测试主题
    /* eslint-disable no-await-in-loop */
    test(':theme', async () => {
      const themes = ['dark', 'light', 'brand', 'success', 'warning', 'error'] as const;

      for (const theme of themes) {
        const { container, unmount } = render(
          <Popover content="Test" theme={theme}>
            <button>Trigger</button>
          </Popover>,
        );

        fireEvent.click(container.querySelector('button')!);

        await waitFor(() => {
          expect(container.querySelector('.t-popover__content')).toHaveClass(`t-popover--${theme}`);
        });

        unmount();
      }
    });

    // 测试显示箭头
    /* eslint-disable no-await-in-loop */
    test(':showArrow true', async () => {
      const { container } = render(
        <Popover content="Test" showArrow={true}>
          <button>Trigger</button>
        </Popover>,
      );

      fireEvent.click(container.querySelector('button')!);

      await waitFor(() => {
        expect(container.querySelector('.t-popover__arrow')).toBeTruthy();
      });
    });

    // 测试不显示箭头
    test(':showArrow false', async () => {
      const { container } = render(
        <Popover content="Test" showArrow={false}>
          <button>Trigger</button>
        </Popover>,
      );

      fireEvent.click(container.querySelector('button')!);

      await waitFor(() => {
        expect(container.querySelector('.t-popover__arrow')).toBeNull();
      });
    });

    // 测试visible
    test(':visible', () => {
      const { container } = render(
        <Popover content="Test" visible={true}>
          <button>Trigger</button>
        </Popover>,
      );

      expect(container.querySelector('.t-popover')).not.toHaveStyle('display: none');
    });

    // 测试triggerElement方式触发是否有效
    test(':triggerElement', async () => {
      const { container } = render(
        <Popover content="Test" triggerElement={<span className="custom-trigger">Custom</span>} />,
      );

      expect(container.querySelector('.custom-trigger')).toHaveTextContent('Custom');

      fireEvent.click(container.querySelector('.custom-trigger')!);

      await waitFor(() => {
        expect(container.querySelector('.t-popover')).toBeTruthy();
      });
    });

    // 测试非受控模式
    test(':defaultVisible', async () => {
      const { container } = render(
        <Popover content="Test" defaultVisible={true}>
          <button>Trigger</button>
        </Popover>,
      );

      await waitFor(() => {
        expect(container.querySelector('.t-popover')).not.toHaveStyle('display: none');
      });
    });

    // 测试外接类
    test(':className', () => {
      const { container } = render(
        <Popover content="Test" className="custom-popover">
          <button>Trigger</button>
        </Popover>,
      );

      expect(container.querySelector('.t-popover__wrapper')).toHaveClass('custom-popover');
    });

    // 测试內联样式
    test(':style', () => {
      const { container } = render(
        <Popover content="Test" style={{ backgroundColor: 'red' }}>
          <button>Trigger</button>
        </Popover>,
      );

      expect(container.querySelector('.t-popover__wrapper')).toHaveStyle('background-color: rgb(255, 0, 0)');
    });
  });

  describe('events', () => {
    // 测试内外点击，内部点击不关闭，外部点击关闭
    test(':closeOnClickOutside', async () => {
      const { container } = render(
        <div>
          <Popover content="Test" closeOnClickOutside={true}>
            <button>Trigger</button>
          </Popover>
          <div className="outside">Outside</div>
        </div>,
      );

      fireEvent.click(container.querySelector('button')!);
      await waitFor(() => {
        expect(container.querySelector('.t-popover')).toBeTruthy();
      });

      fireEvent.click(container.querySelector('.outside')!);
      await waitFor(() => {
        expect(container.querySelector('.t-popover')).toHaveStyle('display: none');
      });
    });

    // 测试closeOnClickOutside属性
    test(':closeOnClickOutside false', async () => {
      const { container } = render(
        <div>
          <Popover content="Test" closeOnClickOutside={false}>
            <button>Trigger</button>
          </Popover>
          <div className="outside">Outside</div>
        </div>,
      );

      fireEvent.click(container.querySelector('button')!);
      await waitFor(() => {
        expect(container.querySelector('.t-popover')).not.toHaveStyle('display: none');
      });

      fireEvent.click(container.querySelector('.outside')!);
      await waitFor(() => {
        expect(container.querySelector('.t-popover')).not.toHaveStyle('display: none');
      });
    });

    // 测试点击内部关闭
    test(':closeOnClickOutside', async () => {
      const { container } = render(
        <Popover content="Test">
          <button>Trigger</button>
        </Popover>,
      );

      const trigger = container.querySelector('button')!;

      fireEvent.click(trigger);
      await waitFor(() => {
        expect(container.querySelector('.t-popover')).not.toHaveStyle('display: none');
      });

      fireEvent.click(trigger);
      await waitFor(() => {
        expect(container.querySelector('.t-popover')).toHaveStyle('display: none');
      });
    });

    // 测试vesible变化是否成功监听
    test(':onVisibleChange', async () => {
      const onVisibleChange = vi.fn();
      const { container } = render(
        <Popover content="Test" onVisibleChange={onVisibleChange}>
          <button>Trigger</button>
        </Popover>,
      );

      fireEvent.click(container.querySelector('button')!);

      await waitFor(() => {
        expect(onVisibleChange).toHaveBeenCalledWith(true);
      });
    });

    // 测试组件ref暴露
    test(':ref functionality', () => {
      const ref = React.createRef<any>();
      render(
        <Popover content="Test" ref={ref}>
          <button>Trigger</button>
        </Popover>,
      );

      expect(ref.current).toBeTruthy();
      expect(typeof ref.current.updatePopper).toBe('function');
      expect(() => ref.current.updatePopper()).not.toThrow();
    });

    // 测试placement变化是否成功
    test(':placement update', async () => {
      const { container, rerender } = render(
        <Popover content="Test" placement="top" visible={true}>
          <button>Trigger</button>
        </Popover>,
      );

      await waitFor(() => {
        expect(container.querySelector('.t-popover')).toHaveAttribute('data-popper-placement', 'top');
      });

      rerender(
        <Popover content="Test" placement="bottom" visible={true}>
          <button>Trigger</button>
        </Popover>,
      );

      await waitFor(() => {
        expect(container.querySelector('.t-popover')).toHaveAttribute('data-popper-placement', 'bottom');
      });
    });

    // 测试组件卸载是否成功
    test(':component unmount cleanup', () => {
      const { container, unmount } = render(
        <Popover content="Test" visible={true}>
          <button>Trigger</button>
        </Popover>,
      );

      expect(container.querySelector('.t-popover')).toBeTruthy();
      expect(() => unmount()).not.toThrow();
    });
  });
});

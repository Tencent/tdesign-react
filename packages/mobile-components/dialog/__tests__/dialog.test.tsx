import React, { act } from 'react';
import { render, screen, fireEvent, vi, it, describe, expect, afterEach, beforeEach, cleanup } from '@test/utils';
import Button from 'tdesign-mobile-react/button/Button';
import { DialogPlugin, Dialog } from '../index';

const prefix = 't';
const name = `.${prefix}-dialog`;

describe('Dialog', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    const overlays = document.querySelectorAll('.t-overlay');
    const popups = document.querySelectorAll('.t-popup');
    const dialogs = document.querySelectorAll('.t-dialog');

    overlays.forEach((overlay) => overlay.remove());
    popups.forEach((popup) => popup.remove());
    dialogs.forEach((dialog) => dialog.remove());
    vi.useRealTimers();
  });

  describe('props', () => {
    it(': visible', async () => {
      const { rerender } = render(<Dialog visible />);
      expect(document.querySelector(name)).toBeInTheDocument();

      rerender(<Dialog visible={false} title="标题" />);
      await act(async () => {
        vi.advanceTimersByTime(300);
      });
      expect(document.querySelector('.t-popup')).toHaveStyle({ display: 'none' });
    });

    it(': title', () => {
      render(<Dialog visible title="标题" />);
      expect(document.querySelector(`${name}__header`).textContent).toBe('标题');
    });

    it(': content', () => {
      render(<Dialog visible content="中间内容" />);
      expect(document.querySelector(`${name}__content`).textContent).toBe('中间内容');
    });

    it(': middle', () => {
      render(<Dialog visible middle={<div className="custom-middle">自定义内容</div>} />);
      expect(document.querySelector('.custom-middle')).toBeInTheDocument();
    });

    it(': top', () => {
      render(<Dialog visible top={<div className="custom-top">自定义顶部内容</div>} />);
      expect(document.querySelector('.custom-top')).toBeInTheDocument();
    });

    it(': destroyOnClose', () => {
      render(<Dialog visible destroyOnClose={true} content="中间内容" />);
      expect(document.querySelector(name)).not.toBeNull();
    });

    it(': overlayProps', async () => {
      const backgroundColor = 'rgba(0, 0, 0, 0.5)';
      render(<Dialog visible overlayProps={{ backgroundColor, duration: 100 }} content="中间内容" />);
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      const overlay = document.querySelector('.t-overlay');
      expect(overlay).toHaveStyle(`background-color: ${backgroundColor}`);
    });

    it(': preventScrollThrough', () => {
      render(<Dialog visible preventScrollThrough content="中间内容" />);
      const classNames = document.body.className;
      expect(classNames).toBe('t-overlay--lock t-popup--lock');
    });

    it(': showOverlay', () => {
      render(<Dialog visible showOverlay={false} content="中间内容" />);
      expect(document.querySelector('.t-overlay')).toBeFalsy();
    });

    it(': buttonLayout', () => {
      const confirmBtn = {
        content: '确认',
        variant: 'text' as const,
        size: 'large' as const,
      };
      const cancelBtn = () => <Button content="取消" variant="text" size="large" />;
      const { rerender } = render(
        <Dialog visible buttonLayout="vertical" confirmBtn={confirmBtn} cancelBtn={cancelBtn} />,
      );
      expect(document.querySelector(`${name}__footer--column`)).toBeTruthy();

      rerender(<Dialog visible buttonLayout="horizontal" confirmBtn="确定" cancelBtn="取消" />);
      expect(document.querySelector(`${name}__button--horizontal`)).toBeTruthy();
    });

    it(': actions', () => {
      const onClose = vi.fn();
      const { rerender } = render(
        <Dialog
          visible
          actions={[{ content: '按钮1', className: 'test-btn' }, <Button key="btn2">按钮2</Button>]}
          onClose={onClose}
        />,
      );
      fireEvent.click(document.querySelector('.test-btn'));
      expect(onClose).toHaveBeenCalled();

      rerender(<Dialog visible actions={[]} />);
      const footer = document.querySelector(`${name}__footer`);
      expect(footer).toBeTruthy();

      rerender(<Dialog visible actions={[undefined, null]} />);
      expect(document.querySelector(`${name}__footer`)).toBeTruthy();
    });

    it(': closeBtn', () => {
      render(<Dialog visible closeBtn />);
      expect(document.querySelector(`${name}__close-btn`)).toBeTruthy();
    });

    it(': zIndex', () => {
      render(<Dialog visible zIndex={3000} content="内容" />);
      expect(document.querySelector('.t-popup')).toBeTruthy();
    });

    it(': width', () => {
      const { rerender } = render(<Dialog visible width="300px" />);
      expect(document.querySelector(name)).toHaveStyle('width: 300px');

      rerender(<Dialog visible width={400} />);
      expect(document.querySelector(name)).toHaveStyle('width: 400px');
    });

    it(': closeOnOverlayClick', async () => {
      const onClose = vi.fn();
      render(<Dialog visible closeOnOverlayClick onClose={onClose} />);
      const overlay = document.querySelector('.t-overlay');
      fireEvent.click(overlay);
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('plugin', () => {
    it(': show', async () => {
      let instance = null;
      const onClose = vi.fn();
      const onConfirm = vi.fn();
      const onClosed = vi.fn();
      await act(async () => {
        instance = DialogPlugin({
          title: '标题',
          visible: false,
          closeBtn: true,
          content: '中间内容',
          confirmBtn: {
            content: '确定',
            className: 'confirm-btn',
          },
          cancelBtn: {
            content: '取消',
            className: 'cancel-btn',
          },
          onClose,
          onConfirm,
          onClosed,
        });
      });
      instance.show();
      const dialog = document.querySelector(name);
      expect(dialog).toBeTruthy();

      const closeBtn = document.querySelector('.t-icon');
      const confirmBtn = document.querySelector('.confirm-btn');
      const cancelBtn = document.querySelector('.cancel-btn');
      await act(async () => {
        fireEvent.click(closeBtn);
        fireEvent.click(confirmBtn);
        fireEvent.click(cancelBtn);
      });
      expect(onClose).toHaveBeenCalled();
      expect(onConfirm).toHaveBeenCalled();
      await act(async () => {
        await vi.advanceTimersByTime(1000);
      });
      expect(onClosed).toHaveBeenCalled();
    });

    it(': hide', async () => {
      let instance = null;
      const onClosed = vi.fn();
      await act(async () => {
        instance = DialogPlugin({
          title: '标题',
          onClosed,
        });
      });
      await act(async () => {
        instance.hide();
      });
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      expect(document.querySelector(name)).toBeFalsy();
      expect(onClosed).toHaveBeenCalled();
    });

    it(': update', async () => {
      let instance = null;
      await act(async () => {
        instance = DialogPlugin({
          title: '标题',
          onConfirm: vi.fn(),
          onCancel: vi.fn(),
        });
      });
      await act(async () => {
        instance.update({ title: '新标题' });
      });
      expect(document.querySelector(`${name}__header`).textContent).toBe('新标题');
    });

    it(': destroy', async () => {
      let instance = null;
      await act(async () => {
        instance = DialogPlugin({
          title: '标题',
        });
      });
      instance.destroy();
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      expect(document.querySelector(name)).toBeFalsy();
    });

    it(': alert', async () => {
      await act(async () => {
        Dialog.alert({
          title: '标题',
          content: '内容',
        });
      });

      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      expect(document.querySelector(`${name}__header`)).toBeTruthy();
    });

    it(': confirm', async () => {
      await act(async () => {
        Dialog.confirm({
          title: '标题',
          content: '内容',
          onConfirm: vi.fn(),
        });
      });
      expect(document.querySelector(`${name}__header`)).toBeTruthy();
    });
  });

  describe('event', () => {
    it(': onCancel', () => {
      const onCancel = vi.fn();
      const onClose = vi.fn();
      const { rerender } = render(<Dialog cancelBtn="退出" visible onCancel={onCancel} onClose={onClose} />);
      fireEvent.click(screen.getByText('退出'));
      expect(onCancel).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();

      rerender(<Dialog visible cancelBtn="退出" />);
      fireEvent.click(screen.getByText('退出'));
    });

    it(': onClose', async () => {
      const onClose = vi.fn();
      render(<Dialog visible closeBtn onClose={onClose} />);
      const closeBtn = document.querySelector('.t-icon');
      fireEvent.click(closeBtn);
      setTimeout(() => {
        expect(onClose).toHaveBeenCalled();
        expect(document.querySelector(name)).toBeFalsy();
      }, 1000);
    });

    it(': onClosed', async () => {
      const onClosed = vi.fn();
      const { rerender } = render(<Dialog visible onClosed={onClosed} />);
      rerender(<Dialog visible={false} onClosed={onClosed} />);
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      expect(onClosed).toHaveBeenCalled();
    });

    it(': onConfirm', () => {
      const onConfirm = vi.fn();
      const { rerender } = render(<Dialog confirmBtn="下一步" visible onConfirm={onConfirm} />);
      fireEvent.click(screen.getByText('下一步'));
      expect(onConfirm).toHaveBeenCalled();

      rerender(<Dialog visible confirmBtn="下一步" />);
      fireEvent.click(screen.getByText('下一步'));
    });

    it(': onOverlayClick', async () => {
      const onOverlayClick = vi.fn();
      render(<Dialog visible onOverlayClick={onOverlayClick} />);
      const overlay = document.querySelector('.t-overlay');
      fireEvent.click(overlay);
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });
      expect(onOverlayClick).toHaveBeenCalled();
    });
  });
});

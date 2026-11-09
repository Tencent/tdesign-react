import React, { useState } from 'react';
import { fireEvent, mockTimeout, render, vi, waitFor } from '@test/utils';

import Drawer from '../index';
import { DrawerPlugin } from '../plugin';

import type { DrawerProps } from '../index';

function DrawerDemo(props) {
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  const drawerProps: DrawerProps = {};
  Object.keys(props).forEach((key) => {
    if (props[key] !== undefined) {
      drawerProps[key] = props[key];
    }
  });
  return (
    <>
      <div onClick={handleClick}>Open</div>
      <Drawer visible={visible} onClose={handleClose} showOverlay={!props.notShowOverlay} {...drawerProps}>
        <p>This is a drawer</p>
      </Drawer>
    </>
  );
}

describe('Drawer', () => {
  describe('props', () => {
    test('placement[top]', async () => {
      const { getByText } = render(<DrawerDemo placement="top" />);
      fireEvent.click(getByText('Open'));
      expect(document.querySelector('.t-drawer__content-wrapper--right')).not.toBeInTheDocument();
      expect(document.querySelector('.t-drawer__content-wrapper--top')).toBeInTheDocument();
    });

    test('size[string]', async () => {
      const { getByText } = render(<DrawerDemo size="50%" />);
      fireEvent.click(getByText('Open'));
      expect(document.querySelector('.t-drawer__content-wrapper--right')).toHaveStyle({ width: '50%' });
    });

    test('showOverlay[false]', () => {
      const { getByText } = render(<DrawerDemo notShowOverlay />);
      fireEvent.click(getByText('Open'));
      expect(document.querySelector('.t-drawer__mask')).not.toBeInTheDocument();
    });

    test('cancelBtn[object/TNode] and confirmBtn[object/TNode]', () => {
      const { getByText, unmount } = render(
        <DrawerDemo
          confirmBtn={{
            content: '确认按钮',
            theme: 'success',
          }}
          cancelBtn={{
            content: '取消按钮',
            theme: 'danger',
          }}
        />,
      );
      fireEvent.click(getByText('Open'));

      const confirmBtn = getByText('确认按钮');
      const cancelBtn = getByText('取消按钮');

      expect(cancelBtn).toBeInTheDocument();
      expect(confirmBtn).toBeInTheDocument();

      expect(confirmBtn.parentElement).toHaveClass('t-drawer__confirm');
      expect(cancelBtn.parentElement).toHaveClass('t-drawer__cancel');
      expect(confirmBtn.parentElement.parentElement.parentElement).toHaveClass('t-drawer__footer');
      expect(cancelBtn.parentElement.parentElement.parentElement).toHaveClass('t-drawer__footer');

      expect(confirmBtn.parentElement).toHaveClass(`t-button--theme-success`);
      expect(cancelBtn.parentElement).toHaveClass(`t-button--theme-danger`);

      unmount();
      const { getByText: getCustomText } = render(
        <DrawerDemo cancelBtn={<div>cancelBtn</div>} confirmBtn={<div>confirmBtn</div>} />,
      );
      fireEvent.click(getCustomText('Open'));
      expect(getCustomText('cancelBtn').parentElement.parentElement).toHaveClass('t-drawer__footer');
      expect(getCustomText('confirmBtn').parentElement.parentElement).toHaveClass('t-drawer__footer');
    });

    test('mode[push]', async () => {
      const { getByText } = render(<DrawerDemo attach="body" mode="push" />);
      fireEvent.click(getByText('Open'));

      await waitFor(() => {
        expect(document.body).toHaveStyle({
          margin: '0 0 0 -300px',
        });
      });
    });

    test('header[TNode] and footer[TNode]', () => {
      const { getByText } = render(<DrawerDemo header={<div>自定义头部</div>} footer={<div>自定义底部</div>} />);
      fireEvent.click(getByText('Open'));
      expect(getByText('自定义头部').parentElement).toHaveClass('t-drawer__header');
      expect(getByText('自定义底部').parentElement).toHaveClass('t-drawer__footer');
    });

    test('visible', () => {
      const { getByText } = render(<DrawerDemo />);
      fireEvent.click(getByText('Open'));
      expect(document.querySelector('.t-drawer--open')).toBeInTheDocument();
      expect(document.querySelector('.t-drawer__mask')).toBeInTheDocument();
      expect(document.querySelector('.t-drawer__content-wrapper--right')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    test('onCancel', () => {
      const onCancelFn = vi.fn();
      const { getByText } = render(<DrawerDemo onCancel={onCancelFn} />);
      fireEvent.click(getByText('Open'));
      expect(onCancelFn).not.toHaveBeenCalled();
      fireEvent.click(getByText('取消'));
      expect(onCancelFn).toHaveBeenCalled();
    });
  });

  describe('scenarios', () => {
    test('closeBtn with visible and onClose hides drawer', async () => {
      const { getByText } = render(<DrawerDemo closeBtn={true} />);
      fireEvent.click(getByText('Open'));
      fireEvent.click(document.querySelector('.t-drawer__close-btn'));
      expect(document.querySelector('.t-drawer--open')).not.toBeInTheDocument();
      expect(document.querySelector('.t-drawer')).toBeInTheDocument();
    });

    test('showOverlay with visible and onClose hides drawer on mask click', async () => {
      const { getByText } = render(<DrawerDemo />);
      fireEvent.click(getByText('Open'));
      expect(document.querySelector('.t-drawer--open')).toBeInTheDocument();
      fireEvent.click(document.querySelector('.t-drawer--open')?.children[0]);
      expect(document.querySelector('.t-drawer--open')).not.toBeInTheDocument();
    });
  });

  describe('instanceFunctions', () => {
    test('onConfirm', async () => {
      const calls: string[] = [];
      const drawerNode = DrawerPlugin({
        header: 'test',
        onConfirm: () => {
          calls.push('old');
        },
      });
      await mockTimeout(() => true, 50);

      drawerNode.update({
        onConfirm: () => {
          calls.push('new');
        },
      });
      await mockTimeout(() => true, 50);

      fireEvent.click(document.querySelector('.t-drawer__confirm'));

      expect(calls).toEqual(['new']);

      drawerNode.destroy();
      await mockTimeout(() => expect(document.querySelector('.t-drawer--open')).not.toBeInTheDocument(), 500);
    });
  });

  describe('sizeDraggable', () => {
    const mockViewport = () => {
      vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1000);
      vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800);
    };

    const getHandle = () => document.querySelector<HTMLElement>('[style*="col-resize"]');
    const getDrawer = () => document.querySelector<HTMLElement>('.t-drawer__content-wrapper');
    const moveTo = (x: number, buttons: number) => {
      const event = new MouseEvent('mousemove', {
        clientX: x,
        clientY: 20,
        buttons,
        bubbles: true,
      });
      Object.defineProperty(event, 'x', { value: x });
      Object.defineProperty(event, 'y', { value: 20 });
      fireEvent(document, event);
    };

    test('lost mouseup stops resizing on the next move', () => {
      mockViewport();
      const onSizeDragEnd = vi.fn();
      const { getByText } = render(<DrawerDemo sizeDraggable placement="right" onSizeDragEnd={onSizeDragEnd} />);
      fireEvent.click(getByText('Open'));

      fireEvent.mouseDown(getHandle(), { button: 0, buttons: 1 });
      moveTo(400, 1);
      expect(getDrawer()).toHaveStyle({ width: '600px' });

      moveTo(200, 0);
      moveTo(100, 1);

      expect(getDrawer()).toHaveStyle({ width: '600px' });
      expect(onSizeDragEnd).toHaveBeenCalledTimes(1);
    });
  });
});

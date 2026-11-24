import React, { createRef, act } from 'react';
import { describe, expect, render, it, vi, fireEvent, screen, afterEach, beforeEach, waitFor } from '@test/utils';
import { AppIcon } from 'tdesign-icons-react';

import Drawer from '../Drawer';
import { DrawerPlugin } from '../plugin';
import type { DrawerInstance } from '../type';

describe('Drawer', () => {
  describe('props', () => {
    it('closeOnOverlayClick', () => {
      const onClose = vi.fn();
      render(<Drawer visible closeOnOverlayClick={false} onClose={onClose} />);

      const overlay = document.querySelector('.t-overlay');
      expect(overlay).toBeInTheDocument();
      fireEvent.click(overlay);
      expect(onClose).toHaveBeenCalledTimes(0);
    });

    it('title', () => {
      const titleText = 'title';
      const title = <div>{titleText}</div>;
      render(<Drawer visible title={title} />);
      expect(screen.getByText(titleText)).toBeInTheDocument();
    });

    it('footer', () => {
      const footerText = 'footer';
      const footer = <div>{footerText}</div>;
      render(<Drawer visible footer={footer} />);
      expect(screen.getByText(footerText)).toBeInTheDocument();
    });

    it('items', () => {
      const items = [{ title: 'drawer', icon: <AppIcon /> }];
      render(<Drawer visible items={items} />);

      expect(document.querySelector('.t-drawer__sidebar-item-icon')).toBeTruthy();
      expect(document.querySelector('.t-drawer__sidebar-item-title').textContent).toBe('drawer');
    });

    it('isPlugin', () => {
      const { rerender } = render(<Drawer visible isPlugin title="title" />);
      rerender(<Drawer visible isPlugin title="newTitle" />);

      expect(screen.getByText('title')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('onOverlayClick', () => {
      const onOverlayClick = vi.fn();
      render(<Drawer visible onOverlayClick={onOverlayClick} />);

      const overlay = document.querySelector('.t-overlay');
      expect(overlay).toBeInTheDocument();
      fireEvent.click(overlay);
      expect(onOverlayClick).toHaveBeenCalledTimes(1);
    });

    it('onItemClick', () => {
      const onItemClick = vi.fn();
      const items = [{ title: 'drawer' }];
      render(<Drawer visible items={items} onItemClick={onItemClick} />);

      const drawerItem = document.querySelector('.t-drawer__sidebar-item');
      expect(drawerItem).toBeInTheDocument();
      fireEvent.click(drawerItem);
      expect(onItemClick).toHaveBeenCalledTimes(1);
    });

    it('hide', async () => {
      const drawerRef = createRef<DrawerInstance>();
      render(<Drawer ref={drawerRef} isPlugin visible />);

      await act(async () => {
        drawerRef.current.hide();
        await Promise.resolve();
      });

      await waitFor(() => {
        expect(document.querySelector('.t-drawer')).not.toBeVisible();
      });
    });
  });
});

describe('DrawerPlugin', () => {
  let rafCallbacks: Array<() => void> = [];
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', (callback: () => void) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length - 1;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    rafCallbacks = [];
    document.body.querySelectorAll('.t-drawer').forEach((el) => el.remove());
  });

  const awaitAsyncOperation = async () => {
    await act(async () => {
      rafCallbacks.forEach((cb) => cb());
      rafCallbacks = [];

      await new Promise((resolve) => {
        setTimeout(resolve, 0);
      });
    });
  };

  describe('options', () => {
    it('options-boolean', () => {
      DrawerPlugin(false);
      expect(document.querySelector('.t-drawer')).not.toBeInTheDocument();
    });

    it('attach-undefined', async () => {
      act(() => {
        const optionsEmpty = {};
        const drawerPluginWithEmpty = DrawerPlugin(optionsEmpty);
        drawerPluginWithEmpty.show();
      });

      await awaitAsyncOperation();

      await waitFor(() => {
        expect(document.body.querySelector('.t-drawer')).toBeInTheDocument();
        expect(document.body.querySelector('.t-drawer')).toBeVisible();
      });
    });

    it('attach-function', async () => {
      act(() => {
        const options = { attach: () => document.body };
        const drawerPlugin = DrawerPlugin(options);
        drawerPlugin.show();
      });

      await awaitAsyncOperation();

      await waitFor(() => {
        expect(document.body.querySelector('.t-drawer')).toBeVisible();
      });
    });

    it('show', async () => {
      act(() => {
        const options = { attach: 'body' };
        const drawerPlugin = DrawerPlugin(options);
        drawerPlugin.show();
      });

      await awaitAsyncOperation();

      await waitFor(() => {
        expect(document.querySelector('.t-drawer')).toBeVisible();
      });
    });

    it('hide', async () => {
      act(() => {
        const options = { attach: 'body', visible: true };
        const drawerPlugin = DrawerPlugin(options);
        drawerPlugin.hide();
      });

      await awaitAsyncOperation();

      await waitFor(() => {
        expect(document.querySelector('.t-drawer')).not.toBeInTheDocument();
      });
    });

    it('update', async () => {
      act(() => {
        const options = { attach: 'body', visible: true };
        const drawerPlugin = DrawerPlugin(options);
        drawerPlugin.update({ visible: false });
      });

      await awaitAsyncOperation();

      await waitFor(() => {
        expect(document.querySelector('.t-drawer')).not.toBeVisible();
      });
    });

    it('destroy', async () => {
      await act(async () => {
        const options = { attach: 'body', visible: true };
        const drawerPlugin = DrawerPlugin(options);
        drawerPlugin.destroy();
      });

      await awaitAsyncOperation();

      await waitFor(() => {
        expect(document.querySelector('.t-drawer')).not.toBeInTheDocument();
      });
    });
  });
});

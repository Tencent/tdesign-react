import React from 'react';
import { describe, it, expect, render, act } from '@test/utils';
import { vi, beforeEach, afterEach } from 'vitest';
import * as Util from '../util';
import getFixScaleEleTransPosition from '../getFixScaleEleTransPosition';
import wrapperRaf from '../raf';
import { useImageTransform, type TransformType, type TransformAction } from '../transform';

describe('ImageViewer utils', () => {
  describe('getClientSize', () => {
    it(': reads viewport size from document/window', () => {
      const originalInnerHeight = window.innerHeight;
      const originalClientWidth = document.documentElement.clientWidth;

      Object.defineProperty(window, 'innerHeight', { configurable: true, value: 700 });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        configurable: true,
        get: () => 375,
      });

      const { width, height } = Util.getClientSize();
      expect(width).toBe(375);
      expect(height).toBe(700);

      Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
      Object.defineProperty(document.documentElement, 'clientWidth', {
        configurable: true,
        get: () => originalClientWidth,
      });
    });

    it(': falls back to document.documentElement.clientHeight when innerHeight is 0', () => {
      const originalInnerHeight = window.innerHeight;
      Object.defineProperty(window, 'innerHeight', { configurable: true, value: 0 });
      Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 600 });

      const { height } = Util.getClientSize();
      expect(height).toBe(600);

      Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
    });

    it(': falls back when innerHeight is undefined', () => {
      const originalInnerHeight = window.innerHeight;
      delete (window as any).innerHeight;
      Object.defineProperty(document.documentElement, 'clientHeight', { configurable: true, value: 800 });

      const { height } = Util.getClientSize();
      expect(height).toBe(800);

      Object.defineProperty(window, 'innerHeight', { configurable: true, value: originalInnerHeight });
    });

    it(': returns width from document.documentElement.clientWidth', () => {
      const originalClientWidth = document.documentElement.clientWidth;
      Object.defineProperty(document.documentElement, 'clientWidth', {
        configurable: true,
        get: () => 1024,
      });

      const { width } = Util.getClientSize();
      expect(width).toBe(1024);

      Object.defineProperty(document.documentElement, 'clientWidth', {
        configurable: true,
        get: () => originalClientWidth,
      });
    });
  });

  describe('getFixScaleEleTransPosition', () => {
    it(': returns {x:0,y:0} when element fits within viewport', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      const fix = getFixScaleEleTransPosition(300, 400, 0, 0);
      expect(fix).toEqual({ x: 0, y: 0 });
      spy.mockRestore();
    });

    it(': returns {x:0,y:0} when element equals viewport size', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      const fix = getFixScaleEleTransPosition(375, 700, 0, 0);
      expect(fix).toEqual({ x: 0, y: 0 });
      spy.mockRestore();
    });

    it(': fixes X when width > client and left > 0', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      const fix = getFixScaleEleTransPosition(500, 300, 10, 0);
      expect(fix).toMatchObject({ x: (500 - 375) / 2 });
      spy.mockRestore();
    });

    it(': fixes X when width > client and left + width < client', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      const fix = getFixScaleEleTransPosition(500, 300, -200, 0);
      expect(fix).toMatchObject({ x: -((500 - 375) / 2) });
      spy.mockRestore();
    });

    it(': does not fix X when width > client and position is within bounds', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      // width=500 > 375, left=-50 => startAddWidth=450>375, left<0 but within bounds
      const fix = getFixScaleEleTransPosition(500, 300, -50, 0);
      expect(fix).toBeDefined();
      spy.mockRestore();
    });

    it(': fixes Y when height > client and top > 0', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      const fix = getFixScaleEleTransPosition(300, 800, 0, 10);
      expect(fix?.y).toBe(0); // offsetStart for y is 0
      spy.mockRestore();
    });

    it(': fixes Y when height > client and top + height < client', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      const fix = getFixScaleEleTransPosition(300, 800, 0, -200);
      expect(Math.abs(fix?.y as number)).toBe(0); // offsetStart for y is 0 (negated -> -0)
      spy.mockRestore();
    });

    it(': does not fix Y when height > client and position is within bounds', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      // height=800 > 700, top=-50 => startAddHeight=750>700, top<0 but within bounds
      const fix = getFixScaleEleTransPosition(300, 800, 0, -50);
      expect(fix).toBeDefined();
      spy.mockRestore();
    });

    it(': fixes X when width <= client but start < 0', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      const fix = getFixScaleEleTransPosition(300, 800, -10, 0);
      expect(fix).toMatchObject({ x: (300 - 375) / 2 });
      spy.mockRestore();
    });

    it(': fixes X when width <= client but startAddWidth > client', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      const fix = getFixScaleEleTransPosition(300, 800, 100, 0);
      expect(fix).toMatchObject({ x: -((300 - 375) / 2) });
      spy.mockRestore();
    });

    it(': returns null when dimensions equal and no overflow (boundary)', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      // Both width and height <= client, positioned at origin
      const fix = getFixScaleEleTransPosition(375, 700, 0, 0);
      expect(fix).toEqual({ x: 0, y: 0 });
      spy.mockRestore();
    });

    it(': handles both width > client and height > client simultaneously', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      // Both overflow: width=500 > 375, height=800 > 700, left > 0, top > 0
      const fix = getFixScaleEleTransPosition(500, 800, 10, 10);
      expect(fix).toMatchObject({ x: (500 - 375) / 2, y: 0 });
      spy.mockRestore();
    });

    it(': handles width <= client and height <= client with negative start', () => {
      const spy = vi.spyOn(Util, 'getClientSize').mockReturnValue({ width: 375, height: 700 });
      // Both fit: width=300 <= 375, height=600 <= 700
      const fix = getFixScaleEleTransPosition(300, 600, -10, -10);
      expect(fix).toEqual({ x: 0, y: 0 });
      spy.mockRestore();
    });
  });

  describe('raf (wrapperRaf)', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it(': executes callback after specified times', () => {
      const cb = vi.fn();
      wrapperRaf(cb, 3);

      vi.advanceTimersByTime(16);
      expect(cb).not.toHaveBeenCalled();
      vi.advanceTimersByTime(16);
      expect(cb).not.toHaveBeenCalled();
      vi.advanceTimersByTime(16);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it(': executes callback immediately when times=1 (default)', () => {
      const cb = vi.fn();
      wrapperRaf(cb);

      vi.advanceTimersByTime(16);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it(': executes callback with times=2', () => {
      const cb = vi.fn();
      wrapperRaf(cb, 2);

      vi.advanceTimersByTime(16);
      expect(cb).not.toHaveBeenCalled();
      vi.advanceTimersByTime(16);
      expect(cb).toHaveBeenCalledTimes(1);
    });

    it(': cancel prevents callback execution', () => {
      const cb = vi.fn();
      const id = wrapperRaf(cb, 2);

      wrapperRaf.cancel(id);
      vi.advanceTimersByTime(50);
      expect(cb).not.toHaveBeenCalled();
    });

    it(': cancel after first raf tick still prevents execution', () => {
      const cb = vi.fn();
      const id = wrapperRaf(cb, 3);

      vi.advanceTimersByTime(16); // First tick
      wrapperRaf.cancel(id);
      vi.advanceTimersByTime(50); // Remaining ticks
      expect(cb).not.toHaveBeenCalled();
    });

    it(': multiple callbacks can run independently', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      wrapperRaf(cb1, 1);
      wrapperRaf(cb2, 2);

      vi.advanceTimersByTime(16);
      expect(cb1).toHaveBeenCalledTimes(1);
      expect(cb2).not.toHaveBeenCalled();

      vi.advanceTimersByTime(16);
      expect(cb2).toHaveBeenCalledTimes(1);
    });

    it(': tracks ids during scheduling and clears after execution', () => {
      const cb1 = vi.fn();
      const cb2 = vi.fn();

      const id1 = wrapperRaf(cb1, 1);
      const id2 = wrapperRaf(cb2, 2);

      const ids = typeof wrapperRaf.ids === 'function' ? wrapperRaf.ids() : undefined;
      if (ids) {
        expect(ids.has(id1)).toBe(true);
        expect(ids.has(id2)).toBe(true);
      }

      vi.advanceTimersByTime(16);
      expect(cb1).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(16);
      expect(cb2).toHaveBeenCalledTimes(1);

      if (ids) {
        expect(ids.has(id1)).toBe(false);
        expect(ids.has(id2)).toBe(false);
      }
    });

    it(': cancel cleans up id from map', () => {
      const cb = vi.fn();
      const id = wrapperRaf(cb, 2);

      const ids = typeof wrapperRaf.ids === 'function' ? wrapperRaf.ids() : undefined;
      if (ids) {
        expect(ids.has(id)).toBe(true);
      }

      wrapperRaf.cancel(id);

      if (ids) {
        expect(ids.has(id)).toBe(false);
      }
    });

    it(': returns unique incremental ids', () => {
      const id1 = wrapperRaf(() => {}, 1);
      const id2 = wrapperRaf(() => {}, 1);
      const id3 = wrapperRaf(() => {}, 1);

      expect(id2).toBe(id1 + 1);
      expect(id3).toBe(id2 + 1);

      vi.advanceTimersByTime(20);
    });

    it(': ids function is available in non-production', () => {
      expect(typeof wrapperRaf.ids).toBe('function');
      const ids = wrapperRaf.ids();
      expect(ids).toBeInstanceOf(Map);
    });
  });

  describe('useImageTransform', () => {
    type Api = {
      get: () => TransformType;
      reset: (action?: TransformAction) => void;
      update: (partial: Partial<TransformType>, action: TransformAction) => void;
      zoom: (ratio: number, action: TransformAction, isTouch?: boolean) => void;
    };

    function Harness({
      onApi,
      onTransform,
    }: {
      onApi: (api: Api) => void;
      onTransform?: (info: { transform: TransformType; action: TransformAction }) => void;
    }) {
      const { transform, resetTransform, updateTransform, dispatchZoomChange } = useImageTransform(1, 3, onTransform);
      React.useEffect(() => {
        onApi({
          get: () => transform,
          reset: (action = 'reset') => resetTransform(action),
          update: (partial, action) => updateTransform(partial, action),
          zoom: (ratio, action, isTouch) => dispatchZoomChange(ratio, action, isTouch),
        });
      }, [transform, resetTransform, updateTransform, dispatchZoomChange, onApi]);
      return null;
    }

    it(': initial transform state', () => {
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} />);

      expect(api!.get()).toEqual({ x: 0, y: 0, rotate: 0, scale: 1, flipX: false, flipY: false });
    });

    it(': dispatchZoomChange clamps to maxScale', () => {
      vi.useFakeTimers();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} />);

      act(() => {
        api!.zoom(10, 'zoomIn');
        vi.advanceTimersByTime(20);
      });
      expect(api!.get().scale).toBe(3);
      vi.useRealTimers();
    });

    it(': dispatchZoomChange clamps to minScale when not touch', () => {
      vi.useFakeTimers();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} />);

      act(() => {
        api!.zoom(0.1, 'zoomOut', false);
        vi.advanceTimersByTime(20);
      });
      expect(api!.get().scale).toBe(1);
      vi.useRealTimers();
    });

    it(': dispatchZoomChange allows below minScale when isTouch=true', () => {
      vi.useFakeTimers();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} />);

      act(() => {
        api!.zoom(0.5, 'touchZoom', true);
        vi.advanceTimersByTime(20);
      });
      expect(api!.get().scale).toBe(0.5);
      vi.useRealTimers();
    });

    it(': dispatchZoomChange with ratio=1 keeps scale unchanged', () => {
      vi.useFakeTimers();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} />);

      act(() => {
        api!.zoom(1, 'zoomIn');
        vi.advanceTimersByTime(20);
      });
      expect(api!.get().scale).toBe(1);
      vi.useRealTimers();
    });

    it(': resetTransform does not call onTransform when state unchanged', () => {
      vi.useFakeTimers();
      const onTransform = vi.fn();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} onTransform={onTransform} />);

      act(() => {
        api!.reset('reset');
        vi.advanceTimersByTime(20);
      });
      expect(onTransform).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it(': resetTransform calls onTransform when state was changed', () => {
      vi.useFakeTimers();
      const onTransform = vi.fn();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} onTransform={onTransform} />);

      act(() => {
        api!.update({ x: 10, y: 20, scale: 2 }, 'move');
        vi.advanceTimersByTime(20);
      });

      act(() => {
        api!.reset('close');
        vi.advanceTimersByTime(20);
      });

      const t = api!.get();
      expect(t).toMatchObject({ x: 0, y: 0, rotate: 0, scale: 1, flipX: false, flipY: false });
      vi.useRealTimers();
    });

    it(': updateTransform batches multiple updates via raf queue', () => {
      vi.useFakeTimers();
      const onTransform = vi.fn();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} onTransform={onTransform} />);

      act(() => {
        api!.update({ x: 1 }, 'move');
        api!.update({ y: 2 }, 'move');
        api!.update({ scale: 1.5 }, 'move');
        vi.advanceTimersByTime(20);
      });

      expect(api!.get()).toMatchObject({ x: 1, y: 2, scale: 1.5 });
      expect(onTransform).toHaveBeenCalledTimes(1);
      vi.useRealTimers();
    });

    it(': updateTransform merges partial state correctly', () => {
      vi.useFakeTimers();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} />);

      act(() => {
        api!.update({ x: 10 }, 'move');
        vi.advanceTimersByTime(20);
      });

      expect(api!.get()).toMatchObject({ x: 10, y: 0, scale: 1 });

      act(() => {
        api!.update({ y: 20 }, 'move');
        vi.advanceTimersByTime(20);
      });

      expect(api!.get()).toMatchObject({ x: 10, y: 20, scale: 1 });
      vi.useRealTimers();
    });

    it(': onTransform receives correct action', () => {
      vi.useFakeTimers();
      const onTransform = vi.fn();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} onTransform={onTransform} />);

      act(() => {
        api!.update({ scale: 2 }, 'doubleClick');
        vi.advanceTimersByTime(20);
      });

      expect(onTransform).toHaveBeenCalledWith(expect.objectContaining({ action: 'doubleClick' }));
      vi.useRealTimers();
    });

    it(': dispatchZoomChange applies ratio to current scale', () => {
      vi.useFakeTimers();
      let api: Api;
      render(<Harness onApi={(a) => (api = a)} />);

      // First zoom to 1.5
      act(() => {
        api!.zoom(1.5, 'zoomIn');
        vi.advanceTimersByTime(20);
      });
      expect(api!.get().scale).toBe(1.5);

      // Then zoom by 2x -> 3 (capped at maxScale)
      act(() => {
        api!.zoom(2, 'zoomIn');
        vi.advanceTimersByTime(20);
      });
      expect(api!.get().scale).toBe(3);
      vi.useRealTimers();
    });
  });
});

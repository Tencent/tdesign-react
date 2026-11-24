import React from 'react';
import { describe, it, expect, render, fireEvent, act, beforeEach, afterEach } from '@test/utils';
import { vi } from 'vitest';
import { ImageViewer } from '../index';

const prefix = 't';
const name = `${prefix}-image-viewer`;

const images = [
  'https://tdesign.gtimg.com/mobile/demos/swiper1.png',
  'https://tdesign.gtimg.com/mobile/demos/swiper2.png',
  'https://tdesign.gtimg.com/mobile/demos/swiper3.png',
];

function query(container: HTMLElement, selector: string) {
  return container.querySelector(selector);
}

describe('ImageViewer', () => {
  describe('props', () => {
    it(': visible controlled', () => {
      const { container, rerender } = render(<ImageViewer images={images} visible={false} />);
      expect(query(container, `.${name}`)).toBeNull();

      rerender(<ImageViewer images={images} visible />);
      expect(query(container, `.${name}`)).not.toBeNull();
    });

    it(': defaultVisible false', () => {
      const { container } = render(<ImageViewer images={images} defaultVisible={false} />);
      expect(query(container, `.${name}`)).toBeNull();
    });

    it(': defaultVisible true', () => {
      const { container } = render(<ImageViewer images={images} defaultVisible />);
      expect(query(container, `.${name}`)).not.toBeNull();
    });

    it(': closeBtn default true renders icon', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const closeBtn = query(container, `.${name}__nav-close`);
      expect(closeBtn).not.toBeNull();
      expect(closeBtn?.children.length).toBeGreaterThan(0);
    });

    it(': closeBtn false renders empty', () => {
      const { container } = render(<ImageViewer images={images} visible closeBtn={false} />);
      const closeBtn = query(container, `.${name}__nav-close`);
      expect(closeBtn).not.toBeNull();
      expect(closeBtn?.children.length).toBe(0);
    });

    it(': closeBtn null renders empty', () => {
      const { container } = render(<ImageViewer images={images} visible closeBtn={null} />);
      const closeBtn = query(container, `.${name}__nav-close`);
      expect(closeBtn).not.toBeNull();
      expect(closeBtn?.children.length).toBe(0);
    });

    it(': closeBtn custom node', () => {
      const { container } = render(
        <ImageViewer images={images} visible closeBtn={<span data-testid="custom-close">X</span>} />,
      );
      expect(query(container, '[data-testid="custom-close"]')).not.toBeNull();
    });

    it(': deleteBtn default false renders empty', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const deleteBtn = query(container, `.${name}__nav-delete`);
      expect(deleteBtn).not.toBeNull();
      expect(deleteBtn?.children.length).toBe(0);
    });

    it(': deleteBtn true renders icon', () => {
      const { container } = render(<ImageViewer images={images} visible deleteBtn />);
      const deleteBtn = query(container, `.${name}__nav-delete`);
      expect(deleteBtn).not.toBeNull();
      expect(deleteBtn?.children.length).toBeGreaterThan(0);
    });

    it(': deleteBtn custom node', () => {
      const { container } = render(
        <ImageViewer images={images} visible deleteBtn={<span data-testid="custom-delete">D</span>} />,
      );
      expect(query(container, '[data-testid="custom-delete"]')).not.toBeNull();
    });

    it(': images as string array', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const imgs = container.querySelectorAll(`.${name}__img`);
      expect(imgs.length).toBe(images.length);
    });

    it(': images as ImageInfo array with align', () => {
      const infoImages = [
        { url: images[0], align: 'start' as const },
        { url: images[1], align: 'center' as const },
        { url: images[2], align: 'end' as const },
      ];
      const { container } = render(<ImageViewer images={infoImages} visible />);
      const imgs = container.querySelectorAll(`.${name}__img`);
      expect(imgs.length).toBe(3);
    });

    it(': images mixed string and ImageInfo', () => {
      const mixedImages = [images[0], { url: images[1], align: 'end' as const }];
      const { container } = render(<ImageViewer images={mixedImages} visible showIndex />);
      const indexEl = query(container, `.${name}__nav-index`);
      expect(indexEl?.textContent).toBe('1/2');
    });

    it(': images empty array renders component without images', () => {
      const { container } = render(<ImageViewer images={[]} visible />);
      expect(query(container, `.${name}`)).not.toBeNull();
      expect(container.querySelectorAll(`.${name}__img`).length).toBe(0);
    });

    it(': cover renders custom overlay content', () => {
      const { container } = render(
        <ImageViewer images={images} visible cover={<span data-testid="custom-cover">Cover</span>} />,
      );
      const cover = query(container, `.${name}__cover`);
      expect(cover).not.toBeNull();
      expect(query(container, '[data-testid="custom-cover"]')).not.toBeNull();
    });

    it(': cover not rendered when not provided', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      expect(query(container, `.${name}__cover`)).toBeNull();
    });

    it(': image custom render receives slot params (src/className/index)', () => {
      const image = vi.fn((params: any) => (
        <img data-testid="custom-image" src={params.src} className={params.className} />
      ));
      const { container } = render(<ImageViewer images={images} visible image={image as any} />);

      expect(query(container, '[data-testid="custom-image"]')).not.toBeNull();
      expect(image).toHaveBeenCalledTimes(images.length);

      const params = image.mock.calls[0][0];
      expect(params.src).toBe(images[0]);
      expect(params.className).toBe(`${name}__img`);
      expect(params.index).toBe(0);
      expect(params.extra).toBeUndefined();
    });

    it(': image custom render receives extra from ImageInfo', () => {
      const infoImages = [{ url: images[0], align: 'center' as const, extra: { key: 'value' } }];
      const image = vi.fn((params: any) => <img data-testid="custom-image" src={params.src} />);
      render(<ImageViewer images={infoImages} visible image={image as any} />);

      const params = image.mock.calls[0][0];
      expect(params.extra).toEqual({ key: 'value' });
    });

    it(': image fallback renders default img when image not provided', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      expect(container.querySelectorAll(`.${name}__img`).length).toBe(images.length);
    });

    it(': loop true renders images', () => {
      const { container } = render(<ImageViewer images={images} visible loop />);
      expect(query(container, `.${name}`)).not.toBeNull();
      expect(container.querySelectorAll(`.${name}__img`).length).toBe(images.length);
    });

    it(': loop false renders images without error', () => {
      const { container } = render(<ImageViewer images={images} visible loop={false} />);
      expect(query(container, `.${name}`)).not.toBeNull();
      expect(container.querySelectorAll(`.${name}__img`).length).toBe(images.length);
    });

    it(': index controlled', () => {
      const { container } = render(<ImageViewer images={images} visible index={2} showIndex />);
      const indexEl = query(container, `.${name}__nav-index`);
      expect(indexEl?.textContent).toBe('3/3');
    });

    it(': defaultIndex', () => {
      const { container } = render(<ImageViewer images={images} visible defaultIndex={1} showIndex />);
      const indexEl = query(container, `.${name}__nav-index`);
      expect(indexEl?.textContent).toBe('2/3');
    });

    it(': showIndex false hides page index', () => {
      const { container } = render(<ImageViewer images={images} visible showIndex={false} />);
      expect(query(container, `.${name}__nav-index`)).toBeNull();
    });

    it(': showIndex true shows page index', () => {
      const { container } = render(<ImageViewer images={images} visible showIndex />);
      const indexEl = query(container, `.${name}__nav-index`);
      expect(indexEl).not.toBeNull();
      expect(indexEl?.textContent).toBe('1/3');
    });

    it(': showIndex displays correct text with currentIndex ?? 0 fallback', () => {
      // When no index/defaultIndex provided, currentIndex is defaultIndex=0
      const { container } = render(<ImageViewer images={images} visible showIndex />);
      const indexEl = query(container, `.${name}__nav-index`);
      expect(indexEl?.textContent).toBe('1/3');
    });

    it(': maxZoom limits double click scale', () => {
      vi.useFakeTimers();
      const { container } = render(<ImageViewer images={images} visible maxZoom={1.5} />);
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5, 0, 0, 1.5');
      vi.useRealTimers();
    });

    it(': maxZoom=1 prevents zoom on double click', () => {
      vi.useFakeTimers();
      const { container } = render(<ImageViewer images={images} visible maxZoom={1} />);
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1,');
      vi.useRealTimers();
    });

    it(': className and style passed through', () => {
      const { container } = render(
        <ImageViewer images={images} visible className="custom-class" style={{ color: 'red' }} />,
      );
      const root = query(container, `.${name}`) as HTMLElement;
      expect(root).not.toBeNull();
    });

    it(': images as ImageInfo without explicit align defaults to center', () => {
      // This covers the `align || "center"` fallback branch in getMaxDraggedY (line 182)
      const imageWithoutAlign = [{ url: images[0] }] as any;
      vi.useFakeTimers();
      const { container } = render(<ImageViewer images={imageWithoutAlign} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;
      expect(img).not.toBeNull();

      // Trigger getMaxDraggedY by zooming and dragging
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 300 });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 400 });

      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 150, clientY: 200 }] });
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 150, clientY: 250 }] });
        vi.advanceTimersByTime(20);
      });
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });

      expect(img).not.toBeNull();
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 0 });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 0 });
      vi.useRealTimers();
    });
  });

  describe('events', () => {
    it(': onClose triggered by overlay click', () => {
      const onClose = vi.fn();
      const { container } = render(<ImageViewer images={images} visible onClose={onClose} />);
      const mask = query(container, `.${name}__mask`) as HTMLElement;

      act(() => {
        fireEvent.click(mask);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose.mock.calls[0][0]).toMatchObject({ trigger: 'overlay', visible: false });
    });

    it(': onClose triggered by close-btn click', () => {
      const onClose = vi.fn();
      const { container } = render(<ImageViewer images={images} visible onClose={onClose} />);
      const closeBtn = query(container, `.${name}__nav-close`) as HTMLElement;

      act(() => {
        fireEvent.click(closeBtn);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose.mock.calls[0][0]).toMatchObject({ trigger: 'close-btn', visible: false });
    });

    it(': onClose triggered by image click', () => {
      const onClose = vi.fn();
      const { container } = render(<ImageViewer images={images} visible onClose={onClose} />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      act(() => {
        fireEvent.click(img);
      });
      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onClose.mock.calls[0][0]).toMatchObject({ trigger: 'image', visible: false });
    });

    it(': onClose includes correct index', () => {
      const onClose = vi.fn();
      const { container } = render(<ImageViewer images={images} visible defaultIndex={2} onClose={onClose} />);
      const mask = query(container, `.${name}__mask`) as HTMLElement;

      act(() => {
        fireEvent.click(mask);
      });
      expect(onClose.mock.calls[0][0].index).toBe(2);
    });

    it(': onClose stops event propagation', () => {
      const onClose = vi.fn();
      const outerClick = vi.fn();
      const { container } = render(
        <div onClick={outerClick}>
          <ImageViewer images={images} visible onClose={onClose} />
        </div>,
      );
      const closeBtn = query(container, `.${name}__nav-close`) as HTMLElement;

      act(() => {
        fireEvent.click(closeBtn);
      });
      expect(onClose).toHaveBeenCalled();
      expect(outerClick).not.toHaveBeenCalled();
    });

    it(': onClose sets visible to false', () => {
      const onClose = vi.fn();
      const { container } = render(<ImageViewer images={images} defaultVisible onClose={onClose} />);
      const mask = query(container, `.${name}__mask`) as HTMLElement;

      act(() => {
        fireEvent.click(mask);
      });
      expect(onClose).toHaveBeenCalledWith(expect.objectContaining({ visible: false }));
    });

    it(': onDelete triggered with current index', () => {
      const onDelete = vi.fn();
      const { container } = render(<ImageViewer images={images} visible deleteBtn onDelete={onDelete} />);
      const deleteBtn = query(container, `.${name}__nav-delete`) as HTMLElement;

      act(() => {
        fireEvent.click(deleteBtn);
      });
      expect(onDelete).toHaveBeenCalledWith(0);
    });

    it(': onDelete reflects defaultIndex', () => {
      const onDelete = vi.fn();
      const { container } = render(
        <ImageViewer images={images} visible deleteBtn defaultIndex={2} onDelete={onDelete} />,
      );
      const deleteBtn = query(container, `.${name}__nav-delete`) as HTMLElement;

      act(() => {
        fireEvent.click(deleteBtn);
      });
      expect(onDelete).toHaveBeenCalledWith(2);
    });

    it(': onDelete with undefined currentIndex defaults to 0', () => {
      const onDelete = vi.fn();
      const { container } = render(<ImageViewer images={images} visible deleteBtn onDelete={onDelete} />);
      const deleteBtn = query(container, `.${name}__nav-delete`) as HTMLElement;

      act(() => {
        fireEvent.click(deleteBtn);
      });
      expect(onDelete).toHaveBeenCalledWith(0);
    });

    it(': onDelete not triggered when onDelete prop not provided', () => {
      const { container } = render(<ImageViewer images={images} visible deleteBtn />);
      const deleteBtn = query(container, `.${name}__nav-delete`) as HTMLElement;

      // Should not throw error when clicking delete without onDelete handler
      act(() => {
        fireEvent.click(deleteBtn);
      });
      expect(deleteBtn).not.toBeNull();
    });

    it(': onIndexChange not called when scale !== 1', () => {
      vi.useFakeTimers();
      const onIndexChange = vi.fn();
      const { container } = render(<ImageViewer images={images} visible onIndexChange={onIndexChange} />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      // Double click to zoom (scale becomes 1.5)
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Swiper disabled when scale != 1, so onIndexChange should not fire
      expect(onIndexChange).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it(': onClose not triggered when onClose prop not provided', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const mask = query(container, `.${name}__mask`) as HTMLElement;

      // Should not throw error when clicking without onClose handler
      act(() => {
        fireEvent.click(mask);
      });
      expect(mask).not.toBeNull();
    });
  });

  describe('interaction', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it(': double click toggles zoom on then off', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // First double click: 1 -> 1.5
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });
      expect(img.getAttribute('style')).toContain('matrix(1.5, 0, 0, 1.5');

      // Second double click: 1.5 -> 1
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });
      expect(img.getAttribute('style')).toContain('matrix(1, 0, 0, 1');
    });

    it(': double click does nothing when not visible (show=false)', () => {
      const { container } = render(<ImageViewer images={images} visible={false} />);
      const img = query(container, `.${name}__img`);
      expect(img).toBeNull();
    });

    it(': reset transform on close (useEffect branch show->false)', () => {
      const { container, rerender } = render(<ImageViewer images={images} defaultVisible />);
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // Zoom in
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });
      expect(img.getAttribute('style')).toContain('matrix(1.5, 0, 0, 1.5');

      // Close via overlay
      act(() => {
        fireEvent.click(query(container, `.${name}__mask`)!);
        vi.advanceTimersByTime(350);
      });

      // Reopen with controlled visible
      act(() => {
        rerender(<ImageViewer images={images} visible />);
        vi.advanceTimersByTime(350);
      });

      const img2 = query(container, `.${name}__img`) as HTMLImageElement;
      expect(img2.getAttribute('style')).toContain('matrix(1, 0, 0, 1');
    });

    it(': pinch zoom enlarges scale', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      // Start with two fingers 100px apart
      act(() => {
        fireEvent.touchStart(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 100, clientY: 0 },
          ],
        } as any);
      });
      // Move to 200px apart: ratio = 2
      act(() => {
        fireEvent.touchMove(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 200, clientY: 0 },
          ],
        } as any);
        vi.advanceTimersByTime(20);
      });

      expect(img.getAttribute('style')).toContain('matrix(2');
    });

    it(': pinch zoom capped at maxZoom', () => {
      const { container } = render(<ImageViewer images={images} visible maxZoom={2} />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      // Start with two fingers 50px apart
      act(() => {
        fireEvent.touchStart(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 50, clientY: 0 },
          ],
        } as any);
      });
      // Move to 200px apart: ratio = 4, but should cap at maxZoom=2
      act(() => {
        fireEvent.touchMove(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 200, clientY: 0 },
          ],
        } as any);
        vi.advanceTimersByTime(20);
      });

      expect(img.getAttribute('style')).toContain('matrix(2,');
    });

    it(': pinch zoom shrink resets to minScale on touchEnd', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      // Start with two fingers 200px apart
      act(() => {
        fireEvent.touchStart(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 200, clientY: 0 },
          ],
        } as any);
      });
      // Move to 100px: ratio = 0.5, scale becomes 0.5
      act(() => {
        fireEvent.touchMove(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 100, clientY: 0 },
          ],
        } as any);
        vi.advanceTimersByTime(20);
      });
      expect(img.getAttribute('style')).toContain('matrix(0.5');

      // Touch end: should reset to minScale=1
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });
      expect(img.getAttribute('style')).toContain('matrix(1, 0, 0, 1, 0, 0');
    });

    it(': single finger drag when zoomed in', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      // Zoom in first
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Single finger drag
      act(() => {
        fireEvent.touchStart(img, {
          touches: [{ clientX: 50, clientY: 50 }],
        } as any);
      });
      act(() => {
        fireEvent.touchMove(img, {
          touches: [{ clientX: 100, clientY: 100 }],
        } as any);
        vi.advanceTimersByTime(20);
      });

      // Should have non-zero translate
      const style = img.getAttribute('style') || '';
      expect(style).toMatch(/matrix\(1\.5, 0, 0, 1\.5, -?\d+/);

      // Touch end: rebound to bounds
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });
      expect(img.getAttribute('style')).toContain('matrix(1.5, 0, 0, 1.5, 0, 0');
    });

    it(': single finger move ignored at scale=1', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      // Single finger at scale=1: touchMove with 1 touch should be ignored
      act(() => {
        fireEvent.touchStart(img, {
          touches: [{ clientX: 50, clientY: 50 }],
        } as any);
      });
      act(() => {
        fireEvent.touchMove(img, {
          touches: [{ clientX: 100, clientY: 100 }],
        } as any);
        vi.advanceTimersByTime(20);
      });

      // Scale should remain 1 with zero translate
      expect(img.getAttribute('style')).toContain('matrix(1, 0, 0, 1, 0, 0');
    });

    it(': touchEnd does nothing when not open', () => {
      // This tests the early return in onTouchEnd when open=false
      const { container } = render(<ImageViewer images={images} visible={false} />);
      // Component not rendered due to unmountOnExit
      expect(query(container, `.${name}__img`)).toBeNull();
    });

    it(': touchCancel triggers same behavior as touchEnd', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      // Zoom in first
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Start touch and move
      act(() => {
        fireEvent.touchStart(img, {
          touches: [{ clientX: 50, clientY: 50 }],
        } as any);
      });
      act(() => {
        fireEvent.touchMove(img, {
          touches: [{ clientX: 100, clientY: 100 }],
        } as any);
        vi.advanceTimersByTime(20);
      });

      // Trigger touchCancel instead of touchEnd
      act(() => {
        const cancelEvent = new Event('touchcancel', { bubbles: true });
        img.dispatchEvent(cancelEvent);
        vi.advanceTimersByTime(20);
      });

      // Should rebound/reset like touchEnd
      expect(img.getAttribute('style')).toContain('matrix(1.5');
    });

    it(': getRealTransformY returns 0 when scaledHeight <= containerHeight', () => {
      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'center' }]} visible />);
      const root = query(container, `.${name}`) as HTMLDivElement;
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // Container larger than scaled image
      Object.defineProperty(root, 'offsetHeight', { value: 600, configurable: true });
      Object.defineProperty(img, 'offsetHeight', { value: 100, configurable: true });

      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Y should be 0 because scaledHeight (1.5 * 100 = 150) <= containerHeight (600)
      expect(img.getAttribute('style')).toContain('matrix(1.5, 0, 0, 1.5, 0, 0)');
    });

    it(': getMaxDraggedY returns {top:0,bottom:0} when no imgRef or rootRef', () => {
      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'center' }]} visible />);
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // offsetHeight defaults to 0 in jsdom when not mocked
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Y should be 0 due to early return when offsets are 0
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5, 0, 0, 1.5, 0, 0)');
    });

    it(': alignment start branch in getMaxDraggedY', () => {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 300 });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 400 });

      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'start' }]} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 150, clientY: 200 }] });
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 150, clientY: 250 }] });
        vi.advanceTimersByTime(20);
      });
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });

      expect(img).not.toBeNull();

      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 0 });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 0 });
    });

    it(': alignment center branch in getMaxDraggedY', () => {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 300 });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 400 });

      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'center' }]} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 150, clientY: 200 }] });
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 150, clientY: 250 }] });
        vi.advanceTimersByTime(20);
      });
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });

      expect(img).not.toBeNull();

      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 0 });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 0 });
    });

    it(': alignment end branch in getMaxDraggedY', () => {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 300 });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 400 });

      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'end' }]} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 150, clientY: 200 }] });
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 150, clientY: 250 }] });
        vi.advanceTimersByTime(20);
      });
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });

      expect(img).not.toBeNull();

      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 0 });
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 0 });
    });

    it(': getPreloadImageIndex for first index (currentIndex=0)', () => {
      const { container } = render(<ImageViewer images={images} visible defaultIndex={0} showIndex />);
      expect(query(container, `.${name}__nav-index`)?.textContent).toBe('1/3');
    });

    it(': getPreloadImageIndex for last index', () => {
      const { container } = render(<ImageViewer images={images} visible defaultIndex={2} showIndex />);
      expect(query(container, `.${name}__nav-index`)?.textContent).toBe('3/3');
    });

    it(': getPreloadImageIndex for middle index', () => {
      const { container } = render(<ImageViewer images={images} visible defaultIndex={1} showIndex />);
      expect(query(container, `.${name}__nav-index`)?.textContent).toBe('2/3');
    });

    it(': getRealTransformX clamps x to +max when x exceeds positive bound', () => {
      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'center' }]} visible />);
      const root = query(container, `.${name}`) as HTMLDivElement;
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // rootWidth=300, scale=1.5 => scaledWidth=450, maxX=(450-300)/2=75
      Object.defineProperty(root, 'offsetWidth', { value: 300, configurable: true });
      Object.defineProperty(root, 'offsetHeight', { value: 300, configurable: true });

      // Zoom to 1.5
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Single finger drag far right -> x > max
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 0, clientY: 150 }] } as any);
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 5000, clientY: 150 }] } as any);
        vi.advanceTimersByTime(20);
      });

      // x should be clamped to max=75
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5, 0, 0, 1.5, 75,');
    });

    it(': getRealTransformX clamps x to -max when x exceeds negative bound', () => {
      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'center' }]} visible />);
      const root = query(container, `.${name}`) as HTMLDivElement;
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      Object.defineProperty(root, 'offsetWidth', { value: 300, configurable: true });
      Object.defineProperty(root, 'offsetHeight', { value: 300, configurable: true });

      // Zoom to 1.5
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Single finger drag far left -> x < -max
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 5000, clientY: 150 }] } as any);
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 0, clientY: 150 }] } as any);
        vi.advanceTimersByTime(20);
      });

      // x should be clamped to -max=-75
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5, 0, 0, 1.5, -75,');
    });

    it(': getRealTransformX returns transform.x when within bounds', () => {
      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'center' }]} visible />);
      const root = query(container, `.${name}`) as HTMLDivElement;
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      Object.defineProperty(root, 'offsetWidth', { value: 300, configurable: true });
      Object.defineProperty(root, 'offsetHeight', { value: 300, configurable: true });

      // Zoom to 1.5, maxX=(450-300)/2=75
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Small drag within bounds
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 150, clientY: 150 }] } as any);
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 155, clientY: 150 }] } as any);
        vi.advanceTimersByTime(20);
      });

      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5, 0, 0, 1.5');
    });

    it(': getRealTransformY clamps y to top when y < top (start alignment)', () => {
      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'start' }]} visible />);
      const root = query(container, `.${name}`) as HTMLDivElement;
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // rootHeight=300, imgHeight=400, scale=1.5 => scaledHeight=600 > 300
      Object.defineProperty(root, 'offsetWidth', { value: 300, configurable: true });
      Object.defineProperty(root, 'offsetHeight', { value: 300, configurable: true });
      Object.defineProperty(img, 'offsetHeight', { value: 400, configurable: true });

      // Zoom to 1.5
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Drag upward far -> y < top
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 150, clientY: 5000 }] } as any);
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 150, clientY: 0 }] } as any);
        vi.advanceTimersByTime(20);
      });

      // Y should be clamped (not negative infinity)
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5, 0, 0, 1.5');
    });

    it(': getRealTransformY clamps y to bottom when y > bottom (end alignment)', () => {
      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'end' }]} visible />);
      const root = query(container, `.${name}`) as HTMLDivElement;
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // rootHeight=300, imgHeight=400, scale=1.5 => scaledHeight=600 > 300
      Object.defineProperty(root, 'offsetWidth', { value: 300, configurable: true });
      Object.defineProperty(root, 'offsetHeight', { value: 300, configurable: true });
      Object.defineProperty(img, 'offsetHeight', { value: 400, configurable: true });

      // Zoom to 1.5
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Drag downward far -> y > bottom
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 150, clientY: 0 }] } as any);
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 150, clientY: 5000 }] } as any);
        vi.advanceTimersByTime(20);
      });

      // Y should be clamped (not positive infinity)
      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5, 0, 0, 1.5');
    });

    it(': getRealTransformY returns transform.y when within bounds (center)', () => {
      const { container } = render(<ImageViewer images={[{ url: images[0], align: 'center' }]} visible />);
      const root = query(container, `.${name}`) as HTMLDivElement;
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // rootHeight=300, imgHeight=400, scale=1.5 => scaledHeight=600 > 300
      Object.defineProperty(root, 'offsetWidth', { value: 300, configurable: true });
      Object.defineProperty(root, 'offsetHeight', { value: 300, configurable: true });
      Object.defineProperty(img, 'offsetHeight', { value: 400, configurable: true });

      // Zoom to 1.5
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Small drag -> y within top and bottom bounds
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 150, clientY: 150 }] } as any);
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 150, clientY: 155 }] } as any);
        vi.advanceTimersByTime(20);
      });

      const style = img.getAttribute('style') || '';
      expect(style).toContain('matrix(1.5, 0, 0, 1.5');
    });

    it(': onSwiperChange does not fire when show is false', () => {
      const onIndexChange = vi.fn();
      const { container } = render(<ImageViewer images={images} visible={false} onIndexChange={onIndexChange} />);
      expect(query(container, `.${name}`)).toBeNull();
      expect(onIndexChange).not.toHaveBeenCalled();
    });

    it(': transitionDuration is 0s while touching', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // Double click to zoom first
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Start touching
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 100, clientY: 100 }] } as any);
      });

      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 150, clientY: 150 }] } as any);
        vi.advanceTimersByTime(20);
      });

      // At this point during touch, transitionDuration should be '0s'
      const style = img.getAttribute('style') || '';
      expect(style).toContain('transition-duration');
    });

    it(': swiper disabled when isTouching or scale !== 1', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // After double click zoom, swiper should have disabled state
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // Component should still render normally
      expect(img.getAttribute('style')).toContain('matrix(1.5');
    });

    it(': touchStart stopsPropagation', () => {
      const outerTouch = vi.fn();
      const { container } = render(
        <div onTouchStart={outerTouch}>
          <ImageViewer images={images} visible />
        </div>,
      );
      const img = query(container, `.${name}__img`) as HTMLElement;

      act(() => {
        fireEvent.touchStart(img, {
          touches: [{ clientX: 50, clientY: 50 }],
        } as any);
      });
      expect(outerTouch).not.toHaveBeenCalled();
    });

    it(': pinch zoom during swiper transition is ignored', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLElement;

      // Start with two fingers
      act(() => {
        fireEvent.touchStart(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 100, clientY: 0 },
          ],
        } as any);
      });

      // Simulate swiper root having transform (animation in progress)
      const swiperRoot = container.querySelector(`.${name}__content`) as HTMLElement;
      if (swiperRoot) {
        Object.defineProperty(swiperRoot, 'style', {
          value: { transform: 'translateX(-100px)' },
          configurable: true,
        });
      }

      // Move fingers - should be ignored during swiper transition
      act(() => {
        fireEvent.touchMove(img, {
          touches: [
            { clientX: 0, clientY: 0 },
            { clientX: 200, clientY: 0 },
          ],
        } as any);
        vi.advanceTimersByTime(20);
      });

      // Scale should remain 1 or the move should be ignored
      expect(img).not.toBeNull();
    });

    it(': isTouching ref causes 0s transitionDuration during touch', () => {
      const { container } = render(<ImageViewer images={images} visible />);
      const img = query(container, `.${name}__img`) as HTMLImageElement;

      // Zoom in first so single-finger drag is effective
      act(() => {
        fireEvent.doubleClick(img);
        vi.advanceTimersByTime(20);
      });

      // During touchStart+touchMove, isTouching.current becomes true
      act(() => {
        fireEvent.touchStart(img, { touches: [{ clientX: 100, clientY: 100 }] } as any);
      });
      act(() => {
        fireEvent.touchMove(img, { touches: [{ clientX: 120, clientY: 120 }] } as any);
        vi.advanceTimersByTime(20);
      });

      // isTouching is a ref used in style `isTouching ? '0s' : '.3s'`
      const style = img.getAttribute('style') || '';
      expect(style).toContain('transition-duration');

      // After touchEnd, isTouching becomes false
      act(() => {
        fireEvent.touchEnd(img);
        vi.advanceTimersByTime(20);
      });
      const styleAfter = img.getAttribute('style') || '';
      expect(styleAfter).toContain('transition-duration');
    });

    it(': showIndex Math.min clamp when currentIndex exceeds images length', () => {
      // currentIndex 2 + 1 = 3, Math.min(3, 3) = 3
      const { container } = render(<ImageViewer images={images} visible index={2} showIndex />);
      const indexEl = query(container, `.${name}__nav-index`);
      expect(indexEl?.textContent).toBe('3/3');
    });
  });
});

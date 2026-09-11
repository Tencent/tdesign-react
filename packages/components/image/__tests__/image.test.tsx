import React from 'react';
import { fireEvent, mockDelay, mockIntersectionObserver, render, simulateImageEvent, vi } from '@test/utils';

import Space from '../../space';
import { Image } from '..';

import type { TdImageProps } from '../type';

function getOverlayImageMount(props?: Partial<TdImageProps>) {
  return render(
    <Image
      src="https://tdesign.gtimg.com/demo/demo-image-1.png"
      overlayContent={<div className="custom-preview-node">预览</div>}
      {...props}
    />,
  );
}

describe('Image', () => {
  describe('props', () => {
    test('alt', () => {
      const wrapper = render(<Image alt="text image load failed" src="https://www.error.img.com" />);
      const container = wrapper.container.querySelector('img');
      expect(container.getAttribute('alt')).toBe('text image load failed');
    });

    ['contain', 'cover', 'fill', 'none', 'scale-down'].forEach((item) => {
      test(`fit is equal to ${item}`, () => {
        const wrapper = render(<Image fit={item as TdImageProps['fit']} />);
        const container = wrapper.container.querySelector('.t-image');
        expect(container).toHaveClass(`t-image--fit-${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    test('gallery', () => {
      const { container: container1 } = render(<Image />);
      expect(container1.querySelector('.t-image__wrapper--gallery')).toBeFalsy();
      const { container: container2 } = render(<Image gallery={true} />);
      expect(container2.firstChild).toHaveClass('t-image__wrapper--gallery');
      const { container: container3 } = render(<Image gallery={false} />);
      expect(container3.querySelector('.t-image__wrapper--gallery')).toBeFalsy();
    });

    test('gallery shadow', () => {
      const { container } = render(<Image gallery={true} />);
      expect(container.querySelector('.t-image__gallery-shadow')).toBeTruthy();
    });

    const positionClassNameMap = {
      top: 't-image--position-top',
      bottom: 't-image--position-bottom',
      left: 't-image--position-left',
      right: 't-image--position-right',
      center: 't-image--position-center',
    };
    Object.entries(positionClassNameMap).forEach(([enumValue, expectedClassName]) => {
      test(`position is equal to ${enumValue}`, () => {
        const wrapper = render(<Image position={enumValue as TdImageProps['position']} />);
        const container = wrapper.container.querySelector('.t-image');
        expect(container).toHaveClass(expectedClassName);
      });
    });

    ['circle', 'round', 'square'].forEach((item) => {
      test(`shape is equal to ${item}`, () => {
        const wrapper = render(<Image shape={item as TdImageProps['shape']} />);
        const container = wrapper.container.querySelector('.t-image__wrapper');
        expect(container).toHaveClass(`t-image__wrapper--shape-${item}`);
      });
    });

    test('srcset', () => {
      const { container } = render(
        <Image
          srcset={{
            'image/avif': 'https://tdesign.gtimg.com/img/tdesign-image.avif',
            'image/webp': 'https://tdesign.gtimg.com/img/tdesign-image.webp',
          }}
        />,
      );
      const domWrapper = container.querySelector('picture > source');
      expect(domWrapper.getAttribute('srcset')).toBe('https://tdesign.gtimg.com/img/tdesign-image.avif');
      const domWrapper1 = container.querySelector('picture > source:nth-child(2)');
      expect(domWrapper1.getAttribute('srcset')).toBe('https://tdesign.gtimg.com/img/tdesign-image.webp');
    });
  });

  describe('slots', () => {
    test('error', () => {
      const { container } = render(
        <Image error={<span className="custom-node">TNode</span>} src="https://this.is.an.error.img.com" />,
      );
      const imgDom = container.querySelector('img');
      simulateImageEvent(imgDom, 'error');
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('loading', () => {
      const { container } = render(<Image loading={<span className="custom-node">TNode</span>} />);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('overlayContent', () => {
      const { container } = render(<Image overlayContent={<span className="custom-node">TNode</span>} />);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-image__overlay-content')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('placeholder', () => {
      const { container } = render(<Image placeholder={<span className="custom-node">TNode</span>} />);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  describe('events', () => {
    test('error', () => {
      const onErrorFn = vi.fn();
      const { container } = render(<Image src="https://load-failed-img.png" onError={onErrorFn} />);
      const imgDom = container.querySelector('img');
      simulateImageEvent(imgDom, 'error');
      expect(container.querySelector('.t-image__error')).toBeTruthy();
      expect(container.querySelector('.t-icon-image-error')).toBeTruthy();
      expect(onErrorFn).toHaveBeenCalled();
      expect(onErrorFn.mock.calls[0][0].e.type).toBe('error');
    });

    test('load', () => {
      const onLoadFn1 = vi.fn();
      const { container } = render(<Image src="https://tdesign.gtimg.com/demo/demo-image-1.png" onLoad={onLoadFn1} />);

      const imgDom1 = container.querySelector('img');
      simulateImageEvent(imgDom1, 'load');
      expect(onLoadFn1).toHaveBeenCalled();
      expect(onLoadFn1.mock.calls[0][0].e.type).toBe('load');
    });
  });

  describe('scenarios', () => {
    test('overlayTrigger hover', async () => {
      const { container } = getOverlayImageMount({
        overlayTrigger: 'hover',
        src: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
      });
      fireEvent.mouseEnter(container.querySelector('.t-image__wrapper'));
      await mockDelay();
      expect(container.querySelector('.t-image__overlay-content')).toBeTruthy();
      expect(container.querySelector('.t-image__overlay-content--hidden')).toBeFalsy();
      fireEvent.mouseLeave(container.querySelector('.t-image__wrapper'));
      await mockDelay();
      expect(container.querySelector('.t-image__overlay-content--hidden')).toBeTruthy();
    });

    test('lazy', () => {
      (document.body as HTMLElement & { height?: number }).height = 250;
      const win = window as Window & { observeCallbackhasCalled?: boolean };
      win.observeCallbackhasCalled = false;
      const observe = (element: Element, callback: (entries: Array<{ isIntersecting: boolean }>) => void) => {
        element.parentNode.parentNode.addEventListener('scroll', () => {
          if (win.observeCallbackhasCalled) {
            callback([{ isIntersecting: false }]);
          } else {
            win.observeCallbackhasCalled = true;
            callback([{ isIntersecting: true }]);
          }
        });
      };
      mockIntersectionObserver({}, { observe });

      const { container } = render(
        <Space
          style={{
            height: 240,
            width: 240,
            overflow: 'hidden',
            overflowY: 'scroll',
            paddingTop: 500,
          }}
        >
          {Array.from({ length: 16 }).map((_, index) => (
            <Image
              key={index}
              src="https://tdesign.gtimg.com/demo/demo-image-1.png"
              style={{ width: 230, height: 120 }}
              lazy
            />
          ))}
        </Space>,
      );

      const spaceElement = container.querySelector('.t-space');
      fireEvent.scroll(spaceElement, { target: { scrollY: 400 } });
      expect(spaceElement.firstChild.querySelector('img')).not.toBeNull();
      expect(spaceElement.lastChild.querySelector('img')).toBeNull();
    });
  });
});

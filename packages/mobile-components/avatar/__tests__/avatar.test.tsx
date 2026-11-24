import React from 'react';
import { describe, expect, it, render, vi, fireEvent, act } from '@test/utils';
import { UserIcon } from 'tdesign-icons-react';
import { Avatar } from '../index';

describe('Avatar', () => {
  describe('props', () => {
    it(': image', async () => {
      const image = 'https://tdesign.gtimg.com/mobile/demos/avatar1.png';
      const { container } = render(<Avatar image={image} />);

      expect(container.querySelector(`.t-image__img`)).toBeTruthy();
      expect((container.querySelector(`.t-image__img`) as HTMLImageElement).src).toBe(image);
    });

    it(': shape', () => {
      const testShape = (shape, target) => {
        const { container } = render(<Avatar shape={shape}>A</Avatar>);
        expect(container.querySelector(target)).toBeTruthy();
      };
      testShape(undefined, '.t-avatar--circle');
      testShape('circle', '.t-avatar--circle');
      testShape('round', '.t-avatar--round');
    });

    describe(': slot', () => {
      it(': default', () => {
        const testSlot = (content) => {
          const { getByText } = render(<Avatar>{content}</Avatar>);
          expect(getByText(content).textContent).toBeTruthy();
        };
        testSlot('A');
        testSlot('B');
      });
    });

    it(': icon', () => {
      const { container } = render(<Avatar icon={<UserIcon />} />);
      expect(container.querySelector('.t-avatar__icon')).toBeTruthy();
    });

    it(': badge', () => {
      const count = 8;
      const { container } = render(<Avatar badgeProps={{ count, offset: [6, 6] }} icon={<UserIcon />} />);
      expect(container.querySelector('.t-badge--basic')).toBeTruthy();
      expect(container.querySelector('.t-badge--basic > .t-badge__count').innerHTML.trim()).toBe(`${count}`);
    });

    it(': size', () => {
      const testSize = (size, target) => {
        const { container } = render(<Avatar size={size}>A</Avatar>);
        expect(container.querySelector(target)).toBeTruthy();
      };
      testSize(undefined, '.t-avatar--medium');
      testSize('small', '.t-avatar--small');
      testSize('large', '.t-avatar--large');
    });

    it(': custom size applies inline style and medium class fallback', () => {
      const { container } = render(<Avatar size="20px">A</Avatar>);
      const inner = container.querySelector('.t-avatar') as HTMLDivElement;
      expect(inner).toBeTruthy();
      // class falls back to medium for custom sizes
      expect(inner.classList.contains('t-avatar--medium')).toBe(true);
      // width/height & font-size inline styles are set
      expect(inner.style.width).toBe('20px');
      expect(inner.style.height).toBe('20px');
      // font-size = parseInt(20px)/8*3+2 = 9.5px
      expect(inner.style.fontSize).toBe('9.5px');
    });

    it(': error', async () => {
      const testError = async (hideOnLoadFailed?: boolean) => {
        const onError = vi.fn();
        const { container } = render(<Avatar image={' '} onError={onError} hideOnLoadFailed={hideOnLoadFailed} />);

        const imageElement = container.querySelector('img');
        if (hideOnLoadFailed) {
          expect(imageElement).toBeFalsy();
          expect(onError).not.toHaveBeenCalled();
        } else {
          expect(imageElement).toBeTruthy();
          await act(async () => {
            fireEvent.error(imageElement);
          });
          expect(onError).toHaveBeenCalled();
        }
      };

      await testError(undefined);
      await testError(false);
      await testError(true);
    });

    it(': image has alt attribute and overrides icon/children', () => {
      const image = 'https://tdesign.gtimg.com/mobile/demos/avatar1.png';
      const { container, queryByText } = render(
        <Avatar image={image} alt="my-avatar" icon={<UserIcon />}>
          C
        </Avatar>,
      );
      const img = container.querySelector('img') as HTMLImageElement;
      expect(img).toBeTruthy();
      expect(img.alt).toBe('my-avatar');
      // icon and children should not render when image is present
      expect(container.querySelector('.t-avatar__icon')).toBeFalsy();
      expect(queryByText('C')).toBeNull();
    });

    it(': hideOnLoadFailed=true falls back to icon when provided', () => {
      const { container } = render(<Avatar image="https://example.com/xx.png" hideOnLoadFailed icon={<UserIcon />} />);
      expect(container.querySelector('img')).toBeFalsy();
      expect(container.querySelector('.t-avatar__icon')).toBeTruthy();
    });

    it(': hideOnLoadFailed=true falls back to children when no icon', () => {
      const { getByText, container } = render(
        <Avatar image="https://example.com/xx.png" hideOnLoadFailed>
          TXT
        </Avatar>,
      );
      expect(container.querySelector('img')).toBeFalsy();
      expect(getByText('TXT')).toBeInTheDocument();
    });

    it(': className is applied to wrapper', () => {
      const { container } = render(<Avatar className="my-extra">A</Avatar>);
      const wrapper = container.querySelector('.t-avatar__wrapper.my-extra');
      expect(wrapper).toBeTruthy();
    });
  });
});

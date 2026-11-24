import React from 'react';
import { describe, expect, fireEvent, it, render, vi } from '@test/utils';
import { UserAddIcon } from 'tdesign-icons-react';
import AvatarGroup from '../AvatarGroup';
import Avatar from '../Avatar';

describe('AvatarGroup', () => {
  describe('props', () => {
    const imageList = [
      'https://tdesign.gtimg.com/mobile/demos/avatar1.png',
      'https://tdesign.gtimg.com/mobile/demos/avatar2.png',
      'https://tdesign.gtimg.com/mobile/demos/avatar3.png',
      'https://tdesign.gtimg.com/mobile/demos/avatar4.png',
      'https://tdesign.gtimg.com/mobile/demos/avatar5.png',
      'https://tdesign.gtimg.com/mobile/demos/avatar1.png',
      'https://tdesign.gtimg.com/mobile/demos/avatar2.png',
      'https://tdesign.gtimg.com/mobile/demos/avatar3.png',
      'https://tdesign.gtimg.com/mobile/demos/avatar4.png',
      'https://tdesign.gtimg.com/mobile/demos/avatar5.png',
    ];

    it(': max', () => {
      const testMax = (imageList, target) => {
        const max = 5;
        const { container } = render(
          <AvatarGroup cascading="left-up" max={max}>
            {imageList.map((url, index) => (
              <Avatar key={`exhibition-${index}`} shape="circle" image={url} />
            ))}
          </AvatarGroup>,
        );

        expect(container.querySelector('.t-avatar__wrapper')).toBeTruthy();
        expect(container.querySelectorAll('.t-avatar__wrapper').length).toBe(target);
      };

      testMax(imageList, 6);
      testMax(imageList.slice(0, 5), 5);
    });

    it(': collapseAvatar', () => {
      const onCollapsedItemClick = vi.fn();
      const { container } = render(
        <AvatarGroup
          onCollapsedItemClick={onCollapsedItemClick}
          max={5}
          collapseAvatar={<UserAddIcon style={{ fontSize: '24px' }} />}
        >
          {imageList.map((url, index) => (
            <Avatar key={`action-${index}`} shape="circle" image={url} />
          ))}
        </AvatarGroup>,
      );
      const collapsedElement = container.querySelector('.t-icon-user-add');
      expect(collapsedElement).toBeTruthy();

      fireEvent.click(collapsedElement);
      expect(onCollapsedItemClick).toHaveBeenCalled();
    });

    it(': cascading', () => {
      const testCascading = (cascading, target) => {
        const max = 5;
        const { container } = render(
          <AvatarGroup cascading={cascading} max={max}>
            {imageList.map((url, index) => (
              <Avatar key={`exhibition-${index}`} shape="circle" image={url} />
            ))}
          </AvatarGroup>,
        );

        expect(container.querySelector(target)).toBeTruthy();
      };

      testCascading(undefined, '.t-avatar-group-offset-right');
      testCascading('', '.t-avatar-group-offset-right');
      testCascading('right-up', '.t-avatar-group-offset-right');
      testCascading('left-up', '.t-avatar-group-offset-left');
    });

    it(': size', () => {
      const testSize = (size, target) => {
        const max = 5;
        const { container } = render(
          <AvatarGroup size={size} max={max}>
            {imageList.map((url, index) => (
              <Avatar key={`exhibition-${index}`} shape="circle" image={url} />
            ))}
          </AvatarGroup>,
        );

        expect(container.querySelector(target)).toBeTruthy();
      };

      testSize(undefined, '.t-avatar-group-offset-right-medium');
      testSize('20px', '.t-avatar-group-offset-right-medium');
      testSize('1rem', '.t-avatar-group-offset-right-medium');
      testSize('large', '.t-avatar-group-offset-right-large');
      testSize('small', '.t-avatar-group-offset-right-small');
    });

    it('applies group shape to children and adds border styles in group', () => {
      const { container } = render(
        <AvatarGroup shape="round" max={3}>
          <Avatar image={imageList[0]} />
          <Avatar image={imageList[1]} />
          <Avatar image={imageList[2]} />
        </AvatarGroup>,
      );
      const avatars = Array.from(container.querySelectorAll('.t-avatar')) as HTMLElement[];
      expect(avatars.length).toBe(3);
      avatars.forEach((el) => {
        expect(el.classList.contains('t-avatar--round')).toBe(true);
        expect(el.className).toContain('t-avatar--border');
      });
    });

    it('applies group size to children', () => {
      const { container } = render(
        <AvatarGroup size="large" max={2}>
          <Avatar image={imageList[0]} />
          <Avatar image={imageList[1]} />
        </AvatarGroup>,
      );
      const avatars = Array.from(container.querySelectorAll('.t-avatar')) as HTMLElement[];
      expect(avatars.every((el) => el.classList.contains('t-avatar--large'))).toBe(true);
      // border class also respects size
      expect(avatars.every((el) => el.className.includes('t-avatar--border-large'))).toBe(true);
    });

    it('custom group size falls back to medium class and sets inline styles on children', () => {
      const { container } = render(
        <AvatarGroup size="24px" max={2}>
          <Avatar image={imageList[0]} />
          <Avatar image={imageList[1]} />
        </AvatarGroup>,
      );
      const first = container.querySelectorAll('.t-avatar')[0] as HTMLElement;
      expect(first.classList.contains('t-avatar--medium')).toBe(true);
      expect(first.className).toContain('t-avatar--border-medium');
      // Inline style width/height should be applied for custom size
      const style = (first as HTMLElement).getAttribute('style') || '';
      expect(style).toContain('width: 24px');
      expect(style).toContain('height: 24px');
    });

    it('renders default collapse with overflow count and triggers click', () => {
      const onCollapsedItemClick = vi.fn();
      const { container } = render(
        <AvatarGroup max={5} onCollapsedItemClick={onCollapsedItemClick}>
          {imageList.slice(0, 8).map((url, i) => (
            <Avatar key={i} image={url} />
          ))}
        </AvatarGroup>,
      );
      // +3 should appear
      const collapseWrap = container.querySelector('.t-avatar-group__collapse--default') as HTMLElement;
      expect(collapseWrap).toBeTruthy();
      const collapseAvatar = collapseWrap.querySelector('.t-avatar') as HTMLElement;
      expect(collapseAvatar).toBeTruthy();
      expect(collapseAvatar.textContent?.trim()).toBe('+3');
      collapseWrap.click();
      expect(onCollapsedItemClick).toHaveBeenCalled();
    });

    it('collapse avatar inherits size from first child when child has its own size', () => {
      const { container } = render(
        <AvatarGroup size="large" max={2}>
          <Avatar size="small" image={imageList[0]} />
          <Avatar image={imageList[1]} />
          <Avatar image={imageList[2]} />
        </AvatarGroup>,
      );
      const collapseAvatar = container.querySelector('.t-avatar-group__collapse--default .t-avatar') as HTMLElement;
      expect(collapseAvatar).toBeTruthy();
      expect(collapseAvatar.classList.contains('t-avatar--small')).toBe(true);
    });
  });
});

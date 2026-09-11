import React from 'react';
import { render } from '@test/utils';

import { Avatar, AvatarGroup } from '..';

import type { TdAvatarGroupProps } from '../type';

function getAvatarGroupDefaultMount(props?: Partial<TdAvatarGroupProps>, events?: Record<string, any>) {
  return render(
    <AvatarGroup {...props} {...events}>
      <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg" />
      <Avatar>W</Avatar>
      <Avatar icon={() => <i className="custom-node"></i>} />
      <Avatar size="small">TD</Avatar>
      <Avatar size="large">ME</Avatar>
    </AvatarGroup>,
  );
}

describe('AvatarGroup', () => {
  describe('props', () => {
    const cascadingClassNameList = ['t-avatar--offset-left', 't-avatar--offset-right'];
    (['left-up', 'right-up'] as TdAvatarGroupProps['cascading'][]).forEach((item, index) => {
      test(`cascading is equal to ${item}`, () => {
        const { container } = render(<AvatarGroup cascading={item}></AvatarGroup>);
        expect(container.firstChild).toHaveClass(cascadingClassNameList[index]);
        expect(container).toMatchSnapshot();
      });
    });

    test('max', () => {
      const { container } = getAvatarGroupDefaultMount({ max: 3 });
      expect(container.querySelectorAll('.t-avatar').length).toBe(4);
      expect(container.querySelectorAll('.t-avatar__collapse').length).toBe(1);
      expect(container.querySelector('.t-avatar__collapse > span').textContent).toBe('+2');
    });

    test(`size is equal to small`, () => {
      const { container } = getAvatarGroupDefaultMount({ size: 'small' });
      const domWrapper = container.querySelector('.t-avatar');
      expect(domWrapper).toHaveClass('t-size-s');
      const domWrapper1 = container.querySelector('.t-avatar:nth-child(5)');
      expect(domWrapper1).toHaveClass('t-size-l');
    });

    test(`size is equal to large`, () => {
      const { container } = getAvatarGroupDefaultMount({ size: 'large' });
      const domWrapper = container.querySelector('.t-avatar');
      expect(domWrapper).toHaveClass('t-size-l');
      const domWrapper1 = container.querySelector('.t-avatar:nth-child(4)');
      expect(domWrapper1).toHaveClass('t-size-s');
    });

    test(`size is equal to 120px`, () => {
      const { container } = getAvatarGroupDefaultMount({ size: '120px' });
      const domWrapper = container.querySelector('.t-avatar') as HTMLElement;
      expect(domWrapper.style.width).toBe('120px');
      expect(domWrapper.style.height).toBe('120px');
      expect(domWrapper.style.fontSize).toBe('60px');
    });
  });

  describe('slots', () => {
    test('collapseAvatar', () => {
      const { container } = getAvatarGroupDefaultMount({
        collapseAvatar: <span className="custom-node">TNode</span>,
        max: 3,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
});

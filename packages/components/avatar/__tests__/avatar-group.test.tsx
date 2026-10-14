import React from 'react';
import { render } from '@test/utils';

import { Avatar, AvatarGroup } from '..';

import type { TdAvatarGroupProps } from '../type';

type SizeCase = {
  caseName: string;
  size: TdAvatarGroupProps['size'];
  expectedClassName?: string;
  childSelector?: string;
  childClassName?: string;
  expectedStyle?: {
    width: string;
    height: string;
    fontSize: string;
  };
};

function getAvatarGroupDefaultMount(props?: Partial<TdAvatarGroupProps>, events?: Record<string, any>) {
  return render(
    <AvatarGroup {...props} {...events}>
      <Avatar image="https://tdesign.gtimg.com/site/avatar.jpg" />
      <Avatar>W</Avatar>
      <Avatar icon={<i className="custom-node"></i>} />
      <Avatar size="small">TD</Avatar>
      <Avatar size="large">ME</Avatar>
    </AvatarGroup>,
  );
}

describe('AvatarGroup', () => {
  describe('props', () => {
    const cascadingClassNameList = ['t-avatar--offset-left', 't-avatar--offset-right'];
    (['left-up', 'right-up'] as TdAvatarGroupProps['cascading'][]).forEach((item, index) => {
      test(`cascading[${item}]`, () => {
        const { container } = render(<AvatarGroup cascading={item}></AvatarGroup>);
        expect(container.firstChild).toHaveClass(cascadingClassNameList[index]);
        expect(container).toMatchSnapshot();
      });
    });

    test('max[number]', () => {
      const { container } = getAvatarGroupDefaultMount({ max: 3 });
      expect(container.querySelectorAll('.t-avatar').length).toBe(4);
      expect(container.querySelectorAll('.t-avatar__collapse').length).toBe(1);
      expect(container.querySelector('.t-avatar__collapse > span').textContent).toBe('+2');
    });

    const sizeCases: SizeCase[] = [
      {
        caseName: 'small',
        size: 'small',
        expectedClassName: 't-size-s',
        childSelector: '.t-avatar:nth-child(5)',
        childClassName: 't-size-l',
      },
      {
        caseName: 'large',
        size: 'large',
        expectedClassName: 't-size-l',
        childSelector: '.t-avatar:nth-child(4)',
        childClassName: 't-size-s',
      },
      {
        caseName: 'css-length',
        size: '120px',
        expectedStyle: {
          width: '120px',
          height: '120px',
          fontSize: '60px',
        },
      },
    ];
    sizeCases.forEach(({ caseName, size, expectedClassName, childSelector, childClassName, expectedStyle }) => {
      test(`size[${caseName}]`, () => {
        const { container } = getAvatarGroupDefaultMount({ size });
        const domWrapper = container.querySelector('.t-avatar') as HTMLElement;
        if (expectedClassName) {
          expect(domWrapper).toHaveClass(expectedClassName);
        }
        if (childSelector && childClassName) {
          expect(container.querySelector(childSelector)).toHaveClass(childClassName);
        }
        if (expectedStyle) {
          expect(domWrapper.style.width).toBe(expectedStyle.width);
          expect(domWrapper.style.height).toBe(expectedStyle.height);
          expect(domWrapper.style.fontSize).toBe(expectedStyle.fontSize);
        }
      });
    });

    test('collapseAvatar[TNode]', () => {
      const { container } = getAvatarGroupDefaultMount({
        collapseAvatar: <span className="custom-node">TNode</span>,
        max: 3,
      });
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });
});

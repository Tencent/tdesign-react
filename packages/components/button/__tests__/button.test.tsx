import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { Button } from '..';

import type { TdButtonProps } from '../type';

describe('Button', () => {
  describe('props', () => {
    test('block', () => {
      // block default value is false
      const { container: container1 } = render(<Button>Text</Button>);
      expect(container1.querySelector(`.${'t-size-full-width'}`)).toBeFalsy();
      // block = true
      const { container: container2 } = render(<Button block={true}>Text</Button>);
      expect(container2.firstChild).toHaveClass('t-size-full-width');
      expect(container2).toMatchSnapshot();
      // block = false
      const { container: container3 } = render(<Button block={false}>Text</Button>);
      expect(container3.querySelector(`.${'t-size-full-width'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    test('disabled', () => {
      // disabled default value is false
      const { container: container1 } = render(<Button>Text</Button>);
      expect(container1.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      // disabled = true
      const { container: container2 } = render(<Button disabled={true}>Text</Button>);
      expect(container2.firstChild).toHaveClass('t-is-disabled');
      expect(container2).toMatchSnapshot();
      // disabled = false
      const { container: container3 } = render(<Button disabled={false}>Text</Button>);
      expect(container3.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    test('ghost', () => {
      // ghost default value is false
      const { container: container1 } = render(<Button>Text</Button>);
      expect(container1.querySelector(`.${'t-button--ghost'}`)).toBeFalsy();
      // ghost = true
      const { container: container2 } = render(<Button ghost={true}>Text</Button>);
      expect(container2.firstChild).toHaveClass('t-button--ghost');
      expect(container2).toMatchSnapshot();
      // ghost = false
      const { container: container3 } = render(<Button ghost={false}>Text</Button>);
      expect(container3.querySelector(`.${'t-button--ghost'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    test('href', () => {
      const { container } = render(<Button href="https://tdesign.tencent.com/">Text</Button>);
      expect((container.firstChild as HTMLElement).getAttribute('href')).toBe('https://tdesign.tencent.com/');
      expect(container).toMatchSnapshot();
    });

    test('loading', () => {
      // loading default value is false
      const { container: container1 } = render(<Button>Text</Button>);
      expect(container1.querySelector(`.${'t-is-loading'}`)).toBeFalsy();
      // loading = true
      const { container: container2 } = render(<Button loading={true}>Text</Button>);
      expect(container2.firstChild).toHaveClass('t-is-loading');
      expect(container2).toMatchSnapshot();
      // loading = false
      const { container: container3 } = render(<Button loading={false}>Text</Button>);
      expect(container3.querySelector(`.${'t-is-loading'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    test('loading contains .t-loading', () => {
      // loading default value is false
      const { container } = render(<Button>Text</Button>);
      expect(container.querySelector('.t-loading')).toBeFalsy();
      // loading = false
      const { container: container1 } = render(<Button loading={false}>Text</Button>);
      expect(container1.querySelector('.t-loading')).toBeFalsy();
      // loading = true
      const { container: container2 } = render(<Button loading={true}>Text</Button>);
      expect(container2.querySelector('.t-loading')).toBeTruthy();
      expect(container2).toMatchSnapshot();
    });

    const shapeClassNameList: Array<string | Record<string, boolean>> = [
      { 't-button--shape-rectangle': false },
      't-button--shape-square',
      't-button--shape-round',
      't-button--shape-circle',
    ];
    (['rectangle', 'square', 'round', 'circle'] as TdButtonProps['shape'][]).forEach((item, index) => {
      test(`shape is equal to ${item}`, () => {
        const { container } = render(<Button shape={item}>Text</Button>);
        if (typeof shapeClassNameList[index] === 'string') {
          expect(container.firstChild).toHaveClass(shapeClassNameList[index]);
        } else if (typeof shapeClassNameList[index] === 'object') {
          const classNameKey = Object.keys(shapeClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
        expect(container).toMatchSnapshot();
      });
    });

    const sizeClassNameList: Array<string | Record<string, boolean>> = ['t-size-s', { 't-size-m': false }, 't-size-l'];
    (['small', 'medium', 'large'] as TdButtonProps['size'][]).forEach((item, index) => {
      test(`size is equal to ${item}`, () => {
        const { container } = render(<Button size={item}>Text</Button>);
        if (typeof sizeClassNameList[index] === 'string') {
          expect(container.firstChild).toHaveClass(sizeClassNameList[index]);
        } else if (typeof sizeClassNameList[index] === 'object') {
          const classNameKey = Object.keys(sizeClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
        expect(container).toMatchSnapshot();
      });
    });

    const tagExpectedDom = ['button', 'a', 'div'];
    (['button', 'a', 'div'] as TdButtonProps['tag'][]).forEach((item, index) => {
      test(`tag is equal to ${item}`, () => {
        const { container } = render(<Button tag={item}>Text</Button>);
        expect(container.querySelector(tagExpectedDom[index])).toBeTruthy();
        expect(container).toMatchSnapshot();
      });
    });

    (['default', 'primary', 'danger', 'warning', 'success'] as TdButtonProps['theme'][]).forEach((item) => {
      test(`theme is equal to ${item}`, () => {
        const { container } = render(<Button theme={item}>Text</Button>);
        expect(container.firstChild).toHaveClass(`t-button--theme-${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    const attributeValues = ['submit', 'reset', 'button'];
    (['submit', 'reset', 'button'] as TdButtonProps['type'][]).forEach((item, index) => {
      test(`type is equal to ${item}`, () => {
        const { container } = render(<Button type={item}></Button>);
        expect((container.firstChild as HTMLElement).getAttribute('type')).toBe(attributeValues[index]);
      });
    });

    (['base', 'outline', 'dashed', 'text'] as TdButtonProps['variant'][]).forEach((item) => {
      test(`variant is equal to ${item}`, () => {
        const { container } = render(<Button variant={item}>Text</Button>);
        expect(container.firstChild).toHaveClass(`t-button--variant-${item}`);
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('slots', () => {
    test('children', () => {
      const { container } = render(
        <Button>
          <span className="custom-node">TNode</span>
        </Button>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('content', () => {
      const { container } = render(<Button content={<span className="custom-node">TNode</span>}></Button>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('icon', () => {
      const { container } = render(<Button icon={<span className="custom-node">TNode</span>}>Text</Button>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('suffix', () => {
      const { container } = render(<Button suffix={<span className="custom-node">TNode</span>}>Text</Button>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });
  });

  describe('events', () => {
    test('click', () => {
      const fn = vi.fn();
      const { container } = render(<Button onClick={fn}></Button>);
      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].stopPropagation).toBeTruthy();
      expect(fn.mock.calls[0][0].type).toBe('click');
    });
  });
});

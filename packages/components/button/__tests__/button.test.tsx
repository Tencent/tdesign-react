import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { Button } from '..';

import type { ButtonProps } from '../Button';
import type { TdButtonProps } from '../type';

describe('Button', () => {
  describe('props', () => {
    test('block[boolean]', () => {
      const { container: container1 } = render(<Button>Text</Button>);
      expect(container1.querySelector(`.${'t-size-full-width'}`)).toBeFalsy();

      const { container: container2 } = render(<Button block={true}>Text</Button>);
      expect(container2.firstChild).toHaveClass('t-size-full-width');
      expect(container2).toMatchSnapshot();

      const { container: container3 } = render(<Button block={false}>Text</Button>);
      expect(container3.querySelector(`.${'t-size-full-width'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    test('disabled[boolean]', () => {
      const { container: container1 } = render(<Button>Text</Button>);
      expect(container1.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();

      const { container: container2 } = render(<Button disabled={true}>Text</Button>);
      expect(container2.firstChild).toHaveClass('t-is-disabled');
      expect(container2).toMatchSnapshot();

      const { container: container3 } = render(<Button disabled={false}>Text</Button>);
      expect(container3.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    test('ghost[boolean]', () => {
      const { container: container1 } = render(<Button>Text</Button>);
      expect(container1.querySelector(`.${'t-button--ghost'}`)).toBeFalsy();

      const { container: container2 } = render(<Button ghost={true}>Text</Button>);
      expect(container2.firstChild).toHaveClass('t-button--ghost');
      expect(container2).toMatchSnapshot();

      const { container: container3 } = render(<Button ghost={false}>Text</Button>);
      expect(container3.querySelector(`.${'t-button--ghost'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    test('href[string]', () => {
      const { container } = render(<Button href="https://tdesign.tencent.com/">Text</Button>);
      expect((container.firstChild as HTMLElement).getAttribute('href')).toBe('https://tdesign.tencent.com/');
      expect(container).toMatchSnapshot();
    });

    describe('href with disabled or loading', () => {
      const inactiveStates: Array<{
        name: string;
        props: Pick<ButtonProps, 'disabled' | 'loading'>;
      }> = [
        { name: 'disabled', props: { disabled: true } },
        { name: 'loading', props: { loading: true } },
        {
          name: 'disabled and loading',
          props: { disabled: true, loading: true },
        },
      ];

      test.each(inactiveStates)('href with $name does not render a navigable link', ({ props }) => {
        ([undefined, 'a'] as TdButtonProps['tag'][]).forEach((tag) => {
          const { container } = render(
            <Button {...props} tag={tag} href="#button-link">
              Text
            </Button>,
          );
          const element = container.firstElementChild;

          expect(element).not.toBeNull();
          expect(element.tagName).toBe('DIV');
          expect(container.querySelector('a[href]')).toBeNull();
          if (props.disabled) expect(element).toHaveClass('t-is-disabled');
          if (props.loading) expect(element).toHaveClass('t-is-loading');
        });
      });

      test.each(inactiveStates)('tag[a] with an empty href and $name is non-navigable', ({ props }) => {
        const { container } = render(
          <Button {...props} tag="a" href="">
            Text
          </Button>,
        );

        expect(container.firstElementChild).not.toBeNull();
        expect(container.firstElementChild.tagName).toBe('DIV');
        expect(container.querySelector('a[href]')).toBeNull();
      });

      test.each<TdButtonProps['tag']>(['button', 'div'])('tag[%s] is preserved when inactive', (tag) => {
        inactiveStates.forEach(({ props }) => {
          const { container } = render(
            <Button {...props} tag={tag} href="#button-link" type="submit">
              Text
            </Button>,
          );

          expect(container.firstElementChild).not.toBeNull();
          expect(container.firstElementChild.tagName).toBe(tag.toUpperCase());
          expect(container.querySelector('a[href]')).toBeNull();
          if (tag === 'button') {
            expect(container.firstElementChild).toBeDisabled();
            expect(container.firstElementChild).toHaveAttribute('type', 'submit');
          }
        });
      });

      test('loading without href retains native button semantics', () => {
        const { getByRole } = render(
          <Button loading type="submit">
            Text
          </Button>,
        );
        const button = getByRole('button', { name: 'Text' });

        expect(button.tagName).toBe('BUTTON');
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('type', 'submit');
      });
    });

    test('loading[boolean]', () => {
      const { container: container1 } = render(<Button>Text</Button>);
      expect(container1.querySelector(`.${'t-is-loading'}`)).toBeFalsy();
      expect(container1.querySelector('.t-loading')).toBeFalsy();

      const { container: container2 } = render(<Button loading={true}>Text</Button>);
      expect(container2.firstChild).toHaveClass('t-is-loading');
      expect(container2.querySelector('.t-loading')).toBeTruthy();
      expect(container2).toMatchSnapshot();

      const { container: container3 } = render(<Button loading={false}>Text</Button>);
      expect(container3.querySelector(`.${'t-is-loading'}`)).toBeFalsy();
      expect(container3.querySelector('.t-loading')).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    const shapeClassNameList: Array<string | Record<string, boolean>> = [
      { 't-button--shape-rectangle': false },
      't-button--shape-square',
      't-button--shape-round',
      't-button--shape-circle',
    ];
    (['rectangle', 'square', 'round', 'circle'] as TdButtonProps['shape'][]).forEach((item, index) => {
      test(`shape[${item}]`, () => {
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
      test(`size[${item}]`, () => {
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
      test(`tag[${item}]`, () => {
        const { container } = render(<Button tag={item}>Text</Button>);
        expect(container.querySelector(tagExpectedDom[index])).toBeTruthy();
        expect(container).toMatchSnapshot();
      });
    });

    (['default', 'primary', 'danger', 'warning', 'success'] as TdButtonProps['theme'][]).forEach((item) => {
      test(`theme[${item}]`, () => {
        const { container } = render(<Button theme={item}>Text</Button>);
        expect(container.firstChild).toHaveClass(`t-button--theme-${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    const attributeValues = ['submit', 'reset', 'button'];
    (['submit', 'reset', 'button'] as TdButtonProps['type'][]).forEach((item, index) => {
      test(`type[${item}]`, () => {
        const { container } = render(<Button type={item}></Button>);
        expect((container.firstChild as HTMLElement).getAttribute('type')).toBe(attributeValues[index]);
      });
    });

    (['base', 'outline', 'dashed', 'text'] as TdButtonProps['variant'][]).forEach((item) => {
      test(`variant[${item}]`, () => {
        const { container } = render(<Button variant={item}>Text</Button>);
        expect(container.firstChild).toHaveClass(`t-button--variant-${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    test('content and children', () => {
      const node = <span className="custom-node">TNode</span>;
      const contentWrapper = render(<Button content={node} />);
      const childrenWrapper = render(<Button>{node}</Button>);

      [contentWrapper, childrenWrapper].forEach(({ container }) => {
        expect(container.querySelector('.custom-node')).toBeTruthy();
        expect(container).toMatchSnapshot();
      });
    });

    test('icon[TNode]', () => {
      const { container } = render(<Button icon={<span className="custom-node">TNode</span>}>Text</Button>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('suffix[TNode]', () => {
      const { container } = render(<Button suffix={<span className="custom-node">TNode</span>}>Text</Button>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });
  });

  describe('events', () => {
    test('onClick', () => {
      const fn = vi.fn();
      const { container } = render(<Button onClick={fn}></Button>);
      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].stopPropagation).toBeTruthy();
      expect(fn.mock.calls[0][0].type).toBe('click');
    });
  });

  describe('scenarios', () => {
    test.each<TdButtonProps['tag']>([undefined, 'a'])(
      'href restores navigation, onClick and ref after inactive states with tag=%s',
      (tag) => {
        const ref = React.createRef<HTMLElement>();
        const onClick = vi.fn((event: React.MouseEvent<HTMLElement>) => event.preventDefault());
        const { container, rerender, unmount, getByRole, queryByRole } = render(
          <Button tag={tag} href="#button-link" ref={ref} onClick={onClick}>
            Text
          </Button>,
        );

        [
          { disabled: false, loading: false },
          { disabled: false, loading: true },
          { disabled: true, loading: true },
          { disabled: true, loading: false },
          { disabled: false, loading: false },
        ].forEach((props) => {
          rerender(
            <Button {...props} tag={tag} href="#button-link" ref={ref} onClick={onClick}>
              Text
            </Button>,
          );
          const element = container.firstElementChild;
          const inactive = props.disabled || props.loading;

          expect(element).not.toBeNull();
          expect(ref.current).toBe(element);
          if (inactive) {
            expect(element.tagName).toBe('DIV');
            expect(container.querySelector('a[href]')).toBeNull();
            expect(queryByRole('link')).toBeNull();
          } else {
            expect(element.tagName).toBe('A');
            expect(element).toHaveAttribute('href', '#button-link');
            expect(getByRole('link', { name: 'Text' })).toBe(element);
          }

          onClick.mockClear();
          fireEvent.click(element);
          expect(onClick).toHaveBeenCalledTimes(inactive ? 0 : 1);
        });

        unmount();
        expect(ref.current).toBeNull();
      },
    );
  });
});

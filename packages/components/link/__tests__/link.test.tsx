import React from 'react';
import { fireEvent, render, screen, vi } from '@test/utils';

import Link from '../Link';

import type { TdLinkProps } from '../type';

describe('Link', () => {
  describe('props', () => {
    test('disabled', () => {
      // disabled default value is
      const { container: container1 } = render(<Link>Text</Link>);
      expect(container1.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      // disabled = true
      const { container: container2 } = render(<Link disabled={true}>Text</Link>);
      expect(container2.firstChild).toHaveClass('t-is-disabled');
      expect(container2).toMatchSnapshot();
      // disabled = false
      const { container: container3 } = render(<Link disabled={false}>Text</Link>);
      expect(container3.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
      expect(container3).toMatchSnapshot();
    });

    (['color', 'underline'] as TdLinkProps['hover'][]).forEach((item) => {
      test(`hover is equal to ${item}`, () => {
        const { container } = render(<Link hover={item}>Text</Link>);
        expect(container.firstChild).toHaveClass(`t-link--hover-${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    test('href', () => {
      const { container } = render(<Link href="https://tdesign.tencent.com/">Text</Link>);
      expect((container.firstChild as HTMLElement).getAttribute('href')).toBe('https://tdesign.tencent.com/');
      expect(container).toMatchSnapshot();
    });

    const sizeClassNameList: Array<string | Record<string, boolean>> = ['t-size-s', { 't-size-m': false }, 't-size-l'];
    (['small', 'medium', 'large'] as TdLinkProps['size'][]).forEach((item, index) => {
      test(`size is equal to ${item}`, () => {
        const { container } = render(<Link size={item}>Text</Link>);
        if (typeof sizeClassNameList[index] === 'string') {
          expect(container.firstChild).toHaveClass(sizeClassNameList[index]);
        } else if (typeof sizeClassNameList[index] === 'object') {
          const classNameKey = Object.keys(sizeClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
        expect(container).toMatchSnapshot();
      });
    });

    test('target', () => {
      const { container } = render(<Link target="_blank">Text</Link>);
      expect((container.firstChild as HTMLElement).getAttribute('target')).toBe('_blank');
      expect(container).toMatchSnapshot();
    });

    (['default', 'primary', 'danger', 'warning', 'success'] as TdLinkProps['theme'][]).forEach((item) => {
      test(`theme is equal to ${item}`, () => {
        const { container } = render(<Link theme={item}>Text</Link>);
        expect(container.firstChild).toHaveClass(`t-link--theme-${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    test('underline', () => {
      // underline default value is
      const { container: container1 } = render(<Link>Text</Link>);
      expect(container1.querySelector(`.${'t-is-underline'}`)).toBeFalsy();
      // underline = true
      const { container: container2 } = render(<Link underline={true}>Text</Link>);
      expect(container2.firstChild).toHaveClass('t-is-underline');
      // underline = false
      const { container: container3 } = render(<Link underline={false}>Text</Link>);
      expect(container3.querySelector(`.${'t-is-underline'}`)).toBeFalsy();
    });

    test('underline class', () => {
      const { container } = render(<Link underline={true} />);
      expect(container.firstChild).toHaveClass('t-is-underline');
    });

    test('hover', () => {
      const { container } = render(<Link hover="color" />);
      expect(container.firstChild).toHaveClass('t-link--hover-color');
    });

    test('size', () => {
      expect(render(<Link size="large" />).container.firstChild).toHaveClass('t-size-l');
      expect(render(<Link size="small" />).container.firstChild).toHaveClass('t-size-s');
    });

    test('theme', () => {
      expect(render(<Link theme="danger" />).container.firstChild).toHaveClass('t-link--theme-danger', '');
      expect(render(<Link theme="default" />).container.firstChild).toHaveClass('t-link--theme-default', '');
      expect(render(<Link theme="primary" />).container.firstChild).toHaveClass('t-link--theme-primary', '');
      expect(render(<Link theme="success" />).container.firstChild).toHaveClass('t-link--theme-success', '');
      expect(render(<Link theme="warning" />).container.firstChild).toHaveClass('t-link--theme-warning', '');
      expect(render(<Link />).container.firstChild).toHaveClass('t-link--theme-default', '');
    });
  });

  describe('slots', () => {
    test('children', () => {
      const { container } = render(
        <Link>
          <span className="custom-node">TNode</span>
        </Link>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('content', () => {
      const { container } = render(<Link content={<span className="custom-node">TNode</span>}></Link>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('prefixIcon', () => {
      const { container } = render(<Link prefixIcon={<span className="custom-node">TNode</span>}></Link>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('suffixIcon', () => {
      const { container } = render(<Link suffixIcon={<span className="custom-node">TNode</span>}></Link>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('icon', () => {
      render(<Link prefixIcon={<div></div>} />);
      expect(document.querySelector('.t-link__prefix-icon')).toBeInTheDocument();

      render(<Link suffixIcon={<div></div>} />);
      expect(document.querySelector('.t-link__suffix-icon')).toBeInTheDocument();
    });
  });

  describe('events', () => {
    test('click', () => {
      const fn = vi.fn();
      const { container } = render(<Link onClick={fn}></Link>);
      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].stopPropagation).toBeTruthy();
      expect(fn.mock.calls[0][0].type).toBe('click');
    });
  });

  describe('scenarios', () => {
    test('base', () => {
      const { container } = render(<Link theme="default">查看链接</Link>);
      expect(container.querySelectorAll('.t-link')).toHaveLength(1);
      expect(container.querySelectorAll('.t-link')[0].textContent).toEqual('查看链接');
    });

    test('disabled', () => {
      const fn = vi.fn();
      const { container } = render(<Link data-testid="disabled" disabled={true} onClick={fn} />);
      expect(container.firstChild).toHaveClass('t-is-disabled', '');

      fireEvent.mouseEnter(screen.getByTestId('disabled'));
      expect(screen.getByTestId('disabled')).not.toHaveClass('t-link--hover-underline');

      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalledTimes(0);
    });
  });
});

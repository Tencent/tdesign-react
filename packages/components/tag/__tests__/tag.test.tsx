import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { Tag } from '..';

import type { TdTagProps } from '../type';

describe('Tag', () => {
  describe('props', () => {
    test('closable[undefined]', () => {
      const { container } = render(<Tag></Tag>);
      expect(container.querySelector('.t-tag__icon-close')).toBeFalsy();
    });
    ([false, true] as const).forEach((closable) => {
      test(`closable[${closable}]`, () => {
        const { container } = render(<Tag closable={closable}></Tag>);
        expect(Boolean(container.querySelector('.t-tag__icon-close'))).toBe(closable);
      });
    });

    test('color[string]', () => {
      const { container } = render(<Tag color={'#ff0000'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    test('color[string] variant[dark]', () => {
      const { container } = render(<Tag color={'#ff0000'} variant={'dark'} theme={'primary'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.backgroundColor).toBe('rgb(255, 0, 0)');
      expect(domWrapper.style.color).toBe('white');
    });

    test('color[string] variant[light]', () => {
      const { container } = render(<Tag color={'#ff0000'} variant={'light'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.color).toBe('rgb(255, 0, 0)');
      expect(domWrapper.style.backgroundColor).toBe('rgba(255, 0, 0, 0.1)');
    });

    test('color[string] variant[outline]', () => {
      const { container } = render(<Tag color={'#ff0000'} variant={'outline'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.borderColor).toBe('#ff0000');
      expect(domWrapper.style.color).toBe('rgb(255, 0, 0)');
    });

    test('color[string] variant[light-outline]', () => {
      const { container } = render(<Tag color={'#ff0000'} variant={'light-outline'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.borderColor).toBe('#ff0000');
      expect(domWrapper.style.color).toBe('rgb(255, 0, 0)');
    });

    test('disabled', () => {
      const onClickFn = vi.fn();
      const { container } = render(<Tag disabled={true} closable={true} onClick={onClickFn}></Tag>);
      fireEvent.click(container.firstChild);
      expect(container.querySelector('.t-tag__icon-close')).toBeFalsy();
      expect(onClickFn).not.toHaveBeenCalled();
    });

    test('maxWidth[string]', () => {
      ['150px', '150'].forEach((maxWidth) => {
        const { container } = render(
          <Tag maxWidth={maxWidth} content={'This is a long long long long long tag'}></Tag>,
        );
        const domWrapper = container.querySelector('.t-tag--text') as HTMLElement;
        expect(domWrapper.getAttribute('title')).toBe('This is a long long long long long tag');
        expect(domWrapper.style.maxWidth).toBe('150px');
      });
    });

    const shapeClassNameList = [{ 't-tag--square': false }, 't-tag--round', 't-tag--mark'];
    (['square', 'round', 'mark'] as TdTagProps['shape'][]).forEach((item, index) => {
      test(`shape[${item}]`, () => {
        const { container } = render(<Tag shape={item}></Tag>);
        if (typeof shapeClassNameList[index] === 'string') {
          expect(container.firstChild).toHaveClass(shapeClassNameList[index]);
        } else if (typeof shapeClassNameList[index] === 'object') {
          const classNameKey = Object.keys(shapeClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
      });
    });

    const sizeClassNameList = ['t-size-s', { 't-size-m': false }, 't-size-l'];
    (['small', 'medium', 'large'] as TdTagProps['size'][]).forEach((item, index) => {
      test(`size[${item}]`, () => {
        const { container } = render(<Tag size={item}></Tag>);
        if (typeof sizeClassNameList[index] === 'string') {
          expect(container.firstChild).toHaveClass(sizeClassNameList[index]);
        } else if (typeof sizeClassNameList[index] === 'object') {
          const classNameKey = Object.keys(sizeClassNameList[index])[0];
          expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
        }
      });
    });

    (['default', 'primary', 'warning', 'danger', 'success'] as TdTagProps['theme'][]).forEach((item) => {
      test(`theme[${item}]`, () => {
        const { container } = render(<Tag theme={item}></Tag>);
        expect(container.firstChild).toHaveClass(`t-tag--${item}`);
      });
    });

    test('title[string]', () => {
      [
        { title: 'This is a long tag', expectedTitle: 'This is a long tag' },
        { title: '', expectedTitle: null },
      ].forEach(({ title, expectedTitle }) => {
        const { container } = render(
          <Tag title={title} content={'This is a long long long long long tag'} maxWidth={'150px'}></Tag>,
        );
        const domWrapper = container.querySelector('.t-tag--text') as HTMLElement;
        expect(domWrapper.style.maxWidth).toBe('150px');
        expect(domWrapper.getAttribute('title')).toBe(expectedTitle);
      });
    });

    test('title[undefined]', () => {
      const { container } = render(
        <Tag title={undefined} content={'This is a long long long long long tag'} maxWidth={'150px'}></Tag>,
      );
      expect(container.querySelector('.t-tag--text')).not.toHaveAttribute('title');
    });

    test('title[boolean]', () => {
      [
        {
          title: true,
          expectedTitle: 'This is a long long long long long tag',
        },
        { title: false, expectedTitle: null },
      ].forEach(({ title, expectedTitle }) => {
        const { container } = render(
          <Tag title={title} content={'This is a long long long long long tag'} maxWidth={'150px'}></Tag>,
        );
        expect(container.querySelector('.t-tag--text').getAttribute('title')).toBe(expectedTitle);
      });
    });

    (['dark', 'light', 'outline', 'light-outline'] as TdTagProps['variant'][]).forEach((item) => {
      test(`variant[${item}]`, () => {
        const { container } = render(<Tag variant={item}></Tag>);
        expect(container.firstChild).toHaveClass(`t-tag--${item}`);
      });
    });

    test('content and children', () => {
      const node = <span className="custom-node">TNode</span>;
      const contentWrapper = render(<Tag content={node} />);
      const childrenWrapper = render(<Tag>{node}</Tag>);

      expect(contentWrapper.container.querySelector('.custom-node')).toBeTruthy();
      expect(childrenWrapper.container.querySelector('.custom-node')).toBeTruthy();
    });

    test('icon[TNode]', () => {
      const { container } = render(<Tag icon={<span className="custom-node">TNode</span>}></Tag>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });
  });

  describe('scenarios', () => {
    test('style overrides color', () => {
      const { container } = render(
        <Tag color={'#ff0000'} variant={'light-outline'} style={{ borderColor: '#0052d9' }}></Tag>,
      );
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.borderColor).toBe('#0052d9');
    });
  });

  describe('events', () => {
    test('onClick', () => {
      const fn = vi.fn();
      const { container } = render(<Tag onClick={fn}></Tag>);
      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].e.type).toBe('click');
    });

    test('onClose', () => {
      const onCloseFn = vi.fn();
      const { container } = render(<Tag closable={true} onClose={onCloseFn}></Tag>);
      fireEvent.click(container.querySelector('.t-tag__icon-close'));
      expect(onCloseFn).toHaveBeenCalled();
      expect(onCloseFn.mock.calls[0][0].e.type).toBe('click');
    });
  });
});

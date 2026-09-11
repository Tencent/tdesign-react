import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { Tag } from '..';

import type { TdTagProps } from '../type';

describe('Tag', () => {
  describe('props', () => {
    test('closable', () => {
      // closable default value is false
      const { container } = render(<Tag></Tag>);
      expect(container.querySelector('.t-tag__icon-close')).toBeFalsy();
      // closable = false
      const { container: container1 } = render(<Tag closable={false}></Tag>);
      expect(container1.querySelector('.t-tag__icon-close')).toBeFalsy();
      // closable = true
      const { container: container2 } = render(<Tag closable={true}></Tag>);
      expect(container2.querySelector('.t-tag__icon-close')).toBeTruthy();
    });

    test(`color is equal to #ff0000`, () => {
      const { container } = render(<Tag color={'#ff0000'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.backgroundColor).toBe('rgb(255, 0, 0)');
    });

    test(`color expect variant=dark`, () => {
      const { container } = render(<Tag color={'#ff0000'} variant={'dark'} theme={'primary'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.backgroundColor).toBe('rgb(255, 0, 0)');
      expect(domWrapper.style.color).toBe('white');
    });

    test(`color expect variant=light`, () => {
      const { container } = render(<Tag color={'#ff0000'} variant={'light'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.color).toBe('rgb(255, 0, 0)');
      expect(domWrapper.style.backgroundColor).toBe('rgba(255, 0, 0, 0.1)');
    });

    test(`color expect variant=outline`, () => {
      const { container } = render(<Tag color={'#ff0000'} variant={'outline'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.borderColor).toBe('#ff0000');
      expect(domWrapper.style.color).toBe('rgb(255, 0, 0)');
    });

    test(`color expect variant=light-outline`, () => {
      const { container } = render(<Tag color={'#ff0000'} variant={'light-outline'}></Tag>);
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.borderColor).toBe('#ff0000');
      expect(domWrapper.style.color).toBe('rgb(255, 0, 0)');
    });

    test(`priority of the style is higher than props.color calculation result`, () => {
      const { container } = render(
        <Tag color={'#ff0000'} variant={'light-outline'} style={{ borderColor: '#0052d9' }}></Tag>,
      );
      const domWrapper = container.firstChild as HTMLElement;
      expect(domWrapper.style.borderColor).toBe('#0052d9');
    });

    test('disabled', () => {
      const onClickFn = vi.fn();
      const { container } = render(<Tag disabled={true} closable={true} onClick={onClickFn}></Tag>);
      fireEvent.click(container.firstChild);
      expect(container.querySelector('.t-tag__icon-close')).toBeFalsy();
      expect(onClickFn).not.toHaveBeenCalled();
    });

    test(`maxWidth is equal to 150px`, () => {
      const { container } = render(<Tag maxWidth={'150px'} content={'This is a long long long long long tag'}></Tag>);
      const domWrapper = container.querySelector('.t-tag--text') as HTMLElement;
      expect(domWrapper.getAttribute('title')).toBe('This is a long long long long long tag');
      expect(domWrapper.style.maxWidth).toBe('150px');
    });

    test(`maxWidth is equal to 150`, () => {
      const { container } = render(<Tag maxWidth={'150'} content={'This is a long long long long long tag'}></Tag>);
      const domWrapper = container.querySelector('.t-tag--text') as HTMLElement;
      expect(domWrapper.getAttribute('title')).toBe('This is a long long long long long tag');
      expect(domWrapper.style.maxWidth).toBe('150px');
    });

    const shapeClassNameList = [{ 't-tag--square': false }, 't-tag--round', 't-tag--mark'];
    (['square', 'round', 'mark'] as TdTagProps['shape'][]).forEach((item, index) => {
      test(`shape is equal to ${item}`, () => {
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
      test(`size is equal to ${item}`, () => {
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
      test(`theme is equal to ${item}`, () => {
        const { container } = render(<Tag theme={item}></Tag>);
        expect(container.firstChild).toHaveClass(`t-tag--${item}`);
      });
    });

    test(`title is equal to This is a long tag`, () => {
      const { container } = render(
        <Tag title={'This is a long tag'} content={'This is a long long long long long tag'} maxWidth={'150px'}></Tag>,
      );
      const domWrapper = container.querySelector('.t-tag--text') as HTMLElement;
      expect(domWrapper.style.maxWidth).toBe('150px');
      expect(domWrapper.getAttribute('title')).toBe('This is a long tag');
    });

    test(`title is equal to `, () => {
      const { container } = render(
        <Tag title={''} content={'This is a long long long long long tag'} maxWidth={'150px'}></Tag>,
      );
      const domWrapper = container.querySelector('.t-tag--text') as HTMLElement;
      expect(domWrapper.style.maxWidth).toBe('150px');
      expect(domWrapper.getAttribute('title')).toBeNull();
    });

    test(`title is equal to undefined`, () => {
      const { container } = render(
        <Tag title={undefined} content={'This is a long long long long long tag'} maxWidth={'150px'}></Tag>,
      );
      const domWrapper = container.querySelector('.t-tag--text') as HTMLElement;
      expect(domWrapper.style.maxWidth).toBe('150px');
      expect(domWrapper.getAttribute('title')).toBeNull();
    });

    test(`title is equal to true`, () => {
      const { container } = render(
        <Tag title={true} content={'This is a long long long long long tag'} maxWidth={'150px'}></Tag>,
      );
      const domWrapper = container.querySelector('.t-tag--text') as HTMLElement;
      expect(domWrapper.style.maxWidth).toBe('150px');
      expect(domWrapper.getAttribute('title')).toBe('This is a long long long long long tag');
    });

    test(`title is equal to false`, () => {
      const { container } = render(
        <Tag title={false} content={'This is a long long long long long tag'} maxWidth={'150px'}></Tag>,
      );
      const domWrapper = container.querySelector('.t-tag--text') as HTMLElement;
      expect(domWrapper.style.maxWidth).toBe('150px');
      expect(domWrapper.getAttribute('title')).toBeNull();
    });

    (['dark', 'light', 'outline', 'light-outline'] as TdTagProps['variant'][]).forEach((item) => {
      test(`variant is equal to ${item}`, () => {
        const { container } = render(<Tag variant={item}></Tag>);
        expect(container.firstChild).toHaveClass(`t-tag--${item}`);
      });
    });
  });

  describe('slots', () => {
    test('children', () => {
      const { container } = render(
        <Tag>
          <span className="custom-node">TNode</span>
        </Tag>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('content', () => {
      const { container } = render(<Tag content={<span className="custom-node">TNode</span>}></Tag>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('icon', () => {
      const { container } = render(<Tag icon={<span className="custom-node">TNode</span>}></Tag>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });
  });

  describe('events', () => {
    test('click', () => {
      const fn = vi.fn();
      const { container } = render(<Tag onClick={fn}></Tag>);
      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].e.type).toBe('click');
    });

    test('close', () => {
      const onCloseFn = vi.fn();
      const { container } = render(<Tag closable={true} onClose={onCloseFn}></Tag>);
      fireEvent.click(container.querySelector('.t-tag__icon-close'));
      expect(onCloseFn).toHaveBeenCalled();
      expect(onCloseFn.mock.calls[0][0].e.type).toBe('click');
    });
  });
});

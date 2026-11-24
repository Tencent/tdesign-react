import { describe, expect, test, vi } from '@test/utils';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Stepper } from '../index';

const prefix = 't';
const baseClass = `.${prefix}-stepper`;

describe('stepper', () => {
  describe('props', () => {
    test(': className', async () => {
      const { container } = render(<Stepper className="t-custom-stepper"></Stepper>);
      expect(container.querySelector('.t-custom-stepper')).toBeTruthy();
    });

    test(':style', async () => {
      const { container } = render(<Stepper style={{ color: 'red' }}></Stepper>);
      expect(container.querySelector(baseClass).getAttribute('style')).toContain('color: red;');
    });

    test(': disableInput', () => {
      const { container } = render(<Stepper disableInput></Stepper>);
      const $stepperItem = container.querySelector('.t-stepper__input') as HTMLElement;
      expect($stepperItem.classList.contains(`${baseClass}--disabled`));
    });

    test(': disabled', () => {
      const { container } = render(<Stepper disabled></Stepper>);
      const $stepperItem = container.querySelector('.t-stepper__input') as HTMLElement;
      expect($stepperItem.classList.contains(`${baseClass}--disabled`));
    });

    test(': inputWidth', () => {
      const { container } = render(<Stepper inputWidth={100}></Stepper>);
      const $stepperItem = container.querySelector('.t-stepper__input') as HTMLElement;
      expect($stepperItem.style.width).toBe('100px');
    });

    test(': integer', () => {
      const { container } = render(<Stepper integer={false} value={0.5}></Stepper>);
      const $stepperItem = container.querySelector('.t-stepper__input') as HTMLElement;
      expect($stepperItem.getAttribute('value')).toBe('0.5');
    });

    test(': max', () => {
      const { container } = render(<Stepper max={10} value={10}></Stepper>);
      const $stepperItem = container.querySelector('.t-stepper__plus') as HTMLElement;
      expect($stepperItem.classList.contains(`${baseClass}--filled-disabled`));
    });

    test(': min', () => {
      const { container } = render(<Stepper min={1} value={1}></Stepper>);
      const $stepperItem = container.querySelector(`${baseClass}__minus`) as HTMLElement;
      expect($stepperItem.classList.contains(`${baseClass}--filled-disabled`));
    });

    test(': size', () => {
      const size = ['small', 'medium', 'large'] as ('small' | 'medium' | 'large')[];
      size.forEach((s) => {
        const { container } = render(<Stepper size={s}></Stepper>);
        const $stepperItem = container.querySelector(`${baseClass}`) as HTMLElement;
        expect($stepperItem.classList.contains(`${baseClass}--${s}`));
      });
    });

    test(': step', () => {
      const { container } = render(<Stepper theme="filled" defaultValue={0.5} integer={false} step={0.5}></Stepper>);
      const $stepperPlus = container.querySelector('.t-stepper__plus') as HTMLElement;
      const $stepperItem = container.querySelector('.t-stepper__input') as HTMLElement;
      fireEvent.click($stepperPlus);
      expect($stepperItem.getAttribute('value')).toBe('1.0');
    });

    test(': theme', () => {
      const theme = ['normal', 'filled', 'outline'] as ('normal' | 'filled' | 'outline')[];
      theme.forEach((t) => {
        const { container } = render(<Stepper theme={t}></Stepper>);
        const $stepperItem = container.querySelector(`${baseClass}`) as HTMLElement;
        expect($stepperItem.classList.contains(`${baseClass}--${t}`));
      });
    });

    test(': value', () => {
      const { container } = render(<Stepper value={10}></Stepper>);
      const $stepperItem = container.querySelector(`${baseClass}__input`) as HTMLElement;
      expect($stepperItem.getAttribute('value')).toBe('10');
    });

    test(': defaultValue', () => {
      const { container } = render(<Stepper defaultValue={10}></Stepper>);
      const $stepperItem = container.querySelector(`${baseClass}__input`) as HTMLElement;
      expect($stepperItem.getAttribute('value')).toBe('10');
    });
  });

  describe('event', () => {
    test(': blur', async () => {
      const onChange = vi.fn();
      const onBlur = vi.fn();
      const { container } = render(<Stepper defaultValue={99} onBlur={onBlur} onChange={onChange} />);
      const $input = container.querySelector(`${baseClass}__input`) as HTMLElement;
      fireEvent.blur($input);
      expect(onBlur).toHaveBeenCalled();
    });

    test(': change minus', async () => {
      const onChange = vi.fn();
      const { container } = render(<Stepper defaultValue={99} onChange={onChange} />);
      const $minusBtn = container.querySelector(`${baseClass}__minus`) as HTMLElement;
      fireEvent.click($minusBtn);
      expect(onChange).toHaveBeenCalled();
    });

    test(': change input valid', async () => {
      const onChange = vi.fn();
      render(<Stepper defaultValue={10} onChange={onChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: '20' } });
      expect(onChange).toHaveBeenCalled();
    });

    test(': change input invalid', async () => {
      const onChange = vi.fn();
      render(<Stepper defaultValue={10} onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'not number' } });
      expect(onChange).not.toHaveBeenCalled();
    });

    test(': change blur valid', async () => {
      const onChange = vi.fn();
      render(<Stepper defaultValue={10} onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input, { target: { value: '20' } });
      expect(onChange).toHaveBeenCalled();
    });

    test(': change blur invalid', async () => {
      const onChange = vi.fn();
      render(<Stepper defaultValue={10} onChange={onChange} />);
      const input = screen.getByRole('textbox');
      fireEvent.blur(input, { target: { value: 'not number' } });
      expect(onChange).not.toHaveBeenCalled();
    });

    test(': overlimit plus', async () => {
      const onOverlimit = vi.fn();
      const { container } = render(<Stepper defaultValue={10} max={10} onOverlimit={onOverlimit} />);
      const $plusBtn = container.querySelector(`${baseClass}__plus`) as HTMLElement;
      fireEvent.click($plusBtn);
      expect(onOverlimit).toHaveBeenCalledWith('plus');
    });

    test(': overlimit minus', async () => {
      const onOverlimit = vi.fn();
      const { container } = render(<Stepper defaultValue={10} min={10} onOverlimit={onOverlimit} />);
      const $plusBtn = container.querySelector(`${baseClass}__minus`) as HTMLElement;
      fireEvent.click($plusBtn);
      expect(onOverlimit).toHaveBeenCalledWith('minus');
    });

    test(': overlimit disabled', async () => {
      const onOverlimit = vi.fn();
      const { container } = render(<Stepper defaultValue={10} disabled onOverlimit={onOverlimit} />);
      const $plusBtn = container.querySelector(`${baseClass}__plus`) as HTMLElement;
      fireEvent.click($plusBtn);
      expect(onOverlimit).toHaveBeenCalledWith('plus');
    });

    test(': focus', async () => {
      const onFocus = vi.fn();
      const { container } = render(<Stepper defaultValue={10} max={10} onFocus={onFocus} />);
      const $input = container.querySelector(`${baseClass}__input`) as HTMLElement;
      fireEvent.focus($input);
      expect(onFocus).toHaveBeenCalled();
    });
  });
});

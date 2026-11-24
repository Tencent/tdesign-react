import React from 'react';
import { describe, expect, vi, it } from '@test/utils';
import { render, fireEvent, screen } from '@testing-library/react';
import Textarea from '../index';

const prefix = 't';
const name = `.${prefix}-textarea`;

describe('Textarea', () => {
  describe('props', () => {
    it(': allowInputOverMax', () => {
      const onCompositionstart = vi.fn();
      const onCompositionend = vi.fn();
      const { rerender } = render(
        <Textarea
          allowInputOverMax={false}
          maxcharacter={4}
          onCompositionstart={onCompositionstart}
          onCompositionend={onCompositionend}
        />,
      );
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: '测试文字' } });
      expect(screen.getByRole('textbox')).toHaveValue('测试');

      fireEvent.compositionStart(textarea);
      fireEvent.compositionEnd(textarea, { data: '测试文字' });
      expect(onCompositionend).toHaveBeenCalled();

      const onChange = vi.fn();
      rerender(<Textarea allowInputOverMax maxLength={4} onChange={onChange} />);
      fireEvent.change(textarea, { target: { value: 'textarea' } });
      expect(screen.getByRole('textbox')).toHaveValue('textarea');
    });

    it(': value', () => {
      render(<Textarea value="textarea" />);
      expect(screen.getByRole('textbox')).toHaveValue('textarea');
    });

    it(': label', () => {
      const { container } = render(<Textarea label="标签文字" />);
      expect(container.querySelector(`${name}__label`)).toBeTruthy();
    });

    it(': disabled', () => {
      const onFocus = vi.fn();
      const { container } = render(<Textarea disabled onFocus={onFocus} />);
      expect(container.querySelector(`${name}--disabled`)).toBeTruthy();

      const textarea = screen.getByRole('textbox');
      fireEvent.focus(textarea);
      expect(onFocus).not.toHaveBeenCalled();
    });

    it(': layout', () => {
      const { container, rerender } = render(<Textarea layout="vertical" />);
      expect(container.querySelector(`${name}--layout-vertical`)).toBeTruthy();

      rerender(<Textarea layout="horizontal" />);
      expect(container.querySelector(`${name}--layout-horizontal`)).toBeTruthy();
    });

    it(': indicator & (maxlength | maxcharacter)', () => {
      const { container, rerender } = render(<Textarea indicator maxlength={500} />);
      expect(container.querySelector(`${name}__indicator`)).toBeTruthy();
      expect(screen.getByText('0/500')).toBeInTheDocument();

      rerender(<Textarea indicator maxcharacter={500} />);
      expect(screen.getByText('0/500')).toBeInTheDocument();
    });

    it(': autosize', () => {
      const { rerender } = render(<Textarea autosize={false} rows={4} />);
      expect(screen.getByRole('textbox').style.height).not.toBe('');

      rerender(<Textarea autosize />);
      expect(screen.getByRole('textbox').style.height).not.toBe('');

      rerender(<Textarea autosize={{ minRows: 2, maxRows: 4 }} />);
      expect(screen.getByRole('textbox').style.minHeight).not.toBe('');
      expect(screen.getByRole('textbox').style.height).not.toBe('');
    });
  });

  describe('events', () => {
    it(': onBlur', () => {
      const onBlur = vi.fn();
      render(<Textarea onBlur={onBlur} />);
      const textarea = screen.getByRole('textbox');
      fireEvent.blur(textarea);
      expect(onBlur).toHaveBeenCalled();
    });

    it(': onFocus', () => {
      const onFocus = vi.fn();
      render(<Textarea onFocus={onFocus} />);
      const textarea = screen.getByRole('textbox');
      fireEvent.focus(textarea);
      expect(onFocus).toHaveBeenCalled();
    });

    it(': onChange', () => {
      const onChange = vi.fn();
      render(<Textarea onChange={onChange} />);
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'textarea' } });
      expect(onChange).toHaveBeenCalled();
    });

    it(': onCompositionstart', () => {
      const onCompositionstart = vi.fn();
      render(<Textarea onCompositionstart={onCompositionstart} />);
      const textarea = screen.getByRole('textbox');
      fireEvent.compositionStart(textarea);
      expect(onCompositionstart).toHaveBeenCalled();
    });

    it(': onCompositionend', () => {
      const onCompositionend = vi.fn();
      render(<Textarea onCompositionend={onCompositionend} />);
      const textarea = screen.getByRole('textbox');
      fireEvent.compositionEnd(textarea);
      expect(onCompositionend).toHaveBeenCalled();
    });
  });
});

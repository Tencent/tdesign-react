import { describe, vi, it, expect } from '@test/utils';
import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { AppIcon } from 'tdesign-icons-react';
import { Tag, TagCheck } from '../index';

const prefix = 't';
const baseClass = `.${prefix}-tag`;

describe('tag', () => {
  describe('props', () => {
    it(': content', () => {
      const { container } = render(<Tag content="tag" />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.textContent).toBe('tag');
    });

    it(': children', () => {
      const { container } = render(<Tag>tag</Tag>);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.textContent).toBe('tag');
    });

    it(': shape', () => {
      const shape = ['square', 'round', 'mark'] as ('square' | 'round' | 'mark')[];
      shape.forEach((s) => {
        const { container } = render(<Tag shape={s} />);
        const $tagItem = container.querySelector(baseClass) as HTMLElement;
        if (s === 'mark') {
          expect($tagItem.classList.contains(`${baseClass}__${s}`));
        } else if (s === 'round') {
          expect($tagItem.classList.contains(`${baseClass}__${s}`));
        } else if (s === 'square') {
          expect($tagItem.classList.contains(`${baseClass}__${s}`));
        }
      });
    });

    it(': theme', () => {
      const theme = ['default', 'primary', 'warning', 'danger', 'success'] as (
        | 'default'
        | 'primary'
        | 'warning'
        | 'danger'
        | 'success'
      )[];
      theme.forEach((t) => {
        const { container } = render(<Tag theme={t} />);
        const $tagItem = container.querySelector(baseClass) as HTMLElement;
        expect($tagItem.classList.contains(`${baseClass}--${t}`));
      });
    });

    it(': variant', () => {
      const variant = ['light', 'dark'] as ('light' | 'dark')[];
      variant.forEach((v) => {
        const { container } = render(<Tag variant={v} />);
        const $tagItem = container.querySelector(baseClass) as HTMLElement;
        expect($tagItem.classList.contains(`${baseClass}--${v}`));
      });
    });

    it(': size', () => {
      const size = ['small', 'medium', 'large', 'extra-large'] as ('small' | 'medium' | 'large' | 'extra-large')[];
      size.forEach((s) => {
        const { container } = render(<Tag size={s} />);
        const $tagItem = container.querySelector(baseClass) as HTMLElement;
        if (s === 'small') {
          expect($tagItem.classList.contains(`${baseClass}--${s}`));
        } else if (s === 'medium') {
          expect($tagItem.classList.contains(`${baseClass}--${s}`));
        } else if (s === 'large') {
          expect($tagItem.classList.contains(`${baseClass}--${s}`));
        } else if (s === 'extra-large') {
          expect($tagItem.classList.contains(`${baseClass}--${s}`));
        }
      });
    });

    it(': closable', () => {
      const { container } = render(<Tag closable />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.classList.contains(`${baseClass}__icon-close`));
    });

    it(': disabled', () => {
      const { container } = render(<Tag disabled />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.classList.contains(`${baseClass}--disabled`));
    });

    it(': icon', () => {
      const { container } = render(<Tag icon={<AppIcon />} />);
      const $icon = container.querySelector(`${baseClass}__icon`) as HTMLElement;
      expect($icon).toBeTruthy();
    });

    it(': maxWidth', () => {
      const { container } = render(<Tag maxWidth={100} />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.style.maxWidth).toBe('100px');
    });

    it(': defaultChecked', () => {
      const { container } = render(<TagCheck defaultChecked />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.classList.contains(`${baseClass}--checked`));
    });
  });

  describe('event', () => {
    it(': click', async () => {
      const handleClick = vi.fn();
      const { container } = render(<Tag onClick={handleClick} />);
      const tag = container.querySelector(`${baseClass}`);
      fireEvent.click(tag);
      expect(handleClick).toHaveBeenCalled();
    });

    it(': click disabled', async () => {
      const handleClick = vi.fn();
      const { container } = render(<Tag onClick={handleClick} disabled />);
      const tag = container.querySelector(`${baseClass}`);
      fireEvent.click(tag);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it(': close', async () => {
      const handleClose = vi.fn();
      const { container } = render(<Tag onClose={handleClose} closable />);
      const closeBtn = container.querySelector(`${baseClass}__icon-close`);
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalled();
    });

    it(': close disabled', async () => {
      const handleClose = vi.fn();
      const { container } = render(<Tag onClose={handleClose} disabled closable />);
      const closeBtn = container.querySelector(`${baseClass}__icon-close`);
      fireEvent.click(closeBtn);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });
});

describe('TagCheck', () => {
  describe('props', () => {
    it(': content', () => {
      const { container } = render(<TagCheck content="tag" />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.textContent).toBe('tag');
    });

    it(': children', () => {
      const { container } = render(<TagCheck>tag</TagCheck>);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.textContent).toBe('tag');
    });

    it(': checked', () => {
      const { container, rerender } = render(<TagCheck defaultChecked content={['已选中态', '未选中态']}></TagCheck>);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.classList.contains(`${baseClass}--checked`));

      rerender(<TagCheck checked={false} content={['已选中态', '未选中态']}></TagCheck>);
      expect(container.querySelector(`${baseClass}__text`).innerHTML).toBe('未选中态');
    });

    it(': closable', () => {
      const { container } = render(<TagCheck closable />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.classList.contains(`${baseClass}__icon-close`));
    });

    it(': disabled', () => {
      const { container } = render(<TagCheck disabled />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.classList.contains(`${baseClass}--disabled`));
    });

    it(': icon', () => {
      const { container } = render(<TagCheck icon={<AppIcon />} />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.classList.contains(`${baseClass}__icon-check`));
    });

    it(' defaultChecked', () => {
      const { container } = render(<TagCheck defaultChecked />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      expect($tagItem.classList.contains(`${baseClass}--checked`));
    });

    it(': shape', () => {
      const shape = ['square', 'round', 'mark'] as ('square' | 'round' | 'mark')[];
      shape.forEach((item) => {
        const { container } = render(<TagCheck shape={item} />);
        const $tagItem = container.querySelector(baseClass) as HTMLElement;
        if (item === 'square') {
          expect($tagItem.classList.contains(`${baseClass}--square`));
        } else if (item === 'round') {
          expect($tagItem.classList.contains(`${baseClass}--round`));
        } else if (item === 'mark') {
          expect($tagItem.classList.contains(`${baseClass}--mark`));
        }
      });
    });

    it(': size', () => {
      const size = ['small', 'medium', 'large'] as ('small' | 'medium' | 'large')[];
      size.forEach((item) => {
        const { container } = render(<TagCheck size={item} />);
        const $tagItem = container.querySelector(baseClass) as HTMLElement;
        if (item === 'small') {
          expect($tagItem.classList.contains(`${baseClass}--small`));
        } else if (item === 'medium') {
          expect($tagItem.classList.contains(`${baseClass}--medium`));
        }
      });
    });

    it(': variant', () => {
      const variants = ['dark', 'light', 'outline', 'light-outline'] as (
        | 'dark'
        | 'light'
        | 'outline'
        | 'light-outline'
      )[];
      variants.forEach((item) => {
        const { container } = render(<TagCheck variant={item} />);
        const $tagItem = container.querySelector(baseClass) as HTMLElement;
        if (item === 'dark') {
          expect($tagItem.classList.contains(`${baseClass}--dark`));
        } else if (item === 'light') {
          expect($tagItem.classList.contains(`${baseClass}--light`));
        } else if (item === 'outline') {
          expect($tagItem.classList.contains(`${baseClass}--outline`));
        } else if (item === 'light-outline') {
          expect($tagItem.classList.contains(`${baseClass}--light-outline`));
        }
      });
    });
  });

  describe('event', () => {
    it(': click', () => {
      const handleClick = vi.fn();
      const { container } = render(<TagCheck onClick={handleClick} />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      fireEvent.click($tagItem);
      expect(handleClick).toHaveBeenCalled();
    });

    it(': click disabled', () => {
      const handleClick = vi.fn();
      const { container } = render(<TagCheck onClick={handleClick} disabled />);
      const $tagItem = container.querySelector(baseClass) as HTMLElement;
      fireEvent.click($tagItem);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it(': close', () => {
      const handleClose = vi.fn();
      const { container } = render(<TagCheck onClose={handleClose} closable />);
      const closeBtn = container.querySelector(`${baseClass}__icon-close`);
      fireEvent.click(closeBtn);
      expect(handleClose).toHaveBeenCalled();
    });

    it(': close disabled', () => {
      const handleClose = vi.fn();
      const { container } = render(<TagCheck onClose={handleClose} closable disabled />);
      const closeBtn = container.querySelector(`${baseClass}__icon-close`);
      fireEvent.click(closeBtn);
      expect(handleClose).not.toHaveBeenCalled();
    });
  });
});

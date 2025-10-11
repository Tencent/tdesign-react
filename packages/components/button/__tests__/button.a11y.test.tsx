import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import { axe } from 'jest-axe';
import { Button } from '..';

describe('Button Accessibility', () => {
  it('renders a basic button without any accessibility violations (WCAG 2.1: All relevant rules)', async () => {
    const { container } = render(<Button>Submit</Button>);
    const results = await axe(container);
    expect(results.violations.length).toBe(0);
  });

  it('hides decorative icons from screen readers (WCAG 2.1: 1.3.1 Info and Relationships)', () => {
    const { container } = render(<Button icon={<svg />} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('adds aria-label when button has no visible text (WCAG 2.1: 4.1.2 Name, Role, Value)', () => {
    const { container } = render(<Button icon={<svg />} />);
    expect(container.firstChild).toHaveAttribute('aria-label', 'button');
  });

  it('uses visible text as accessible name when present (WCAG 2.1: 4.1.2 Name, Role, Value)', () => {
    const { container } = render(<Button>Submit</Button>);
    const el = container.querySelector('button');
    expect(el).not.toHaveAttribute('aria-label');
    expect(el?.textContent).toBe('Submit');
  });

  it('assigns role="button" when a div is used (WCAG 2.1: 4.1.2 Name, Role, Value)', () => {
    const { container } = render(<Button tag="div">Click</Button>);
    const el = container.querySelector('div');
    expect(el).toHaveAttribute('role', 'button');
  });

  it('renders div role button when disabled and no tag specified (WCAG 2.1: 4.1.2 Name, Role, Value)', () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const el = container.querySelector('div');
    expect(el).toBeTruthy();
    expect(el).toHaveAttribute('role', 'button');
    expect(el).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders anchor with href when not disabled and href provided (WCAG 2.1: 4.1.2 Name, Role, Value)', () => {
    const { container } = render(
      <Button href="https://tdesign.tencent.com/" theme="primary" variant="base">
        Visit
      </Button>,
    );
    const anchor = container.querySelector('a');
    expect(anchor).toBeTruthy();
    expect(anchor).toHaveAttribute('href', 'https://tdesign.tencent.com/');
    expect(anchor).not.toHaveAttribute('role');
    expect(anchor).not.toHaveAttribute('aria-disabled');
  });

  it('applies aria-busy when loading (WCAG 2.1: 4.1.3 Status Messages)', () => {
    const { container } = render(<Button loading>Loading</Button>);
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
  });

  it('applies aria-disabled on div buttons when disabled (WCAG 2.1: 4.1.2 Name, Role, Value)', () => {
    const { container } = render(<Button tag="div" disabled />);
    const el = container.querySelector('div');
    expect(el).toHaveAttribute('aria-disabled', 'true');
  });

  it('sets disabled attribute on button elements when disabled or loading (WCAG 2.1: 4.1.2 Name, Role, Value)', () => {
    const { container: c1 } = render(
      <Button tag="button" disabled>
        Disabled
      </Button>,
    );
    expect(c1.querySelector('button')).toHaveAttribute('disabled');

    const { container: c2 } = render(
      <Button tag="button" loading>
        Loading
      </Button>,
    );
    expect(c2.querySelector('button')).toHaveAttribute('disabled');
  });

  it('suppresses click when disabled or loading (WCAG 2.1: 2.1.1 Keyboard)', () => {
    const fn1 = vi.fn();
    const { container: c1 } = render(
      <Button onClick={fn1} disabled>
        Disabled
      </Button>,
    );
    fireEvent.click(c1.firstChild as Element);
    expect(fn1).not.toHaveBeenCalled();

    const fn2 = vi.fn();
    const { container: c2 } = render(
      <Button onClick={fn2} loading>
        Loading
      </Button>,
    );
    fireEvent.click(c2.firstChild as Element);
    expect(fn2).not.toHaveBeenCalled();
  });

  it('div role button should be keyboard operable (Enter triggers click) (WCAG 2.1: 2.1.1 Keyboard)', () => {
    const fn = vi.fn();
    const { container } = render(
      <Button tag="div" onClick={fn}>
        Keyboard Trigger
      </Button>,
    );
    const el = container.querySelector('div') as HTMLElement;
    fireEvent.keyDown(el, { key: 'Enter', code: 'Enter', charCode: 13 });
    expect(fn).toHaveBeenCalled();
  });

  it('div role button should be focusable via keyboard (WCAG 2.1: 2.1.1 Keyboard)', () => {
    const { container } = render(<Button tag="div">Focusable</Button>);
    const el = container.querySelector('div') as HTMLElement;
    el.focus();
    expect(document.activeElement).toBe(el);
  });
});

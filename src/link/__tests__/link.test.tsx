import React, { FunctionComponent, ComponentClass } from 'react';
import { render, screen, fireEvent, vi } from '@test/utils';
import Link from '../Link';

export interface TestExampleOverrides {
  [exampleFileName: string]: (Component: FunctionComponent<unknown> | ComponentClass<unknown>) => void | Promise<void>;
}

describe('Link', () => {
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
    expect(fn).toBeCalledTimes(0);
  });

  test('underline', () => {
    const { container } = render(<Link underline={true} />);
    expect(container.firstChild).toHaveClass('t-is-underline');
  });

  test('hover', () => {
    const { container } = render(<Link hover="color" />);
    expect(container.firstChild).toHaveClass('t-link--hover-color');
  });

  test('icon', () => {
    render(<Link prefixIcon={<div></div>} />);
    expect(document.querySelector('.t-link__prefix-icon')).toBeInTheDocument();

    render(<Link suffixIcon={<div></div>} />);
    expect(document.querySelector('.t-link__suffix-icon')).toBeInTheDocument();
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

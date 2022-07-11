import React from 'react';
import { testExamples, render, fireEvent } from '@test/utils';
import { Icon } from 'tdesign-icons-react';
import Button from '../Button';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Button 组件测试', () => {
  const ButtonText = '按钮组件';
  test('create', async () => {
    const clickFn = jest.fn();
    const { container, queryByText } = render(<Button onClick={clickFn}>{ButtonText}</Button>);
    expect(container.firstChild.classList.contains('t-button--variant-base')).toBeTruthy();
    expect(queryByText(ButtonText)).toBeInTheDocument();
    fireEvent.click(container.firstChild);
    expect(clickFn).toBeCalledTimes(1);
  });
  test('content', async () => {
    const { queryByText } = render(<Button content={ButtonText} />);
    expect(queryByText(ButtonText)).toBeInTheDocument();
  });
  test('children & content', async () => {
    const { queryByText } = render(<Button content={ButtonText}>foo</Button>);
    expect(queryByText('按钮组件')).toBeInTheDocument();
  });
  test('theme', async () => {
    const { container } = render(<Button theme="success" />);
    expect(container.firstChild.classList.contains('t-button--theme-success')).toBeTruthy();
  });
  test('variant', async () => {
    const { container } = render(<Button variant="outline" />);
    expect(container.firstChild.classList.contains('t-button--variant-outline')).toBeTruthy();
  });
  test('loading', async () => {
    const clickFn = jest.fn();
    const { container } = render(<Button loading onClick={clickFn} />);
    expect(container.firstChild.classList.contains('t-is-loading')).toBeTruthy();

    fireEvent.click(container.firstChild);
    expect(clickFn).toBeCalledTimes(0);
  });
  test('icon', async () => {
    const { asFragment } = render(<Button icon={<Icon name="loading" />} />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('ghost', async () => {
    const { container } = render(<Button ghost />);
    expect(container.firstChild.classList.contains('t-button--ghost')).toBeTruthy();
  });
  test('size', async () => {
    const { container } = render(<Button size="small" />);
    expect(container.firstChild.classList.contains('t-size-s')).toBeTruthy();
  });
  test('shape', async () => {
    const { container } = render(<Button shape="square" />);
    expect(container.firstChild.classList.contains('t-button--shape-square')).toBeTruthy();
  });
  test('disabled', async () => {
    const clickFn = jest.fn();
    const { container } = render(<Button disabled onClick={clickFn} />);
    expect(container.firstChild).toBeDisabled();
    fireEvent.click(container.firstChild);
    expect(clickFn).toBeCalledTimes(0);
  });
  test('type', async () => {
    const { container } = render(<Button type="submit" />);
    expect(container.firstChild.type).toBe('submit');
  });
  test('block', async () => {
    const { container } = render(<Button block />);
    expect(container.firstChild.classList.contains('t-size-full-width')).toBeTruthy();
  });
});

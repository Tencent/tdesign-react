import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import userEvent from '@testing-library/user-event';
import InputNumber from '../index';

describe('InputNumber 组件测试', () => {
  const InputNumberPlaceholder = '请输入内容';
  const InputNumberValue = 9;

  test('input number change', async () => {
    const changeFn = vi.fn();
    const { container, queryByPlaceholderText } = render(
      <InputNumber placeholder={InputNumberPlaceholder} onChange={changeFn} />,
    );
    expect(container.firstChild.classList.contains('t-input-number')).toBeTruthy();
    expect(queryByPlaceholderText(InputNumberPlaceholder)).toBeInTheDocument();
    fireEvent.change(queryByPlaceholderText(InputNumberPlaceholder), { target: { value: InputNumberValue } });
    expect(changeFn).toBeCalledTimes(1);
    expect(changeFn.mock.calls[0][0]).toBe(InputNumberValue);
  });

  test('input number theme column', async () => {
    const { queryByPlaceholderText, container } = render(
      <InputNumber placeholder={InputNumberPlaceholder} theme="column" defaultValue={5} />,
    );

    fireEvent.mouseEnter(container.firstChild);
    fireEvent.click(container.querySelector('.t-input-number__increase'));
    expect(queryByPlaceholderText(InputNumberPlaceholder).value).toEqual('6');
  });

  test('blur', async () => {
    const blurFn = vi.fn();
    const { queryByPlaceholderText } = render(<InputNumber placeholder={InputNumberPlaceholder} onBlur={blurFn} />);
    const InputDom = queryByPlaceholderText(InputNumberPlaceholder);
    fireEvent.change(InputDom, { target: { value: 1 } });
    fireEvent.blur(InputDom);
    expect(blurFn).toBeCalledTimes(1);
  });

  test('keyDown', async () => {
    const user = userEvent.setup();
    const onEnterFn = vi.fn();
    const onKeydownFn = vi.fn();
    const { queryByPlaceholderText } = render(
      <InputNumber placeholder={InputNumberPlaceholder} onEnter={onEnterFn} onKeydown={onKeydownFn} />,
    );
    const InputNumberDom = queryByPlaceholderText(InputNumberPlaceholder);
    await user.type(InputNumberDom, '123{enter}');

    expect(onEnterFn).toBeCalled();
    expect(onKeydownFn).toBeCalled();
  });

  test('disabled', async () => {
    const changeFn = vi.fn();
    const { queryByPlaceholderText } = render(
      <InputNumber placeholder={InputNumberPlaceholder} disabled onChange={changeFn} />,
    );
    expect(queryByPlaceholderText(InputNumberPlaceholder).disabled).toBeTruthy();
  });

  test('size', async () => {
    const { container } = render(<InputNumber placeholder={InputNumberPlaceholder} size="large" />);
    expect(container.firstChild.classList.contains('t-size-l')).toBeTruthy();
  });
});

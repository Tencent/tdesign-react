import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import userEvent from '@testing-library/user-event';
import Input from '../Input';

describe('Input 组件测试', () => {
  const InputPlaceholder = '请输入内容';
  const InputValue = '24/05/2020';
  test('create', async () => {
    const changeFn = vi.fn();
    const { container, queryByPlaceholderText } = render(<Input placeholder={InputPlaceholder} onChange={changeFn} />);
    expect(container.firstChild.firstChild.classList.contains('t-input')).toBeTruthy();
    expect(queryByPlaceholderText(InputPlaceholder)).toBeInTheDocument();
    fireEvent.change(queryByPlaceholderText(InputPlaceholder), { target: { value: InputValue } });
    expect(changeFn).toBeCalledTimes(1);
    expect(changeFn.mock.calls[0][0]).toBe(InputValue);
  });
  test('clearable', async () => {
    const clearFn = vi.fn();
    const { queryByPlaceholderText, container } = render(
      <Input placeholder={InputPlaceholder} clearable onClear={clearFn} />,
    );
    fireEvent.change(queryByPlaceholderText(InputPlaceholder), { target: { value: InputValue } });
    expect(queryByPlaceholderText(InputPlaceholder).value).toEqual(InputValue);
    fireEvent.mouseEnter(container.firstChild.firstChild);
    fireEvent.click(container.querySelector('.t-input__suffix-clear'));
    expect(queryByPlaceholderText(InputPlaceholder).value).toEqual('');
  });
  test('clearable can not work when mouseLeave', async () => {
    const { queryByPlaceholderText, container } = render(<Input placeholder={InputPlaceholder} clearable />);
    fireEvent.change(queryByPlaceholderText(InputPlaceholder), { target: { value: InputValue } });
    fireEvent.mouseEnter(container.firstChild.firstChild);
    expect(container.querySelector('.t-input__suffix-clear')).toBeInTheDocument();
    fireEvent.mouseLeave(container.firstChild.firstChild);
    expect(container.querySelector('.t-input__suffix-clear')).not.toBeInTheDocument();
  });
  test('should not lost focus when clear input', async () => {
    const blurFn = vi.fn();
    const { queryByPlaceholderText, container } = render(
      <Input placeholder={InputPlaceholder} clearable onBlur={blurFn} />,
    );
    const InputDom = queryByPlaceholderText(InputPlaceholder);
    fireEvent.change(InputDom, { target: { value: InputValue } });
    fireEvent.mouseEnter(container.firstChild.firstChild);
    const clearIcon = container.querySelector('.t-input__suffix-clear');
    fireEvent.mouseDown(clearIcon);
    fireEvent.mouseUp(clearIcon);
    fireEvent.click(clearIcon);
    expect(blurFn).toBeCalledTimes(0);
    fireEvent.blur(InputDom);
    expect(blurFn).toBeCalledTimes(1);
  });
  test('onComposition can be call', async () => {
    const user = userEvent.setup();
    const onCompositionStartFn = vi.fn();
    const onCompositionEndFn = vi.fn();
    const { queryByPlaceholderText } = render(
      <Input
        placeholder={InputPlaceholder}
        onCompositionstart={onCompositionStartFn}
        onCompositionend={onCompositionEndFn}
      />,
    );
    const InputDom = queryByPlaceholderText(InputPlaceholder);
    await user.type(InputDom, InputValue);
    fireEvent.compositionStart(InputDom);
    await user.type(InputDom, InputValue);
    fireEvent.compositionEnd(InputDom);
    fireEvent.compositionEnd(InputDom);
    await user.type(InputDom, InputValue);
    expect(onCompositionStartFn).toBeCalled();
    expect(onCompositionEndFn).toBeCalled();
    expect(InputDom.value).toBe([InputValue, InputValue, InputValue].join(''));
  });
  test('keyDown', async () => {
    const user = userEvent.setup();
    const onEnterFn = vi.fn();
    const onKeydownFn = vi.fn();
    const { queryByPlaceholderText } = render(
      <Input placeholder={InputPlaceholder} onEnter={onEnterFn} onKeydown={onKeydownFn} />,
    );
    const InputDom = queryByPlaceholderText(InputPlaceholder);
    await user.type(InputDom, 'abc{enter}');
    expect(onEnterFn).toBeCalled();
    expect(onKeydownFn).toBeCalled();
  });
  test('disabled', async () => {
    const changeFn = vi.fn();
    const { queryByPlaceholderText } = render(<Input placeholder={InputPlaceholder} disabled onChange={changeFn} />);
    expect(queryByPlaceholderText(InputPlaceholder).disabled).toBeTruthy();
  });
  test('password', async () => {
    const { queryByPlaceholderText } = render(<Input placeholder={InputPlaceholder} type="password" />);
    expect(queryByPlaceholderText(InputPlaceholder).type).toEqual('password');
  });
  test('status', async () => {
    const { container } = render(<Input placeholder={InputPlaceholder} status="error" />);
    expect(container.firstChild.firstChild.classList.contains('t-is-error')).toBeTruthy();
  });
  test('size', async () => {
    const { container } = render(<Input placeholder={InputPlaceholder} size="large" />);
    expect(container.firstChild.firstChild.classList.contains('t-size-l')).toBeTruthy();
  });
});

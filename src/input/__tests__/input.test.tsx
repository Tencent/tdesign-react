import React from 'react';
import { testExamples, render, fireEvent } from '@test/utils';
import userEvent from '@testing-library/user-event';
import { LockOnIcon, ErrorCircleFilledIcon } from 'tdesign-icons-react';
import Input from '../Input';
import Addon from '../../addon';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Input 组件测试', () => {
  const InputPlaceholder = '请输入内容';
  const InputValue = '24/05/2020';
  test('create', async () => {
    const changeFn = jest.fn();
    const { container, queryByPlaceholderText } = render(<Input placeholder={InputPlaceholder} onChange={changeFn} />);
    expect(container.firstChild.firstChild.classList.contains('t-input')).toBeTruthy();
    expect(queryByPlaceholderText(InputPlaceholder)).toBeInTheDocument();
    fireEvent.change(queryByPlaceholderText(InputPlaceholder), { target: { value: InputValue } });
    expect(changeFn).toBeCalledTimes(1);
    expect(changeFn.mock.calls[0][0]).toBe(InputValue);
  });
  test('addon', async () => {
    const { asFragment } = render(
      <Addon prepend="http://">
        <Input placeholder={InputPlaceholder} />
      </Addon>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  test('prefixIcon suffixIcon', async () => {
    const { asFragment } = render(
      <Input
        prefixIcon={<LockOnIcon />}
        suffixIcon={<ErrorCircleFilledIcon />}
        placeholder={InputPlaceholder}
        type="password"
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });
  test('prefixIcon is function', async () => {
    const { asFragment } = render(<Input prefixIcon={() => <span>prefixIcon</span>} placeholder={InputPlaceholder} />);
    expect(asFragment()).toMatchSnapshot();
  });
  test('clearable', async () => {
    const clearFn = jest.fn();
    const { asFragment, queryByPlaceholderText, container } = render(
      <Input placeholder={InputPlaceholder} clearable onClear={clearFn} />,
    );
    fireEvent.change(queryByPlaceholderText(InputPlaceholder), { target: { value: InputValue } });
    expect(queryByPlaceholderText(InputPlaceholder).value).toEqual(InputValue);
    expect(asFragment()).toMatchSnapshot();
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
    const blurFn = jest.fn();
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
    const onCompositionStartFn = jest.fn();
    const onCompositionEndFn = jest.fn();
    const { queryByPlaceholderText } = render(
      <Input
        placeholder={InputPlaceholder}
        onCompositionstart={onCompositionStartFn}
        onCompositionend={onCompositionEndFn}
      />,
    );
    const InputDom = queryByPlaceholderText(InputPlaceholder);
    userEvent.type(InputDom, InputValue);
    fireEvent.compositionStart(InputDom);
    userEvent.type(InputDom, InputValue);
    fireEvent.compositionEnd(InputDom);
    fireEvent.compositionEnd(InputDom);
    userEvent.type(InputDom, InputValue);
    expect(onCompositionStartFn).toBeCalled();
    expect(onCompositionEndFn).toBeCalled();
    expect(InputDom.value).toBe([InputValue, InputValue, InputValue].join(''));
  });
  test('keyDown', async () => {
    const onEnterFn = jest.fn();
    const onKeydownFn = jest.fn();
    const { queryByPlaceholderText } = render(
      <Input placeholder={InputPlaceholder} onEnter={onEnterFn} onKeydown={onKeydownFn} />,
    );
    const InputDom = queryByPlaceholderText(InputPlaceholder);
    userEvent.type(InputDom, 'abc{enter}');
    expect(onEnterFn).toBeCalled();
    expect(onKeydownFn).toBeCalled();
  });
  test('disabled', async () => {
    const changeFn = jest.fn();
    const { queryByPlaceholderText } = render(<Input placeholder={InputPlaceholder} disabled onChange={changeFn} />);
    expect(queryByPlaceholderText(InputPlaceholder).disabled).toBeTruthy();
  });
  test('password', async () => {
    const { queryByPlaceholderText } = render(<Input placeholder={InputPlaceholder} type="password" />);
    expect(queryByPlaceholderText(InputPlaceholder).type).toEqual('password');
  });
  test('maxLength', async () => {
    const { asFragment } = render(<Input placeholder={InputPlaceholder} maxlength={3} />);
    expect(asFragment()).toMatchSnapshot();
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

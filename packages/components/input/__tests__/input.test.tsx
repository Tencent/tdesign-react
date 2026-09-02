import React from 'react';
import { act, fireEvent, render, vi } from '@test/utils';
import userEvent from '@testing-library/user-event';

import Input from '../Input';

describe('Input 组件测试', () => {
  const InputPlaceholder = '请输入内容';
  const InputValue = '24/05/2020';
  test('create', async () => {
    const changeFn = vi.fn();
    const { container, queryByPlaceholderText } = render(<Input placeholder={InputPlaceholder} onChange={changeFn} />);
    expect(container.children[0].children[0].classList.contains('t-input')).toBeTruthy();
    expect(queryByPlaceholderText(InputPlaceholder)).toBeInTheDocument();
    fireEvent.change(queryByPlaceholderText(InputPlaceholder), {
      target: { value: InputValue },
    });
    expect(changeFn).toHaveBeenCalledTimes(1);
    expect(changeFn.mock.calls[0][0]).toBe(InputValue);
  });
  test('clearable', async () => {
    const clearFn = vi.fn();
    const { queryByPlaceholderText, container } = render(
      <Input placeholder={InputPlaceholder} clearable onClear={clearFn} />,
    );
    fireEvent.change(queryByPlaceholderText(InputPlaceholder), {
      target: { value: InputValue },
    });
    expect((queryByPlaceholderText(InputPlaceholder) as HTMLInputElement).value).toEqual(InputValue);
    fireEvent.mouseEnter(container.firstChild.firstChild);
    fireEvent.click(container.querySelector('.t-input__suffix-clear'));
    expect((queryByPlaceholderText(InputPlaceholder) as HTMLInputElement).value).toEqual('');
  });
  test('clearable can not work when mouseLeave', async () => {
    const { queryByPlaceholderText, container } = render(<Input placeholder={InputPlaceholder} clearable />);
    fireEvent.change(queryByPlaceholderText(InputPlaceholder), {
      target: { value: InputValue },
    });
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
    expect(blurFn).toHaveBeenCalledTimes(0);
    fireEvent.blur(InputDom);
    expect(blurFn).toHaveBeenCalledTimes(1);
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
    const InputDom = queryByPlaceholderText(InputPlaceholder) as HTMLInputElement;
    await user.type(InputDom, InputValue);
    fireEvent.compositionStart(InputDom);
    await user.type(InputDom, InputValue);
    fireEvent.compositionEnd(InputDom);
    fireEvent.compositionEnd(InputDom);
    await user.type(InputDom, InputValue);
    expect(onCompositionStartFn).toHaveBeenCalled();
    expect(onCompositionEndFn).toHaveBeenCalled();
    expect(InputDom.value).toBe([InputValue, InputValue, InputValue].join(''));
  });
  test('composing value should not be kept when value is reset by outside', async () => {
    // 模拟中文输入法的一次合成输入
    const imeInput = (input: HTMLInputElement, value: string) => {
      fireEvent.compositionStart(input, { target: { value: input.value } });
      fireEvent.change(input, { target: { value } });
      fireEvent.compositionEnd(input, { target: { value } });
    };

    const ControlledInput = () => {
      const [value, setValue] = React.useState('');
      return (
        <>
          <Input placeholder={InputPlaceholder} value={value} onChange={(v) => setValue(v as string)} />
          <button type="button" onClick={() => setValue('')}>
            reset
          </button>
        </>
      );
    };
    const { queryByPlaceholderText, getByText } = render(<ControlledInput />);
    const InputDom = queryByPlaceholderText(InputPlaceholder) as HTMLInputElement;

    imeInput(InputDom, '苹');
    expect(InputDom.value).toBe('苹');

    // 外部清空输入框内容后，再次进入合成态不应残留上一次的输入
    fireEvent.click(getByText('reset'));
    expect(InputDom.value).toBe('');

    fireEvent.compositionStart(InputDom, { target: { value: InputDom.value } });
    expect(InputDom.value).toBe('');

    fireEvent.change(InputDom, { target: { value: 'xiang' } });
    fireEvent.compositionEnd(InputDom, { target: { value: '香' } });
    expect(InputDom.value).toBe('香');
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
    expect(onEnterFn).toHaveBeenCalled();
    expect(onKeydownFn).toHaveBeenCalled();
  });
  test('disabled', async () => {
    const changeFn = vi.fn();
    const { queryByPlaceholderText } = render(<Input placeholder={InputPlaceholder} disabled onChange={changeFn} />);
    expect((queryByPlaceholderText(InputPlaceholder) as HTMLInputElement).disabled).toBeTruthy();
  });
  test('password', async () => {
    const { queryByPlaceholderText, container } = render(<Input placeholder={InputPlaceholder} type="password" />);
    expect((queryByPlaceholderText(InputPlaceholder) as HTMLInputElement).type).toEqual('password');

    expect(container.querySelector('.t-icon-browse-off')).toBeTruthy();
    fireEvent.click(container.querySelector('.t-input__suffix-clear'));
    expect(container.querySelector('.t-icon-browse')).toBeTruthy();
  });
  test('password can be toggle when disabled', async () => {
    const { container } = render(<Input placeholder={InputPlaceholder} type="password" disabled />);

    expect(container.querySelector('.t-icon-browse-off')).toBeTruthy();
    fireEvent.click(container.querySelector('.t-input__suffix-clear'));
    expect(container.querySelector('.t-icon-browse-off')).toBeTruthy();
  });
  test('status', async () => {
    const { container } = render(<Input placeholder={InputPlaceholder} status="error" />);
    expect(container.children[0].children[0].classList.contains('t-is-error')).toBeTruthy();
  });
  test('size', async () => {
    const { container } = render(<Input placeholder={InputPlaceholder} size="large" />);
    expect(container.children[0].children[0].classList.contains('t-size-l')).toBeTruthy();
  });
  test('label display', async () => {
    const text = 'test-label';
    const { getByText } = await render(<Input label={text} />);

    act(() => {
      expect(getByText(text)).toBeTruthy();
    });
  });

  test('prefixIcon display', async () => {
    const text = 'test-prefixIcon';
    const { getByText } = await render(<Input prefixIcon={<span>{text}</span>} />);

    act(() => {
      expect(getByText(text)).toBeTruthy();
    });
  });
});

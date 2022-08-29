import React from 'react';
import { testExamples, render, act, waitFor, fireEvent } from '@test/utils';
import userEvent from '@testing-library/user-event';
import { Textarea } from '..';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Textarea 组件测试', () => {
  // 测试渲染
  test('create', async () => {
    const { container } = render(<Textarea />);
    expect(container.querySelectorAll('.t-textarea')).not.toBeNull();
  });

  // 测试属性
  test('disabled', async () => {
    const { container } = render(<Textarea disabled={true} />);
    expect(container.querySelectorAll('.t-is-disabled')).not.toBeNull();
  });

  // 测试输入
  test('input', async () => {
    await act(async () => {
      render(<Textarea maxcharacter={5} />);
      // 获取 input
      const inputElement = await waitFor(() => document.querySelector('textarea'));
      expect(inputElement).not.toBeNull();

      const value = 'hello';
      fireEvent.change(inputElement, { target: { value } });
      expect(inputElement.textContent).toBe(value);

      fireEvent.change(inputElement, { target: { value: 'hi,tzmax' } });
      expect(inputElement.textContent.length).toBe(5);
    });

    const onChange = jest.fn();
    const { container } = render(<Textarea maxLength={1} onChange={onChange} />);
    fireEvent.compositionStart(container.querySelector('textarea'));
    fireEvent.change(container.querySelector('textarea'), { target: { value: 'tian' } });
    fireEvent.compositionEnd(container.querySelector('textarea'), {
      currentTarget: { value: '天' },
    });
    fireEvent.change(container.querySelector('textarea'), { target: { value: '天' } });
    expect(onChange).toHaveBeenLastCalledWith('天', expect.objectContaining({}));
  });

  // 测试事件
  test('event', async () => {
    await act(async () => {
      let changeValue = '';
      let event = null;
      render(
        <Textarea
          onChange={(value, e) => {
            changeValue = value;
            event = e;
          }}
          onKeydown={(value, e) => {
            changeValue = value;
            event = e;
          }}
          onKeypress={(value, e) => {
            changeValue = value;
            event = e;
          }}
          onKeyup={(value, e) => {
            changeValue = value;
            event = e;
          }}
        />,
      );
      // 获取 input
      const inputElement = await waitFor(() => document.querySelector('textarea'));
      expect(inputElement).not.toBeNull();

      event = null;
      changeValue = '';
      const value = 'hello';
      fireEvent.change(inputElement, { target: { value } });
      expect(changeValue).not.toBeNull();
      expect(event).not.toBeNull();

      event = null;
      changeValue = '';
      fireEvent.keyDown(inputElement);
      expect(changeValue).not.toBeNull();
      expect(event).not.toBeNull();

      event = null;
      changeValue = '';
      userEvent.type(inputElement, '你好,{enter}World!');
      expect(changeValue).not.toBeNull();
      expect(event).not.toBeNull();

      // fireEvent.change(inputElement, { target: { value: 'hi,tzmax' } });
      // expect(inputElement.textContent.length).toBe(5);
    });
  });
});

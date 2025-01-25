import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import { Textarea } from '..';

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
    render(<Textarea maxcharacter={5} />);
    // 获取 input
    expect(document.querySelector('textarea')).not.toBeNull();

    const value = 'hello';
    fireEvent.change(document.querySelector('textarea'), { target: { value } });
    expect(document.querySelector('textarea').textContent).toBe(value);

    fireEvent.change(document.querySelector('textarea'), { target: { value: 'hi,tzmax' } });
    expect(document.querySelector('textarea').textContent.length).toBe(5);

    const onChange = vi.fn();
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
    expect(document.querySelector('textarea')).not.toBeNull();

    event = null;
    changeValue = '';
    const value = 'hello';
    fireEvent.change(document.querySelector('textarea'), { target: { value } });
    expect(changeValue).not.toBeNull();
    expect(event).not.toBeNull();

    event = null;
    changeValue = '';
    fireEvent.keyDown(document.querySelector('textarea'));
    expect(changeValue).not.toBeNull();
    expect(event).not.toBeNull();

    event = null;
    changeValue = '';
    fireEvent.change(document.querySelector('textarea'), { target: { value: 'hi,tzmax' } });
    expect(changeValue).not.toBeNull();
    expect(event).not.toBeNull();
  });
});

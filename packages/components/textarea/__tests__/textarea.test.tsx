import React from 'react';
import { fireEvent, mockDelay, render, vi } from '@test/utils';
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

  test('autofocus cursor end', async () => {
    const value = 'test autofocus';
    const { container } = render(<Textarea value={value} autofocus />);

    await mockDelay(100);

    expect(container.getElementsByTagName('textarea')[0].selectionStart).toBe(value.length);
  });

  test('count follows maxcharacter and maxlength correctly', async () => {
    const LIMIT_SELECTOR = '.t-textarea__limit';

    const { container: container1 } = render(<Textarea maxcharacter={15} value="hello世界" />);
    const limitText1 = container1.querySelector(LIMIT_SELECTOR);
    expect(limitText1?.textContent).toBe('9/15'); // hello(5) + 世(2) + 界(2) = 9

    const { container: container2 } = render(<Textarea maxlength={15} value="hello世界" />);
    const limitText2 = container2.querySelector(LIMIT_SELECTOR);
    expect(limitText2?.textContent).toBe('7/15');

    const { container: container3 } = render(<Textarea maxcharacter={15} value="hi👋🌍" />);
    const limitText3 = container3.querySelector(LIMIT_SELECTOR);
    expect(limitText3?.textContent).toBe('10/15'); // h(1) + i(1) + 👋(4) + 🌍(4) = 10

    const { container: container4 } = render(<Textarea maxlength={15} value="hi👋🌍" />);
    const limitText4 = container4.querySelector(LIMIT_SELECTOR);
    expect(limitText4?.textContent).toBe('4/15');
  });
});

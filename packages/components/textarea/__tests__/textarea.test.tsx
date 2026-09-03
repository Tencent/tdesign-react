import React from 'react';
import { vi } from 'vitest';
import { act, fireEvent, mockDelay, mockResizeObserver, render } from '@test/utils';

import { Textarea } from '..';

import type { TdTextareaProps } from '../type';

const calcTextareaHeightMock = vi.hoisted(() => vi.fn());

vi.mock('@tdesign/common-js/utils/calcTextareaHeight', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tdesign/common-js/utils/calcTextareaHeight')>();
  calcTextareaHeightMock.mockImplementation(actual.default);
  return { default: calcTextareaHeightMock };
});

function getTextarea(container?: ParentNode | null): HTMLTextAreaElement {
  const textarea = (container ?? document).querySelector('textarea');
  if (!(textarea instanceof HTMLTextAreaElement)) {
    throw new Error('textarea not found');
  }
  return textarea;
}

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
    expect(getTextarea()).not.toBeNull();

    const value = 'hello';
    fireEvent.change(getTextarea(), { target: { value } });
    expect(getTextarea().textContent).toBe(value);

    fireEvent.change(getTextarea(), { target: { value: 'hi,tdesign' } });
    expect(getTextarea().textContent.length).toBe(5);

    const onChange = vi.fn();
    const { container } = render(<Textarea maxLength={1} onChange={onChange} />);
    fireEvent.compositionStart(getTextarea(container));
    fireEvent.change(getTextarea(container), { target: { value: 'tian' } });
    fireEvent.compositionEnd(getTextarea(container), {
      currentTarget: { value: '天' },
    });
    fireEvent.change(getTextarea(container), { target: { value: '天' } });
    expect(onChange).toHaveBeenLastCalledWith('天', expect.objectContaining({}));
  });

  // 测试事件
  test('event', async () => {
    let changeValue = '';
    let event: Parameters<NonNullable<TdTextareaProps['onChange']>>[1] | null = null;
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
    expect(getTextarea()).not.toBeNull();

    event = null;
    changeValue = '';
    const value = 'hello';
    fireEvent.change(getTextarea(), { target: { value } });
    expect(changeValue).not.toBeNull();
    expect(event).not.toBeNull();

    event = null;
    changeValue = '';
    fireEvent.keyDown(getTextarea());
    expect(changeValue).not.toBeNull();
    expect(event).not.toBeNull();

    event = null;
    changeValue = '';
    fireEvent.change(getTextarea(), { target: { value: 'hi,tdesign' } });
    expect(changeValue).not.toBeNull();
    expect(event).not.toBeNull();
  });

  test('autofocus cursor end', async () => {
    const value = 'test autofocus';
    const { container } = render(<Textarea value={value} autofocus />);

    await mockDelay(100);

    expect(getTextarea(container).selectionStart).toBe(value.length);
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

  test('autosize recalculates after hidden container becomes visible', async () => {
    const resizeCallbacks: ResizeObserverCallback[] = [];
    const restoreResizeObserver = mockResizeObserver(
      {},
      {
        observe: (_element, callback) => {
          resizeCallbacks.push(callback);
        },
      },
    );

    let laidOut = false;
    calcTextareaHeightMock.mockImplementation((_element, minRows = 1) => {
      if (!laidOut) {
        return { height: '0px', minHeight: '0px' };
      }
      const height = `${minRows * 24}px`;
      return { height, minHeight: height };
    });

    try {
      const { container } = render(<Textarea autosize={{ minRows: 5, maxRows: 5 }} />);
      const textarea = getTextarea(container);

      expect(textarea.style.height).toBe('0px');
      expect(textarea.style.minHeight).toBe('0px');

      laidOut = true;
      await act(async () => {
        resizeCallbacks.forEach((callback) => {
          callback([{ contentRect: { width: 360 } } as ResizeObserverEntry], {} as ResizeObserver);
        });
      });

      expect(textarea.style.height).toBe('120px');
      expect(textarea.style.minHeight).toBe('120px');
    } finally {
      restoreResizeObserver();
      calcTextareaHeightMock.mockReset();
    }
  });
});

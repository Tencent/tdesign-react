import React from 'react';
import { vi } from 'vitest';
import { act, fireEvent, mockDelay, mockResizeObserver, render } from '@test/utils';

import { ConfigProvider } from '../../config-provider';
import { Textarea } from '..';

import type { TdTextareaProps, TextareaValue } from '../type';

type TextareaOnChangeHandler = NonNullable<TdTextareaProps['onChange']>;
type TextareaOnChangeContext = Parameters<TextareaOnChangeHandler>[1];

const calcTextareaHeightMock = vi.hoisted(() => vi.fn());

vi.mock('@tdesign/common-js/utils/calcTextareaHeight', async () => {
  const actual = (await vi.importActual('@tdesign/common-js/utils/calcTextareaHeight')) as {
    default: typeof calcTextareaHeightMock;
  };
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

describe('Textarea', () => {
  describe('props', () => {
    test('disabled', async () => {
      const { container } = render(<Textarea disabled={true} />);
      expect(container.querySelectorAll('.t-is-disabled')).not.toBeNull();
    });

    test('autofocus', async () => {
      const value = 'test autofocus';
      const { container } = render(<Textarea value={value} autofocus />);

      await mockDelay(100);

      expect(getTextarea(container).selectionStart).toBe(value.length);
    });

    test('default', async () => {
      const { container } = render(<Textarea />);
      expect(container.querySelectorAll('.t-textarea')).not.toBeNull();
    });

    describe('clearable', () => {
      test('true equals top icon and clears the value', async () => {
        const onChange = vi.fn();
        const { container } = render(<Textarea defaultValue="hello" clearable onChange={onChange} />);
        expect(container.querySelector('.t-textarea--clear')).toBeNull();
        expect(getTextarea(container).classList.contains('t-textarea__inner--clear')).toBe(true);
        fireEvent.mouseEnter(container.querySelector('.t-textarea'));
        const clearIcon = container.querySelector('.t-textarea__clear--top .t-textarea__clear-icon');

        if (!(clearIcon instanceof SVGElement)) {
          throw new Error('clear icon not found');
        }
        expect(container.querySelector('.t-textarea__clear--top.t-textarea__clear--icon')).toBeTruthy();
        expect(container.querySelector('.t-button')).toBeNull();

        fireEvent.click(clearIcon);
        expect(onChange).toHaveBeenCalledWith('');
        expect(getTextarea(container).value).toBe('');
        expect(container.querySelector('.t-textarea__clear')).toBeNull();
        expect(getTextarea(container).classList.contains('t-textarea__inner--clear')).toBe(false);
      });

      test('supports position and text type', async () => {
        const { container } = render(<Textarea value="content" clearable={{ position: 'bottom', type: 'text' }} />);
        fireEvent.mouseEnter(container.querySelector('.t-textarea'));

        const clearText = container.querySelector('.t-textarea__clear--bottom .t-textarea__clear-text');
        expect(clearText?.textContent).toBe('清空');
        expect(container.querySelector('.t-textarea__clear--bottom.t-textarea__clear--text')).toBeTruthy();
        expect(container.querySelector('.t-button')).toBeNull();
      });

      test('object defaults to top icon', async () => {
        const { container } = render(<Textarea value="content" clearable={{ position: 'center' }} />);
        fireEvent.mouseEnter(container.querySelector('.t-textarea'));

        expect(container.querySelector('.t-textarea__clear--center .t-textarea__clear-icon')).toBeTruthy();
      });

      test('clearTrigger focus shows the button on hover and always keeps it visible', async () => {
        const { container: focusContainer } = render(<Textarea value="content" clearable />);
        expect(focusContainer.querySelector('.t-textarea__clear')).toBeNull();
        expect(getTextarea(focusContainer).classList.contains('t-textarea__inner--clear')).toBe(true);
        fireEvent.mouseEnter(focusContainer.querySelector('.t-textarea'));
        expect(focusContainer.querySelector('.t-textarea__clear')).toBeTruthy();
        fireEvent.mouseLeave(focusContainer.querySelector('.t-textarea'));
        expect(focusContainer.querySelector('.t-textarea__clear')).toBeNull();

        const { container: alwaysContainer } = render(
          <ConfigProvider
            globalConfig={{
              textarea: { clearTrigger: 'always', clearText: '清除' },
            }}
          >
            <Textarea value="content" clearable={{ type: 'text' }} />
          </ConfigProvider>,
        );
        const clearText = alwaysContainer.querySelector('.t-textarea__clear-text');
        expect(clearText?.textContent).toBe('清除');
      });

      test('stays hidden when empty, disabled, or readonly', async () => {
        const { container: emptyContainer } = render(<Textarea value="" clearable />);
        expect(emptyContainer.querySelector('.t-textarea__clear')).toBeNull();
        expect(getTextarea(emptyContainer).classList.contains('t-textarea__inner--clear')).toBe(false);

        const { container: disabledContainer } = render(<Textarea value="content" clearable disabled />);
        expect(disabledContainer.querySelector('.t-textarea__clear')).toBeNull();
        expect(getTextarea(disabledContainer).classList.contains('t-textarea__inner--clear')).toBe(false);

        const { container: readOnlyContainer } = render(<Textarea value="content" clearable readOnly />);
        expect(readOnlyContainer.querySelector('.t-textarea__clear')).toBeNull();
        expect(getTextarea(readOnlyContainer).classList.contains('t-textarea__inner--clear')).toBe(false);
      });
    });
  });

  describe('events', () => {
    test('onChange, onKeydown, onKeypress and onKeyup', async () => {
      let changeValue: TextareaValue = '';
      let event: TextareaOnChangeContext | null = null;
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

    test('onValidate', () => {
      const onValidate = vi.fn();
      const { container } = render(
        <Textarea allowInputOverMax maxcharacter={4} defaultValue="" onValidate={onValidate} />,
      );

      fireEvent.change(getTextarea(container), { target: { value: '你好a' } });
      expect(onValidate).toHaveBeenLastCalledWith({ error: 'exceed-maximum' });

      fireEvent.change(getTextarea(container), { target: { value: '好' } });
      expect(onValidate).toHaveBeenLastCalledWith({ error: undefined });

      const initialValidate = vi.fn();
      render(<Textarea allowInputOverMax defaultValue="too long" maxlength={3} onValidate={initialValidate} />);
      expect(initialValidate).toHaveBeenCalledWith({ error: 'exceed-maximum' });
    });
  });

  describe('scenarios', () => {
    test('maxcharacter and maxLength coordinate truncation with composition input', async () => {
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

    test('maxcharacter and maxlength count Unicode characters', async () => {
      const LIMIT_SELECTOR = '.t-textarea__limit';

      const { container: container1 } = render(<Textarea maxcharacter={15} value="hello世界" />);
      const limitText1 = container1.querySelector(LIMIT_SELECTOR);
      expect(limitText1?.textContent).toBe('9/15'); // hello(5) + 世(2) + 界(2) = 9

      const { container: container2 } = render(<Textarea maxlength={15} value="hello世界" />);
      const limitText2 = container2.querySelector(LIMIT_SELECTOR);
      expect(limitText2?.textContent).toBe('7/15');

      const emojiValue = `hi${String.fromCodePoint(0x1f44b, 0x1f30d)}`;
      const { container: container3 } = render(<Textarea maxcharacter={15} value={emojiValue} />);
      const limitText3 = container3.querySelector(LIMIT_SELECTOR);
      expect(limitText3?.textContent).toBe('10/15');

      const { container: container4 } = render(<Textarea maxlength={15} value={emojiValue} />);
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
});

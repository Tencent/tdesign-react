import { act, beforeEach, describe, expect, fireEvent, render, test, vi } from '@test/utils';
import React from 'react';
import { MessageProps } from 'tdesign-mobile-react/message/Message';
import Message, { MessageAlignType } from '../index';

const classNamePrefix = 't';
const messageClassName = `${classNamePrefix}-message`;
const querySelectorName = `.${messageClassName}`;

function getClassNameWithPrefix(className: string) {
  return `${classNamePrefix}-${className}`;
}

describe('Message', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe('props', () => {
    test('className', () => {
      const customClassName = 'custom-className';
      const { container } = render(<Message className={customClassName} visible={true} />);
      expect(container.querySelector(querySelectorName)).toHaveClass(customClassName);
    });

    test('style', () => {
      const customStyle = { color: 'rgb(255, 0, 0)' };
      const { container } = render(<Message style={customStyle} visible={true} />);
      expect(container.querySelector(querySelectorName)).toHaveStyle(customStyle);
    });

    test('align', () => {
      const defaultAlign = 'left';
      {
        // defaultAlign
        const { container } = render(<Message visible={true} />);
        expect(container.querySelector(querySelectorName)).toHaveClass(
          getClassNameWithPrefix(`message-align--${defaultAlign}`),
        );
      }

      {
        // ‘center'
        const centerAlign: MessageAlignType = 'center';
        const { container } = render(<Message visible={true} align={centerAlign} />);
        expect(container.querySelector(querySelectorName)).toHaveClass(
          getClassNameWithPrefix(`message-align--${centerAlign}`),
        );
      }

      {
        // 'left'
        const leftAlign: MessageAlignType = 'left';
        const { container: customAlignContainer } = render(<Message visible={true} align={leftAlign} />);
        expect(customAlignContainer.querySelector(querySelectorName)).toHaveClass(
          getClassNameWithPrefix(`message-align--${leftAlign}`),
        );
      }
    });

    test('closeBtn', () => {
      const closeBtnClassNameSelector = `.${getClassNameWithPrefix(`message--close-btn`)}`;
      // Default closeBtn is undefined
      {
        const { container } = render(<Message visible={true} />);
        expect(container.querySelector(closeBtnClassNameSelector)).toBeNull();
      }

      // Show closeBtn
      {
        const { container } = render(<Message visible={true} closeBtn={true} />);
        expect(container.querySelector(closeBtnClassNameSelector)).toBeTruthy();
      }

      // string
      {
        const closeBtnText = 'closeBtnText';
        const { container } = render(<Message visible={true} closeBtn={closeBtnText} />);
        expect(container.querySelector(querySelectorName).textContent).toBe(closeBtnText);
      }

      // TNode
      {
        const closeBtnClassname = 'close-btn';
        const closeBtnClickHandler = vi.fn();
        const { container } = render(
          <Message
            visible={true}
            closeBtn={
              <div className={closeBtnClassname} onClick={closeBtnClickHandler}>
                closeBtnText
              </div>
            }
          />,
        );
        const closeBtn = container.querySelector(`.${closeBtnClassname}`);

        expect(closeBtn).toBeTruthy();

        fireEvent.click(closeBtn);
        expect(closeBtnClickHandler).toBeCalledTimes(1);
      }
    });

    test('content', () => {
      // string
      {
        const content = 'content';
        const { container } = render(<Message content={content} visible={true} />);
        expect(container.querySelector(`.${getClassNameWithPrefix('message__text')}`).textContent).toBe(content);
      }

      // TNode
      {
        const customContentName = 'custom-content';
        const customContent = 'customContent';
        const clickHandler = vi.fn();

        const { container } = render(
          <Message
            content={
              <div className={customContentName} onClick={clickHandler}>
                {customContent}
              </div>
            }
            visible={true}
          />,
        );
        const customContentDiv = container.querySelector(`.${customContentName}`);
        expect(customContentDiv.textContent).toBe(customContent);

        fireEvent.click(customContentDiv);
        expect(clickHandler).toBeCalledTimes(1);
      }
    });

    test('duration', async () => {
      const defaultDuration = 3000;

      {
        // Default duration
        const { container } = render(<Message visible={true} />);
        await act(async () => {
          vi.advanceTimersByTime(defaultDuration - 1);
        });
        expect(container.querySelector(querySelectorName)).toHaveClass('message-enter-active');
        await act(async () => {
          vi.advanceTimersByTime(1);
        });
        expect(container.querySelector(querySelectorName)).toHaveClass('message-leave');
      }

      {
        // Custom duration
        const duration = 1000;
        const { container } = render(<Message visible={true} duration={duration} />);
        await act(async () => {
          vi.advanceTimersByTime(duration);
        });
        expect(container.querySelector(querySelectorName)).toHaveClass('message-leave');
      }

      {
        // Disabled duration
        const duration = 0;
        const { container } = render(<Message visible={true} duration={duration} />);
        await act(async () => {
          vi.advanceTimersByTime(defaultDuration * 2);
        });
        expect(container.querySelector(querySelectorName)).toHaveClass('message-enter-active');
      }
    });

    test('link', () => {
      {
        // string
        const linkContent = '链接';
        const { container } = render(<Message visible={true} link={linkContent} />);
        expect(container.querySelector(`.${getClassNameWithPrefix('link__content')}`).textContent).toBe(linkContent);
      }

      {
        // Use link params
        const linkParams = {
          size: 'small',
          theme: 'danger',
          content: 'link content',
        };
        // todo PM fix this link 描述有问题
        const { container } = render(<Message visible={true} link={linkParams} />);
        expect(container.querySelector(`.${getClassNameWithPrefix('link--danger')}`)).toBeTruthy();
      }

      {
        // TNode - function
        const customContentName = 'custom-content';
        const clickHandler = vi.fn();
        const { container } = render(
          <Message
            visible={true}
            link={() => (
              <div onClick={clickHandler} className={customContentName}>
                customContent
              </div>
            )}
          />,
        );

        const customContentDiv = container.getElementsByClassName(customContentName)[0];
        expect(customContentDiv).toBeTruthy();

        fireEvent.click(customContentDiv);
        expect(clickHandler).toBeCalledTimes(1);
      }

      {
        // TNode - Element
        const customContentName = 'custom-content';
        const clickHandler = vi.fn();
        const { container } = render(
          <Message
            visible={true}
            link={
              <div onClick={clickHandler} className={customContentName}>
                customContent
              </div>
            }
          />,
        );

        const customContentDiv = container.getElementsByClassName(customContentName)[0];
        expect(customContentDiv).toBeTruthy();

        fireEvent.click(customContentDiv);
        expect(clickHandler).toBeCalledTimes(1);
      }
    });

    test('marquee', async () => {
      const textWrapRect = { width: 200 } as DOMRect;
      const textRect = { width: 300 } as DOMRect;

      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function () {
        const className = (this as Element).className || '';
        if (typeof className === 'string') {
          if (className.includes(getClassNameWithPrefix('message__text-wrap'))) return textWrapRect as any;
          if (className.includes(getClassNameWithPrefix('message__text'))) return textRect as any;
        }
        return originalGetBoundingClientRect.call(this);
      } as any;

      {
        // Boolean
        const { container } = render(<Message visible={true} marquee={true} content="hello marquee" />);

        const textEl = container.querySelector(`.${getClassNameWithPrefix('message__text')}`) as HTMLDivElement;
        expect(textEl).toBeTruthy();

        // After delay, first play: snapshot styles applied
        await act(async () => {
          vi.advanceTimersByTime(100);
        });
        expect(textEl).toMatchSnapshot();

        // Fire transitionend -> snapshot reset state
        act(() => {
          textEl.dispatchEvent(new Event('transitionend'));
        });
        expect(textEl).toMatchSnapshot();

        // Next play after delay (playedCount > 0): snapshot styles applied
        await act(async () => {
          vi.advanceTimersByTime(10);
        });
        expect(textEl).toMatchSnapshot();
      }

      {
        // Object
        const { container } = render(
          <Message visible={true} marquee={{ loop: 2, speed: 100, delay: 100 }} content="hello marquee" />,
        );

        const textEl = container.querySelector(`.${getClassNameWithPrefix('message__text')}`) as HTMLDivElement;
        expect(textEl).toBeTruthy();

        // After delay, first play: snapshot styles applied
        await act(async () => {
          vi.advanceTimersByTime(100);
        });
        expect(textEl).toMatchSnapshot();

        // Fire transitionend -> snapshot reset state
        act(() => {
          textEl.dispatchEvent(new Event('transitionend'));
        });
        expect(textEl).toMatchSnapshot();

        // Next play after delay (playedCount > 0): snapshot styles applied
        await act(async () => {
          vi.advanceTimersByTime(10);
        });
        expect(textEl).toMatchSnapshot();
      }

      // Cleanup mock
      Element.prototype.getBoundingClientRect = originalGetBoundingClientRect;
    });

    test('offset', () => {
      const { container } = render(<Message visible={true} offset={[-100, 100]} />);
      expect(container.querySelector(querySelectorName)).toHaveStyle({ top: '-100px', left: '100px' });
    });

    test('theme', () => {
      {
        // Default theme
        const { container } = render(<Message visible={true} />);
        const iconContainer = container.querySelector(`.${getClassNameWithPrefix('message__icon--left')}`);
        expect(iconContainer.querySelector('svg')).toBeTruthy();
      }

      {
        // All themes
        const themes: MessageProps['theme'][] = ['info', 'success', 'warning', 'error'];
        themes.forEach((theme) => {
          const { container } = render(<Message theme={theme} visible={true} />);
          const iconContainer = container.querySelector(`.${getClassNameWithPrefix('message__icon--left')}`);
          expect(iconContainer.querySelector('svg')).toBeTruthy();
        });
      }

      {
        // fake theme
        const { container } = render(<Message visible={true} theme={'fake' as 'info'} />);
        const iconContainer = container.querySelector(`.${getClassNameWithPrefix('message__icon--left')}`);
        expect(iconContainer.querySelector('svg')).toBeTruthy();
      }
    });

    test('visible', async () => {
      // Default visible: false
      {
        const { container } = render(<Message />);
        expect(container.querySelector(querySelectorName)).toBeNull();
      }

      // Visible false
      {
        const { container } = render(<Message visible={false} />);
        expect(container.querySelector(querySelectorName)).toBeNull();
      }

      // Control visible
      {
        const { container, rerender } = render(<Message visible={true} />);
        const messageElement = container.querySelector(querySelectorName);
        expect(messageElement).toHaveClass('message-enter-active');

        await act(async () => {
          rerender(<Message visible={false} />);
        });
        expect(messageElement).toHaveClass('message-leave');
      }
    });

    test('defaultVisible', async () => {
      {
        // True
        const { container } = render(<Message defaultVisible={true} />);
        expect(container.querySelector(querySelectorName)).toBeTruthy();
      }

      {
        // False
        const { container } = render(<Message defaultVisible={false} />);
        expect(container.querySelector(querySelectorName)).toBeNull();
      }

      {
        // Combine with visible
        const { container } = render(<Message defaultVisible={true} visible={false} />);
        expect(container.querySelector(querySelectorName)).toBeNull();
      }

      {
        // Combine with visible
        const { container } = render(<Message defaultVisible={true} visible={true} />);
        expect(container.querySelector(querySelectorName)).toBeTruthy();
      }

      {
        // Combine with visible
        const { container } = render(<Message defaultVisible={false} visible={false} />);
        expect(container.querySelector(querySelectorName)).toBeNull();
      }

      {
        // Combine with visible
        const { container } = render(<Message defaultVisible={false} visible={true} />);
        expect(container.querySelector(querySelectorName)).toBeTruthy();
      }

      {
        // Change should no effect
        const { container, rerender } = render(<Message defaultVisible={true} />);
        rerender(<Message defaultVisible={false} />);
        expect(container.querySelector(querySelectorName)).toBeTruthy();
      }
    });

    test('zIndex', () => {
      // todo PM fix this: zIndex default should be 5000
      // const defaultZIndex = '5000';
      // {
      //   const { container } = render(<Message visible={true} />);
      //   expect(window.getComputedStyle(container.querySelector(querySelectorName)).zIndex).toBe(defaultZIndex);
      // }

      // Custom zIndex
      const { container } = render(<Message zIndex={1000} visible={true} />);
      expect(container.querySelector(querySelectorName)).toHaveStyle({ zIndex: 1000 });
    });

    test('onCloseBtnClick', async () => {
      {
        // When closeBtn is TNode
        const closeBtnClickHandler = vi.fn();
        const elementClickHandler = vi.fn();

        const closeBtnClassName = 'close-btn';
        const closeBthContent = (
          <div className={closeBtnClassName} onClick={elementClickHandler}>
            close
          </div>
        );

        const { container } = render(
          <Message visible={true} onCloseBtnClick={closeBtnClickHandler} closeBtn={closeBthContent} />,
        );
        const button = container.querySelector(`.${closeBtnClassName}`);

        fireEvent.click(button);
        expect(closeBtnClickHandler).toBeCalledTimes(1);
        expect(elementClickHandler).toBeCalledTimes(1);
      }

      {
        // Validate event structure
        const onCloseBtnClick = vi.fn<(context: { e: MouseEvent }) => void>();

        const closeBtnClassName = 'close-btn';
        const closeBthContent = <div className={closeBtnClassName}>close</div>;

        const { container } = render(
          <Message visible={true} closeBtn={closeBthContent} onCloseBtnClick={onCloseBtnClick as any}>
            测试内容
          </Message>,
        );

        const closeButton = container.querySelector(`.${closeBtnClassName}`);

        fireEvent.click(closeButton);

        const syntheticEvent = onCloseBtnClick.mock.calls[0][0].e;
        expect((syntheticEvent as any).nativeEvent).toBeInstanceOf(MouseEvent);
      }

      {
        // When closeBtn is Boolean
        const closeBtnClickHandler = vi.fn();
        const { container } = render(<Message visible={true} onCloseBtnClick={closeBtnClickHandler} closeBtn={true} />);
        const button = container.querySelector(`.${messageClassName}__close-wrap`);

        fireEvent.click(button);
        expect(closeBtnClickHandler).toBeCalledTimes(1);
      }
    });

    test('onDurationEnd', async () => {
      const durationTime = 3000;
      const onDurationEnd = vi.fn();

      render(<Message visible={true} duration={durationTime} onDurationEnd={onDurationEnd} />);

      await act(async () => {
        vi.advanceTimersByTime(durationTime - 1);
      });

      expect(onDurationEnd).toBeCalledTimes(0);

      await act(async () => {
        vi.advanceTimersByTime(1);
      });

      expect(onDurationEnd).toBeCalledTimes(1);
    });

    test('onLinkClick', async () => {
      {
        // When link is string
        const linkClickHandler = vi.fn();
        const { container } = render(<Message visible={true} onLinkClick={linkClickHandler} link="link" />);
        const button = container.querySelector(`.${getClassNameWithPrefix('link')}`);

        fireEvent.click(button);
        expect(linkClickHandler).toBeCalledTimes(1);
      }

      {
        // Where link is object
        const linkClickHandler = vi.fn();
        const linkParams = {
          size: 'small',
          theme: 'danger',
          content: 'link content',
        };

        const { container } = render(
          <Message visible={true} onLinkClick={linkClickHandler} link={linkParams as any} />,
        );
        const button = container.querySelector(`.${getClassNameWithPrefix('link')}`);

        fireEvent.click(button);
        expect(linkClickHandler).toBeCalledTimes(1);
      }

      {
        // When link is TNode
        const linkClickHandler = vi.fn();
        const elementClickHandler = vi.fn();

        const linkClassName = 'link-classname';
        const linkContent = (
          <div className={linkClassName} onClick={elementClickHandler}>
            link
          </div>
        );

        const { container } = render(<Message visible={true} onLinkClick={linkClickHandler} link={linkContent} />);
        const button = container.querySelector(`.${linkClassName}`);

        fireEvent.click(button);
        expect(linkClickHandler).toBeCalledTimes(1);
        expect(elementClickHandler).toBeCalledTimes(1);
      }

      {
        // Validate event structure
        const onLinkClick = vi.fn<(context: { e: MouseEvent }) => void>();

        const linkClassName = 'link-classname';
        const linkContent = <div className={linkClassName}>link</div>;

        const { container } = render(<Message visible={true} onLinkClick={onLinkClick as any} link={linkContent} />);

        const closeButton = container.getElementsByClassName(linkClassName)[0];

        fireEvent.click(closeButton);

        const syntheticEvent = onLinkClick.mock.calls[0][0].e;
        expect((syntheticEvent as any).nativeEvent).toBeInstanceOf(MouseEvent);
      }
    });

    test('children', () => {
      // string
      {
        const content = 'content';
        const { container } = render(<Message visible={true}>{content}</Message>);
        expect(container.querySelector(`.${getClassNameWithPrefix('message__text')}`).textContent).toBe(content);
      }

      // TNode
      {
        const customContentName = 'custom-content';
        const customContent = 'customContent';
        const clickHandler = vi.fn();

        const { container } = render(
          <Message
            content={
              <div className={customContentName} onClick={clickHandler}>
                {customContent}
              </div>
            }
            visible={true}
          />,
        );
        const customContentDiv = container.querySelector(`.${customContentName}`);
        expect(customContentDiv.textContent).toBe(customContent);

        fireEvent.click(customContentDiv);
        expect(clickHandler).toBeCalledTimes(1);
      }
    });
  });
});

import React from 'react';
import {
  CheckCircleFilledIcon,
  ErrorCircleFilledIcon,
  HelpCircleFilledIcon,
  HelpIcon,
  InfoCircleFilledIcon,
  LoadingIcon,
} from 'tdesign-icons-react';
import { fireEvent, mockTimeout, render, vi, waitFor } from '@test/utils';

import Message, { MessagePlugin } from '../index';

import type { TNode } from '../../common';
import type { MessageInfoOptions, MessageInstance, MessagePlacementList, MessageThemeList } from '../type';

const defaultMessage = '默认的message';

const THEME_MAP: Record<MessageThemeList, typeof InfoCircleFilledIcon> = {
  info: InfoCircleFilledIcon,
  success: CheckCircleFilledIcon,
  warning: ErrorCircleFilledIcon,
  error: ErrorCircleFilledIcon,
  question: HelpCircleFilledIcon,
  loading: LoadingIcon,
};
const THEME_LIST = Object.keys(THEME_MAP) as MessageThemeList[];

beforeAll(() => {
  Element.prototype.animate = function animate(
    _keyframes: Keyframe[] | PropertyIndexedKeyframes,
    options?: number | KeyframeAnimationOptions,
  ) {
    const animation = {
      onfinish: null as (() => void) | null,
      finish: () => {
        if (animation.onfinish) {
          animation.onfinish();
        }
      },
    };
    let delay = 0;
    if (typeof options === 'number') {
      delay = options;
    } else if (typeof options?.duration === 'number') {
      delay = options.duration;
    }
    setTimeout(() => {
      if (animation.onfinish) {
        animation.onfinish();
      }
    }, delay);
    return animation as unknown as Animation;
  };
});

describe('Message', () => {
  describe('props', () => {
    THEME_LIST.forEach((t) => {
      test(`theme[${t}]`, () => {
        const { container, unmount } = render(<Message theme={t}>{t}</Message>);
        expect(container.firstChild).toHaveClass(`t-is-${t}`);
        expect(() => {
          unmount();
        }).not.toThrow();
      });
    });

    test('content and children', () => {
      const { container, unmount } = render(<Message>{defaultMessage}</Message>);
      const contentWrapper = render(<Message content={defaultMessage} />);

      expect(container).toHaveTextContent(defaultMessage);
      expect(contentWrapper.container).toHaveTextContent(defaultMessage);
      expect(container.firstChild).toHaveClass('t-message');
      expect(container.firstChild).toHaveClass('t-is-info');
      expect(container.firstChild).not.toHaveClass('t-message__close');
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    test('closeBtn', () => {
      const { container } = render(<Message closeBtn={true}>{defaultMessage}</Message>);
      expect(container.firstChild).toHaveClass('t-is-closable');
      expect(container.getElementsByClassName('t-message__close').length).toBe(1);
    });

    test('icon[false]', () => {
      const { container } = render(<Message icon={false}>{defaultMessage}</Message>);
      expect(container.firstChild).not.toHaveClass('t-icon');
    });

    const style = { backgroundColor: 'rgb(51, 51, 51)' };
    THEME_LIST.forEach((t) => {
      test(`style[object] theme[${t}]`, () => {
        const { container } = render(
          <Message theme={t} style={style}>
            {defaultMessage}
          </Message>,
        );
        expect(container.firstChild).toHaveStyle(`background-color: ${style.backgroundColor};`);
      });
    });

    THEME_LIST.forEach((t) => {
      test(`content[string] theme[${t}]`, () => {
        const { container } = render(<Message theme={t} content={defaultMessage} />);
        expect(container.firstChild).toHaveTextContent(defaultMessage);
      });
    });

    test('closeBtn[string]', () => {
      const closeBtnTxt = '关闭';
      const { container, getByText } = render(<Message closeBtn={closeBtnTxt}>{defaultMessage}</Message>);
      expect(container.getElementsByClassName('t-message__close').length).toBe(1);
      expect(getByText(closeBtnTxt).textContent).toBe(closeBtnTxt);
    });

    test('closeBtn[TNode]', () => {
      const { container, getByText } = render(<Message closeBtn={<b>x</b>}>{defaultMessage}</Message>);
      expect(container.getElementsByClassName('t-message__close').length).toBe(1);
      expect(getByText('x')).toBeInTheDocument();
    });

    test('icon[TNode]', () => {
      const { container } = render(
        <Message icon={(() => <HelpIcon></HelpIcon>) as unknown as TNode}>{defaultMessage}</Message>,
      );
      expect(container.firstChild).not.toHaveClass('t-icon');
    });

    const contentNode = <p className="wrapper">{defaultMessage}</p>;
    THEME_LIST.forEach((t) => {
      test(`content[ReactNode] theme[${t}]`, () => {
        const { container } = render(<Message theme={t} content={contentNode} />);
        expect(container.querySelector('.wrapper')).not.toBe(null);
        expect(container.querySelector('.wrapper')).toHaveTextContent(defaultMessage);
      });
    });

    test('duration[number]', async () => {
      const onClose = vi.fn();
      const duration = 300;
      render(
        <Message duration={300} onClose={onClose}>
          {defaultMessage}
        </Message>,
      );
      expect(onClose).not.toHaveBeenCalled();
      await mockTimeout(() => expect(onClose).toHaveBeenCalledTimes(1), duration);
      expect(onClose).toHaveBeenCalledWith({
        trigger: 'duration-end',
      });
    });
  });

  describe('instanceFunctions', () => {
    afterEach(() => {
      document.getElementsByTagName('html')[0].innerHTML = '';
    });

    test('open and close', async () => {
      const openText = 'open';
      const closeText = 'close';
      const TestComponent = () => {
        let message: Promise<MessageInstance>;
        const handleOpen = () => {
          message = MessagePlugin.info(defaultMessage);
        };
        const handleClose = () => {
          MessagePlugin.close(message);
        };

        return (
          <>
            <button onClick={handleOpen}>{openText}</button>
            <button onClick={handleClose}>{closeText}</button>
          </>
        );
      };

      const { getByText } = render(<TestComponent />);
      expect(document.querySelector('.t-message')).toBe(null);
      fireEvent.click(getByText(openText));
      await mockTimeout(() => expect(document.querySelector('.t-message')).not.toBeNull());
      await mockTimeout(() => expect(document.querySelector('.t-message')).toHaveTextContent(defaultMessage));
      fireEvent.click(getByText(closeText));
      await waitFor(
        () => {
          expect(document.querySelector('.t-message')).toBeNull();
        },
        // 动画缓冲时间
        { timeout: 500 },
      );
    });

    test('onCloseBtnClick', async () => {
      const openText = 'open';
      const option: MessageInfoOptions = {
        content: defaultMessage,
        duration: 0,
        closeBtn: <div id="testId">关闭</div>,
        onCloseBtnClick: () => 1,
      };
      const spy = vi.spyOn(option, 'onCloseBtnClick');
      const TestComponent = () => {
        const handleOpen = () => {
          MessagePlugin.info(option);
        };

        return (
          <>
            <button onClick={handleOpen}>{openText}</button>
          </>
        );
      };

      const { getByText } = render(<TestComponent />);
      fireEvent.click(getByText(openText));
      await mockTimeout(() => expect(document.querySelector('#testId')).not.toBeNull());
      fireEvent.click(document.querySelector('#testId'));
      await mockTimeout(() => expect(spy).toHaveBeenCalled());
      expect(document.querySelector('#testId')).toBeNull();
    });

    test('duration', async () => {
      const duration = 2000;
      const openText = 'open';
      const { getByText } = render(
        <button onClick={() => MessagePlugin.info(defaultMessage, duration)}>{openText}</button>,
      );
      fireEvent.click(getByText(openText));
      await mockTimeout(() => expect(document.querySelector('.t-message')).not.toBeNull());
      await mockTimeout(() => expect(document.querySelector('.t-message')).toBeNull(), duration + 100);

      const option: MessageInfoOptions = {
        content: defaultMessage,
        onDurationEnd: () => 1,
      };
      const durationEndOpenText = 'open with duration end';
      const spy = vi.spyOn(option, 'onDurationEnd');
      const { getByText: getByTextWithEnd } = render(
        <button onClick={() => MessagePlugin.info(option, duration)}>{durationEndOpenText}</button>,
      );
      fireEvent.click(getByTextWithEnd(durationEndOpenText));
      await mockTimeout(() => expect(spy).toHaveBeenCalled(), duration + 100);
    });

    test('attach[string]', async () => {
      const openText = 'open';
      const option: MessageInfoOptions = {
        content: defaultMessage,
        attach: '#testId',
      };
      const TestComponent = () => {
        const handleOpen = () => MessagePlugin.info(option);

        return (
          <>
            <div id="testId" />
            <button onClick={handleOpen}>{openText}</button>
          </>
        );
      };

      const { getByText } = render(<TestComponent />);
      fireEvent.click(getByText(openText));
      await mockTimeout(() => expect(document.querySelector('#testId').querySelector('.t-message')).not.toBeNull());
    });

    test('attach[function]', async () => {
      const openText = 'open';
      const option: MessageInfoOptions = {
        content: defaultMessage,
        attach: () => document.querySelector('#testId'),
      };
      const TestComponent = () => {
        const handleOpen = () => MessagePlugin.info(option);

        return (
          <>
            <div id="testId" />
            <button onClick={handleOpen}>{openText}</button>
          </>
        );
      };

      const { getByText } = render(<TestComponent />);
      fireEvent.click(getByText(openText));
      await mockTimeout(() => expect(document.querySelector('#testId').querySelector('.t-message')).not.toBeNull());
    });

    test('offset', async () => {
      const openText = 'open';
      const [offsetX, offsetY] = [-10, 20];
      const option: MessageInfoOptions = {
        content: defaultMessage,
        offset: [offsetX, offsetY],
      };
      const TestComponent = () => {
        const handleOpen = () => MessagePlugin.info(option);

        return (
          <>
            <button onClick={handleOpen}>{openText}</button>
          </>
        );
      };
      const expectStyle = `left: ${offsetX}px; top: ${offsetY}px;`;
      const { getByText } = render(<TestComponent />);
      fireEvent.click(getByText(openText));
      await mockTimeout(() => expect(document.querySelector('.t-message')).toHaveStyle(expectStyle));
    });

    test.each(['center', 'top', 'left', 'right', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right'])(
      'placement[%s]',
      async (placement: MessagePlacementList) => {
        const option: MessageInfoOptions = {
          content: defaultMessage,
          duration: 0,
          placement,
        };
        const openText = `open${placement}`;
        const TestComponent = () => {
          const handleOpen = () => MessagePlugin.info(option);

          return (
            <>
              <button onClick={handleOpen}>{openText}</button>
            </>
          );
        };

        const { getByText } = render(<TestComponent />);
        fireEvent.click(getByText(openText));
        await mockTimeout(() => expect(document.querySelector(`.t-message-placement--${placement}`)).not.toBeNull());
        await mockTimeout(() =>
          expect(
            document.querySelector(`.t-message-placement--${placement}`).querySelector('.t-message'),
          ).not.toBeNull(),
        );
      },
    );

    test('hover pause', async () => {
      const openText = 'open';
      const option: MessageInfoOptions = {
        content: defaultMessage,
        duration: 300,
      };
      const TestComponent = () => {
        const handleOpen = () => {
          MessagePlugin.info(option);
        };

        return <button onClick={handleOpen}>{openText}</button>;
      };

      const { getByText, queryByText } = render(<TestComponent />);
      fireEvent.click(getByText(openText));

      await waitFor(() => {
        expect(queryByText(option.content as string)).toBeInTheDocument();
      });

      const messageElement = getByText(option.content as string);
      fireEvent.mouseEnter(messageElement);

      await mockTimeout(() => {
        const element = queryByText(option.content as string);
        expect(element).toBeInTheDocument();
      }, option.duration);

      fireEvent.mouseLeave(messageElement);

      // 等待 duration + 动画缓冲时间
      await waitFor(
        () => {
          expect(queryByText(option.content as string)).not.toBeInTheDocument();
        },
        { timeout: option.duration + 500 },
      );
    });
  });
});

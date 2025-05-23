import React from 'react';
import { render, fireEvent, mockTimeout, vi, act } from '@test/utils';
import {
  InfoCircleFilledIcon,
  CheckCircleFilledIcon,
  ErrorCircleFilledIcon,
  HelpCircleFilledIcon,
  HelpIcon,
  LoadingIcon,
} from 'tdesign-icons-react';
import Message, { MessagePlugin } from '../index';

const defaultMessage = '默认的message';

const THEME_MAP = {
  info: InfoCircleFilledIcon,
  success: CheckCircleFilledIcon,
  warning: ErrorCircleFilledIcon,
  error: ErrorCircleFilledIcon,
  question: HelpCircleFilledIcon,
  loading: LoadingIcon,
};
const THEME_LIST = Object.keys(THEME_MAP);

describe('Message Component test', () => {
  test('pure message contains right classes', async () => {
    const { container, getByText, unmount } = render(<Message>{defaultMessage}</Message>);
    expect(getByText(defaultMessage)).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('t-message');
    expect(container.firstChild).toHaveClass('t-is-info');
    expect(container.firstChild).not.toHaveClass('t-message__close');
    expect(() => {
      unmount();
    }).not.toThrow();
  });

  test(':theme', () => {
    THEME_LIST.forEach((t) => {
      const { container, unmount } = render(<Message theme={t}>{t}</Message>);
      expect(container.firstChild).toHaveClass(`t-is-${t}`);
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  test(':closeBtn is true, render default close button.', () => {
    const { container } = render(<Message closeBtn={true}>{defaultMessage}</Message>);
    expect(container.firstChild).toHaveClass('t-is-closable');
    expect(container.getElementsByClassName('t-message__close').length).toBe(1);
  });

  test(':closeBtn is a string, equal "关闭".', () => {
    const closeBtnTxt = '关闭';
    const { container, getByText } = render(<Message closeBtn={closeBtnTxt}>{defaultMessage}</Message>);
    expect(container.getElementsByClassName('t-message__close').length).toBe(1);
    expect(getByText(closeBtnTxt).textContent).toBe(closeBtnTxt);
  });

  test(':closeBtn is a function, () => VNode.', () => {
    const { container, getByText } = render(<Message closeBtn={<b>x</b>}>{defaultMessage}</Message>);
    expect(container.getElementsByClassName('t-message__close').length).toBe(1);
    expect(getByText('x')).toBeInTheDocument();
  });

  test(':icon is false', () => {
    const { container } = render(<Message icon={false}>{defaultMessage}</Message>);
    expect(container.firstChild).not.toHaveClass('t-icon');
  });

  test(':icon is a function, () => TIconMore', () => {
    const { container } = render(<Message icon={() => <HelpIcon></HelpIcon>}>{defaultMessage}</Message>);
    // t-icon
    expect(container.firstChild).not.toHaveClass('t-icon');
  });

  test(':style', () => {
    const style = { backgroundColor: 'rgb(51, 51, 51)' };
    THEME_LIST.forEach((t) => {
      const { container } = render(
        <Message theme={t} style={style}>
          {defaultMessage}
        </Message>,
      );
      expect(container.firstChild).toHaveStyle(`background-color: ${style.backgroundColor};`);
    });
  });

  test(':content as string, should get equal text', () => {
    THEME_LIST.forEach((t) => {
      const { container } = render(<Message theme={t} content={defaultMessage} />);
      expect(container.firstChild).toHaveTextContent(defaultMessage);
    });
  });

  test(':content as ReactNode', () => {
    const ReactNode = <p className="wrapper">{defaultMessage}</p>;
    THEME_LIST.forEach((t) => {
      const { container } = render(<Message theme={t} content={ReactNode} />);
      expect(container.querySelector('.wrapper')).not.toBe(null);
      expect(container.querySelector('.wrapper')).toHaveTextContent(defaultMessage);
    });
  });

  test(':duration props', async () => {
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

describe('Message Functional test', () => {
  afterEach(() => {
    document.getElementsByTagName('html')[0].innerHTML = '';
  });

  test('Message 基础函数式调用，消息应该正常展示、隐藏', async () => {
    const openText = 'open';
    const closeText = 'close';
    const TestComponent = () => {
      let message;
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
    await mockTimeout(() => expect(document.querySelector('.t-message')).toBeNull());
  });

  test('存在关闭按钮，点击关闭按钮应该触发 onCloseBtnClick', async () => {
    const openText = 'open';
    const option = {
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

  test('传入 duration 大于0，倒计时结束后消息应该隐藏', async () => {
    const duration = 2000;
    const openText = 'open';
    const { getByText } = render(
      <button onClick={() => MessagePlugin.info(defaultMessage, duration)}>{openText}</button>,
    );
    expect(document.querySelector('.t-message')).toBe(null);
    fireEvent.click(getByText(openText));
    await mockTimeout(() => expect(document.querySelector('.t-message')).not.toBeNull());
    await mockTimeout(() => expect(document.querySelector('.t-message')).toBeNull(), duration + 100);
  });

  test('传入 duration 且 onDurationEnd，倒计时结束后应该执行 onDurationEnd', async () => {
    const duration = 2000;
    const openText = 'open';
    const option = {
      content: defaultMessage,
      onDurationEnd: () => 1,
    };
    const spy = vi.spyOn(option, 'onDurationEnd');
    const { getByText } = render(<button onClick={() => MessagePlugin.info(option, duration)}>{openText}</button>);
    fireEvent.click(getByText(openText));
    await mockTimeout(() => expect(spy).toHaveBeenCalled(), duration + 100);
  });

  test('attach 为 String，应该正确挂载指定的节点', async () => {
    const openText = 'open';
    const option = {
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

  test('attach 为 Function，应该正确挂载指定的节点', async () => {
    const openText = 'open';
    const option = {
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

  test('设置 offset，应该相对于 placement 正确偏移', async () => {
    const openText = 'open';
    const [offsetX, offsetY] = [-10, 20];
    const option = {
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
    '不同的 placement 值，弹出消息应该出现在对应位置',
    async (placement) => {
      const option = {
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
        expect(document.querySelector(`.t-message-placement--${placement}`).querySelector('.t-message')).not.toBeNull(),
      );
    },
  );

  test('鼠标悬停时不自动关闭', async () => {
    const openText = 'open';
    const option = {
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
    await mockTimeout(() => expect(queryByText(option.content)).toBeInTheDocument());
    fireEvent.mouseEnter(getByText(option.content));
    await mockTimeout(() => expect(queryByText(option.content)).toBeInTheDocument(), option.duration);
    fireEvent.mouseLeave(getByText(option.content));
    await mockTimeout(() => expect(queryByText(option.content)).not.toBeInTheDocument(), option.duration);
  });
});

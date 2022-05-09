import React from 'react';
import { testExamples, render, act, fireEvent } from '@test/utils';
import { Message } from 'tdesign-react';
import {
  InfoCircleFilledIcon,
  CheckCircleFilledIcon,
  ErrorCircleFilledIcon,
  HelpCircleFilledIcon,
  HelpIcon,
  LoadingIcon,
} from 'tdesign-icons-react';

// 测试组件代码 Example 快照
testExamples(__dirname);
const defaultMessage = '默认的message';

describe('Message Component props test', () => {
  const THEME_MAP = {
    info: InfoCircleFilledIcon,
    success: CheckCircleFilledIcon,
    warning: ErrorCircleFilledIcon,
    error: ErrorCircleFilledIcon,
    question: HelpCircleFilledIcon,
    loading: LoadingIcon,
  };
  const THEME_LIST = Object.keys(THEME_MAP);
  describe(':props', () => {
    it('pure message contains right classes', async () => {
      const { container, getByText, unmount } = render(<Message>{defaultMessage}</Message>);
      expect(getByText(defaultMessage)).toBeInTheDocument();
      expect(container.firstChild).toHaveClass('t-message');
      expect(container.firstChild).toHaveClass('t-is-info');
      expect(container.firstChild).not.toHaveClass('t-message__close');
      expect(container).toMatchSnapshot();
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    it(`:theme ${THEME_LIST.join()}`, () => {
      THEME_LIST.forEach((t) => {
        const { container, unmount } = render(<Message theme={t}>{t}</Message>);
        expect(container.firstChild).toHaveClass(`t-is-${t}`);
        expect(container).toMatchSnapshot();
        expect(() => {
          unmount();
        }).not.toThrow();
      });
    });

    it(':closeBtn is true, render default close button.', () => {
      const { container } = render(<Message closeBtn={true}>{defaultMessage}</Message>);
      expect(container.firstChild).toHaveClass('t-is-closable');
      expect(container.getElementsByClassName('t-message__close').length).toBe(1);
      expect(container).toMatchSnapshot();
    });

    it(':closeBtn is a string, equal "关闭".', () => {
      const closeBtnTxt = '关闭';
      const { container, getByText } = render(<Message closeBtn={closeBtnTxt}>{defaultMessage}</Message>);
      expect(container.getElementsByClassName('t-message__close').length).toBe(1);
      expect(getByText(closeBtnTxt).textContent).toBe(closeBtnTxt);
      expect(container).toMatchSnapshot();
    });

    it(':closeBtn is a function, () => VNode.', () => {
      const { container, getByText } = render(<Message closeBtn={() => <b>x</b>}>{defaultMessage}</Message>);
      expect(container.getElementsByClassName('t-message__close').length).toBe(1);
      expect(getByText('x')).toBeInTheDocument();
      expect(container).toMatchSnapshot();
    });

    it(':icon is false', () => {
      const { container } = render(<Message icon={false}>{defaultMessage}</Message>);
      expect(container.firstChild).not.toHaveClass('t-icon');
      expect(container).toMatchSnapshot();
    });

    it(':icon is a function, () => TIconMore', () => {
      const { container } = render(<Message icon={() => <HelpIcon></HelpIcon>}>{defaultMessage}</Message>);
      // t-icon
      expect(container.firstChild).not.toHaveClass('t-icon');
      expect(container).toMatchSnapshot();
    });
    it(':default is a function, () => <b>这是重要信息</b>', () => {
      const { container } = render(<Message>{<b>这是重要信息</b>}</Message>);
      expect(container).toMatchSnapshot();
    });
  });

  // test events
  describe('@event', () => {
    it('onClickCloseBtn', async () => {
      const { getByText } = render(<Message closeBtn={'关闭'}>{defaultMessage}</Message>);
      // 模拟鼠标失焦
      act(() => {
        fireEvent.click(getByText('关闭'));
        jest.runAllTimers();
      });
    });
  });
});

import React from 'react';
import { testExamples, render } from '@test/utils';
import { Message } from '@tdesign/react';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Message 元素组件测试', () => {
  const defaultMessage = '默认的message';
  // const popupTestId = 'popup-test-id';
  // const triggerElement = '触发元素';

  test('pure message contains success', async () => {
    const { container, getByText, unmount } = render(<Message>{defaultMessage}</Message>);
    expect(getByText(defaultMessage)).toBeInTheDocument();
    expect(container.firstChild).toHaveClass('t-message');
    expect(container.firstChild).toHaveClass('t-is-info');
    expect(container.firstChild).not.toHaveClass('t-message-close');
    expect(container).toMatchSnapshot();
    expect(() => {
      unmount();
    }).not.toThrow();
  });
});

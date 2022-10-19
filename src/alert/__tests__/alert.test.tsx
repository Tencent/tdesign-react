import React from 'react';
import { render, fireEvent, waitFor, mockTimeout, act, vi } from '@test/utils';
import Alert from '../Alert';

describe('Alert 组件测试', () => {
  const testId = 'alert-test-id';
  const text = 'Alert内容';

  test('Alert 关闭操作', async () => {
    const onClose = vi.fn();
    const onClosed = vi.fn();

    const { queryByTestId, container } = render(
      <Alert
        theme="error"
        message={text}
        close={<div data-testid={testId}>{text}</div>}
        onClose={onClose}
        onClosed={onClosed}
      />,
    );
    expect(container.querySelector('.t-alert--closing')).not.toBeInTheDocument();

    act(() => {
      fireEvent.click(queryByTestId(testId));
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container.querySelector('.t-alert--closing')).toBeInTheDocument();

    await mockTimeout(() => expect(onClosed).toHaveBeenCalledTimes(1), 300);
  });

  test('Alert 展开收起操作', async () => {
    const massage = [
      <div key={0}>{text}</div>,
      <div key={1}>{text}</div>,
      <div key={2} data-testid={testId}>
        {text}
      </div>,
    ];
    const { queryByText, queryByTestId } = render(<Alert theme="error" message={massage} maxLine={2} />);
    const element = await waitFor(() => queryByTestId(testId));
    expect(element).toBeNull();

    const btn = await waitFor(() => queryByText('展开更多'));
    act(() => {
      fireEvent.click(btn);
    });

    const element1 = await waitFor(() => queryByTestId(testId));
    expect(element1).not.toBeNull();

    const btn1 = await waitFor(() => queryByText('收起'));
    act(() => {
      fireEvent.click(btn1);
    });

    const element3 = await waitFor(() => queryByTestId(testId));
    expect(element3).toBeNull();
  });
});

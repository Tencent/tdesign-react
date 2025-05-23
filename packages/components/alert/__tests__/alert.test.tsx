import React from 'react';
import { render, fireEvent, waitFor, mockTimeout, act, vi } from '@test/utils';
import Alert from '../Alert';

describe('Alert 组件测试', () => {
  const testId = 'alert-test-id';
  const text = 'Alert内容';

  test('Alert 关闭操作', async () => {
    const onClose = vi.fn();
    const onClosed = vi.fn();

    const { queryByTestId, container, queryByText } = render(
      <Alert
        theme="error"
        title="title content"
        message={text}
        close={<div data-testid={testId}>{text}</div>}
        onClose={onClose}
        onClosed={onClosed}
        operation={<span id="operation-test">test content</span>}
      />,
    );

    expect(container.querySelector('.t-alert--closing')).not.toBeInTheDocument();
    expect(container.querySelector('#operation-test')).not.toBeNull();
    expect(container.querySelector('#operation-test')).toBeInTheDocument();
    expect(queryByText('title content')).not.toBeNull();
    expect(queryByText('title content')).toBeInTheDocument();
    expect(container.querySelector('.t-alert--error')).not.toBeNull();
    expect(container.querySelector('.t-alert--error')).toBeInTheDocument();

    const element = queryByTestId(testId);
    if (element) {
      // 在 react 18.3.1之后 可以在 react 中导出 act,且在18.3.1 之后应该在react中使用 act
      act(() => fireEvent.click(element));
    } else {
      throw new Error(`Element with testId ${testId} not found`);
    }
    expect(container.querySelector('.t-alert--closing')).toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(1);

    await mockTimeout(() => expect(onClosed).toHaveBeenCalledTimes(1), 300);
  });

  test('custom close icon render', () => {
    const { queryByTestId } = render(
      <Alert theme="error" title="title content" close={<div data-testid={testId}>{text}</div>} />,
    );

    expect(queryByTestId(testId)).not.toBeNull();
    expect(queryByTestId(testId)).toBeInTheDocument();
  });

  test('default close icon render', () => {
    const { container } = render(<Alert theme="error" title="title content" close />);

    expect(container.querySelector('.t-icon-close')).not.toBeNull();
    expect(container.querySelector('.t-icon-close')).toBeInTheDocument();
  });

  test('custom icon render', () => {
    const { queryByText } = render(<Alert icon={<span>custom icon</span>} title="title content" />);

    expect(queryByText('custom icon')).not.toBeNull();
    expect(queryByText('custom icon')).toBeInTheDocument();
  });

  test('theme icon render', () => {
    const { container } = render(<Alert theme="success" title="title content" />);

    expect(container.querySelector('.t-icon-check-circle-filled')).not.toBeNull();
    expect(container.querySelector('.t-icon-check-circle-filled')).toBeInTheDocument();
  });

  test('default theme icon render', () => {
    const { container } = render(<Alert title="title content" />);

    expect(container.querySelector('.t-icon-info-circle-filled')).not.toBeNull();
    expect(container.querySelector('.t-icon-info-circle-filled')).toBeInTheDocument();
  });

  test('maxLine', () => {
    const { container } = render(<Alert title="title content" />);

    expect(container.querySelector('.t-alert__collapse')).toBeNull();
    expect(container.querySelector('.t-alert__collapse')).not.toBeInTheDocument();
  });

  test('message not collapsed', () => {
    const message = [
      <div key={0}>{text}</div>,
      <div key={1}>{text}</div>,
      <div key={2} data-testid={testId}>
        {text}
      </div>,
    ];
    const { container } = render(<Alert title="title content" message={message} />);
    const { container: container1 } = render(<Alert title="title content" message={message} maxLine={4} />);

    expect(container.querySelector('.t-alert__collapse')).toBeNull();
    expect(container.querySelector('.t-alert__collapse')).not.toBeInTheDocument();
    expect(container1.querySelector('.t-alert__collapse')).toBeNull();
    expect(container1.querySelector('.t-alert__collapse')).not.toBeInTheDocument();
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

    expect(queryByText('展开更多')).not.toBeNull();
    expect(queryByText('展开更多')).toBeInTheDocument();
    const element = await waitFor(() => queryByTestId(testId));
    expect(element).toBeNull();

    const btn = await waitFor(() => queryByText('展开更多'));
    if (btn) {
      act(() => fireEvent.click(btn));
    } else {
      throw new Error(`Button with text '展开更多' not found`);
    }

    expect(queryByText('收起')).not.toBeNull();
    expect(queryByText('收起')).toBeInTheDocument();
    const element1 = await waitFor(() => queryByTestId(testId));
    expect(element1).not.toBeNull();

    const btn1 = await waitFor(() => queryByText('收起'));
    if (btn1) {
      act(() => fireEvent.click(btn1));
    } else {
      throw new Error(`Button with text '收起' not found`);
    }
    const element3 = await waitFor(() => queryByTestId(testId));
    expect(element3).toBeNull();
  });

  test('className', () => {
    const { container } = render(<Alert theme="success" message="这是一条成功的消息提示" className="custom-class" />);
    expect(container.querySelector('.custom-class')).not.toBeNull();
  });

  test('style', () => {
    const { container } = render(<Alert theme="success" message="这是一条成功的消息提示" style={{ color: 'red' }} />);
    const element = container.querySelector('.t-alert') as HTMLElement;
    expect(element?.style.color).toBe('red');
  });
});

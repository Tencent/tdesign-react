import React from 'react';
import { testExamples, render, act, fireEvent, waitFor } from '@test/utils';
import Alert, { AlertProps } from '../Alert';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Alert 组件测试', () => {
  const testId = 'alert-test-id';
  const text = 'Alert内容';

  test('Alert 主题图标显示', () => {
    const props = {
      classPrefix: 't',
      message: text,
    };
    const { asFragment } = render(<Alert {...props} theme="error" />);
    expect(asFragment()).toMatchSnapshot();

    const { asFragment: asFragment2 } = render(<Alert {...props} theme="warning" />);
    expect(asFragment2()).toMatchSnapshot();

    const { asFragment: asFragment3 } = render(<Alert {...props} theme="info" />);
    expect(asFragment3()).toMatchSnapshot();

    const { asFragment: asFragment4 } = render(<Alert {...props} theme="success" />);
    expect(asFragment4()).toMatchSnapshot();

    const { asFragment: asFragment5 } = render(<Alert {...props} theme="error" icon />);
    expect(asFragment5()).toMatchSnapshot();

    const { asFragment: asFragment6 } = render(
      <Alert {...props} theme="error" icon={<span>CustomIcon</span>} />,
    );
    expect(asFragment6()).toMatchSnapshot();
  });

  test('Alert 关闭操作', async () => {
    const ref = React.createRef<AlertProps>();

    const { queryByTestId } = render(
      <Alert
        ref={ref}
        theme="error"
        meassage={text}
        close={<div data-testid={testId}>{text}</div>}
      />,
    );

    act(() => {
      fireEvent.click(queryByTestId(testId));
      jest.runAllTimers();
    });
    expect(ref.current).toBeNull();
  });

  test('Alert 展开收起操作', async () => {
    const massage = [
      <div key={0}>{text}</div>,
      <div key={1}>{text}</div>,
      <div key={2} data-testid={testId}>
        {text}
      </div>,
    ];
    const { queryByText, queryByTestId } = render(
      <Alert theme="error" message={massage} maxLine={2} />,
    );
    const element = await waitFor(() => queryByTestId(testId));
    expect(element).toBeNull();

    const btn = await waitFor(() => queryByText('展开更多'));
    act(() => {
      fireEvent.click(btn);
      jest.runAllTimers();
    });

    const element1 = await waitFor(() => queryByTestId(testId));
    expect(element1).not.toBeNull();

    const btn1 = await waitFor(() => queryByText('收起'));
    act(() => {
      fireEvent.click(btn1);
      jest.runAllTimers();
    });

    const element3 = await waitFor(() => queryByTestId(testId));
    expect(element3).toBeNull();
  });
});

import React from 'react';
import { testExamples, render, act, fireEvent, waitFor } from '@test/utils';
import { CheckCircleIcon } from 'tdesign-icons-react';
import Popconfirm from '../Popconfirm';
import Popcontent from '../Popcontent';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Popconfirm 组件测试', () => {
  const testId = 'popup-test-id';
  const triggerElement = '触发元素';
  const text = '弹出层描述';

  // test('hover 触发测试', async () => {
  //   const ref = React.createRef<PopconfirmRef>();

  //   const { getByText, queryByTestId, asFragment, queryByText } = render(
  //     <Popconfirm placement="top" content={<div data-testid={testId}>{text}</div>} theme="warning" ref={ref}>
  //       {triggerElement}
  //     </Popconfirm>,
  //   );

  //   // 鼠标进入前，没有元素存在
  //   const element1 = await waitFor(() => queryByTestId(testId));
  //   expect(element1).toBeNull();
  //   expect(ref.current).toBeNull();

  //   // 模拟鼠标进入
  //   act(() => {
  //     fireEvent.mouseEnter(getByText(triggerElement));
  //     jest.runAllTimers();
  //   });

  //   expect(ref.current).not.toBeNull();

  //   // 鼠标进入后，有元素，而且内容为 popupText + 两个按钮
  //   const element2 = await waitFor(() => queryByTestId(testId));
  //   expect(element2).not.toBeNull();
  //   expect(asFragment()).toMatchSnapshot();

  //   const cancelBtn = await waitFor(() => queryByText('取消'));
  //   expect(cancelBtn).not.toBeNull();
  //   const confirmBtn = await waitFor(() => queryByText('确定'));
  //   expect(confirmBtn).not.toBeNull();

  //   expect(ref.current).toMatchSnapshot();
  // });

  test('click 触发测试', async () => {
    const onCancelMock = jest.fn();
    const onConfirmMock = jest.fn();
    const { getByText, queryByTestId, queryByText } = render(
      <Popconfirm
        placement="top"
        content={<div data-testid={testId}>{text}</div>}
        onCancel={onCancelMock}
        onConfirm={onConfirmMock}
        destroyOnClose={false}
        confirmBtn="确认提交"
        cancelBtn="取消操作"
      >
        {triggerElement}
      </Popconfirm>,
    );

    // 鼠标点击前，没有元素存在
    const element1 = await waitFor(() => queryByTestId(testId));
    expect(element1).toBeNull();

    // 模拟鼠标点击
    act(() => {
      fireEvent.click(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为 popupText + 两个按钮
    const element2 = await waitFor(() => queryByTestId(testId));
    expect(element2).not.toBeNull();
    const cancelBtn = await waitFor(() => queryByText('取消操作'));
    expect(cancelBtn).not.toBeNull();
    const confirmBtn = await waitFor(() => queryByText('确认提交'));
    expect(confirmBtn).not.toBeNull();
    act(() => {
      fireEvent.click(cancelBtn);
      jest.runAllTimers();
    });

    expect(onCancelMock).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(confirmBtn);
      jest.runAllTimers();
    });

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  test('Popcontent - icon & theme snapshots', () => {
    const props = {
      classPrefix: 't',
      content: text,
    };
    const { asFragment } = render(<Popcontent {...props} theme="danger" />);
    expect(asFragment()).toMatchSnapshot();

    const { asFragment: asFragment2 } = render(<Popcontent {...props} theme="warning" />);
    expect(asFragment2()).toMatchSnapshot();

    const { asFragment: asFragment3 } = render(<Popcontent {...props} theme="default" />);
    expect(asFragment3()).toMatchSnapshot();

    const { asFragment: asFragment4 } = render(<Popcontent {...props} theme="default" />);
    expect(asFragment4()).toMatchSnapshot();

    // theme 生效
    const { asFragment: asFragment5 } = render(<Popcontent {...props} theme="danger" icon={<CheckCircleIcon />} />);
    expect(asFragment5()).toMatchSnapshot();

    // icon 生效
    const { asFragment: asFragment6 } = render(<Popcontent {...props} theme="danger" icon={<span>CustomIcon</span>} />);
    expect(asFragment6()).toMatchSnapshot();

    // icon 生效
    const { asFragment: asFragment7 } = render(<Popcontent {...props} theme="default" icon={<CheckCircleIcon />} />);
    expect(asFragment7()).toMatchSnapshot();

    // icon 生效
    const { asFragment: asFragment8 } = render(<Popcontent {...props} icon={<CheckCircleIcon />} />);
    expect(asFragment8()).toMatchSnapshot();

    // icon 生效
    const CustomIcon = () => <span>CustomIcon</span>;
    const { asFragment: asFragment9 } = render(<Popcontent {...props} theme="danger" icon={CustomIcon} />);
    expect(asFragment9()).toMatchSnapshot();
  });

  test('ref test', () => {
    render(
      <Popconfirm placement="top" content={<div data-testid={testId}>{text}</div>} theme="warning">
        {triggerElement}
      </Popconfirm>,
    );
  });
});

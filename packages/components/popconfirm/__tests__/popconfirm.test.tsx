import React from 'react';
import { render, act, fireEvent, waitFor, vi } from '@test/utils';
import Popconfirm from '../Popconfirm';

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
  //   });

  //   expect(ref.current).not.toBeNull();

  //   // 鼠标进入后，有元素，而且内容为 popupText + 两个按钮
  //   const element2 = await waitFor(() => queryByTestId(testId));
  //   expect(element2).not.toBeNull();

  //   const cancelBtn = await waitFor(() => queryByText('取消'));
  //   expect(cancelBtn).not.toBeNull();
  //   const confirmBtn = await waitFor(() => queryByText('确定'));
  //   expect(confirmBtn).not.toBeNull();
  // });

  test('click 触发测试', async () => {
    const onCancelMock = vi.fn();
    const onConfirmMock = vi.fn();
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
    });

    expect(onCancelMock).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(confirmBtn);
    });

    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  test('确认/取消按钮透传 null/object 测试', async () => {
    const onCancelMock = vi.fn();
    const onConfirmMock = vi.fn();
    const { getByText, queryByTestId, queryByText, queryAllByRole } = render(
      <Popconfirm
        placement="top"
        content={<div data-testid={testId}>{text}</div>}
        onCancel={onCancelMock}
        onConfirm={onConfirmMock}
        destroyOnClose={false}
        // 传入 null
        confirmBtn={null}
        // 传入 object
        cancelBtn={{ onClick: onCancelMock, content: '取消操作', theme: 'danger' }}
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
    });

    // 鼠标进入后，有元素，而且内容为 popupText， 且 confirmBtn={null} 只有一个按钮
    const element2 = await waitFor(() => queryByTestId(testId));
    expect(element2).not.toBeNull();

    // 测试只有一个按钮
    const buttons = await waitFor(() => queryAllByRole('button'));
    expect(buttons).toHaveLength(1);

    const cancelBtn = await waitFor(() => queryByText('取消操作'));
    // 查询 content 验证透传成功
    expect(cancelBtn).not.toBeNull();

    // 测试点击事件透传成功
    act(() => {
      fireEvent.click(cancelBtn);
    });
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  test('ref test', () => {
    render(
      <Popconfirm placement="top" content={<div data-testid={testId}>{text}</div>} theme="warning">
        {triggerElement}
      </Popconfirm>,
    );
  });
});

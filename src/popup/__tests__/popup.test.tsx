import React, { useState } from 'react';
import { testExamples, render, act, fireEvent, waitFor } from '@test/utils';
import { Popup } from '../Popup';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Popup 组件测试', () => {
  const popupText = '弹出层内容';
  const popupTestId = 'popup-test-id';
  const triggerElement = '触发元素';

  test('hover 触发测试', async () => {
    const { getByText, queryByTestId } = render(
      <Popup
        placement="top"
        content={<div data-testid={popupTestId}>{popupText}</div>}
      >
        {triggerElement}
      </Popup>
    );

    // 鼠标进入前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement1).toBeNull();

    // 模拟鼠标进入
    act(() => {
      fireEvent.mouseEnter(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(popupText);
    expect(popupElement2.parentElement).toHaveStyle({
      display: 'block',
    });

    // 模拟鼠标离开
    act(() => {
      fireEvent.mouseLeave(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3).not.toBeNull();
    expect(popupElement3.parentElement).toHaveStyle({
      display: 'none',
    });
  });

  test('click 触发测试', async () => {
    const { getByText, queryByTestId } = render(
      <Popup
        trigger="click"
        placement="top"
        content={<div data-testid={popupTestId}>{popupText}</div>}
      >
        {triggerElement}
      </Popup>
    );

    // 鼠标进入前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement1).toBeNull();

    // 模拟鼠标点击
    act(() => {
      fireEvent.click(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(popupText);
    expect(popupElement2.parentElement).toHaveStyle({
      display: 'block',
    });

    // 点击浮层
    act(() => {
      fireEvent.click(queryByTestId(popupTestId));
      jest.runAllTimers();
    });

    // 点击浮层也不隐藏
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3.parentElement).toHaveStyle({
      display: 'block',
    });

    // 模拟鼠标点击其他地方
    act(() => {
      fireEvent.click(document);
      jest.runAllTimers();
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement4 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement4).not.toBeNull();
    expect(popupElement4.parentElement).toHaveStyle({
      display: 'none',
    });
  });

  test('focus 触发测试', async () => {
    const { getByText, queryByTestId } = render(
      <Popup
        trigger="focus"
        placement="top"
        content={<div data-testid={popupTestId}>{popupText}</div>}
      >
        {triggerElement}
      </Popup>
    );

    // 鼠标进入前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement1).toBeNull();

    // 模拟鼠标聚焦
    act(() => {
      fireEvent.focus(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(popupText);
    expect(popupElement2.parentElement).toHaveStyle({
      display: 'block',
    });

    // 模拟鼠标失焦
    act(() => {
      fireEvent.blur(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3).not.toBeNull();
    expect(popupElement3.parentElement).toHaveStyle({
      display: 'none',
    });
  });

  test('多个触发方式测试', async () => {
    const { getByText, queryByTestId } = render(
      <Popup
        trigger={['click', 'hover']}
        placement="top"
        content={<div data-testid={popupTestId}>{popupText}</div>}
      >
        {triggerElement}
      </Popup>
    );

    // 鼠标进入前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement1).toBeNull();

    // 模拟鼠标右键
    act(() => {
      fireEvent.mouseEnter(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(popupText);
    expect(popupElement2.parentElement).toHaveStyle({
      display: 'block',
    });

    // 模拟鼠标点击其他地方
    act(() => {
      fireEvent.mouseLeave(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3).not.toBeNull();
    expect(popupElement3.parentElement).toHaveStyle({
      display: 'none',
    });

    // 模拟鼠标点击
    act(() => {
      fireEvent.click(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement4 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement4).not.toBeNull();
    expect(popupElement4.parentElement).toHaveStyle({
      display: 'block',
    });

    // 模拟鼠标点击其他地方
    act(() => {
      fireEvent.click(document);
      jest.runAllTimers();
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement5 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement5).not.toBeNull();
    expect(popupElement5.parentElement).toHaveStyle({
      display: 'none',
    });
  });

  test('contextMenu 触发测试', async () => {
    const { getByText, queryByTestId } = render(
      <Popup
        trigger="contextMenu"
        placement="top"
        content={<div data-testid={popupTestId}>{popupText}</div>}
      >
        {triggerElement}
      </Popup>
    );

    // 鼠标进入前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement1).toBeNull();

    // 模拟鼠标右键
    act(() => {
      fireEvent.contextMenu(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(popupText);
    expect(popupElement2.parentElement).toHaveStyle({
      display: 'block',
    });

    // 模拟鼠标点击其他地方
    act(() => {
      fireEvent.click(document);
      jest.runAllTimers();
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3).not.toBeNull();
    expect(popupElement3.parentElement).toHaveStyle({
      display: 'none',
    });
  });

  test('测试隐藏后销毁', async () => {
    const { getByText, queryByTestId } = render(
      <Popup
        destroyOnHide
        placement="top"
        content={<div data-testid={popupTestId}>{popupText}</div>}
      >
        {triggerElement}
      </Popup>
    );

    // 模拟鼠标进入
    act(() => {
      fireEvent.mouseEnter(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement2).not.toBeNull();

    // 模拟鼠标离开
    act(() => {
      fireEvent.mouseLeave(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3).toBeNull();
  });

  test('渲染到指定位置', async () => {
    // 提前创建一个容器
    const specialId = 'SPECIAL_ID';
    const $container = document.createElement('div');
    $container.id = specialId;
    document.body.appendChild($container);

    const { queryByTestId } = render(
      <Popup
        visible
        placement="top"
        getPopupContainer={() => $container}
        content={<div data-testid={popupTestId}>{popupText}</div>}
      >
        {triggerElement}
      </Popup>
    );

    // 弹出层的父元素的 id 为 SPECIAL_ID
    const popupElement = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement).not.toBeNull();

    expect(
      // 注意，这里层级有点多
      // #SPECIAL_ID
      // └-> .t-popup-container
      //   └-> div popper 定位层
      //     └-> div[data-testid="popup-test-id"]
      popupElement.parentElement.parentElement.parentElement
    ).toHaveAttribute('id', specialId);
  });

  test('受控展示&隐藏', async () => {
    const testShowButton = 'test-show-button';
    const testHideButton = 'test-hide-button';

    function TestComponent() {
      const [visible, setVisible] = useState(false);
      const $content = (
        <button data-testid={testHideButton} onClick={() => setVisible(false)}>
          隐藏
        </button>
      );

      return (
        <>
          <Popup
            destroyOnHide
            trigger="manual"
            visible={visible}
            content={$content}
          >
            <button
              data-testid={testShowButton}
              onClick={() => setVisible(true)}
            >
              显示
            </button>
          </Popup>
        </>
      );
    }

    const { queryByTestId } = render(<TestComponent />);

    // 鼠标点击前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(testHideButton));
    expect(popupElement1).toBeNull();

    // 模拟鼠标点击显示按钮
    act(() => {
      fireEvent.click(queryByTestId(testShowButton));
      jest.runAllTimers();
    });

    // 隐藏的按钮展示出来
    const popupElement2 = await waitFor(() => queryByTestId(testHideButton));
    expect(popupElement2).not.toBeNull();

    // 模拟鼠标点击隐藏按钮
    act(() => {
      fireEvent.click(queryByTestId(testHideButton));
      jest.runAllTimers();
    });

    // 隐藏的按钮消失
    const popupElement3 = await waitFor(() => queryByTestId(testHideButton));
    expect(popupElement3).toBeNull();
  });

  test('测试浮层附加属性及 content 为空', async () => {
    const testClassName = 'test-class-name';
    const testStyle = { color: '#ff0000' };
    const { getByText } = render(
      <Popup
        destroyOnHide
        placement="top"
        overlayStyle={testStyle}
        overlayClassName={testClassName}
      >
        {triggerElement}
      </Popup>
    );

    // 模拟鼠标进入
    act(() => {
      fireEvent.mouseEnter(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为空
    const popupContainer = await waitFor(() =>
      document.querySelector(`.${testClassName}`)
    );
    expect(popupContainer).not.toBeNull();
    expect(popupContainer).toHaveTextContent('');
    expect(popupContainer).toHaveStyle(testStyle);
  });

  test('异常情况：浮层隐藏时点击其他地方，浮层不可以展示出来', async () => {
    const testClassName = 'test-class-name';
    render(
      <Popup placement="top" overlayClassName={testClassName}>
        {triggerElement}
      </Popup>
    );

    // 浮层隐藏时，随便点击
    act(() => {
      fireEvent.click(document.body);
      jest.runAllTimers();
    });

    // 鼠标进入后，有元素，而且内容为空
    const popupContainer = await waitFor(() =>
      document.querySelector(`.${testClassName}`)
    );
    expect(popupContainer).toBeNull();
  });

  test('异常情况：getPopupContainer 传了非 HTMLElement 的元素', async () => {
    const testClassName = 'test-class-name';
    const { getByText } = render(
      <Popup
        visible
        placement="top"
        overlayClassName={testClassName}
        getPopupContainer={() => 'xxx' as any}
      >
        {triggerElement}
      </Popup>
    );

    // 浮层隐藏时，随便点击
    act(() => {
      fireEvent.click(getByText(triggerElement));
      jest.runAllTimers();
    });

    // 有元素，并且是渲染在 body 上
    const popupContainer = await waitFor(() =>
      document.querySelector(`.${testClassName}`)
    );
    expect(popupContainer.parentElement.parentElement).toBe(document.body);
  });
});

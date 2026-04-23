import React, { useState } from 'react';
import { act, fireEvent, mockTimeout, render, waitFor } from '@test/utils';
import Input from '../../input';
import Popup from '../Popup';

describe('Popup 组件测试', () => {
  const popupText = '弹出层内容';
  const popupTestId = 'popup-test-id';
  const triggerElement = '触发元素';

  test('hover 触发测试', async () => {
    const { getByText, queryByTestId } = render(
      <Popup placement="top" content={<div data-testid={popupTestId}>{popupText}</div>}>
        {triggerElement}
      </Popup>,
    );

    // 鼠标进入前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement1).toBeNull();

    // 模拟鼠标进入
    act(() => {
      fireEvent.mouseEnter(getByText(triggerElement));
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));

    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(popupText);
    expect(popupElement2.parentNode.parentNode).toHaveClass('t-popup--animation-enter-active');

    // 模拟鼠标离开
    act(() => {
      fireEvent.mouseLeave(getByText(triggerElement));
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3).not.toBeNull();
    expect(popupElement3.parentNode.parentNode).toHaveClass('t-popup--animation-leave-active');
  });

  test('click 触发测试', async () => {
    const { getByText, queryByTestId } = render(
      <Popup trigger="click" placement="top" content={<div data-testid={popupTestId}>{popupText}</div>}>
        {triggerElement}
      </Popup>,
    );

    // 鼠标进入前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement1).toBeNull();

    // 模拟鼠标点击
    act(() => {
      fireEvent.click(getByText(triggerElement));
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(popupText);
    expect(popupElement2.parentNode.parentNode).toHaveClass('t-popup--animation-enter-active');

    // 点击浮层
    act(() => {
      fireEvent.mouseDown(queryByTestId(popupTestId));
    });

    // 点击浮层也不隐藏
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3.parentNode.parentNode).toHaveClass('t-popup--animation-enter-active');

    // 模拟鼠标点击其他地方
    act(() => {
      fireEvent.mouseDown(document);
    });

    // 鼠标离开，style 的 display 应该为 none
    expect(queryByTestId(popupTestId)).not.toBeNull();
  });

  test('focus 触发测试', async () => {
    const inputPlaceholder = 'focus-trigger-input';
    const { getByPlaceholderText, queryByTestId } = render(
      <Popup trigger="focus" content={<div data-testid={popupTestId}>{popupText}</div>}>
        <Input placeholder={inputPlaceholder} />
      </Popup>,
    );

    // 聚焦前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement1).toBeNull();

    const inputEl = getByPlaceholderText(inputPlaceholder);
    act(() => {
      fireEvent.focus(inputEl);
    });

    // 聚焦后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(popupText);
    expect(popupElement2.parentNode.parentNode).toHaveClass('t-popup--animation-enter-active');

    act(() => {
      fireEvent.blur(inputEl);
    });

    // 失焦后，浮层进入离开动画
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3).not.toBeNull();
    expect(popupElement3.parentNode.parentNode).toHaveClass('t-popup--animation-leave-active');
  });

  test('contextMenu 触发测试', async () => {
    const { getByText, queryByTestId } = render(
      <Popup trigger="context-menu" placement="top" content={<div data-testid={popupTestId}>{popupText}</div>}>
        {triggerElement}
      </Popup>,
    );

    // 鼠标进入前，没有元素存在
    const popupElement1 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement1).toBeNull();

    // 模拟鼠标右键
    act(() => {
      fireEvent.contextMenu(getByText(triggerElement));
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    const popupElement2 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement2).not.toBeNull();
    expect(popupElement2).toHaveTextContent(popupText);
    expect(popupElement2.parentNode.parentNode).toHaveClass('t-popup--animation-enter-active');

    // 模拟鼠标点击其他地方
    act(() => {
      fireEvent.mouseDown(document);
    });

    // 鼠标离开，style 的 display 应该为 none
    const popupElement3 = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement3).not.toBeNull();
    expect(popupElement3.parentNode.parentNode).toHaveClass('t-popup--animation-leave-active');
  });

  test('测试隐藏后销毁', async () => {
    const { getByText, queryByTestId } = render(
      <Popup destroyOnClose placement="top" content={<div data-testid={popupTestId}>{popupText}</div>}>
        <span>{triggerElement}</span>
      </Popup>,
    );

    // 模拟鼠标进入
    act(() => {
      fireEvent.mouseEnter(getByText(triggerElement));
    });

    // 鼠标进入后，有元素，而且内容为 popupText
    expect(queryByTestId(popupTestId)).not.toBeNull();

    // 模拟鼠标离开
    act(() => {
      fireEvent.mouseLeave(getByText(triggerElement));
    });

    // 鼠标离开，style 的 display 应该为 none
    await mockTimeout(() => expect(queryByTestId(popupTestId)).toBeNull(), 400);
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
        attach={() => $container}
        content={<div data-testid={popupTestId}>{popupText}</div>}
      >
        {triggerElement}
      </Popup>,
    );

    // 弹出层的父元素的 id 为 SPECIAL_ID
    const popupElement = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement).not.toBeNull();

    expect(
      // 注意，这里层级有点多
      // #SPECIAL_ID
      // └-> .div
      //   └-> .t-popup
      //     └-> div popper 定位层
      //       └-> div[data-testid="popup-test-id"]
      popupElement.parentElement.parentElement.parentElement.parentElement,
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
        <Popup destroyOnClose visible={visible} content={$content}>
          <button data-testid={testShowButton} onClick={() => setVisible(true)}>
            显示
          </button>
        </Popup>
      );
    }

    const { queryByTestId } = render(<TestComponent />);

    // 鼠标点击前，没有元素存在
    expect(queryByTestId(testHideButton)).toBeNull();

    // 模拟鼠标点击显示按钮
    act(() => {
      fireEvent.click(queryByTestId(testShowButton));
    });

    // 隐藏的按钮展示出来
    expect(queryByTestId(testHideButton)).not.toBeNull();

    // 模拟鼠标点击隐藏按钮
    fireEvent.click(queryByTestId(testHideButton));

    // 隐藏的按钮消失
    await mockTimeout(() => expect(queryByTestId(testHideButton)).toBeNull());
  });

  test('测试浮层附加属性及 content 为空', async () => {
    const testClassName = 'test-class-name';
    const testStyle = { color: '#ff0000' };
    const { getByText } = render(
      <Popup destroyOnClose placement="top" overlayInnerStyle={testStyle} overlayClassName={testClassName}>
        {triggerElement}
      </Popup>,
    );

    // 模拟鼠标进入
    act(() => {
      fireEvent.mouseEnter(getByText(triggerElement));
    });

    // 鼠标进入后，没有元素，而且内容为空
    const popupContainer = await waitFor(() => document.querySelector(`.${testClassName}`));
    expect(popupContainer).toBeNull();
  });

  test('异常情况：浮层隐藏时点击其他地方，浮层不可以展示出来', async () => {
    const testClassName = 'test-class-name';
    render(
      <Popup placement="top" overlayClassName={testClassName}>
        {triggerElement}
      </Popup>,
    );

    // 浮层隐藏时，随便点击
    act(() => {
      fireEvent.click(document.body);
    });

    // 鼠标进入后，有元素，而且内容为空
    const popupContainer = await waitFor(() => document.querySelector(`.${testClassName}`));
    expect(popupContainer).toBeNull();
  });

  test('异常情况：getPopupContainer 传了非 HTMLElement 的元素', async () => {
    const testClassName = 'test-class-name';
    const { getByText } = render(
      <Popup visible placement="top" overlayClassName={testClassName} attach={() => 'xxx' as any}>
        {triggerElement}
      </Popup>,
    );

    // 浮层隐藏时，随便点击
    act(() => {
      fireEvent.click(getByText(triggerElement));
    });

    // 有元素，并且是渲染在 body 上
    const popupContainer = await waitFor(() => document.querySelector(`.${testClassName}`));
    expect(popupContainer.parentElement.parentElement).toBe(document.body);
  });

  test('disabled 子组件触发测试：hover 可触发，click 不可触发', async () => {
    const hoverPopupTestId = 'hover-popup-test-id';
    const clickPopupTestId = 'click-popup-test-id';
    const disabledButtonText = 'Disabled Button';

    const { getByText, queryByTestId } = render(
      <div>
        <Popup trigger="hover" content={<div data-testid={hoverPopupTestId}>Hover Popup Content</div>}>
          <button disabled>{disabledButtonText}</button>
        </Popup>

        <Popup trigger="click" content={<div data-testid={clickPopupTestId}>Click Popup Content</div>}>
          <button disabled>Disabled Click Button</button>
        </Popup>
      </div>,
    );

    const disabledButton = getByText(disabledButtonText);
    expect(queryByTestId(hoverPopupTestId)).toBeNull();
    act(() => {
      fireEvent.mouseEnter(disabledButton);
    });
    const hoverPopup = await waitFor(() => queryByTestId(hoverPopupTestId));
    expect(hoverPopup).not.toBeNull();
    expect(hoverPopup).toHaveTextContent('Hover Popup Content');
    act(() => {
      fireEvent.mouseLeave(disabledButton);
    });

    const disabledClickButton = getByText('Disabled Click Button');
    expect(queryByTestId(clickPopupTestId)).toBeNull();
    act(() => {
      fireEvent.click(disabledClickButton);
    });
    await waitFor(() => {
      expect(queryByTestId(clickPopupTestId)).toBeNull();
    });
  });
});

describe('Popup 嵌套组件测试', () => {
  const popupTestId = 'popup-test-id';
  const wrappedPopupTestId = 'wrapped-popup-test-id';
  const triggerElement = '外层触发元素';
  const wrappedTriggerElement = '内层触发元素';
  const wrappedPopupText = '内层浮层内容';

  const renderNestedPopup = (trigger: 'click' | 'hover') =>
    render(
      <Popup
        placement="top"
        trigger={trigger}
        destroyOnClose
        content={
          <Popup
            placement="top"
            trigger={trigger}
            destroyOnClose
            content={<div data-testid={wrappedPopupTestId}>{wrappedPopupText}</div>}
          >
            <div data-testid={popupTestId}>{wrappedTriggerElement}</div>
          </Popup>
        }
      >
        {triggerElement}
      </Popup>,
    );

  test('trigger="click"', async () => {
    const { getByText, queryByTestId } = renderNestedPopup('click');

    // 初始状态，浮层不存在
    expect(queryByTestId(popupTestId)).toBeNull();
    expect(queryByTestId(wrappedPopupTestId)).toBeNull();

    // click 外层触发器
    act(() => {
      fireEvent.click(getByText(triggerElement));
    });
    const popupElement = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement).not.toBeNull();

    // click 内层触发器
    act(() => {
      fireEvent.click(getByText(wrappedTriggerElement));
    });
    const wrappedPopupElement = await waitFor(() => queryByTestId(wrappedPopupTestId));
    expect(wrappedPopupElement).not.toBeNull();
    expect(wrappedPopupElement).toHaveTextContent(wrappedPopupText);

    // mouseDown 内层内容不关闭
    act(() => {
      fireEvent.mouseDown(queryByTestId(wrappedPopupTestId) as HTMLElement);
    });
    await waitFor(() => {
      expect(popupElement).not.toBeNull();
      expect(wrappedPopupElement).not.toBeNull();
    });
  });

  test('trigger="hover"', async () => {
    const { getByText, getByTestId, queryByTestId } = renderNestedPopup('hover');

    // 初始状态，浮层不存在
    expect(queryByTestId(popupTestId)).toBeNull();
    expect(queryByTestId(wrappedPopupTestId)).toBeNull();

    // hover 外层触发器
    act(() => {
      fireEvent.mouseEnter(getByText(triggerElement));
    });
    const popupElement = await waitFor(() => queryByTestId(popupTestId));
    expect(popupElement).not.toBeNull();

    // hover 内层触发器
    act(() => {
      fireEvent.mouseEnter(getByTestId(popupTestId));
    });
    const wrappedPopupElement = await waitFor(() => queryByTestId(wrappedPopupTestId));
    expect(wrappedPopupElement).not.toBeNull();
    expect(wrappedPopupElement).toHaveTextContent(wrappedPopupText);

    // mouseLeave 内层触发器
    act(() => {
      fireEvent.mouseLeave(getByTestId(popupTestId));
    });

    // 等待内层浮层销毁
    await waitFor(() => {
      expect(queryByTestId(wrappedPopupTestId)).toBeNull();
    });

    // mouseLeave 外层触发器
    act(() => {
      fireEvent.mouseLeave(getByText(triggerElement));
    });

    // 等待外层浮层销毁
    await waitFor(() => {
      expect(queryByTestId(popupTestId)).toBeNull();
    });
  });
});

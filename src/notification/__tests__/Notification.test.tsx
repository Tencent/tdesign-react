import React from 'react';
import { testExamples, render, fireEvent } from '@test/utils';
import { Notification, IconFont } from '@tencent/tdesign-react';

testExamples(__dirname);

describe('Notification test', () => {
  test('mount and unmount', () => {
    const wrapper = render(<Notification />);

    expect(() => wrapper.unmount()).not.toThrow();
  });

  test('set props', async () => {
    const titleId = 'title';
    const titleText = '标题';
    const contentId = 'content';
    const contentText = '内容';
    const closeBtnId = 'close';
    const closeBtnText = '关闭';
    const footerId = 'footer';

    const wrapper = render(
      <Notification
        title={<div data-testid={titleId}>{titleText}</div>}
        content={<div data-testid={contentId}>{contentText}</div>}
        theme="success"
        icon={<IconFont name="more" />}
        closeBtn={<div data-testid={closeBtnId}>{closeBtnText}</div>}
        footer={
          <div data-testid={footerId} className="t-notification__detail">
            <span className="t-notification__detail--item">确定</span>
          </div>
        }
        onClickCloseBtn={(event, instance) => instance.close()}
      />,
    );

    expect(wrapper.queryByTestId(titleId)).toHaveTextContent(titleText);
    expect(wrapper.queryByTestId(contentId)).toHaveTextContent(contentText);
    expect(wrapper.queryByTestId(closeBtnId)).toHaveTextContent(closeBtnText);
    expect(wrapper.queryByTestId(footerId)).not.toBeNull();
  });

  test('open and close', async () => {
    const notification = await Notification.open();

    expect(document.querySelectorAll('.t-notification').length).toBe(1);

    notification.close();

    expect(document.querySelectorAll('.t-notification').length).toBe(0);

    const notificationPromise = Notification.open();

    await notificationPromise;

    expect(document.querySelectorAll('.t-notification').length).toBe(1);

    await Notification.close(notificationPromise);

    expect(document.querySelectorAll('.t-notification').length).toBe(0);
  });

  test('open with theme', async () => {
    Notification.closeAll();

    await Notification.info();
    await Notification.success();
    await Notification.warning();
    await Notification.error();

    expect(document.querySelectorAll('.t-notification .t-is-info').length).toBe(1);
    expect(document.querySelectorAll('.t-notification .t-is-success').length).toBe(1);
    expect(document.querySelectorAll('.t-notification .t-is-warning').length).toBe(1);
    expect(document.querySelectorAll('.t-notification .t-is-error').length).toBe(1);
  });

  test('open with placement', async () => {
    Notification.closeAll();

    await Notification.open({ placement: 'top-left' });
    await Notification.open({ placement: 'top-right' });
    await Notification.open({ placement: 'bottom-left' });
    await Notification.open({ placement: 'bottom-right' });

    expect(document.querySelectorAll('.t-notification__show--top-left').length).toBe(1);
    expect(document.querySelectorAll('.t-notification__show--top-right').length).toBe(1);
    expect(document.querySelectorAll('.t-notification__show--bottom-left').length).toBe(1);
    expect(document.querySelectorAll('.t-notification__show--bottom-right').length).toBe(1);
  });

  test('auto close', async () => {
    Notification.closeAll();

    await Notification.open({ duration: 3000 });

    expect(document.querySelectorAll('.t-notification').length).toBe(1);

    jest.runAllTimers();

    expect(document.querySelectorAll('.t-notification').length).toBe(0);
  });

  test('click close button', async () => {
    Notification.closeAll();

    await Notification.open({
      closeBtn: <span id="close_button">关闭</span>,
    });

    fireEvent.click(document.querySelector('#close_button'));

    expect(document.querySelectorAll('.t-notification').length).toBe(0);
  });
});

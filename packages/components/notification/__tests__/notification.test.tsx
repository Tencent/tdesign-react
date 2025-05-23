import React from 'react';
import { render, fireEvent, mockTimeout } from '@test/utils';
import { Notification, NotificationPlugin } from '../index';

describe('Notification test', () => {
  test('mount and unmount', () => {
    const wrapper = render(<Notification />);

    expect(() => wrapper.unmount()).not.toThrow();
  });

  test('set props', async () => {
    const titleText = '标题';
    const contentId = 'content';
    const contentText = '内容';
    const closeBtnId = 'close';
    const closeBtnText = '关闭';
    const footerId = 'footer';

    const wrapper = render(
      <Notification
        title={titleText}
        content={<div data-testid={contentId}>{contentText}</div>}
        theme="success"
        icon={<div>test</div>}
        closeBtn={<div data-testid={closeBtnId}>{closeBtnText}</div>}
        footer={
          <div data-testid={footerId} className="t-notification__detail">
            <span className="t-notification__detail-item">确定</span>
          </div>
        }
      />,
    );

    /**
     * @desc 更改 title 的断言测试。新的 api title 只接受纯字符串，需要修改测试方法
     */
    const title = document.querySelectorAll('.t-notification__title');
    expect(title.length).toBe(1);
    expect(title[0].innerHTML).toBe(titleText);

    expect(wrapper.queryByTestId(contentId)).toHaveTextContent(contentText);
    expect(wrapper.queryByTestId(closeBtnId)).toHaveTextContent(closeBtnText);
    expect(wrapper.queryByTestId(footerId)).not.toBeNull();
  });

  test('open and close', async () => {
    NotificationPlugin.closeAll();

    const notification = await NotificationPlugin.info({});
    await mockTimeout(() => expect(document.querySelectorAll('.t-notification').length).toBe(1), 100);
    notification.close();
    await mockTimeout(() => expect(document.querySelectorAll('.t-notification').length).toBe(0), 100);

    const notificationPromise = NotificationPlugin.info({});

    await notificationPromise;

    await mockTimeout(() => expect(document.querySelectorAll('.t-notification').length).toBe(1), 100);
    await NotificationPlugin.close(notificationPromise);
    await mockTimeout(() => expect(document.querySelectorAll('.t-notification').length).toBe(0), 100);
  });

  test('open with theme', async () => {
    NotificationPlugin.closeAll();

    await NotificationPlugin.info({});
    await NotificationPlugin.success({});
    await NotificationPlugin.warning({});
    await NotificationPlugin.error({});

    await mockTimeout(() => expect(document.querySelectorAll('.t-notification .t-is-info').length).toBe(1), 100);
    await mockTimeout(() => expect(document.querySelectorAll('.t-notification .t-is-success').length).toBe(1), 100);
    await mockTimeout(() => expect(document.querySelectorAll('.t-notification .t-is-warning').length).toBe(1), 100);
    await mockTimeout(() => expect(document.querySelectorAll('.t-notification .t-is-error').length).toBe(1), 100);
  });

  test('open with placement', async () => {
    NotificationPlugin.closeAll();

    await NotificationPlugin.info({ placement: 'top-left' });
    await NotificationPlugin.info({ placement: 'top-right' });
    await NotificationPlugin.info({ placement: 'bottom-left' });
    await NotificationPlugin.info({ placement: 'bottom-right' });

    await mockTimeout(() => expect(document.querySelectorAll('.t-notification__show--top-left').length).toBe(1), 100);
    await mockTimeout(() => expect(document.querySelectorAll('.t-notification__show--top-right').length).toBe(1), 100);
    await mockTimeout(
      () => expect(document.querySelectorAll('.t-notification__show--bottom-left').length).toBe(1),
      100,
    );
    await mockTimeout(
      () => expect(document.querySelectorAll('.t-notification__show--bottom-right').length).toBe(1),
      100,
    );
  });

  test('auto close', async () => {
    NotificationPlugin.closeAll();

    await NotificationPlugin.info({ duration: 1000 });

    await mockTimeout(() => expect(document.querySelectorAll('.t-notification').length).toBe(1), 100);

    await mockTimeout(() => expect(document.querySelectorAll('.t-notification').length).toBe(0), 1200);
  });

  test('click close button', async () => {
    NotificationPlugin.closeAll();

    await NotificationPlugin.info({
      closeBtn: <span id="close_button">关闭</span>,
    });

    await mockTimeout(() => {
      fireEvent.click(document.querySelector('#close_button'));
      return expect(document.querySelectorAll('.t-notification').length).toBe(0);
    }, 300);
  });
});

import React from 'react';
import { fireEvent, mockTimeout, render } from '@test/utils';

import { Notification, NotificationPlugin } from '../index';

describe('Notification', () => {
  describe('props', () => {
    test('title', () => {
      const titleText = '标题';
      const { container } = render(<Notification title={titleText} />);
      expect(container.querySelector('.t-notification__title')).toHaveTextContent(titleText);
    });

    test('content[TNode]', () => {
      const { getByTestId } = render(<Notification content={<div data-testid="content">内容</div>} />);
      expect(getByTestId('content')).toHaveTextContent('内容');
    });

    test('closeBtn[TNode]', () => {
      const { getByTestId } = render(<Notification closeBtn={<div data-testid="close">关闭</div>} />);
      expect(getByTestId('close')).toHaveTextContent('关闭');
    });

    test('footer[TNode]', () => {
      const { getByTestId } = render(<Notification footer={<div data-testid="footer">确定</div>} />);
      expect(getByTestId('footer')).toBeInTheDocument();
    });

    test('default supports mount and unmount lifecycle', () => {
      const wrapper = render(<Notification />);
      expect(() => wrapper.unmount()).not.toThrow();
    });
  });

  describe('instanceFunctions', () => {
    test('NotificationPlugin.info and close manage instance lifecycle', async () => {
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

    test('NotificationPlugin theme methods create matching notification states', async () => {
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

    test('NotificationPlugin.info creates containers for every placement', async () => {
      NotificationPlugin.closeAll();

      await NotificationPlugin.info({ placement: 'top-left' });
      await NotificationPlugin.info({ placement: 'top-right' });
      await NotificationPlugin.info({ placement: 'bottom-left' });
      await NotificationPlugin.info({ placement: 'bottom-right' });

      await mockTimeout(() => expect(document.querySelectorAll('.t-notification__show--top-left').length).toBe(1), 100);
      await mockTimeout(
        () => expect(document.querySelectorAll('.t-notification__show--top-right').length).toBe(1),
        100,
      );
      await mockTimeout(
        () => expect(document.querySelectorAll('.t-notification__show--bottom-left').length).toBe(1),
        100,
      );
      await mockTimeout(
        () => expect(document.querySelectorAll('.t-notification__show--bottom-right').length).toBe(1),
        100,
      );
    });

    test('NotificationPlugin duration automatically closes an instance', async () => {
      NotificationPlugin.closeAll();

      await NotificationPlugin.info({ duration: 1000 });

      await mockTimeout(() => expect(document.querySelectorAll('.t-notification').length).toBe(1), 100);

      await mockTimeout(() => expect(document.querySelectorAll('.t-notification').length).toBe(0), 1200);
    });

    test('NotificationPlugin closeBtn closes an instance when clicked', async () => {
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
});

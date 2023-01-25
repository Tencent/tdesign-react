/* eslint-disable */
import { render, fireEvent, mockDelay } from '@test/utils';
import React, { useEffect } from 'react';

import Form from '../index';
import Input from '../../input';
import Button from '../../button';
import { HelpCircleIcon } from 'tdesign-icons-react';

const { FormItem } = Form;

describe('Form 组件测试', () => {
  test('setFieldsValue测试', async () => {
    const TestForm = () => {
      const [form] = Form.useForm();

      function setFields() {
        form.setFieldsValue({
          input1: 'value1',
          input2: 'value2',
        });
      }

      return (
        <Form form={form}>
          <FormItem label="input1" name="input1">
            <Input placeholder="input1" />
          </FormItem>
          <FormItem label="input2" name="input2">
            <Input placeholder="input2" />
          </FormItem>
          <FormItem>
            <Button onClick={setFields}>设置信息</Button>
          </FormItem>
        </Form>
      );
    };
    const res = render(<TestForm />);
    const { getByPlaceholderText, getByText } = res;

    // @ts-ignore
    expect(getByPlaceholderText('input1').value).toEqual('');
    // @ts-ignore
    expect(getByPlaceholderText('input2').value).toEqual('');

    fireEvent.click(getByText('设置信息'));

    // @ts-ignore
    expect(getByPlaceholderText('input1').value).toEqual('value1');
    // @ts-ignore
    expect(getByPlaceholderText('input2').value).toEqual('value2');
  });

  test('Form.reset works fine', async () => {
    const TestForm = () => {
      return (
        <Form>
          <FormItem name="input1">
            <Input placeholder="input1" />
          </FormItem>
          <FormItem>
            <Button type="reset">reset</Button>
          </FormItem>
        </Form>
      );
    };

    const { getByPlaceholderText, getByText } = render(<TestForm />);
    fireEvent.change(getByPlaceholderText('input1'), { target: { value: 'value1' } });
    expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual('value1');

    fireEvent.click(getByText('reset'));

    expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual('');
  });

  test('Form.setValidateMessage works fine', () => {
    const TestForm = () => {
      const [form] = Form.useForm();

      useEffect(() => {
        form.setValidateMessage({
          notArray: {
            //@ts-ignore
            type: 'error',
            message: 'not array message',
          },
          empty: [],
          username: [
            {
              type: 'error',
              message: 'custom error message',
            },
          ],
          password: [
            {
              type: 'warning',
              message: 'custom warning message',
            },
          ],
        });
      }, []);

      return (
        <Form form={form}>
          <FormItem className="not-array" label="notArray" name="notArray">
            <Input />
          </FormItem>
          <FormItem className="empty" label="empty" name="empty">
            <Input />
          </FormItem>
          <FormItem className="username" label="username" name="username">
            <Input />
          </FormItem>
          <FormItem className="password" label="password" name="password">
            <Input />
          </FormItem>
        </Form>
      );
    };

    const { container } = render(<TestForm />);
    expect(container.querySelector('.not-array .t-input__extra')).toBeNull();
    expect(container.querySelector('.empty .t-input__extra')).toBeNull();
    expect(container.querySelector('.username .t-input__extra').innerHTML).toBe('custom error message');
    expect(container.querySelector('.password .t-input__extra').innerHTML).toBe('custom warning message');
  });

  test('Form disabled `input` keydown enter submit form', async () => {
    const TestForm = () => {
      return (
        <Form statusIcon={false}>
          <FormItem name="username" rules={[{ required: true, message: 'please input username' }]}>
            <Input placeholder="username" />
          </FormItem>
        </Form>
      );
    };

    const { container, getByPlaceholderText } = render(<TestForm />);
    fireEvent.keyDown(getByPlaceholderText('username'), { key: 'Enter' });
    await mockDelay();
    expect(container.querySelector('.t-input__extra')).toBeNull();
  });

  test('FormItem without icon works fine', async () => {
    const TestForm = () => {
      return (
        <Form statusIcon={false}>
          <FormItem name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="username" />
          </FormItem>
          <FormItem>
            <Button type="submit">submit</Button>
          </FormItem>
        </Form>
      );
    };

    const { container, getByText } = render(<TestForm />);
    fireEvent.click(getByText('submit'));
    await mockDelay();
    expect(container.querySelector('.t-form__status')).toBeNull();
  });

  test('FormItem preset icon works fine', async () => {
    const TestForm = () => {
      return (
        <Form statusIcon>
          <FormItem
            initialData="mock username"
            className="username"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="username" />
          </FormItem>
          <FormItem
            className="email"
            name="email"
            rules={[{ required: true, message: '格式必须为邮箱', type: 'warning' }]}
          >
            <Input placeholder="email" />
          </FormItem>
          <FormItem
            className="phone"
            name="phone"
            rules={[{ required: true, message: '请输入手机号码', type: 'error' }]}
          >
            <Input placeholder="phone" />
          </FormItem>
          <FormItem
            className="help"
            name="help"
            statusIcon={<HelpCircleIcon name="help-circle" size="25px" />}
            rules={[{ required: true, message: '请输入帮助' }]}
          >
            <Input />
          </FormItem>
          <FormItem>
            <Button type="submit">submit</Button>
          </FormItem>
        </Form>
      );
    };

    const { container, getByText } = render(<TestForm />);
    expect(container.querySelector('.help .t-icon-help-circle')).toBeTruthy();
    fireEvent.click(getByText('submit'));
    await mockDelay();
    expect(container.querySelector('.username .t-icon-check-circle-filled')).toBeTruthy();
    expect(container.querySelector('.email .t-icon-error-circle-filled')).toBeTruthy();
    expect(container.querySelector('.phone .t-icon-close-circle-filled')).toBeTruthy();
    expect(container.querySelector('.help .t-icon-help-circle')).toBeTruthy();
  });

  test('FormItem.props.name can be array', () => {
    const mockName = 'name';
    const mockBirtyday = '1996-01-24';
    const TestForm = () => {
      return (
        <Form
          initialData={{
            user: {
              name: mockName,
            },
            birthday: mockBirtyday,
          }}
        >
          <FormItem label="姓名" name={['user', 'name']}>
            <Input placeholder="name" />
          </FormItem>
          <FormItem label="生日" name="birthday">
            <Input placeholder="birthday" />
          </FormItem>
        </Form>
      );
    };

    const { getByPlaceholderText } = render(<TestForm />);
    expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe(mockName);
    expect((getByPlaceholderText('birthday') as HTMLInputElement).value).toBe(mockBirtyday);
  });
});

/* eslint-disable */
import { render, fireEvent, mockDelay, mockTimeout, vi } from '@test/utils';
import React, { useEffect, useState } from 'react';

import Form, { TdFormProps } from '../index';
import Input from '../../input';
import Button from '../../button';
import { HelpCircleIcon } from 'tdesign-icons-react';

const { FormItem } = Form;

describe('Form 组件测试', () => {
  const submitFn = vi.fn();
  const resetFn = vi.fn();
  test('reset & submit', async () => {
    const { container } = render(
      <Form onSubmit={submitFn} onReset={resetFn} layout="vertical">
        <FormItem label="input1" name="input1" initialData={'test'}>
          <Input placeholder="input1" />
        </FormItem>
        <FormItem labelWidth={100}>
          <Input placeholder="no label" />
        </FormItem>
        <FormItem>
          <Button type="submit" id="test-submit">
            提交表单
          </Button>
          <Button type="reset" id="test-reset">
            重置表单
          </Button>
        </FormItem>
      </Form>,
    );

    fireEvent.click(container.querySelector('#test-reset'));
    expect(resetFn).toHaveBeenCalledTimes(1);
    fireEvent.click(container.querySelector('#test-submit'));
    await mockTimeout(() => true);
    expect(submitFn).toHaveBeenCalledTimes(1);
  });

  test('form instance', async () => {
    const TestForm = () => {
      const [form] = Form.useForm();

      function setFields() {
        form.getFieldsValue(true);
        form.setFields([{ name: 'input1', value: 'setFields' }]);
      }

      function setFieldsValue() {
        form.getFieldValue('input1');
        form.setFieldsValue({ input1: 'setFieldsValue' });
      }

      function setValidateMessage() {
        form.setValidateMessage({ input1: [{ type: 'error', message: 'message: setValidateMessage' }] });
      }

      function validate() {
        form.validate();
      }

      function validateOnly() {
        form.validateOnly();
      }

      function clearValidate() {
        form.clearValidate();
      }

      return (
        <Form form={form} labelWidth={100} colon>
          <FormItem label="input1" name="input1" rules={[{ required: true, message: 'input1 未填写', type: 'error' }]}>
            <Input placeholder="input1" />
          </FormItem>
          <FormItem>
            <Button type="reset">reset</Button>
            <Button onClick={setFields}>setFields</Button>
            <Button onClick={setFieldsValue}>setFieldsValue</Button>
            <Button onClick={setValidateMessage}>setValidateMessage</Button>
            <Button onClick={validate}>validate</Button>
            <Button onClick={validateOnly}>validateOnly</Button>
            <Button onClick={clearValidate}>clearValidate</Button>
          </FormItem>
        </Form>
      );
    };
    const { getByPlaceholderText, getByText, queryByText } = render(<TestForm />);

    // setFields setFieldsValue setValidateMessage test
    expect(getByPlaceholderText('input1').value).toEqual('');
    fireEvent.click(getByText('setFields'));
    expect(getByPlaceholderText('input1').value).toEqual('setFields');
    fireEvent.click(getByText('setFieldsValue'));
    expect(getByPlaceholderText('input1').value).toEqual('setFieldsValue');
    fireEvent.click(getByText('setValidateMessage'));
    expect(queryByText('message: setValidateMessage')).toBeTruthy();

    // validate validateOnly test
    fireEvent.click(getByText('validateOnly'));
    await mockTimeout(() => true);
    expect(queryByText('input1 未填写')).not.toBeTruthy();
    fireEvent.click(getByText('reset'));
    fireEvent.click(getByText('validate'));
    await mockTimeout(() => true);
    expect(queryByText('input1 未填写')).toBeTruthy();
    fireEvent.click(getByText('clearValidate'));
    expect(queryByText('input1 未填写')).not.toBeTruthy();
  });

  test('Form.reset works fine', async () => {
    const initialVal = 'test input';

    const TestForm = () => {
      const [resetType, setResetType] = useState<TdFormProps['resetType']>('initial');
      return (
        <div>
          <div>
            <Button onClick={() => setResetType('empty')}>reset-empty</Button>
            <Button onClick={() => setResetType('initial')}>reset-initial</Button>
          </div>
          <Form resetType={resetType}>
            <FormItem initialData={initialVal} name="input1">
              <Input placeholder="input1" />
            </FormItem>
            <FormItem>
              <Button type="reset">reset</Button>
            </FormItem>
          </Form>
        </div>
      );
    };

    const { getByPlaceholderText, getByText } = render(<TestForm />);
    expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual(initialVal);

    const inputThenReset = () => {
      fireEvent.change(getByPlaceholderText('input1'), { target: { value: 'value1' } });
      expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual('value1');
      fireEvent.click(getByText('reset'));
    };

    // test initial value
    inputThenReset();
    expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual(initialVal);

    // test empty value
    fireEvent.click(getByText('reset-empty'));
    inputThenReset();
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
        <Form>
          <FormItem name="username" rules={[{ required: true, message: 'please input username' }]}>
            <Input placeholder="username" />
          </FormItem>
          <FormItem>
            <Button type="submit">submit</Button>
          </FormItem>
        </Form>
      );
    };

    const { container, getByPlaceholderText, getByText } = render(<TestForm />);
    fireEvent.keyDown(getByPlaceholderText('username'), { key: 'Enter' });
    await mockDelay();
    expect(container.querySelector('.t-input__extra')).toBeNull();

    fireEvent.keyDown(getByText('submit'), { key: 'Enter' });
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

  test('FormItem blur validate works fine', async () => {
    const TestForm = () => {
      return (
        <Form>
          <FormItem name="username" rules={[{ required: true, trigger: 'blur', message: 'please input username' }]}>
            <Input placeholder="username" />
          </FormItem>
        </Form>
      );
    };
    const { container, getByPlaceholderText } = render(<TestForm />);
    fireEvent.blur(getByPlaceholderText('username'));
    await mockDelay();
    expect(container.querySelector('.t-input__extra').innerHTML).toBe('please input username');
  });
});

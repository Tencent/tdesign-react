/* eslint-disable */
import { render, fireEvent } from '@test/utils';
import React from 'react';

import Form from '../index';
import Input from '../../input';
import Button from '../../button';

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
});

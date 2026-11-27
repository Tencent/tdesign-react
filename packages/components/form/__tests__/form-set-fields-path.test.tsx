import React from 'react';
import { act, render } from '@test/utils';

import Input from '../../input';
import FormList from '../FormList';
import Form from '../index';

const { FormItem } = Form;

describe('Form setFieldsValue path', () => {
  it('resolves an indexed string path to the FormItem inside a FormList', async () => {
    let formApi: ReturnType<typeof Form.useForm>[0];

    const TestView = () => {
      const [form] = Form.useForm();
      formApi = form;
      return (
        <Form form={form}>
          <FormList name="address">
            {(fields) =>
              fields.map(({ key, name }) => (
                <FormItem key={key} name={[name, 'province']} label="province">
                  <Input />
                </FormItem>
              ))
            }
          </FormList>
        </Form>
      );
    };

    render(<TestView />);

    await act(async () => {
      formApi.setFieldsValue({ address: [{ province: 'init' }] });
    });
    expect(formApi.getFieldValue('address')).toEqual([{ province: 'init' }]);

    await act(async () => {
      formApi.setFieldsValue({ 'address[0].province': 'indexed' });
    });

    expect(formApi.getFieldValue('address')).toEqual([{ province: 'indexed' }]);
  });

  it('keeps a dotted FormItem name working as a single segment', async () => {
    let formApi: ReturnType<typeof Form.useForm>[0];

    const TestView = () => {
      const [form] = Form.useForm();
      formApi = form;
      return (
        <Form form={form}>
          <FormItem name="user.name" label="name">
            <Input />
          </FormItem>
        </Form>
      );
    };

    render(<TestView />);

    await act(async () => {
      formApi.setFieldsValue({ 'user.name': 'alice' });
    });

    expect(formApi.getFieldValue(['user.name'])).toBe('alice');
  });
});

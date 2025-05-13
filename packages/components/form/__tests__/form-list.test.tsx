import { render, fireEvent, mockTimeout } from '@test/utils';
import React from 'react';

import { MinusCircleIcon } from 'tdesign-icons-react';
import Input from '../../input';
import Form, { type FormProps } from '../index';
import FormList from '../FormList';
import Button from '../../button';

const { FormItem } = Form;

const BasicForm = (props: FormProps & { operation }) => {
  const { form, operation, ...restField } = props;

  return (
    <Form form={form} {...restField}>
      <FormList name="address">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <FormItem key={key}>
                <FormItem
                  {...restField}
                  name={[name, 'province']}
                  label="省份"
                  rules={[{ required: true, type: 'error' }]}
                >
                  <Input />
                </FormItem>
                <FormItem
                  {...restField}
                  name={[name, 'area']}
                  label="地区"
                  rules={[{ required: true, type: 'error' }]}
                >
                  <Input placeholder={`area-input-${index}`} />
                </FormItem>

                <FormItem>
                  <MinusCircleIcon className={`test-remove-${index}`} onClick={() => remove(name)} />
                </FormItem>
              </FormItem>
            ))}
            <FormItem style={{ marginLeft: 100 }}>
              <Button id="test-add" onClick={() => add()}>
                Add empty field
              </Button>
              <Button id="test-add-with-data" onClick={() => add({ province: 'guangdong', area: 'shenzhen' })}>
                Add field with data
              </Button>
            </FormItem>
          </>
        )}
      </FormList>
      <FormItem>
        {operation()}
      </FormItem>
    </Form>
  )
}

describe('Form List 组件测试', () => {
  test('form list 测试', async () => {
    const TestView = () => {
      const [form] = Form.useForm();

      function setFields() {
        form.getFieldsValue(true);
        form.setFields([{ name: 'address', value: [{ province: 'setFields' }] }]);
      }

      function setFieldsValue() {
        form.getFieldValue('address');
        form.setFieldsValue({ address: [{ province: 'setFieldsValue' }] });
      }

      function setValidateMessage() {
        form.setValidateMessage({ address: [{ type: 'error', message: 'message: setValidateMessage' }] });
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
        <BasicForm form={form} operation={() => (
          <>
            <Button type="submit">submit</Button>
            <Button type="reset">reset</Button>
            <Button onClick={setFields}>setFields</Button>
            <Button onClick={setFieldsValue}>setFieldsValue</Button>
            <Button onClick={setValidateMessage}>setValidateMessage</Button>
            <Button onClick={validate}>validate</Button>
            <Button onClick={validateOnly}>validateOnly</Button>
            <Button onClick={clearValidate}>clearValidate</Button>
          </>
        )} />
      );
    };

    const { container, queryByDisplayValue, queryByText } = render(<TestView />);
    const addBtn = container.querySelector('#test-add-with-data');
    const submitBtn = queryByText('submit');
    const resetBtn = queryByText('reset');

    fireEvent.click(addBtn);
    expect(queryByDisplayValue('guangdong')).toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).toBeTruthy();
    fireEvent.click(resetBtn);
    fireEvent.click(submitBtn);
    await mockTimeout(() => true);
    expect(queryByText('guangdong')).not.toBeTruthy();
    expect(queryByText('shenzhen')).not.toBeTruthy();

    fireEvent.click(addBtn);
    expect(queryByDisplayValue('guangdong')).toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).toBeTruthy();
    const removeBtn = container.querySelector('.test-remove-0');
    fireEvent.click(removeBtn);
    expect(queryByDisplayValue('guangdong')).not.toBeTruthy();
    expect(queryByDisplayValue('shenzhen')).not.toBeTruthy();

    fireEvent.click(queryByText('setFields'));
    await mockTimeout(() => true);
    expect(queryByDisplayValue('setFields')).toBeTruthy();
    fireEvent.click(queryByText('setFieldsValue'));
    await mockTimeout(() => true);
    expect(queryByDisplayValue('setFieldsValue')).toBeTruthy();

    // validate validateOnly test
    fireEvent.click(queryByText('validateOnly'));
    await mockTimeout(() => true);
    expect(queryByText('省份必填')).not.toBeTruthy();
    fireEvent.click(queryByText('validate'));
    await mockTimeout(() => true);
    expect(queryByText('地区必填')).toBeTruthy();
    fireEvent.click(queryByText('clearValidate'));
    expect(queryByText('地区必填')).not.toBeTruthy();
  });

  test('reset to initial data', async () => {
    const TestView = () => {
      const [form] = Form.useForm();

      const initialFormData = {
        address: [
          { province: 'guangdong', area: 'shenzhen' },
          { province: 'beijing', area: 'beijing' }
        ]
      };

      return (
        <BasicForm
          form={form}
          initialData={initialFormData}
          resetType='initial'
          operation={
            () => <Button type="reset">reset</Button>
          }
        />
      );
    };

    const { container, queryByText, getByPlaceholderText } = render(<TestView />);
    const resetBtn = queryByText('reset');

    const removeBtn = container.querySelector('.test-remove-0');
    fireEvent.click(removeBtn);
    await mockTimeout(() => true);
    expect((getByPlaceholderText('area-input-0') as HTMLInputElement).value).toBe('beijing');
    fireEvent.click(resetBtn);
    await mockTimeout(() => true);
    expect((getByPlaceholderText('area-input-0') as HTMLInputElement).value).toBe('shenzhen');
    expect((getByPlaceholderText('area-input-1') as HTMLInputElement).value).toBe('beijing');
  })
});

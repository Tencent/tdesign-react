import React from 'react';
import { Form, Input, Button, Select } from 'tdesign-react';
import { MinusCircleIcon } from 'tdesign-icons-react';

const { FormItem, FormList } = Form;

const provinceOptions = [
  { label: '北京', value: 'bj' },
  { label: '上海', value: 'sh' },
  { label: '广州', value: 'gz' },
  { label: '深圳', value: 'sz' },
];

export default function BaseForm() {
  const [form] = Form.useForm();

  function onSubmit() {
    const allFields = form.getFieldsValue(true);
    console.log('allFields', allFields);
  }
  function setValues() {
    form.setFieldsValue({
      address: [
        {
          province: 'sz',
        },
        {
          province: 'bj',
        },
      ],
      address2: [
        {
          province: 'sh',
        },
      ],
    });
    // form.setFields([
    //   { name: 'address', value: [
    //     {
    //       province: 'sz',
    //       area: 'tzmax',
    //     },
    //     {
    //       province: 'bj',
    //       area: 'tzmax',
    //     },
    //   ]},
    //   { name: 'address2', value: [
    //     {
    //       province: 'bj',
    //       area: 'tzmax',
    //     },
    //     {
    //       province: 'sh',
    //       area: 'tzmax',
    //     },
    //   ]},
    // ])
  }

  function onValuesChange(v, alVal) {
    console.log('onValuesChange', v, alVal);
  }

  return (
    <Form form={form} onSubmit={onSubmit} onValuesChange={onValuesChange}>
      <FormList name="address">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <FormItem key={key}>
                <FormItem
                  {...restField}
                  name={[name, 'province']}
                  label="省份"
                  rules={[{ required: true, type: 'error' }]}
                >
                  <Select options={provinceOptions}></Select>
                </FormItem>
              </FormItem>
            ))}
          </>
        )}
      </FormList>
      <FormList name="address2">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <FormItem key={key}>
                <FormItem
                  {...restField}
                  name={[name, 'province']}
                  label="省份"
                  rules={[{ required: true, type: 'error' }]}
                >
                  <Select options={provinceOptions}></Select>
                </FormItem>
              </FormItem>
            ))}
          </>
        )}
      </FormList>
      <FormItem style={{ marginLeft: 100 }}>
        <Button type="submit" theme="primary">
          提交
        </Button>
        <Button onClick={setValues} style={{ marginLeft: 12 }}>
          点我设置值
        </Button>
      </FormItem>
    </Form>
  );
}

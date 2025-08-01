import React from 'react';
import { MinusCircleIcon } from 'tdesign-icons-react';
import { Button, Form, Input, Select } from 'tdesign-react';

const { FormItem, FormList } = Form;

const cityOptions = [
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

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      initialData={{
        address: [
          { city: 'bj', area: '海淀区' },
          { city: 'sh', area: '浦东区' },
        ],
      }}
      resetType="initial"
    >
      <FormList name="address">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <FormItem key={key}>
                <FormItem name={[name, 'city']} label="城市" rules={[{ required: true, type: 'error' }]} {...restField}>
                  <Select options={cityOptions}></Select>
                </FormItem>
                <FormItem {...restField} name={[name, 'area']} label="地区" rules={[{ required: true, type: 'error' }]}>
                  <Input />
                </FormItem>

                <FormItem>
                  <MinusCircleIcon size="20px" style={{ cursor: 'pointer' }} onClick={() => remove(name)} />
                </FormItem>
              </FormItem>
            ))}
            <FormItem style={{ marginLeft: 100 }}>
              <Button theme="default" variant="dashed" onClick={() => add({ city: 'sz', area: '南山区' })}>
                新增指定项
              </Button>
            </FormItem>
          </>
        )}
      </FormList>
      <FormItem style={{ marginLeft: 100 }}>
        <Button type="submit" theme="primary">
          提交
        </Button>
        <Button type="reset" style={{ marginLeft: 12 }}>
          重置
        </Button>
      </FormItem>
    </Form>
  );
}

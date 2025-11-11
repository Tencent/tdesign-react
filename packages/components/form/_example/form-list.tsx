import React from 'react';
import { MinusCircleIcon } from 'tdesign-icons-react';
import { Button, Form, Input, Select, Space } from 'tdesign-react';

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
      onValuesChange={(change, all) => {
        console.log('change:', change, JSON.stringify(change));
        console.log('all:', all, JSON.stringify(all));
      }}
      resetType="initial"
    >
      <FormList name="address">
        {(fields, { add, remove, move }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => (
              <FormItem key={key}>
                <FormItem name={[name, 'city']} label="城市" rules={[{ required: true, type: 'error' }]} {...restField}>
                  <Select options={cityOptions} />
                </FormItem>

                <FormItem name={[name, 'area']} label="地区" rules={[{ required: true, type: 'error' }]} {...restField}>
                  <Input />
                </FormItem>

                <FormItem>
                  <Space>
                    <MinusCircleIcon
                      size="20px"
                      style={{ cursor: 'pointer', marginRight: 12 }}
                      onClick={() => remove(name)}
                    />
                    <Button
                      size="small"
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                      style={{ marginRight: 8 }}
                    >
                      上移
                    </Button>
                    <Button size="small" disabled={index === fields.length - 1} onClick={() => move(index, index + 1)}>
                      下移
                    </Button>
                  </Space>
                </FormItem>
              </FormItem>
            ))}
            <FormItem style={{ marginLeft: 100 }}>
              <Space>
                <Button theme="default" variant="dashed" onClick={() => add({ city: 'sz', area: '南山区' })}>
                  新增指定项
                </Button>
                <Button theme="default" variant="dashed" onClick={() => add()}>
                  新增空白项
                </Button>
              </Space>
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

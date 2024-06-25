import React from 'react';
import { Form, Input, Radio, Checkbox, Button, MessagePlugin, DatePicker } from 'tdesign-react';
import { MinusCircleIcon } from 'tdesign-icons-react';

const { FormItem, FormList } = Form;

export default function BaseForm() {
  const [form] = Form.useForm();

  const user = Form.useWatch('user', form);
  console.log('user', user);

  const onSubmit = (e) => {
    console.log(e);
    if (e.validateResult === true) {
      MessagePlugin.info('提交成功');
    }
  };

  const setData = () => {
    console.log('getFieldsValue all: ', form.getFieldsValue?.(true));
    console.log('getFieldsValue: ', form.getFieldsValue?.([['user', 'name']]));
    console.log('getFieldValue: ', form.getFieldValue?.(['user', 'name']));
    form.setFieldsValue?.({ birthday: '2020-01-01' });
    form.setFieldsValue?.({ user: { gender: 'male' } });
    form.setFields?.([{ name: ['user', 'course'], value: ['la'] }]);
  };

  const onReset = (e) => {
    console.log(e);
    MessagePlugin.info('重置成功');
  };

  const onValuesChange = (value) => {
    console.log(value);
  };

  return (
    <Form
      initialData={{
        user: {
          name: 'name',
          age: 'age',
        },
        birthday: '2022-08-08',
      }}
      form={form}
      onSubmit={onSubmit}
      onReset={onReset}
      colon
      labelWidth={100}
      onValuesChange={onValuesChange}
    >
      <FormItem label="姓名" name={['user', 'name']} rules={[{ required: true }]}>
        <Input />
      </FormItem>
      <FormItem label="年龄" name={['user', 'age']}>
        <Input />
      </FormItem>
      <FormItem label="性别" name={['user', 'gender']}>
        <Radio.Group>
          <Radio value="male">男性</Radio>
          <Radio value="female">女性</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem label="课程" name={['user', 'course']}>
        <Checkbox.Group>
          <Checkbox value="la">加辣</Checkbox>
          <Checkbox value="ma">加麻</Checkbox>
          <Checkbox value="nocong">不要葱花</Checkbox>
        </Checkbox.Group>
      </FormItem>
      <FormItem label="出生日期" name="birthday">
        <DatePicker />
      </FormItem>
      <FormList name={['user', 'address']}>
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
                  <Input />
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
              <Button theme="default" variant="dashed" onClick={() => add({ province: 'bj', area: 'tzmax' })}>
                Add field
              </Button>
            </FormItem>
          </>
        )}
      </FormList>
      <FormItem style={{ marginLeft: 100 }}>
        <Button type="submit" theme="primary">
          提交
        </Button>
        <Button theme="primary" onClick={setData} style={{ marginLeft: 12 }}>
          设置信息
        </Button>
        <Button type="reset" style={{ marginLeft: 12 }}>
          重置
        </Button>
      </FormItem>
    </Form>
  );
}

import React from 'react';
import { Form, Input, Radio, Checkbox, Button, Switch, MessagePlugin, DatePicker, Tooltip, Space } from 'tdesign-react';

const { FormItem } = Form;

export default function BaseForm() {
  const [form] = Form.useForm();

  const name = Form.useWatch('name', form);
  const gender = Form.useWatch('gender', form);
  console.log('name', name);
  console.log('gender', gender);

  const onSubmit = (e) => {
    console.log(e);
    if (e.validateResult === true) {
      MessagePlugin.info('提交成功');
    }
  };

  const onReset = (e) => {
    console.log(e);
    MessagePlugin.info('重置成功');
  };

  const setMessage = () => {
    console.log(form);
    form.setFields([
      { name: 'name', status: 'error', validateMessage: { type: 'error', message: '输入有误' } },
      { name: 'birthday', status: 'warning', validateMessage: { type: 'warning', message: '时间有误' } },
    ]);
  };

  return (
    <Form form={form} onSubmit={onSubmit} onReset={onReset} colon labelWidth={100}>
      <FormItem label="姓名" name="name">
        <Input />
      </FormItem>
      <FormItem label="出生日期" name="birthday">
        <DatePicker mode="date" />
      </FormItem>
      <FormItem label="性别" name="gender">
        <Radio.Group>
          <Radio value="male">男性</Radio>
          <Radio value="female">女性</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem shouldUpdate={(prev, next) => prev.gender !== next.gender}>
        {({ getFieldValue }) => {
          if (getFieldValue('gender') === 'female') {
            return (
              <FormItem label="动态选项2" name="bar">
                <Radio.Group>
                  <Radio value="2">选项三</Radio>
                  <Radio value="3">选项四</Radio>
                </Radio.Group>
              </FormItem>
            );
          }
          return (
            <FormItem label="动态选项1" name="foo">
              <Radio.Group>
                <Radio value="0">选项一</Radio>
                <Radio value="1">选项二</Radio>
              </Radio.Group>
            </FormItem>
          );
        }}
      </FormItem>
      <FormItem label="课程" name="course">
        <Checkbox.Group>
          <Checkbox value="la">加辣</Checkbox>
          <Checkbox value="ma">加麻</Checkbox>
          <Checkbox value="nocong">不要葱花</Checkbox>
        </Checkbox.Group>
      </FormItem>
      <FormItem label="状态" name="status" for="status">
        <Switch />
      </FormItem>
      <FormItem label="自定义内容" for="custom">
        <div style={{ display: 'flex', gap: 8 }}>
          <FormItem name="custom">
            <Input />
          </FormItem>
          <Tooltip content="文字链提示信息">
            <Button variant="text">文字链</Button>
          </Tooltip>
        </div>
      </FormItem>
      <FormItem style={{ marginLeft: 100 }}>
        <Space>
          <Button type="submit" theme="primary">
            提交
          </Button>
          <Button onClick={setMessage}>设置信息</Button>
          <Button type="reset" theme="default">
            重置
          </Button>
        </Space>
      </FormItem>
    </Form>
  );
}

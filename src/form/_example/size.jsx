import React, { useState } from 'react';
import { Form, Input, Radio, Button, MessagePlugin, Switch, Space } from 'tdesign-react';

const { FormItem } = Form;

export default function BaseForm() {
  const [size, setSize] = useState('medium');

  const onSubmit = ({ validateResult, firstError }) => {
    if (validateResult === true) {
      MessagePlugin.success('提交成功');
    } else {
      console.log('Errors: ', validateResult);
      MessagePlugin.warning(firstError);
    }
  };

  const onReset = (e) => {
    console.log(e);
    MessagePlugin.info('重置成功');
  };

  const courseOptions = [
    { label: '语文', value: '1' },
    { label: '数学', value: '2' },
    { label: '英语', value: '3' },
  ];

  return (
    <Space direction="vertical">
      <div>
        <Radio.Group value={size} onChange={(value) => setSize(value)} variant="default-filled">
          <Radio.Button value="medium">中尺寸（默认）</Radio.Button>
          <Radio.Button value="large">大尺寸</Radio.Button>
        </Radio.Group>
      </div>

      <Form size={size} onReset={onReset} onSubmit={onSubmit}>
        <FormItem label="姓名" name="name">
          <Input placeholder="请输入内容" />
        </FormItem>
        <FormItem label="手机号码" name="tel">
          <Input placeholder="请输入内容" />
        </FormItem>
        <FormItem label="接收短信" name="status">
          <Switch />
        </FormItem>
        <FormItem label="性别" name="gender">
          <Radio.Group>
            <Radio value="1">男</Radio>
            <Radio value="2">女</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="课程" name="course">
          <Radio.Group options={courseOptions}></Radio.Group>
        </FormItem>
        <FormItem style={{ paddingTop: 8 }}>
          <Button theme="primary" type="submit" style={{ marginRight: 10 }}>
            提交
          </Button>
          <Button theme="default" variant="base" type="reset">
            重置
          </Button>
        </FormItem>
      </Form>
    </Space>
  );
}

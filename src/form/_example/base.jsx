import React from 'react';
import { Form, Input, Radio, Checkbox, Button, Switch, Message } from '@tencent/tdesign-react';

const { FormItem } = Form;

export default function BaseForm() {
  const onSubmit = (e) => {
    console.log(e);
    if (e.validateResult === true) {
      Message.info('提交成功');
    }
  };

  const onReset = (e) => {
    console.log(e);
    Message.info('重置成功');
  };

  return (
    <div>
      <Form labelWidth={100} onSubmit={onSubmit} onReset={onReset} colon>
        <FormItem label="姓名" name="name">
          <Input />
        </FormItem>
        <FormItem label="手机号" name="tel">
          <Input />
        </FormItem>
        <FormItem label="性别" name="gender">
          <Radio.Group>
            <Radio value="male">男性</Radio>
            <Radio value="female">女性</Radio>
          </Radio.Group>
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
        <FormItem>
          <Button type="submit" theme="primary">
            提交
          </Button>
          <Button type="reset" style={{ marginLeft: 12 }}>
            重置
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

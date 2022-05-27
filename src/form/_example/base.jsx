import React, { useRef } from 'react';
import { Form, Input, Radio, Checkbox, Button, Switch, MessagePlugin, DatePicker, Tooltip } from 'tdesign-react';

const { FormItem } = Form;

export default function BaseForm() {
  const formRef = useRef();

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

  return (
    <Form ref={formRef} onSubmit={onSubmit} onReset={onReset} colon labelWidth={100}>
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

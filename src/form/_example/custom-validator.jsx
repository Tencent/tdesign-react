import React from 'react';
import { Form, Input, Button, Message } from '@tencent/tdesign-react';

const { FormItem } = Form;

export default function BaseForm() {
  const form = React.createRef();

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

  // 自定义异步校验器
  function rePassword(val) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve(form.current.getFieldValue('password') === val);
        clearTimeout(timer);
      });
    });
  }

  const rules = {
    account: [
      { required: true, message: '姓名必填', type: 'error' },
      { min: 2, message: '至少需要两个字', type: 'error' },
    ],
    password: [{ required: true, message: '密码必填', type: 'error' }],
    rePassword: [
      // 自定义校验规则
      { required: true, message: '密码必填', type: 'error' },
      { validator: rePassword, message: '两次密码不一致' },
    ],
  };

  return (
    <div>
      <Form ref={form} statusIcon={true} onSubmit={onSubmit} onReset={onReset} rules={rules}>
        <FormItem label="用户名" name="account">
          <Input />
        </FormItem>
        <FormItem label="密码" name="password">
          <Input />
        </FormItem>
        <FormItem label="确认密码" name="rePassword">
          <Input />
        </FormItem>
        <FormItem statusIcon={false}>
          <Button theme="primary" type="submit" style={{ marginRight: 10 }}>
            提交
          </Button>
          <Button type="reset">重置</Button>
        </FormItem>
      </Form>
    </div>
  );
}

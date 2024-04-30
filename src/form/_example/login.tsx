import React from 'react';
import { Form, Input, Button, MessagePlugin } from 'tdesign-react';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-react';

const { FormItem } = Form;

export default function BaseForm() {
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
    <div style={{ width: 350 }}>
      <Form statusIcon={true} onSubmit={onSubmit} onReset={onReset} colon={true} labelWidth={0}>
        <FormItem name="account">
          <Input clearable={true} prefixIcon={<DesktopIcon />} placeholder="请输入账户名" />
        </FormItem>
        <FormItem name="password">
          <Input type="password" prefixIcon={<LockOnIcon />} clearable={true} placeholder="请输入密码" />
        </FormItem>
        <FormItem>
          <Button theme="primary" type="submit" block>
            登录
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

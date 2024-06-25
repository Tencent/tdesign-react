import React, { useEffect } from 'react';
import { Form, Input, Button, MessagePlugin } from 'tdesign-react';

const { FormItem } = Form;

const validateMessage = {
  account: [
    {
      type: 'error',
      message: '自定义用户名校验信息提示',
    },
  ],
  description: [
    {
      type: 'warning',
      message: '自定义个人简介校验信息提示',
    },
  ],
};

const rules = {
  account: [{ required: true }, { min: 2 }, { max: 10, type: 'warning' }],
  description: [{ validator: (val) => val.length < 10, message: '不能超过 20 个字，中文长度等于英文长度' }],
  password: [{ required: true }, { len: 8, message: '请输入 8 位密码' }],
};

export default function BaseForm() {
  const [form] = Form.useForm();

  const onSubmit = ({ validateResult, firstError }) => {
    if (validateResult === true) {
      MessagePlugin.success('提交成功');
    } else {
      console.log('Errors: ', validateResult);
      MessagePlugin.warning(firstError);
    }
  };

  const onReset = () => {
    MessagePlugin.info('重置成功');
  };

  const handleValidateMessage = () => {
    MessagePlugin.success('设置表单校验信息提示成功');
    form.setValidateMessage(validateMessage);
  };

  const handleValidateOnly = () => {
    form.validateOnly().then((result) => {
      console.log('validateOnly: ', result)
    });
  };
  
  useEffect(() => {
    form.setValidateMessage(validateMessage);
  }, []);

  return (
    <Form rules={rules} form={form} onReset={onReset} onSubmit={onSubmit} scrollToFirstError="smooth">
      <FormItem label="用户名" help="这是用户名字段帮助说明" name="account" initialData=''>
        <Input />
      </FormItem>
      <FormItem label="个人简介" help="一句话介绍自己" name="description" initialData=''>
        <Input />
      </FormItem>
      <FormItem label="密码" name="password" initialData=''>
        <Input type="password" />
      </FormItem>
      <FormItem style={{ marginLeft: 100 }}>
        <Button theme="primary" type="submit" style={{ marginRight: 10 }}>
          提交
        </Button>
        <Button theme="default" variant="base" type="reset" style={{ marginRight: 10 }}>
          重置
        </Button>
        <Button theme="default" variant="base" style={{ marginRight: 10 }} onClick={handleValidateOnly}>
          仅校验不展示验证信息
        </Button>
        <Button theme="default" variant="base" onClick={handleValidateMessage}>
          设置校验信息提示
        </Button>
      </FormItem>
    </Form>
  );
}

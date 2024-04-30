import React, { useEffect } from 'react';
import { Form, Input, Button, MessagePlugin, Loading } from 'tdesign-react';
import { AddRectangleIcon, HelpCircleIcon } from 'tdesign-icons-react';

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

  const rules = {
    fail: [{ required: true, message: '必填', type: 'error' }],
    warning: [{ required: true, message: '必填', type: 'warning' }],
    success: [],
    failB: [{ required: true, message: '必填', type: 'error' }],
    warningB: [{ required: true, type: 'warning' }],
  };

  const form = React.createRef();
  useEffect(() => {
    form.current.validate();
  }, [form]);

  return (
    <Form ref={form} statusIcon={true} onSubmit={onSubmit} onReset={onReset} rules={rules}>
      <FormItem label="失败" help="校验不通过，请输入正确内容" name="fail">
        <Input />
      </FormItem>
      <FormItem label="警告" name="warning" rules={[{ required: true, message: '必填', type: 'warning' }]}>
        <Input />
      </FormItem>
      <FormItem label="成功" name="success">
        <Input />
      </FormItem>
      <FormItem label="失败" name="failB" statusIcon={false}>
        <Input placeholder="隐藏状态icon" />
      </FormItem>
      <FormItem label="警告" name="warningB">
        <Input />
      </FormItem>
      <FormItem label="加载中" name="loading" statusIcon={<Loading loading size="25px" style={{ color: '#1890ff' }} />}>
        <Input placeholder="正在校验中，请稍等" />
      </FormItem>
      <FormItem
        label="新增"
        name="add"
        help="自定义新增icon"
        statusIcon={<AddRectangleIcon name="add-rectangle" size="25px" />}
      >
        <Input />
      </FormItem>
      <FormItem
        label="帮助"
        name="help"
        help="自定义帮助icon"
        statusIcon={<HelpCircleIcon name="help-circle" size="25px" />}
      >
        <Input />
      </FormItem>
      <FormItem style={{ marginLeft: 100 }}>
        <Button theme="primary" type="submit" style={{ marginRight: 10 }}>
          提交
        </Button>
        <Button type="reset">重置</Button>
      </FormItem>
    </Form>
  );
}

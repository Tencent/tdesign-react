import React from 'react';
import { Form, Input, Stepper } from 'tdesign-mobile-react';

const initialData = {
  nickname: 'Abcdefgh',
  workAge: 3,
  label: 'Abcdefgh',
  labelAge: 3,
  longLabel: 'Abcdefgh',
  longLabelAge: 3,
};

export default function LabelWidth({ disabled }: { disabled?: boolean }) {
  return (
    <>
      <Form className="form-demo-form" initialData={initialData} labelAlign="left" disabled={disabled}>
        <Form.FormItem label="用户昵称" name="nickname" labelWidth="80px">
          <Input borderless placeholder="请输入昵称" />
        </Form.FormItem>
        <Form.FormItem label="工作年限" name="workAge" labelWidth="80px">
          <Stepper theme="filled" />
        </Form.FormItem>
      </Form>
      <Form className="form-demo-form" initialData={initialData} labelAlign="left" disabled={disabled}>
        <Form.FormItem label="标签文案宽度" name="label" labelWidth="112px">
          <Input borderless placeholder="请输入内容" />
        </Form.FormItem>
        <Form.FormItem label="标签文案宽度" name="labelAge" labelWidth="112px">
          <Stepper theme="filled" />
        </Form.FormItem>
      </Form>
      <Form className="form-demo-form" initialData={initialData} labelAlign="left" disabled={disabled}>
        <Form.FormItem label="标签文案宽度超长样式" name="longLabel" labelWidth="176px">
          <Input borderless placeholder="请输入内容" />
        </Form.FormItem>
        <Form.FormItem label="标签文案宽度超长样式" name="longLabelAge" labelWidth="176px">
          <Stepper theme="filled" />
        </Form.FormItem>
      </Form>
    </>
  );
}

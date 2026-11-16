import React from 'react';
import { Form, Input, Stepper } from 'tdesign-mobile-react';

const initialData = {
  name: 'Abcdefgh',
  age: 3,
};

export default function LabelAlign({ disabled }: { disabled?: boolean }) {
  return (
    <>
      <Form
        className="form-demo-form"
        initialData={initialData}
        labelAlign="left"
        labelWidth="81px"
        disabled={disabled}
      >
        <Form.FormItem label="用户名" name="name">
          <Input borderless placeholder="请输入用户名" />
        </Form.FormItem>
        <Form.FormItem label="年限" name="age">
          <Stepper theme="filled" />
        </Form.FormItem>
      </Form>
      <Form
        className="form-demo-form"
        initialData={initialData}
        labelAlign="right"
        labelWidth="81px"
        disabled={disabled}
      >
        <Form.FormItem label="用户名" name="name">
          <Input borderless placeholder="请输入用户名" />
        </Form.FormItem>
        <Form.FormItem label="年限" name="age">
          <Stepper theme="filled" />
        </Form.FormItem>
      </Form>
    </>
  );
}

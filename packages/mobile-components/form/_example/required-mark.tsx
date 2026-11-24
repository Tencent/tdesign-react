import React from 'react';
import { Form, Input, Stepper } from 'tdesign-mobile-react';

const initialData = {
  name: 'Abcdefgh',
  age: 3,
};

export default function RequiredMark({
  labelAlign = 'top',
  disabled,
}: {
  labelAlign?: 'left' | 'right' | 'top';
  disabled?: boolean;
}) {
  const isHorizontal = labelAlign !== 'top';
  return (
    <>
      <Form
        className="form-demo-form"
        initialData={initialData}
        labelAlign={labelAlign}
        labelWidth={isHorizontal ? '81px' : undefined}
        requiredMarkPosition="right"
        disabled={disabled}
      >
        <Form.FormItem label="用户名" name="name" requiredMark>
          <Input borderless placeholder="请输入用户名" />
        </Form.FormItem>
        <Form.FormItem label="年限" name="age" requiredMark>
          <Stepper theme="filled" />
        </Form.FormItem>
      </Form>
      <Form
        className="form-demo-form"
        initialData={initialData}
        labelAlign={labelAlign}
        labelWidth={isHorizontal ? '81px' : undefined}
        requiredMarkPosition="left"
        disabled={disabled}
      >
        <Form.FormItem label="用户名" name="name" requiredMark>
          <Input borderless placeholder="请输入用户名" />
        </Form.FormItem>
        <Form.FormItem label="年限" name="age" requiredMark>
          <Stepper theme="filled" />
        </Form.FormItem>
      </Form>
    </>
  );
}

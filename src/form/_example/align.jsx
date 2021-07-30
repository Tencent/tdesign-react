// @ts-nocheck
import React, { useState } from 'react';
import { Form, Radio, Input } from '@tencent/tdesign-react';

const { FormItem } = Form;

export default function AlignForm() {
  const [labelAlign, setLabelAlign] = useState('right');
  return (
    <div>
      <Form labelAlign={labelAlign}>
        <FormItem label="对齐方式" name="labelAlign">
          <Radio.Group value={labelAlign} onChange={(value) => setLabelAlign(value)}>
            <Radio.Button value="left">左对齐</Radio.Button>
            <Radio.Button value="right">右对齐</Radio.Button>
            <Radio.Button value="top">顶部对齐</Radio.Button>
          </Radio.Group>
        </FormItem>
        <FormItem label="名字" name="name">
          <Input />
        </FormItem>
        <FormItem label="密码" name="password">
          <Input />
        </FormItem>
      </Form>
    </div>
  );
}

import React, { useState } from 'react';
import { Form, Radio, Input, Space } from 'tdesign-react';

const { FormItem } = Form;

type LabelAlign = 'left' | 'right' | 'top';

export default function AlignForm() {
  const [labelAlign, setLabelAlign] = useState<LabelAlign>('right');
  return (
    <Space direction="vertical">
      <Radio.Group value={labelAlign} onChange={(value: LabelAlign) => setLabelAlign(value)} variant="default-filled">
        <Radio.Button value="left">左对齐</Radio.Button>
        <Radio.Button value="right">右对齐</Radio.Button>
        <Radio.Button value="top">顶部对齐</Radio.Button>
      </Radio.Group>
      <Form labelAlign={labelAlign} labelWidth={80}>
        <FormItem label="名字" name="name">
          <Input />
        </FormItem>
        <FormItem label="密码" name="password">
          <Input />
        </FormItem>
      </Form>
    </Space>
  );
}

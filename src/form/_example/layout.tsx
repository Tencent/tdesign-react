import React, { useState } from 'react';
import { Form, Radio, Input, Space } from 'tdesign-react';

const { FormItem } = Form;

type Layout = 'vertical' | 'inline';

export default function LayoutForm() {
  const [layout, setLayout] = useState<Layout>('inline');
  return (
    <Space direction="vertical">
      <div>
        <Radio.Group value={layout} onChange={(value: Layout) => setLayout(value)} variant="default-filled">
          <Radio.Button value="vertical">纵向布局</Radio.Button>
          <Radio.Button value="inline">行内布局</Radio.Button>
        </Radio.Group>
      </div>
      <Form layout={layout} labelWidth={60}>
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

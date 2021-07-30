// @ts-nocheck
import React, { useState } from 'react';
import { Form, Radio, Input, Row } from '@tencent/tdesign-react';

const { FormItem } = Form;

export default function LayoutForm() {
  const [layout, setLayout] = useState('inline');
  return (
    <div>
      <Row style={{ marginBottom: 16 }}>
        <Radio.Group buttonStyle="solid" value={layout} onChange={(value) => setLayout(value)}>
          <Radio.Button value="vertical">纵向布局</Radio.Button>
          <Radio.Button value="inline">行内布局</Radio.Button>
        </Radio.Group>
      </Row>
      <Form layout={layout}>
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

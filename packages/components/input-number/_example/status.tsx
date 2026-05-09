import React, { useState } from 'react';

import { Form, InputNumber, Space, Radio } from 'tdesign-react';

type TipsType = 'hide' | 'show';

const { FormItem } = Form;

export default function Status() {
  const [type, setType] = useState<TipsType>('show');

  return (
    <Space direction="vertical" size="large">
      <Radio.Group value={type} onChange={(val: TipsType) => setType(val)} variant="default-filled">
        <Radio.Button value="hide">隐藏文本提示</Radio.Button>
        <Radio.Button value="show">显示文本提示</Radio.Button>
      </Radio.Group>

      <Form>
        {/* 隐藏文本提示 */}
        {type === 'hide' && (
          <>
            <FormItem label="禁用" name="value0" initialData={3}>
              <InputNumber disabled style={{ width: 300 }} />
            </FormItem>
            <FormItem label="只读" name="value1" initialData={3}>
              <InputNumber readOnly style={{ width: 300 }} />
            </FormItem>
            <FormItem label="正常" name="value2" initialData={3}>
              <InputNumber style={{ width: 300 }} />
            </FormItem>
            <FormItem label="成功" name="value3" initialData={3}>
              <InputNumber status="success" style={{ width: 300 }} />
            </FormItem>
            <FormItem label="警告" name="value4" initialData={3}>
              <InputNumber status="warning" style={{ width: 300 }} />
            </FormItem>
            <FormItem label="错误" name="value5" initialData={3}>
              <InputNumber status="error" style={{ width: 300 }} />
            </FormItem>
          </>
        )}

        {/* 显示文本提示 */}
        {type === 'show' && (
          <>
            <FormItem label="正常提示" name="value6" initialData={3}>
              <InputNumber tips="这是普通文本提示" style={{ width: 300 }} />
            </FormItem>
            <FormItem label="成功提示" name="value7" initialData={3}>
              <InputNumber status="success" tips="校验通过文本提示" style={{ width: 300 }} />
            </FormItem>
            <FormItem label="警告提示" name="value8" initialData={3}>
              <InputNumber status="warning" tips="校验不通过文本提示" style={{ width: 300 }} />
            </FormItem>
            <FormItem label="错误提示" name="value9" initialData={3}>
              <InputNumber status="error" tips="校验存在严重问题文本提示" style={{ width: 300 }} />
            </FormItem>
          </>
        )}
      </Form>
    </Space>
  );
}

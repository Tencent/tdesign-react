import React, { useState } from 'react';
import { Form, InputNumber, Space, Radio } from 'tdesign-react';

const { FormItem } = Form;
export default function Status() {
  const [type, setType] = useState('align-input');

  return (
    <Space direction="vertical">
      <Radio.Group value={type} onChange={setType} variant="default-filled">
        <Radio.Button value="hide">隐藏文本提示</Radio.Button>
        <Radio.Button value="align-left">文本提示左对齐</Radio.Button>
        <Radio.Button value="align-input">文本提示对齐输入框</Radio.Button>
      </Radio.Group>

      <Form>
        {type === 'hide' && (
          <>
            <FormItem label="禁用">
              <InputNumber style={{ width: 300 }} disabled />
            </FormItem>
            <FormItem label="只读">
              <InputNumber style={{ width: 300 }} readonly />
            </FormItem>
            <FormItem label="正常">
              <InputNumber style={{ width: 300 }} />
            </FormItem>
            <FormItem label="成功">
              <InputNumber style={{ width: 300 }} status="success" />
            </FormItem>
            <FormItem label="警告">
              <InputNumber style={{ width: 300 }} status="warning" />
            </FormItem>
            <FormItem label="错误">
              <InputNumber style={{ width: 300 }} status="error" />
            </FormItem>
          </>
        )}

        {type === 'align-left' && (
          <>
            <FormItem label="正常提示">
              <InputNumber style={{ width: 300 }} tips="这是普通文本提示" />
            </FormItem>
            <FormItem label="成功提示">
              <InputNumber style={{ width: 300 }} status="success" tips="校验通过文本提示" />
            </FormItem>
            <FormItem label="警告提示">
              <InputNumber style={{ width: 300 }} status="warning" tips="校验不通过文本提示" />
            </FormItem>
            <FormItem label="错误提示">
              <InputNumber style={{ width: 300 }} status="error" tips="校验存在严重问题文本提示" />
            </FormItem>
          </>
        )}

        {type === 'align-input' && (
          <>
            <FormItem label="正常提示">
              <InputNumber style={{ width: 300 }} tips="这是普通文本提示" />
            </FormItem>
            <FormItem label="成功提示">
              <InputNumber style={{ width: 300 }} status="success" tips="校验通过文本提示" />
            </FormItem>
            <FormItem label="警告提示">
              <InputNumber style={{ width: 300 }} status="warning" tips="校验不通过文本提示" />
            </FormItem>
            <FormItem label="错误提示">
              <InputNumber style={{ width: 300 }} status="error" tips="校验存在严重问题文本提示" />
            </FormItem>
          </>
        )}
      </Form>
    </Space>
  );
}

import React from 'react';
import { Form, InputNumber } from 'tdesign-react';

const { FormItem } = Form;
function Status() {
  return (
    <div>
      <Form>
        <FormItem label="禁用" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" disabled style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="只读" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" readonly style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="正常" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="成功" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" status="success" style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="警告" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" status="warning" style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="错误" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" status="error" style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="正常提示" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" tips="这是普通文本提示" style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="正常提示" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" tips="这是普通文本提示" style={{ width: '300px' }} theme="column" />
        </FormItem>
        <FormItem label="成功提示" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" status="success" tips="校验通过文本提示" style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="警告提示" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" status="warning" tips="校验不通过文本提示" style={{ width: '300px' }} />
        </FormItem>
        <FormItem label="错误提示" style={{ marginBottom: 0 }}>
          <InputNumber defaultValue="3" status="error" tips="校验存在严重问题文本提示" style={{ width: '300px' }} />
        </FormItem>
      </Form>
    </div>
  );
}

export default Status;

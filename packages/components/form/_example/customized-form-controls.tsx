import React from 'react';
import { Form, Input, Button, MessagePlugin, Space, Select } from 'tdesign-react';
import type { FormProps } from 'tdesign-react';

interface ICourseSelect {
  value?: {
    type?: string;
    name?: string;
  };
  onChange?: (v: { type?: string; name?: string }) => void;
}

const { FormItem } = Form;

function CourseSelect(props: ICourseSelect) {
  const { value, onChange } = props;

  return (
    <Space>
      <Select
        options={[
          {
            label: '数学',
            value: 'math',
          },
          {
            label: '英语',
            value: 'english',
          },
        ]}
        value={value?.type}
        onChange={(v) => {
          onChange?.({
            ...value,
            type: v as string,
          });
        }}
        placeholder="请选择课程类型"
      />
      <Input
        value={value?.name}
        onChange={(v) => {
          onChange?.({
            ...value,
            name: v,
          });
        }}
        placeholder="请输入课程名称"
      />
    </Space>
  );
}

export default function BaseForm() {
  const [form] = Form.useForm();

  const onSubmit: FormProps['onSubmit'] = (e) => {
    console.log(e);
    if (e.validateResult === true) {
      MessagePlugin.info('提交成功');
    }
  };

  return (
    <Form form={form} onSubmit={onSubmit} colon labelWidth={100}>
      <FormItem label="课程" name="course">
        <CourseSelect />
      </FormItem>
      <FormItem style={{ marginLeft: 100 }}>
        <Button type="submit" theme="primary">
          提交
        </Button>
      </FormItem>
    </Form>
  );
}

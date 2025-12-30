import React from 'react';
import { Button, Form, Input, Select, Space } from 'tdesign-react';

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
          // type 改变时，清空 name
          onChange?.({
            type: v as string,
            name: '',
          });

          // type 改变时，保留 name
          // onChange?.({
          //   ...value,
          //   type: v as string,
          // });
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

  return (
    <Form form={form} colon labelWidth={100}>
      <FormItem label="课程" name="course">
        <CourseSelect />
      </FormItem>
      <FormItem style={{ marginLeft: 100 }}>
        <Button
          onClick={() => {
            form.setFieldsValue({
              course: {
                type: 'math',
                name: '线性代数',
              },
            });
          }}
        >
          设置数据
        </Button>
      </FormItem>
    </Form>
  );
}

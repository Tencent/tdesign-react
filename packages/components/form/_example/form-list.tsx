import React from 'react';
import { MinusCircleIcon } from 'tdesign-icons-react';
import { Button, Form, Input, Select, Space } from 'tdesign-react';

const { FormItem, FormList } = Form;

const taskTypeOptions = [
  { label: '需求评审', value: 'review' },
  { label: '交互设计', value: 'ui' },
  { label: '开发任务', value: 'dev' },
  { label: '功能测试', value: 'test' },
];

export default function BaseForm() {
  const [form] = Form.useForm();

  function onSubmit() {
    const allFields = form.getFieldsValue(true);
    console.log('allFields', allFields);
  }

  return (
    <Form
      form={form}
      onSubmit={onSubmit}
      initialData={{ task: [{ type: 'review' }, { type: 'ui' }] }}
      onValuesChange={(change, all) => {
        console.log('change:', change, '\n', JSON.stringify(change));
        console.log('all:', all, '\n', JSON.stringify(all));
      }}
      resetType="initial"
    >
      <FormList name="task">
        {(fields, { add, remove, move }) => (
          <>
            {fields.map(({ key, name }, index) => (
              <FormItem key={key}>
                <FormItem name={[name, 'type']} label="类型">
                  <Select options={taskTypeOptions} />
                </FormItem>

                <FormItem name={[name, 'notes']} label="备注" initialData="排期中">
                  <Input />
                </FormItem>

                <FormItem>
                  <Space>
                    <MinusCircleIcon
                      style={{ cursor: 'pointer', marginRight: 12 }}
                      size="20px"
                      onClick={() => remove(name)}
                    />
                    <Button
                      style={{ marginRight: 8 }}
                      size="small"
                      disabled={index === 0}
                      onClick={() => move(index, index - 1)}
                    >
                      上移
                    </Button>
                    <Button size="small" disabled={index === fields.length - 1} onClick={() => move(index, index + 1)}>
                      下移
                    </Button>
                  </Space>
                </FormItem>
              </FormItem>
            ))}

            <FormItem style={{ marginLeft: 100 }}>
              <Space>
                <Button onClick={() => add({ type: 'dev', notes: '已交付' })}>新增指定项</Button>
                <Button onClick={() => add()}>新增默认项</Button>
              </Space>
            </FormItem>
          </>
        )}
      </FormList>

      <FormItem style={{ marginLeft: 100 }}>
        <Button type="submit" theme="default">
          提交
        </Button>
        <Button type="reset" theme="default" style={{ marginLeft: 12 }}>
          重置
        </Button>
      </FormItem>
    </Form>
  );
}

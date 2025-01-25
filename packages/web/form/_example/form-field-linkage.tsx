import React from 'react';
import { Form, Radio, Button } from 'tdesign-react';

const { FormItem } = Form;

export default function FormExample() {
  const [form] = Form.useForm();
  const setMessage = () => {
    form.setFieldsValue({
      type: 'cold',
      ice: '1',
    });
  };

  return (
    <Form form={form} colon labelWidth={100}>
      <FormItem label="类型" name="type" initialData="hot">
        <Radio.Group>
          <Radio value="hot">热饮</Radio>
          <Radio value="cold">冷饮</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem shouldUpdate={(prev, next) => prev.type !== next.type}>
        {({ getFieldValue }) => {
          if (getFieldValue('type') === 'cold') {
            return (
              <FormItem label="冰量" key="ice" name="ice">
                <Radio.Group>
                  <Radio value="0">正常冰</Radio>
                  <Radio value="1">少冰</Radio>
                  <Radio value="2">去冰</Radio>
                </Radio.Group>
              </FormItem>
            );
          }
          return null;
        }}
      </FormItem>

      <FormItem style={{ marginLeft: 100 }}>
        <Button onClick={setMessage}>选择冷饮-少冰</Button>
      </FormItem>
    </Form>
  );
}

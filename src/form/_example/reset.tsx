import React, { useState } from 'react';
import { Form, Input, Radio, Checkbox, Button, MessagePlugin, Popup, Space } from 'tdesign-react';

const { FormItem } = Form;

export default function BaseForm() {
  const [resetType, setResetType] = useState('initial');

  const onSubmit = ({ validateResult, firstError }) => {
    if (validateResult === true) {
      MessagePlugin.success('提交成功');
    } else {
      console.log('Errors: ', validateResult);
      MessagePlugin.warning(firstError);
    }
  };

  const onReset = (e) => {
    console.log(e);
    MessagePlugin.info('重置成功');
  };

  const courseOptions = [
    { label: '语文', value: '1' },
    { label: '数学', value: '2' },
    { label: '英语', value: '3' },
  ];

  return (
    <Space direction="vertical">
      <div>
        <Radio.Group value={resetType} onChange={(value) => setResetType(value)} variant="default-filled">
          <Radio.Button value="empty">重置为空</Radio.Button>
          <Radio.Button value="initial">
            <Popup content="改变表单数据后，点击重置按钮，观察数据重置情况"> 重置为初始值 </Popup>
          </Radio.Button>
        </Radio.Group>
      </div>

      <Form resetType={resetType} colon onReset={onReset} onSubmit={onSubmit}>
        <FormItem label="姓名" name="name" initialData="TDesign">
          <Input placeholder="请输入内容" />
        </FormItem>
        <FormItem label="手机号码" name="tel" initialData="12345678910">
          <Input placeholder="请输入内容" />
        </FormItem>
        <FormItem label="课程" name="course" initialData={['1']}>
          <Checkbox.Group options={courseOptions}></Checkbox.Group>
        </FormItem>
        <FormItem style={{ marginLeft: 100 }}>
          <Button theme="primary" type="submit" style={{ marginRight: 10 }}>
            提交
          </Button>
          <Button theme="default" variant="base" type="reset">
            重置
          </Button>
        </FormItem>
      </Form>
    </Space>
  );
}

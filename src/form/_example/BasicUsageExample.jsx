import React, { useState } from 'react';
import { Form, FormItem, Input, Radio, Checkbox, Button, Switch, Message } from '@tencent/tdesign-react';
import { useForm } from '../useForm';

export default function BasicUsage() {
  const [gender, setGender] = useState('男性');
  const [taste, setTaste] = useState([]);
  const [checked, setChecked] = useState(true);

  const onSubmit = () => {
    Message.success('提交成功');
  };

  const onReset = () => {
    Message.info('重置成功');
  };

  return (
    <div>
      <Form layout="vertical" form={useForm()}>
        <FormItem label="姓名" name="name">
          <Input />
        </FormItem>
        <FormItem label="手机号" name="tel">
          <Input />
        </FormItem>
        <FormItem label="性别" name="gender">
          <Radio.Group value={gender} onChange={(value) => setGender(value)}>
            <Radio name="male">男性</Radio>
            <Radio name="female">女性</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="课程" name="course">
          <Checkbox.Group value={taste} onChange={setTaste}>
            <Checkbox name="la">加辣</Checkbox>
            <Checkbox name="ma">加麻</Checkbox>
            <Checkbox name="nocong">不要葱花</Checkbox>
          </Checkbox.Group>
        </FormItem>
        <FormItem label="状态" name="status" for="status">
          <Switch value={checked} onChange={(value) => setChecked(value)} />
        </FormItem>
        <FormItem>
          <Button type="submit" theme="primary" onClick={onSubmit}>
            提交
          </Button>
          <Button type="reset" onClick={onReset}>
            重置
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

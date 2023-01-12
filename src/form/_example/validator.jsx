import React, { useRef } from 'react';
import { Form, Input, Radio, Checkbox, Button, MessagePlugin } from 'tdesign-react';
import debounce from 'lodash/debounce';

const { FormItem } = Form;

export default function BaseForm() {
  const [form] = Form.useForm();
  const onSubmit = (e) => {
    console.log(e);
    if (e.validateResult === true) {
      MessagePlugin.info('提交成功');
    }
  };

  const onReset = (e) => {
    console.log(e);
    MessagePlugin.info('重置成功');
  };

  function asyncValidate(val) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (val === '123') {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  const handleChange = useRef(
    debounce((value) => {
      console.log('value', value);
      form.validate({ fields: ['password'], trigger: 'blur' });
    }, 500),
  ).current;

  return (
    <Form
      form={form}
      layout="vertical"
      onSubmit={onSubmit}
      labelWidth={100}
      onReset={onReset}
      scrollToFirstError="smooth"
    >
      <FormItem
        label="用户名"
        help="这里请填写用户名"
        name="account"
        initialData={'张三'}
        rules={[
          { whitespace: true, message: '姓名不能为空' },
          { required: true, message: '姓名必填', type: 'error' },
          { min: 2, message: '至少需要两个字', type: 'error' },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="密码"
        help="这里请填写密码"
        name="password"
        rules={[
          { required: true, message: '密码必填', type: 'error' },
          { validator: asyncValidate, message: '密码错误', type: 'error', trigger: 'blur' },
        ]}
      >
        <Input onChange={handleChange} />
      </FormItem>
      <FormItem label="邮箱" name="email" rules={[{ required: true, message: '格式必须为邮箱', type: 'warning' }]}>
        <Input />
      </FormItem>
      <FormItem label="性别" name="gender" rules={[{ required: true, message: '性别必填', type: 'warning' }]}>
        <Radio.Group>
          <Radio value="male">男</Radio>
          <Radio value="femal">女</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem label="课程" name="course" rules={[{ required: true, message: '课程必填', type: 'warning' }]}>
        <Checkbox.Group>
          <Checkbox value="1">语文</Checkbox>
          <Checkbox value="2">数学</Checkbox>
          <Checkbox value="3">英语</Checkbox>
          <Checkbox value="4">体育</Checkbox>
        </Checkbox.Group>
      </FormItem>
      <FormItem label="入学时间" name="date" rules={[{ date: true, message: '日期格式有误' }]}>
        <Input />
      </FormItem>
      <FormItem
        label="个人网站"
        name="content.url"
        rules={[
          { required: true, message: '个人网站必填', type: 'warning' },
          {
            url: {
              protocols: ['http', 'https', 'ftp'],
              require_protocol: true,
            },
            message: '请输入正确的个人主页',
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem style={{ marginLeft: 100 }}>
        <Button theme="primary" type="submit" style={{ marginRight: 10 }}>
          提交
        </Button>
        <Button type="reset">重置</Button>
      </FormItem>
    </Form>
  );
}

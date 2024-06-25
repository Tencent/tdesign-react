import React from 'react';
import { Form, Input, Checkbox, Button, MessagePlugin, Radio, Select } from 'tdesign-react';

const { FormItem } = Form;

const rules = {
  account: [
    { required: true, message: '姓名必填' },
    { min: 2, message: '至少需要两个字符，一个中文等于两个字符' },
    { max: 10, message: '姓名字符长度超出' },
  ],
  description: [
    { validator: (val) => val.length >= 5, message: '至少 5 个字，中文长度等于英文长度' },
    { validator: (val) => val.length < 20, message: '不能超过 20 个字，中文长度等于英文长度' },
  ],
  password: [
    { required: true, message: '密码必填' },
    { len: 8, message: '请输入 8 位密码' },
    { pattern: /[A-Z]+/, message: '密码必须包含大写字母' },
  ],
  email: [
    { required: true, message: '邮箱必填' },
    { email: { ignore_max_length: true }, message: '请输入正确的邮箱地址' },
  ],
  gender: [{ required: true, message: '性别必填' }],
  course: [
    { required: true, message: '课程必填' },
    { validator: (val) => val.length <= 2, message: '最多选择 2 门课程' },
  ],
  'content.url': [
    { required: true, message: '个人网站必填' },
    {
      url: {
        protocols: ['http', 'https', 'ftp'],
        require_protocol: true,
      },
      message: '请输入正确的个人主页',
    },
  ],
};

const courseOptions = [
  { label: '语文', value: '1' },
  { label: '数学', value: '2' },
  { label: '英语', value: '3' },
  { label: '体育', value: '4' },
];

const options = [
  { label: '计算机学院', value: '1' },
  { label: '软件学院', value: '2' },
  { label: '物联网学院', value: '3' },
];

export default function BaseForm() {
  const [form] = Form.useForm();

  const onSubmit = ({ validateResult, firstError }) => {
    if (validateResult === true) {
      MessagePlugin.success('提交成功');
    } else {
      console.log('Errors: ', validateResult);
      MessagePlugin.warning(firstError);
    }
  };

  const onReset = () => {
    MessagePlugin.info('重置成功');
  };

  const handleClear = () => {
    form.clearValidate();
  };

  // 清除指定字段的校验结果
  const clearFieldsValidateResult = () => {
    form.clearValidate(['email', 'course', 'content.url']);
    MessagePlugin.success('已清除邮箱、课程、个人网站等字段校验结果');
  };

  return (
    <Form form={form} rules={rules} onReset={onReset} onSubmit={onSubmit} scrollToFirstError="smooth">
      <FormItem label="用户名" help="这是用户名字段帮助说明" name="account">
        <Input />
      </FormItem>
      <FormItem label="个人简介" help="一句话介绍自己" name="description" initialData=''>
        <Input />
      </FormItem>
      <FormItem label="密码" name="password">
        <Input type="password" />
      </FormItem>
      <FormItem label="邮箱" name="email">
        <Input />
      </FormItem>
      <FormItem label="性别" name="gender">
        <Radio.Group>
          <Radio value="male">男</Radio>
          <Radio value="femal">女</Radio>
        </Radio.Group>
      </FormItem>
      <FormItem label="课程" name="course" initialData={[]}>
        <Checkbox.Group options={courseOptions}></Checkbox.Group>
      </FormItem>
      <FormItem label="学院" name="college">
        {
          <Select clearable>
            {options.map((item, index) => (
              <Select.Option value={item.value} label={item.label} key={index} />
            ))}
          </Select>
        }
      </FormItem>
      <FormItem
        label="入学时间"
        name="date"
        rules={[{ date: { delimiters: ['/', '-', '.'] }, message: '日期格式有误' }]}
      >
        <Input />
      </FormItem>
      <FormItem label="个人网站" name="content.url">
        <Input />
      </FormItem>
      <FormItem style={{ marginLeft: 100 }}>
        <Button theme="primary" type="submit" style={{ marginRight: 10 }}>
          提交
        </Button>
        <Button theme="default" variant="base" type="reset" style={{ marginRight: 10 }}>
          重置
        </Button>
        <Button theme="default" variant="base" onClick={handleClear} style={{ marginRight: 10 }}>
          清空校验结果
        </Button>
        <Button theme="default" variant="base" onClick={clearFieldsValidateResult}>
          {' '}
          清除指定字段的校验结果{' '}
        </Button>
      </FormItem>
    </Form>
  );
}

import React, { useState } from 'react';
import { Form, Input, Button, MessagePlugin, Radio, Select, Checkbox, Popup, Space } from 'tdesign-react';

const { FormItem } = Form;

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

const errorMessage = {
  date: '${name}不正确',
  url: '${name}不正确',
  required: '请输入${name}',
  max: '${name}字符长度不能超过 ${validate} 个字符，一个中文等于两个字符',
  min: '${name}字符长度不能少于 ${validate} 个字符，一个中文等于两个字符',
  len: '${name}字符长度必须是 ${validate}',
  pattern: '${name}不正确',
  validator: '${name}有误',
};

const rules = {
  account: [
    { required: true },
    // { enum: ['sheep', 'name'] },
    { min: 2 },
    { max: 10, type: 'warning' },
  ],
  description: [
    { validator: (val) => val.length >= 5 },
    { validator: (val) => val.length < 10, message: '不能超过 20 个字，中文长度等于英文长度' },
  ],
  password: [
    { required: true },
    { len: 8, message: '请输入 8 位密码' },
    { pattern: /[A-Z]+/, message: '密码必须包含大写字母' },
  ],
  email: [{ required: true }, { email: { ignore_max_length: true } }],
  gender: [{ required: true }],
  course: [{ required: true }, { validator: (val) => val.length <= 2, message: '最多选择 2 门课程', type: 'warning' }],
  'content.url': [
    { required: true },
    {
      url: {
        protocols: ['http', 'https', 'ftp'],
        require_protocol: true,
      },
    },
  ],
};

export default function BaseForm() {
  const [form] = Form.useForm();
  const [errorConfig, setErrorConfig] = useState('default');

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

  return (
    <Space direction="vertical">
      {/* 可以使用全局 ConfigProvider errorMessage 配置规则校验结果描述，而无需给每一个表单都配置校验信息 */}
      <div>
        <Radio.Group variant="default-filled" value={errorConfig} onChange={(v) => setErrorConfig(v)}>
          <Radio.Button value="default">
            <Popup content="Form.errorMessage 为空，使用组件内置校验信息。重置后，点击提交观察校验结果信息">
              使用表单默认校验信息
            </Popup>
          </Radio.Button>
          <Radio.Button value="config">
            <Popup content="统一配置 Form.errorMessage，使用自定义配置的校验信息。重置后，点击提交观察校验结果信息">
              表单统一配置校验信息
            </Popup>
          </Radio.Button>
        </Radio.Group>
      </div>

      <Form
        form={form}
        rules={rules}
        error-message={errorConfig === 'default' ? undefined : errorMessage}
        onReset={onReset}
        onSubmit={onSubmit}
        scrollToFirstError="smooth"
      >
        <FormItem label="用户名" help="这是用户名字段帮助说明" name="account" initialData="">
          <Input />
        </FormItem>
        <FormItem label="个人简介" help="一句话介绍自己" name="description" initialData="">
          <Input />
        </FormItem>
        <FormItem label="密码" name="password" initialData="">
          <Input type="password" />
        </FormItem>
        <FormItem label="邮箱" name="email" initialData="">
          <Input />
        </FormItem>
        <FormItem label="性别" name="gender" initialData="">
          <Radio.Group>
            <Radio value="male">男</Radio>
            <Radio value="femal">女</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="课程" name="course" initialData={[]}>
          <Checkbox.Group options={courseOptions}></Checkbox.Group>
        </FormItem>
        <FormItem label="学院" name="college" initialData="">
          <Select clearable>
            {options.map((item, index) => (
              <Select.Option value={item.value} label={item.label} key={index}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          label="入学时间"
          name="date"
          rules={[{ date: { delimiters: ['/', '-', '.'] }, message: '日期格式有误' }]}
          initialData=""
        >
          <Input />
        </FormItem>
        <FormItem label="个人网站" name="content.url" initialData="">
          <Input />
        </FormItem>
        <FormItem style={{ marginLeft: 100 }}>
          <Button theme="primary" type="submit" style={{ marginRight: 10 }}>
            提交
          </Button>
          <Button theme="default" variant="base" type="reset" style={{ marginRight: 10 }}>
            重置
          </Button>
          <Button theme="default" variant="base" onClick={handleClear}>
            清空校验结果
          </Button>
        </FormItem>
      </Form>
    </Space>
  );
}

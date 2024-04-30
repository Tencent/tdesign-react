import React, { useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Button,
  MessagePlugin,
  Radio,
  DatePicker,
  Switch,
  TreeSelect,
  Select,
  Upload,
  Cascader,
  Textarea,
  Space,
} from 'tdesign-react';

const { FormItem } = Form;

const INITIAL_DATA = {
  name: '',
  message: true,
  gender: '',
  course: [],
  college: '',
  personalProfile: '',
  address1: 1,
  address2: 2,
  gradePoint: undefined,
  date: '',
  avatar: [{ url: 'https://tdesign.gtimg.com/site/avatar.jpg', name: 'avatar.jpg', status: 'success' }],
};

const COLLEGE_OPTIONS = [
  { label: '学院 A', value: 1 },
  { label: '学院 B', value: 2 },
  { label: '学院 C', value: 3 },
];

const ADDRESS_OPTIONS = [
  { label: '江苏', value: 1, children: [{ label: '南京市', value: 300 }] },
  { label: '上海', value: 2, children: [{ label: '徐汇区', value: 400 }] },
  { label: '四川', value: 3, children: [{ label: '成都市', value: 500 }] },
];

export default function BaseForm() {
  const [formDisabled, setFormDisabled] = useState(true);

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
      <div style={{ marginLeft: 36 }}>
        <Radio.Group value={formDisabled} onChange={(value) => setFormDisabled(value)} variant="default-filled">
          <Radio.Button value={false}>启用</Radio.Button>
          <Radio.Button value={true}>禁用</Radio.Button>
        </Radio.Group>
      </div>

      <Form resetType="initial" disabled={formDisabled} colon onReset={onReset} onSubmit={onSubmit}>
        <FormItem label="姓名" name="name" initialData={INITIAL_DATA.name}>
          <Input />
        </FormItem>
        <FormItem label="学院" name="college" initialData={INITIAL_DATA.college}>
          <Select options={COLLEGE_OPTIONS} clearable></Select>
        </FormItem>
        <FormItem label="寄件地址" name="address1" initialData={INITIAL_DATA.address1}>
          <TreeSelect data={ADDRESS_OPTIONS} clearable />
        </FormItem>
        <FormItem label="收件地址" name="address2" initialData={INITIAL_DATA.address2}>
          <Cascader options={ADDRESS_OPTIONS} clearable />
        </FormItem>
        <FormItem label="日期" name="date" initialData={INITIAL_DATA.date}>
          <DatePicker mode="date" clearable />
        </FormItem>
        <FormItem label="个人简介" name="personalProfile" initialData={INITIAL_DATA.personalProfile}>
          <Textarea placeholder="简单描述自己的经历" />
        </FormItem>
        <FormItem label="短信" name="message" initialData={INITIAL_DATA.message}>
          <Switch label={['接受', '不接']}></Switch>
        </FormItem>
        <FormItem label="性别" name="gender" initialData={INITIAL_DATA.gender}>
          <Radio.Group>
            <Radio value="1">男</Radio>
            <Radio value="2">女</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem label="课程" name="course" initialData={INITIAL_DATA.course}>
          <Checkbox.Group options={courseOptions} />
        </FormItem>
        <FormItem label="绩点" name="gradePoint" initialData={INITIAL_DATA.gradePoint}>
          <InputNumber theme="normal" placeholder="数字" />
        </FormItem>
        <FormItem label="头像" name="avatar" initialData={INITIAL_DATA.avatar}>
          <Upload
            action="https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
            theme="image"
            tips="请选择单张图片文件上传"
            accept="image/*"
          ></Upload>
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

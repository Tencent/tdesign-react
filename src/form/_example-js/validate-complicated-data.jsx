import React, { useState } from 'react';
import { Form, Input, Checkbox, Button, MessagePlugin, Radio, Tabs } from 'tdesign-react';

const { FormItem } = Form;

let id = 0;
function getId() {
  id += 1;
  return id;
}

const INITIAL_DATA = {
  school: 1,
  students: [
    {
      id: getId(),
      label: '学生1',
      name: 'StudentA',
      courseType: 'wenke',
      course: ['1'],
    },
    {
      id: getId(),
      label: '学生2',
      name: 'StudentB',
      courseType: 'wenke',
      course: [],
    },
  ],
};

const rules = {
  school: [{ required: true, message: '学校必填' }],
  name: [{ required: true, message: '用户名必填' }],
  courseType: [{ required: true, message: '选科必填' }],
  course: [{ required: true, message: '课程必填' }],
};

const SCHOOL_OPTIONS = [
  { label: '学校一', value: 1 },
  { label: '学校二', value: 2 },
  { label: '学校三', value: 3 },
];

const COURSE_OPTIONS = [
  { label: '全部', checkAll: true },
  { label: '语文', value: '1', courseTypes: ['wenke', 'like'] },
  { label: '数学', value: '2', courseTypes: ['wenke', 'like'] },
  { label: '物理', value: '3', courseTypes: ['like'] },
  { label: '化学', value: '4', courseTypes: ['like'] },
  { label: '地理', value: '5', courseTypes: ['wenke'] },
  { label: '历史', value: '6', courseTypes: ['wenke'] },
];

export default function BaseForm() {
  const [studentTab, setStudentTab] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);

  const courseOptions = COURSE_OPTIONS.filter((item) => {
    if (!formData.courseType || !item.courseTypes) return true;
    return item.courseTypes.includes(formData.courseType);
  });

  const onSubmit = ({ validateResult, firstError }) => {
    if (validateResult === true) {
      MessagePlugin.success('提交成功');
    } else {
      console.log('Errors: ', validateResult);
      MessagePlugin.warning(firstError);
      // 判断错误在第几个 Tab，而后自动切换到第几个
      for (let i = 0, len = formData.students.length; i < len; i++) {
        const item = formData.students[i];
        const keys = Object.keys(item).map((key) => `students[${i}].${key}`);
        // 数组数据 key 在 validateResult 中存在，则表示校验不通过
        const isInvalid = keys.find((key) => validateResult[key]);
        if (isInvalid) {
          setStudentTab(item.id);
          return;
        }
      }
    }
  };

  const onReset = () => {
    MessagePlugin.info('重置成功');
  };

  const onAddStudent = () => {
    const id = getId();
    formData.students.push({
      id,
      label: `学生${id}`,
      name: '',
      courseType: 'wenke',
      course: [],
      status: false,
    });
    setFormData(formData);
    setStudentTab(id);
  };

  return (
    <Form rules={rules} resetType="initial" onReset={onReset} onSubmit={onSubmit}>
      <FormItem label="学校" name="school" initialData={formData.school}>
        <Radio.Group options={SCHOOL_OPTIONS} />
      </FormItem>
      <Tabs
        value={studentTab}
        onChange={(v) => setStudentTab(v)}
        theme="card"
        addable
        onAdd={onAddStudent}
        style={{ marginLeft: 30, border: '1px solid var(--td-component-stroke)' }}
      >
        {formData.students.map((student, index) => (
          <Tabs.TabPanel key={student.id} value={student.id} label={student.label} destroyOnHide={false}>
            <div style={{ padding: '24px 24px 24px 0' }}>
              <FormItem label="姓名" name={`students[${index}].name`} label-width={80} initialData={student.name}>
                <Input placeholder="请输入内容" />
              </FormItem>

              <FormItem label="选科" name={`students[${index}].name`} label-width={80} initialData={student.courseType}>
                <Radio.Group>
                  <Radio value="wenke">文科</Radio>
                  <Radio value="like">理科</Radio>
                </Radio.Group>
              </FormItem>

              <FormItem label="课程" name={`students[${index}].name`} label-width={80} initialData={student.course}>
                <Checkbox.Group>
                  {courseOptions.map(({ value, name, label }, index) => (
                    <Checkbox key={index} value={value} name={name} label={label} />
                  ))}
                </Checkbox.Group>
              </FormItem>

              <FormItem style={{ marginLeft: 100 }}>
                <Button theme="primary" type="submit" style={{ marginRight: 10 }}>
                  提交
                </Button>
                <Button theme="default" variant="base" type="reset">
                  重置
                </Button>
              </FormItem>
            </div>
          </Tabs.TabPanel>
        ))}
      </Tabs>
    </Form>
  );
}

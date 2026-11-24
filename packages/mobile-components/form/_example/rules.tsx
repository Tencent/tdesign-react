import React, { useEffect, useRef, useState } from 'react';
import { Button, DateTimePicker, Form, Input, Popup, Radio, RadioGroup, Stepper } from 'tdesign-mobile-react';

const initialData = {
  name: 'Abcdefghijk',
  gender: '',
  birth: '',
  age: 3,
};

const rules = {
  name: [{ validator: (val: any) => val?.length === 8, message: '只能输入8个字符英文' }],
  gender: [{ validator: (val: any) => val !== '', message: '不能为空' }],
  birth: [{ validator: (val: any) => val !== '', message: '不能为空' }],
  age: [{ validator: (val: any) => val <= 2, message: '输入的数字不能大于用户所填生日对应的年龄' }],
};

export default function RulesForm({
  labelAlign = 'top',
  disabled,
}: {
  labelAlign?: 'left' | 'right' | 'top';
  disabled?: boolean;
}) {
  const [form] = Form.useForm();
  const [birthVisible, setBirthVisible] = useState(false);
  const birthInputRef = useRef<any>(null);

  const isHorizontal = labelAlign !== 'top';

  useEffect(() => {
    const timer = setTimeout(() => {
      form.validate?.();
    });
    return () => clearTimeout(timer);
  }, [form]);

  useEffect(() => {
    if (!birthVisible) {
      birthInputRef.current?.blur?.();
    }
  }, [birthVisible]);

  const onBirthConfirm = (value: any) => {
    form.setFieldsValue({ birth: String(value) });
    setBirthVisible(false);
  };

  const onReset = () => {
    console.log('[onReset]');
  };

  const onSubmit = (e: any) => {
    console.log('[onSubmit]', e);
  };

  return (
    <>
      <Form
        form={form}
        initialData={initialData}
        showErrorMessage
        labelAlign={labelAlign}
        labelWidth={isHorizontal ? '81px' : undefined}
        disabled={disabled}
        rules={rules}
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <Form.FormItem label="用户名" name="name">
          <Input borderless placeholder="请输入用户名" />
        </Form.FormItem>
        <Form.FormItem label="性别" name="gender">
          <RadioGroup borderless direction="horizontal">
            <Radio value="man" label="男" />
            <Radio value="women" label="女" />
            <Radio value="secret" label="保密" />
          </RadioGroup>
        </Form.FormItem>
        <Form.FormItem arrow label="生日" name="birth">
          <Input
            ref={birthInputRef}
            borderless
            readonly
            placeholder="请选择"
            onFocus={() => {
              setBirthVisible(true);
            }}
          />
        </Form.FormItem>
        <Form.FormItem label="年限" name="age">
          <Stepper theme="filled" />
        </Form.FormItem>
        <div style={{ display: 'flex', gap: '16px', padding: '16px' }}>
          <Button theme="light" type="reset" size="large" style={{ flex: 1 }}>
            重置
          </Button>
          <Button theme="primary" type="submit" size="large" style={{ flex: 1 }}>
            提交
          </Button>
        </div>
      </Form>

      <Popup visible={birthVisible} placement="bottom" onVisibleChange={(v) => setBirthVisible(v)}>
        <DateTimePicker
          mode="date"
          title="选择日期"
          start="2015-5-5"
          format="YYYY-MM-DD"
          onConfirm={onBirthConfirm}
          onCancel={() => setBirthVisible(false)}
        />
      </Popup>
    </>
  );
}

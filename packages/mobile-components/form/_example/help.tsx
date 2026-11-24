import React, { useEffect, useRef, useState } from 'react';
import { DateTimePicker, Form, Input, Popup, Radio, RadioGroup } from 'tdesign-mobile-react';
import { BrowseOffIcon } from 'tdesign-icons-react';

const initialData = {
  name: 'Abcdefgh',
  password: 'Abcdefgh',
  gender: 'man',
  birth: '2022-08-10',
};

export default function StatusForm({
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
    if (!birthVisible) {
      birthInputRef.current?.blur?.();
    }
  }, [birthVisible]);

  const onBirthConfirm = (value: any) => {
    form.setFieldsValue({ birth: String(value) });
    setBirthVisible(false);
  };

  return (
    <>
      <Form
        form={form}
        initialData={initialData}
        labelAlign={labelAlign}
        labelWidth={isHorizontal ? '81px' : undefined}
        disabled={disabled}
      >
        <Form.FormItem label="用户名" name="name" help="用户名支持大小写英文字母，最多 8 个字符">
          <Input borderless placeholder="请输入用户名" />
        </Form.FormItem>
        <Form.FormItem label="密码" name="password" help="密码长度 6–16 位，支持字母、数字">
          <Input borderless type="password" placeholder="请输入密码" suffixIcon={<BrowseOffIcon />} />
        </Form.FormItem>
        <Form.FormItem label="性别" name="gender" help="性别不能为空">
          <RadioGroup borderless direction="horizontal">
            <Radio value="man" label="男" />
            <Radio value="women" label="女" />
            <Radio value="secret" label="保密" />
          </RadioGroup>
        </Form.FormItem>
        <Form.FormItem arrow label="生日" name="birth" help="生日不能为空">
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

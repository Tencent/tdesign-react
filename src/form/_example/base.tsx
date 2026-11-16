import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Button,
  Cascader,
  DateTimePicker,
  Form,
  Input,
  Popup,
  Radio,
  RadioGroup,
  Rate,
  Stepper,
  Textarea,
  Upload,
  type UploadFile,
} from 'tdesign-mobile-react';
import { BrowseOffIcon } from 'tdesign-icons-react';

const action = 'https://service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo';

const initialPhoto: UploadFile[] = [
  {
    url: 'https://tdesign.gtimg.com/mobile/demos/example4.png',
    name: 'uploaded1.png',
    type: 'image',
  },
  {
    url: 'https://tdesign.gtimg.com/mobile/demos/example6.png',
    name: 'uploaded2.png',
    type: 'image',
  },
];

const initialData = {
  name: 'Abcdefgh',
  password: 'Abcdefgh',
  gender: 'man',
  birth: '2022-08-10',
  place: '广东省 深圳市',
  age: 3,
  description: 3.5,
  resume: '本人性格开朗、稳重、细心，待人热情、真诚，工作认真负责，积极主动，勇于创新，具有很强的团队协作精神。',
  photo: initialPhoto,
};

const addressOptions = [
  {
    label: '广东省',
    value: '440000',
    children: [{ value: '440300', label: '深圳市' }],
  },
  {
    label: '北京市',
    value: '110000',
    children: [
      {
        value: '110100',
        label: '北京市',
        children: [
          { value: '110101', label: '东城区' },
          { value: '110102', label: '西城区' },
          { value: '110105', label: '朝阳区' },
          { value: '110108', label: '海淀区' },
        ],
      },
    ],
  },
  {
    label: '天津市',
    value: '120000',
    children: [
      {
        value: '120100',
        label: '天津市',
        children: [
          { value: '120101', label: '和平区' },
          { value: '120102', label: '河东区' },
          { value: '120103', label: '河西区' },
          { value: '120104', label: '南开区' },
        ],
      },
    ],
  },
];

const onFail = ({ file, e }: any) => {
  console.log('[onFail]', { file, e });
};

const onProgress = ({ file, percent, type, e }: any) => {
  console.log('[onProgress]', { file, percent, type, e });
};

const onPreview = ({ file, e }: any) => {
  console.log('[onPreview]', { file, e });
};

const onSuccess = ({ file, fileList, response, e }: any) => {
  console.log('[onSuccess]', { file, fileList, e, response });
};

const onRemove = ({ index, file, e }: any) => {
  console.log('[onRemove]', { index, file, e });
};

const onSelectChange = (files: UploadFile[]) => {
  console.log('[onSelectChange]', files);
};

export interface BaseFormProps {
  labelAlign?: 'left' | 'right' | 'top';
  disabled?: boolean;
}

export default function BaseForm({ labelAlign = 'top', disabled }: BaseFormProps) {
  const [form] = Form.useForm();
  const [birthVisible, setBirthVisible] = useState(false);
  const [placeVisible, setPlaceVisible] = useState(false);
  const [placeValue, setPlaceValue] = useState<string | number>('440300');
  const birthInputRef = useRef<any>(null);
  const placeInputRef = useRef<any>(null);

  const isHorizontal = labelAlign !== 'top';

  useEffect(() => {
    if (!birthVisible) {
      birthInputRef.current?.blur?.();
    }
  }, [birthVisible]);

  useEffect(() => {
    if (!placeVisible) {
      placeInputRef.current?.blur?.();
    }
  }, [placeVisible]);

  const rules = useMemo(
    () => ({
      name: [{ validator: (val: any) => val?.length === 8, message: '只能输入8个字符英文' }],
      password: [{ validator: (val: any) => val?.length > 6, message: '密码长度 6–16 位，支持字母、数字' }],
      gender: [{ validator: (val: any) => val !== '', message: '不能为空' }],
      birth: [{ validator: (val: any) => val !== '', message: '不能为空' }],
      place: [{ validator: (val: any) => val !== '', message: '不能为空' }],
      description: [{ validator: (val: any) => val > 3, message: '分数过低会影响整体评价' }],
      resume: [{ validator: (val: any) => val !== '', message: '不能为空' }],
    }),
    [],
  );

  const onBirthConfirm = (value: any) => {
    form.setFieldsValue({ birth: String(value) });
    setBirthVisible(false);
  };

  const onPlaceChange = (value: string | number, selectedOptions: any) => {
    setPlaceValue(value);
    setPlaceVisible(false);
    form.setFieldsValue({ place: selectedOptions?.map((item: any) => item.label).join(' ') });
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
        resetType="empty"
        labelAlign={labelAlign}
        labelWidth={isHorizontal ? '81px' : undefined}
        scrollToFirstError="auto"
        disabled={disabled}
        rules={rules}
        onReset={onReset}
        onSubmit={onSubmit}
      >
        <Form.FormItem label="用户名" name="name">
          <Input borderless placeholder="请输入用户名" />
        </Form.FormItem>
        <Form.FormItem label="密码" name="password">
          <Input borderless type="password" placeholder="请输入密码" suffixIcon={<BrowseOffIcon />} />
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
        <Form.FormItem arrow label="籍贯" name="place">
          <Input
            ref={placeInputRef}
            borderless
            readonly
            placeholder="请选择"
            onFocus={() => {
              setPlaceVisible(true);
            }}
          />
        </Form.FormItem>
        <Form.FormItem label="年限" name="age">
          <Stepper theme="filled" />
        </Form.FormItem>
        <Form.FormItem label="自我评价" name="description">
          <Rate allowHalf showText={false} gap={8} />
        </Form.FormItem>
        <Form.FormItem label="个人简介" name="resume">
          <Textarea
            style={{ width: '100%' }}
            autosize={{ minRows: 4, maxRows: 4 }}
            indicator
            maxlength={50}
            placeholder="请输入个人简介"
          />
        </Form.FormItem>
        <Form.FormItem label="上传照片" name="photo">
          <Upload
            multiple
            max={6}
            action={action}
            onFail={onFail}
            onProgress={onProgress}
            onPreview={onPreview}
            onSuccess={onSuccess}
            onRemove={onRemove}
            onSelectChange={onSelectChange}
          />
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

      <Cascader
        title="选择地址"
        value={placeValue}
        visible={placeVisible}
        options={addressOptions}
        onChange={onPlaceChange}
        onClose={() => {
          setPlaceVisible(false);
        }}
      />
    </>
  );
}

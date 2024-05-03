import React, { useState } from 'react';
import { Radio, Space } from 'tdesign-react';

type GeneratorGender<T extends string, Num extends string> = `${T}${Num}`;
type Gender1 = 'bj' | 'sz' | 'gz' | 'sh';
type Gender2 = GeneratorGender<Gender1, '1'>;
type Gender3 = GeneratorGender<Gender1, '2'>;

export default function RadioExample() {
  const [gender1, setGender1] = useState<Gender1>('bj');
  const [gender2, setGender2] = useState<Gender2>('sh1');
  const [gender3, setGender3] = useState<Gender3>('gz2');

  return (
    <Space>
      <Space direction="vertical">
        <Radio.Group size="small" value={gender1} onChange={(value: Gender1) => setGender1(value)}>
          <Radio.Button value="bj">北京</Radio.Button>
          <Radio.Button value="sh">上海</Radio.Button>
          <Radio.Button value="gz">广州</Radio.Button>
          <Radio.Button value="sz">深圳</Radio.Button>
        </Radio.Group>

        <Radio.Group value={gender2} onChange={(value: Gender2) => setGender2(value)}>
          <Radio.Button value="bj1">北京</Radio.Button>
          <Radio.Button value="sh1">上海</Radio.Button>
          <Radio.Button value="gz1">广州</Radio.Button>
          <Radio.Button value="sz1">深圳</Radio.Button>
        </Radio.Group>

        <Radio.Group size="large" value={gender3} onChange={(value: Gender3) => setGender3(value)}>
          <Radio.Button value="bj2">北京</Radio.Button>
          <Radio.Button value="sh2">上海</Radio.Button>
          <Radio.Button value="gz2">广州</Radio.Button>
          <Radio.Button value="sz2">深圳</Radio.Button>
        </Radio.Group>
      </Space>

      <Space direction="vertical">
        <Radio.Group
          variant="default-filled"
          size="small"
          value={gender1}
          onChange={(value: Gender1) => setGender1(value)}
        >
          <Radio.Button value="bj">北京</Radio.Button>
          <Radio.Button value="sh">上海</Radio.Button>
          <Radio.Button value="gz">广州</Radio.Button>
          <Radio.Button value="sz">深圳</Radio.Button>
        </Radio.Group>

        <Radio.Group variant="default-filled" value={gender2} onChange={(value: Gender2) => setGender2(value)}>
          <Radio.Button value="bj1">北京</Radio.Button>
          <Radio.Button value="sh1">上海</Radio.Button>
          <Radio.Button value="gz1">广州</Radio.Button>
          <Radio.Button value="sz1">深圳</Radio.Button>
        </Radio.Group>

        <Radio.Group
          variant="default-filled"
          size="large"
          value={gender3}
          onChange={(value: Gender3) => setGender3(value)}
        >
          <Radio.Button value="bj2">北京</Radio.Button>
          <Radio.Button value="sh2">上海</Radio.Button>
          <Radio.Button value="gz2">广州</Radio.Button>
          <Radio.Button value="sz2">深圳</Radio.Button>
        </Radio.Group>
      </Space>
    </Space>
  );
}

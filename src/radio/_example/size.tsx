import React, { useState } from 'react';
import { Radio, Space } from 'tdesign-react';

export default function RadioExample() {
  const [gender1, setGender1] = useState('bj');
  const [gender2, setGender2] = useState('sh1');
  const [gender3, setGender3] = useState('gz2');

  return (
    <Space>
      <Space direction="vertical">
        <Radio.Group size="small" value={gender1} onChange={(value) => setGender1(value)}>
          <Radio.Button value="bj">北京</Radio.Button>
          <Radio.Button value="sh">上海</Radio.Button>
          <Radio.Button value="gz">广州</Radio.Button>
          <Radio.Button value="sz">深圳</Radio.Button>
        </Radio.Group>

        <Radio.Group value={gender2} onChange={(value) => setGender2(value)}>
          <Radio.Button value="bj1">北京</Radio.Button>
          <Radio.Button value="sh1">上海</Radio.Button>
          <Radio.Button value="gz1">广州</Radio.Button>
          <Radio.Button value="sz1">深圳</Radio.Button>
        </Radio.Group>

        <Radio.Group size="large" value={gender3} onChange={(value) => setGender3(value)}>
          <Radio.Button value="bj2">北京</Radio.Button>
          <Radio.Button value="sh2">上海</Radio.Button>
          <Radio.Button value="gz2">广州</Radio.Button>
          <Radio.Button value="sz2">深圳</Radio.Button>
        </Radio.Group>
      </Space>

      <Space direction="vertical">
        <Radio.Group variant="default-filled" size="small" value={gender1} onChange={(value) => setGender1(value)}>
          <Radio.Button value="bj">北京</Radio.Button>
          <Radio.Button value="sh">上海</Radio.Button>
          <Radio.Button value="gz">广州</Radio.Button>
          <Radio.Button value="sz">深圳</Radio.Button>
        </Radio.Group>

        <Radio.Group variant="default-filled" value={gender2} onChange={(value) => setGender2(value)}>
          <Radio.Button value="bj1">北京</Radio.Button>
          <Radio.Button value="sh1">上海</Radio.Button>
          <Radio.Button value="gz1">广州</Radio.Button>
          <Radio.Button value="sz1">深圳</Radio.Button>
        </Radio.Group>

        <Radio.Group variant="default-filled" size="large" value={gender3} onChange={(value) => setGender3(value)}>
          <Radio.Button value="bj2">北京</Radio.Button>
          <Radio.Button value="sh2">上海</Radio.Button>
          <Radio.Button value="gz2">广州</Radio.Button>
          <Radio.Button value="sz2">深圳</Radio.Button>
        </Radio.Group>
      </Space>
    </Space>
  );
}

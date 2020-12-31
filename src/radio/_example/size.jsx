import React, { useState } from 'react';
import { Radio } from '@tencent/tdesign-react';

export default function RadioExample() {
  const [gender, setGender] = useState('male');

  return (
    <>
      <Radio.Group size="small" value={gender} onChange={(value) => setGender(value)}>
        <Radio.Button name="bj">北京</Radio.Button>
        <Radio.Button name="sh">上海</Radio.Button>
        <Radio.Button name="gz">广州</Radio.Button>
        <Radio.Button name="sz">深圳</Radio.Button>
      </Radio.Group>
      <br />
      <Radio.Group value={gender} onChange={(value) => setGender(value)}>
        <Radio.Button name="bj1">北京</Radio.Button>
        <Radio.Button name="sh1">上海</Radio.Button>
        <Radio.Button name="gz1">广州</Radio.Button>
        <Radio.Button name="sz1">深圳</Radio.Button>
      </Radio.Group>
      <br />
      <Radio.Group size="large" value={gender} onChange={(value) => setGender(value)}>
        <Radio.Button name="bj2">北京</Radio.Button>
        <Radio.Button name="sh2">上海</Radio.Button>
        <Radio.Button name="gz2">广州</Radio.Button>
        <Radio.Button name="sz2">深圳</Radio.Button>
      </Radio.Group>
    </>
  );
}

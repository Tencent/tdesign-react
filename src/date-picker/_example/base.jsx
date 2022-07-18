import React, { useState } from 'react';
import { DatePicker, Radio, Space } from 'tdesign-react';

export default function YearDatePicker() {
  const [valueType, setValueType] = useState('YYYY-MM-DD');

  function handleChange(value) {
    console.log(value);
  }

  return (
    <Space direction="vertical">
      <h3>valueType: </h3>
      <div>
        <Radio.Group variant="default-filled" value={valueType} onChange={(value) => setValueType(value)}>
          <Radio.Button value="YYYY-MM-DD">YYYY-MM-DD</Radio.Button>
          <Radio.Button value="time-stamp">time-stamp</Radio.Button>
        </Radio.Group>
      </div>

      <DatePicker valueType={valueType} onChange={handleChange} />
      <DatePicker placeholder="可清除、可输入的日期选择器" valueType={valueType} onChange={handleChange} clearable allowInput />
    </Space>
  );
}

import React from 'react';
import { DatePicker } from 'tdesign-react';

export default function YearDatePicker() {
  function handleChange(value) {
    console.log(value);
  }

  return (
    <div className="tdesign-demo-block-column">
      <DatePicker mode="year" onChange={handleChange} />
      <DatePicker placeholder="可清除的年份选择器" mode="year" clearable onChange={handleChange} />
      <DatePicker placeholder="可输入的年份选择器" mode="year" allowInput onChange={handleChange} />
      <DatePicker placeholder="可清除、可输入的年份选择器" mode="year" clearable allowInput onChange={handleChange} />
    </div>
  );
}

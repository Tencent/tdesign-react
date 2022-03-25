import React from 'react';
import { DatePicker } from 'tdesign-react';

export default function YearDatePicker() {
  function handleChange(value) {
    console.log(value);
  }

  return (
    <div className="tdesign-demo-block-column">
      <DatePicker mode="month" onChange={handleChange} />
      <DatePicker placeholder="可清除的月份选择器" mode="month" clearable onChange={handleChange} />
      <DatePicker placeholder="可输入的月份选择器" mode="month" allowInput onChange={handleChange} />
      <DatePicker placeholder="可清除、可输入的月份选择器" mode="month" clearable allowInput onChange={handleChange} />
    </div>
  );
}

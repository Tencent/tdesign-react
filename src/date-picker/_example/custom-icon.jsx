import React from 'react';
import { DatePicker } from 'tdesign-react';
import { BrowseIcon, LockOnIcon } from 'tdesign-icons-react';

export default function YearDatePicker() {
  function handleChange(value) {
    console.log(value);
  }

  return (
    <div className="tdesign-demo-item--datepicker">
      <DatePicker prefixIcon={<BrowseIcon />} suffixIcon={<LockOnIcon />} onChange={handleChange} />
    </div>
  );
}

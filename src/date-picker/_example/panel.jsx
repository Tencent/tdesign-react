import React from 'react';
import { DatePickerPanel, DateRangePickerPanel, Space } from 'tdesign-react';

export default function PanelExample() {
  function handleChange(value) {
    console.log(value);
  }

  return (
    <Space direction="vertical">
      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DatePickerPanel onChange={handleChange} />
      </div>
      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DatePickerPanel enableTimePicker onChange={handleChange} />
      </div>

      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DateRangePickerPanel onChange={handleChange} />
      </div>
      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DateRangePickerPanel enableTimePicker onChange={handleChange} />
      </div>
    </Space>
  );
}

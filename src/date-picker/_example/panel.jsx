import React from 'react';
import { DatePickerPanel, DateRangePickerPanel, Space } from 'tdesign-react';

export default function PanelExample() {
  function handleChange(value) {
    console.log('onChange', value);
  }

  function handleCellClick(value) {
    console.log('onCellClick', value);
  }

  return (
    <Space direction="vertical">
      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DatePickerPanel onCellClick={handleCellClick} onChange={handleChange} />
      </div>
      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DatePickerPanel enableTimePicker onCellClick={handleCellClick} onChange={handleChange} />
      </div>

      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DateRangePickerPanel onCellClick={handleCellClick} onChange={handleChange} />
      </div>
      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DateRangePickerPanel enableTimePicker onCellClick={handleCellClick} onChange={handleChange} />
      </div>
    </Space>
  );
}

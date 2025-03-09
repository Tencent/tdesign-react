import React from 'react';
import { DatePickerPanel, DateRangePickerPanel, Space } from 'tdesign-react';
import type { DatePickerPanelProps, DateRangePickerPanelProps } from 'tdesign-react';

export default function PanelExample() {
  const handleChange: DatePickerPanelProps['onChange'] = (value) => {
    console.log('onChange', value);
  };

  const handleCellClick: DatePickerPanelProps['onCellClick'] = (value) => {
    console.log('onCellClick', value);
  };

  const handleRangeChange: DateRangePickerPanelProps['onChange'] = (value) => {
    console.log('onChange', value);
  };

  const handleRangeCellClick: DateRangePickerPanelProps['onCellClick'] = (value) => {
    console.log('onCellClick', value);
  };

  return (
    <Space direction="vertical">
      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DatePickerPanel onCellClick={handleCellClick} onChange={handleChange} />
      </div>
      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DatePickerPanel enableTimePicker onCellClick={handleCellClick} onChange={handleChange} />
      </div>

      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DateRangePickerPanel onCellClick={handleRangeCellClick} onChange={handleRangeChange} />
      </div>
      <div style={{ border: '1px solid var(--td-border-level-2-color)', width: 'fit-content', borderRadius: 3 }}>
        <DateRangePickerPanel enableTimePicker onCellClick={handleRangeCellClick} onChange={handleRangeChange} />
      </div>
    </Space>
  );
}

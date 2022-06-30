import React from 'react';
import merge from 'lodash/merge';
import { ConfigProvider, DatePicker, DateRangePicker, Space } from 'tdesign-react';
import enConfig from 'tdesign-react/es/locale/en_US';

export default function configDemo() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig = merge(enConfig, {
    datePicker: {
      placeholder: {
        date: 'select date',
        month: 'select month',
        year: 'select year',
      },
      weekdays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      rangeSeparator: ' ~ ',
      format: 'DD/MM/YYYY',
      yearAriaLabel: '',
      now: 'Now',
      selectTime: 'Select Time',
      selectDate: 'Select Date',
    },
  });

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Space direction="vertical">
        <DatePicker mode="date" firstDayOfWeek={7} />

        <DateRangePicker mode="date" range />

        <DatePicker mode="month" />

        <DateRangePicker mode="month" range />

        <DatePicker mode="year" />

        <DateRangePicker mode="year" range />
      </Space>
    </ConfigProvider>
  );
}

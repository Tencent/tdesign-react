import React from 'react';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';

import BaseDemo from './year-month-date';
import YearMonthDemo from './year-month';
import TimeDemo from './hour-minute-second';
import MinuteDemo from './hour-minute';
import DateSecondDemo from './date-all';
import WithTitleDemo from './with-title';
import WithoutTitleDemo from './without-title';
import ShowWeekDemo from './show-week';
import StepsDemo from './steps';

export default function DateTimePickerDemo() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader title="DateTimePicker 时间选择器" summary="用于选择一个时间点或者一个时间段。" />
      <TDemoBlock title="01 组件类型" padding={false} summary="年月日选择器">
        <BaseDemo />
      </TDemoBlock>
      <TDemoBlock summary="年月选择器">
        <YearMonthDemo />
      </TDemoBlock>
      <TDemoBlock summary="时分秒选择器">
        <TimeDemo />
      </TDemoBlock>
      <TDemoBlock summary="时分选择器">
        <MinuteDemo />
      </TDemoBlock>
      <TDemoBlock summary="年月日时分秒选择器">
        <DateSecondDemo />
      </TDemoBlock>
      <TDemoBlock summary="年月日带星期选择器">
        <ShowWeekDemo />
      </TDemoBlock>
      <TDemoBlock summary="间隔时间选择器">
        <StepsDemo />
      </TDemoBlock>
      <TDemoBlock title="02 组件样式" summary="是否带标题">
        <WithTitleDemo />
      </TDemoBlock>
      <TDemoBlock>
        <WithoutTitleDemo />
      </TDemoBlock>
    </div>
  );
}

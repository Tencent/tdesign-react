import React from 'react';
import { Space, Statistic } from 'tdesign-react';
import { ControlPlatformIcon, ArrowTriangleDownFilledIcon } from 'tdesign-icons-react';

const SlotStatistic = () => (
  <Space size={32}>
    <Statistic title="Total Assets" value={56.32} unit="%" prefix={<ControlPlatformIcon />}></Statistic>
    <Statistic title="Total Assets" value={176059} prefix="$" unit="%" trend="increase" />

    <Statistic
      title="Total Assets"
      value={62.58}
      unit="%"
      suffix={<ArrowTriangleDownFilledIcon style={{ color: '#ee4d38' }} />}
    ></Statistic>
  </Space>
);

export default SlotStatistic;

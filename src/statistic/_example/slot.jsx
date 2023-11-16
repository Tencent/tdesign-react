import React from 'react';
import { Space, Statistic } from 'tdesign-react';
import { ControlPlatformIcon, ArrowTriangleDownFilledIcon } from 'tdesign-icons-react';

const SlotStatistic = () => (
  <Space>
    <Statistic title="Total Assets" value={56.32} unit="%" prefix={<ControlPlatformIcon />}></Statistic>
    <Statistic title="Total Assets" value={176059} prefix="$" unit="%" trend="increase" />

    <Statistic
      title="Total Assets"
      value={62.58}
      suffix={<ArrowTriangleDownFilledIcon style={{ color: '#ee4d38' }} />}
    ></Statistic>
  </Space>
);

export default SlotStatistic;

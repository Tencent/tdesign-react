import React from 'react';
import { Space, Statistic } from 'tdesign-react';

const BaseStatistic = () => (
  <Space size={100}>
    <Statistic title="Total Assets" value={82.76} unit="%" trend="increase" />
    <Statistic title="Total Assets" value={82.76} unit="USD" trend="increase" />
  </Space>
);

export default BaseStatistic;

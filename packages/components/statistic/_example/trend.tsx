import React from 'react';
import { Space, Statistic } from 'tdesign-react';

const TrendStatistic = () => (
  <Space size={100}>
    <Statistic title="Total Assets" value={82.76} unit="%" trend="increase" />
    <Statistic title="Total Assets" value={82.76} unit="%" trend="decrease" />
    <Statistic title="Total Assets" value={82.76} unit="%" trend="decrease" trendPlacement="right" />
  </Space>
);

export default TrendStatistic;

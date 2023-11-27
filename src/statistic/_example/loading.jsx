import React from 'react';
import { Space, Switch, Statistic } from 'tdesign-react';

const LoadingStatistic = () => {
  const [loading, setLoading] = React.useState(true);
  return (
    <Space direction="vertical">
      <Switch value={loading} onChange={(value) => setLoading(value)} size="large" />
      <Statistic title="Downloads" value={123456} loading={loading} />
    </Space>
  );
};

export default LoadingStatistic;

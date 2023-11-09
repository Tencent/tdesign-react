import React from 'react';
import { Space, Statistic, Card, Divider } from 'tdesign-react';
import { IconFont } from 'tdesign-icons-react';

const CombinationStatistic = () => {
  const iconStyle = {
    fontSize: '32px',
    color: '#0052d9',
    background: '#f2f3ffff',
    borderRadius: '6px',
    padding: '12px',
  };
  const separator = <Divider layout="vertical" style={{ height: '100%' }} />;
  return (
    <Space size={100} breakLine>
      <Space align="center">
        <IconFont name="chart" style={iconStyle} />
        <Statistic title="Total Assets" value={82.76} unit="%" trend="increase" trendPlacement="right" />
      </Space>

      <Space align="center">
        <Statistic title="Total Assets" value={52.18} unit="%" trend="decrease" />
        <IconFont name="internet" style={{ ...iconStyle, borderRadius: '50%' }} />
      </Space>

      <Card title="Yesterday traffic" headerBordered hoverShadow>
        <Space separator={separator}>
          <Statistic title="Voice duration" value={789} unit="minute" extra="the day before 9%" />
          <Statistic
            title="Total number of voice DAUs"
            value={188}
            color="red"
            extra={
              <Space direction="vertical" size={0}>
                <span>
                  the day before
                  <IconFont name="arrow-up" style={{ color: '#d54941' }} />
                  9%
                </span>
                <span>
                  last week
                  <IconFont name="arrow-down" style={{ color: '#2ba471' }} />
                  9%
                </span>
              </Space>
            }
          ></Statistic>
          <Statistic title="Total Assets" value={52.18} unit="%" trend="decrease" color="green" />
        </Space>
      </Card>
    </Space>
  );
};

export default CombinationStatistic;

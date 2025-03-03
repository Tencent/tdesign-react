import React from 'react';
import { Space, Statistic, Card, Divider } from 'tdesign-react';
import { IconFont } from 'tdesign-icons-react';

const CombinationStatistic = () => {
  const iconStyle = {
    fontSize: '32px',
    color: 'var(--td-brand-color)',
    background: 'var(--td-brand-color-light)',
    borderRadius: 'var(--td-radius-medium)',
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
                <Space align="center" size={7}>
                  <div style={{ width: '120px' }}>the day before</div>
                  <IconFont name="arrow-up" style={{ color: '#d54941', fontSize: 'var(--td-font-size-body-large)' }} />
                  9%
                </Space>
                <Space align="center" size={7}>
                  <div style={{ width: '120px' }}>last week</div>
                  <IconFont
                    name="arrow-down"
                    style={{ color: '#2ba471', fontSize: 'var(--td-font-size-body-large)' }}
                  />
                  9%
                </Space>
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

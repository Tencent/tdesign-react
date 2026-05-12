import React from 'react';
import { Badge, Space } from 'tdesign-react';

export default function BadgeExample() {
  const badgeBlockStyle = {
    width: '40px',
    height: '40px',
    background: '#EEEEEE',
    border: '1px solid #DCDCDC',
    borderRadius: '3px',
  };

  return (
    <Space direction="vertical">
      <Space size={24}>
        <Badge count="2" dot>
          <div style={badgeBlockStyle}></div>
        </Badge>
        <Badge count="hot">
          <div style={badgeBlockStyle}></div>
        </Badge>
        <Badge count="new" color="var(--td-success-color)">
          <div style={badgeBlockStyle}></div>
        </Badge>
        <Badge count="100" color="var(--brand-main)" shape="round">
          <div style={badgeBlockStyle}></div>
        </Badge>
      </Space>

      <Space size={24}>
        <Badge count="2" dot>
          <div style={badgeBlockStyle}></div>
        </Badge>
        <Badge count={<span style={{ color: 'var(--td-error-color)' }}>hot</span>} color="var(--td-error-color-1)">
          <div style={badgeBlockStyle}></div>
        </Badge>
        <Badge count={<span style={{ color: 'var(--td-success-color)' }}>new</span>} color="var(--td-success-color-1)">
          <div style={badgeBlockStyle}></div>
        </Badge>
        <Badge count={<span style={{ color: 'var(--td-brand-color)' }}>new</span>} color="var(--td-brand-color-1)">
          <div style={badgeBlockStyle}></div>
        </Badge>
      </Space>
    </Space>
  );
}

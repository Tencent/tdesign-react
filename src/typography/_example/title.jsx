import React from 'react';
import { Typography, Space } from 'tdesign-react';

export default function ThemeTagExample() {
  return (
    <Space direction="vertical" size="large">
      <Typography.Title level={1} style={{ margin: 0 }}>
        h1. TDesign
      </Typography.Title>
      <Typography.Title level={2} style={{ margin: 0 }}>
        h2. TDesign
      </Typography.Title>
      <Typography.Title level={3} style={{ margin: 0 }}>
        h3. TDesign
      </Typography.Title>
      <Typography.Title level={4} style={{ margin: 0 }}>
        h4. TDesign
      </Typography.Title>
      <Typography.Title level={5} style={{ margin: 0 }}>
        h5. TDesign
      </Typography.Title>
    </Space>
  );
}

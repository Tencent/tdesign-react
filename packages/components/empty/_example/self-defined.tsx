import React from 'react';
import { ErrorCircleIcon } from 'tdesign-icons-react';
import { Col, Empty, Row } from 'tdesign-react';

export default function BasicGrid() {
  const CustomImageContainer = (
    <div
      style={{
        width: '64px',
        height: '64px',
        backgroundImage: 'url(https://tdesign.gtimg.com/demo/demo-image-1.png)',
        backgroundSize: '100% 100%',
      }}
    />
  );
  return (
    <Row gutter={40}>
      <Col>
        <Empty image={<ErrorCircleIcon size={64} color="var(--td-text-color-placeholder)" />} description="暂无数据" />
      </Col>
      <Col>
        <Empty description="暂无数据" image={CustomImageContainer} />
      </Col>
    </Row>
  );
}

import React from 'react';
import { Button, Divider, Space } from 'tdesign-react';

const BaseSpace = () => (
  <Space align="center" separator={<Divider layout="vertical" />}>
    <Button variant="text">Text</Button>
    <Button variant="text">Text</Button>
    <Button variant="text">Text</Button>
  </Space>
);

export default BaseSpace;

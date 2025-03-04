import React from 'react';
import { Space, Button, Divider } from '@tdesign/components';

const BaseSpace = () => (
  <Space align="center" separator={<Divider layout="vertical" />}>
    <Button variant="text">Text</Button>
    <Button variant="text">Text</Button>
    <Button variant="text">Text</Button>
  </Space>
);

export default BaseSpace;

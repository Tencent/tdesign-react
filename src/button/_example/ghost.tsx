import React from 'react';
import { Button, Space } from 'tdesign-react';

export default function ButtonExample() {
  return (
    <Space direction="vertical">
      <Space>
        <Button variant="outline" ghost>
          幽灵按钮
        </Button>
        <Button variant="dashed" ghost>
          幽灵按钮
        </Button>
        <Button variant="text" ghost>
          幽灵按钮
        </Button>
      </Space>
      <Space>
        <Button variant="outline" theme="primary" ghost>
          幽灵按钮
        </Button>
        <Button variant="dashed" theme="primary" ghost>
          幽灵按钮
        </Button>
        <Button variant="text" theme="primary" ghost>
          幽灵按钮
        </Button>
      </Space>
      <Space>
        <Button variant="outline" theme="success" ghost>
          幽灵按钮
        </Button>
        <Button variant="dashed" theme="success" ghost>
          幽灵按钮
        </Button>
        <Button variant="text" theme="success" ghost>
          幽灵按钮
        </Button>
      </Space>
      <Space>
        <Button variant="outline" theme="warning" ghost>
          幽灵按钮
        </Button>
        <Button variant="dashed" theme="warning" ghost>
          幽灵按钮
        </Button>
        <Button variant="text" theme="warning" ghost>
          幽灵按钮
        </Button>
      </Space>
      <Space>
        <Button variant="outline" theme="danger" ghost>
          幽灵按钮
        </Button>
        <Button variant="dashed" theme="danger" ghost>
          幽灵按钮
        </Button>
        <Button variant="text" theme="danger" ghost>
          幽灵按钮
        </Button>
      </Space>
    </Space>
  );
}

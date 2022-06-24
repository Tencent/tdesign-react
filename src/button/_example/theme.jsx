import React from 'react';
import { Button, Space } from 'tdesign-react';

export default function ButtonExample() {
  return (
    <Space direction="vertical">
      <Space>
        <Button theme="default">填充按钮</Button>
        <Button variant="outline" theme="default">
          描边按钮
        </Button>
        <Button variant="dashed" theme="default">
          虚框按钮
        </Button>
        <Button variant="text" theme="default">
          文字按钮
        </Button>
      </Space>
      <Space>
        <Button theme="primary" variant="base">
          填充按钮
        </Button>
        <Button theme="primary" variant="outline">
          描边按钮
        </Button>
        <Button theme="primary" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="primary" variant="text">
          文字按钮
        </Button>
      </Space>
      <Space>
        <Button theme="danger" variant="base">
          填充按钮
        </Button>
        <Button theme="danger" variant="outline">
          描边按钮
        </Button>
        <Button theme="danger" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="danger" variant="text">
          文字按钮
        </Button>
      </Space>
      <Space>
        <Button theme="warning" variant="base">
          填充按钮
        </Button>
        <Button theme="warning" variant="outline">
          描边按钮
        </Button>
        <Button theme="warning" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="warning" variant="text">
          文字按钮
        </Button>
      </Space>
      <Space>
        <Button theme="success" variant="base">
          填充按钮
        </Button>
        <Button theme="success" variant="outline">
          描边按钮
        </Button>
        <Button theme="success" variant="dashed">
          虚框按钮
        </Button>
        <Button theme="success" variant="text">
          文字按钮
        </Button>
      </Space>
    </Space>
  );
}

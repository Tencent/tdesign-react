import React from 'react';
import { Button, Space } from 'tdesign-react';

export default function ButtonExample() {
  return (
    <Space direction="vertical">
      <Space direction="vertical" style={{ padding: '20px' }}>
        <Space>
          <Button loading theme="default">
            加载
          </Button>
          <Button loading variant="outline" theme="default">
            加载
          </Button>
          <Button loading variant="dashed" theme="default">
            加载
          </Button>
          <Button loading variant="text" theme="default">
            加载
          </Button>
        </Space>
        <Space>
          <Button loading theme="primary">
            加载
          </Button>
          <Button loading variant="outline" theme="primary">
            加载
          </Button>
          <Button loading variant="dashed" theme="primary">
            加载
          </Button>
          <Button loading variant="text" theme="primary">
            加载
          </Button>
        </Space>
        <Space>
          <Button loading theme="danger">
            加载
          </Button>
          <Button loading variant="outline" theme="danger">
            加载
          </Button>
          <Button loading variant="dashed" theme="danger">
            加载
          </Button>
          <Button loading variant="text" theme="danger">
            加载
          </Button>
        </Space>
        <Space>
          <Button loading theme="warning">
            加载
          </Button>
          <Button loading variant="outline" theme="warning">
            加载
          </Button>
          <Button loading variant="dashed" theme="warning">
            加载
          </Button>
          <Button loading variant="text" theme="warning">
            加载
          </Button>
        </Space>
        <Space>
          <Button loading theme="success">
            加载
          </Button>
          <Button loading variant="outline" theme="success">
            加载
          </Button>
          <Button loading variant="dashed" theme="success">
            加载
          </Button>
          <Button loading variant="text" theme="success">
            加载
          </Button>
        </Space>
      </Space>
      <Space direction="vertical" style={{ backgroundColor: 'black', padding: '20px' }}>
        <Space>
          <Button loading ghost theme="default">
            加载
          </Button>
          <Button loading ghost variant="outline" theme="default">
            加载
          </Button>
          <Button loading ghost variant="dashed" theme="default">
            加载
          </Button>
          <Button loading ghost variant="text" theme="default">
            加载
          </Button>
        </Space>
        <Space>
          <Button loading ghost theme="primary">
            加载
          </Button>
          <Button loading ghost variant="outline" theme="primary">
            加载
          </Button>
          <Button loading ghost variant="dashed" theme="primary">
            加载
          </Button>
          <Button loading ghost variant="text" theme="primary">
            加载
          </Button>
        </Space>
        <Space>
          <Button loading ghost theme="danger">
            加载
          </Button>
          <Button loading ghost variant="outline" theme="danger">
            加载
          </Button>
          <Button loading ghost variant="dashed" theme="danger">
            加载
          </Button>
          <Button loading ghost variant="text" theme="danger">
            加载
          </Button>
        </Space>
        <Space>
          <Button loading ghost theme="warning">
            加载
          </Button>
          <Button loading ghost variant="outline" theme="warning">
            加载
          </Button>
          <Button loading ghost variant="dashed" theme="warning">
            加载
          </Button>
          <Button loading ghost variant="text" theme="warning">
            加载
          </Button>
        </Space>
        <Space>
          <Button loading ghost theme="success">
            加载
          </Button>
          <Button loading ghost variant="outline" theme="success">
            加载
          </Button>
          <Button loading ghost variant="dashed" theme="success">
            加载
          </Button>
          <Button loading ghost variant="text" theme="success">
            加载
          </Button>
        </Space>
      </Space>
    </Space>
  );
}

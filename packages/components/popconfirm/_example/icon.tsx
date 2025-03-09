import React from 'react';
import { Button, Popconfirm, Space } from 'tdesign-react';
import { BrowseIcon } from 'tdesign-icons-react';

export default function IconUsageExample() {
  return (
    <Space direction="vertical">
      <Space>
        <Popconfirm content={'普通事件通知类型偏向于确认'}>
          <Button theme="primary">默认</Button>
        </Popconfirm>
        <Popconfirm content={'事件通知类型偏向于提示'} theme={'warning'}>
          <Button theme="warning">警告</Button>
        </Popconfirm>
        <Popconfirm content={'事件通知类型偏向于高危提醒'} theme={'danger'}>
          <Button theme="danger">危险</Button>
        </Popconfirm>
      </Space>
      <Space>
        <Popconfirm
          content={'基础气泡确认框文案示意文字按钮'}
          icon={<BrowseIcon />}
          popupProps={{ placement: 'bottom' }}
        >
          <Button theme="default" variant="outline">
            自定义图标（属性）
          </Button>
        </Popconfirm>
      </Space>
    </Space>
  );
}

import React from 'react';
import { Notification, Button, Space } from 'tdesign-react';

export default function NotificationExample() {
  return (
    <Space direction="vertical">
      <Notification
        theme="info"
        title="超出的文本省略号显示"
        content="文案不限长度，但是展示最大显示三行折行的末尾显示折行末尾显示折行末尾显示折行末尾显示折行末尾显示折行折行末尾显示折行折行末尾显示折行末尾显示折行折行末尾"
        footer={
          <div>
            <Button theme="primary" variant="text">
              查看详情
            </Button>
          </div>
        }
      />
      <Notification
        theme="info"
        title="自定义底部"
        content="使用 props function 自定义底部内容"
        footer={() => (
          <div>
            <Button theme="primary" variant="text">
              查看详情
            </Button>
          </div>
        )}
      />
      <Notification
        theme="info"
        content="1. 使用 props function 自定义标题；2. 使用插槽自定义底部内容"
        title={
          <div>
            自定义标题 <small>我是副标题</small>
          </div>
        }
        footer={
          <div slot="footer">
            <Button theme="default" variant="text">
              知道了
            </Button>
          </div>
        }
      />
      <Notification
        theme="info"
        content="1. 使用插槽自定义标题 2. 使用插槽自定义底部内容"
        title={
          <div>
            自定义标题 <small>我是副标题</small>
          </div>
        }
        footer={
          <div>
            <Button theme="default" variant="text">
              重启
            </Button>
            <Button theme="primary" variant="text">
              稍后提醒我(10s)
            </Button>
          </div>
        }
      />
      <Notification
        theme="info"
        title="自定义内容"
        content="使用插槽自定义内容"
        footer={
          <div>
            <Button theme="default" variant="text">
              重启
            </Button>
            <Button theme="primary" variant="text">
              更多
            </Button>
          </div>
        }
      ></Notification>
    </Space>
  );
}

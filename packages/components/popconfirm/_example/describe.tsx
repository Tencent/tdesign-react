import React, { useEffect } from 'react';
import { Button, Popconfirm, Space } from 'tdesign-react';

const classStyles = `
<style>
.title {
  font-weight: 500;
  font-size: 14px;
}
.describe {
  margin-top: 8px;
  font-size: 12px;
  color: var(--td-text-color-secondary);
}
</style>
`;
export default function ContentExample() {
  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);
  const content = (
    <>
      <p className="title">带描述的气泡确认框文字按钮</p>
      <p className="describe">带描述的气泡确认框在主要说明之外增加了操作相关的详细描述</p>
    </>
  );
  return (
    <Space>
      <Popconfirm theme={'default'} content={content}>
        <Button theme="primary">自定义浮层内容</Button>
      </Popconfirm>
      <Popconfirm theme={'warning'} content={content}>
        <Button theme="warning">自定义浮层内容</Button>
      </Popconfirm>
    </Space>
  );
}

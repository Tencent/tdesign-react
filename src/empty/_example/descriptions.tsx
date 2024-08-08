import React from 'react';
import { Empty, Button } from 'tdesign-react';

export default function Operation() {
  function goToIndex() {
    console.log('go to index');
    location.href = '/';
  }
  return (
    <Empty
      type="empty"
      action={<Button onClick={goToIndex}>返回首页</Button>}
      description="description"
      title="暂无数据"
    />
  );
}

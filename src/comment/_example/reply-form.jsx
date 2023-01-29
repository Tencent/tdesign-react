import React, { useState } from 'react';
import { Comment, Textarea, Button, NotificationPlugin, Space } from 'tdesign-react';

export default function BasicComment() {
  const [replyData, setReplayData] = useState('');

  function submitReply() {
    NotificationPlugin.info({
      title: '回复内容',
      content: replyData,
      duration: 3000,
    });
  }

  const replyForm = (
    <Space direction="vertical" align="end">
      <Textarea placeholder="请输入内容" value={replyData} onChange={setReplayData} />
      <Button onClick={submitReply}>回复</Button>
    </Space>
  );

  return <Comment avatar="https://tdesign.gtimg.com/site/avatar.jpg" content={replyForm} />;
}

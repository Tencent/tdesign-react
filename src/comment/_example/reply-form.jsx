import React, { useState } from 'react';
import { Comment, Textarea, Button, NotificationPlugin } from 'tdesign-react';

export default function BasicComment() {
  const [replyData, setReplayData] = useState('');

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  };

  const buttonStyle = {
    marginTop: '8px',
  };

  function submitReply() {
    NotificationPlugin.info({
      title: '回复内容',
      content: replyData,
      duration: 3000,
    });
  }

  const replyForm = (
    <div style={formStyle}>
      <Textarea
        placeholder="请输入内容"
        value={replyData}
        onChange={(value) => {
          setReplayData(value);
        }}
      />
      <Button style={buttonStyle} onClick={submitReply}>
        回复
      </Button>
    </div>
  );

  return <Comment avatar="https://tdesign.gtimg.com/site/avatar.jpg" content={replyForm} />;
}

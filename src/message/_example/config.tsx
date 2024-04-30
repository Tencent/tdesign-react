import React from 'react';
import { Space, Button,message,MessagePlugin } from 'tdesign-react';

export default function () {
  return (
    <Space direction="vertical">
      <Button
        onClick={()=>{
            message.config({
                duration: 0,
                placement: 'bottom',
                offset: [200,200],
                closeBtn: <div>关闭吧！！</div>,
                icon: <div>icon吧！！</div>,
                content: 'content 吧！！',
                style: {
                    backgroundColor: 'red'
                },
                className: 'test-hello'
                // onDurationEnd: () => {alert('duration')},
                // onCloseBtnClick: () => {alert('close')}
            });
        }}
      >
          配置
      </Button>
      <Button
        onClick={()=>{
            MessagePlugin.info({
                content: 'hello',
                closeBtn: '关闭'
            },0)
        }}
      >
          测试
      </Button>
    </Space>
  );
}

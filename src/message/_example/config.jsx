import React from 'react';
import { Space, Button,message } from 'tdesign-react';

export default function () {
  return (
    <Space direction="vertical">
      <Button
        onClick={()=>{
            message.config('bottom','body',[500,20],4000);
        }}
      >
          配置
      </Button>
      <Button
        onClick={()=>{
            message('info','hello',20000);
        }}
      >
          测试
      </Button>
    </Space>
  );
}

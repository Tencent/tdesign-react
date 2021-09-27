import React, { useState } from 'react';
import { Swiper, Alert, Button } from '@tencent/tdesign-react';

const { SwiperItem } = Swiper;

export default function BasicSwiper() {
  const [current, setCurrent] = useState(0);
  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-block-row">
        <Button
          onClick={() => {
            setCurrent(0);
          }}
        >
          跳到item-1
        </Button>
        <Button
          onClick={() => {
            setCurrent(1);
          }}
        >
          跳到item-2
        </Button>
        <Button
          onClick={() => {
            setCurrent(2);
          }}
        >
          跳到item-3
        </Button>
        <Button
          onClick={() => {
            setCurrent(3);
          }}
        >
          跳到item-4
        </Button>
      </div>
      <Swiper current={current}>
        <SwiperItem>
          <Alert theme="success" message="这是一条成功的消息提示" />
        </SwiperItem>
        <SwiperItem>
          <Alert theme="info" message="这是一条普通的消息提示" />
        </SwiperItem>
        <SwiperItem>
          <Alert theme="warning" message="这是一条警示消息" />
        </SwiperItem>
        <SwiperItem>
          <Alert theme="error" message="高危操作/出错信息提示" />
        </SwiperItem>
      </Swiper>
    </div>
  );
}

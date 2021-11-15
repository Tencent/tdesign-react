import React from 'react';
import { Swiper, Alert } from 'tdesign-react';

const { SwiperItem } = Swiper;

export default function BasicSwiper() {
  return (
    <Swiper direction="vertical">
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
  );
}

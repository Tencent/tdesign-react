import React from 'react';
import { Swiper } from 'tdesign-react';

const { SwiperItem } = Swiper;

export default function BasicSwiper() {
  return (
    <div className="tdesign-demo-block--swiper">
      <Swiper animation={'fade'} height={280}>
        <SwiperItem>
          <div className="demo-item">1</div>
        </SwiperItem>
        <SwiperItem>
          <div className="demo-item">2</div>
        </SwiperItem>
        <SwiperItem>
          <div className="demo-item">3</div>
        </SwiperItem>
        <SwiperItem>
          <div className="demo-item">4</div>
        </SwiperItem>
        <SwiperItem>
          <div className="demo-item">5</div>
        </SwiperItem>
        <SwiperItem>
          <div className="demo-item">6</div>
        </SwiperItem>
      </Swiper>
    </div>
  );
}

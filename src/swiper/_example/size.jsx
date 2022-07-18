import React from 'react';
import { Swiper } from 'tdesign-react';

const { SwiperItem } = Swiper;

export default function BasicSwiper() {
  return (
    <>
      <div className="tdesign-demo-block--swiper" style={{ width: '1000px' }}>
        <h3>large</h3>
        <Swiper navigation={{ size: 'large' }}>
          <SwiperItem>
            <div className="demo-item demo-large">1</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-large">2</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-large">3</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-large">4</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-large">5</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-large">6</div>
          </SwiperItem>
        </Swiper>
      </div>
      <div className="tdesign-demo-block--swiper" style={{ width: '500px', marginTop: '20px' }}>
        <h3>small</h3>
        <Swiper navigation={{ size: 'small' }}>
          <SwiperItem>
            <div className="demo-item demo-small">1</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-small">2</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-small">3</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-small">4</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-small">5</div>
          </SwiperItem>
          <SwiperItem>
            <div className="demo-item demo-small">6</div>
          </SwiperItem>
        </Swiper>
      </div>
    </>
  );
}

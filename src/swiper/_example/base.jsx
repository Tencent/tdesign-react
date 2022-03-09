import React from 'react';
import { Swiper } from 'tdesign-react';

const { SwiperItem } = Swiper;

export default function BasicSwiper() {
  return (
    <div className="tdesign-demo-block--swiper">
      <Swiper
        loop={false}
        interval={10000}
        trigger={'click'}
        stopOnHover={true}
        direction={'horizontal'}
        autoplay={false}
        height={280}
        type={'card'}
        duration={1000}
        navigation={{ placement: 'outside', type: 'bars', size: 'medium', showSlideBtn: 'always' }}
      >
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
      </Swiper>
    </div>
  );
}

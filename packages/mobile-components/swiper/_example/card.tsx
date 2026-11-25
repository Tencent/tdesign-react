import React from 'react';
import { Swiper } from 'tdesign-mobile-react';

export default function Base() {
  const imageCdn = 'https://tdesign.gtimg.com/mobile/demos';
  const imageList = [
    `${imageCdn}/swiper1.png`,
    `${imageCdn}/swiper2.png`,
    `${imageCdn}/swiper1.png`,
    `${imageCdn}/swiper2.png`,
    `${imageCdn}/swiper1.png`,
  ];

  const swiperItems = () => (
    <>
      {imageList.map((item, index) => (
        <Swiper.SwiperItem key={index}>
          <img style={{ height: '192px' }} src={item} />
        </Swiper.SwiperItem>
      ))}
    </>
  );

  return (
    <>
      <div className="tdesign-demo-block-wrap">
        <Swiper
          type="card"
          height="192px"
          interval={3000}
          duration={500}
          autoplay={true}
          defaultCurrent={1}
          previousMargin="34px"
          nextMargin="34px"
          navigation={{ type: 'dots', placement: 'outside' }}
        >
          {swiperItems()}
        </Swiper>
      </div>
      <div className="tdesign-demo-block-wrap card-height">
        <Swiper
          type="card"
          height="192px"
          interval={3000}
          duration={500}
          autoplay={true}
          defaultCurrent={1}
          previousMargin="34px"
          nextMargin="34px"
          navigation={{ type: 'dots', placement: 'outside' }}
        >
          {swiperItems()}
        </Swiper>
      </div>
      <div className="tdesign-demo-block-wrap card-height card-prev-next">
        <Swiper
          type="card"
          height="192px"
          interval={3000}
          duration={500}
          autoplay={true}
          defaultCurrent={1}
          previousMargin="34px"
          nextMargin="34px"
          navigation={{ type: 'dots', placement: 'outside' }}
        >
          {swiperItems()}
        </Swiper>
      </div>
    </>
  );
}

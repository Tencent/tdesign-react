import React from 'react';
import { Button, Swiper } from 'tdesign-mobile-react';

export default function Base() {
  const imageCdn = 'https://tdesign.gtimg.com/mobile/demos';
  const imageList = [
    `${imageCdn}/swiper1.png`,
    `${imageCdn}/swiper2.png`,
    `${imageCdn}/swiper1.png`,
    `${imageCdn}/swiper2.png`,
    `${imageCdn}/swiper1.png`,
  ];

  const [current, setCurrent] = React.useState(1);

  const swiperItems = () => (
    <>
      {imageList.map((item, index) => (
        <Swiper.SwiperItem key={index}>
          <img style={{ height: '100%' }} src={item} />
        </Swiper.SwiperItem>
      ))}
    </>
  );

  const onChange = (index: number) => {
    setCurrent(index);
  };

  const getNextIndex = (index: number) => (index + 1) % imageList.length;

  const onClickBtn = () => {
    setCurrent(getNextIndex(current));
  };

  return (
    <div className="tdesign-demo-block-wrap">
      <Swiper
        height="192px"
        interval={3000}
        duration={500}
        autoplay={false}
        current={current}
        navigation={{ type: 'dots' }}
        onChange={onChange}
      >
        {swiperItems()}
      </Swiper>
      <div className="tdesign-demo-block-row" style={{ marginTop: '10px' }}>
        <Button
          size="small"
          theme="primary"
          content={`跳转到第${getNextIndex(current) + 1}项`}
          onClick={onClickBtn}
        ></Button>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Swiper, Cell, Switch, Slider } from 'tdesign-mobile-react';
import type { SwitchValue } from 'tdesign-mobile-react';

export default function Base() {
  const imageCdn = 'https://tdesign.gtimg.com/mobile/demos';
  const imageList = [
    `${imageCdn}/swiper1.png`,
    `${imageCdn}/swiper2.png`,
    `${imageCdn}/swiper1.png`,
    `${imageCdn}/swiper2.png`,
    `${imageCdn}/swiper1.png`,
  ];

  const [autoPlay, setAutoPlay] = useState<SwitchValue>(false);
  const [interval, setInterval] = useState(4000);
  const [duration, setDuration] = useState(500);

  const onSwitchChange = (value: SwitchValue) => {
    console.log('onSwitchChange: ', value);
    setAutoPlay(value);
  };

  const onIntervalChange = (interval: number) => {
    setInterval(interval);
  };

  const onDurationChange = (duration: number) => {
    setDuration(duration);
  };

  const swiperItems = () => (
    <>
      {imageList.map((item, index) => (
        <Swiper.SwiperItem key={index}>
          <img style={{ height: '100%' }} src={item} />
        </Swiper.SwiperItem>
      ))}
    </>
  );

  return (
    <div className="tdesign-demo-block-wrap">
      <Swiper
        height="192px"
        interval={interval}
        duration={duration}
        autoplay={!!autoPlay}
        defaultCurrent={1}
        direction="vertical"
        navigation={{ type: 'dots', paginationPosition: 'right' }}
      >
        {swiperItems()}
      </Swiper>
      <Cell
        style={{ paddingLeft: '0px', paddingRight: '0px' }}
        title="自动播放"
        rightIcon={<Switch value={autoPlay} customValue={[true, false]} onChange={onSwitchChange} />}
      ></Cell>
      <div className="wrapper-base">
        <label className="__label">间隔（毫秒）</label>
        <Slider label min={1} max={5000} value={interval} onChange={onIntervalChange} />
      </div>
      <div className="wrapper-base">
        <label className="__label">持续（毫秒）</label>
        <Slider label min={1} max={2500} value={duration} onChange={onDurationChange} />
      </div>
    </div>
  );
}

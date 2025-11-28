import React, { useState } from 'react';
import { Slider, Space, Swiper, Tag } from 'tdesign-react';

const { SwiperItem } = Swiper;

const DEFAULT_SCALE = 210 / 332;

export default function BasicSwiper() {
  const [cardScale, setCardScale] = useState(DEFAULT_SCALE);

  return (
    <div className="tdesign-demo-block--swiper">
      <Space direction="vertical" size={50} style={{ width: '800px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Tag theme="primary" variant="outline">
            卡片缩放比例
          </Tag>
          <Slider<number>
            min={0}
            max={1}
            step={0.01}
            value={cardScale}
            onChange={setCardScale}
            marks={{
              [DEFAULT_SCALE]: 'Default',
            }}
          />
        </Space>
        <Swiper type="card" height={280} autoplay={false} cardScale={cardScale}>
          {Array.from({ length: 6 }, (_, i) => (
            <SwiperItem key={i + 1}>
              <div className="demo-item">{i + 1}</div>
            </SwiperItem>
          ))}
        </Swiper>
      </Space>
    </div>
  );
}

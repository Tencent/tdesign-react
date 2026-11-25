import React from 'react';
import { CountDown } from 'tdesign-mobile-react';

const time = 96 * 60 * 1000;

export default function BaseCountDown() {
  return (
    <>
      <div className="demo-count-down">
        <div className="demo-count-down-desc"> 时分秒 </div>
        <div className="demo-count-down-content">
          <CountDown time={time} />
        </div>
      </div>

      <div className="demo-count-down">
        <div className="demo-count-down-desc"> 带毫秒 </div>
        <div className="demo-count-down-content">
          <CountDown time={time} millisecond />
        </div>
      </div>

      <div className="demo-count-down">
        <div className="demo-count-down-desc"> 带方形底 </div>
        <div className="demo-count-down-content">
          <CountDown content="default" time={time} theme="square" />
        </div>
      </div>

      <div className="demo-count-down">
        <div className="demo-count-down-desc"> 带圆形底 </div>
        <div className="demo-count-down-content">
          <CountDown time={time} theme="round" />
        </div>
      </div>

      <div className="demo-count-down">
        <div className="demo-count-down-desc"> 带单位 </div>
        <div className="demo-count-down-content">
          <CountDown time={time} split-with-unit theme="round" />
        </div>
      </div>

      <div className="demo-count-down">
        <div className="demo-count-down-desc"> 无底色带单位 </div>
        <div className="demo-count-down-content">
          <CountDown className="custom" time={time} split-with-unit />
        </div>
      </div>
    </>
  );
}

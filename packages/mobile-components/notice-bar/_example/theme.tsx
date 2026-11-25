import React from 'react';
import { NoticeBar } from 'tdesign-mobile-react';

export default function ThemeDemo() {
  return (
    <>
      <div className="demo-section__desc">普通通知</div>
      <div className="demo-section__content">
        <NoticeBar visible theme="info" content="这是一条普通的通知信息" />
      </div>

      <div className="demo-section__desc">成功通知</div>
      <div className="demo-section__content">
        <NoticeBar visible theme="success" content="这是一条成功的通知信息" />
      </div>

      <div className="demo-section__desc">警示通知</div>
      <div className="demo-section__content">
        <NoticeBar visible theme="warning" content="这是一条警示的通知信息" />
      </div>

      <div className="demo-section__desc">错误通知</div>
      <div className="demo-section__content">
        <NoticeBar visible theme="error" content="这是一条错误的通知信息" />
      </div>
    </>
  );
}

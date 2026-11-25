import React from 'react';
import { Textarea } from 'tdesign-mobile-react';

export default function Events() {
  return (
    <>
      <div className="textarea-example__custom ">
        <span className="textarea-example__label">标签文字</span>
        <Textarea style={{ height: '124px' }} placeholder="请输入文字" bordered maxlength={100} indicator />
      </div>
    </>
  );
}

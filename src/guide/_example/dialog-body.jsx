import React from 'react';
import './dialog-body.css';

export default function DialogBody() {
  return (
    <div className="dialog-body">
      <img className="dialog-img" src="https://tdesign.gtimg.com/demo/demo-image-1.png" alt="demo" />
      <p>此处显示本页引导的说明文案，可按需要撰写，如内容过多可折行显示。图文也可按需自由设计。</p>
    </div>
  );
}

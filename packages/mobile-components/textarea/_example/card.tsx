import React from 'react';
import { Textarea } from 'tdesign-mobile-react';

export default function TextareaCard() {
  return (
    <div className="card textarea-example__card">
      <Textarea
        style={{ height: '156px' }}
        className="card"
        label="标签文字"
        placeholder="请输入文字"
        maxlength={500}
        indicator
      />
    </div>
  );
}

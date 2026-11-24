import React from 'react';
import { Input } from 'tdesign-mobile-react';
import { ErrorCircleFilledIcon } from 'tdesign-icons-react';

export default function Bordered() {
  return (
    <div className="input-bordered">
      <div className="input-bordered__summary">标签文字</div>
      <Input
        className="input-bordered__input"
        placeholder="请输入文字"
        borderless
        suffixIcon={<ErrorCircleFilledIcon />}
      />
    </div>
  );
}

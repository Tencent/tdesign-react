import React from 'react';
import { Button, Input } from 'tdesign-mobile-react';
import { InfoCircleFilledIcon, UserAvatarIcon } from 'tdesign-icons-react';

export default function Suffix() {
  return (
    <>
      <Input label="标签文字" placeholder="请输入文字" suffixIcon={<InfoCircleFilledIcon />} />
      <Input
        label="标签文字"
        placeholder="请输入手机号码"
        suffix={
          <Button theme="primary" size="small">
            {' 操作按钮 '}
          </Button>
        }
      />
      <Input label="标签文字" placeholder="请输入文字" suffixIcon={<UserAvatarIcon />} />
    </>
  );
}

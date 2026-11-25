import React from 'react';
import { InfoCircleFilledIcon } from 'tdesign-icons-react';
import { Button, Empty } from 'tdesign-mobile-react';

export default function ButtonEmpty() {
  return (
    <Empty
      icon={<InfoCircleFilledIcon />}
      description="描述文字"
      action={
        <Button theme="primary" size="large">
          操作按钮
        </Button>
      }
    />
  );
}

import React from 'react';
import { Empty } from 'tdesign-mobile-react';
import { InfoCircleFilledIcon } from 'tdesign-icons-react';

export default function Base() {
  return <Empty icon={<InfoCircleFilledIcon />} description="描述文字" />;
}

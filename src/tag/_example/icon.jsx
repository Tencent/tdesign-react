import React from 'react';
import { Tag, DiscountIcon } from '@tencent/tdesign-react';

export default function ThemeTagExample() {
  return (
    <Tag icon={<DiscountIcon />} theme="default">
      默认标签
    </Tag>
  );
}

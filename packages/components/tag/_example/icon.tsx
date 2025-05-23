import React from 'react';
import { Tag } from 'tdesign-react';
import { DiscountIcon } from 'tdesign-icons-react';

export default function ThemeTagExample() {
  return (
    <Tag icon={<DiscountIcon />} theme="default">
      默认标签
    </Tag>
  );
}

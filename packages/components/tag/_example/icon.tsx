import React from 'react';
import { DiscountIcon } from 'tdesign-icons-react';
import { Tag } from 'tdesign-react';

export default function ThemeTagExample() {
  return (
    <Tag icon={<DiscountIcon />} theme="default">
      默认标签
    </Tag>
  );
}

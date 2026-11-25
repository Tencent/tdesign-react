import React, { useState } from 'react';
import { DropdownItem, DropdownMenu } from 'tdesign-mobile-react';

const product = {
  value: 'all',
  options: [
    {
      value: 'all',
      label: '全部产品',
      disabled: false,
    },
    {
      value: 'new',
      label: '最新产品',
      disabled: false,
    },
    {
      value: 'hot',
      label: '最火产品',
      disabled: false,
    },
    {
      value: 'disabled',
      label: '禁用选项',
      disabled: true,
    },
  ],
};

const sorter = {
  value: 'default',
  options: [
    {
      value: 'default',
      label: '默认排序',
      disabled: false,
    },
    {
      value: 'price',
      label: '价格从高到低',
      disabled: false,
    },
  ],
};

export default function SingleDemo() {
  const [productValue, setProductValue] = useState(product.value);
  const [sorterValue, setSorterValue] = useState(sorter.value);

  return (
    <DropdownMenu>
      <DropdownItem
        options={product.options}
        value={productValue}
        placement="right"
        onChange={(value: string) => {
          setProductValue(value);
        }}
      />
      <DropdownItem
        options={sorter.options}
        value={sorterValue}
        placement="right"
        onChange={(value: string) => {
          setSorterValue(value);
        }}
      />
    </DropdownMenu>
  );
}

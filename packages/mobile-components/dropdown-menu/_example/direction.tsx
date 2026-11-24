import React, { useState } from 'react';
import { DropdownItem, DropdownMenu } from 'tdesign-mobile-react';
import { ChevronDownIcon } from 'tdesign-icons-react';

const icons = <ChevronDownIcon size="24px" />;

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

export default function DirectionDemo() {
  const [productValue, setProductValue] = useState(product.value);
  const [sorterValue, setSorterValue] = useState(sorter.value);

  return (
    <DropdownMenu direction="up">
      <DropdownItem
        options={product.options}
        value={productValue}
        icon={icons}
        onChange={(value: string) => setProductValue(value)}
      />
      <DropdownItem options={sorter.options} value={sorterValue} onChange={(value: string) => setSorterValue(value)} />
    </DropdownMenu>
  );
}

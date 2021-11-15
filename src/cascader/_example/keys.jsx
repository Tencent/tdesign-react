import React, { useState } from 'react';
import { Cascader } from 'tdesign-react';

export default function Example() {
  const [value1, setValue1] = useState([]);
  const options = [
    {
      name: '上海',
      code: '1',
      items: [
        {
          name: '黄浦区',
          code: '1.1',
        },
        {
          name: '静安区',
          code: '1.2',
        },
        {
          name: '浦东新区',
          code: '1.3',
        },
      ],
    },
    {
      name: '深圳',
      code: '2',
      items: [
        {
          name: '宝安区',
          code: '2.1',
        },
        {
          name: '南山区',
          code: '2.2',
        },
        {
          name: '福田区',
          code: '2.3',
        },
      ],
    },
  ];

  const itemStyle = {
    marginTop: '16px',
  };

  const onChange1 = (value) => {
    setValue1(value);
  };

  return (
    <div className="tdesign-demo-block-column">
      <Cascader
        style={itemStyle}
        keys={{ label: 'name', value: 'code', children: 'items' }}
        options={options}
        value={value1}
        onChange={onChange1}
        multiple
      />
    </div>
  );
}

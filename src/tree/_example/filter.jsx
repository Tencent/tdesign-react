import React, { useState } from 'react';
import { InputAdornment, Input, Tree, Space } from 'tdesign-react';

const items = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1.1',
        label: '1.1',
        children: [
          {
            value: '1.1.1',
            label: '1.1.1',
            children: [
              {
                value: '1.1.1.1',
                label: '1.1.1.1',
              },
              {
                value: '1.1.1.2',
                label: '1.1.1.2',
              },
            ],
          },
          {
            value: '1.1.2',
            label: '1.1.2',
            children: [
              {
                value: '1.1.2.1',
                label: '1.1.2.1',
              },
              {
                value: '1.1.2.2',
                label: '1.1.2.2',
              },
            ],
          },
        ],
      },
      {
        value: '1.2',
        label: '1.2',
        children: [
          {
            value: '1.2.1',
            label: '1.2.1',
            children: [
              {
                value: '1.2.1.1',
                label: '1.2.1.1',
              },
              {
                value: '1.2.1.2',
                label: '1.2.1.2',
              },
            ],
          },
          {
            value: '1.2.2',
            label: '1.2.2',
            children: [
              {
                value: '1.2.2.1',
                label: '1.2.2.1',
              },
              {
                value: '1.2.2.2',
                label: '1.2.2.2',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: '2',
    children: [
      {
        value: '2.1',
        label: '2.1',
      },
      {
        value: '2.2',
        label: '2.2',
      },
    ],
  },
];

export default () => {
  const [filterText, setFilterText] = useState('');
  const [filterText2, setFilterText2] = useState('');

  const filterByText = (node) => {
    const rs = node.data.label.indexOf(filterText) >= 0;
    return rs;
  };

  const filterByText2 = (node) => {
    const rs = node.data.label.indexOf(filterText2) >= 0;
    return rs;
  };
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <InputAdornment prepend="filter:">
        <Input value={filterText} onChange={setFilterText} />
      </InputAdornment>
      <Tree
        data={items}
        allowFoldNodeOnFilter={true}
        expandOnClickNode
        hover
        line
        filter={filterText ? filterByText : null}
      />
      <InputAdornment prepend="filter:">
        <Input value={filterText2} onChange={setFilterText2} />
      </InputAdornment>
      <Tree
        data={items}
        allowFoldNodeOnFilter={false}
        expandOnClickNode
        hover
        line
        filter={filterText2 ? filterByText2 : null}
      />
    </Space>
  );
};

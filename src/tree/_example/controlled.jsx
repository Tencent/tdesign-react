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
    label: '2 这个节点不允许展开, 不允许激活',
    checkable: false,
    children: [
      {
        value: '2.1',
        label: '2.1 这个节点不允许选中',
        checkable: false,
      },
      {
        value: '2.2',
        label: '2.2',
        checkable: false,
      },
    ],
  },
];

const formatArrToString = (list) => {
  let arr = [];
  if (Array.isArray(list)) {
    arr = list;
  }
  return arr.join(', ');
};

export default () => {
  const [checked, setChecked] = useState(['1.1.1.1', '1.1.1.2']);
  const [expanded, setExpanded] = useState(['1', '1.1', '1.1.1', '2']);
  const [actived, setActived] = useState(['2']);

  const allChecked = formatArrToString(checked);
  const allExpanded = formatArrToString(expanded);
  const allActived = formatArrToString(actived);

  const handleClick = (context) => {
    console.info('onClick:', context);
  };

  const handleChange = (vals, context) => {
    console.info('onChange:', vals, context);
    const checked = vals.filter((val) => val !== '2.1');
    console.info('节点 2.1 不允许选中');
    setChecked(checked);
  };

  const handleExpand = (vals, context) => {
    console.info('onExpand:', vals, context);
    const expanded = vals.filter((val) => val !== '2');
    console.info('节点 2 不允许展开');
    setExpanded(expanded);
  };

  const handleActive = (vals, context) => {
    console.info('onActive:', vals, context);
    const actived = vals.filter((val) => val !== '2');
    console.info('节点 2 不允许激活');
    setActived(actived);
  };

  return (
    <Space direction="vertical">
      <InputAdornment prepend="checked:">
        <Input value={allChecked} />
      </InputAdornment>
      <InputAdornment prepend="expanded:">
        <Input value={allExpanded} />
      </InputAdornment>
      <InputAdornment prepend="actived:">
        <Input value={allActived} />
      </InputAdornment>
      <Tree
        data={items}
        checkable
        activable
        expandOnClickNode={false}
        activeMultiple={false}
        expanded={expanded}
        actived={actived}
        value={checked}
        valueMode="onlyLeaf"
        onExpand={handleExpand}
        onClick={handleClick}
        onActive={handleActive}
        onChange={handleChange}
      />
    </Space>
  );
};

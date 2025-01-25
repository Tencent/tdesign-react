import React, { useEffect, useState } from 'react';
import { InputAdornment, Input, Tree, Space, InputProps } from 'tdesign-react';

import type { TreeProps } from 'tdesign-react';
import { TreeNodeValue } from '../../cascader/interface';

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
    checkable: false,
    children: [
      {
        value: '2.1',
        label: '2.1',
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

const formatArrToString = (list: TreeNodeValue[]) => {
  let arr: TreeNodeValue[] = [];
  if (Array.isArray(list)) {
    arr = list;
  }
  return arr.map((val) => `{${val}}`).join(', ');
};

const getValueFromString = (val: string) => {
  const arr = val.split(',');
  const vals: string[] = [];
  arr
    .map((str) => str.trim())
    .forEach((tag) => {
      const match = /^\{([^{}]+)\}$/.exec(tag);
      if (match && match[1]) {
        vals.push(match[1]);
      }
    });
  return vals;
};

export default () => {
  const [checked, setChecked] = useState<TreeNodeValue[]>(['1.1.1.1', '1.1.1.2']);
  const [expanded, setExpanded] = useState<TreeNodeValue[]>(['1', '1.1', '1.1.1', '2']);
  const [actived, setActived] = useState<TreeNodeValue[]>(['2']);

  const [allCheckedInput, setAllCheckedInput] = useState(() => formatArrToString(checked));
  const [allExpandedInput, setAllExpandedInput] = useState(() => formatArrToString(expanded));
  const [allActivedInput, setAllActivedInput] = useState(() => formatArrToString(actived));

  const allChecked = formatArrToString(checked);
  const allExpanded = formatArrToString(expanded);
  const allActived = formatArrToString(actived);

  // 因为是字符串，直接通过 useEffect 同步
  useEffect(() => {
    setAllCheckedInput(allChecked);
  }, [allChecked]);

  useEffect(() => {
    setAllExpandedInput(allExpanded);
  }, [allExpanded]);

  useEffect(() => {
    setAllActivedInput(allActived);
  }, [allActived]);

  const handleClick: TreeProps['onClick'] = (context) => {
    console.info('onClick:', context);
  };
  const handleChange: TreeProps['onChange'] = (vals, context) => {
    console.info('onChange:', vals, context);
    const checked = vals.filter((val) => val !== '2.1');
    console.info('节点 2.1 不允许选中');
    setChecked(checked);
  };
  const handleExpand: TreeProps['onExpand'] = (vals, context) => {
    console.info('onExpand:', vals, context);
    const expanded = vals.filter((val) => val !== '2');
    console.info('节点 2 不允许展开');
    setExpanded(expanded);
  };
  const handleActive: TreeProps['onActive'] = (vals, context) => {
    console.info('onActive:', vals, context);
    const actived = vals.filter((val) => val !== '2');
    console.info('节点 2 不允许激活');
    setActived(actived);
  };

  const handleAllCheckedChange: InputProps['onChange'] = (val) => {
    console.log('checked input on change', val);
    setAllCheckedInput(val);
  };

  const handleAllCheckedSubmit = () => {
    console.log('submit checked', allCheckedInput);
    const vals = getValueFromString(allCheckedInput);
    setChecked(vals);
  };

  const handleAllExpandedChange: InputProps['onChange'] = (val) => {
    console.log('expanded input on change', val);
    setAllExpandedInput(val);
  };

  const handleAllExpandedSubmit = () => {
    console.log('submit expanded', allExpandedInput);
    const vals = getValueFromString(allExpandedInput);
    setExpanded(vals);
  };

  const handleAllActivedInput: InputProps['onChange'] = (val) => {
    console.log('actived input on change', val);
    setAllActivedInput(val);
  };

  const handleAllActivedSubmit = () => {
    console.log('submit actived', allActivedInput);
    const vals = getValueFromString(allActivedInput);
    setActived(vals);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <InputAdornment prepend="checked:">
        <Input
          value={allCheckedInput}
          onChange={handleAllCheckedChange}
          onBlur={handleAllCheckedSubmit}
          onEnter={handleAllCheckedSubmit}
        />
      </InputAdornment>
      <InputAdornment prepend="expanded:">
        <Input
          value={allExpandedInput}
          onChange={handleAllExpandedChange}
          onBlur={handleAllExpandedSubmit}
          onEnter={handleAllExpandedSubmit}
        />
      </InputAdornment>
      <InputAdornment prepend="actived:">
        <Input
          value={allActivedInput}
          onChange={handleAllActivedInput}
          onBlur={handleAllActivedSubmit}
          onEnter={handleAllActivedSubmit}
        />
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

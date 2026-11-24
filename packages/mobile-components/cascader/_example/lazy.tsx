import React, { useCallback, useMemo, useState } from 'react';

import { Cascader, Cell, Toast } from 'tdesign-mobile-react';

const mockData: Record<string, Array<{ value: string; label: string; children?: any[] }>> = {
  '440300': [
    { value: '440304', label: '福田区', children: [] },
    { value: '440303', label: '罗湖区', children: [] },
    { value: '440305', label: '南山区', children: [] },
    { value: '440306', label: '宝安区', children: [] },
    { value: '440307', label: '龙岗区', children: [] },
    { value: '440308', label: '盐田区', children: [] },
    { value: '440309', label: '龙华区', children: [] },
    { value: '440310', label: '坪山区', children: [] },
    { value: '440311', label: '光明区', children: [] },
  ],
};

export default function LoadDemo() {
  const [visible, setVisible] = useState(false);
  const [note, setNote] = useState('请选择地址');

  const options = useMemo(
    () => [
      {
        label: '深圳市',
        value: '440300',
        children: true,
      },
    ],
    [],
  );

  const showToast = useCallback(() => {
    Toast({
      theme: 'loading',
      message: '加载中...',
      direction: 'column',
      placement: 'bottom',
      duration: 10000,
      preventScrollThrough: true,
    });
  }, []);

  const loadOptions = useCallback(
    (node: any) =>
      new Promise<any[]>((resolve) => {
        showToast();
        setTimeout(() => {
          resolve(mockData[node.value] || []);
          Toast.clear();
        }, 500);
      }),
    [showToast],
  );

  return (
    <>
      <Cell
        title="地址"
        note={note}
        arrow
        onClick={() => {
          setVisible(true);
        }}
      />
      <Cascader
        title="选择地址"
        visible={visible}
        options={options}
        load={loadOptions}
        onPick={(context) => {
          console.log(`level: ${context.level}, value: ${context.value}, index: ${context.index}`);
        }}
        onChange={(_, selectedOptions) => {
          setNote(selectedOptions?.map((item) => item.label).join('/'));
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
        }}
      />
    </>
  );
}

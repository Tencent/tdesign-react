import React, { useState } from 'react';
import { Descriptions, Radio, Space, Textarea } from 'tdesign-react';

type ClearablePosition = 'top' | 'center' | 'bottom';

export default function TextareaClearableExample() {
  const [position, setPosition] = useState<ClearablePosition>('top');
  const [iconValue, setIconValue] = useState('图标清空');
  const [textValue, setTextValue] = useState('文字清空');

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Radio.Group
        variant="default-filled"
        value={position}
        onChange={(value: ClearablePosition) => setPosition(value)}
      >
        <Radio.Button value="top">top</Radio.Button>
        <Radio.Button value="center">center</Radio.Button>
        <Radio.Button value="bottom">bottom</Radio.Button>
      </Radio.Group>
      <Descriptions
        size="small"
        column={1}
        tableLayout="fixed"
        colon={false}
        style={{ width: '100%' }}
        labelStyle={{ width: 36, paddingRight: 8, verticalAlign: 'middle' }}
        contentStyle={{ width: '100%', paddingLeft: 0 }}
        items={[
          {
            label: 'icon',
            content: (
              <Textarea
                style={{ width: '100%' }}
                placeholder="图标清空"
                clearable={{ position, type: 'icon' }}
                value={iconValue}
                onChange={setIconValue}
              />
            ),
          },
          {
            label: 'text',
            content: (
              <Textarea
                style={{ width: '100%' }}
                placeholder="文字清空"
                clearable={{ position, type: 'text' }}
                value={textValue}
                onChange={setTextValue}
              />
            ),
          },
        ]}
      />
    </Space>
  );
}

import React, { useState } from 'react';
import { Descriptions, Radio, Space, Textarea } from 'tdesign-react';

type ClearablePosition = 'top' | 'center' | 'bottom';

export default function TextareaClearableExample() {
  const [position, setPosition] = useState<ClearablePosition>('top');
  const [iconValue, setIconValue] = useState('图标清空');
  const [textValue, setTextValue] = useState('文字清空');

  return (
    <Space direction="vertical">
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
        items={[
          {
            label: 'icon',
            content: <Textarea value={iconValue} clearable={{ position, type: 'icon' }} onChange={setIconValue} />,
          },
          {
            label: 'text',
            content: <Textarea value={textValue} clearable={{ position, type: 'text' }} onChange={setTextValue} />,
          },
        ]}
      />
    </Space>
  );
}

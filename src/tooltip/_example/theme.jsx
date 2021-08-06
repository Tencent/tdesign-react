import React from 'react';
import { Button, Tooltip } from '@tencent/tdesign-react';

export default function Cumstomize() {
  return (
    <div className="tdesign-tooltip-demo">
      <Tooltip content="文字提示仅展示文本内容">
        <Button>default</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" theme="primary">
        <Button>primary</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" theme="success">
        <Button>success</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" theme="danger">
        <Button>danger</Button>
      </Tooltip>
      <Tooltip content="文字提示仅展示文本内容" theme="warning">
        <Button>warning</Button>
      </Tooltip>
    </div>
  );
}

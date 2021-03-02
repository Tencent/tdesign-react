import React from 'react';
import { Button, Tooltip } from '@tencent/tdesign-react';

export default function Cumstomize() {
  return (
    <div className="tdesign-tooltip-demo">
      <Tooltip content="这是tooltip内容" placement="top" showArrow destroyOnHide>
        <Button>top</Button>
      </Tooltip>
      <Tooltip content="这是tooltip内容" placement="bottom" showArrow destroyOnHide>
        <Button>bottom</Button>
      </Tooltip>
      <Tooltip content="这是tooltip内容" placement="left" showArrow destroyOnHide>
        <Button>left</Button>
      </Tooltip>
      <Tooltip content="这是tooltip内容" placement="right" showArrow destroyOnHide>
        <Button>right</Button>
      </Tooltip>
    </div>
  );
}

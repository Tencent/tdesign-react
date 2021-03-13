import React from 'react';
import { Button, Tooltip } from '@tencent/tdesign-react';
import './placements.css';
export default function Placements() {
  return (
    <div className="container">
      <Tooltip content="这是Tooltip内容" placement="top" showArrow destroyOnHide>
        <Button className="placement-top">top</Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容 top-left" placement="top-left" showArrow destroyOnHide>
        <Button className="placement-top-left">top-left</Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容top-right" placement="top-right" showArrow destroyOnHide>
        <Button className="placement-top-right">top-right</Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容" placement="bottom" showArrow destroyOnHide>
        <Button className="placement-bottom">bottom</Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容 bottom-left" placement="bottom-left" showArrow destroyOnHide>
        <Button className="placement-bottom-left">bottom-left</Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容 bottom-right" placement="bottom-right" showArrow destroyOnHide>
        <Button className="placement-bottom-right">bottom-right</Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容" placement="left" showArrow destroyOnHide>
        <Button className="placement-left">left</Button>
      </Tooltip>
      <Tooltip
        content="这是Tooltip内容   left-top"
        placement="left-top"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnHide
      >
        <Button className="placement-left-top">left-top</Button>
      </Tooltip>
      <Tooltip
        content="这是Tooltip内容 left-bottom"
        placement="left-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnHide
      >
        <Button className="placement-left-bottom">left-bottom</Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容" placement="right" showArrow destroyOnHide>
        <Button className="placement-right">right</Button>
      </Tooltip>
      <Tooltip
        content="这是Tooltip内容 right-top"
        placement="right-top"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnHide
      >
        <Button className="placement-right-top">right-top</Button>
      </Tooltip>
      <Tooltip
        content="这是Tooltip内容 right-bottom"
        placement="right-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnHide
      >
        <Button className="placement-right-bottom">right-bottom</Button>
      </Tooltip>
    </div>
  );
}

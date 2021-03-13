import React from 'react';
import { Button, Popup } from '@tencent/tdesign-react';
import './placements.css';
export default function Placements() {
  return (
    <div className="container">
      <Popup content="这是popup内容" placement="top" showArrow destroyOnHide>
        <Button className="placement-top">top</Button>
      </Popup>
      <Popup content="这是popup内容 top-left" placement="top-left" showArrow destroyOnHide>
        <Button className="placement-top-left">top-left</Button>
      </Popup>
      <Popup content="这是popup内容top-right" placement="top-right" showArrow destroyOnHide>
        <Button className="placement-top-right">top-right</Button>
      </Popup>
      <Popup content="这是popup内容" placement="bottom" showArrow destroyOnHide>
        <Button className="placement-bottom">bottom</Button>
      </Popup>
      <Popup content="这是popup内容 bottom-left" placement="bottom-left" showArrow destroyOnHide>
        <Button className="placement-bottom-left">bottom-left</Button>
      </Popup>
      <Popup content="这是popup内容 bottom-right" placement="bottom-right" showArrow destroyOnHide>
        <Button className="placement-bottom-right">bottom-right</Button>
      </Popup>
      <Popup content="这是popup内容" placement="left" showArrow destroyOnHide>
        <Button className="placement-left">left</Button>
      </Popup>
      <Popup
        content="这是popup内容   left-top"
        placement="left-top"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnHide
      >
        <Button className="placement-left-top">left-top</Button>
      </Popup>
      <Popup
        content="这是popup内容 left-bottom"
        placement="left-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnHide
      >
        <Button className="placement-left-bottom">left-bottom</Button>
      </Popup>
      <Popup content="这是popup内容" placement="right" showArrow destroyOnHide>
        <Button className="placement-right">right</Button>
      </Popup>
      <Popup
        content="这是popup内容 right-top"
        placement="right-top"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnHide
      >
        <Button className="placement-right-top">right-top</Button>
      </Popup>
      <Popup
        content="这是popup内容 right-bottom"
        placement="right-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnHide
      >
        <Button className="placement-right-bottom">right-bottom</Button>
      </Popup>

      {/* <Popup placement="left" showArrow content="这是一个弹出框">
        <Button>Left</Button>
      </Popup>
      <Popup placement="top" showArrow content="这是一个弹出框">
        <Button>Top</Button>
      </Popup>
      <Popup placement="bottom" showArrow content="这是一个弹出框">
        <Button>Bottom</Button>
      </Popup>
      <Popup placement="right" showArrow content="这是一个弹出框">
        <Button>Right</Button>
      </Popup>
      <Popup
        placement="left-top"
        showArrow
        content="这是一个弹出框这是一个弹出框这是一个  \n弹出框这是一个弹出框这是一个弹出框"
        overlayStyle={{ width: '100px' }}
      >
        <Button>Left</Button>
      </Popup>
      <Popup
        placement="left-bottom"
        showArrow
        content="这是一个弹出框这是一个弹出框这是一个  \n弹出框这是一个弹出框这是一个弹出框"
        overlayStyle={{ width: '100px' }}
      >
        <Button>Left</Button>
      </Popup> */}
    </div>
  );
}

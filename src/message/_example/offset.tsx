import React, { useState } from 'react';
import { Button, MessagePlugin, Input, Space } from 'tdesign-react';

const placementStyle = {
  position: 'relative',
  margin: '0 auto',
  width: '500px',
  height: '260px',
};
const placementCenterStyle = {
  position: 'absolute',
  right: '42%',
  bottom: '42%',
};
const placementTopStyle = {
  position: 'absolute',
  top: '0',
  left: '42%',
};
const placementTopLeftStyle = {
  position: 'absolute',
  top: '0',
  left: '70px',
};
const placementTopRightStyle = {
  position: 'absolute',
  top: '0',
  right: '70px',
};
const placementBottomStyle = {
  position: 'absolute',
  bottom: '0',
  left: '42%',
};
const placementBottomLeftStyle = {
  position: 'absolute',
  bottom: '0',
  left: '70px',
};
const placementBottomRightStyle = {
  position: 'absolute',
  bottom: '0',
  right: '70px',
};
const placementLeftStyle = {
  position: 'absolute',
  left: '0',
  top: '42%',
};
const placementRightStyle = {
  position: 'absolute',
  right: '0',
  top: '42%',
};

export default function () {
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  return (
    <Space direction="vertical">
      <Space>
        <Input
          theme="column"
          style={{ width: 200 }}
          placeholder={'请输入横向偏移量'}
          value={offsetX}
          onChange={(value) => {
            setOffsetX(value);
          }}
        />
        <Input
          theme="column"
          style={{ width: 200, marginLeft: 16 }}
          placeholder={'请输入纵向偏移量'}
          value={offsetY}
          onChange={(value) => {
            setOffsetY(value);
          }}
        />
      </Space>
      <Space style={placementStyle}>
        <Button
          style={placementCenterStyle}
          onClick={() => {
            MessagePlugin.info({
              content: '用户表示普通操作信息提示',
              placement: 'center',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          center
        </Button>
        <Button
          style={placementTopStyle}
          onClick={() => {
            MessagePlugin.info({
              content: '用户表示普通操作信息提示',
              placement: 'top',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          top
        </Button>
        <Button
          style={placementLeftStyle}
          onClick={() => {
            MessagePlugin.info({
              content: '用户表示普通操作信息提示',
              placement: 'left',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          left
        </Button>
        <Button
          style={placementRightStyle}
          onClick={() => {
            MessagePlugin.info({
              content: '用户表示普通操作信息提示',
              placement: 'right',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          right
        </Button>
        <Button
          style={placementBottomStyle}
          onClick={() => {
            MessagePlugin.info({
              content: '用户表示普通操作信息提示',
              placement: 'bottom',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          bottom
        </Button>
        <Button
          style={placementTopLeftStyle}
          onClick={() => {
            MessagePlugin.info({
              content: '用户表示普通操作信息提示',
              placement: 'top-left',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          top-left
        </Button>
        <Button
          style={placementTopRightStyle}
          onClick={() => {
            MessagePlugin.info({
              content: '用户表示普通操作信息提示',
              placement: 'top-right',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          top-right
        </Button>
        <Button
          style={placementBottomLeftStyle}
          onClick={() => {
            MessagePlugin.info({
              content: '用户表示普通操作信息提示',
              placement: 'bottom-left',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          bottom-left
        </Button>
        <Button
          style={placementBottomRightStyle}
          onClick={() => {
            MessagePlugin.info({
              content: '用户表示普通操作信息提示',
              placement: 'bottom-right',
              offset: [Number(offsetX), Number(offsetY)],
            });
          }}
        >
          bottom-right
        </Button>
      </Space>
    </Space>
  );
}

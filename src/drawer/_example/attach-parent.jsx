import React, { useState } from 'react';
import { Drawer, Radio, Button, Space } from 'tdesign-react';

export default function () {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState('right');
  const [mode, setMode] = useState('push');

  const handleClick = () => {
    setVisible(true);
  };
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <div
      id="demo-container"
      style={{
        position: 'relative',
        height: '400px',
        padding: '48px',
        overflow: 'hidden',
        background: '#fafafa',
        border: '1px solid #ebedf0',
        borderRadius: '2px',
      }}
    >
      <Space direction="vertical">
        <p>渲染在当前元素中。</p>
        <div>
          <span>抽屉弹出方向：</span>
          <Radio.Group value={placement} onChange={(value) => setPlacement(value)}>
            <Radio.Button value="left">左侧</Radio.Button>
            <Radio.Button value="right">右侧</Radio.Button>
            <Radio.Button value="top">上方</Radio.Button>
            <Radio.Button value="bottom">下方</Radio.Button>
          </Radio.Group>
        </div>

        <div>
          <span>抽屉弹出模式：</span>
          <Radio.Group value={mode} onChange={(value) => setMode(value)}>
            <Radio.Button value="push">push</Radio.Button>
            <Radio.Button value="overlay">overlay</Radio.Button>
          </Radio.Group>
        </div>

        <div>
          <Button theme="primary" onClick={handleClick}>
            Open
          </Button>
        </div>

        <Drawer
          showInAttachedElement
          placement={placement}
          header="Drawer"
          visible={visible}
          onClose={handleClose}
          mode={mode}
          attach="#demo-container"
        >
          <p>This is a drawer</p>
        </Drawer>
      </Space>
    </div>
  );
}

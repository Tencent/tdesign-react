import React from 'react';
import { Anchor } from 'tdesign-react';

const { AnchorItem } = Anchor;

const cursorStyle = {
  width: '10px',
  height: '10px',
  backgroundColor: '#0052D9',
  position: 'absolute',
  borderRadius: '50%',
  left: '50%',
  marginLeft: '-5px',
  top: '50%',
  marginTop: '-5px',
};

export default function AnchorBase() {
  return (
    <div style={{ display: 'flex' }}>
      <Anchor targetOffset={150} cursor={<div style={cursorStyle}></div>}>
        <AnchorItem href="#基础锚点" title="基础锚点" />
        <AnchorItem href="#多级锚点" title="多级锚点" />
        <AnchorItem href="#指定容器锚点" title="指定容器锚点" />
        <AnchorItem href="#特定交互锚点" title="特定交互锚点" />
        <AnchorItem href="#尺寸" title="尺寸"></AnchorItem>
      </Anchor>
    </div>
  );
}

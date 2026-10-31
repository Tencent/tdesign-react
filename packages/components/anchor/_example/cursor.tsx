import React from 'react';
import { Anchor } from 'tdesign-react';

const { AnchorItem } = Anchor;

const cursorStyle: React.CSSProperties = {
  width: '10px',
  height: '10px',
  backgroundColor: '#0052D9',
  position: 'absolute',
  borderRadius: '50%',
  left: '50%',
  marginLeft: '-5px',
  top: '50%',
  marginTop: '-5px',
  zIndex: 2,
};

export default function AnchorBase() {
  return (
    <>
      <Anchor
        direction="horizontal"
        targetOffset={0}
        container="#anchor-container"
        cursor={<div style={cursorStyle}></div>}
      >
        <AnchorItem href="#content-1" title="基础锚点" />
        <AnchorItem href="#content-2" title="多级锚点" />
        <AnchorItem href="#content-3" title="指定容器锚点" />
        <AnchorItem href="#content-4" title="特定交互锚点" />
      </Anchor>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <Anchor targetOffset={0} container="#anchor-container" cursor={<div style={cursorStyle}></div>}>
          <AnchorItem href="#content-1" title="基础锚点" />
          <AnchorItem href="#content-2" title="多级锚点" />
          <AnchorItem href="#content-3" title="指定容器锚点" />
          <AnchorItem href="#content-4" title="特定交互锚点" />
        </Anchor>

        <div
          id="anchor-container"
          style={{ width: '100%', height: '200px', overflow: 'auto', textAlign: 'center', fontSize: '22px' }}
        >
          <div id="content-1" style={{ background: '#DFEFFF', lineHeight: '100px' }}>
            content-1
          </div>
          <div id="content-2" style={{ background: '#BFDBF7', lineHeight: '100px' }}>
            content-2
          </div>
          <div id="content-3" style={{ background: '#9BC5F2', lineHeight: '100px' }}>
            content-3
          </div>
          <div id="content-4" style={{ background: '#7BAFED', lineHeight: '100px' }}>
            content-4
          </div>
          <div id="content-5" style={{ background: '#5C99EB', lineHeight: '100px' }}>
            content-5
          </div>
        </div>
      </div>
    </>
  );
}

import React from 'react';
import { StickyTool, Space } from 'tdesign-react';
import { ChatIcon, AddIcon, QrcodeIcon } from 'tdesign-icons-react';

const { StickyItem } = StickyTool;

export default function Shape() {
  const handleClick = (context) => {
    console.log('click', context);
  };
  const handleHover = (context) => {
    console.log('hover', context);
  };

  return (
    <Space>
      <StickyTool
        style={{ position: 'relative', overflow: 'hidden' }}
        offset={[-500, -24]}
        onClick={handleClick}
        onHover={handleHover}
      >
        <StickyItem label="chat" icon={<ChatIcon />}></StickyItem>
        <StickyItem label="add" icon={<AddIcon />}></StickyItem>
        <StickyItem
          label="qrcode"
          icon={<QrcodeIcon />}
          popup={<img alt="TDesign Logo" width="120" height="120" src="https://tdesign.gtimg.com/site/site.jpg" />}
          popupProps={{ overlayInnerStyle: { padding: '4px', height: '128px' } }}
        ></StickyItem>
      </StickyTool>
      <StickyTool
        style={{ position: 'relative', overflow: 'hidden' }}
        shape="round"
        offset={[-300, -24]}
        onClick={handleClick}
        onHover={handleHover}
      >
        <StickyItem label="chat" icon={<ChatIcon />}></StickyItem>
        <StickyItem label="add" icon={<AddIcon />}></StickyItem>
        <StickyItem
          label="qrcode"
          icon={<QrcodeIcon />}
          popup={<img alt="TDesign Logo" width="120" height="120" src="https://tdesign.gtimg.com/site/site.jpg" />}
          popupProps={{ overlayInnerStyle: { padding: '4px', height: '128px' } }}
        ></StickyItem>
      </StickyTool>
    </Space>
  );
}

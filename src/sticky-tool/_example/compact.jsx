import React from 'react';
import { StickyTool, Space } from 'tdesign-react';
import { ChatIcon, AddIcon, QrcodeIcon } from 'tdesign-icons-react';

const { StickyItem } = StickyTool;

export default function Compact() {
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
        type="compact"
        offset={[-500, -24]}
        onClick={handleClick}
        onHover={handleHover}
      >
        <StickyItem icon={<ChatIcon />} popup="chat"></StickyItem>
        <StickyItem icon={<AddIcon />} popup="add"></StickyItem>
        <StickyItem
          icon={<QrcodeIcon />}
          popup={<img alt="TDesign Logo" width="120" height="120" src="https://tdesign.gtimg.com/site/site.jpg" />}
          popupProps={{ overlayInnerStyle: { padding: '4px', height: '128px' } }}
        ></StickyItem>
      </StickyTool>
    </Space>
  );
}

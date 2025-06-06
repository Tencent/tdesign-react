import React from 'react';
import { StickyTool, Space } from 'tdesign-react';
import { ChatIcon, AddIcon, QrcodeIcon } from 'tdesign-icons-react';

import type { StickyToolProps } from 'tdesign-react';

const { StickyItem } = StickyTool;

export default function Shape() {
  const handleClick: StickyToolProps['onClick'] = (context) => {
    console.log('click', context);
  };
  const handleHover: StickyToolProps['onHover'] = (context) => {
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
          popupProps={{
            overlayInnerStyle: { padding: '4px', height: '128px' },
            overlayClassName: 'sticky-item-custom-overlay-class',
            overlayInnerClassName: 'sticky-item-custom-overlay-inner-class',
          }}
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
          popupProps={{
            overlayStyle: { fontWeight: 'normal' },
            overlayInnerStyle: { padding: '4px', height: '128px' },
            overlayClassName: 'sticky-item-custom-overlay-class',
            overlayInnerClassName: 'sticky-item-custom-overlay-inner-class',
          }}
        ></StickyItem>
      </StickyTool>
    </Space>
  );
}

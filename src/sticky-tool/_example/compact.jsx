import React from 'react';
import { StickyTool } from 'tdesign-react';
import { ChatIcon, AddIcon, SearchIcon } from 'tdesign-icons-react';
import Space from 'tdesign-react/space/Space';

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
        <StickyItem label="chat" icon={<ChatIcon />} popup="chat"></StickyItem>
        <StickyItem
          label={<div>add</div>}
          icon={<AddIcon />}
          trigger="click"
          popup="add"
          popupProps={{ placement: 'bottom' }}
        ></StickyItem>
        <StickyItem
          label={<div>search</div>}
          icon={<SearchIcon />}
          popup={<img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />}
        ></StickyItem>
      </StickyTool>
    </Space>
  );
}

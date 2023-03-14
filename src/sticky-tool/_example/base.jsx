import React, { useState } from 'react';
import { StickyTool } from 'tdesign-react';
import { AddIcon, SearchIcon } from 'tdesign-icons-react';

const { StickyItem } = StickyTool;

export default function SingleSelect() {
  const [value, setValue] = useState('');
  const onChange = (value) => {
    setValue(value);
  };

  const handleClick = (context) => {
    console.log('click', context);
  };
  const handleHover = (context) => {
    console.log('hover', context);
  };

  return (
    <StickyTool
      offset={[10, 10]}
      placement="right-center"
      popup-props={{ placement: 'right' }}
      width="60"
      onClick={handleClick}
      onHover={handleHover}
    >
      <StickyItem label="添加" popup="666">
        <div slot="icon">
          <AddIcon />
        </div>
      </StickyItem>
      <StickyItem
        label={<div style={{ color: 'red' }}>搜索</div>}
        icon={<SearchIcon />}
        trigger="click"
        popup={<img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png"></img>}
        popup-props={{ placement: 'bottom' }}
      ></StickyItem>
      <StickyItem icon={<SearchIcon />}>
        <div slot="label">搜索</div>
        <div slot="popup">
          <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />
        </div>
      </StickyItem>
    </StickyTool>
  );
}

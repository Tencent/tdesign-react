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
    <>
      <StickyTool
        shape="round"
        offset={[10, 10]}
        placement="right-center"
        popupProps={{ placement: 'right' }}
        width={60}
        onClick={handleClick}
        onHover={handleHover}
      >
        <StickyItem label="添加" icon={<AddIcon />} popup="666"></StickyItem>
        <StickyItem
          label={<div style={{ color: 'red' }}>搜索</div>}
          icon={<SearchIcon />}
          trigger="click"
          popup={<img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png"></img>}
          popupProps={{ placement: 'bottom' }}
        ></StickyItem>
        <StickyItem
          label={<div>搜索</div>}
          icon={<SearchIcon />}
          popup={<img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />}
        ></StickyItem>
      </StickyTool>
      <StickyTool
        offset={[90, 10]}
        placement="right-center"
        popupProps={{ placement: 'right' }}
        width={90}
        onClick={handleClick}
        onHover={handleHover}
      >
        <StickyItem label="添加" icon={<AddIcon />} popup="666"></StickyItem>
        <StickyItem
          label={<div style={{ color: 'red' }}>搜索</div>}
          icon={<SearchIcon />}
          trigger="click"
          popup={<img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png"></img>}
          popupProps={{ placement: 'bottom' }}
        ></StickyItem>
        <StickyItem
          label={<div>搜索</div>}
          icon={<SearchIcon />}
          popup={<img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />}
        ></StickyItem>
      </StickyTool>
      <StickyTool
        type="compact"
        offset={[200, 10]}
        placement="right-center"
        popupProps={{ placement: 'right' }}
        onClick={handleClick}
        onHover={handleHover}
      >
        <StickyItem label="添加" icon={<AddIcon />} popup="666"></StickyItem>
        <StickyItem
          label={<div style={{ color: 'red' }}>搜索</div>}
          icon={<SearchIcon />}
          trigger="click"
          popup={<img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png"></img>}
          popupProps={{ placement: 'bottom' }}
        ></StickyItem>
        <StickyItem
          label={<div>搜索</div>}
          icon={<SearchIcon />}
          popup={<img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />}
        ></StickyItem>
      </StickyTool>
    </>
  );
}
